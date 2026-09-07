'use client';
import {
  AlertTriangle,
  ArrowRight,
  Banknote,
  Filter,
  Images,
  LineChart,
  MessagesSquare,
  Percent,
  RefreshCw,
  ShoppingCart,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/admin/Badge';
import { RelativeTime } from '@/components/admin/RelativeTime';
import { SourceBadge } from '@/components/admin/SourceBadge';
import { StatCard } from '@/components/admin/StatCard';
import { useMetrics } from '@/hooks/use-metrics';
import { formatMxn, formatNumber } from '@/lib/format';
import type { KpiResumen, Semaforo } from '@/lib/types';

const kpiIcon: Record<string, LucideIcon> = {
  cr: Percent,
  cac: Banknote,
  aov: ShoppingCart,
  roas: LineChart,
};

function kpiValue(k: KpiResumen): string {
  switch (k.clave) {
    case 'cr':
      return `${formatNumber(k.valor)}%`;
    case 'cac':
      return formatMxn(k.valor);
    case 'aov':
      return formatMxn(k.valor);
    case 'roas':
      return `${formatNumber(k.valor, 2)}x`;
    default:
      return formatNumber(k.valor);
  }
}

function dotColor(s: Semaforo): string {
  if (s === 'ok') return 'bg-emerald-400';
  if (s === 'warn') return 'bg-amber-400';
  return 'bg-red-500';
}

const QUICK_LINKS: { href: string; label: string; desc: string; icon: LucideIcon }[] = [
  {
    href: '/admin/leads',
    label: 'Pipeline de Leads B2B',
    desc: 'Lead Score, propuestas y reenvío por WhatsApp',
    icon: Filter,
  },
  {
    href: '/admin/chat',
    label: 'Mensajes & WhatsApp',
    desc: 'Conversaciones en vivo (es_MX) e Instagram',
    icon: MessagesSquare,
  },
  {
    href: '/admin/media',
    label: 'Galería Multimedia',
    desc: 'Activos de los agentes de Contenido',
    icon: Images,
  },
  {
    href: '/admin/metrics',
    label: 'Agentes & Ads',
    desc: 'CR, CAC, AOV, ROAS y semáforo de ejecución',
    icon: LineChart,
  },
];

export default function AdminHomePage() {
  const { metricas, fuente, reload } = useMetrics();

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-brand-tierra">Resumen ejecutivo</h2>
          <p className="text-sm text-brand-tierraMuted">
            Ventana reportada por el agente AL: {metricas.periodo}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <SourceBadge fuente={fuente} />
          <button type="button" onClick={reload} className="btn-ghost !px-3 !py-1.5 text-xs">
            <RefreshCw className="h-3.5 w-3.5" /> Refrescar
          </button>
        </div>
      </div>

      {/* KPIs ejecutivos */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metricas.kpis.map((k) => (
          <StatCard
            key={k.clave}
            label={k.etiqueta}
            value={kpiValue(k)}
            icon={kpiIcon[k.clave] ?? Percent}
            tone={k.semaforo === 'ok' ? 'green' : k.semaforo === 'warn' ? 'gold' : 'red'}
            trend={k.tendencia}
            trendLabel={k.clave === 'cac' ? 'vs. anterior' : 'pts'}
            invert={k.clave === 'cac'}
            sub={k.nota}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Estado de agentes */}
        <section className="card p-5">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-bold uppercase tracking-wide text-brand-tierra">
              Estado de ejecución
            </h3>
            <Badge variant="cream">{metricas.agentes.length} agentes</Badge>
          </div>
          <ul className="mt-4 space-y-2.5">
            {metricas.agentes.slice(0, 6).map((a) => (
              <li key={a.id} className="flex items-center gap-3 text-sm">
                <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${dotColor(a.estado)}`} />
                <span className="w-44 truncate font-medium text-brand-tierra">
                  {a.nombre}
                  <span className="ml-1 text-xs font-normal text-brand-tierraMuted">
                    {a.id}
                  </span>
                </span>
                <span className="min-w-0 flex-1 truncate text-xs text-brand-tierraMuted">
                  {a.ultimo_mensaje}
                </span>
                <RelativeTime
                  value={a.last_run}
                  className="shrink-0 text-xs text-brand-tierraMuted"
                />
              </li>
            ))}
          </ul>
          <Link href="/admin/metrics" className="btn-ghost mt-4 text-sm">
            Ver torre de control <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
        {/* Fugas + accesos rápidos */}
        <section className="card p-5">
          <h3 className="text-sm font-bold uppercase tracking-wide text-brand-tierra">
            Fugas y acciones
          </h3>
          <ul className="mt-4 space-y-2">
            {metricas.fugas.map((f) => (
              <li
                key={f.tipo}
                className="rounded-lg border border-amber-200 bg-amber-50/70 p-3 text-sm"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-1.5 font-semibold text-amber-800">
                    <AlertTriangle className="h-4 w-4" /> {f.tipo}
                  </span>
                  <span className="shrink-0 font-semibold text-red-700">
                    {formatMxn(f.costo)}
                  </span>
                </div>
                <p className="mt-1 text-xs text-brand-tierraMuted">{f.accion}</p>
              </li>
            ))}
          </ul>

          <h4 className="mt-5 text-xs font-bold uppercase tracking-wide text-brand-tierraMuted">
            Accesos rápidos
          </h4>
          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {QUICK_LINKS.map((q) => {
              const Icon = q.icon;
              return (
                <Link
                  key={q.href}
                  href={q.href}
                  className="group flex items-start gap-3 rounded-lg border border-brand-tierra/10 bg-brand-cream/60 p-3 transition hover:border-brand-gold hover:bg-white"
                >
                  <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-green">
                    <Icon className="h-4 w-4 text-brand-goldLight" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-brand-tierra">
                      {q.label}
                    </span>
                    <span className="block text-xs text-brand-tierraMuted">{q.desc}</span>
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}