'use client';
import {
  Filter,
  Gauge,
  Images,
  LayoutDashboard,
  MessagesSquare,
  RefreshCw,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV: { href: string; label: string; icon: LucideIcon }[] = [
  { href: '/admin', label: 'Panel de Control', icon: LayoutDashboard },
  { href: '/admin/leads', label: 'Leads B2B', icon: Filter },
  { href: '/admin/chat', label: 'Mensajes & WhatsApp', icon: MessagesSquare },
  { href: '/admin/media', label: 'Galería Multimedia', icon: Images },
  { href: '/admin/metrics', label: 'Agentes & Ads', icon: Gauge },
];

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);

  return (
    <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col bg-brand-greenDarker text-brand-cream max-md:hidden">
      {/* Marca */}
      <div className="flex items-center gap-3 border-b border-white/10 px-5 py-5">
        <Link href="/admin" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gold text-lg font-black text-brand-greenDarker">
            T
          </span>
          <span>
            <span className="block text-base font-bold leading-tight tracking-wide">
              Tropicaña
            </span>
            <span className="block text-xs text-white/55">Panel Administrador</span>
          </span>
        </Link>
      </div>

      {/* Navegación */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition',
                active
                  ? 'bg-brand-gold font-semibold text-brand-greenDarker shadow-sm'
                  : 'text-white/80 hover:bg-white/10 hover:text-white',
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Pie */}
      <div className="border-t border-white/10 px-5 py-4 text-xs text-white/55">
        <p className="flex items-center gap-1.5">
          <RefreshCw className="h-3 w-3" /> Actualización en vivo ~10 s
        </p>
        <p className="mt-1">Tropicaña Dashboard · v0.1</p>
      </div>
    </aside>
  );
}