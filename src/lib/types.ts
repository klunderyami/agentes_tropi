/**
 * Tipos de dominio del Dashboard de Tropicaña, alineados con los contratos de
 * salida de los agentes (prompts/…) y con las tablas operativas de Supabase.
 */

/* ------------------------------------------------------------------ */
/* Módulo 1 — Pipeline de Leads B2B                                   */
/* ------------------------------------------------------------------ */

export type LeadNivel = 'patronal_supremo' | 'hosteleria' | 'kit_prueba';

export type LeadEstado =
  | 'nuevo'
  | 'en_oferta'
  | 'negociando'
  | 'aceptado'
  | 'cerrado'
  | 'perdido'
  | 'lista_espera';

export type LeadOrigen =
  | 'meta_ads'
  | 'google_ads'
  | 'instagram'
  | 'whatsapp_broadcast'
  | 'referral'
  | 'web_form';

export type EstadoPropuesta =
  | 'sin_enviar'
  | 'enviada'
  | 'vista'
  | 'aceptada'
  | 'rechazada'
  | 'pausada';

export interface Lead {
  phone: string;
  name: string;
  zona: string;
  origen: LeadOrigen;
  nivel: LeadNivel;
  estado: LeadEstado;
  /** Estado de la propuesta B2B (enviada por WhatsApp, vista, aceptada…). */
  estado_propuesta?: EstadoPropuesta;
  /** Lead Score 0–100 (señales: velocidad, pregunta precios, entrega el mismo día…). */
  score: number;
  nota?: string;
  /** Valor estimado del pedido en MXN. */
  valor_estimado?: number;
  creado_en?: string;
  updated_at?: string;
}

/* ------------------------------------------------------------------ */
/* Módulo 2 — Centro de Mensajes & WhatsApp                            */
/* ------------------------------------------------------------------ */

export type CanalChat = 'whatsapp' | 'instagram' | 'manychat';
export type EstadoConversacion = 'activa' | 'resuelta' | 'cerrada';

export interface ChatMensaje {
  id: string;
  rol: 'lead' | 'agente' | 'sistema';
  /** ID del agente que respondió, p. ej. AGT-NEG-WT / AGT-SOC-MD. */
  agente?: string;
  texto: string;
  ts: string;
  tipo?: 'texto' | 'template' | 'auto_reply' | 'nota';
}

export interface Conversacion {
  id: string;
  canal: CanalChat;
  nombre: string;
  /** Teléfono E.164 (WhatsApp) o @usuario (Instagram/ManyChat). */
  handle: string;
  agente: string;
  estado: EstadoConversacion;
  zona?: string;
  nivel?: LeadNivel;
  mensajes: ChatMensaje[];
  updated_at: string;
}

/* ------------------------------------------------------------------ */
/* Módulo 3 — Galería de Activos Multimedia                            */
/* ------------------------------------------------------------------ */

export type TipoMedia = 'imagen' | 'carrusel' | 'reel_script' | 'video';

export type Producto =
  | 'jugo_cana'
  | 'torito_cacahuate'
  | 'cafe'
  | 'coco'
  | 'aguardiente';

export interface MediaAsset {
  id: string;
  titulo: string;
  tipo: TipoMedia;
  producto: Producto;
  /** Agente generador: AGT-CON-CC / AGT-CON-CV / AGT-CON-HA / AGT-CON-RP / AGT-CON-VM. */
  agente: string;
  copy: string;
  url?: string;
  duracion_seg?: number;
  plataforma?: string;
  texto_pantalla?: string[];
  tags: string[];
  creado_en: string;
}

/* ------------------------------------------------------------------ */
/* Módulo 4 — Torre de Control de Agentes & Ads                        */
/* ------------------------------------------------------------------ */

export type Semaforo = 'ok' | 'warn' | 'error';

export interface KpiResumen {
  clave: 'cr' | 'cac' | 'aov' | 'roas';
  etiqueta: string;
  valor: number;
  unidad: '%' | 'MXN' | 'x' | '';
  tendencia: number;
  semaforo: Semaforo;
  nota?: string;
}

export interface MetricPorZona {
  zona: string;
  cac: number;
  cvr: number;
  roas: number;
  cupos_vendidos: number;
  cupos_disponibles: number;
}

export interface FugaMetrica {
  tipo: string;
  costo: number;
  accion: string;
}

export interface EstadoAgente {
  id: string;
  nombre: string;
  modulo: string;
  estado: Semaforo;
  last_run: string;
  ejecuciones: number;
  latencia_ms: number;
  ultimo_mensaje: string;
}

export interface MetricasEjecutivas {
  periodo: string;
  kpis: KpiResumen[];
  por_zona: MetricPorZona[];
  fugas: FugaMetrica[];
  agentes: EstadoAgente[];
}

export type FuenteDatos = 'supabase' | 'demo';