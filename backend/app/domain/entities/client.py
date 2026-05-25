from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
from uuid import uuid4

from app.domain.enums.status import ClientStatus
from app.domain.enums.priority import Priority


@dataclass
class Client:
    cliente_nome: str
    cliente_email: str
    tipo_solicitacao: str
    valor_patrimonio: float
    status: str = ClientStatus.AGUARDANDO_ANALISE
    prioridade: str | None = None
    card_id: str | None = None
    id: str = field(default_factory=lambda: str(uuid4()))
    created_at: datetime = field(default_factory=datetime.utcnow)
    updated_at: datetime = field(default_factory=datetime.utcnow)

    def calculate_priority(self) -> str:
        threshold = 200_000
        if self.valor_patrimonio >= threshold:
            return Priority.PRIORIDADE_ALTA
        return Priority.PRIORIDADE_NORMAL

    def mark_as_processed(self) -> None:
        self.status = ClientStatus.PROCESSADO
        self.prioridade = self.calculate_priority()
        self.updated_at = datetime.utcnow()
