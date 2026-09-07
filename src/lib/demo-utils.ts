/**
 * Utilidades de los datos de demostración.
 * Estos datos NO se suben a Supabase: solo dan vida al dashboard cuando el
 * proyecto aún no está conectado a las tablas reales.
 */

/** Devuelve un timestamp ISO (UTC) de hace `minutes` minutos. */
export function isoAgo(minutes: number): string {
  return new Date(Date.now() - minutes * 60_000).toISOString();
}

/** Devuelve un timestamp ISO (UTC) dentro de `minutes` minutos (futuro). */
export function isoIn(minutes: number): string {
  return new Date(Date.now() + minutes * 60_000).toISOString();
}