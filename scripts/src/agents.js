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

/** Devuelve el catálogo completo: [{ id, name, file, module, folder }] */
function catalog() {
  const list = [];
  for (const mod of MODULES) {
    for (const a of mod.agents) {
      const id = `${mod.prefix}-${a.file.replace('.md', '').toUpperCase()}`;
      list.push({ id, name: a.name, file: a.file, module: mod.prefix, folder: mod.folder });
    }
  }
  return list;
}

/** Busca un agente por ID (e.g. AGT-NEG-CP). Lanza si no existe. */
function getAgent(id) {
  const found = catalog().find((a) => a.id.toLowerCase() === String(id).toLowerCase());
  if (!found) {
    const ids = catalog().map((a) => a.id).join(', ');
    throw new Error(`Agente desconocido: ${id}. IDs válidos: ${ids}`);
  }
  return found;
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