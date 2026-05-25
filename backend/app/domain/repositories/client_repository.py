from __future__ import annotations

from abc import ABC, abstractmethod

from app.domain.entities.client import Client


class ClientRepository(ABC):
    @abstractmethod
    async def create(self, client: Client) -> Client:
        ...

    @abstractmethod
    async def find_by_email(self, email: str) -> Client | None:
        ...

    @abstractmethod
    async def update(self, client: Client) -> Client:
        ...

    @abstractmethod
    async def find_all(self) -> list[Client]:
        ...

    @abstractmethod
    async def find_by_id(self, client_id: str) -> Client | None:
        ...

    @abstractmethod
    async def delete(self, client_id: str) -> None:
        ...
