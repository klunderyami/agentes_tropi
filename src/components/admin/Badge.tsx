import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type BadgeVariant =
  | 'green'
  | 'gold'
  | 'cream'
  | 'red'
  | 'neutral'
  | 'ok'
  | 'warn'
  | 'error';

const variantClasses: Record<BadgeVariant, string> = {
  green: 'bg-brand-green text-brand-cream border border-brand-green',
  gold: 'bg-brand-gold/20 text-brand-goldDark border border-brand-gold/40',
  cream: 'bg-brand-cream text-brand-tierra border border-brand-tierra/10',
  red: 'bg-red-50 text-red-700 border border-red-200',
  neutral: 'bg-brand-tierra/5 text-brand-tierraMuted border border-brand-tierra/10',
  ok: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  warn: 'bg-amber-50 text-amber-700 border border-amber-200',
  error: 'bg-red-50 text-red-700 border border-red-200',
};

export function Badge({
  children,
  variant = 'neutral',
  className,
}: {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium',
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}