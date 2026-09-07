import { cn } from '@/lib/utils';

/** Barra de Lead Score 0–100 con semáforo de color. */
export function ScoreBar({
  score,
  showValue = true,
  className,
}: {
  score: number;
  showValue?: boolean;
  className?: string;
}) {
  const v = Math.max(0, Math.min(100, Math.round(score || 0)));
  const color = v >= 75 ? 'bg-emerald-500' : v >= 50 ? 'bg-brand-gold' : 'bg-red-400';
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-brand-tierra/10">
        <div
          className={cn('h-full rounded-full transition-all', color)}
          style={{ width: `${v}%` }}
        />
      </div>
      {showValue && (
        <span className="w-6 text-right text-xs font-semibold tabular-nums text-brand-tierra">
          {v}
        </span>
      )}
    </div>
  );
}