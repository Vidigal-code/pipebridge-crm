from __future__ import annotations

from dataclasses import dataclass
from typing import Any

from fastapi import FastAPI
from fastapi.openapi.docs import get_swagger_ui_html
from fastapi.openapi.utils import get_openapi
from fastapi.responses import JSONResponse, RedirectResponse

API_VERSION = "2.0.0"


@dataclass(frozen=True)
class SwaggerLocale:
    title: str
    description: str
    prefix: str
    tags: tuple[dict[str, str], ...]

    @property
    def docs_path(self) -> str:
        return f"/{self.prefix}/docs"

    @property
    def openapi_path(self) -> str:
        return f"/{self.prefix}/openapi.json"


def _build_pt_description(admin_email: str) -> str:
    return (
        "## Sistema de Gerenciamento de Clientes — Mundo Invest\n\n"
        "API REST para gerenciamento de clientes com integração Pipefy via GraphQL, "
        "persistência em DynamoDB (AWS LocalStack) e processamento assíncrono via SQS/SNS.\n\n"
        "---\n\n"
        "### Autenticação\n\n"
        "Utilize `POST /auth/login` para obter um **JWT Bearer token**.\n\n"
        f"**Credenciais padrão:** `{admin_email}` / `Admin@12345`\n\n"
        "---\n\n"
        "### Fluxo 1 — Criação de Cliente\n\n"
        "1. Envie `POST /clientes` com nome, email, tipo de solicitação e patrimônio\n"
        "2. O sistema persiste no DynamoDB com status **Aguardando Análise**\n"
        "3. A mutation `createCard` é enviada ao Pipefy via GraphQL\n\n"
        "### Fluxo 2 — Processamento de Webhook\n\n"
        "1. Envie `POST /webhooks/pipefy/card-updated` com event_id, card_id, email e timestamp\n"
        "2. O sistema verifica idempotência pelo `event_id`\n"
        "3. Aplica regra de prioridade: patrimônio ≥ R$ 200.000 → **prioridade_alta**\n"
        "4. A mutation `updateFieldsValues` é enviada ao Pipefy via GraphQL\n"
        "5. Status é atualizado para **Processado**\n\n"
        "### Fluxo 3 — Gerenciamento de Cards Pipefy\n\n"
        "1. `GET /pipefy/cards` — Lista todos os cards do pipe\n"
        "2. `PUT /pipefy/cards/{card_id}` — Atualiza campos de um card\n"
        "3. `DELETE /pipefy/cards/{card_id}` — Remove um card do Pipefy\n\n"
        "---\n\n"
        "### Arquitetura\n\n"
        "| Camada | Tecnologia |\n"
        "|---|---|\n"
        "| Backend | Python 3.12, FastAPI, Pydantic v2 |\n"
        "| Banco | Amazon DynamoDB (LocalStack) |\n"
        "| Fila | Amazon SQS (LocalStack) |\n"
        "| Notificações | Amazon SNS (LocalStack) |\n"
        "| Autenticação | JWT HS256 + PBKDF2-SHA256 |\n"
    )


def _build_en_description(admin_email: str) -> str:
    return (
        "## Client Management System — Mundo Invest\n\n"
        "REST API for client management with Pipefy integration via GraphQL, "
        "DynamoDB persistence (AWS LocalStack) and async processing via SQS/SNS.\n\n"
        "---\n\n"
        "### Authentication\n\n"
        "Use `POST /auth/login` to obtain a **JWT Bearer token**.\n\n"
        f"**Default credentials:** `{admin_email}` / `Admin@12345`\n\n"
        "---\n\n"
        "### Flow 1 — Client Creation\n\n"
        "1. Send `POST /clientes` with name, email, request type and net worth\n"
        "2. System persists to DynamoDB with status **Aguardando Análise**\n"
        "3. The `createCard` mutation is sent to Pipefy via GraphQL\n\n"
        "### Flow 2 — Webhook Processing\n\n"
        "1. Send `POST /webhooks/pipefy/card-updated` with event_id, card_id, email and timestamp\n"
        "2. System checks idempotency by `event_id`\n"
        "3. Applies priority rule: net worth ≥ R$ 200,000 → **prioridade_alta**\n"
        "4. The `updateFieldsValues` mutation is sent to Pipefy via GraphQL\n"
        "5. Status is updated to **Processado**\n\n"
        "### Flow 3 — Pipefy Card Management\n\n"
        "1. `GET /pipefy/cards` — List all cards from the pipe\n"
        "2. `PUT /pipefy/cards/{card_id}` — Update card fields\n"
        "3. `DELETE /pipefy/cards/{card_id}` — Remove a card from Pipefy\n\n"
        "---\n\n"
        "### Architecture\n\n"
        "| Layer | Technology |\n"
        "|---|---|\n"
        "| Backend | Python 3.12, FastAPI, Pydantic v2 |\n"
        "| Database | Amazon DynamoDB (LocalStack) |\n"
        "| Queue | Amazon SQS (LocalStack) |\n"
        "| Notifications | Amazon SNS (LocalStack) |\n"
        "| Auth | JWT HS256 + PBKDF2-SHA256 |\n"
    )


PT_TAGS = (
    {"name": "Autenticação", "description": "Login, troca de senha e gerenciamento de credenciais JWT"},
    {"name": "Clientes", "description": "Cadastro e listagem de clientes com integração Pipefy (createCard)"},
    {"name": "Webhooks", "description": "Processamento de webhooks Pipefy (updateFieldsValues) com idempotência"},
    {"name": "Pipefy", "description": "CRUD direto nos cards do Pipefy via GraphQL (listar, editar, remover)"},
    {"name": "Health", "description": "Verificação de saúde da aplicação"},
)

EN_TAGS = (
    {"name": "Autenticação", "description": "Login, password change and JWT credential management"},
    {"name": "Clientes", "description": "Client registration and listing with Pipefy integration (createCard)"},
    {"name": "Webhooks", "description": "Pipefy webhook processing (updateFieldsValues) with idempotency"},
    {"name": "Pipefy", "description": "Direct Pipefy card CRUD via GraphQL (list, edit, delete)"},
    {"name": "Health", "description": "Application health check"},
)


def build_pt_locale(admin_email: str) -> SwaggerLocale:
    return SwaggerLocale(
        title="PipeBridge CRM API — Documentação",
        description=_build_pt_description(admin_email),
        prefix="pt",
        tags=PT_TAGS,
    )


def build_en_locale(admin_email: str) -> SwaggerLocale:
    return SwaggerLocale(
        title="PipeBridge CRM API — Documentation",
        description=_build_en_description(admin_email),
        prefix="en",
        tags=EN_TAGS,
    )


def _build_openapi_schema(app: FastAPI, locale: SwaggerLocale) -> dict[str, Any]:
    schema = get_openapi(
        title=locale.title,
        version=API_VERSION,
        description=locale.description,
        routes=app.routes,
    )
    schema["tags"] = [dict(t) for t in locale.tags]
    return schema


def _mount_locale_docs(app: FastAPI, locale: SwaggerLocale) -> None:
    schema_cache: dict[str, Any] = {}

    async def serve_openapi():
        if not schema_cache:
            schema_cache["data"] = _build_openapi_schema(app, locale)
        return JSONResponse(schema_cache["data"])

    async def serve_docs():
        return get_swagger_ui_html(
            openapi_url=locale.openapi_path,
            title=locale.title,
        )

    app.add_api_route(locale.openapi_path, serve_openapi, include_in_schema=False)
    app.add_api_route(locale.docs_path, serve_docs, include_in_schema=False)


def _mount_root_redirect(app: FastAPI) -> None:
    async def redirect_docs():
        return RedirectResponse(url="/pt/docs")

    app.add_api_route("/docs", redirect_docs, include_in_schema=False)


def register_swagger(app: FastAPI, admin_email: str) -> None:
    locales = [build_pt_locale(admin_email), build_en_locale(admin_email)]
    for locale in locales:
        _mount_locale_docs(app, locale)
    _mount_root_redirect(app)
