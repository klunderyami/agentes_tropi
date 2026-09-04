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