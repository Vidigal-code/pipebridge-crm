from __future__ import annotations

from pydantic import BaseModel, EmailStr, Field


class CreateClientRequest(BaseModel):
    cliente_nome: str = Field(min_length=1, json_schema_extra={"examples": ["João Silva"]})
    cliente_email: EmailStr = Field(json_schema_extra={"examples": ["joao.silva@example.com"]})
    tipo_solicitacao: str = Field(min_length=1, json_schema_extra={"examples": ["Atualização cadastral"]})
    valor_patrimonio: float = Field(gt=0, json_schema_extra={"examples": [250000]})

    model_config = {"json_schema_extra": {"examples": [{"cliente_nome": "João Silva", "cliente_email": "joao.silva@example.com", "tipo_solicitacao": "Atualização cadastral", "valor_patrimonio": 250000}]}}


class ClientResponse(BaseModel):
    id: str
    cliente_nome: str
    cliente_email: str
    tipo_solicitacao: str
    valor_patrimonio: float
    status: str
    prioridade: str | None = None
    card_id: str | None = None
    pipefy_status: str = "simulated"
    pipefy_message: str = ""
    created_at: str
    updated_at: str

    model_config = {"from_attributes": True}
