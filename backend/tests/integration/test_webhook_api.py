import pytest


def _create_client(http_client, email="joao.silva@example.com", patrimonio=250000):
    return http_client.post("/clientes", json={
        "cliente_nome": "João Silva",
        "cliente_email": email,
        "tipo_solicitacao": "Atualização cadastral",
        "valor_patrimonio": patrimonio,
    })


def _build_webhook(event_id="evt_123", card_id="card_456", email="joao.silva@example.com"):
    return {
        "event_id": event_id,
        "card_id": card_id,
        "cliente_email": email,
        "timestamp": "2026-05-18T12:00:00Z",
    }


def _send_webhook(http_client, **kwargs):
    return http_client.post("/webhooks/pipefy/card-updated", json=_build_webhook(**kwargs))


class TestWebhookPriorityRules:
    def test_high_priority_when_patrimonio_gte_200000(self, client):
        _create_client(client, patrimonio=250000)
        data = _send_webhook(client, event_id="evt_high").json()

        assert data["status"] == "Processado"
        assert data["prioridade"] == "prioridade_alta"

    def test_normal_priority_when_patrimonio_lt_200000(self, client):
        _create_client(client, email="maria@example.com", patrimonio=100000)
        data = _send_webhook(client, event_id="evt_normal", email="maria@example.com").json()

        assert data["status"] == "Processado"
        assert data["prioridade"] == "prioridade_normal"

    def test_high_priority_at_exact_threshold_200000(self, client):
        _create_client(client, email="edge@example.com", patrimonio=200000)
        data = _send_webhook(client, event_id="evt_edge", email="edge@example.com").json()

        assert data["prioridade"] == "prioridade_alta"

    def test_normal_priority_just_below_threshold(self, client):
        _create_client(client, email="below@example.com", patrimonio=199999)
        data = _send_webhook(client, event_id="evt_below", email="below@example.com").json()

        assert data["prioridade"] == "prioridade_normal"


class TestWebhookIdempotency:
    def test_first_processing_returns_200(self, client):
        _create_client(client)
        response = _send_webhook(client, event_id="evt_first")
        assert response.status_code == 200

    def test_duplicate_event_id_returns_409(self, client):
        _create_client(client)
        _send_webhook(client, event_id="evt_dup")
        response = _send_webhook(client, event_id="evt_dup")
        assert response.status_code == 409

    def test_different_event_ids_both_succeed(self, client):
        _create_client(client, email="a@example.com", patrimonio=100000)
        _create_client(client, email="b@example.com", patrimonio=300000)

        r1 = _send_webhook(client, event_id="evt_a", email="a@example.com")
        r2 = _send_webhook(client, event_id="evt_b", email="b@example.com")

        assert r1.status_code == 200
        assert r2.status_code == 200


class TestWebhookClientLookup:
    def test_returns_404_when_client_not_found(self, client):
        response = _send_webhook(client, event_id="evt_404", email="ghost@example.com")
        assert response.status_code == 404

    def test_returns_200_when_client_exists(self, client):
        _create_client(client)
        response = _send_webhook(client, event_id="evt_exists")
        assert response.status_code == 200


class TestWebhookDatabaseSync:
    def test_updates_status_to_processado_in_database(self, client):
        _create_client(client, patrimonio=300000)
        _send_webhook(client, event_id="evt_sync")

        clients_data = client.get("/clientes").json()
        updated = next(c for c in clients_data if c["cliente_email"] == "joao.silva@example.com")
        assert updated["status"] == "Processado"

    def test_saves_calculated_prioridade_in_database(self, client):
        _create_client(client, patrimonio=300000)
        _send_webhook(client, event_id="evt_prio_db")

        clients_data = client.get("/clientes").json()
        updated = next(c for c in clients_data if c["cliente_email"] == "joao.silva@example.com")
        assert updated["prioridade"] == "prioridade_alta"

    def test_status_remains_aguardando_before_webhook(self, client):
        _create_client(client, email="pending@example.com", patrimonio=50000)

        clients_data = client.get("/clientes").json()
        pending = next(c for c in clients_data if c["cliente_email"] == "pending@example.com")
        assert pending["status"] == "Aguardando Análise"
        assert pending["prioridade"] is None


class TestWebhookResponse:
    def test_returns_event_id_in_response(self, client):
        _create_client(client)
        data = _send_webhook(client, event_id="evt_resp").json()
        assert data["event_id"] == "evt_resp"

    def test_returns_pipefy_status_in_response(self, client):
        _create_client(client, email="pf@example.com")
        data = _send_webhook(client, event_id="evt_pf", email="pf@example.com").json()
        assert "pipefy_status" in data

    def test_returns_success_message(self, client):
        _create_client(client, email="msg@example.com")
        data = _send_webhook(client, event_id="evt_msg", email="msg@example.com").json()
        assert "message" in data
