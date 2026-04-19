"""CLI de GUIA — comandos de operación.

Uso:
    uv run python -m guia serve
    uv run python -m guia harvest
    uv run python -m guia migrate
"""

from __future__ import annotations

import typer

app = typer.Typer(
    name="guia",
    help="GUIA — Gateway Universitario de Información y Asistencia",
    add_completion=False,
)


@app.command()
def serve(
    host: str = typer.Option("0.0.0.0", help="Host de escucha"),
    port: int = typer.Option(8000, help="Puerto de escucha"),
    reload: bool = typer.Option(False, help="Hot reload (solo desarrollo)"),
) -> None:
    """Inicia el servidor FastAPI de GUIA."""
    import uvicorn

    from guia.api.app import create_app
    from guia.config import GUIASettings

    settings = GUIASettings()
    create_app(settings)  # Valida la config al instanciar

    uvicorn.run(
        "guia.api.app:create_app",
        factory=True,
        host=host,
        port=port,
        reload=reload,
        log_config=None,  # Usamos structlog
    )


@app.command()
def harvest(
    source: str = typer.Option("all", help="Fuente: dspace | ojs | alicia | all"),
    from_date: str | None = typer.Option(None, help="Fecha inicio ISO 8601 (ej: 2024-01-01)"),
) -> None:
    """Cosecha publicaciones desde las fuentes configuradas."""
    from guia.config import GUIASettings
    from guia.container import GUIAContainer
    from guia.logging import configure_logging

    settings = GUIASettings()
    configure_logging(level=settings.log_level, json_logs=False)

    typer.echo(f"Iniciando cosecha: {source} (from_date={from_date})")

    container = GUIAContainer(settings)
    harvester = container.harvester_service

    results: dict[str, dict[str, int]] = {}

    if source in ("dspace", "all"):
        results["dspace"] = harvester.harvest_dspace(from_date=from_date)

    if source in ("ojs", "all"):
        results["ojs"] = harvester.harvest_ojs()

    if source in ("alicia", "all"):
        results["alicia"] = harvester.harvest_alicia(from_date=from_date)

    for src, stats in results.items():
        typer.echo(f"  {src}: {stats}")

    container.close()
    typer.echo("Cosecha completada.")


@app.command()
def migrate() -> None:
    """Inicializa / migra el schema de base de datos."""
    from guia.config import GUIASettings
    from guia.logging import configure_logging

    settings = GUIASettings()
    configure_logging(level=settings.log_level, json_logs=False)

    typer.echo("Inicializando vector store (CREATE EXTENSION vector + tabla)...")

    from sciback_vectorstore_pgvector import PgVectorConfig, PgVectorStore

    config = PgVectorConfig()
    with PgVectorStore(config) as store:
        typer.echo("Schema inicializado correctamente.")

        if hasattr(store, "count"):
            count = store.count()
            typer.echo(f"Vectores existentes: {count}")


@app.command()
def shell() -> None:
    """Abre un shell interactivo con el container GUIA inyectado."""
    from guia.config import GUIASettings
    from guia.container import GUIAContainer
    from guia.logging import configure_logging

    settings = GUIASettings()
    configure_logging(level=settings.log_level, json_logs=False)

    container = GUIAContainer(settings)

    import code
    code.interact(
        banner="GUIA shell — variables disponibles: container, settings",
        local={"container": container, "settings": settings},
    )

    container.close()


if __name__ == "__main__":
    app()
