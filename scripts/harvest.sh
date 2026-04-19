#!/usr/bin/env bash
# Wrapper de cosecha — llama al CLI de GUIA con uv run
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_DIR"

SOURCE="${1:-all}"
FROM_DATE="${2:-}"

echo "[harvest.sh] Iniciando cosecha: source=$SOURCE from_date=${FROM_DATE:-none}"

if [ -n "$FROM_DATE" ]; then
    uv run python -m guia harvest --source "$SOURCE" --from-date "$FROM_DATE"
else
    uv run python -m guia harvest --source "$SOURCE"
fi

echo "[harvest.sh] Cosecha completada."
