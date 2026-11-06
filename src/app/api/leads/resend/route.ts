import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

/** Versión de Graph API usada también por scripts/src/providers/whatsapp.js. */
const GRAPH_VERSION = 'v19.0';

interface ResendBody {
  phone?: string;
  name?: string;
  nota?: string;
  template?: string;
}

/**
 * Reenvía la propuesta B2B de un lead por WhatsApp Business Cloud API (es_MX).
 * 1) Intenta plantilla oficial (obligatoria fuera de la ventana de 24 h).
 * 2) Falla a texto libre (dentro de la ventana de 24 h).
 * 3) Marca `estado_propuesta = 'enviada'` en la tabla `leads` (upsert por phone,
 *    equivalente al `upsertLead` del CLI en scripts/src/providers/supabase.js).
 */
export async function POST(req: NextRequest) {
  // Fail closed: only a verified Supabase administrator may send messages.
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const allowedIds = (process.env.TROPI_ADMIN_USER_IDS ?? '').split(',').map((id) => id.trim()).filter(Boolean);
  if (!url || !anonKey || allowedIds.length === 0) {
    return NextResponse.json({ ok: false, error: 'Administración no configurada.' }, { status: 503 });
  }
  const authHeader = req.headers.get('authorization') ?? '';
  const accessToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
  if (!accessToken) {
    return NextResponse.json({ ok: false, error: 'Autenticación requerida.' }, { status: 401 });
  }
  const authClient = createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: authData, error: authError } = await authClient.auth.getUser(accessToken);
  if (authError || !authData.user) {
    return NextResponse.json({ ok: false, error: 'Sesión inválida.' }, { status: 401 });
  }
  if (!allowedIds.includes(authData.user.id)) {
    return NextResponse.json({ ok: false, error: 'Acceso denegado.' }, { status: 403 });
  }

  const body = (await req.json().catch(() => ({}))) as ResendBody;
  const phone = body.phone?.trim();
  if (!phone) {
    return NextResponse.json(
      { ok: false, error: 'El campo phone (E.164) es obligatorio.' },
      { status: 400 },
    );
  }

  const token = process.env.WHATSAPP_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (!token || !phoneNumberId) {
    return NextResponse.json(
      {
        ok: false,
        configurado: false,
        error:
          'WHATSAPP_TOKEN / WHATSAPP_PHONE_NUMBER_ID no están configurados en el servidor (.env).',
      },
      { status: 501 },
    );
  }

  const template =
    body.template?.trim() ||
    process.env.WHATSAPP_B2B_TEMPLATE?.trim() ||
    'tropicana_b2b_propuesta';

  const propuestaTexto = [
    `¡Hola ${body.name || 'buen día'}! 🍃`,
    'Aquí va tu propuesta B2B de Tropicaña:',
    '· Patronal Supremo (a granel)',
    '· Hostelería Recomendado (+65% por copeo)',
    '· Kit Prueba (entrada de bajo riesgo)',
    body.nota ? `Nota: ${body.nota}` : '',
    '¿Te aparto el lote de tu zona?',
  ]
    .filter(Boolean)
    .join('\n');

  const send = async (payload: Record<string, unknown>) => {
    const res = await fetch(
      `https://graph.facebook.com/${GRAPH_VERSION}/${phoneNumberId}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify(payload),
      },
    );
    const data = (await res.json().catch(() => ({}))) as {
      messages?: { id: string }[];
      error?: { message?: string };
    };
    return { ok: res.ok, data };
  };

  try {
    let messageId: string | null = null;

    // 1) Plantilla de WhatsApp aprobada (es_MX)
    const tpl = await send({
      messaging_product: 'whatsapp',
      to: phone,
      type: 'template',
      template: { name: template, language: { code: 'es_MX' } },
    });

    if (tpl.ok) {
      messageId = tpl.data.messages?.[0]?.id ?? null;
    } else {
      // 2) Fallback: texto libre (válido dentro de la ventana de 24 h)
      const txt = await send({
        messaging_product: 'whatsapp',
        to: phone,
        type: 'text',
        text: { body: propuestaTexto, preview_url: false },
      });
      if (!txt.ok) {
        return NextResponse.json(
          {
            ok: false,
            error: `Plantilla '${template}' no disponible (${tpl.data.error?.message ?? 'error desconocido'}) y falló el envío de texto libre.`,
          },
          { status: 502 },
        );
      }
      messageId = txt.data.messages?.[0]?.id ?? null;
    }

    // 3) Marca la propuesta como enviada en el CRM (upsert por phone)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (supabaseUrl && supabaseAnonKey) {
      try {
        const cliente = createClient(supabaseUrl, supabaseAnonKey);
        await cliente.from('leads').upsert(
          {
            phone,
            estado_propuesta: 'enviada',
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'phone' },
        );
      } catch {
        // El envío ya fue exitoso: el marcado en CRM no es fatal.
      }
    }

    return NextResponse.json({ ok: true, messageId, propuestaEnviada: true });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error:
          err instanceof Error
            ? err.message
            : 'Error interno al reenviar la propuesta.',
      },
      { status: 500 },
    );
  }
}