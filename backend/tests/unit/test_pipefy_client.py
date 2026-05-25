import pytest
from unittest.mock import AsyncMock, patch, MagicMock

from app.infrastructure.external.pipefy_client import PipefyClient, PipefyStatus
from app.domain.entities.client import Client
from app.domain.enums.status import ClientStatus
from app.domain.enums.priority import Priority


def _build_mock_http(response_data: dict):
    mock_response = MagicMock()
    mock_response.json.return_value = response_data

    mock_client = AsyncMock()
    mock_client.__aenter__ = AsyncMock(return_value=mock_client)
    mock_client.__aexit__ = AsyncMock(return_value=False)
    mock_client.post = AsyncMock(return_value=mock_response)
    return mock_client


def _build_unreachable_http():
    import httpx

    mock_client = AsyncMock()
    mock_client.__aenter__ = AsyncMock(return_value=mock_client)
    mock_client.__aexit__ = AsyncMock(return_value=False)
    mock_client.post = AsyncMock(side_effect=httpx.ConnectError("Connection refused"))
    return mock_client


def _extract_payload(mock_http):
    call_kwargs = mock_http.post.call_args
    return call_kwargs.kwargs.get("json") or call_kwargs[1].get("json")


def _extract_headers(mock_http):
    call_kwargs = mock_http.post.call_args
    return call_kwargs.kwargs.get("headers") or call_kwargs[1].get("headers")


def _extract_field_ids(payload):
    return [f["field_id"] for f in payload["variables"]["input"]["fields_attributes"]]


def _extract_field_map(payload):
    return {
        f["field_id"]: f["field_value"]
        for f in payload["variables"]["input"]["fields_attributes"]
    }


def _build_client(**overrides):
    defaults = {
        "cliente_nome": "João Silva",
        "cliente_email": "joao@test.com",
        "tipo_solicitacao": "Atualização cadastral",
        "valor_patrimonio": 250000,
    }
    defaults.update(overrides)
    return Client(**defaults)


class TestCreateCardMutation:
    def setup_method(self):
        self._pipefy = PipefyClient()

    @pytest.mark.asyncio
    async def test_sends_graphql_create_card_mutation(self):
        mock_http = _build_mock_http({"data": {"createCard": {"card": {"id": "123"}}}})

        with patch("httpx.AsyncClient", return_value=mock_http):
            result = await self._pipefy.create_card(_build_client())

        payload = _extract_payload(mock_http)
        assert "mutation createCard" in payload["query"]
        assert "CreateCardInput" in payload["query"]
        assert result.status == PipefyStatus.SUCCESS

    @pytest.mark.asyncio
    async def test_sends_pipe_id_in_variables(self):
        mock_http = _build_mock_http({"data": {"createCard": {"card": {"id": "123"}}}})

        with patch("httpx.AsyncClient", return_value=mock_http):
            await self._pipefy.create_card(_build_client())

        payload = _extract_payload(mock_http)
        assert "pipe_id" in payload["variables"]["input"]
        assert "fields_attributes" in payload["variables"]["input"]

    @pytest.mark.asyncio
    async def test_includes_all_six_field_ids(self):
        mock_http = _build_mock_http({"data": {"createCard": {"card": {"id": "456"}}}})

        with patch("httpx.AsyncClient", return_value=mock_http):
            await self._pipefy.create_card(_build_client())

        field_ids = _extract_field_ids(_extract_payload(mock_http))
        assert "cliente_nome" in field_ids
        assert "cliente_email" in field_ids
        assert "valor_patrimonio" in field_ids
        assert "tipo_solicitacao" in field_ids
        assert "status" in field_ids
        assert "prioridade" in field_ids

    @pytest.mark.asyncio
    async def test_maps_client_values_to_fields(self):
        client = _build_client(
            cliente_nome="Maria",
            cliente_email="maria@test.com",
            valor_patrimonio=300000,
            tipo_solicitacao="Abertura de conta",
        )
        mock_http = _build_mock_http({"data": {"createCard": {"card": {"id": "789"}}}})

        with patch("httpx.AsyncClient", return_value=mock_http):
            await self._pipefy.create_card(client)

        field_map = _extract_field_map(_extract_payload(mock_http))
        assert field_map["cliente_nome"] == "Maria"
        assert field_map["cliente_email"] == "maria@test.com"
        assert field_map["valor_patrimonio"] == "300000"
        assert field_map["tipo_solicitacao"] == "Abertura de conta"
        assert field_map["status"] == ClientStatus.AGUARDANDO_ANALISE
        assert field_map["prioridade"] == ""

    @pytest.mark.asyncio
    async def test_sends_status_and_prioridade_after_processing(self):
        client = _build_client(valor_patrimonio=250000)
        client.mark_as_processed()

        mock_http = _build_mock_http({"data": {"createCard": {"card": {"id": "999"}}}})

        with patch("httpx.AsyncClient", return_value=mock_http):
            await self._pipefy.create_card(client)

        field_map = _extract_field_map(_extract_payload(mock_http))
        assert field_map["status"] == ClientStatus.PROCESSADO
        assert field_map["prioridade"] == Priority.PRIORIDADE_ALTA


class TestUpdateFieldsMutation:
    def setup_method(self):
        self._pipefy = PipefyClient()

    @pytest.mark.asyncio
    async def test_sends_graphql_update_fields_mutation(self):
        mock_http = _build_mock_http({"data": {"updateFieldsValues": {"success": True}}})

        with patch("httpx.AsyncClient", return_value=mock_http):
            result = await self._pipefy.update_card_fields("card_123", "Processado", "prioridade_alta")

        payload = _extract_payload(mock_http)
        assert "mutation updateFieldsValues" in payload["query"]
        assert "UpdateFieldsValuesInput" in payload["query"]
        assert result.status == PipefyStatus.SUCCESS

    @pytest.mark.asyncio
    async def test_sends_card_id_as_node_id(self):
        mock_http = _build_mock_http({"data": {"updateFieldsValues": {"success": True}}})

        with patch("httpx.AsyncClient", return_value=mock_http):
            await self._pipefy.update_card_fields("card_abc", "Processado", "prioridade_alta")

        payload = _extract_payload(mock_http)
        assert payload["variables"]["input"]["nodeId"] == "card_abc"

    @pytest.mark.asyncio
    async def test_sends_status_and_prioridade_values(self):
        mock_http = _build_mock_http({"data": {"updateFieldsValues": {"success": True}}})

        with patch("httpx.AsyncClient", return_value=mock_http):
            await self._pipefy.update_card_fields("card_123", "Processado", "prioridade_normal")

        values = _extract_payload(mock_http)["variables"]["input"]["values"]
        status_field = next(v for v in values if v["fieldId"] == "status")
        priority_field = next(v for v in values if v["fieldId"] == "prioridade")
        assert status_field["value"] == "Processado"
        assert priority_field["value"] == "prioridade_normal"

    @pytest.mark.asyncio
    async def test_sends_exactly_two_field_updates(self):
        mock_http = _build_mock_http({"data": {"updateFieldsValues": {"success": True}}})

        with patch("httpx.AsyncClient", return_value=mock_http):
            await self._pipefy.update_card_fields("card_123", "Processado", "prioridade_alta")

        values = _extract_payload(mock_http)["variables"]["input"]["values"]
        assert len(values) == 2


class TestPipefyAuthentication:
    def setup_method(self):
        self._pipefy = PipefyClient()

    @pytest.mark.asyncio
    async def test_sends_bearer_token_header(self):
        mock_http = _build_mock_http({"data": {"createCard": {"card": {"id": "789"}}}})

        with patch("httpx.AsyncClient", return_value=mock_http):
            await self._pipefy.create_card(_build_client())

        headers = _extract_headers(mock_http)
        assert "Authorization" in headers
        assert headers["Authorization"].startswith("Bearer ")
        assert headers["Content-Type"] == "application/json"


class TestPipefyFallback:
    def setup_method(self):
        self._pipefy = PipefyClient()

    @pytest.mark.asyncio
    async def test_returns_simulated_on_api_error_response(self):
        mock_http = _build_mock_http({"errors": [{"message": "Field not found"}]})

        with patch("httpx.AsyncClient", return_value=mock_http):
            result = await self._pipefy.create_card(_build_client())

        assert result.status == PipefyStatus.SIMULATED

    @pytest.mark.asyncio
    async def test_returns_simulated_on_api_unreachable(self):
        mock_http = _build_unreachable_http()

        with patch("httpx.AsyncClient", return_value=mock_http):
            result = await self._pipefy.create_card(_build_client())

        assert result.status == PipefyStatus.SIMULATED

    @pytest.mark.asyncio
    async def test_fallback_update_also_returns_simulated(self):
        mock_http = _build_unreachable_http()

        with patch("httpx.AsyncClient", return_value=mock_http):
            result = await self._pipefy.update_card_fields("card_x", "Processado", "prioridade_alta")

        assert result.status == PipefyStatus.SIMULATED
