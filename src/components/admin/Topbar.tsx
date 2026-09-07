'use client';
import { Radio } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { isSupabaseConfigured } from '@/lib/supabase';
import { cn } from '@/lib/utils';

const TITLES: Record<string, { title: string; subtitle: string }> = {
  '/admin': {
    title: 'Panel de Control',
    subtitle: 'Tropicaña · visión ejecutiva de la operación',
  },
  '/admin/leads': {
    title: 'Pipeline de Leads B2B',
    subtitle: 'Lead Score, propuestas y reenvío B2B por WhatsApp',
  },
  '/admin/chat': {
    title: 'Mensajes & WhatsApp',
    subtitle: 'Conversaciones en vivo · WhatsApp Cloud API (es_MX) e Instagram',
  },
  '/admin/media': {
    title: 'Galería de Activos',
    subtitle: 'Imágenes, carruseles, guiones de Reels y video de los agentes',
  },
  '/admin/metrics': {
    title: 'Agentes & Ads',
    subtitle: 'CR, CAC, AOV, ROAS y estado de ejecución en consola',
  },
};

export function Topbar() {
  const pathname = usePathname();
  const meta = TITLES[pathname] ?? TITLES['/admin'];
  const [today, setToday] = useState('');

  useEffect(() => {
    setToday(
      new Date().toLocaleDateString('es-MX', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    );
  }, []);

  return (
    <header className="sticky top-0 z-20 border-b border-black/10 bg-brand-green text-white">
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 md:px-8">
        <div className="min-w-0">
          <h1 className="text-lg font-bold leading-tight">{meta.title}</h1>
          <p className="truncate text-sm text-white/65">{meta.subtitle}</p>
        </div>
        <div className="flex items-center gap-3">
          {today && (
            <span className="hidden text-xs capitalize text-white/65 lg:block">{today}</span>
          )}
          <span
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold',
              isSupabaseConfigured
                ? 'border-emerald-300/40 bg-emerald-400/10 text-emerald-200'
                : 'border-brand-gold/50 bg-brand-gold/10 text-brand-goldLight',
            )}
            title={
              isSupabaseConfigured
                ? 'Conectado a Supabase'
                : 'Sin NEXT_PUBLIC_SUPABASE_*: modo demostración'
            }
          >
            <Radio className="h-3.5 w-3.5 animate-pulse" />
            {isSupabaseConfigured ? 'En vivo' : 'Modo demo'}
          </span>
        </div>
      </div>
    </header>
  );
}