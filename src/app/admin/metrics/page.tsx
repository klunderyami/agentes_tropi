'use client';
import { Banknote, LineChart, Percent, RefreshCw, ShoppingCart } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Badge, type BadgeVariant } from '@/components/admin/Badge';
import { RelativeTime } from '@/components/admin/RelativeTime';
import { SourceBadge } from '@/components/admin/SourceBadge';
import { StatCard } from '@/components/admin/StatCard';
import { useMetrics } from '@/hooks/use-metrics';
import { formatMxn, formatNumber } from '@/lib/format';
import { semaforoLabels } from '@/lib/labels';
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

function semaforoVariant(s: Semaforo): BadgeVariant {
  if (s === 'ok') return 'ok';
  if (s === 'warn') return 'warn';
  return 'error';
}

function dotColor(s: Semaforo): string {
  if (s === 'ok') return 'bg-emerald-400';
  if (s === 'warn') return 'bg-amber-400';
  return 'bg-red-500';
}

function roasVariant(roas: number): BadgeVariant {
  if (roas >= 3) return 'ok';
  if (roas >= 2.5) return 'warn';
  return 'error';
}

export default function MetricsPage() {
  const { metricas, fuente, reload } = useMetrics();

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-brand-tierra">Torre de control</h2>
          <p className="text-sm text-brand-tierraMuted">Periodo reportado: {metricas.periodo}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <SourceBadge fuente={fuente} />
          <button type="button" onClick={reload} className="btn-ghost !px-3 !py-1.5 text-xs">
            <RefreshCw className="h-3.5 w-3.5" /> Refrescar
          </button>
        </div>
      </div>

      {/* KPIs */}
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
      {/* Estado de ejecución de agentes */}
      <section className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-brand-tierra/10 px-5 py-4">
          <h3 className="text-sm font-bold uppercase tracking-wide text-brand-tierra">
            Estado de ejecución en consola
          </h3>
          <Badge variant="cream">{metricas.agentes.length} agentes reportando</Badge>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead>
              <tr className="border-b border-brand-tierra/10 bg-brand-cream/70 text-xs font-semibold uppercase tracking-wide text-brand-tierraMuted">
                <th scope="col" className="px-5 py-3">Agente</th>
                <th scope="col" className="px-4 py-3">Módulo</th>
                <th scope="col" className="px-4 py-3">Semáforo</th>
                <th scope="col" className="px-4 py-3">Última ejecución</th>
                <th scope="col" className="px-4 py-3">Ejecuciones</th>
                <th scope="col" className="px-4 py-3">Latencia</th>
                <th scope="col" className="px-4 py-3">Último mensaje</th>
              </tr>
            </thead>
            <tbody>
              {metricas.agentes.map((a) => (
                <tr key={a.id} className="border-t border-brand-tierra/10 hover:bg-brand-cream/60">
                  <td className="px-5 py-3">
                    <p className="font-semibold text-brand-tierra">{a.nombre}</p>
                    <p className="text-xs text-brand-tierraMuted">{a.id}</p>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-brand-tierraMuted">{a.modulo}</td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <span className="inline-flex items-center gap-1.5">
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${dotColor(a.estado)} ${a.estado === 'error' ? 'animate-pulse' : ''}`}
                      />
                      <Badge variant={semaforoVariant(a.estado)}>{semaforoLabels[a.estado]}</Badge>
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <RelativeTime value={a.last_run} className="text-xs text-brand-tierraMuted" />
                  </td>
                  <td className="px-4 py-3 tabular-nums text-brand-tierra">{a.ejecuciones}</td>
                  <td className="whitespace-nowrap px-4 py-3 tabular-nums text-brand-tierraMuted">
                    {a.latencia_ms.toLocaleString('es-MX')} ms
                  </td>
                  <td className="max-w-xs truncate px-4 py-3 text-brand-tierraMuted">
                    {a.ultimo_mensaje}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* ROAS por zona */}
        <section className="card overflow-hidden">
          <div className="border-b border-brand-tierra/10 px-5 py-4">
            <h3 className="text-sm font-bold uppercase tracking-wide text-brand-tierra">
              ROAS por zona · Cupos
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[460px] text-left text-sm">
              <thead>
                <tr className="border-b border-brand-tierra/10 bg-brand-cream/70 text-xs font-semibold uppercase tracking-wide text-brand-tierraMuted">
                  <th scope="col" className="px-5 py-3">Zona</th>
                  <th scope="col" className="px-4 py-3">CAC</th>
                  <th scope="col" className="px-4 py-3">CVR</th>
                  <th scope="col" className="px-4 py-3">ROAS</th>
                  <th scope="col" className="px-4 py-3">Cupos</th>
                </tr>
              </thead>
              <tbody>
                {metricas.por_zona.map((z) => (
                  <tr key={z.zona} className="border-t border-brand-tierra/10 hover:bg-brand-cream/60">
                    <td className="px-5 py-3 font-medium text-brand-tierra">{z.zona}</td>
                    <td className="px-4 py-3 tabular-nums text-brand-tierraMuted">{formatMxn(z.cac)}</td>
                    <td className="px-4 py-3 tabular-nums text-brand-tierra">{z.cvr}%</td>
                    <td className="px-4 py-3">
                      <Badge variant={roasVariant(z.roas)}>{z.roas}x</Badge>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 tabular-nums text-brand-tierra">
                      {z.cupos_vendidos}/{z.cupos_vendidos + z.cupos_disponibles}
                      <span className="ml-1 text-xs text-brand-tierraMuted">
                        ({z.cupos_disponibles} libres)
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        {/* Fugas */}
        <section className="card p-5">
          <h3 className="text-sm font-bold uppercase tracking-wide text-brand-tierra">
            Fugas de dinero
          </h3>
          <ul className="mt-4 space-y-2.5">
            {metricas.fugas.map((f) => (
              <li key={f.tipo} className="rounded-lg border border-amber-200 bg-amber-50/70 p-3">
                <div className="flex items-center justify-between gap-2 text-sm">
                  <span className="font-semibold text-amber-800">{f.tipo}</span>
                  <span className="shrink-0 font-semibold text-red-700">{formatMxn(f.costo)}</span>
                </div>
                <p className="mt-1 text-xs text-brand-tierraMuted">{f.accion}</p>
              </li>
            ))}
            {metricas.fugas.length === 0 && (
              <p className="text-sm text-brand-tierraMuted">Sin fugas detectadas. 🎉</p>
            )}
          </ul>

          <div className="mt-5 rounded-lg bg-brand-green p-4 text-brand-cream">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-goldLight">
              Regla del agente AL
            </p>
            <p className="mt-1 text-sm">
              Un tablero, tres números (CAC, ROAS, CVR) y una sola acción por campaña. Nada
              se informa sin una decisión.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}