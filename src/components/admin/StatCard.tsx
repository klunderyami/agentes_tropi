'use client';
import type { LucideIcon } from 'lucide-react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export type StatTone = 'green' | 'gold' | 'cream' | 'red';

const toneChip: Record<StatTone, string> = {
  green: 'bg-brand-green text-white',
  gold: 'bg-brand-gold text-brand-greenDarker',
  cream: 'bg-brand-cream text-brand-goldDark border border-brand-gold/40',
  red: 'bg-red-100 text-red-700',
};

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  trendLabel,
  invert = false,
  tone = 'gold',
  sub,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  /** Delta porcentual para mostrar (+, −). */
  trend?: number;
  trendLabel?: string;
  /** Si el descenso es positivo (p. ej. CAC). */
  invert?: boolean;
  tone?: StatTone;
  sub?: string;
}) {
  const up = (trend ?? 0) >= 0;
  const good = invert ? !up : up;
  const Delta = up ? ArrowUpRight : ArrowDownRight;
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-tierraMuted">
            {label}
          </p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-brand-tierra">{value}</p>
        </div>
        <span
          className={cn(
            'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg shadow-sm',
            toneChip[tone],
          )}
        >
          <Icon className="h-5 w-5" />
        </span>
      </div>
      {(trend !== undefined || sub) && (
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
          {trend !== undefined && (
            <span
              className={cn(
                'inline-flex items-center gap-0.5 text-xs font-semibold',
                good ? 'text-emerald-600' : 'text-red-600',
              )}
            >
              <Delta className="h-3.5 w-3.5" />
              {up ? '+' : '−'}
              {Math.abs(trend)}
              {trendLabel ? ` ${trendLabel}` : ''}
            </span>
          )}
          {sub && <span className="truncate text-xs text-brand-tierraMuted">{sub}</span>}
        </div>
      )}
    </div>
  );
}