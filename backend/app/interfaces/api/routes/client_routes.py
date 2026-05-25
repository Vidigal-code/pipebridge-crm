from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status

from app.application.dtos.client_dto import CreateClientRequest, ClientResponse
from app.application.use_cases.create_client import CreateClientUseCase
from app.infrastructure.repositories.dynamodb_client_repository import DynamoDBClientRepository
from app.interfaces.api.dependencies import get_create_client_use_case, get_client_repository, get_current_user

router = APIRouter(prefix="/clientes", tags=["Clientes"])


def _to_response(c) -> ClientResponse:
    return ClientResponse(
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
    return [_to_response(c) for c in clients]


@router.put(
    "/{client_id}",
    response_model=ClientResponse,
    summary="Atualizar Cliente",
    description="Atualiza os dados de um cliente existente no DynamoDB.",
)
async def update_client(
    client_id: str,
    request: CreateClientRequest,
    _user: dict = Depends(get_current_user),
    repo: DynamoDBClientRepository = Depends(get_client_repository),
) -> ClientResponse:
    client = await repo.find_by_id(client_id)
    if not client:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cliente não encontrado")
    client.cliente_nome = request.cliente_nome
    client.cliente_email = request.cliente_email
    client.tipo_solicitacao = request.tipo_solicitacao
    client.valor_patrimonio = request.valor_patrimonio
    updated = await repo.update_full(client)
    return _to_response(updated)


@router.delete(
    "/{client_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Remover Cliente",
    description="Remove um cliente do DynamoDB pelo ID.",
)
async def delete_client(
    client_id: str,
    _user: dict = Depends(get_current_user),
    repo: DynamoDBClientRepository = Depends(get_client_repository),
) -> None:
    client = await repo.find_by_id(client_id)
    if not client:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cliente não encontrado")
    await repo.delete(client_id)
