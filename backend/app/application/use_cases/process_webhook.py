from __future__ import annotations

from fastapi import HTTPException, status

from app.domain.entities.webhook_event import WebhookEvent
from app.domain.repositories.client_repository import ClientRepository
from app.domain.repositories.webhook_event_repository import WebhookEventRepository
from app.infrastructure.external.pipefy_client import PipefyClient, PipefyResult
from app.infrastructure.aws.sqs import SQSService
from app.infrastructure.aws.sns import SNSService
from app.application.dtos.webhook_dto import WebhookRequest, WebhookResponse


class ProcessWebhookUseCase:
    def __init__(
        self,
        client_repo: ClientRepository,
        event_repo: WebhookEventRepository,
        pipefy_client: PipefyClient,
        sqs: SQSService,
        sns: SNSService,
    ):
        self._client_repo = client_repo
        self._event_repo = event_repo
        self._pipefy_client = pipefy_client
        self._sqs = sqs
        self._sns = sns

    async def execute(self, request: WebhookRequest) -> WebhookResponse:
        await self._ensure_not_duplicate(request.event_id)
        client = await self._find_client(request.cliente_email)

        client.mark_as_processed()
        effective_card_id = self._resolve_card_id(client, request.card_id)
        client.card_id = effective_card_id
        await self._client_repo.update(client)

        pipefy_result = await self._pipefy_client.update_card_fields(
            card_id=effective_card_id,
            new_status=client.status,
            priority=client.prioridade,
        )

        await self._save_event(request)
        await self._publish_to_queue(request, client.prioridade)
        await self._notify_processed(client)

        return self._to_response(request, client, pipefy_result)

    @staticmethod
    def _resolve_card_id(client, request_card_id: str) -> str:
        return client.card_id or request_card_id

    async def _ensure_not_duplicate(self, event_id: str) -> None:
        existing = await self._event_repo.find_by_event_id(event_id)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Evento {event_id} já foi processado",
            )

    async def _find_client(self, email: str):
        client = await self._client_repo.find_by_email(email)
        if not client:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Cliente com email {email} não encontrado",
            )
        return client

    async def _save_event(self, request: WebhookRequest) -> None:
        event = WebhookEvent(
            event_id=request.event_id,
            card_id=request.card_id,
            cliente_email=request.cliente_email,
            timestamp=request.timestamp,
            processed=True,
        )
        await self._event_repo.create(event)

    async def _publish_to_queue(self, request: WebhookRequest, priority: str) -> None:
        await self._sqs.send_message({
            "event_id": request.event_id,
            "card_id": request.card_id,
            "cliente_email": request.cliente_email,
            "prioridade": priority,
        })

    async def _notify_processed(self, client) -> None:
        await self._sns.publish(
            subject="Cliente Processado",
            message={
                "action": "client_processed",
                "cliente_nome": client.cliente_nome,
                "cliente_email": client.cliente_email,
                "prioridade": client.prioridade,
                "status": client.status,
            },
        )

    def _to_response(self, request: WebhookRequest, client, pipefy_result: PipefyResult) -> WebhookResponse:
        return WebhookResponse(
            event_id=request.event_id,
            status=client.status,
            prioridade=client.prioridade,
            message="Webhook processado com sucesso",
            pipefy_status=pipefy_result.status.value,
            pipefy_message=pipefy_result.message,
        )
