.PHONY: install lint test up down harvest shell migrate logs

# ── Dependencias ──────────────────────────────────────────────
install:
	uv sync --all-groups

# ── Calidad de código ─────────────────────────────────────────
lint:
	uv run ruff check src/ tests/
	uv run ruff format --check src/ tests/
	uv run mypy src/

format:
	uv run ruff format src/ tests/
	uv run ruff check --fix src/ tests/

# ── Tests ────────────────────────────────────────────────────
test:
	uv run pytest -x --cov=guia --cov-report=term-missing

test-unit:
	uv run pytest tests/unit/ -x

test-integration:
	uv run pytest tests/integration/ -x

# ── Docker compose ────────────────────────────────────────────
up:
	docker compose up -d

down:
	docker compose down

logs:
	docker compose logs -f api

# ── Operaciones ──────────────────────────────────────────────
harvest:
	uv run python -m guia.cli harvest

migrate:
	uv run python -m guia.cli migrate

shell:
	uv run python -m guia.cli shell
