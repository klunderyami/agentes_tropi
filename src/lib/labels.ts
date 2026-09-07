import type {
  EstadoConversacion,
  EstadoPropuesta,
  LeadEstado,
  LeadNivel,
  LeadOrigen,
  Producto,
  Semaforo,
  TipoMedia,
} from '@/lib/types';

/** Mapas de etiquetas es-MX para los valores del dominio. */

export const nivelLabels: Record<LeadNivel, string> = {
  patronal_supremo: 'Patrón Supremo',
  hosteleria: 'Hostelería',
  kit_prueba: 'Kit Prueba',
};

export const origenLabels: Record<LeadOrigen, string> = {
  meta_ads: 'Meta Ads',
  google_ads: 'Google Ads',
  instagram: 'Instagram',
  whatsapp_broadcast: 'WhatsApp',
  referral: 'Referido',
  web_form: 'Formulario',
};

export const estadoLabels: Record<LeadEstado, string> = {
  nuevo: 'Nuevo',
  en_oferta: 'En oferta',
  negociando: 'Negociando',
  aceptado: 'Aceptado',
  cerrado: 'Cerrado',
  perdido: 'Perdido',
  lista_espera: 'Lista de espera',
};

export const propuestaLabels: Record<EstadoPropuesta, string> = {
  sin_enviar: 'Sin enviar',
  enviada: 'Enviada',
  vista: 'Vista',
  aceptada: 'Aceptada',
  rechazada: 'Rechazada',
  pausada: 'Pausada',
};

export const productoLabels: Record<Producto, string> = {
  jugo_cana: 'Jugo de Caña',
  torito_cacahuate: 'Torito de Cacahuate',
  cafe: 'Café',
  coco: 'Coco',
  aguardiente: 'Aguardiente',
};

export const tipoMediaLabels: Record<TipoMedia, string> = {
  imagen: 'Imagen',
  carrusel: 'Carrusel',
  reel_script: 'Guión de Reel',
  video: 'Video',
};

export const semaforoLabels: Record<Semaforo, string> = {
  ok: 'OK',
  warn: 'Atención',
  error: 'Con error',
};

export const canalLabels: Record<string, string> = {
  whatsapp: 'WhatsApp',
  instagram: 'Instagram',
  manychat: 'ManyChat',
};

export const estadoConversacionLabels: Record<EstadoConversacion, string> = {
  activa: 'Activa',
  resuelta: 'Resuelta',
  cerrada: 'Cerrada',
};