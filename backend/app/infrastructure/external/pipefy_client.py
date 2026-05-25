from __future__ import annotations

import json
import logging
from dataclasses import dataclass
from enum import Enum

import httpx

from app.domain.entities.client import Client
from app.config.settings import get_settings

logger = logging.getLogger(__name__)




class PipefyStatus(str, Enum):
    SUCCESS = "success"
    SIMULATED = "simulated"
    ERROR = "error"


@dataclass
class PipefyResult:
    status: PipefyStatus
    data: dict | None = None
    message: str = ""


class PipefyClient:
    def __init__(self):
        settings = get_settings()
        self._api_url = settings.pipefy_api_url
        self._api_token = settings.pipefy_api_token
        self._pipe_id = settings.pipefy_pipe_id
        self._field_nome = settings.pipefy_field_nome
        self._field_email = settings.pipefy_field_email
        self._field_patrimonio = settings.pipefy_field_patrimonio
        self._field_tipo_solicitacao = settings.pipefy_field_tipo_solicitacao
        self._field_status = settings.pipefy_field_status
        self._field_prioridade = settings.pipefy_field_prioridade
        self._timeout = settings.pipefy_timeout_seconds

    async def create_card(self, client: Client) -> PipefyResult:
        mutation = self._create_card_query()
        variables = self._create_card_variables(client)
        return await self._execute_with_fallback(mutation, variables, "createCard")

    async def update_card_fields(self, card_id: str, new_status: str, priority: str) -> PipefyResult:
        mutation = self._update_fields_query()
        variables = self._update_fields_variables(card_id, new_status, priority)
        return await self._execute_with_fallback(mutation, variables, "updateFieldsValues")

    def _create_card_query(self) -> str:
        return """
            mutation createCard($input: CreateCardInput!) {
                createCard(input: $input) {
                    card {
                        id
                        title
                        current_phase { name }
                        createdAt
                    }
                }
            }
        """

    def _create_card_variables(self, client: Client) -> dict:
        fields = self._build_card_fields(client)
        return {
            "input": {
                "pipe_id": self._pipe_id,
                "fields_attributes": fields,
            }
        }

    def _build_card_fields(self, client: Client) -> list[dict]:
        return [
            self._build_field(self._field_nome, client.cliente_nome),
            self._build_field(self._field_email, client.cliente_email),
            self._build_field(self._field_patrimonio, str(client.valor_patrimonio)),
            self._build_field(self._field_tipo_solicitacao, client.tipo_solicitacao),
            self._build_field(self._field_status, client.status),
            self._build_field(self._field_prioridade, client.prioridade or ""),
        ]

    @staticmethod
    def _build_field(field_id: str, field_value: str) -> dict:
        return {"field_id": field_id, "field_value": field_value}

    def _update_fields_query(self) -> str:
        return """
            mutation updateFieldsValues($input: UpdateFieldsValuesInput!) {
                updateFieldsValues(input: $input) {
                    success
                    updatedNode {
                        ... on Card {
                            id
                            fields { name value }
                        }
                    }
                }
            }
        """

    def _update_fields_variables(self, card_id: str, new_status: str, priority: str) -> dict:
        return {
            "input": {
                "nodeId": card_id,
                "values": [
                    {"fieldId": self._field_status, "value": new_status},
                    {"fieldId": self._field_prioridade, "value": priority},
                ],
            }
        }

    async def _execute_with_fallback(self, query: str, variables: dict, operation: str) -> PipefyResult:
        payload = self._build_payload(query, variables)
        self._log_request(operation, payload)

        result = await self._send_request(payload)
        if result is not None:
            return self._handle_response(result, operation)

        return self._handle_fallback(operation, payload)

    def _build_payload(self, query: str, variables: dict) -> dict:
        return {"query": query.strip(), "variables": variables}

    def _build_headers(self) -> dict:
        return {
            "Authorization": f"Bearer {self._api_token}",
            "Content-Type": "application/json",
        }

    async def _send_request(self, payload: dict) -> dict | None:
        try:
            async with httpx.AsyncClient(timeout=self._timeout) as http:
                response = await http.post(self._api_url, json=payload, headers=self._build_headers())
            return response.json()
        except httpx.HTTPError as exc:
            logger.error("Pipefy API unreachable: %s", str(exc))
            return None

    def _handle_response(self, data: dict, operation: str) -> PipefyResult:
        if "errors" in data:
            error_msg = json.dumps(data["errors"], ensure_ascii=False)
            logger.warning("⚠️  Pipefy [%s] API error — FALLBACK ativado (simulado): %s", operation, error_msg)
            return PipefyResult(
                status=PipefyStatus.SIMULATED,
                data=data,
                message=f"Pipefy retornou erro, operação simulada localmente: {error_msg}",
            )

        logger.info("✅ Pipefy [%s] enviado com sucesso para API real", operation)
        return PipefyResult(status=PipefyStatus.SUCCESS, data=data)

    def _handle_fallback(self, operation: str, payload: dict) -> PipefyResult:
        logger.warning(
            "⚠️  Pipefy [%s] API indisponível — FALLBACK ativado (simulado). Payload: %s",
            operation,
            json.dumps(payload, ensure_ascii=False),
        )
        return PipefyResult(
            status=PipefyStatus.SIMULATED,
            message=f"Pipefy indisponível, operação {operation} simulada localmente",
        )

    def _log_request(self, operation: str, payload: dict) -> None:
        logger.info("Pipefy [%s] request: %s", operation, json.dumps(payload, ensure_ascii=False))
