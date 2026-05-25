from __future__ import annotations

import logging

from app.domain.entities.client import Client
from app.domain.repositories.client_repository import ClientRepository
from app.infrastructure.external.pipefy_client import PipefyClient, PipefyResult, PipefyStatus
from app.infrastructure.aws.sns import SNSService
from app.application.dtos.client_dto import CreateClientRequest, ClientResponse

logger = logging.getLogger(__name__)


class CreateClientUseCase:
    def __init__(self, client_repo: ClientRepository, pipefy_client: PipefyClient, sns: SNSService):
        self._client_repo = client_repo
        self._pipefy_client = pipefy_client
        self._sns = sns

    async def execute(self, request: CreateClientRequest) -> ClientResponse:
        client = self._build_client(request)
        saved_client = await self._client_repo.create(client)
        pipefy_result = await self._pipefy_client.create_card(saved_client)
        self._assign_card_id(saved_client, pipefy_result)
        if saved_client.card_id:
            await self._client_repo.update(saved_client)
        await self._notify_creation(saved_client)
        return self._to_response(saved_client, pipefy_result)

    def _assign_card_id(self, client: Client, result: PipefyResult) -> None:
        if result.status != PipefyStatus.SUCCESS or not result.data:
            logger.warning("Pipefy card_id not assigned: status=%s", result.status)
            return
        card_data = result.data.get("data", {}).get("createCard", {}).get("card", {})
        card_id = card_data.get("id")
        if card_id:
            client.card_id = str(card_id)
            logger.info("Card ID assigned: %s for client %s", client.card_id, client.cliente_email)
        else:
            logger.warning("Pipefy response missing card ID: %s", result.data)

    async def _notify_creation(self, client: Client) -> None:
        await self._sns.publish(
            subject="Novo Cliente Cadastrado",
            message={
                "action": "client_created",
                "cliente_nome": client.cliente_nome,
                "cliente_email": client.cliente_email,
                "valor_patrimonio": client.valor_patrimonio,
            },
        )

    def _build_client(self, request: CreateClientRequest) -> Client:
        return Client(
            cliente_nome=request.cliente_nome,
            cliente_email=request.cliente_email,
            tipo_solicitacao=request.tipo_solicitacao,
            valor_patrimonio=request.valor_patrimonio,
        )

    def _to_response(self, client: Client, pipefy_result: PipefyResult) -> ClientResponse:
        return ClientResponse(
            id=client.id,
            cliente_nome=client.cliente_nome,
            cliente_email=client.cliente_email,
            tipo_solicitacao=client.tipo_solicitacao,
            valor_patrimonio=client.valor_patrimonio,
            status=client.status,
            prioridade=client.prioridade,
            card_id=client.card_id,
            pipefy_status=pipefy_result.status.value,
            pipefy_message=pipefy_result.message,
            created_at=str(client.created_at),
            updated_at=str(client.updated_at),
        )
