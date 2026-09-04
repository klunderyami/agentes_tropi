'use strict';
const { requireEnv } = require('../utils');

/**
 * Envío de mensajes por WhatsApp Business Cloud API (Meta Graph).
 * - text: mensaje libre
 * - template: nombre de plantilla aprobada (para mensajes fuera de ventana 24h)
 */
async function sendWhatsApp({ to, text, template, lang = 'es_MX' }) {
  const token = requireEnv('WHATSAPP_TOKEN');
  const phoneNumberId = requireEnv('WHATSAPP_PHONE_NUMBER_ID');

  let payload;
  if (template) {
    payload = {
      messaging_product: 'whatsapp',
      to,
      type: 'template',
      template: { name: template, language: { code: lang } },
    };
  } else {
    payload = {
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { body: text, preview_url: false },
    };
  }

  const res = await fetch(
    `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify(payload),
    },
  );

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(`WhatsApp ${res.status}: ${JSON.stringify(data.error || data)}`);
  }
  return { messageId: data.messages?.[0]?.id, status: 'queued', meta: data };
}

module.exports = { sendWhatsApp };