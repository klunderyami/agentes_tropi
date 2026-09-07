'use client';
import { Database, FlaskConical } from 'lucide-react';
import type { FuenteDatos } from '@/lib/types';
import { cn } from '@/lib/utils';

/**
 * Indica de dónde provienen los datos del módulo:
 *  - Supabase: lectura en vivo desde PostgREST.
 *  - Demo: datos de ejemplo (sin conexión o tablas aún vacías).
 */
export function SourceBadge({
  fuente,
  className,
}: {
  fuente: FuenteDatos;
  className?: string;
}) {
  const supabase = fuente === 'supabase';
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold',
        supabase
          ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
          : 'border-brand-gold/40 bg-brand-gold/15 text-brand-goldDark',
        className,
      )}
      title={
        supabase
          ? 'Datos leídos en tiempo real de las tablas de Supabase'
          : 'Sin conexión a Supabase: mostrando datos de demostración'
      }
    >
      {supabase ? <Database className="h-3.5 w-3.5" /> : <FlaskConical className="h-3.5 w-3.5" />}
      {supabase ? 'En vivo · Supabase' : 'Modo demo'}
    </span>
  );
}