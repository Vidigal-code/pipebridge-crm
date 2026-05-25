from __future__ import annotations

from abc import ABC, abstractmethod

from app.domain.entities.webhook_event import WebhookEvent


class WebhookEventRepository(ABC):
    @abstractmethod
    async def create(self, event: WebhookEvent) -> WebhookEvent:
        ...

    @abstractmethod
    async def find_by_event_id(self, event_id: str) -> WebhookEvent | None:
        ...
