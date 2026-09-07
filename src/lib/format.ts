/** Helpers de formato es-MX para el dashboard. */

export function formatMxn(value: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number, decimals = 1): string {
  return new Intl.NumberFormat('es-MX', {
    maximumFractionDigits: decimals,
  }).format(value);
}

function toDate(iso: string): Date {
  return new Date(iso.endsWith('Z') ? iso : `${iso}Z`);
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - toDate(iso).getTime();
  const seg = Math.round(diff / 1000);
  if (seg < 60) return 'ahora mismo';
  const min = Math.round(seg / 60);
  if (min < 60) return `hace ${min} min`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `hace ${hr} h`;
  const day = Math.round(hr / 24);
  return `hace ${day} d`;
}

export function formatDateTime(iso: string): string {
  return toDate(iso).toLocaleString('es-MX', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatTime(iso: string): string {
  return toDate(iso).toLocaleTimeString('es-MX', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}