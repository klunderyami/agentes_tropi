'use client';
import { RefreshCw, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { EmptyState } from '@/components/admin/EmptyState';
import { MediaCard } from '@/components/admin/MediaCard';
import { SourceBadge } from '@/components/admin/SourceBadge';
import { useToast } from '@/components/admin/toast';
import { useMediaAssets } from '@/hooks/use-media-assets';
import { slugify } from '@/lib/format';
import { productoLabels, tipoMediaLabels } from '@/lib/labels';
import type { MediaAsset, Producto, TipoMedia } from '@/lib/types';

const PRODUCTOS: ('todos' | Producto)[] = [
  'todos',
  'jugo_cana',
  'torito_cacahuate',
  'cafe',
  'coco',
  'aguardiente',
];

const TIPOS: ('todos' | TipoMedia)[] = ['todos', 'imagen', 'carrusel', 'reel_script', 'video'];

export default function MediaPage() {
  const { assets, fuente, reload } = useMediaAssets();
  const { notify } = useToast();
  const [producto, setProducto] = useState<'todos' | Producto>('todos');
  const [tipo, setTipo] = useState<'todos' | TipoMedia>('todos');
  const [q, setQ] = useState('');

  const filtered = useMemo(
    () =>
      assets.filter((a) => {
        const okP = producto === 'todos' || a.producto === producto;
        const okT = tipo === 'todos' || a.tipo === tipo;
        const term = q.trim().toLowerCase();
        const okQ =
          !term ||
          a.titulo.toLowerCase().includes(term) ||
          (a.copy ?? '').toLowerCase().includes(term) ||
          (a.agente ?? '').toLowerCase().includes(term);
        return okP && okT && okQ;
      }),
    [assets, producto, tipo, q],
  );

  const copiarCopy = async (asset: MediaAsset) => {
    try {
      await navigator.clipboard.writeText(asset.copy);
      notify(`Copy copiado al portapapeles: "${asset.titulo}"`, 'success');
    } catch {
      notify('Tu navegador no permitió copiar el portapapeles', 'error');
    }
  };

  const descargar = (asset: MediaAsset) => {
    if (asset.url) {
      window.open(asset.url, '_blank', 'noopener,noreferrer');
      notify(`Abriendo recurso "${asset.titulo}"`, 'info');
      return;
    }
    const contenido = [
      `# ${asset.titulo}`,
      '',
      `Tipo: ${tipoMediaLabels[asset.tipo]}`,
      `Producto: ${productoLabels[asset.producto]}`,
      `Agente: ${asset.agente}`,
      `Creado: ${asset.creado_en}`,
      '',
      '## Copy',
      asset.copy ?? '(sin copy)',
    ].join('\n');
    const blob = new Blob([contenido], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${slugify(asset.titulo)}.md`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    notify(`Descargado: ${a.download}`, 'success');
  };

  return (
    <div className="space-y-5">
      {/* Encabezado */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-brand-tierraMuted">
          <span className="font-semibold text-brand-tierra">{filtered.length}</span> de{' '}
          {assets.length} activos generados por los agentes de Contenido
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <SourceBadge fuente={fuente} />
          <button type="button" onClick={reload} className="btn-ghost !px-3 !py-1.5 text-xs">
            <RefreshCw className="h-3.5 w-3.5" /> Refrescar
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="card grid grid-cols-1 gap-3 p-4 md:grid-cols-3">
        <div className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-brand-tierraMuted">
            Producto
          </span>
          <select
            value={producto}
            onChange={(e) => setProducto(e.target.value as 'todos' | Producto)}
            className="input-admin"
          >
            {PRODUCTOS.map((p) => (
              <option key={p} value={p}>
                {p === 'todos' ? 'Todos' : productoLabels[p]}
              </option>
            ))}
          </select>
        </div>

        <div className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-brand-tierraMuted">
            Formato
          </span>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value as 'todos' | TipoMedia)}
            className="input-admin"
          >
            {TIPOS.map((t) => (
              <option key={t} value={t}>
                {t === 'todos' ? 'Todos' : tipoMediaLabels[t]}
              </option>
            ))}
          </select>
        </div>

        <div className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-brand-tierraMuted">
            Buscar
          </span>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-tierraMuted" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Título, copy o agente…"
              className="input-admin pl-9"
            />
          </div>
        </div>
      </div>

      {/* Feed */}
      {filtered.length === 0 ? (
        <EmptyState
          title="Sin activos con esos filtros"
          description="Prueba con otro producto, formato o limpia la búsqueda."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((asset) => (
            <MediaCard
              key={asset.id}
              asset={asset}
              onCopy={copiarCopy}
              onDownload={descargar}
            />
          ))}
        </div>
      )}
    </div>
  );
}