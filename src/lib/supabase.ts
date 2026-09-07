import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Cliente Supabase del dashboard (cliente de navegador).
 *
 * Se inicializa de forma perezosa (lazy) y SOLO si existen las variables
 * públicas NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY.
 * Si no están configuradas, los módulos del dashboard caen en "modo demo"
 * con datos de ejemplo, por lo que el build y el render nunca se rompen.
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

let cached: SupabaseClient | null | undefined;

export function getSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  if (cached !== undefined) return cached;
  cached = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
  return cached;
}