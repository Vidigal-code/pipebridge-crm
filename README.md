# PipeBridge CRM

[![Python](https://img.shields.io/badge/Python-3.12-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)](https://docs.docker.com/compose/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> **GitHub:** [https://github.com/Vidigal-code/pipebridge-crm](https://github.com/Vidigal-code/pipebridge-crm)

---

## 🇧🇷 Descrição em Português

<details>
<summary><strong>Ver Detalhes</strong></summary>

### Visão Geral

Sistema fullstack de gerenciamento de clientes com integração Pipefy via GraphQL, persistência em DynamoDB (AWS LocalStack) e processamento assíncrono via SQS/SNS. Desenvolvido como solução para o teste técnico de **Client Management & Pipefy Integration** da Mundo Invest.

### Arquitetura

```
┌─────────────┐     ┌──────────────┐     ┌──────────────────┐
│   Frontend  │────▶│   Backend    │────▶│   LocalStack     │
│   Next.js   │     │   FastAPI    │     │  (DynamoDB/SQS)  │
│   Port 3000 │◀────│   Port 8001  │◀────│  Port 4566       │
└─────────────┘     └──────────────┘     └──────────────────┘
```

| Camada | Tecnologia |
|---|---|
| Frontend | Next.js 16, React 19, Tailwind CSS v4, TypeScript |
| Backend | Python 3.12, FastAPI, Pydantic v2 |
| Banco de Dados | Amazon DynamoDB (via LocalStack) |
| Fila | Amazon SQS (via LocalStack) |
| Notificações | Amazon SNS (via LocalStack) |
| Autenticação | JWT (HS256) + PBKDF2-SHA256 |
| Containerização | Docker Compose |

### Execução Local

**Pré-requisitos:** Docker e Docker Compose instalados.

```bash
git clone https://github.com/Vidigal-code/pipebridge-crm.git
cd pipebridge-crm
docker compose up --build
```

| Serviço | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8001 |
| Swagger PT-BR | http://localhost:8001/pt/docs |
| Swagger EN | http://localhost:8001/en/docs |

**Credenciais padrão:**
- Email: `admin@mundoinvest.com`
- Senha: `Admin@12345`

### Executar Testes

```bash
cd backend
pip install -r requirements.txt
python -m pytest tests/ -v
```

**Cobertura dos testes (49 testes):**
- ✅ Criação de cliente com payload válido e salvamento no banco
- ✅ Processamento do webhook com regra de prioridade correta
- ✅ Bloqueio de event_id duplicado (idempotência)
- ✅ Cliente não encontrado retorna 404
- ✅ Validação de campos obrigatórios
- ✅ Mutations GraphQL do Pipefy estruturadas corretamente

### Exemplos de Requisição (curl)

#### Fluxo 1: Criar Cliente

```bash
# Login para obter o token
TOKEN=$(curl -s -X POST http://localhost:8001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@mundoinvest.com","password":"Admin@12345"}' | \
  python3 -c "import sys,json;print(json.load(sys.stdin)['access_token'])")

# Criar cliente
curl -X POST http://localhost:8001/clientes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "cliente_nome": "João Silva",
    "cliente_email": "joao.silva@example.com",
    "tipo_solicitacao": "Atualização cadastral",
    "valor_patrimonio": 250000
  }'
```

#### Fluxo 2: Simular Webhook

```bash
curl -X POST http://localhost:8001/webhooks/pipefy/card-updated \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "event_id": "evt_123",
    "card_id": "card_456",
    "cliente_email": "joao.silva@example.com",
    "timestamp": "2026-05-18T12:00:00Z"
  }'
```

### Integração Pipefy GraphQL

O sistema estrutura as mutations GraphQL seguindo rigorosamente a [documentação oficial do Pipefy](https://developers.pipefy.com/reference/graphql).

#### Mutation: createCard

Utilizada ao criar um novo cliente (`POST /clientes`). A mutation segue a especificação da API GraphQL do Pipefy:

```graphql
mutation createCard($input: CreateCardInput!) {
  createCard(input: $input) {
    card {
      id
      title
      current_phase { name }
      createdAt
    }
  }
}
```

Variáveis:
```json
{
  "input": {
    "pipe_id": 307171021,
    "fields_attributes": [
      { "field_id": "cliente_nome", "field_value": "João Silva" },
      { "field_id": "cliente_email", "field_value": "joao.silva@example.com" },
      { "field_id": "valor_patrimonio", "field_value": "250000" },
      { "field_id": "tipo_solicitacao", "field_value": "Atualização cadastral" },
      { "field_id": "status", "field_value": "Aguardando Análise" },
      { "field_id": "prioridade", "field_value": "" }
    ]
  }
}
```

**Localização no código:** `backend/app/infrastructure/external/pipefy_client.py` → `create_card()`

Os `field_id` são configuráveis via `.env` (`PIPEFY_FIELD_NOME`, `PIPEFY_FIELD_EMAIL`, `PIPEFY_FIELD_PATRIMONIO`, `PIPEFY_FIELD_TIPO_SOLICITACAO`).

#### Mutation: updateFieldsValues

Utilizada ao processar um webhook (`POST /webhooks/pipefy/card-updated`). Atualiza o status para "Processado" e define a prioridade calculada:

```graphql
mutation updateFieldsValues($input: UpdateFieldsValuesInput!) {
  updateFieldsValues(input: $input) {
    success
    updatedNode {
      ... on Card {
        id
        fields { name value }
      }
    }
  }
}
```

Variáveis:
```json
{
  "input": {
    "nodeId": "card_456",
    "values": [
      { "fieldId": "status", "value": "Processado" },
      { "fieldId": "prioridade", "value": "prioridade_alta" }
    ]
  }
}
```

**Localização no código:** `backend/app/infrastructure/external/pipefy_client.py` → `update_card_fields()`

#### Real API + Fallback

O sistema tenta enviar as mutations para a API **real** do Pipefy. Se a API estiver indisponível ou retornar erro, o **fallback** é ativado automaticamente — a persistência local (DynamoDB) é mantida e o payload da mutation é logado para auditoria. A resposta da API sempre inclui `pipefy_status` (`success` ou `simulated`) e `pipefy_message`.

### Estrutura de Pastas

```
pipebridge-crm/
├── backend/
│   ├── app/
│   │   ├── application/         # Use Cases + DTOs (regras de aplicação)
│   │   ├── config/              # Settings, Logging, Swagger Bilíngue
│   │   ├── domain/              # Entities, Enums, Repository Interfaces
│   │   ├── infrastructure/      # AWS, Auth, External (Pipefy), Repositories
│   │   ├── interfaces/          # API Routes, Middleware, Dependencies
│   │   └── main.py              # FastAPI app factory
│   └── tests/                   # Pytest (unit + integration)
├── frontend/
│   ├── src/
│   │   ├── app/                 # Pages (Next.js App Router)
│   │   ├── entities/            # Client, Webhook, Pipefy (FSD)
│   │   ├── features/            # Auth, Create Client, Webhook, Change Password (FSD)
│   │   ├── shared/              # UI, API, Auth, Theme, Design Tokens
│   │   ├── store/               # React Query Provider
│   │   └── widgets/             # Sidebar, Dashboard, AuthLayout
│   └── Dockerfile
├── localstack/
│   └── init-aws.sh              # DynamoDB tables, SQS queues, SNS topics
├── docker-compose.yml
├── .env
└── README.md
```

### Visão de Produção (AWS)

Para escalar na AWS, a arquitetura migraria de LocalStack para serviços reais:

| LocalStack (Local) | AWS (Produção) |
|---|---|
| FastAPI (Container) | **API Gateway + AWS Lambda** (serverless, auto-scaling) |
| DynamoDB (LocalStack) | **Amazon DynamoDB** (Global Tables, auto-scaling, TTL) |
| SQS (LocalStack) | **Amazon SQS** (processamento assíncrono desacoplado) |
| SNS (LocalStack) | **Amazon SNS** (notificações push, email, SMS) |
| Docker Compose | **AWS ECS/Fargate** ou **Lambda** |
| — | **Amazon CloudWatch** (logs, métricas, alertas) |
| — | **AWS WAF** (proteção contra ataques) |

O código já abstrai os clientes AWS via `AWSClientFactory`, bastando remover o `endpoint_url` para apontar aos serviços reais.

### Integração Pipefy com Fallback

O sistema tenta enviar as mutations GraphQL para a API real do Pipefy. Se a API estiver indisponível ou retornar erro, o **fallback** é ativado automaticamente:

| Cenário | `pipefy_status` | Log |
|---|---|---|
| ✅ API respondeu com sucesso | `success` | `✅ Pipefy [createCard] enviado com sucesso para API real` |
| ⚠️ API retornou erro | `simulated` | `⚠️ Pipefy [createCard] API error — FALLBACK ativado (simulado)` |
| ⚠️ API indisponível | `simulated` | `⚠️ Pipefy [createCard] API indisponível — FALLBACK ativado (simulado)` |

A resposta da API sempre inclui `pipefy_status` e `pipefy_message` para visibilidade.

### Logs Rotativos

Logs são salvos em `backend/logs/app.log` com rotação automática:

| Variável | Descrição | Default |
|---|---|---|
| `LOG_ENABLED` | Ativar/desativar logs | `true` |
| `LOG_DIR` | Diretório dos logs | `logs` |
| `LOG_MAX_BYTES` | Tamanho máximo por arquivo | `10485760` (10MB) |
| `LOG_BACKUP_COUNT` | Quantidade de backups | `5` |

### Segurança

- **JWT HS256** com expiração configurável
- **PBKDF2-SHA256** para hash de senhas (100.000 iterações)
- **Rate Limiting** por IP (sliding window)
- **Security Headers** OWASP (HSTS, CSP, X-Frame-Options)
- **Request ID** UUID para rastreamento
- **CORS** configurável via `.env`
- **Validação de senha forte** (8+ chars, maiúscula, minúscula, número, especial)
- **Zero hardcodes** — todos os IDs de campos, credenciais, timeouts e nomes são configuráveis via `.env`

</details>

---

## 🇺🇸 English Description

<details>
<summary><strong>View Details</strong></summary>

### Overview

Fullstack client management system with Pipefy integration via GraphQL, DynamoDB persistence (AWS LocalStack) and asynchronous processing via SQS/SNS. Built as a solution for the **Client Management & Pipefy Integration** technical challenge at Mundo Invest.

### Architecture

```
┌─────────────┐     ┌──────────────┐     ┌──────────────────┐
│   Frontend  │────▶│   Backend    │────▶│   LocalStack     │
│   Next.js   │     │   FastAPI    │     │  (DynamoDB/SQS)  │
│   Port 3000 │◀────│   Port 8001  │◀────│  Port 4566       │
└─────────────┘     └──────────────┘     └──────────────────┘
```

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, React 19, Tailwind CSS v4, TypeScript |
| Backend | Python 3.12, FastAPI, Pydantic v2 |
| Database | Amazon DynamoDB (via LocalStack) |
| Queue | Amazon SQS (via LocalStack) |
| Notifications | Amazon SNS (via LocalStack) |
| Authentication | JWT (HS256) + PBKDF2-SHA256 |
| Containerization | Docker Compose |

### Local Setup

**Prerequisites:** Docker and Docker Compose installed.

```bash
git clone https://github.com/Vidigal-code/pipebridge-crm.git
cd pipebridge-crm
docker compose up --build
```

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8001 |
| Swagger PT-BR | http://localhost:8001/pt/docs |
| Swagger EN | http://localhost:8001/en/docs |

**Default credentials:**
- Email: `admin@mundoinvest.com`
- Password: `Admin@12345`

### Running Tests

```bash
cd backend
pip install -r requirements.txt
python -m pytest tests/ -v
```

**Test coverage (49 tests):**
- ✅ Client creation with valid payload and database persistence
- ✅ Webhook processing with correct priority rule based on net worth
- ✅ Duplicate event_id blocking (idempotency)
- ✅ Client not found returns 404
- ✅ Required field validation
- ✅ Pipefy GraphQL mutations correctly structured

### Request Examples (curl)

#### Flow 1: Create Client

```bash
# Login to get token
TOKEN=$(curl -s -X POST http://localhost:8001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@mundoinvest.com","password":"Admin@12345"}' | \
  python3 -c "import sys,json;print(json.load(sys.stdin)['access_token'])")

# Create client
curl -X POST http://localhost:8001/clientes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "cliente_nome": "João Silva",
    "cliente_email": "joao.silva@example.com",
    "tipo_solicitacao": "Atualização cadastral",
    "valor_patrimonio": 250000
  }'
```

#### Flow 2: Simulate Webhook

```bash
curl -X POST http://localhost:8001/webhooks/pipefy/card-updated \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "event_id": "evt_123",
    "card_id": "card_456",
    "cliente_email": "joao.silva@example.com",
    "timestamp": "2026-05-18T12:00:00Z"
  }'
```

### Pipefy GraphQL Integration

The system structures GraphQL mutations strictly following the [official Pipefy documentation](https://developers.pipefy.com/reference/graphql).

#### Mutation: createCard

Used when creating a new client (`POST /clientes`). The mutation follows the Pipefy GraphQL API specification:

```graphql
mutation createCard($input: CreateCardInput!) {
  createCard(input: $input) {
    card {
      id
      title
      current_phase { name }
      createdAt
    }
  }
}
```

Variables:
```json
{
  "input": {
    "pipe_id": 307171021,
    "fields_attributes": [
      { "field_id": "cliente_nome", "field_value": "João Silva" },
      { "field_id": "cliente_email", "field_value": "joao.silva@example.com" },
      { "field_id": "valor_patrimonio", "field_value": "250000" },
      { "field_id": "tipo_solicitacao", "field_value": "Atualização cadastral" },
      { "field_id": "status", "field_value": "Aguardando Análise" },
      { "field_id": "prioridade", "field_value": "" }
    ]
  }
}
```

**Code location:** `backend/app/infrastructure/external/pipefy_client.py` → `create_card()`

The `field_id` values are configurable via `.env` (`PIPEFY_FIELD_NOME`, `PIPEFY_FIELD_EMAIL`, `PIPEFY_FIELD_PATRIMONIO`, `PIPEFY_FIELD_TIPO_SOLICITACAO`).

#### Mutation: updateFieldsValues

Used when processing a webhook (`POST /webhooks/pipefy/card-updated`). Updates status to "Processado" and sets the calculated priority:

```graphql
mutation updateFieldsValues($input: UpdateFieldsValuesInput!) {
  updateFieldsValues(input: $input) {
    success
    updatedNode {
      ... on Card {
        id
        fields { name value }
      }
    }
  }
}
```

Variables:
```json
{
  "input": {
    "nodeId": "card_456",
    "values": [
      { "fieldId": "status", "value": "Processado" },
      { "fieldId": "prioridade", "value": "prioridade_alta" }
    ]
  }
}
```

**Code location:** `backend/app/infrastructure/external/pipefy_client.py` → `update_card_fields()`

#### Real API + Fallback

The system attempts to send mutations to the real Pipefy API. If the API is unavailable or returns errors, an automatic **fallback** is triggered:

| Scenario | `pipefy_status` | Log |
|---|---|---|
| ✅ API responded successfully | `success` | `✅ Pipefy [createCard] sent successfully to real API` |
| ⚠️ API returned error | `simulated` | `⚠️ Pipefy [createCard] API error — FALLBACK activated (simulated)` |
| ⚠️ API unreachable | `simulated` | `⚠️ Pipefy [createCard] API unreachable — FALLBACK activated (simulated)` |

### Rotating Logs

Logs are saved to `backend/logs/app.log` with automatic rotation:

| Variable | Description | Default |
|---|---|---|
| `LOG_ENABLED` | Enable/disable logs | `true` |
| `LOG_DIR` | Log directory | `logs` |
| `LOG_MAX_BYTES` | Max file size | `10485760` (10MB) |
| `LOG_BACKUP_COUNT` | Backup file count | `5` |

### Folder Structure

```
pipebridge-crm/
├── backend/
│   ├── app/
│   │   ├── application/         # Use Cases + DTOs (application rules)
│   │   ├── config/              # Settings, Logging, Bilingual Swagger
│   │   ├── domain/              # Entities, Enums, Repository Interfaces
│   │   ├── infrastructure/      # AWS, Auth, External (Pipefy), Repositories
│   │   ├── interfaces/          # API Routes, Middleware, Dependencies
│   │   └── main.py              # FastAPI app factory
│   └── tests/                   # Pytest (unit + integration)
├── frontend/
│   ├── src/
│   │   ├── app/                 # Pages (Next.js App Router)
│   │   ├── entities/            # Client, Webhook, Pipefy (FSD)
│   │   ├── features/            # Auth, Create Client, Webhook, Change Password (FSD)
│   │   ├── shared/              # UI, API, Auth, Theme, Design Tokens
│   │   ├── store/               # React Query Provider
│   │   └── widgets/             # Sidebar, Dashboard, AuthLayout
│   └── Dockerfile
├── localstack/
│   └── init-aws.sh              # DynamoDB tables, SQS queues, SNS topics
├── docker-compose.yml
├── .env
└── README.md
```

### Production Vision (AWS)

To scale on AWS, the architecture would migrate from LocalStack to real services:

| LocalStack (Local) | AWS (Production) |
|---|---|
| FastAPI (Container) | **API Gateway + AWS Lambda** (serverless, auto-scaling) |
| DynamoDB (LocalStack) | **Amazon DynamoDB** (Global Tables, auto-scaling, TTL) |
| SQS (LocalStack) | **Amazon SQS** (decoupled async processing) |
| SNS (LocalStack) | **Amazon SNS** (push, email, SMS notifications) |
| Docker Compose | **AWS ECS/Fargate** or **Lambda** |
| — | **Amazon CloudWatch** (logs, metrics, alerts) |
| — | **AWS WAF** (attack protection) |

The code already abstracts AWS clients via `AWSClientFactory`. Just remove the `endpoint_url` to point to real services.

### Security

- **JWT HS256** with configurable expiration
- **PBKDF2-SHA256** password hashing (100,000 iterations)
- **Rate Limiting** per IP (sliding window)
- **Security Headers** OWASP (HSTS, CSP, X-Frame-Options)
- **Request ID** UUID tracking per request
- **CORS** configurable via `.env`
- **Strong password validation** (8+ chars, uppercase, lowercase, number, special char)
- **Rotating logs** with configurable size and backup count
- **Zero hardcodes** — all field IDs, credentials, timeouts and names are configurable via `.env`

</details>
