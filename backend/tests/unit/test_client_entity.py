import pytest
from app.domain.entities.client import Client
from app.domain.enums.status import ClientStatus
from app.domain.enums.priority import Priority


class TestClientEntity:
    def test_default_status_is_aguardando_analise(self):
        client = Client(
            cliente_nome="Test",
            cliente_email="test@test.com",
            tipo_solicitacao="Test",
            valor_patrimonio=100000,
        )
        assert client.status == ClientStatus.AGUARDANDO_ANALISE

    def test_calculate_priority_alta_when_patrimonio_gte_200000(self):
        client = Client(
            cliente_nome="Test",
            cliente_email="test@test.com",
            tipo_solicitacao="Test",
            valor_patrimonio=200000,
        )
        assert client.calculate_priority() == Priority.PRIORIDADE_ALTA

    def test_calculate_priority_alta_when_patrimonio_above_200000(self):
        client = Client(
            cliente_nome="Test",
            cliente_email="test@test.com",
            tipo_solicitacao="Test",
            valor_patrimonio=500000,
        )
        assert client.calculate_priority() == Priority.PRIORIDADE_ALTA

    def test_calculate_priority_normal_when_patrimonio_lt_200000(self):
        client = Client(
            cliente_nome="Test",
            cliente_email="test@test.com",
            tipo_solicitacao="Test",
            valor_patrimonio=199999,
        )
        assert client.calculate_priority() == Priority.PRIORIDADE_NORMAL

    def test_mark_as_processed_updates_status_and_priority(self):
        client = Client(
            cliente_nome="Test",
            cliente_email="test@test.com",
            tipo_solicitacao="Test",
            valor_patrimonio=250000,
        )
        client.mark_as_processed()
        assert client.status == ClientStatus.PROCESSADO
        assert client.prioridade == Priority.PRIORIDADE_ALTA

    def test_mark_as_processed_low_patrimonio(self):
        client = Client(
            cliente_nome="Test",
            cliente_email="test@test.com",
            tipo_solicitacao="Test",
            valor_patrimonio=50000,
        )
        client.mark_as_processed()
        assert client.status == ClientStatus.PROCESSADO
        assert client.prioridade == Priority.PRIORIDADE_NORMAL
