from __future__ import annotations

from fastapi import APIRouter, Depends, status

from app.application.dtos.webhook_dto import WebhookRequest, WebhookResponse
from app.application.use_cases.process_webhook import ProcessWebhookUseCase
from app.interfaces.api.dependencies import get_process_webhook_use_case, get_current_user

router = APIRouter(prefix="/webhooks", tags=["Webhooks"])


@router.post(
    "/pipefy/card-updated",
    response_model=WebhookResponse,
    status_code=status.HTTP_200_OK,
    summary="Processar Webhook Card Updated",
    description="Simula o recebimento de um webhook do Pipefy quando um card é atualizado. "
    "Verifica idempotência pelo event_id, calcula prioridade pelo patrimônio, "
    "atualiza status para 'Processado' e publica em SQS/SNS.",
    responses={
        409: {"description": "Evento já processado (event_id duplicado)"},
        404: {"description": "Cliente não encontrado pelo email"},
    },
)
async def process_card_updated(
    request: WebhookRequest,
    _user: dict = Depends(get_current_user),
    use_case: ProcessWebhookUseCase = Depends(get_process_webhook_use_case),
) -> WebhookResponse:
    return await use_case.execute(request)
