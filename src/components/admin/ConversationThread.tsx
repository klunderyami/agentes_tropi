'use client';
import { Bot } from 'lucide-react';
import { formatTime } from '@/lib/format';
import type { ChatMensaje, Conversacion } from '@/lib/types';
import { cn } from '@/lib/utils';

function Bubble({ message }: { message: ChatMensaje }) {
  if (message.rol === 'sistema') {
    return (
      <div className="mx-auto max-w-[85%] rounded-lg bg-brand-tierra/5 px-3 py-1.5 text-center text-[11px] text-brand-tierraMuted">
        {message.texto}
      </div>
    );
  }

  const isLead = message.rol === 'lead';
  return (
    <div className={cn('flex flex-col gap-1', isLead ? 'items-end' : 'items-start')}>
      <div
        className={cn(
          'max-w-[80%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed',
          isLead
            ? 'rounded-br-md bg-brand-green text-brand-cream'
            : 'rounded-bl-md border border-brand-tierra/10 bg-white text-brand-tierra',
        )}
      >
        {message.texto}
        {message.tipo === 'auto_reply' && (
          <span className="mt-1.5 flex items-center gap-1 border-t border-brand-cream/20 pt-1.5 text-[10px] opacity-80">
            <Bot className="h-3 w-3" />
            Respuesta automática · {message.agente ?? 'agente'}
          </span>
        )}
        {message.tipo === 'template' && (
          <span className="mt-1.5 block text-[10px] opacity-70">Plantilla WhatsApp · es_MX</span>
        )}
        {message.tipo === 'nota' && (
          <span className="mt-1.5 block text-[10px] opacity-70">Nota del sistema / agente</span>
        )}
      </div>
      <span className="px-1 text-[10px] tabular-nums text-brand-tierraMuted">
        {formatTime(message.ts)}
      </span>
    </div>
  );
}

export function ConversationThread({ conversation }: { conversation: Conversacion }) {
  const messages = conversation.mensajes ?? [];
  return (
    <div className="flex max-h-[calc(100vh-21rem)] flex-col gap-3 overflow-y-auto px-4 py-5">
      {messages.length === 0 ? (
        <p className="py-10 text-center text-sm text-brand-tierraMuted">
          Esta conversación aún no tiene mensajes registrados.
        </p>
      ) : (
        messages.map((m) => <Bubble key={m.id} message={m} />)
      )}
    </div>
  );
}