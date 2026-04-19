#!/usr/bin/env bash
# Inicializa el schema de base de datos para GUIA
# Ejecutar después de que postgres esté levantado
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_DIR"

echo "[bootstrap-db.sh] Inicializando schema de GUIA..."

if [ ! -f .env ]; then
    echo "[bootstrap-db.sh] ERROR: .env no encontrado. Copia .env.example a .env primero."
    exit 1
fi

uv run python -m guia migrate

echo "[bootstrap-db.sh] Schema inicializado correctamente."
