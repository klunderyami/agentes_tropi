'use client';
import { useCallback, useEffect, useState } from 'react';
import { demoMetricas } from '@/lib/demo-metrics';
import { getSupabaseClient } from '@/lib/supabase';
import type {
  FuenteDatos,
  KpiResumen,
  MetricasEjecutivas,
  Semaforo,
} from '@/lib/types';

type KpiResumenKey = KpiResumen['clave'];

interface KpiEjecutivo {
  clave?: string;
  etiqueta?: string;
  valor?: number;
  unidad?: string;
  tendencia?: number;
  semaforo?: string;
}

const METRICS_TABLES = ['metricas', 'metrics'];

/**
 * Torre de control: KPIs ejecutivos (CR, CAC, AOV, ROAS) reportados por los
 * agentes de ads. Si la tabla `metricas` no existe aún, usa el demo.
 */
export function useMetrics(pollMs = 15_000) {
  const [metricas, setMetricas] = useState<MetricasEjecutivas>(demoMetricas);
  const [fuente, setFuente] = useState<FuenteDatos>('demo');
  const [loading, setLoading] = useState(true);

  const fetchMetrics = useCallback(async () => {
    const client = getSupabaseClient();
    if (!client) {
      setFuente('demo');
      setLoading(false);
      return;
    }
    try {
      for (const table of METRICS_TABLES) {
        try {
          const { data, error } = await client
            .from(table)
            .select('*')
            .limit(30);
          if (error) throw error;
          if (Array.isArray(data) && data.length > 0) {
            const kpis = (data as unknown as KpiEjecutivo[]).map((r) => ({
              clave: (r.clave as KpiResumenKey) ?? 'roas',
              etiqueta: r.etiqueta ?? r.clave ?? 'Métrica',
              valor: Number(r.valor ?? 0),
              unidad: (r.unidad as KpiResumen['unidad']) ?? '',
              tendencia: Number(r.tendencia ?? 0),
              semaforo: (r.semaforo as Semaforo) ?? 'ok',
            }));
            setMetricas((prev) => ({ ...prev, kpis: kpis.slice(0, 4) }));
            setFuente('supabase');
            return;
          }
        } catch {
          // siguiente tabla candidata
        }
      }
      setFuente('demo');
    } catch {
      setFuente('demo');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMetrics();
    const id = setInterval(fetchMetrics, pollMs);
    return () => clearInterval(id);
  }, [fetchMetrics, pollMs]);

  return { metricas, fuente, loading, reload: fetchMetrics };
}