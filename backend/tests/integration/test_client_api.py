import pytest


VALID_CLIENT_PAYLOAD = {
    "cliente_nome": "João Silva",
    "cliente_email": "joao.silva@example.com",
    "tipo_solicitacao": "Atualização cadastral",
    "valor_patrimonio": 250000,
}


class TestCreateClientValidPayload:
    def test_returns_201_with_valid_data(self, client):
        response = client.post("/clientes", json=VALID_CLIENT_PAYLOAD)
        assert response.status_code == 201

    def test_returns_client_with_generated_id(self, client):
        data = client.post("/clientes", json=VALID_CLIENT_PAYLOAD).json()
        assert data["id"] is not None
        assert len(data["id"]) > 0

    def test_returns_all_input_fields(self, client):
        data = client.post("/clientes", json=VALID_CLIENT_PAYLOAD).json()
        assert data["cliente_nome"] == VALID_CLIENT_PAYLOAD["cliente_nome"]
        assert data["cliente_email"] == VALID_CLIENT_PAYLOAD["cliente_email"]
        assert data["tipo_solicitacao"] == VALID_CLIENT_PAYLOAD["tipo_solicitacao"]
        assert data["valor_patrimonio"] == VALID_CLIENT_PAYLOAD["valor_patrimonio"]

    def test_sets_initial_status_aguardando_analise(self, client):
        data = client.post("/clientes", json=VALID_CLIENT_PAYLOAD).json()
        assert data["status"] == "Aguardando Análise"

    def test_prioridade_is_null_before_webhook(self, client):
        data = client.post("/clientes", json=VALID_CLIENT_PAYLOAD).json()
        assert data["prioridade"] is None

    def test_persists_client_in_database(self, client):
        client.post("/clientes", json=VALID_CLIENT_PAYLOAD)
        response = client.get("/clientes")
        data = response.json()
        assert len(data) >= 1
        emails = [c["cliente_email"] for c in data]
        assert VALID_CLIENT_PAYLOAD["cliente_email"] in emails


class TestCreateClientValidation:
    def test_missing_nome_returns_422(self, client):
        payload = {
            "cliente_email": "joao@example.com",
            "tipo_solicitacao": "Test",
            "valor_patrimonio": 100000,
        }
        assert client.post("/clientes", json=payload).status_code == 422

    def test_invalid_email_returns_422(self, client):
        payload = {
            "cliente_nome": "Test",
            "cliente_email": "not-an-email",
            "tipo_solicitacao": "Test",
            "valor_patrimonio": 100000,
        }
        assert client.post("/clientes", json=payload).status_code == 422

    def test_negative_patrimonio_returns_422(self, client):
        payload = {
            "cliente_nome": "Test",
            "cliente_email": "test@test.com",
            "tipo_solicitacao": "Test",
            "valor_patrimonio": -1,
        }
        assert client.post("/clientes", json=payload).status_code == 422

    def test_zero_patrimonio_returns_422(self, client):
        payload = {
            "cliente_nome": "Test",
            "cliente_email": "test@test.com",
            "tipo_solicitacao": "Test",
            "valor_patrimonio": 0,
        }
        assert client.post("/clientes", json=payload).status_code == 422

    def test_missing_tipo_solicitacao_returns_422(self, client):
        payload = {
            "cliente_nome": "Test",
            "cliente_email": "test@test.com",
            "valor_patrimonio": 100000,
        }
        assert client.post("/clientes", json=payload).status_code == 422

    def test_empty_body_returns_422(self, client):
        assert client.post("/clientes", json={}).status_code == 422


class TestListClients:
    def test_returns_200(self, client):
        assert client.get("/clientes").status_code == 200

    def test_returns_empty_list_initially(self, client):
        assert client.get("/clientes").json() == []

    def test_returns_created_client(self, client):
        client.post("/clientes", json=VALID_CLIENT_PAYLOAD)
        data = client.get("/clientes").json()
        assert len(data) == 1
        assert data[0]["cliente_email"] == VALID_CLIENT_PAYLOAD["cliente_email"]
