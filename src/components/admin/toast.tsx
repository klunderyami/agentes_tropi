'use client';
import { AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';
import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

type ToastKind = 'success' | 'error' | 'info';

interface ToastItem {
  id: number;
  kind: ToastKind;
  message: string;
}

interface ToastContextValue {
  notify: (message: string, kind?: ToastKind) => void;
}

const ToastContext = createContext<ToastContextValue>({ notify: () => {} });

export const useToast = () => useContext(ToastContext);

const kindStyles: Record<
  ToastKind,
  { icon: typeof Info; wrap: string; textColor: string }
> = {
  success: { icon: CheckCircle2, wrap: 'border-emerald-200 bg-white', textColor: 'text-emerald-600' },
  error: { icon: AlertTriangle, wrap: 'border-red-200 bg-white', textColor: 'text-red-600' },
  info: { icon: Info, wrap: 'border-brand-gold/40 bg-white', textColor: 'text-brand-goldDark' },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const notify = useCallback((message: string, kind: ToastKind = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, kind, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-80 max-w-[calc(100vw-2rem)] flex-col gap-2">
        {toasts.map((t) => {
          const { icon: Icon, wrap, textColor } = kindStyles[t.kind];
          return (
            <div
              key={t.id}
              className={cn(
                'pointer-events-auto flex items-start gap-3 rounded-xl border px-3.5 py-3 shadow-pop',
                wrap,
              )}
            >
              <Icon className={cn('mt-0.5 h-4 w-4 shrink-0', textColor)} />
              <p className="flex-1 text-sm text-brand-tierra">{t.message}</p>
              <button
                onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
                className="text-brand-tierraMuted transition hover:text-brand-tierra"
                aria-label="Cerrar aviso"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}