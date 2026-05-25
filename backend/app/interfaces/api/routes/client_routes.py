from __future__ import annotations

from fastapi import APIRouter, Depends, status

from app.application.dtos.client_dto import CreateClientRequest, ClientResponse
from app.application.use_cases.create_client import CreateClientUseCase
from app.infrastructure.repositories.dynamodb_client_repository import DynamoDBClientRepository
from app.interfaces.api.dependencies import get_create_client_use_case, get_client_repository, get_current_user

router = APIRouter(prefix="/clientes", tags=["Clientes"])


@router.post(
    "",
    response_model=ClientResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Criar Novo Cliente",
    description="Cria um novo cliente no DynamoDB com status 'Aguardando Análise' e constrói a mutation createCard do Pipefy.",
)
async def create_client(
    request: CreateClientRequest,
    _user: dict = Depends(get_current_user),
    use_case: CreateClientUseCase = Depends(get_create_client_use_case),
) -> ClientResponse:
    return await use_case.execute(request)


@router.get(
    "",
    response_model=list[ClientResponse],
    summary="Listar Clientes",
    description="Retorna todos os clientes cadastrados no DynamoDB.",
)
async def list_clients(
    _user: dict = Depends(get_current_user),
    repo: DynamoDBClientRepository = Depends(get_client_repository),
) -> list[ClientResponse]:
    clients = await repo.find_all()
    return [
        ClientResponse(
            id=c.id,
            cliente_nome=c.cliente_nome,
            cliente_email=c.cliente_email,
            tipo_solicitacao=c.tipo_solicitacao,
            valor_patrimonio=c.valor_patrimonio,
            status=c.status,
            prioridade=c.prioridade,
            card_id=c.card_id,
            created_at=str(c.created_at),
            updated_at=str(c.updated_at),
        )
        for c in clients
    ]
