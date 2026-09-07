'use client';
import {
  Clapperboard,
  Coffee,
  Copy,
  Download,
  Film,
  Flame,
  GlassWater,
  Image as ImageIcon,
  Images,
  Leaf,
  Martini,
  Package,
  Video,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { productoLabels, tipoMediaLabels } from '@/lib/labels';
import type { MediaAsset, Producto, TipoMedia } from '@/lib/types';

const productIcon: Record<Producto, LucideIcon> = {
  jugo_cana: GlassWater,
  torito_cacahuate: Martini,
  cafe: Coffee,
  coco: Leaf,
  aguardiente: Flame,
};

const productGradient: Record<Producto, string> = {
  jugo_cana: 'from-emerald-700 to-brand-greenDarker',
  torito_cacahuate: 'from-amber-700 to-amber-950',
  cafe: 'from-amber-900 to-stone-900',
  coco: 'from-emerald-500 to-emerald-900',
  aguardiente: 'from-amber-600 to-red-900',
};

const typeIcon: Record<TipoMedia, LucideIcon> = {
  imagen: ImageIcon,
  carrusel: Images,
  reel_script: Clapperboard,
  video: Film,
};

export function MediaCard({
  asset,
  onCopy,
  onDownload,
}: {
  asset: MediaAsset;
  onCopy: (asset: MediaAsset) => void;
  onDownload: (asset: MediaAsset) => void;
}) {
  const Icon = productIcon[asset.producto] ?? Package;
  const TypeIcon = typeIcon[asset.tipo] ?? Video;
  const gradient = productGradient[asset.producto] ?? productGradient.jugo_cana;

  return (
    <div className="card group flex flex-col overflow-hidden">
      {/* Vista previa */}
      <div className="relative">
        {asset.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={asset.url}
            alt={asset.titulo}
            className="h-44 w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div
            className={`flex h-44 w-full items-center justify-center bg-gradient-to-br ${gradient}`}
          >
            <Icon className="h-12 w-12 text-white/85 drop-shadow" />
          </div>
        )}
        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/55 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur">
          <TypeIcon className="h-3 w-3" /> {tipoMediaLabels[asset.tipo]}
        </span>
        {asset.duracion_seg !== undefined && (
          <span className="absolute bottom-3 left-3 rounded bg-black/55 px-1.5 py-0.5 text-[11px] font-medium text-white">
            {asset.duracion_seg}s
          </span>
        )}
      </div>

      {/* Contenido */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="text-sm font-semibold leading-tight text-brand-tierra">
            {asset.titulo}
          </h3>
          <p className="mt-0.5 text-xs text-brand-tierraMuted">
            {productoLabels[asset.producto]} · {asset.agente}
            {asset.plataforma ? ` · ${asset.plataforma}` : ''}
          </p>
        </div>

        <p className="line-clamp-3 text-sm leading-relaxed text-brand-tierra/85">
          {asset.copy}
        </p>

        {asset.texto_pantalla && asset.texto_pantalla.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {asset.texto_pantalla.map((t) => (
              <span
                key={t}
                className="rounded bg-brand-gold/15 px-1.5 py-0.5 text-[11px] font-semibold text-brand-goldDark"
              >
                {t}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto flex gap-2 pt-1">
          <button onClick={() => onCopy(asset)} className="btn-ghost flex-1 !px-2 !py-1.5 text-xs">
            <Copy className="h-3.5 w-3.5" /> Copiar copy
          </button>
          <button
            onClick={() => onDownload(asset)}
            className="btn-ghost flex-1 !px-2 !py-1.5 text-xs"
          >
            <Download className="h-3.5 w-3.5" /> Descargar
          </button>
        </div>
      </div>
    </div>
  );
}