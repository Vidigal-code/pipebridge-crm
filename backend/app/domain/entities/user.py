from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
from uuid import uuid4

from app.domain.enums.role import Role


@dataclass
class User:
    email: str
    name: str
    password_hash: str
    role: str = Role.USER
    id: str = field(default_factory=lambda: str(uuid4()))
    created_at: datetime = field(default_factory=datetime.utcnow)
