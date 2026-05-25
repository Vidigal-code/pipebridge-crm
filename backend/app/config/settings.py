from __future__ import annotations

from pydantic_settings import BaseSettings
from functools import lru_cache
import os


class Settings(BaseSettings):
    app_name: str = "pipebridge-crm"
    app_env: str = "development"

    backend_host: str = "0.0.0.0"
    backend_port: int = 8001
    backend_cors_origins: str = "http://localhost:3000"

    pipefy_api_url: str = "https://api.pipefy.com/graphql"
    pipefy_api_token: str = "simulated_token"
    pipefy_pipe_id: str = "123456"
    pipefy_field_nome: str = "cliente_nome"
    pipefy_field_email: str = "cliente_email"
    pipefy_field_patrimonio: str = "valor_patrimonio"
    pipefy_field_tipo_solicitacao: str = "tipo_solicitacao"
    pipefy_field_status: str = "status"
    pipefy_field_prioridade: str = "prioridade"
    pipefy_timeout_seconds: int = 10

    aws_default_region: str = "us-east-1"
    aws_access_key_id: str = "test"
    aws_secret_access_key: str = "test"
    aws_endpoint_url: str = "http://localstack:4566"

    dynamodb_clients_table: str = "clients"
    dynamodb_events_table: str = "webhook_events"
    dynamodb_users_table: str = "users"
    sqs_queue_name: str = "pipebridge-webhooks"
    sns_topic_name: str = "pipebridge-notifications"

    rate_limit_requests: int = 100
    rate_limit_window_seconds: int = 60

    admin_name: str = "Administrador"
    admin_email: str = "admin@mundoinvest.com"
    admin_password: str = "Admin@12345"
    jwt_secret: str = "pipebridge-jwt-secret-key-2026-secure-hmac-sha256"
    jwt_expiration_minutes: int = 60

    log_enabled: bool = True
    log_dir: str = "logs"
    log_max_bytes: int = 10_485_760
    log_backup_count: int = 5

    seed_max_retries: int = 10
    seed_retry_delay: int = 5

    @property
    def cors_origins(self) -> list[str]:
        return [origin.strip() for origin in self.backend_cors_origins.split(",")]

    model_config = {"env_file": os.path.join(os.path.dirname(__file__), "..", "..", ".env"), "extra": "ignore"}


@lru_cache
def get_settings() -> Settings:
    return Settings()
