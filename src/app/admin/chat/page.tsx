'use client';
import { AtSign, Instagram, MessageCircle, RefreshCw, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/admin/Badge';
import { ConversationThread } from '@/components/admin/ConversationThread';
import { EmptyState } from '@/components/admin/EmptyState';
import { RelativeTime } from '@/components/admin/RelativeTime';
import { SourceBadge } from '@/components/admin/SourceBadge';
import { useToast } from '@/components/admin/toast';
import { useConversations } from '@/hooks/use-conversations';
import { canalLabels, estadoConversacionLabels, nivelLabels } from '@/lib/labels';
import { getSupabaseClient } from '@/lib/supabase';
import type { CanalChat, Conversacion, EstadoConversacion } from '@/lib/types';
import { cn } from '@/lib/utils';

function CanalIcon({ canal }: { canal: CanalChat }) {
  if (canal === 'instagram') return <Instagram className="h-3.5 w-3.5" />;
  if (canal === 'manychat') return <AtSign className="h-3.5 w-3.5" />;
  return <MessageCircle className="h-3.5 w-3.5" />;
}

function estadoDot(estado: EstadoConversacion): string {
  if (estado === 'activa') return 'bg-emerald-400 animate-pulse';
  if (estado === 'resuelta') return 'bg-brand-gold';
  return 'bg-brand-tierra/30';
}

export default function ChatPage() {
  const { conversations, setConversations, fuente, reload } = useConversations();
  const { notify } = useToast();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedId || !conversations.some((c) => c.id === selectedId)) {
      setSelectedId(conversations[0]?.id ?? null);
    }
  }, [conversations, selectedId]);

  const selected = conversations.find((c) => c.id === selectedId) ?? conversations[0] ?? null;

  const lastText = (c: Conversacion) =>
    c.mensajes && c.mensajes.length > 0
      ? c.mensajes[c.mensajes.length - 1].texto
      : 'Sin mensajes registrados';

  const cerrarConversacion = async (conv: Conversacion) => {
    const ts = new Date().toISOString();
    const next = { ...conv, estado: 'cerrada' as EstadoConversacion, updated_at: ts };
    setConversations((prev) => prev.map((c) => (c.id === conv.id ? next : c)));

    const client = getSupabaseClient();
    if (!client) {
      notify(`Conversación cerrada (demo): ${conv.nombre}`, 'info');
      return;
    }
    for (const table of ['conversations', 'conversaciones']) {
      try {
        const { error } = await client
          .from(table)
          .upsert({ id: conv.id, estado: 'cerrada', updated_at: ts }, { onConflict: 'id' });
        if (!error) {
          notify(`Conversación cerrada en ${table}`, 'success');
          return;
        }
      } catch {
        // probar siguiente tabla
      }
    }
    notify('No se pudo persistir el cierre en Supabase', 'error');
  };

  return (
    <div className="space-y-5">
      {/* Encabezado */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-brand-tierraMuted">
          <span className="font-semibold text-brand-tierra">
            {conversations.filter((c) => c.estado === 'activa').length}
          </span>{' '}
          activas · {conversations.length} totales
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <SourceBadge fuente={fuente} />
          <button type="button" onClick={reload} className="btn-ghost !px-3 !py-1.5 text-xs">
            <RefreshCw className="h-3.5 w-3.5" /> Refrescar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[340px_minmax(0,1fr)]">
        {/* Lista de conversaciones */}
        <aside className="card flex flex-col overflow-hidden">
          <div className="border-b border-brand-tierra/10 px-4 py-3">
            <h3 className="text-sm font-bold uppercase tracking-wide text-brand-tierra">
              Conversaciones activas
            </h3>
          </div>
          {conversations.length === 0 ? (
            <div className="p-4">
              <EmptyState title="Sin conversaciones" description="No hay conversaciones registradas aún." />
            </div>
          ) : (
            <ul className="max-h-[calc(100vh-19rem)] divide-y divide-brand-tierra/10 overflow-y-auto">
              {conversations.map((c) => {
                const isSelected = selected?.id === c.id;
                return (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(c.id)}
                      className={cn(
                        'flex w-full items-start gap-3 px-4 py-3 text-left transition',
                        isSelected ? 'bg-brand-gold/15' : 'hover:bg-brand-cream/60',
                      )}
                    >
                      <span
                        className={cn(
                          'mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full',
                          estadoDot(c.estado),
                        )}
                      />
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center justify-between gap-2">
                          <span className="truncate text-sm font-semibold text-brand-tierra">
                            {c.nombre}
                          </span>
                          <RelativeTime value={c.updated_at} className="shrink-0 text-[11px] text-brand-tierraMuted" />
                        </span>
                        <span className="mt-0.5 flex items-center gap-1 text-xs text-brand-tierraMuted">
                          <CanalIcon canal={c.canal} /> {canalLabels[c.canal] ?? c.canal} ·{' '}
                          {c.agente}
                        </span>
                        <p className="mt-1 truncate text-xs text-brand-tierraMuted">
                          {lastText(c)}
                        </p>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </aside>

        {/* Detalle de la conversación */}
        <section className="card flex flex-col overflow-hidden">
          {selected ? (
            <>
              <header className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-tierra/10 px-5 py-3">
                <div className="min-w-0">
                  <h3 className="truncate font-bold text-brand-tierra">{selected.nombre}</h3>
                  <p className="text-xs tabular-nums text-brand-tierraMuted">{selected.handle}</p>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <Badge variant={selected.canal === 'whatsapp' ? 'ok' : 'gold'}>
                    <CanalIcon canal={selected.canal} /> {canalLabels[selected.canal]}
                  </Badge>
                  <Badge variant="cream">{selected.agente}</Badge>
                  {selected.zona && <Badge variant="neutral">{selected.zona}</Badge>}
                  {selected.nivel && (
                    <Badge variant="green">{nivelLabels[selected.nivel]}</Badge>
                  )}
                  <Badge
                    variant={
                      selected.estado === 'activa'
                        ? 'ok'
                        : selected.estado === 'resuelta'
                          ? 'warn'
                          : 'neutral'
                    }
                  >
                    {estadoConversacionLabels[selected.estado]}
                  </Badge>
                </div>
              </header>

              <ConversationThread conversation={selected} />

              {selected.estado !== 'cerrada' && (
                <footer className="flex items-center justify-between gap-3 border-t border-brand-tierra/10 px-4 py-3">
                  <p className="text-xs text-brand-tierraMuted">
                    Respuestas automáticas de {selected.agente} ya aplicadas en este hilo.
                  </p>
                  <button
                    type="button"
                    onClick={() => cerrarConversacion(selected)}
                    className="btn-ghost !px-3 !py-1.5 text-xs text-red-700 hover:border-red-300 hover:text-red-700"
                  >
                    <XCircle className="h-3.5 w-3.5" /> Cerrar conversación
                  </button>
                </footer>
              )}
            </>
          ) : (
            <div className="p-6">
              <EmptyState
                title="Selecciona una conversación"
                description="Elige un hilo de WhatsApp, Instagram o ManyChat para ver el historial completo."
              />
            </div>
          )}
        </section>
      </div>
    </div>
  );
}