from __future__ import annotations

import asyncio
import time
from datetime import datetime

from app.domain.entities.webhook_event import WebhookEvent
from app.domain.repositories.webhook_event_repository import WebhookEventRepository

TTL_SECONDS = 86400


class DynamoDBWebhookEventRepository(WebhookEventRepository):
    def __init__(self, table):
        self._table = table

    async def create(self, event: WebhookEvent) -> WebhookEvent:
        item = self._to_item(event)
        await asyncio.to_thread(self._table.put_item, Item=item)
        return event

    async def find_by_event_id(self, event_id: str) -> WebhookEvent | None:
        response = await asyncio.to_thread(
            self._table.get_item, Key={"event_id": event_id}
        )
        item = response.get("Item")
        if not item:
            return None
        return self._to_entity(item)

    def _to_item(self, event: WebhookEvent) -> dict:
        return {
            "event_id": event.event_id,
            "id": event.id,
            "card_id": event.card_id,
            "cliente_email": event.cliente_email,
            "timestamp": event.timestamp,
            "processed": event.processed,
            "created_at": str(event.created_at),
            "ttl": int(time.time()) + TTL_SECONDS,
        }

    def _to_entity(self, item: dict) -> WebhookEvent:
        return WebhookEvent(
            id=item["id"],
            event_id=item["event_id"],
            card_id=item["card_id"],
            cliente_email=item["cliente_email"],
            timestamp=item["timestamp"],
            processed=item.get("processed", False),
            created_at=datetime.fromisoformat(item["created_at"]) if isinstance(item["created_at"], str) else item["created_at"],
        )
