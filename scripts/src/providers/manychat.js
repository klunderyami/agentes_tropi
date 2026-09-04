'use strict';
const { requireEnv } = require('../utils');

/**
 * Conector genérico de ManyChat: dispara un flujo (flow ID) para un usuario.
 * Útil para broadcasts de recompra por zona y secuencias de seguimiento.
 */
async function triggerManyChatFlow({ subscriberId, flowId }) {
  const token = requireEnv('MANYCHAT_TOKEN');

  const res = await fetch('https://api.manychat.com/fb/sending/sendFlow', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      subscriber_id: String(subscriberId),
      flow_id: String(flowId),
    }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.status !== 'success') {
    throw new Error(`ManyChat: ${JSON.stringify(data)}`);
  }
  return data;
}

module.exports = { triggerManyChatFlow };