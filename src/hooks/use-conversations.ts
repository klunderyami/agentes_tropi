'use client';
import { useCallback, useEffect, useState } from 'react';
import { demoConversations } from '@/lib/demo-chats';
import { getSupabaseClient } from '@/lib/supabase';
import type { Conversacion, FuenteDatos } from '@/lib/types';

const CONVERSATION_TABLES = ['conversations', 'conversaciones'];

/**
 * Centro de mensajes: conversaciones de WhatsApp Cloud API (es_MX) e
 * Instagram/ManyChat, refreshed por polling y con fallback a demo.
 */
export function useConversations(pollMs = 10_000) {
  const [conversations, setConversations] = useState<Conversacion[]>(demoConversations);
  const [fuente, setFuente] = useState<FuenteDatos>('demo');
  const [loading, setLoading] = useState(true);

  const fetchConversations = useCallback(async () => {
    const client = getSupabaseClient();
    if (!client) {
      setFuente('demo');
      setLoading(false);
      return;
    }
    try {
      for (const table of CONVERSATION_TABLES) {
        try {
          const { data, error } = await client
            .from(table)
            .select('*')
            .order('updated_at', { ascending: false });
          if (error) throw error;
          if (Array.isArray(data) && data.length > 0) {
            setConversations(data as unknown as Conversacion[]);
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
    fetchConversations();
    const id = setInterval(fetchConversations, pollMs);
    return () => clearInterval(id);
  }, [fetchConversations, pollMs]);

  return { conversations, setConversations, fuente, loading, reload: fetchConversations };
}