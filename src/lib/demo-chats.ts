import { isoAgo } from '@/lib/demo-utils';
import type { Conversacion } from '@/lib/types';

/**
 * Conversaciones de ejemplo: WhatsApp Cloud API (es_MX) e Instagram/ManyChat,
 * con respuestas automáticas de agentes (AGT-NEG-WT / AGT-SOC-MD) y estados.
 */
export const demoConversations: Conversacion[] = [
  {
    id: 'conv_wa_01',
    canal: 'whatsapp',
    nombre: 'María Fernanda',
    handle: '+5212283401122',
    agente: 'AGT-NEG-WT',
    estado: 'activa',
    zona: 'Boca del Río',
    nivel: 'kit_prueba',
    updated_at: isoAgo(3),
    mensajes: [
      {
        id: 'm1',
        rol: 'lead',
        texto: 'Hola, vi el anuncio del juguito de caña 🥤 ¿a cómo es?',
        ts: isoAgo(38),
        tipo: 'texto',
      },
      {
        id: 'm2',
        rol: 'agente',
        agente: 'AGT-NEG-WT',
        texto:
          '¡Qué gusto, María! 👋 Tropicaña se prensa frente a ti, el vaso se empaña del frío antes de pelear el precio. 3 niveles: Patronal Supremo (a granel) · Hostelería (+65% margen por copeo) · Kit Prueba de entrada. ¿A cuál le apuntas?',
        ts: isoAgo(36),
        tipo: 'template',
      },
      {
        id: 'm3',
        rol: 'lead',
        texto: 'Pues el Kit Prueba para probar con mi familia',
        ts: isoAgo(12),
        tipo: 'texto',
      },
      {
        id: 'm4',
        rol: 'agente',
        agente: 'AGT-NEG-WT',
        texto:
          'Bien decidido 🤝 10 litros de Kit a $45 el litro = $450. Quedan 5 de 12 cupos para Boca del Río y la prensa sale mañana 7 am. ¿Te lo aparto con nombre y colonia?',
        ts: isoAgo(11),
        tipo: 'auto_reply',
      },
      {
        id: 'm5',
        rol: 'lead',
        texto: 'Sí, María Fernanda, Boca del Río centro 🙌',
        ts: isoAgo(3),
        tipo: 'texto',
      },
    ],
  },
  {
    id: 'conv_wa_02',
    canal: 'whatsapp',
    nombre: 'Don Toño Guzmán',
    handle: '+522281234567',
    agente: 'AGT-NEG-WT',
    estado: 'cerrada',
    zona: 'Poza Rica',
    nivel: 'hosteleria',
    updated_at: isoAgo(260),
    mensajes: [
      {
        id: 'd1',
        rol: 'agente',
        agente: 'AGT-NEG-WT',
        texto:
          'Don Toño, su fonda pierde ~$2,100/sem comprando embotellado. Con Hoste se queda +65% de ese margen. 3 garrafas sábado 7 am?',
        ts: isoAgo(300),
        tipo: 'texto',
      },
      {
        id: 'd2',
        rol: 'lead',
        texto: 'Sale, 3 garrafas para el sábado',
        ts: isoAgo(262),
        tipo: 'texto',
      },
      {
        id: 'd3',
        rol: 'agente',
        agente: 'AGT-NEG-WT',
        texto: 'Hecho ✅ Pedido confirmado: 3 garrafas · Poza Rica · sábado 7 am. ¡Que le vaya bonito!',
        ts: isoAgo(260),
        tipo: 'nota',
      },
    ],
  },
  {
    id: 'conv_ig_01',
    canal: 'instagram',
    nombre: '@palmodelmuelle',
    handle: '@palmodelmuelle',
    agente: 'AGT-SOC-MD',
    estado: 'activa',
    zona: 'Veracruz Centro',
    updated_at: isoAgo(8),
    mensajes: [
      {
        id: 'i1',
        rol: 'lead',
        texto: '¿MandAs a todo Veracruz? Me interesa para la palapa del muelle',
        ts: isoAgo(70),
        tipo: 'texto',
      },
      {
        id: 'i2',
        rol: 'agente',
        agente: 'AGT-SOC-MD',
        texto:
          '¡Hola! 🌴 Sí: Boca del Río, Veracruz Centro, Xalapa y más. Todo sea por DM con el código CAÑA y te conecta el equipo de cierre al instante.',
        ts: isoAgo(64),
        tipo: 'auto_reply',
      },
      {
        id: 'i3',
        rol: 'lead',
        texto: 'CAÑA 🙌 escríbanme a mi whatsapp',
        ts: isoAgo(8),
        tipo: 'texto',
      },
    ],
  },
  {
    id: 'conv_mc_01',
    canal: 'manychat',
    nombre: 'Campaña Broadcast Xalapa',
    handle: '@broadcast_xalapa',
    agente: 'AGT-SOC-MD',
    estado: 'resuelta',
    zona: 'Xalapa',
    updated_at: isoAgo(90),
    mensajes: [
      {
        id: 'b1',
        rol: 'sistema',
        texto: 'Broadcast enviado a 1,240 contactos (es_MX) — ManyChat',
        ts: isoAgo(96),
        tipo: 'nota',
      },
      {
        id: 'b2',
        rol: 'lead',
        texto: 'Quedan cupos de Kit Prueba para Xalapa?',
        ts: isoAgo(92),
        tipo: 'texto',
      },
      {
        id: 'b3',
        rol: 'agente',
        agente: 'AGT-SOC-MD',
        texto:
          'Para Xalapa quedan 6 de 12. Escribe KIT y te pasa el dato de entrega directo. 🎯',
        ts: isoAgo(90),
        tipo: 'auto_reply',
      },
    ],
  },
];