from __future__ import annotations

from pydantic import BaseModel, Field


class WebhookRequest(BaseModel):
    event_id: str = Field(json_schema_extra={"examples": ["evt_123"]})
    card_id: str = Field(json_schema_extra={"examples": ["card_456"]})
    cliente_email: str = Field(json_schema_extra={"examples": ["joao.silva@example.com"]})
    timestamp: str = Field(json_schema_extra={"examples": ["2026-05-18T12:00:00Z"]})

    model_config = {"json_schema_extra": {"examples": [{"event_id": "evt_123", "card_id": "card_456", "cliente_email": "joao.silva@example.com", "timestamp": "2026-05-18T12:00:00Z"}]}}


class WebhookResponse(BaseModel):
    event_id: str
    status: str
    prioridade: str | None = None
    message: str
    pipefy_status: str = "simulated"
    pipefy_message: str = ""
