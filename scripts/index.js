'use strict';
/**
 * TROPICAÑA — ORQUESTADOR AUTÓNOMO CENTRAL
 *
 * Uso:
 *   node scripts/index.js --list
 *   node scripts/index.js --agent AGT-NEG-CP --input '{"zona":"Boca del Río"}'
 *   node scripts/index.js --agent lp --input 'Brief en lenguaje natural'
 *
 * `--agent` acepta el ID formal (AGT-NEG-LP) o el alias corto (lp, cp, ca, ...).
 * Carga el System Prompt del agente (.md), lo envía a Anthropic y devuelve
 * la salida JSON/Markdown solicitada por cada agente.
 */
const { loadEnv } = require('./src/env');
loadEnv();

const { catalog, getAgent, loadPrompt } = require('./src/agents');
const { askAnthropic } = require('./src/providers/anthropic');
const { parseArgs, safeJsonParse, outJson } = require('./src/utils');

/**
 * Payload de demostracion local para el modulo 03-Ads (contrato de salida)
 * sin llamar a Anthropic. Muestra estructura de campana y metricas de ROAS.
 */
function buildAdsDemoPayload(agent, input) {
  const cta = 'https://wa.me/52XXXXXXXXXX?text=TORITO';
  const base = { modo: 'DEMO_LOCAL', modulo: '03-ads', agente: agent.id, alias: agent.alias, nombre: agent.name, input: input || null };
  const nucleo = {
    anclaje_valor: '3 niveles siempre presentes: Patronal Supremo / Hosteleria / Kit Prueba',
    escasez_lote: 'lote artesanal por temporada + cupos reales por zona (TROPI_ZONAS_ACTIVAS)',
    atribucion: 'conversion instantanea por WhatsApp (wa.me) o checkout web por DM',
  };
  switch (agent.alias) {
    case 'ma':
      return Object.assign({}, base, {
        nucleo,
        campana: { nombre: 'MA|VeracruzCentro|Conversions|Kit|2026', objetivo: 'Conversions - Lead por mensaje', estructura: 'ABO (3 ad sets)' },
        ad_sets: [
          { nombre: 'Frio_7km', tipo: 'prospeccion fria', presupuesto_mxn_diario: 300, radio_km: 7, audiencia: '16-65 radio Veracruz Centro' },
          { nombre: 'Calor_visitantes', tipo: 'calor', presupuesto_mxn_diario: 200, radio_km: 10, audiencia: 'visito web 30d' },
          { nombre: 'Retarget_wa', tipo: 'retarget', presupuesto_mxn_diario: 150, radio_km: 10, audiencia: 'abrio WA < 7d' },
        ],
        creativos: [
          { tipo: 'video_sensorial_15s', fuente: 'AGT-SOC-IR', hook: 'hielo + condensacion + textura cremosa del torito' },
          { tipo: 'estatica_1x1', copy: 'Torito de Cacahuate artesanal, lote fresco', cta: 'Escribe TORITO' },
        ],
        producto: { linea: 'Torito de Cacahuate + Licores de Cana', temporada: 'lote artesanal por temporada' },
        escasez: { zona: 'Veracruz Centro', cupos_disponibles: 6, cupos_totales: 12 },
        atribucion: { canal: 'whatsapp_instantaneo', checkout_web: 'link de pago por DM', utm: 'utm_source=meta&utm_medium=ads&utm_campaign=retarget_torito', eventos_pixel: ['ViewContent', 'Lead', 'InitiateCheckout'] },
        metricas_roas: { gasto_diario_mxn: 650, leads_esperados: 18, cac_esperado_mxn: 36, roas_proyectado: 3.4, cvr_esperado_wa: '1 de cada 4 clics conversa por WhatsApp' },
        cta,
      });
    case 'ga':
      return Object.assign({}, base, {
        nucleo,
        campana: { nombre: 'Tropi_Search_Veracruz', tipo: 'Search + Display + YouTube', objetivo: 'demanda local' },
        grupos: [
          { nombre: 'compra_local', keywords: ['jugo de cana veracruz', 'torito artesanal veracruz'], rsa: 'Kit desde $X | Hosteleria a granel' },
          { nombre: 'hosteleria', keywords: ['proveedor licor de cana negocio', 'torito para barra'], rsa: '+65% margen por copeo | Prensado en frio' },
        ],
        negativas: ['sirope', 'jarabe', 'enlatado', 'bote'],
        atribucion: { canal: 'whatsapp', checkout_web: 'landing de oferta por zona' },
        metricas_roas: { roas_busqueda: 4.1, cac_busqueda_mxn: 28, roas_display: 2.2, cac_display_mxn: 45 },
        cta,
      });
    case 'al':
      return Object.assign({}, base, {
        nucleo,
        reporte: { periodo: '2026-semana', gasto_mxn: 4550, leads: 130, cerrados: 38, ingresos_mxn: 15400 },
        por_zona: [
          { zona: 'Veracruz Centro', cac_mxn: 35, cvr: 31, roas: 3.9, cupos: { vendidos: 8, disponibles: 4 } },
          { zona: 'Coatzacoalcos', cac_mxn: 52, cvr: 24, roas: 2.6, cupos: { vendidos: 5, disponibles: 7 } },
        ],
        fugas: [
          { tipo: 'sin_respuesta_24h', costo_mxn: 480, accion: 'WT responde < 5 min' },
          { tipo: 'frecuencia_meta_2.9', costo_mxn: 210, accion: 'pausar retarget' },
        ],
        acciones: ['+30% presupuesto Kit Veracruz Centro', 'Pausar retarget Coatzacoalcos hasta nuevo lote'],
        metricas_roas: { roas_global: 3.42, cac_promedio_mxn: 41, ltv_hosteleria: '3x', ltv_patronal: '6x' },
        cta,
      });
    case 'ca':
      return Object.assign({}, base, {
        nucleo,
        campana: 'MA|VeracruzCentro|Conversions|Kit',
        idea_visual: 'Torito cremoso empanando el vaso en camara lenta',
        piezas: [
          { superficie: 'feed_1x1', copy: 'Lote fresco de torito artesanal', texto_imagen: 'Torito HOY en Veracruz Centro', cta: 'Escribe TORITO', spec: '1080x1080 macro con hielo' },
          { superficie: 'reels_9x16', guion: '0-3s chorro cremoso; 3-8s nivel ancla; 8-15s cupo + CTA', cta: 'Escribe TORITO', spec: '1080x1920 15s 60fps' },
        ],
        paleta: ['cana', 'miel', 'crema', 'cacahuate'],
        atribucion: { canal: 'whatsapp', checkout_web: 'CTA a wa.me con texto TORITO' },
        metricas_roas: { ctr_esperado_video: '>1.2%', roas_creativo_esperado: 3.1 },
        cta,
      });
    case 'mz':
      return Object.assign({}, base, {
        nucleo,
        mapa: {
          'Veracruz Centro': { radio_km: 7, nivel_ancla: 'kit_prueba', cupos: { total: 12, disponibles: 6 }, estado: 'activa' },
          'Boca del Rio': { radio_km: 8, nivel_ancla: 'hosteleria', cupos: { total: 12, disponibles: 4 }, estado: 'activa' },
          'Poza Rica': { radio_km: 10, nivel_ancla: 'patronal_supremo', cupos: { total: 5, disponibles: 0 }, estado: 'pausada_saturacion' },
        },
        decision: 'pausar Poza Rica hasta nuevo lote; reforzar Boca del Rio jueves-viernes',
        metricas_roas: { roas_por_nivel_ancla: { kit_prueba: 3.0, hosteleria: 3.8, patronal_supremo: 2.4 } },
        cta,
      });
    default:
      return Object.assign({}, base, { nucleo, nota: 'Payload de ads generico (sin caso especifico).', cta });
  }
}
/**
 * Payload de demostracion local (contrato de salida) sin llamar a Anthropic.
 * Se activa con TROPI_DEMO=1 o con el flag --demo. Util para validar la
 * resolucion de alias, la carga del prompt y el formato de salida cuando la
 * ANTHROPIC_API_KEY aun no es valida.
 */
function buildDemoPayload(agent, input) {
  if (agent.module === 'AGT-ADS') return buildAdsDemoPayload(agent, input);
  const cta = 'https://wa.me/52XXXXXXXXXX?text=TORITO';
  return {
    modo: 'DEMO_LOCAL',
    agente: agent.id,
    alias: agent.alias,
    nombre: agent.name,
    input: input || null,
    nota: 'Demo generado en local sin Anthropic. Sustituya ANTHROPIC_API_KEY en .env para generar el payload real.',
    estructura: {
      gancho: '0-3s: interrupcion de patron visual/emocional en el scroll (hielo+chorro espeso)',
      reel: ['hook 0-3s', 'desarrollo 3-12s', 'anclaje de niveles 12-18s', 'CTA 18-22s'],
      caption: 'caption con disparadores sensoriales: frialdad del hielo, textura cremosa del torito, aroma a cacao/cacahuate',
      reciprocidad: 'recetario de toritos a cambio del numero de WhatsApp (valor primero, dato despues)',
      manychat: 'triggerManyChatFlow({ subscriberId, flowId: "flow_torito_captura" })',
    },
    cta,
  };
}
async function main() {
  const args = parseArgs(process.argv.slice(2));

  // --list : imprime el catálogo completo
  if (args.list) {
    outJson(catalog());
    return;
  }

  const id = args.agent;
  if (!id) {
    console.error(
      'Uso:\n  node scripts/index.js --list\n' +
        "  node scripts/index.js --agent AGT-NEG-WT --input '{\"zona\":\"Boca del Río\"}'\n" +
        "  node scripts/index.js --agent lp --input 'Brief en lenguaje natural'\n" +
        'Alias cortos disponibles: cp, lp, ca, wt, pc, fg, vh, ir, sc, sw, ps, md,\n' +
        '  ma, ga, al, mz, tc, as, wa, fm, co, wd, cc, cv, ha, rp, ck, vm, sa, cs, fq, gg\n',
    );
    process.exit(1);
  }

  const agent = getAgent(id);
  const system = loadPrompt(agent);

  // El input puede llegar como JSON string o como texto libre (brief en
  // lenguaje natural). Si es JSON válido, se normaliza serializado; si no,
  // se envía tal cual sin romper el flujo.
  const rawInput = args.input ?? null;
  let userInput = rawInput;
  if (rawInput !== null && rawInput !== undefined) {
    try {
      const parsed = safeJsonParse(rawInput, 'input de usuario');
      if (parsed !== null) userInput = JSON.stringify(parsed);
    } catch (err) {
      // No es JSON (ej. un brief en lenguaje natural): usar el texto tal cual.
      userInput = rawInput;
    }
  }

  const demoMode = process.env.TROPI_DEMO === '1' || Boolean(args.demo);
  if (demoMode) {
    outJson(buildDemoPayload(agent, userInput));
    return;
  }

  if (process.env.TROPI_DEBUG === '1') {
    outJson({ agent: agent.id, name: agent.name, promptFile: agent.file, input: userInput });
  }

  const result = await askAnthropic({ system, user: userInput || 'Ejecuta tu diagnóstico estándar sobre la zona activa actual.' });
  console.log(result.text);
}

main().catch((err) => {
  console.error('✖', err.message);
  process.exit(1);
});