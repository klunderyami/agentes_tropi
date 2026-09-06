'use strict';
/**
 * TROPICAÑA — ORQUESTADOR AUTÓNOMO CENTRAL
 *
 * Uso:
 *   node scripts/index.js --list
 *   node scripts/index.js --agent AGT-NEG-CP --input '{"zona":"Boca del Río"}'
 *   node scripts/index.js --agent lp --input 'Brief en lenguaje natural'
 *
 * `--agent` acepta el ID formal (AGT-NEG-LP) o el alias corto (lp, cp, ca, ...).
 * Carga el System Prompt del agente (.md), lo envía a Anthropic y devuelve
 * la salida JSON/Markdown solicitada por cada agente.
 */
const { loadEnv } = require('./src/env');
loadEnv();

const { catalog, getAgent, loadPrompt } = require('./src/agents');
const { askAnthropic } = require('./src/providers/anthropic');
const { parseArgs, safeJsonParse, outJson } = require('./src/utils');

/**
 * Payload de demostracion local para el modulo 03-Ads (contrato de salida)
 * sin llamar a Anthropic. Muestra estructura de campana y metricas de ROAS.
 */
function buildAdsDemoPayload(agent, input) {
  const cta = 'https://wa.me/52XXXXXXXXXX?text=TORITO';
  const base = { modo: 'DEMO_LOCAL', modulo: '03-ads', agente: agent.id, alias: agent.alias, nombre: agent.name, input: input || null };
  const nucleo = {
    anclaje_valor: '3 niveles siempre presentes: Patronal Supremo / Hosteleria / Kit Prueba',
    escasez_lote: 'lote artesanal por temporada + cupos reales por zona (TROPI_ZONAS_ACTIVAS)',
    atribucion: 'conversion instantanea por WhatsApp (wa.me) o checkout web por DM',
  };
  switch (agent.alias) {
    case 'ma':
      return Object.assign({}, base, {
        nucleo,
        campana: { nombre: 'MA|VeracruzCentro|Conversions|Kit|2026', objetivo: 'Conversions - Lead por mensaje', estructura: 'ABO (3 ad sets)' },
        ad_sets: [
          { nombre: 'Frio_7km', tipo: 'prospeccion fria', presupuesto_mxn_diario: 300, radio_km: 7, audiencia: '16-65 radio Veracruz Centro' },
          { nombre: 'Calor_visitantes', tipo: 'calor', presupuesto_mxn_diario: 200, radio_km: 10, audiencia: 'visito web 30d' },
          { nombre: 'Retarget_wa', tipo: 'retarget', presupuesto_mxn_diario: 150, radio_km: 10, audiencia: 'abrio WA < 7d' },
        ],
        creativos: [
          { tipo: 'video_sensorial_15s', fuente: 'AGT-SOC-IR', hook: 'hielo + condensacion + textura cremosa del torito' },
          { tipo: 'estatica_1x1', copy: 'Torito de Cacahuate artesanal, lote fresco', cta: 'Escribe TORITO' },
        ],
        producto: { linea: 'Torito de Cacahuate + Licores de Cana', temporada: 'lote artesanal por temporada' },
        escasez: { zona: 'Veracruz Centro', cupos_disponibles: 6, cupos_totales: 12 },
        atribucion: { canal: 'whatsapp_instantaneo', checkout_web: 'link de pago por DM', utm: 'utm_source=meta&utm_medium=ads&utm_campaign=retarget_torito', eventos_pixel: ['ViewContent', 'Lead', 'InitiateCheckout'] },
        metricas_roas: { gasto_diario_mxn: 650, leads_esperados: 18, cac_esperado_mxn: 36, roas_proyectado: 3.4, cvr_esperado_wa: '1 de cada 4 clics conversa por WhatsApp' },
        cta,
      });
    case 'ga':
      return Object.assign({}, base, {
        nucleo,
        campana: { nombre: 'Tropi_Search_Veracruz', tipo: 'Search + Display + YouTube', objetivo: 'demanda local' },
        grupos: [
          { nombre: 'compra_local', keywords: ['jugo de cana veracruz', 'torito artesanal veracruz'], rsa: 'Kit desde $X | Hosteleria a granel' },
          { nombre: 'hosteleria', keywords: ['proveedor licor de cana negocio', 'torito para barra'], rsa: '+65% margen por copeo | Prensado en frio' },
        ],
        negativas: ['sirope', 'jarabe', 'enlatado', 'bote'],
        atribucion: { canal: 'whatsapp', checkout_web: 'landing de oferta por zona' },
        metricas_roas: { roas_busqueda: 4.1, cac_busqueda_mxn: 28, roas_display: 2.2, cac_display_mxn: 45 },
        cta,
      });
    case 'al':
      return Object.assign({}, base, {
        nucleo,
        reporte: { periodo: '2026-semana', gasto_mxn: 4550, leads: 130, cerrados: 38, ingresos_mxn: 15400 },
        por_zona: [
          { zona: 'Veracruz Centro', cac_mxn: 35, cvr: 31, roas: 3.9, cupos: { vendidos: 8, disponibles: 4 } },
          { zona: 'Coatzacoalcos', cac_mxn: 52, cvr: 24, roas: 2.6, cupos: { vendidos: 5, disponibles: 7 } },
        ],
        fugas: [
          { tipo: 'sin_respuesta_24h', costo_mxn: 480, accion: 'WT responde < 5 min' },
          { tipo: 'frecuencia_meta_2.9', costo_mxn: 210, accion: 'pausar retarget' },
        ],
        acciones: ['+30% presupuesto Kit Veracruz Centro', 'Pausar retarget Coatzacoalcos hasta nuevo lote'],
        metricas_roas: { roas_global: 3.42, cac_promedio_mxn: 41, ltv_hosteleria: '3x', ltv_patronal: '6x' },
        cta,
      });
    case 'ca':
      return Object.assign({}, base, {
        nucleo,
        campana: 'MA|VeracruzCentro|Conversions|Kit',
        idea_visual: 'Torito cremoso empanando el vaso en camara lenta',
        piezas: [
          { superficie: 'feed_1x1', copy: 'Lote fresco de torito artesanal', texto_imagen: 'Torito HOY en Veracruz Centro', cta: 'Escribe TORITO', spec: '1080x1080 macro con hielo' },
          { superficie: 'reels_9x16', guion: '0-3s chorro cremoso; 3-8s nivel ancla; 8-15s cupo + CTA', cta: 'Escribe TORITO', spec: '1080x1920 15s 60fps' },
        ],
        paleta: ['cana', 'miel', 'crema', 'cacahuate'],
        atribucion: { canal: 'whatsapp', checkout_web: 'CTA a wa.me con texto TORITO' },
        metricas_roas: { ctr_esperado_video: '>1.2%', roas_creativo_esperado: 3.1 },
        cta,
      });
    case 'mz':
      return Object.assign({}, base, {
        nucleo,
        mapa: {
          'Veracruz Centro': { radio_km: 7, nivel_ancla: 'kit_prueba', cupos: { total: 12, disponibles: 6 }, estado: 'activa' },
          'Boca del Rio': { radio_km: 8, nivel_ancla: 'hosteleria', cupos: { total: 12, disponibles: 4 }, estado: 'activa' },
          'Poza Rica': { radio_km: 10, nivel_ancla: 'patronal_supremo', cupos: { total: 5, disponibles: 0 }, estado: 'pausada_saturacion' },
        },
        decision: 'pausar Poza Rica hasta nuevo lote; reforzar Boca del Rio jueves-viernes',
        metricas_roas: { roas_por_nivel_ancla: { kit_prueba: 3.0, hosteleria: 3.8, patronal_supremo: 2.4 } },
        cta,
      });
    default:
      return Object.assign({}, base, { nucleo, nota: 'Payload de ads generico (sin caso especifico).', cta });
  }
}
/**
 * Payload de demostracion local para el modulo 04-Ingenieria (contrato de
 * salida) sin llamar a Anthropic. Muestra estructura de mensaje/plantilla,
 * payload de webhook y estado de la base de datos (Supabase leads).
 */
function buildEngDemoPayload(agent, input) {
  const cta = 'https://wa.me/52XXXXXXXXXX?text=TORITO';
  const base = { modo: 'DEMO_LOCAL', modulo: '04-ingenieria', agente: agent.id, alias: agent.alias, nombre: agent.name, input: input || null };
  const conectores = {
    supabase: { tabla: 'leads', upsert: 'upsertLead({ table: "leads", row, onConflict: "phone" })', normaliza: 'phone E.164 +52' },
    webhooks: { n8n: '{{N8N_WEBHOOK_URL}}/webhook/lead-entry', make: '{{MAKE_WEBHOOK_URL}}' },
    whatsapp: { api: 'WhatsApp Business Cloud API', idioma: 'es_MX', templates: 'tropi_bienvenida_niveles, tropi_seguimiento_margen, tropi_reapertura_24h' },
  };
  switch (agent.alias) {
    case 'wa':
      return Object.assign({}, base, {
        conectores,
        tipo: 'plantilla_nueva',
        nombre_plantilla: 'tropi_bienvenida_niveles',
        categoria: 'MARKETING',
        idioma: 'es_MX',
        body: 'Hola {{1}}, en {{2}} el lote de hoy sale a {{3}}. Patronal {{4}} · Hostelería {{5}} · Kit {{6}}. ¿Cuál te aparto?',
        variables: ['nombre', 'zona', 'fecha_lote', 'precio_patronal', 'precio_hosteleria', 'precio_kit'],
        botones: [
          { tipo: 'QUICK_REPLY', texto: 'Hostelería' },
          { tipo: 'QUICK_REPLY', texto: 'Kit Prueba' },
          { tipo: 'URL', url: cta },
        ],
        mensaje: {
          to: '+5212290000000',
          tipo_envio: 'template fuera de ventana 24h',
          payload: '{"messaging_product":"whatsapp","to":"+5212290000000","type":"template","template":{"name":"tropi_bienvenida_niveles","language":{"code":"es_MX"}}}',
          dentro_ventana: 'sendWhatsApp({ to, text }) para texto libre con copy sensorial',
        },
        webhook: { eventos: ['messages', 'statuses'], firma: 'X-Hub-Signature-256', handler: 'POST /webhook/whatsapp -> validar firma -> procesar evento -> registrar en supabase.leads' },
        base_de_datos: { estado_lead: 'nuevo -> contacto', update: 'upsertLead({ row: { phone, estado: "contacto", nota: "plantilla enviada" } })', deduplicacion: 'on_conflict=phone (sin duplicados)' },
        siguiente_paso: 'responder boton quick reply -> handoff a WT',
        cta,
      });
    case 'tc':
      return Object.assign({}, base, {
        conectores,
        flujo: { nombre: 'lead-whatsapp-supabase', plataforma: 'n8n / Make', version: '1.1.0' },
        nodos: [
          { nombre: 'Webhook Lead Entry', tipo: 'webhook', path: 'lead-entry', activo: true },
          { nombre: 'Normalizar Lead', tipo: 'set', campos: ['name', 'phone', 'zona', 'origen', 'nivel', 'estado', 'score'] },
          { nombre: 'Supabase upsert leads', tipo: 'supabase', tabla: 'leads', on_conflict: 'phone' },
          { nombre: 'Notificar WT/Interno', tipo: 'http', url: '{{N8N_WEBHOOK_URL}}', metodo: 'POST' },
        ],
        env_requeridas: ['SUPABASE_URL', 'SUPABASE_KEY', 'N8N_WEBHOOK_URL', 'MAKE_WEBHOOK_URL', 'WHATSAPP_TOKEN'],
        prueba: { payload: '{"phone":"+5212281234567","zona":"Xalapa"}', resultado: 'row ok en leads + notificacion enviada' },
        blueprint: 'workflows/n8n-lead-whatsapp-supabase.json | workflows/make-lead-pipeline.json',
        siguiente_paso: 'importar blueprint, probar webhook, activar',
        cta,
      });
    case 'as':
      return Object.assign({}, base, {
        conectores,
        sistema: 'Tropi-Pipeline v2',
        entrada: ['meta_ads_webhook', 'google_ads_webhook', 'formulario_landing', 'wa_broadcast'],
        nodo_inicial: { accion: 'normalizar_lead', campos: ['phone', 'zona', 'origen'], regla_nivel: 'B2B->hosteleria | broadcast_frecuente->patronal_supremo | default->kit_prueba' },
        rama_feliz: ['upsert_supabase_leads', 'disparar_flow_manychat', 'notificar_interno'],
        rama_fallo: [
          { evento: 'supabase_offline', accion: 'colas + retry 3 con backoff 2m' },
          { evento: 'zona_sin_cupo', accion: 'rama_lista_de_espera' },
          { evento: 'template_rechazado', accion: 'cae a texto 24h o ticket a WA' },
        ],
        inventario: { tabla: 'leads', upserts_periodo: 130, deduplicacion: 'phone unico', metricas: ['tasa_paso_leads', 'tiempo_webhook_a_wa', '%_reintentos_ok'] },
        cta,
      });
    case 'fm':
      return Object.assign({}, base, {
        conectores,
        pieza: 'form_landing_kit_veracruz',
        campos: [
          { name: 'name', type: 'text', label: 'Tu nombre', obligatorio: true },
          { name: 'phone', type: 'tel', label: 'Tu WhatsApp', obligatorio: true, normaliza: 'E.164:+52' },
          { name: 'zona', type: 'select', opciones: 'TROPI_ZONAS_ACTIVAS', cupo_visible: true },
        ],
        nivel_selector: { tipo: 'radio_3', opciones: ['patronal_supremo', 'hosteleria', 'kit_prueba'], precios: ['{{precio}}', '{{precio}}', '{{precio}}'] },
        webhook: { url: '{{N8N_WEBHOOK_URL}}', metodo: 'POST', content_type: 'application/json' },
        animaciones_ui: { entrada: 'fade+translateY 300ms', nivel: 'highlight del kit elegido', cta: 'pulse sutil en "Hablar por WhatsApp"' },
        eventos_pixel: ['ViewContent', 'Lead', 'WhatsAppClick'],
        boton_principal: 'Hablar por WhatsApp',
        cta,
      });
    case 'co':
      return Object.assign({}, base, {
        conectores,
        flujo_secuencia: 'client_onboarding_torito',
        nodos: [
          { id: 'bienvenida', accion: 'saludo + anclaje 3 niveles', botones: ['patronal_supremo', 'hosteleria', 'kit_prueba'] },
          { id: 'duda', accion: 'comparacion margen +65% vs sustituto', salida: 'vuelve a decision' },
          { id: 'cupo', accion: 'consultar_cupo', fuente: 'supabase.leads | cupos', salida_si_hay: 'oferta_zona', salida_no_hay: 'lista_espera' },
          { id: 'handoff', accion: 'transferir_a_WT', adjunta: ['nivel', 'nota', 'phone'] },
        ],
        post_venta: { secuencia: 'dia1->confirmacion entrega | dia7->recetario toritos | dia28->recompra por zona con cupo', iman: 'recetario_toritos a cambio de WhatsApp', cadencia: 'max 1 mensaje util/dia' },
        keywords: { precio: ['cuesta', '$$', 'precio'], zona: ['colonia', 'donde', 'zona'], hoy: ['hoy', 'ahora'] },
        fallback: { max_intentos: 2, accion: 'transferir_a_WT' },
        flag_escasez: 'TROPI_ZONAS_ACTIVAS + cupo_crm',
        cta,
      });
    case 'wd':
      return Object.assign({}, base, {
        conectores,
        url: 'https://tropicana.mx/lp/veracruz-torito',
        zona: 'Veracruz Centro',
        secciones: [
          { id: 'hero', tipo: 'video_autoplay_muted', cta: cta },
          { id: 'anchoring', tipo: '3_niveles', precios: ['{{precio}}', '{{precio}}', '{{precio}}'] },
          { id: 'perdida', tipo: 'comparativa', concepto: 'nevera sustituto vs prensa' },
          { id: 'escasez', tipo: 'contador_cupo', fuente: 'cmr_webhook', zona: 'Veracruz Centro' },
        ],
        pixel: { eventos: ['ViewContent', 'Lead', 'WhatsAppClick'], dataLayer: true },
        formulario: { action: '{{N8N_WEBHOOK_URL}}', campos: ['name', 'phone', 'zona'] },
        conectores_api: { webhook: '{{N8N_WEBHOOK_URL}}', supabase_fetch: 'cupo via fetch ligero al CRM', cta_wa: 'wa.me/52XXXXXXXXXX?text=TORITO+Veracruz' },
        checklist: ['CWV_lcp<2.5s', 'inp<200ms', 'cli=0', 'accesible_AA', 'meta_og'],
        cta,
      });
    default:
      return Object.assign({}, base, { conectores, nota: 'Payload de ingenieria generico (sin caso especifico).', cta });
  }
}
/**
 * Payload de demostracion local (contrato de salida) sin llamar a Anthropic.
 * Se activa con TROPI_DEMO=1 o con el flag --demo. Util para validar la
 * resolucion de alias, la carga del prompt y el formato de salida cuando la
 * ANTHROPIC_API_KEY aun no es valida.
 */
function buildDemoPayload(agent, input) {
  if (agent.module === 'AGT-ADS') return buildAdsDemoPayload(agent, input);
  if (agent.module === 'AGT-ENG') return buildEngDemoPayload(agent, input);
  const cta = 'https://wa.me/52XXXXXXXXXX?text=TORITO';
  return {
    modo: 'DEMO_LOCAL',
    agente: agent.id,
    alias: agent.alias,
    nombre: agent.name,
    input: input || null,
    nota: 'Demo generado en local sin Anthropic. Sustituya ANTHROPIC_API_KEY en .env para generar el payload real.',
    estructura: {
      gancho: '0-3s: interrupcion de patron visual/emocional en el scroll (hielo+chorro espeso)',
      reel: ['hook 0-3s', 'desarrollo 3-12s', 'anclaje de niveles 12-18s', 'CTA 18-22s'],
      caption: 'caption con disparadores sensoriales: frialdad del hielo, textura cremosa del torito, aroma a cacao/cacahuate',
      reciprocidad: 'recetario de toritos a cambio del numero de WhatsApp (valor primero, dato despues)',
      manychat: 'triggerManyChatFlow({ subscriberId, flowId: "flow_torito_captura" })',
    },
    cta,
  };
}
async function main() {
  const args = parseArgs(process.argv.slice(2));

  // --list : imprime el catálogo completo
  if (args.list) {
    outJson(catalog());
    return;
  }

  const id = args.agent;
  if (!id) {
    console.error(
      'Uso:\n  node scripts/index.js --list\n' +
        "  node scripts/index.js --agent AGT-NEG-WT --input '{\"zona\":\"Boca del Río\"}'\n" +
        "  node scripts/index.js --agent lp --input 'Brief en lenguaje natural'\n" +
        'Alias cortos disponibles: cp, lp, ca, wt, pc, fg, vh, ir, sc, sw, ps, md,\n' +
        '  ma, ga, al, mz, tc, as, wa, fm, co, wd, cc, cv, ha, rp, ck, vm, sa, cs, fq, gg\n',
    );
    process.exit(1);
  }

  const agent = getAgent(id);
  const system = loadPrompt(agent);

  // El input puede llegar como JSON string o como texto libre (brief en
  // lenguaje natural). Si es JSON válido, se normaliza serializado; si no,
  // se envía tal cual sin romper el flujo.
  const rawInput = args.input ?? null;
  let userInput = rawInput;
  if (rawInput !== null && rawInput !== undefined) {
    try {
      const parsed = safeJsonParse(rawInput, 'input de usuario');
      if (parsed !== null) userInput = JSON.stringify(parsed);
    } catch (err) {
      // No es JSON (ej. un brief en lenguaje natural): usar el texto tal cual.
      userInput = rawInput;
    }
  }

  const demoMode = process.env.TROPI_DEMO === '1' || Boolean(args.demo);
  if (demoMode) {
    outJson(buildDemoPayload(agent, userInput));
    return;
  }

  if (process.env.TROPI_DEBUG === '1') {
    outJson({ agent: agent.id, name: agent.name, promptFile: agent.file, input: userInput });
  }

  const result = await askAnthropic({ system, user: userInput || 'Ejecuta tu diagnóstico estándar sobre la zona activa actual.' });
  console.log(result.text);
}

main().catch((err) => {
  console.error('✖', err.message);
  process.exit(1);
});