# Instalação e Execução

O projeto é totalmente containerizado para facilitar a execução local.

## Pré-requisitos
- Docker
- Docker Compose

## Passos para Rodar

1. Clone o repositório:
```bash
git clone https://github.com/Vidigal-code/pipebridge-crm.git
cd pipebridge-crm
```

2. Suba os containers:
```bash
docker compose up --build
```

## Serviços Disponíveis
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8001
- **Swagger Docs (PT-BR)**: http://localhost:8001/pt/docs

## Credenciais Padrão
- **Email**: `admin@mundoinvest.com`
- **Senha**: `Admin@12345`
