'use client';
import { useMounted } from '@/hooks/use-mounted';
import { timeAgo } from '@/lib/format';

/**
 * Tiempo relativo (hace x min): solo se computa del lado del cliente tras
 * el montaje para evitar mismatches de hidratación con el SSR.
 */
export function RelativeTime({ value, className }: { value?: string; className?: string }) {
  const mounted = useMounted();
  if (!value) return <span className={className}>—</span>;
  return <span className={className}>{mounted ? timeAgo(value) : '·'}</span>;
}