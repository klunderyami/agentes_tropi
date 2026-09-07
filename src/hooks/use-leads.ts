'use client';
import { useCallback, useEffect, useState } from 'react';
import { demoLeads } from '@/lib/demo-leads';
import { getSupabaseClient } from '@/lib/supabase';
import type { FuenteDatos, Lead } from '@/lib/types';

const LEAD_TABLES = ['leads'];

/**
 * Pipeline de leads B2B. Leo la tabla `leads` de Supabase con polling ligero
 * y caigo a datos demo si no hay credenciales, la tabla no existe o está vacía.
 */
export function useLeads(pollMs = 12_000) {
  const [leads, setLeads] = useState<Lead[]>(demoLeads);
  const [fuente, setFuente] = useState<FuenteDatos>('demo');
  const [loading, setLoading] = useState(true);

  const fetchLeads = useCallback(async () => {
    const client = getSupabaseClient();
    if (!client) {
      setFuente('demo');
      setLoading(false);
      return;
    }
    try {
      for (const table of LEAD_TABLES) {
        try {
          const { data, error } = await client
            .from(table)
            .select('*')
            .order('score', { ascending: false });
          if (error) throw error;
          if (Array.isArray(data) && data.length > 0) {
            setLeads(data as unknown as Lead[]);
            setFuente('supabase');
            return;
          }
        } catch {
          // probar siguiente tabla candidata
        }
      }
      setLeads(demoLeads);
      setFuente('demo');
    } catch {
      setFuente('demo');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
    const id = setInterval(fetchLeads, pollMs);
    return () => clearInterval(id);
  }, [fetchLeads, pollMs]);

  return { leads, setLeads, fuente, loading, reload: fetchLeads };
}