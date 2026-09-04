# 🧃 agentes_tropi — Orquestador Autónomo de Tropicaña

Repositorio central de **Tropicaña**: la agencia autónoma de marketing, ventas e
ingeniería para la marca veracruzana de jugo de caña de azúcar artesanal.

Contiene los **System Prompts de 35 agentes**, los **conectores de API** en Node.js
que los ejecutan, y los **workflows de automatización** para n8n/Make.

---

## 1. Cómo empezar

```bash
# 1) Clona el repo y entra
git clone <url> agentes_tropi && cd agentes_tropi

# 2) Crea tus credenciales
cp .env.example .env          # PowerShell: Copy-Item .env.example .env
# Llena ANTHROPIC_API_KEY, WHATSAPP_TOKEN, SUPABASE_URL, etc.

# 3) Lista los agentes disponibles
node scripts/index.js --list

# 4) Ejecuta un agente con un input
node scripts/index.js --agent AGT-NEG-WT --input '{"zona":"Boca del Río","tipo":"hosteleria"}'
```

Requiere **Node.js ≥ 18** (usa `fetch` nativo; sin dependencias externas).

---

## 2. Arquitectura del repositorio

```
agentes_tropi/
├── prompts/
│   ├── 01-negocio/    6 agentes  · copy, landing, comercial, WhatsApp, plan, funnel
│   ├── 02-social/     6 agentes  · hooks, reels, stories, redactor, programador, moderador
│   ├── 03-ads/        5 agentes  · Meta Ads, Google Ads, analista lead, creativos, zonas
│   ├── 04-ingenieria/ 6 agentes  · config, automatizaciones, WA API, formularios, bot, web
│   ├── 05-contenido/  6 agentes  · creador, copy video, historias, producto, kits, video
│   └── 06-seo/        6 agentes  · auditor, contenido SEO, velocidad, GMB, schema, geo
├── scripts/           Orquestador CLI + conectores Anthropic / WhatsApp / ManyChat / Supabase
├── workflows/         Blueprints JSON para n8n y Make
├── .env.example       Plantilla de credenciales
└── README.md          Este manual
```

### Catálogo completo de agentes

| ID | Archivo | Rol | Módulo |
|----|---------|-----|--------|
| AGT-NEG-CP | `prompts/01-negocio/cp.md` | Copy Principal de Conversión | Negocio |
| AGT-NEG-LP | `prompts/01-negocio/lp.md` | Arquitecto de Landing Page | Negocio |
| AGT-NEG-CA | `prompts/01-negocio/ca.md` | Comercial / CRM de Leads | Negocio |
| AGT-NEG-WT | `prompts/01-negocio/wt.md` | WhatsApp Ventas y Cierre | Negocio |
| AGT-NEG-PC | `prompts/01-negocio/pc.md` | Plan Comercial y Promociones | Negocio |
| AGT-NEG-FG | `prompts/01-negocio/fg.md` | Funnel Growth / Embudos | Negocio |
| AGT-SOC-VH | `prompts/02-social/vh.md` | Video Hooks de TikTok/Reels | Social |
| AGT-SOC-IR | `prompts/02-social/ir.md` | Estratega de Instagram Reels | Social |
| AGT-SOC-SC | `prompts/02-social/sc.md` | Creator de Stories | Social |
| AGT-SOC-SW | `prompts/02-social/sw.md` | Redactor Social | Social |
| AGT-SOC-PS | `prompts/02-social/ps.md` | Post Scheduler / Cadencia | Social |
| AGT-SOC-MD | `prompts/02-social/md.md` | Moderador y Respuestas | Social |
| AGT-ADS-MA | `prompts/03-ads/ma.md` | Meta Ads Manager | Ads |
| AGT-ADS-GA | `prompts/03-ads/ga.md` | Google Ads Specialist | Ads |
| AGT-ADS-AL | `prompts/03-ads/al.md` | Analista de Leads / ROAS | Ads |
| AGT-ADS-CA | `prompts/03-ads/ca.md` | Creativos Publicitarios | Ads |
| AGT-ADS-MZ | `prompts/03-ads/mz.md` | Segmentación por Zonas | Ads |
| AGT-ENG-TC | `prompts/04-ingenieria/tc.md` | Tech Config (n8n/Make) | Ingeniería |
| AGT-ENG-AS | `prompts/04-ingenieria/as.md` | Especialista en Automatización | Ingeniería |
| AGT-ENG-WA | `prompts/04-ingenieria/wa.md` | WhatsApp Cloud API Dev | Ingeniería |
| AGT-ENG-FM | `prompts/04-ingenieria/fm.md` | Formularios y Scripts | Ingeniería |
| AGT-ENG-CO | `prompts/04-ingenieria/co.md` | Diseñador Conversacional | Ingeniería |
| AGT-ENG-WD | `prompts/04-ingenieria/wd.md` | Desarrollador Web / Landing | Ingeniería |
| AGT-CON-CC | `prompts/05-contenido/cc.md` | Creador de Contenido | Contenido |
| AGT-CON-CV | `prompts/05-contenido/cv.md` | Guionista de Video | Contenido |
| AGT-CON-HA | `prompts/05-contenido/ha.md` | Historias y Storytelling | Contenido |
| AGT-CON-RP | `prompts/05-contenido/rp.md` | Recetas y Fichas de Producto | Contenido |
| AGT-CON-CK | `prompts/05-contenido/ck.md` | Campañas de Kits | Contenido |
| AGT-CON-VM | `prompts/05-contenido/vm.md` | Distribución de Video Marketing | Contenido |
| AGT-SEO-SA | `prompts/06-seo/sa.md` | Auditor SEO Técnico | SEO |
| AGT-SEO-CS | `prompts/06-seo/cs.md` | Estratega de Contenido SEO | SEO |
| AGT-SEO-PS | `prompts/06-seo/ps.md` | Page Speed / Core Web Vitals | SEO |
| AGT-SEO-CP | `prompts/06-seo/cp.md` | Google Business Profile | SEO |
| AGT-SEO-FQ | `prompts/06-seo/fq.md` | FAQ + Schema Markup | SEO |
| AGT-SEO-GG | `prompts/06-seo/gg.md` | Geo SEO / Mapas | SEO |
---

## 3. Núcleo persuasivo (5 pilares) — obligatorio en todo agente

1. **Price Anchoring** — toda oferta se presenta en 3 niveles:
   **Patronal Supremo** (institucional a granel) · **Hostelería Recomendado** (envase
   rentable, margen +65% por copeo) · **Kit Prueba** (entrada de bajo riesgo).
2. **Loss Aversion** — exponer el margen no percibido: merma, restos de caña y el
   +65% que el negocio cliente pierde si sigue comprando sustituto embotellado.
3. **Sensory Hooks Viscerales** — cremosidad del jugo, condensación en el vaso,
   hielo frío, sonido de la prensa, orgullo veracruzano.
4. **Escasez y Asignación Territorial** — lotes limitados prensados por zona/colonia;
   agotamiento legítimo y prioridad de cupo.
5. **Ley de Hick** — cero fricción: máximo 2–3 opciones y un solo CTA: **cierre por WhatsApp**.

---

## 4. Scripts (conectores)

| Script | Función |
|--------|---------|
| `scripts/index.js` | CLI: carga el `.md` del agente como System Prompt, lo envía a Anthropic y devuelve la salida JSON/Markdown |
| `scripts/src/agents.js` | Catálogo de los 35 agentes (ID → archivo .md) |
| `scripts/src/env.js` | Carga `.env` sin dependencias |
| `scripts/src/utils.js` | CLI parse, JSON helpers, errores |
| `scripts/src/providers/anthropic.js` | Llamada a la API de Anthropic (`/v1/messages`) |
| `scripts/src/providers/whatsapp.js` | Envío de mensajes por WhatsApp Business Cloud API |
| `scripts/src/providers/manychat.js` | Disparo de broadcasts via ManyChat |
| `scripts/src/providers/supabase.js` | UPSERT de leads a Supabase (`leads`) |

### Uso del CLI

```bash
node scripts/index.js --list
node scripts/index.js --agent AGT-SOC-VH --input '{"producto":"jugo de caña","zona":"Xalapa"}'
node scripts/index.js --agent AGT-SEO-SA --input '{"url":"https://site","dominio":"zona"}'
```

Cada prompt `.md` define su propio contrato de entrada/salida en la sección
**"📤 Formato de salida"**.

---

## 5. Automatización (n8n / Make)

- `workflows/n8n-lead-whatsapp-supabase.json` → importar en **n8n**: un webhook recibe
  el lead, lo normaliza, hace UPSERT en Supabase y dispara la notificación interna.
- `workflows/make-lead-pipeline.json` → blueprint de **Make**: recibe evento, decide
  nivel de oferta por zona, guarda el lead y encola la plantilla de WhatsApp.

Flujo recomendado end-to-end:

```
Ads (Meta/Google) → Landing/WhatsApp → n8n webhook → Supabase (leads)
     → agente WT responde → cierre → kit entregado → recompra por zona
```

---

## 6. Base de datos mínima (tabla `leads` en Supabase)

```sql
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  phone text unique not null,
  name text,
  zona text,
  origen text,                -- meta_ads | google_ads | instagram | whatsapp_broadcast
  nivel text,                 -- patronal_supremo | hosteleria | kit_prueba
  estado text default 'nuevo',-- nuevo | contacto | oferta | cerrado | perdido
  score integer default 0,
  nota text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

---

## 7. Seguridad

- `.env` jamás se sube al control de versiones (añadir a `.gitignore`).
- Rotar `WHATSAPP_TOKEN`, `ANTHROPIC_API_KEY` y `SUPABASE_SERVICE_ROLE_KEY` cada 90 días.
- Usar `SUPABASE_SERVICE_ROLE_KEY` SOLO en scripts internos; nunca en clientes web.
- Los prompts de agentes son instancias de negocio: no exponerlos en landing pages.