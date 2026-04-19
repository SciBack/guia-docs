"""Chainlit app — chat web de GUIA (Sprint 0.3).

Integra ChatService con la interfaz web de Chainlit.
Soporta streaming cuando el LLM lo provea.

Arranque:
    chainlit run src/guia/channels/chainlit_app.py --host 0.0.0.0 --port 8001
"""

from __future__ import annotations

import chainlit as cl

from guia.config import GUIASettings
from guia.container import GUIAContainer
from guia.domain.chat import ChatRequest
from guia.logging import configure_logging, get_logger

_settings = GUIASettings()
configure_logging(level=_settings.log_level, json_logs=False)
logger = get_logger(__name__)

# Container global — instanciado una vez al cargar el módulo
_container = GUIAContainer(_settings)


@cl.on_chat_start
async def on_chat_start() -> None:
    """Inicializa la sesión de chat."""
    cl.user_session.set("session_id", cl.context.session.id)
    await cl.Message(
        content=(
            "Hola, soy **GUIA**, tu asistente universitario. "
            "Puedo ayudarte a encontrar tesis, artículos y publicaciones "
            "del repositorio institucional. ¿En qué te ayudo?"
        )
    ).send()


@cl.on_message
async def on_message(message: cl.Message) -> None:
    """Procesa cada mensaje del usuario."""
    session_id: str = cl.user_session.get("session_id", "")

    # Indicador de "pensando"
    thinking_msg = cl.Message(content="")
    await thinking_msg.send()

    try:
        request = ChatRequest(
            query=message.content,
            session_id=session_id,
            language="es",
        )
        response = _container.chat_service.answer(request)

        # Construir respuesta con fuentes
        answer_text = response.answer

        if response.sources:
            answer_text += "\n\n**Fuentes:**\n"
            for i, source in enumerate(response.sources, 1):
                if source.url:
                    answer_text += f"{i}. [{source.title}]({source.url})\n"
                else:
                    answer_text += f"{i}. {source.title}\n"

        if response.cached:
            answer_text += "\n\n*Respuesta desde caché semántico*"

        thinking_msg.content = answer_text
        await thinking_msg.update()

    except Exception as exc:
        logger.exception("chainlit_error", exc_info=exc)
        thinking_msg.content = (
            "Lo siento, ocurrió un error procesando tu consulta. "
            "Por favor, inténtalo de nuevo."
        )
        await thinking_msg.update()


@cl.on_chat_end
async def on_chat_end() -> None:
    """Limpieza al finalizar sesión."""
    logger.info("chainlit_session_end", session_id=cl.user_session.get("session_id", ""))
