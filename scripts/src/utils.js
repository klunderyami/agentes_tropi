'use strict';

/** Parseo de argumentos CLI: --key value  o  --flag */
function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const token = argv[i];
    if (!token.startsWith('--')) continue;
    const key = token.slice(2);
    const next = argv[i + 1];
    if (next && !next.startsWith('--')) {
      args[key] = next;
      i++;
    } else {
      args[key] = true;
    }
  }
  return args;
}

/** Lanza error si falta una variable de entorno requerida. */
function requireEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Falta la variable de entorno: ${name} (revisa .env / .env.example)`);
  return value;
}

/** Parseo seguro de JSON con mensaje contextual. */
function safeJsonParse(str, context = 'entrada') {
  if (!str) return null;
  try {
    return JSON.parse(str);
  } catch (err) {
    throw new Error(`El ${context} no es JSON válido: ${err.message}`);
  }
}

/** Impresión limpia de JSON en consola. */
function outJson(obj) {
  console.log(JSON.stringify(obj, null, 2));
}

module.exports = { parseArgs, requireEnv, safeJsonParse, outJson };