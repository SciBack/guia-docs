"""Verificador OIDC con Keycloak (Sprint 0.6).

Valida tokens JWT emitidos por Keycloak usando JWKS endpoint.
Usa authlib para la verificación y PyJWT para el decode.
"""

from __future__ import annotations

import logging
from functools import lru_cache
from typing import Any

import jwt
from jwt import PyJWKClient

from guia.config import GUIASettings

logger = logging.getLogger(__name__)


class KeycloakVerifier:
    """Verifica tokens JWT emitidos por Keycloak.

    Args:
        settings: Configuración de GUIA con credenciales Keycloak.
    """

    def __init__(self, settings: GUIASettings | None = None) -> None:
        self._settings = settings or GUIASettings()

    @property
    def _jwks_url(self) -> str:
        s = self._settings
        return (
            f"{s.keycloak_url}/realms/{s.keycloak_realm}"  # type: ignore[attr-defined]
            f"/protocol/openid-connect/certs"
        )

    @lru_cache(maxsize=1)
    def _get_jwks_client(self) -> PyJWKClient:
        """Construye el cliente JWKS (cacheado, se refresca automáticamente)."""
        return PyJWKClient(self._jwks_url)

    def verify(self, token: str) -> dict[str, Any]:
        """Verifica y decodifica un Bearer token JWT de Keycloak.

        Args:
            token: JWT en formato Bearer (sin el prefijo "Bearer ").

        Returns:
            Payload del JWT si es válido.

        Raises:
            jwt.InvalidTokenError: Si el token es inválido o expiró.
        """
        try:
            jwks_client = self._get_jwks_client()
            signing_key = jwks_client.get_signing_key_from_jwt(token)

            payload: dict[str, Any] = jwt.decode(
                token,
                signing_key.key,
                algorithms=["RS256"],
                audience=self._settings.keycloak_client_id,  # type: ignore[attr-defined]
                options={"verify_exp": True},
            )
            return payload

        except jwt.ExpiredSignatureError:
            logger.warning("token_expired")
            raise
        except jwt.InvalidTokenError:
            logger.warning("token_invalid")
            raise

    def get_user_id(self, token: str) -> str:
        """Extrae el subject (user ID) del token.

        Args:
            token: JWT válido.

        Returns:
            Subject del token (user UUID en Keycloak).
        """
        payload = self.verify(token)
        return str(payload.get("sub", ""))

    def get_roles(self, token: str) -> list[str]:
        """Extrae los roles del realm del token.

        Args:
            token: JWT válido.

        Returns:
            Lista de roles del realm.
        """
        payload = self.verify(token)
        realm_access: dict[str, Any] = payload.get("realm_access", {})
        roles: list[str] = realm_access.get("roles", [])
        return roles


# ── FastAPI dependency helper ──────────────────────────────────────────────────

def get_token_verifier() -> KeycloakVerifier:
    """Factory para inyección en FastAPI (Sprint 0.6)."""
    return KeycloakVerifier()
