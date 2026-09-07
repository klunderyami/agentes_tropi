'use client';
import { useCallback, useEffect, useState } from 'react';
import { demoMediaAssets } from '@/lib/demo-media';
import { getSupabaseClient } from '@/lib/supabase';
import type { FuenteDatos, MediaAsset } from '@/lib/types';

const MEDIA_TABLES = ['media_assets', 'assets', 'media'];

/** Galería multimedia generada por los agentes de Contenido (05-contenido). */
export function useMediaAssets(pollMs = 15_000) {
  const [assets, setAssets] = useState<MediaAsset[]>(demoMediaAssets);
  const [fuente, setFuente] = useState<FuenteDatos>('demo');
  const [loading, setLoading] = useState(true);

  const fetchAssets = useCallback(async () => {
    const client = getSupabaseClient();
    if (!client) {
      setFuente('demo');
      setLoading(false);
      return;
    }
    try {
      for (const table of MEDIA_TABLES) {
        try {
          const { data, error } = await client
            .from(table)
            .select('*')
            .order('creado_en', { ascending: false });
          if (error) throw error;
          if (Array.isArray(data) && data.length > 0) {
            setAssets(data as unknown as MediaAsset[]);
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
    fetchAssets();
    const id = setInterval(fetchAssets, pollMs);
    return () => clearInterval(id);
  }, [fetchAssets, pollMs]);

  return { assets, setAssets, fuente, loading, reload: fetchAssets };
}