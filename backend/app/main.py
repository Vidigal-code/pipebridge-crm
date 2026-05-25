from __future__ import annotations

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config.settings import get_settings
from app.config.logging_config import setup_logging
from app.domain.entities.user import User
from app.domain.enums.role import Role
from app.infrastructure.aws.client_factory import AWSClientFactory
from app.infrastructure.repositories.dynamodb_user_repository import DynamoDBUserRepository
from app.infrastructure.auth.password_handler import PasswordHandler
from app.interfaces.api.routes.client_routes import router as client_router
from app.interfaces.api.routes.webhook_routes import router as webhook_router
from app.interfaces.api.routes.auth_routes import router as auth_router
from app.interfaces.api.middleware.security_headers import SecurityHeadersMiddleware
from app.interfaces.api.middleware.rate_limiter import RateLimiterMiddleware
from app.interfaces.api.middleware.request_id import RequestIdMiddleware

logger = logging.getLogger(__name__)


async def _seed_admin_user(settings) -> None:
    factory = AWSClientFactory(settings)
    dynamodb = factory.dynamodb_resource()
    table = dynamodb.Table(settings.dynamodb_users_table)
    repo = DynamoDBUserRepository(table)

    existing = await repo.find_by_email(settings.admin_email)
    if existing:
        return

    admin = User(
        email=settings.admin_email,
        name=settings.admin_name,
        password_hash=PasswordHandler.hash(settings.admin_password),
        role=Role.ADMIN,
    )
    await repo.create(admin)
    logger.info("Admin user seeded: %s", settings.admin_email)


@asynccontextmanager
async def lifespan(application: FastAPI):
    setup_logging()
    settings = get_settings()
    await _seed_admin_user(settings)
    yield


def _register_middleware(application: FastAPI, settings) -> None:
    application.add_middleware(SecurityHeadersMiddleware)
    application.add_middleware(RequestIdMiddleware)
    application.add_middleware(
        RateLimiterMiddleware,
        max_requests=settings.rate_limit_requests,
        window_seconds=settings.rate_limit_window_seconds,
    )
    application.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


def _register_routes(application: FastAPI) -> None:
    application.include_router(auth_router)
    application.include_router(client_router)
    application.include_router(webhook_router)

    @application.get("/health", tags=["Health"], summary="Health Check")
    async def health_check():
        return {"status": "healthy"}


def create_app() -> FastAPI:
    settings = get_settings()
    application = FastAPI(
        title="PipeBridge CRM API",
        description=(
            "Sistema de gerenciamento de clientes com integração Pipefy via GraphQL.\n\n"
            "**Autenticação:** Use `POST /auth/login` para obter um JWT Bearer token.\n\n"
            f"**Credenciais padrão:** `{settings.admin_email}` / `Admin@12345`"
        ),
        version="2.0.0",
        lifespan=lifespan,
    )
    _register_middleware(application, settings)
    _register_routes(application)
    return application


app = create_app()
