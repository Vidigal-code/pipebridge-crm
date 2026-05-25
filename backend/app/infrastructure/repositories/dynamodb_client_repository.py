from __future__ import annotations

import asyncio
from datetime import datetime
from boto3.dynamodb.conditions import Key

from app.domain.entities.client import Client
from app.domain.repositories.client_repository import ClientRepository


class DynamoDBClientRepository(ClientRepository):
    def __init__(self, table):
        self._table = table

    async def create(self, client: Client) -> Client:
        item = self._to_item(client)
        await asyncio.to_thread(self._table.put_item, Item=item)
        return client

    async def find_by_email(self, email: str) -> Client | None:
        response = await asyncio.to_thread(
            self._table.query,
            IndexName="email-index",
            KeyConditionExpression=Key("cliente_email").eq(email),
        )
        items = response.get("Items", [])
        if not items:
            return None
        return self._to_entity(items[0])

    async def find_by_id(self, client_id: str) -> Client | None:
        response = await asyncio.to_thread(
            self._table.get_item, Key={"id": client_id}
        )
        item = response.get("Item")
        if not item:
            return None
        return self._to_entity(item)

    async def update(self, client: Client) -> Client:
        await asyncio.to_thread(
            self._table.update_item,
            Key={"id": client.id},
            UpdateExpression="SET #s = :s, prioridade = :p, card_id = :c, updated_at = :u",
            ExpressionAttributeNames={"#s": "status"},
            ExpressionAttributeValues={
                ":s": client.status,
                ":p": client.prioridade,
                ":c": client.card_id,
                ":u": str(client.updated_at),
            },
        )
        return client

    async def update_full(self, client: Client) -> Client:
        item = self._to_item(client)
        await asyncio.to_thread(self._table.put_item, Item=item)
        return client

    async def delete(self, client_id: str) -> None:
        await asyncio.to_thread(
            self._table.delete_item, Key={"id": client_id}
        )

    async def find_all(self) -> list[Client]:
        response = await asyncio.to_thread(self._table.scan)
        items = response.get("Items", [])
        return [self._to_entity(item) for item in items]

    def _to_item(self, client: Client) -> dict:
        return {
            "id": client.id,
            "cliente_nome": client.cliente_nome,
            "cliente_email": client.cliente_email,
            "tipo_solicitacao": client.tipo_solicitacao,
            "valor_patrimonio": str(client.valor_patrimonio),
            "status": client.status,
            "prioridade": client.prioridade or "",
            "card_id": client.card_id or "",
            "created_at": str(client.created_at),
            "updated_at": str(client.updated_at),
        }

    def _to_entity(self, item: dict) -> Client:
        return Client(
            id=item["id"],
            cliente_nome=item["cliente_nome"],
            cliente_email=item["cliente_email"],
            tipo_solicitacao=item["tipo_solicitacao"],
            valor_patrimonio=float(item["valor_patrimonio"]),
            status=item["status"],
            prioridade=item.get("prioridade") or None,
            card_id=item.get("card_id") or None,
            created_at=datetime.fromisoformat(item["created_at"]) if isinstance(item["created_at"], str) else item["created_at"],
            updated_at=datetime.fromisoformat(item["updated_at"]) if isinstance(item["updated_at"], str) else item["updated_at"],
        )
