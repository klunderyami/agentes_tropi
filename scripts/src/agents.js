'use strict';
const fs = require('fs');
const path = require('path');

const PROMPTS_DIR = path.join(__dirname, '..', '..', 'prompts');

const MODULES = [
  {
    folder: '01-negocio',
    prefix: 'AGT-NEG',
    agents: [
      { file: 'cp.md', name: 'Copy Principal de Conversión' },
      { file: 'lp.md', name: 'Arquitecto de Landing Page' },
      { file: 'ca.md', name: 'Comercial / CRM de Leads' },
      { file: 'wt.md', name: 'WhatsApp Ventas y Cierre' },
      { file: 'pc.md', name: 'Plan Comercial y Promociones' },
      { file: 'fg.md', name: 'Funnel Growth / Embudos' },
    ],
  },
  {
    folder: '02-social',
    prefix: 'AGT-SOC',
    agents: [
      { file: 'vh.md', name: 'Video Hooks de TikTok/Reels' },
      { file: 'ir.md', name: 'Estratega de Instagram Reels' },
      { file: 'sc.md', name: 'Creator de Stories' },
      { file: 'sw.md', name: 'Redactor Social' },
      { file: 'ps.md', name: 'Post Scheduler / Cadencia' },
      { file: 'md.md', name: 'Moderador y Respuestas' },
    ],
  },
  {
    folder: '03-ads',
    prefix: 'AGT-ADS',
    agents: [
      { file: 'ma.md', name: 'Meta Ads Manager' },
      { file: 'ga.md', name: 'Google Ads Specialist' },
      { file: 'al.md', name: 'Analista de Leads / ROAS' },
      { file: 'ca.md', name: 'Creativos Publicitarios' },
      { file: 'mz.md', name: 'Segmentación por Zonas' },
    ],
  },
  {
    folder: '04-ingenieria',
    prefix: 'AGT-ENG',
    agents: [
      { file: 'tc.md', name: 'Tech Config (n8n/Make)' },
      { file: 'as.md', name: 'Especialista en Automatización' },
      { file: 'wa.md', name: 'WhatsApp Cloud API Dev' },
      { file: 'fm.md', name: 'Formularios y Scripts' },
      { file: 'co.md', name: 'Diseñador Conversacional' },
      { file: 'wd.md', name: 'Desarrollador Web / Landing' },
    ],
  },
  {
    folder: '05-contenido',
    prefix: 'AGT-CON',
    agents: [
      { file: 'cc.md', name: 'Creador de Contenido' },
      { file: 'cv.md', name: 'Guionista de Video' },
      { file: 'ha.md', name: 'Historias y Storytelling' },
      { file: 'rp.md', name: 'Recetas y Fichas de Producto' },
      { file: 'ck.md', name: 'Campañas de Kits' },
      { file: 'vm.md', name: 'Distribución de Video Marketing' },
    ],
  },
  {
    folder: '06-seo',
    prefix: 'AGT-SEO',
    agents: [
      { file: 'sa.md', name: 'Auditor SEO Técnico' },
      { file: 'cs.md', name: 'Estratega de Contenido SEO' },
      { file: 'ps.md', name: 'Page Speed / Core Web Vitals' },
      { file: 'cp.md', name: 'Google Business Profile' },
      { file: 'fq.md', name: 'FAQ + Schema Markup' },
      { file: 'gg.md', name: 'Geo SEO / Mapas' },
    ],
  },
];

/** Devuelve el catálogo completo: [{ id, alias, name, file, module, folder }] */
function catalog() {
  const list = [];
  for (const mod of MODULES) {
    for (const a of mod.agents) {
      const base = a.file.replace('.md', '');
      const id = `${mod.prefix}-${base.toUpperCase()}`;
      list.push({
        id,
        alias: base,
        name: a.name,
        file: a.file,
        module: mod.prefix,
        folder: mod.folder,
      });
    }
  }
  return list;
}

/**
 * Busca un agente aceptando los siguientes formatos en `--agent`:
 *   1. ID formal                → AGT-NEG-LP, agt-neg-lp
 *   2. Alias corto              → lp, ca, wt, pc, fg, ...
 *   3. Alias con sufijo de módulo → neg-cp, ads-ca, seo-cp, soc-ps (desambigua duplicados)
 *
 * Nota: los alias cortos duplicados entre módulos (cp, ca, ps) resuelven al
 * primer módulo del catálogo (01-negocio > 02-social > 03-ads > ...). Para
 * llegar al otro agente se usa el alias con sufijo de módulo (ej. `seo-cp`,
 * `ads-ca`, `seo-ps`).
 */
function getAgent(id) {
  if (!id) throw new Error('Falta el identificador del agente (--agent).');
  const raw = String(id).trim();
  const lower = raw.toLowerCase();
  const list = catalog();

  // 1) ID formal exacto (case-insensitive)
  let found = list.find((a) => a.id.toLowerCase() === lower);
  if (found) return found;

  // 2) Alias corto (precedencia por orden de módulos en el catálogo)
  found = list.find((a) => a.alias.toLowerCase() === lower);
  if (found) return found;

  // 3) Alias con sufijo de módulo para desambiguar duplicados: neg-cp, ads-ca, seo-ps…
  found = list.find(
    (a) => `${a.module.toLowerCase().replace('agt-', '')}-${a.alias.toLowerCase()}` === lower,
  );
  if (found) return found;

  // 4) Prefijo compacto sin guion: negcp, adsca, seops…
  found = list.find(
    (a) =>
      `${a.module.toLowerCase().replace('agt-', '')}${a.alias.toLowerCase()}` === lower ||
      `${a.module.toLowerCase()}${a.alias.toLowerCase()}` === lower,
  );
  if (found) return found;

  const validIds = list.map((a) => `${a.id} (alias: ${a.alias})`).join(', ');
  throw new Error(`Agente desconocido: ${raw}. IDs y aliases válidos: ${validIds}`);
}

/** Lee el System Prompt completo del agente (su archivo .md). */
function loadPrompt(agent) {
  const file = path.join(PROMPTS_DIR, agent.folder, agent.file);
  if (!fs.existsSync(file)) {
    throw new Error(`No se encontró el prompt: ${file}`);
  }
  return fs.readFileSync(file, 'utf8');
}

module.exports = { catalog, getAgent, loadPrompt };