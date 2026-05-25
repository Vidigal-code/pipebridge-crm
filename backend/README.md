# PipeBridge CRM — Backend

[![Python](https://img.shields.io/badge/Python-3.12-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Pydantic](https://img.shields.io/badge/Pydantic-v2-E92063?logo=pydantic&logoColor=white)](https://docs.pydantic.dev/)
[![Pytest](https://img.shields.io/badge/Pytest-49_tests-0A9EDC?logo=pytest&logoColor=white)](https://docs.pytest.org/)

> **GitHub:** [https://github.com/Vidigal-code/pipebridge-crm](https://github.com/Vidigal-code/pipebridge-crm)

---

## 🇧🇷 Descrição em Português

<details>
<summary><strong>Ver Detalhes</strong></summary>

### Visão Geral

API REST em Python/FastAPI com persistência DynamoDB, integração Pipefy via GraphQL, autenticação JWT e processamento assíncrono SQS/SNS.

### Stack

| Tecnologia | Versão |
|---|---|
| Python | 3.12 |
| FastAPI | 0.115 |
| Pydantic | 2.11 |
| Boto3 (AWS SDK) | 1.38 |
| PyJWT | 2.10 |
| Pytest + Moto | 8.4 / 5.1 |

### Arquitetura de Pastas

```
backend/
├── app/
│   ├── application/                    # Camada de Aplicação
│   │   ├── dtos/                       # Data Transfer Objects (Request/Response)
│   │   │   ├── auth_dto.py             # Login, ChangePassword, UserResponse
│   │   │   ├── client_dto.py           # CreateClientRequest, ClientResponse
│   │   │   └── webhook_dto.py          # WebhookRequest, WebhookResponse
│   │   └── use_cases/                  # Casos de Uso
│   │       ├── authenticate_user.py    # Login com JWT
│   │       ├── change_password.py      # Alterar senha com validação forte
│   │       ├── create_client.py        # Criar cliente + mutation createCard
│   │       └── process_webhook.py      # Processar webhook + idempotência
│   │
│   ├── config/
│   │   ├── settings.py                 # Pydantic Settings (lê .env)
│   │   └── logging_config.py           # Logging rotativo configurável
│   │
│   ├── domain/                         # Camada de Domínio
│   │   ├── entities/                   # Entidades de negócio
│   │   │   ├── client.py               # Cliente (calculate_priority, mark_as_processed)
│   │   │   ├── user.py                 # Usuário (RBAC)
│   │   │   └── webhook_event.py        # Evento de webhook (idempotência)
│   │   ├── enums/                      # Enumerações do domínio
│   │   │   ├── priority.py             # prioridade_alta, prioridade_normal
│   │   │   ├── role.py                 # admin, user
│   │   │   └── status.py              # Aguardando Análise, Processado
│   │   └── repositories/              # Interfaces (contratos)
│   │       ├── client_repository.py
│   │       ├── user_repository.py
│   │       └── webhook_event_repository.py
│   │
│   ├── infrastructure/                 # Camada de Infraestrutura
│   │   ├── auth/
│   │   │   ├── jwt_handler.py          # Criar/decodificar JWT (HS256)
│   │   │   └── password_handler.py     # PBKDF2-SHA256 (100k iterações)
│   │   ├── aws/
│   │   │   ├── client_factory.py       # Factory para DynamoDB/SQS/SNS
│   │   │   ├── sns.py                  # Publicar notificações
│   │   │   └── sqs.py                  # Enviar mensagens para fila
│   │   ├── external/
│   │   │   └── pipefy_client.py        # Mutations GraphQL + fallback real/simulado
│   │   └── repositories/              # Implementações DynamoDB
│   │       ├── dynamodb_client_repository.py
│   │       ├── dynamodb_user_repository.py
│   │       └── dynamodb_webhook_event_repository.py
│   │
│   ├── interfaces/                     # Camada de Interface
│   │   └── api/
│   │       ├── dependencies.py         # Injeção de dependência (FastAPI Depends)
│   │       ├── middleware/
│   │       │   ├── rate_limiter.py      # Rate limiting por IP
│   │       │   ├── request_id.py        # UUID por request
│   │       │   └── security_headers.py  # Headers OWASP
│   │       └── routes/
│   │           ├── auth_routes.py       # POST /auth/login, GET /auth/me, PUT /auth/password
│   │           ├── client_routes.py     # POST /clientes, GET /clientes
│   │           └── webhook_routes.py    # POST /webhooks/pipefy/card-updated
│   │
│   └── main.py                         # App factory + seed admin
│
└── tests/
    ├── conftest.py                     # Fixtures com moto (mock AWS)
    ├── integration/
    │   ├── test_client_api.py          # 5 testes de criação de cliente
    │   └── test_webhook_api.py         # 6 testes de webhook
    └── unit/
        ├── test_client_entity.py       # 6 testes de regras de negócio
        └── test_pipefy_client.py       # 4 testes de mutations GraphQL
```

### Endpoints

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| `POST` | `/auth/login` | ❌ | Login → JWT token |
| `GET` | `/auth/me` | ✅ | Dados do usuário autenticado |
| `PUT` | `/auth/password` | ✅ | Alterar senha |
| `POST` | `/clientes` | ✅ | Criar cliente (+ mutation createCard) |
| `GET` | `/clientes` | ✅ | Listar todos os clientes |
| `POST` | `/webhooks/pipefy/card-updated` | ✅ | Processar webhook (+ mutation updateFieldsValues) |
| `GET` | `/health` | ❌ | Health check |

### Mutations GraphQL do Pipefy

#### createCard

Construída em `pipefy_client.py` → `create_card()`.
Segue a [documentação oficial do Pipefy](https://developers.pipefy.com/reference/graphql):

```graphql
mutation createCard($input: CreateCardInput!) {
    createCard(input: $input) {
        card { id title current_phase { name } createdAt }
    }
}
```

Os `field_id` são lidos do `.env` (`PIPEFY_FIELD_NOME`, `PIPEFY_FIELD_EMAIL`, `PIPEFY_FIELD_PATRIMONIO`, `PIPEFY_FIELD_TIPO_SOLICITACAO`, `PIPEFY_FIELD_STATUS`, `PIPEFY_FIELD_PRIORIDADE`).

#### updateFieldsValues

Construída em `pipefy_client.py` → `update_card_fields()`:

```graphql
mutation updateFieldsValues($input: UpdateFieldsValuesInput!) {
    updateFieldsValues(input: $input) {
        success
        updatedNode { ... on Card { id fields { name value } } }
    }
}
```

### Testes

```bash
pip install -r requirements.txt
python -m pytest tests/ -v
```

| Categoria | Testes | Total |
|---|---|---|
| Criação de cliente (integração) | Payload válido, email inválido, campos faltando, patrimônio inválido, listagem | 11 |
| Webhook (integração) | Prioridade alta, normal, duplicado, not found, update DB, threshold | 16 |
| Entidade Client (unitário) | Status inicial, prioridade alta/normal, mark_as_processed | 6 |
| PipefyClient (unitário) | createCard, updateFields, auth, fallback (6 campos + status/prioridade) | 16 |
| **Total** | | **49** |

### Segurança

- **JWT HS256** com expiração configurável via `JWT_EXPIRATION_MINUTES`
- **PBKDF2-SHA256** para hashing de senhas (100.000 iterações + salt aleatório)
- **Comparação em tempo constante** (HMAC) para evitar timing attacks
- **Rate Limiting** por IP (sliding window configurável)
- **Security Headers** OWASP (HSTS, CSP, X-Frame-Options, X-Content-Type-Options)
- **Request ID** UUID em cada request para rastreamento
- **Validação de senha forte**: 8+ chars, maiúscula, minúscula, número, especial (@$!%*?&)
- **Logs rotativos** configuráveis via `.env` (`LOG_ENABLED`, `LOG_DIR`, `LOG_MAX_BYTES`, `LOG_BACKUP_COUNT`)
- **Zero hardcodes** — todos os field IDs, credenciais, timeouts e nomes configuráveis via `.env`

### Integração Pipefy com Fallback

O sistema tenta enviar mutations para a API real do Pipefy. Se falhar, o **fallback** simula a operação localmente:

| Cenário | `pipefy_status` | Ação |
|---|---|---|
| ✅ API respondeu | `success` | Card criado/atualizado no Pipefy real |
| ⚠️ API com erro | `simulated` | Payload logado, persistência local mantida |
| ⚠️ API indisponível | `simulated` | Payload logado, persistência local mantida |

### Logs Rotativos

| Variável | Descrição | Default |
|---|---|---|
| `LOG_ENABLED` | Ativar/desativar | `true` |
| `LOG_DIR` | Diretório | `logs` |
| `LOG_MAX_BYTES` | Tamanho máximo | `10485760` (10MB) |
| `LOG_BACKUP_COUNT` | Backups | `5` |

</details>

---

## 🇺🇸 English Description

<details>
<summary><strong>View Details</strong></summary>

### Overview

REST API in Python/FastAPI with DynamoDB persistence, Pipefy integration via GraphQL, JWT authentication and SQS/SNS asynchronous processing.

### Stack

| Technology | Version |
|---|---|
| Python | 3.12 |
| FastAPI | 0.115 |
| Pydantic | 2.11 |
| Boto3 (AWS SDK) | 1.38 |
| PyJWT | 2.10 |
| Pytest + Moto | 8.4 / 5.1 |

### Folder Architecture

```
backend/
├── app/
│   ├── application/                    # Application Layer
│   │   ├── dtos/                       # Data Transfer Objects (Request/Response)
│   │   │   ├── auth_dto.py             # Login, ChangePassword, UserResponse
│   │   │   ├── client_dto.py           # CreateClientRequest, ClientResponse
│   │   │   └── webhook_dto.py          # WebhookRequest, WebhookResponse
│   │   └── use_cases/                  # Use Cases
│   │       ├── authenticate_user.py    # JWT Login
│   │       ├── change_password.py      # Change password with strong validation
│   │       ├── create_client.py        # Create client + createCard mutation
│   │       └── process_webhook.py      # Process webhook + idempotency
│   │
│   ├── config/
│   │   ├── settings.py                 # Pydantic Settings (reads .env)
│   │   └── logging_config.py           # Configurable rotating logging
│   │
│   ├── domain/                         # Domain Layer
│   │   ├── entities/                   # Business entities
│   │   │   ├── client.py               # Client (calculate_priority, mark_as_processed)
│   │   │   ├── user.py                 # User (RBAC)
│   │   │   └── webhook_event.py        # Webhook event (idempotency)
│   │   ├── enums/                      # Domain enumerations
│   │   │   ├── priority.py             # prioridade_alta, prioridade_normal
│   │   │   ├── role.py                 # admin, user
│   │   │   └── status.py              # Aguardando Análise, Processado
│   │   └── repositories/              # Interfaces (contracts)
│   │       ├── client_repository.py
│   │       ├── user_repository.py
│   │       └── webhook_event_repository.py
│   │
│   ├── infrastructure/                 # Infrastructure Layer
│   │   ├── auth/
│   │   │   ├── jwt_handler.py          # Create/decode JWT (HS256)
│   │   │   └── password_handler.py     # PBKDF2-SHA256 (100k iterations)
│   │   ├── aws/
│   │   │   ├── client_factory.py       # Factory for DynamoDB/SQS/SNS
│   │   │   ├── sns.py                  # Publish notifications
│   │   │   └── sqs.py                  # Send messages to queue
│   │   ├── external/
│   │   │   └── pipefy_client.py        # GraphQL mutations + real/simulated fallback
│   │   └── repositories/              # DynamoDB implementations
│   │       ├── dynamodb_client_repository.py
│   │       ├── dynamodb_user_repository.py
│   │       └── dynamodb_webhook_event_repository.py
│   │
│   ├── interfaces/                     # Interface Layer
│   │   └── api/
│   │       ├── dependencies.py         # Dependency injection (FastAPI Depends)
│   │       ├── middleware/
│   │       │   ├── rate_limiter.py      # Rate limiting per IP
│   │       │   ├── request_id.py        # UUID per request
│   │       │   └── security_headers.py  # OWASP headers
│   │       └── routes/
│   │           ├── auth_routes.py       # POST /auth/login, GET /auth/me, PUT /auth/password
│   │           ├── client_routes.py     # POST /clientes, GET /clientes
│   │           └── webhook_routes.py    # POST /webhooks/pipefy/card-updated
│   │
│   └── main.py                         # App factory + admin seed
│
└── tests/
    ├── conftest.py                     # Fixtures with moto (AWS mock)
    ├── integration/
    │   ├── test_client_api.py          # 11 client creation tests
    │   └── test_webhook_api.py         # 16 webhook tests
    └── unit/
        ├── test_client_entity.py       # 6 business rule tests
        └── test_pipefy_client.py       # 16 GraphQL mutation tests
```

### Endpoints

| Method | Route | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/login` | ❌ | Login → JWT token |
| `GET` | `/auth/me` | ✅ | Authenticated user data |
| `PUT` | `/auth/password` | ✅ | Change password |
| `POST` | `/clientes` | ✅ | Create client (+ createCard mutation) |
| `GET` | `/clientes` | ✅ | List all clients |
| `POST` | `/webhooks/pipefy/card-updated` | ✅ | Process webhook (+ updateFieldsValues mutation) |
| `GET` | `/health` | ❌ | Health check |

### Pipefy GraphQL Mutations

#### createCard

Built in `pipefy_client.py` → `create_card()`.
Follows the [official Pipefy documentation](https://developers.pipefy.com/reference/graphql):

```graphql
mutation createCard($input: CreateCardInput!) {
    createCard(input: $input) {
        card { id title current_phase { name } createdAt }
    }
}
```

The `field_id` values are read from `.env` (`PIPEFY_FIELD_NOME`, `PIPEFY_FIELD_EMAIL`, `PIPEFY_FIELD_PATRIMONIO`, `PIPEFY_FIELD_TIPO_SOLICITACAO`, `PIPEFY_FIELD_STATUS`, `PIPEFY_FIELD_PRIORIDADE`).

#### updateFieldsValues

Built in `pipefy_client.py` → `update_card_fields()`:

```graphql
mutation updateFieldsValues($input: UpdateFieldsValuesInput!) {
    updateFieldsValues(input: $input) {
        success
        updatedNode { ... on Card { id fields { name value } } }
    }
}
```

### Tests

```bash
pip install -r requirements.txt
python -m pytest tests/ -v
```

| Category | Tests | Total |
|---|---|---|
| Client creation (integration) | Valid payload, invalid email, missing fields, invalid net worth, listing | 11 |
| Webhook (integration) | High priority, normal, duplicate, not found, update DB, threshold | 16 |
| Client entity (unit) | Initial status, high/normal priority, mark_as_processed | 6 |
| PipefyClient (unit) | createCard, updateFields, auth, fallback (6 fields + status/prioridade) | 16 |
| **Total** | | **49** |

### Security

- **JWT HS256** with configurable expiration via `JWT_EXPIRATION_MINUTES`
- **PBKDF2-SHA256** password hashing (100,000 iterations + random salt)
- **Constant-time comparison** (HMAC) to prevent timing attacks
- **Rate Limiting** per IP (configurable sliding window)
- **Security Headers** OWASP (HSTS, CSP, X-Frame-Options, X-Content-Type-Options)
- **Request ID** UUID per request for tracing
- **Strong password validation**: 8+ chars, uppercase, lowercase, number, special (@$!%*?&)
- **Rotating logs** configurable via `.env` (`LOG_ENABLED`, `LOG_DIR`, `LOG_MAX_BYTES`, `LOG_BACKUP_COUNT`)
- **Zero hardcodes** — all field IDs, credentials, timeouts and names configurable via `.env`

### Pipefy Integration with Fallback

The system attempts to send mutations to the real Pipefy API. If it fails, the **fallback** simulates the operation locally:

| Scenario | `pipefy_status` | Action |
|---|---|---|
| ✅ API responded | `success` | Card created/updated in real Pipefy |
| ⚠️ API error | `simulated` | Payload logged, local persistence maintained |
| ⚠️ API unreachable | `simulated` | Payload logged, local persistence maintained |

### Rotating Logs

| Variable | Description | Default |
|---|---|---|
| `LOG_ENABLED` | Enable/disable | `true` |
| `LOG_DIR` | Directory | `logs` |
| `LOG_MAX_BYTES` | Max file size | `10485760` (10MB) |
| `LOG_BACKUP_COUNT` | Backups | `5` |

</details>
