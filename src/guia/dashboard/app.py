"""Dashboard de producción científica GUIA (Sprint 0.6 — Streamlit).

Muestra métricas del repositorio indexado consultando pgvector metadata.

Arranque:
    streamlit run src/guia/dashboard/app.py
"""

from __future__ import annotations

import streamlit as st

from guia.config import GUIASettings

st.set_page_config(
    page_title="GUIA Dashboard",
    page_icon="📚",
    layout="wide",
)

_settings = GUIASettings()


@st.cache_resource
def get_container() -> object:
    """Carga el container GUIA (cacheado por Streamlit)."""
    from guia.container import GUIAContainer
    return GUIAContainer(_settings)


def main() -> None:
    """Renderiza el dashboard."""
    st.title("GUIA — Dashboard de Producción Científica")
    st.caption(f"Entorno: {_settings.environment} | LLM Mode: {_settings.guia_llm_mode}")

    # Intentar conectar al container
    try:
        container = get_container()
        store = container.store  # type: ignore[union-attr]
    except Exception as exc:
        st.error(f"Error conectando a la base de datos: {exc}")
        st.info("Verifica que PGVECTOR_DATABASE_URL esté configurado correctamente.")
        return

    # ── Métricas principales ──────────────────────────────────
    st.header("Métricas del Repositorio")

    col1, col2, col3, col4 = st.columns(4)

    try:
        # PgVectorStore tiene método count()
        if hasattr(store, "count"):
            total_docs = store.count()  # type: ignore[union-attr]
        else:
            total_docs = "N/A"

        with col1:
            st.metric("Total documentos indexados", total_docs)
        with col2:
            st.metric("Fuentes activas", "DSpace + OJS + ALICIA")
        with col3:
            st.metric("Modo LLM", str(_settings.guia_llm_mode))
        with col4:
            st.metric("Dimensión embeddings", "1024 (E5)")

    except Exception as exc:
        st.warning(f"No se pudieron cargar métricas: {exc}")

    # ── Búsqueda de prueba ────────────────────────────────────
    st.header("Búsqueda Semántica (prueba)")

    query = st.text_input("Consulta de prueba:", placeholder="inteligencia artificial educación")

    if st.button("Buscar") and query:
        try:
            search_svc = container.search_service  # type: ignore[union-attr]
            results = search_svc.search(query, limit=5)

            if not results:
                st.info("No se encontraron resultados.")
            else:
                st.subheader(f"Resultados ({len(results)})")
                for i, record in enumerate(results, 1):
                    title_label = record.metadata.get("title", record.id)
                    with st.expander(
                        f"{i}. {title_label} — Score: {record.score:.3f}"
                    ):
                        st.json(record.metadata)
        except Exception as exc:
            st.error(f"Error en búsqueda: {exc}")

    # ── Estado de servicios ───────────────────────────────────
    st.header("Estado de Servicios")

    col_a, col_b = st.columns(2)

    with col_a:
        st.subheader("Redis (caché)")
        try:
            import redis
            r = redis.from_url(_settings.redis_url)
            r.ping()
            st.success("Redis: conectado")
        except Exception as exc:
            st.error(f"Redis: error — {exc}")

    with col_b:
        st.subheader("GROBID (PDF)")
        try:
            import httpx
            resp = httpx.get(f"{_settings.grobid_base_url}/api/isalive", timeout=3)
            if resp.status_code == 200:
                st.success("GROBID: disponible")
            else:
                st.warning(f"GROBID: status {resp.status_code}")
        except Exception:
            st.warning("GROBID: no disponible (normal si no se usa Sprint 0.4)")


if __name__ == "__main__":
    main()
