'use client';
import { FilterX, RefreshCw, Search, Send } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Badge, type BadgeVariant } from '@/components/admin/Badge';
import { EmptyState } from '@/components/admin/EmptyState';
import { ScoreBar } from '@/components/admin/ScoreBar';
import { SourceBadge } from '@/components/admin/SourceBadge';
import { useToast } from '@/components/admin/toast';
import { useLeads } from '@/hooks/use-leads';
import { estadoLabels, nivelLabels, origenLabels, propuestaLabels } from '@/lib/labels';
import { getSupabaseClient } from '@/lib/supabase';
import { formatMxn } from '@/lib/format';
import type { EstadoPropuesta, Lead, LeadEstado } from '@/lib/types';

function propuestaVariant(p: EstadoPropuesta): BadgeVariant {
  switch (p) {
    case 'aceptada':
      return 'ok';
    case 'enviada':
      return 'gold';
    case 'vista':
      return 'cream';
    case 'rechazada':
      return 'red';
    case 'pausada':
      return 'warn';
    default:
      return 'neutral';
  }
}

const ESTADOS_PRO: EstadoPropuesta[] = [
  'sin_enviar',
  'enviada',
  'vista',
  'aceptada',
  'rechazada',
  'pausada',
];

export default function LeadsPage() {
  const { leads, setLeads, fuente, reload } = useLeads();
  const { notify } = useToast();

  const [q, setQ] = useState('');
  const [minScore, setMinScore] = useState(0);
  const [propuesta, setPropuesta] = useState<'todas' | EstadoPropuesta>('todas');
  const [estadoFiltro, setEstadoFiltro] = useState<'todos' | LeadEstado>('todos');
  const [resending, setResending] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      leads.filter((l) => {
        const term = q.trim().toLowerCase();
        const okQ =
          !term ||
          l.name.toLowerCase().includes(term) ||
          l.phone.includes(term) ||
          (l.zona ?? '').toLowerCase().includes(term);
        const okScore = (l.score ?? 0) >= minScore;
        const okProp = propuesta === 'todas' || (l.estado_propuesta ?? 'sin_enviar') === propuesta;
        const okEstado = estadoFiltro === 'todos' || l.estado === estadoFiltro;
        return okQ && okScore && okProp && okEstado;
      }),
    [leads, q, minScore, propuesta, estadoFiltro],
  );

  const changeEstado = async (lead: Lead, nuevo: LeadEstado) => {
    const next = { ...lead, estado: nuevo, updated_at: new Date().toISOString() };
    setLeads((prev) => prev.map((l) => (l.phone === lead.phone ? next : l)));
    const client = getSupabaseClient();
    if (!client) {
      notify(`${lead.name} → ${estadoLabels[nuevo]} (demo)`, 'info');
      return;
    }
    try {
      const { error } = await client
        .from('leads')
        .upsert(
          { phone: lead.phone, estado: nuevo, updated_at: new Date().toISOString() },
          { onConflict: 'phone' },
        );
      if (error) throw error;
      notify(`${lead.name} → ${estadoLabels[nuevo]} en Supabase`, 'success');
    } catch (e) {
      notify(
        `No se pudo actualizar en Supabase: ${e instanceof Error ? e.message : 'error'}`,
        'error',
      );
    }
  };

  const resendProposal = async (lead: Lead) => {
    setResending(lead.phone);
    try {
      const res = await fetch('/api/leads/resend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: lead.phone, name: lead.name, nota: lead.nota }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (data.ok) {
        setLeads((prev) =>
          prev.map((l) =>
            l.phone === lead.phone
              ? {
                  ...l,
                  estado_propuesta: 'enviada' as EstadoPropuesta,
                  updated_at: new Date().toISOString(),
                }
              : l,
          ),
        );
        notify(`Propuesta B2B reenviada a ${lead.name} · WhatsApp es_MX`, 'success');
      } else {
        notify(data.error ?? 'No se pudo reenviar la propuesta', 'error');
      }
    } catch {
      notify('Error de red al reenviar la propuesta', 'error');
    } finally {
      setResending(null);
    }
  };

  const resetFilters = () => {
    setQ('');
    setMinScore(0);
    setPropuesta('todas');
    setEstadoFiltro('todos');
  };

  return (
    <div className="space-y-5">
      {/* Encabezado de módulo */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-brand-tierraMuted">
          <span className="font-semibold text-brand-tierra">{filtered.length}</span> de{' '}
          {leads.length} leads visibles
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <SourceBadge fuente={fuente} />
          <button type="button" onClick={reload} className="btn-ghost !px-3 !py-1.5 text-xs">
            <RefreshCw className="h-3.5 w-3.5" /> Refrescar
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="card grid grid-cols-1 gap-3 p-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-brand-tierraMuted">
            Buscar lead
          </span>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-tierraMuted" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Nombre, teléfono o zona…"
              className="input-admin pl-9"
            />
          </div>
        </div>

        <div className="block">
          <span className="mb-1 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-brand-tierraMuted">
            Lead Score mínimo <span className="text-brand-goldDark">{minScore} / 100</span>
          </span>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={minScore}
            onChange={(e) => setMinScore(Number(e.target.value))}
            className="w-full accent-brand-gold"
            aria-label="Lead score mínimo"
          />
        </div>

        <div className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-brand-tierraMuted">
            Estado de propuesta
          </span>
          <select
            value={propuesta}
            onChange={(e) => setPropuesta(e.target.value as 'todas' | EstadoPropuesta)}
            className="input-admin"
          >
            <option value="todas">Todas</option>
            {ESTADOS_PRO.map((p) => (
              <option key={p} value={p}>
                {propuestaLabels[p]}
              </option>
            ))}
          </select>
        </div>

        <div className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-brand-tierraMuted">
            Pipeline
          </span>
          <div className="flex gap-2">
            <select
              value={estadoFiltro}
              onChange={(e) => setEstadoFiltro(e.target.value as 'todos' | LeadEstado)}
              className="input-admin flex-1"
            >
              <option value="todos">Todos</option>
              {(Object.keys(estadoLabels) as LeadEstado[]).map((e) => (
                <option key={e} value={e}>
                  {estadoLabels[e]}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={resetFilters}
              className="btn-ghost !px-2.5 !py-1.5"
              title="Limpiar filtros"
            >
              <FilterX className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Tabla */}
      {filtered.length === 0 ? (
        <EmptyState
          title="Sin leads con esos filtros"
          description="Ajusta el Lead Score mínimo, el estado o limpia la búsqueda para ver más resultados."
        />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[1000px] text-left text-sm">
            <thead>
              <tr className="border-b border-brand-tierra/10 bg-brand-cream/70 text-xs font-semibold uppercase tracking-wide text-brand-tierraMuted">
                <th scope="col" className="px-4 py-3">Lead</th>
                <th scope="col" className="px-4 py-3">Zona</th>
                <th scope="col" className="px-4 py-3">Origen</th>
                <th scope="col" className="px-4 py-3">Nivel</th>
                <th scope="col" className="px-4 py-3">Score</th>
                <th scope="col" className="px-4 py-3">Estado</th>
                <th scope="col" className="px-4 py-3">Propuesta</th>
                <th scope="col" className="px-4 py-3">Valor estim.</th>
                <th scope="col" className="px-4 py-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((l) => (
                <tr
                  key={l.phone}
                  className="border-t border-brand-tierra/10 transition hover:bg-brand-cream/60"
                >
                  <td className="px-4 py-3">
                    <p className="font-semibold text-brand-tierra">{l.name}</p>
                    <p className="text-xs tabular-nums text-brand-tierraMuted">{l.phone}</p>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-brand-tierraMuted">{l.zona}</td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <Badge variant="cream">{origenLabels[l.origen] ?? l.origen}</Badge>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <Badge variant="green">{nivelLabels[l.nivel] ?? l.nivel}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <ScoreBar score={l.score ?? 0} />
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={l.estado}
                      onChange={(e) => changeEstado(l, e.target.value as LeadEstado)}
                      className="input-admin !w-40 !px-2 !py-1.5 text-xs"
                      aria-label={`Estado de ${l.name}`}
                    >
                      {(Object.keys(estadoLabels) as LeadEstado[]).map((e) => (
                        <option key={e} value={e}>
                          {estadoLabels[e]}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <Badge variant={propuestaVariant(l.estado_propuesta ?? 'sin_enviar')}>
                      {propuestaLabels[l.estado_propuesta ?? 'sin_enviar']}
                    </Badge>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 tabular-nums text-brand-tierra">
                    {l.valor_estimado ? formatMxn(l.valor_estimado) : '—'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => resendProposal(l)}
                      disabled={resending === l.phone || l.estado === 'cerrado'}
                      className="btn-ghost !px-2.5 !py-1.5 text-xs"
                      title={
                        l.estado === 'cerrado'
                          ? 'Lead cerrado: no requiere reenvío'
                          : 'Reenviar propuesta B2B por WhatsApp (es_MX)'
                      }
                    >
                      <Send className="h-3.5 w-3.5" />
                      {resending === l.phone ? 'Enviando…' : 'Reenviar'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}