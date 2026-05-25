from __future__ import annotations

import asyncio
from datetime import datetime

from app.domain.entities.user import User
from app.domain.repositories.user_repository import UserRepository


class DynamoDBUserRepository(UserRepository):
    def __init__(self, table):
        self._table = table

    async def create(self, user: User) -> User:
        item = self._to_item(user)
        await asyncio.to_thread(self._table.put_item, Item=item)
        return user

    async def find_by_email(self, email: str) -> User | None:
        response = await asyncio.to_thread(
            self._table.get_item, Key={"email": email}
        )
        item = response.get("Item")
        if not item:
            return None
        return self._to_entity(item)

    async def update_password(self, user: User) -> None:
        await asyncio.to_thread(
            self._table.update_item,
            Key={"email": user.email},
            UpdateExpression="SET password_hash = :ph",
            ExpressionAttributeValues={":ph": user.password_hash},
        )

    def _to_item(self, user: User) -> dict:
        return {
            "email": user.email,
            "id": user.id,
            "name": user.name,
            "password_hash": user.password_hash,
            "role": user.role,
            "created_at": str(user.created_at),
        }

    def _to_entity(self, item: dict) -> User:
        return User(
            id=item["id"],
            email=item["email"],
            name=item["name"],
            password_hash=item["password_hash"],
            role=item["role"],
            created_at=datetime.fromisoformat(item["created_at"]) if isinstance(item["created_at"], str) else item["created_at"],
        )
