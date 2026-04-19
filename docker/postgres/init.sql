-- Inicialización de la base de datos GUIA
-- Este script corre automáticamente al crear el contenedor postgres por primera vez.

-- Extensión pgvector (requerida por sciback-vectorstore-pgvector)
CREATE EXTENSION IF NOT EXISTS vector;

-- Extensión para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Tabla de vectores ──────────────────────────────────────────
-- sciback-vectorstore-pgvector crea su propia tabla (sciback_vectors / guia_vectors)
-- vía SQLAlchemy al iniciar PgVectorStore. Este script solo garantiza que la extensión
-- esté disponible antes de que la app conecte.

-- ── Schema de metadatos de cosecha ────────────────────────────
CREATE TABLE IF NOT EXISTS harvest_runs (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source      VARCHAR(50) NOT NULL,  -- dspace | ojs | alicia
    started_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    finished_at TIMESTAMPTZ,
    status      VARCHAR(20) NOT NULL DEFAULT 'running',  -- running | success | failed
    items_total INTEGER DEFAULT 0,
    items_ok    INTEGER DEFAULT 0,
    error_msg   TEXT,
    metadata    JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_harvest_runs_source ON harvest_runs(source);
CREATE INDEX IF NOT EXISTS idx_harvest_runs_started_at ON harvest_runs(started_at DESC);

-- ── Schema de caché semántico ──────────────────────────────────
-- Redis maneja el caché en runtime, pero guardamos estadísticas en PG
CREATE TABLE IF NOT EXISTS cache_stats (
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    hits        BIGINT DEFAULT 0,
    misses      BIGINT DEFAULT 0,
    total       BIGINT DEFAULT 0
);

COMMENT ON TABLE harvest_runs IS 'Registro de corridas de cosecha OAI-PMH por fuente';
COMMENT ON TABLE cache_stats IS 'Estadísticas de hit/miss del caché semántico Redis';
