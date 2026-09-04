'use strict';
const { requireEnv } = require('../utils');

/**
 * Envía un System Prompt + mensaje de usuario a Anthropic (Messages API).
 * El System Prompt es el contenido íntegro del archivo .md del agente.
 */
async function askAnthropic({ system, user, model, max_tokens = 2048, temperature = 0.4 }) {
  const apiKey = requireEnv('ANTHROPIC_API_KEY');
  const finalModel = model || process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-5';

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: finalModel,
      max_tokens,
      temperature,
      system,
      messages: [{ role: 'user', content: user }],
    }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(`Anthropic ${res.status}: ${JSON.stringify(data.error || data)}`);
  }

  const text = (Array.isArray(data.content) ? data.content : [])
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('\n');

  return { text, model: data.model, usage: data.usage };
}

module.exports = { askAnthropic };