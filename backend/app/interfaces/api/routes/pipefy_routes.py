from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

from app.infrastructure.external.pipefy_client import PipefyClient, PipefyStatus
from app.interfaces.api.dependencies import get_pipefy_client, get_current_user

router = APIRouter(prefix="/pipefy", tags=["Pipefy"])


class PipefyCardField(BaseModel):
    field_id: str
    name: str
    value: str


class PipefyCardResponse(BaseModel):
    id: str
    title: str
    phase: str
    created_at: str
    fields: list[PipefyCardField]


class UpdateCardRequest(BaseModel):
    fields: list[dict]


def _parse_cards(data: dict | None) -> list[PipefyCardResponse]:
    if not data:
        return []
    edges = data.get("data", {}).get("allCards", {}).get("edges", [])
    return [_parse_card_node(edge.get("node", {})) for edge in edges]


def _parse_card_node(node: dict) -> PipefyCardResponse:
    return PipefyCardResponse(
        id=str(node.get("id", "")),
        title=node.get("title", ""),
        phase=node.get("current_phase", {}).get("name", ""),
        created_at=node.get("createdAt", ""),
        fields=[
            PipefyCardField(
                field_id=f.get("field", {}).get("id", ""),
                name=f.get("name", ""),
                value=f.get("value") or "",
            )
            for f in node.get("fields", [])
        ],
    )


@router.get(
    "/cards",
    response_model=list[PipefyCardResponse],
    summary="Listar Cards do Pipefy",
)
async def list_cards(
    _user: dict = Depends(get_current_user),
    pipefy: PipefyClient = Depends(get_pipefy_client),
) -> list[PipefyCardResponse]:
    result = await pipefy.list_cards()
    return _parse_cards(result.data)


@router.put(
    "/cards/{card_id}",
    summary="Atualizar Card no Pipefy",
)
async def update_card(
    card_id: str,
    request: UpdateCardRequest,
    _user: dict = Depends(get_current_user),
    pipefy: PipefyClient = Depends(get_pipefy_client),
) -> dict:
    result = await pipefy.update_card(card_id, request.fields)
    if result.status != PipefyStatus.SUCCESS:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=result.message or "Falha ao atualizar card no Pipefy",
        )
    return {"success": True, "message": "Card atualizado com sucesso"}


@router.delete(
    "/cards/{card_id}",
    summary="Deletar Card do Pipefy",
)
async def delete_card(
    card_id: str,
    _user: dict = Depends(get_current_user),
    pipefy: PipefyClient = Depends(get_pipefy_client),
) -> dict:
    result = await pipefy.delete_card(card_id)
    if result.status != PipefyStatus.SUCCESS:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=result.message or "Falha ao deletar card no Pipefy",
        )
    return {"success": True, "message": "Card deletado com sucesso"}
