# CLAUDE.md — Proyecto ARIEL

## Qué es este proyecto

**ARIEL** (Adventist Repository for Institutional and Educational Literature) es una red federada de repositorios científicos de las universidades e institutos de la Iglesia Adventista del Séptimo Día (IASD). Modelo equivalente a OpenAIRE (Europa) o LA Referencia (LATAM) pero para la denominación adventista global.

**Nombre:** ARIEL es nombre propio — no se traduce. El acrónimo es universal como OpenAIRE o ALICIA.
**Fundamento bíblico:** Isaías 29:18 — "En aquel día los sordos oirán las palabras del libro..."
**Dominio objetivo:** pendiente — posible subdominio IASD oficial. Opción de respaldo: ariel.academy ($13/año). ariel.network está en venta.
**Sitio web:** https://upeu-infra.github.io/ariel/
**Repo GitHub:** https://github.com/UPeU-Infra/ariel

---

## Personas clave

| Persona | Rol | Contexto |
|---------|-----|---------|
| Alberto Sánchez | Impulsor del proyecto | Fundador SciBack, trabaja en UPeU DTI |
| Director DTI UPeU | Amigo personal de Alberto | Clave para endorsement institucional UPeU |
| Contacto IATec Perú | Hermano del director DTI | Clave para rol tecnológico IATec |
| Contacto SAD | Red personal de Alberto | Clave para endorsement División Sudamericana |

**CONFIDENCIAL:** Los vínculos personales (amigo DTI, hermano IATec) son contexto interno — nunca mencionar en documentos formales.

---

## Actores formales del proyecto

- **UPeU** — Institución promotora (puede aplicar a WillPlan MIF, recibir endorsement SAD)
- **IATec** — Socio tecnológico oficial de la SAD, opera en 40+ países
- **División Sudamericana (SAD)** — Endorsement denominacional, canal hacia Conferencia General
- **SciBack** — Operador técnico del hub (Alberto es fundador)

---

## Estado actual (marzo 2026)

### Completado ✅
- Nombre oficial definido: ARIEL
- Revisión de literatura — brecha documentada
- Arquitectura técnica definida (3 fases)
- Propuesta ejecutiva redactada
- Sitio web live: https://upeu-infra.github.io/ariel/
  - Landing page dark-mode navy/gold (Cormorant Garamond + DM Sans)
  - Documentación completa en MkDocs Material (ES + EN)
  - 15 referencias validadas

### Pendiente ❌
- Reunión con DTI UPeU — presentar propuesta
- Reunión con IATec — confirmar rol tecnológico
- Endorsement formal División Sudamericana
- Inventario universidades SAD con DSpace/OJS activos
- Adquirir dominio (evaluar subdominio IASD vs ariel.academy)
- Aplicar WillPlan MIF — deadline 1 mayo **2027** (UPeU como solicitante)
- Preparar concept note IOI Fund — convocatoria 2026–2027
- Registrar ARIEL en OpenDOAR como red

---

## Arquitectura técnica

### Pirámide de agregación
```
OpenAIRE · BASE · OpenAlex  (indexadores globales)
        ↑
   LA Referencia             (red LATAM)
        ↑
    HUB ARIEL               (hub central denominacional)
        ↑
ALICIA · BDTD · SNRD · RRAAE (redes nacionales)
        ↑
DSpace / OJS en cada universidad adventista
```

### Stack por fase

| Fase | Año | Plataforma | Notas |
|------|-----|-----------|-------|
| 1 | 2026 | **InvenioRDM** | CERN/Zenodo, Docker Compose, OAI-PMH nativo, MIT |
| 2 | 2027 | **DSpace-CRIS Hub** | Cuando DSpace 10 madure. Entidades CERIF. |
| 3 | 2028+ | **OpenAIRE Graph Stack** | Escala continental, CERIF nativo |

### Plataformas que ARIEL agrega

| Plataforma | Protocolo | Estado |
|-----------|----------|--------|
| DSpace | OAI-PMH nativo | ✅ Fase 1 |
| OJS | OAI-PMH nativo | ✅ Fase 1 |
| DSpace GLAM | OAI-PMH nativo | Fase 2 |
| DSpace-CRIS | OAI-PMH + CERIF | Fase 3 |
| Indico | API REST | Fase 2 (actas congresos) |
| Koha | ❌ Fuera de alcance | Catálogo físico, no producción científica |

### Países sin red nacional → conexión directa
Si una universidad adventista está en un país sin red nacional (Bolivia, Paraguay, muchos países de África/Asia), el DSpace conecta **directamente al hub ARIEL** por OAI-PMH, saltando el nivel nacional. ARIEL actúa como su red nacional de facto.

---

## Financiamiento

| Fondo | Monto | Tipo | Estado | Deadline |
|-------|-------|------|--------|---------|
| WillPlan Mission Impact Fund | $30K–$100K | GC-IASD, no reembolsable | Abierto | 1 mayo 2027 |
| IOI Fund for Network Adoption | Hasta $1.5M | Invest in Open Infrastructure | Próx. conv. 2026–2027 | TBD |
| División Sudamericana (SAD) | Por confirmar | Co-financiador | Negociación | — |
| Mellon Foundation | $250K–$500K | Higher Learning Program | Ciclo 2027 | — |
| SCOSS | Recurrente | Membresías institucionales | Fase 3 (50+ inst.) | — |

**Precedente clave:** LA Referencia recibió $1.5M del IOI Fund (ciclo inaugural 2025). ARIEL replica exactamente ese modelo.

**Nota WillPlan:** Solo entidades adventistas formales pueden aplicar. UPeU es la solicitante, no SciBack.

---

## Redes nacionales de repositorios (nivel 2 pirámide)

| País | Red | Estado |
|------|-----|--------|
| Perú | ALICIA (CONCYTEC) | ✅ Activa |
| Brasil | BDTD + OASISBR (IBICT) | ✅ Activa |
| Argentina | SNRD | ✅ Activa |
| Ecuador | RRAAE (SENESCYT) | ✅ Activa |
| Chile | Miembro LA Referencia | ✅ Activa |
| Colombia | Miembro LA Referencia | ✅ Activa |
| Bolivia | Sin red consolidada | ⚠️ |
| Paraguay | Sin red | ❌ → conexión directa a ARIEL |
| Uruguay | Sin red formal | ❌ → conexión directa a ARIEL |
| África / Asia / Pacífico | Mayoría sin red | ❌ → conexión directa a ARIEL |

---

## Comparación con redes equivalentes

| Red | Instituciones | Registros | Modelo |
|-----|-------------|---------|--------|
| OpenAIRE | 2,209 | 193M | Europa |
| BETH Teológica | ~1,500 | — | Todas las denominaciones |
| LA Referencia | ~100 | 5M | LATAM |
| CRRA Católica | ~50 | — | Disuelto 2023, migró a Atla |
| **Red Adventista hoy** | **~6** | — | **< 5% cobertura** |

---

## Archivos del proyecto

```
~/proyectos/upeu/ariel/
├── CLAUDE.md                  ← este archivo (contexto para Claude)
├── landing.html               ← landing page dark-mode (página de inicio del sitio)
├── mkdocs.yml                 ← config MkDocs Material bilingüe ES/EN
├── requirements.txt
├── docs/
│   ├── index.md               ← overview (página "Inicio" en nav MkDocs)
│   ├── propuesta-ejecutiva.md ← propuesta ejecutiva completa
│   ├── arquitectura.md        ← stack técnico por fase
│   ├── financiamiento.md      ← pipeline de financiamiento
│   ├── literatura.md          ← revisión de literatura (7 argumentos)
│   ├── contexto.md            ← contexto interno del proyecto
│   └── en/                    ← versión en inglés
└── .github/workflows/
    └── deploy.yml             ← build MkDocs → cp landing.html site/index.html → deploy
```

**Vault Obsidian:**
- `~/obsidian/sciback/proyectos/red-cientifica-adventista.md` — documento maestro
- `~/obsidian/sciback/proyectos/ariel-revision-literatura.md` — revisión de literatura

---

## Notas de implementación técnica

### Deploy workflow
El workflow hace: `mkdocs build --strict` → `cp landing.html site/index.html` → `peaceiris/actions-gh-pages`.
El `cp` sobreescribe el index.html generado por MkDocs con la landing dark-mode. La documentación MkDocs queda accesible desde los CTAs del landing y desde el nav.

### Schema unificador
OpenAIRE Guidelines v4 — compatible con CERIF, Dublin Core y DataCite. Permite cumplir reguladores nacionales (ALICIA/CONCYTEC, CAPES Brasil, etc.) simultáneamente.

### Regulación por país
- Perú: Ley 30035 (repositorios interoperables obligatorios)
- Colombia: Resolución 0777/2022
- Brasil: CAPES OA
Conectarse a ARIEL permite cumplir la normativa nacional **y** visibilidad global en un solo movimiento — argumento comercial/institucional fuerte.
