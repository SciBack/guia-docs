# GUIA

**Gateway Universitario de Información y Asistencia**

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)

Repo del **app GUIA** — la plataforma open-core de asistencia AI institucional para universidades.

> **Estado:** Sprint 0.0 pendiente. Este repo contendrá el código del app (Python + uv + FastAPI + LlamaIndex). Depende de `SciBack/sciback-core` (12 paquetes ya publicados).

---

## Documentación

Toda la documentación del ecosistema (arquitectura, roadmap, estándares, integraciones, modelo comercial) vive en **[docs.sciback.com](https://docs.sciback.com)** — repo: [`SciBack/sciback-core-docs`](https://github.com/SciBack/sciback-core-docs).

---

## Repositorios del ecosistema GUIA

| Repositorio | Visibilidad | Contenido |
|-------------|-------------|-----------|
| **SciBack/guia** (este repo) | Private | Código del app (Sprint 0.0 pendiente) |
| **SciBack/guia-node** | Public (Apache 2.0) | Core open source: harvester, RAG, DSpace/OJS, API, chat — **pendiente crear** |
| **SciBack/guia-campus** | Private | Conectores comerciales: Koha, SIS, ERP, Moodle — **pendiente crear** |
| **UPeU-Infra/guia-upeu** | Private | Config deploy UPeU (.env, overrides) — **pendiente crear** |
| **SciBack/sciback-core** | Private | Plataforma Python (12 paquetes, 834 tests) |
| **SciBack/sciback-core-docs** | Public | Documentación centralizada del ecosistema |

---

## Dependencias previstas

```toml
"sciback-core>=0.11",
"sciback-adapter-dspace>=0.1",
"sciback-adapter-ojs>=0.1",
"sciback-adapter-alicia>=0.1",
"sciback-llm-claude>=0.1",
"sciback-llm-ollama>=0.1",
"sciback-embeddings-e5>=0.1",
"sciback-vectorstore-pgvector>=0.1",
"llama-index>=0.12",
"fastapi>=0.115",
"chainlit>=2.0",
"aiogram>=3.15",
```

---

## Piloto

Universidad Peruana Unión (UPeU), Lima, Perú — Fase 0 (abril–septiembre 2026).

---

## Contribuir

- [CONTRIBUTING.md](CONTRIBUTING.md) · [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) · [SECURITY.md](SECURITY.md)

## Licencia

Apache License 2.0 — ver [LICENSE](LICENSE).

Copyright 2024–2026 [SciBack](https://sciback.com)
