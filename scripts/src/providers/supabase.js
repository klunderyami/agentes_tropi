'use strict';
const { requireEnv } = require('../utils');

/**
 * UPSERT de una fila en Supabase (PostgREST) usando merge-duplicates.
 * Por defecto actúa sobre la tabla `leads` conflictuando en `phone`.
 * Devuelve las filas representadas.
 */
async function upsertLead({ table = 'leads', row, onConflict = 'phone' }) {
  const url = requireEnv('SUPABASE_URL');
  const key = requireEnv('SUPABASE_KEY');

  const target = `${url.replace(/\/$/, '')}/rest/v1/${table}`;
  const res = await fetch(`${target}?on_conflict=${onConflict}`, {
    method: 'POST',
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'content-type': 'application/json',
      Prefer: 'resolution=merge-duplicates,return=representation',
    },
    body: JSON.stringify([row]),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`Supabase ${res.status}: ${detail}`);
  }
  const rows = await res.json().catch(() => []);
  return { rows, count: Array.isArray(rows) ? rows.length : 0 };
}

module.exports = { upsertLead };