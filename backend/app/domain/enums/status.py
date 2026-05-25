from enum import Enum


class ClientStatus(str, Enum):
    AGUARDANDO_ANALISE = "Aguardando Análise"
    PROCESSADO = "Processado"
