from dataclasses import dataclass, field
from datetime import datetime
from uuid import uuid4


@dataclass
class WebhookEvent:
    event_id: str
    card_id: str
    cliente_email: str
    timestamp: str
    processed: bool = False
    id: str = field(default_factory=lambda: str(uuid4()))
    created_at: datetime = field(default_factory=datetime.utcnow)
