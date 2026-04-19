"""Servicios de aplicación de GUIA.

Regla arquitectónica: los servicios importan SOLO interfaces (ports) de
sciback_core.ports — NUNCA adapters concretos. La instanciación concreta
vive en guia.container (composition root).
"""
