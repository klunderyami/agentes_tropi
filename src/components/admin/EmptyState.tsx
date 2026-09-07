import type { LucideIcon } from 'lucide-react';
import { Inbox } from 'lucide-react';

export function EmptyState({
  icon: Icon = Inbox,
  title = 'Sin resultados',
  description,
}: {
  icon?: LucideIcon;
  title?: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-brand-tierra/20 bg-white/60 px-6 py-14 text-center">
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-gold/15 text-brand-goldDark">
        <Icon className="h-6 w-6" />
      </span>
      <p className="text-sm font-semibold text-brand-tierra">{title}</p>
      {description && (
        <p className="max-w-sm text-xs text-brand-tierraMuted">{description}</p>
      )}
    </div>
  );
}