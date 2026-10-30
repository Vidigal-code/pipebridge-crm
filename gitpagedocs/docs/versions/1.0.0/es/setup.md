# Instalación y Ejecución

CRM de solicitudes integrado con cards Pipefy. Registra clientes, procesa webhook simulado/autenticado, calcula prioridad por patrimonio y publica eventos SQS/SNS. LocalStack representa AWS en desarrollo. Las respuestas indican ejecución Pipefy real o simulada.

## Configuración y despliegue

Copie .env.example.txt a .env; configure LocalStack/AWS, tablas/colas/tópico, token/pipe/fields Pipefy y autenticación. docker compose up --build ejecuta localstack/init-aws.sh. Backend: 8001; frontend: 3000; Swagger /pt/docs y /en/docs. Instale requirements.txt y ejecute python -m pytest tests/ -v; frontend lint/build. Ante 409 revise event_id; 404 email; simulated token/IDs/logs; fallo AWS endpoint/región/recursos. Lambda/ECS en README es una evolución posible, no despliegue provisionado.

## Comandos de ejecución

```sh
docker compose up --build
# Validation in a separately configured test environment
python -m pip install -r backend/requirements.txt
cd backend
python -m pytest tests/ -v
cd ..
npm --prefix frontend ci
npm --prefix frontend run build
```

Los nombres proceden solo de archivos de ejemplo y referencias del código. Configure los valores localmente; se excluyen credenciales privadas. NEXT_PUBLIC_ y VITE_ son variables públicas en el navegador.

| Variable | Origen |
| --- | --- |
| `ADMIN_EMAIL` | [.env.example.txt](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/.env.example.txt) |
| `ADMIN_NAME` | [.env.example.txt](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/.env.example.txt) |
| `ADMIN_PASSWORD` | [.env.example.txt](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/.env.example.txt) |
| `APP_ENV` | [.env.example.txt](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/.env.example.txt) |
| `APP_NAME` | [.env.example.txt](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/.env.example.txt) |
| `AWS_ACCESS_KEY_ID` | [.env.example.txt](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/.env.example.txt) |
| `AWS_DEFAULT_REGION` | [.env.example.txt](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/.env.example.txt) |
| `AWS_ENDPOINT_URL` | [.env.example.txt](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/.env.example.txt) |
| `AWS_SECRET_ACCESS_KEY` | [.env.example.txt](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/.env.example.txt) |
| `BACKEND_CORS_ORIGINS` | [.env.example.txt](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/.env.example.txt) |
| `BACKEND_HOST` | [.env.example.txt](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/.env.example.txt) |
| `BACKEND_PORT` | [.env.example.txt](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/.env.example.txt) |
| `DYNAMODB_CLIENTS_TABLE` | [.env.example.txt](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/.env.example.txt) |
| `DYNAMODB_EVENTS_TABLE` | [.env.example.txt](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/.env.example.txt) |
| `DYNAMODB_USERS_TABLE` | [.env.example.txt](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/.env.example.txt) |
| `FRONTEND_PORT` | [.env.example.txt](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/.env.example.txt) |
| `JWT_EXPIRATION_MINUTES` | [.env.example.txt](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/.env.example.txt) |
| `JWT_SECRET` | [.env.example.txt](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/.env.example.txt) |
| `LOG_BACKUP_COUNT` | [.env.example.txt](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/.env.example.txt) |
| `LOG_DIR` | [.env.example.txt](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/.env.example.txt) |
| `LOG_ENABLED` | [.env.example.txt](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/.env.example.txt) |
| `LOG_MAX_BYTES` | [.env.example.txt](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/.env.example.txt) |
| `NEXT_PUBLIC_API_URL` | [.env.example.txt](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/.env.example.txt), [frontend/src/shared/config/env.ts](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/frontend/src/shared/config/env.ts) |
| `NEXT_PUBLIC_PIPEFY_FIELD_EMAIL` | [.env.example.txt](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/.env.example.txt), [frontend/src/shared/config/env.ts](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/frontend/src/shared/config/env.ts) |
| `NEXT_PUBLIC_PIPEFY_FIELD_NOME` | [.env.example.txt](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/.env.example.txt), [frontend/src/shared/config/env.ts](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/frontend/src/shared/config/env.ts) |
| `NEXT_PUBLIC_PIPEFY_FIELD_PATRIMONIO` | [.env.example.txt](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/.env.example.txt), [frontend/src/shared/config/env.ts](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/frontend/src/shared/config/env.ts) |
| `NEXT_PUBLIC_PIPEFY_FIELD_PRIORIDADE` | [.env.example.txt](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/.env.example.txt), [frontend/src/shared/config/env.ts](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/frontend/src/shared/config/env.ts) |
| `NEXT_PUBLIC_PIPEFY_FIELD_STATUS` | [.env.example.txt](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/.env.example.txt), [frontend/src/shared/config/env.ts](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/frontend/src/shared/config/env.ts) |
| `NEXT_PUBLIC_PIPEFY_FIELD_TIPO_SOLICITACAO` | [.env.example.txt](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/.env.example.txt), [frontend/src/shared/config/env.ts](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/frontend/src/shared/config/env.ts) |
| `NEXT_PUBLIC_PIPEFY_PIPE_ID` | [.env.example.txt](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/.env.example.txt), [frontend/src/shared/config/env.ts](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/frontend/src/shared/config/env.ts) |
| `NEXT_PUBLIC_START_THEME` | [.env.example.txt](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/.env.example.txt), [frontend/src/shared/theme/provider.tsx](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/frontend/src/shared/theme/provider.tsx) |
| `PIPEFY_API_TOKEN` | [.env.example.txt](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/.env.example.txt) |
| `PIPEFY_API_URL` | [.env.example.txt](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/.env.example.txt) |
| `PIPEFY_FIELD_EMAIL` | [.env.example.txt](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/.env.example.txt) |
| `PIPEFY_FIELD_NOME` | [.env.example.txt](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/.env.example.txt) |
| `PIPEFY_FIELD_PATRIMONIO` | [.env.example.txt](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/.env.example.txt) |
| `PIPEFY_FIELD_PRIORIDADE` | [.env.example.txt](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/.env.example.txt) |
| `PIPEFY_FIELD_STATUS` | [.env.example.txt](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/.env.example.txt) |
| `PIPEFY_FIELD_TIPO_SOLICITACAO` | [.env.example.txt](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/.env.example.txt) |
| `PIPEFY_PIPE_ID` | [.env.example.txt](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/.env.example.txt) |
| `PIPEFY_TIMEOUT_SECONDS` | [.env.example.txt](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/.env.example.txt) |
| `RATE_LIMIT_REQUESTS` | [.env.example.txt](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/.env.example.txt) |
| `RATE_LIMIT_WINDOW_SECONDS` | [.env.example.txt](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/.env.example.txt) |
| `SEED_MAX_RETRIES` | [.env.example.txt](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/.env.example.txt) |
| `SEED_RETRY_DELAY` | [.env.example.txt](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/.env.example.txt) |
| `SNS_TOPIC_NAME` | [.env.example.txt](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/.env.example.txt) |
| `SQS_QUEUE_NAME` | [.env.example.txt](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/.env.example.txt) |

## Archivos relacionados

- [backend/app/application/use_cases/create_client.py](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/backend/app/application/use_cases/create_client.py)
- [backend/app/application/use_cases/process_webhook.py](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/backend/app/application/use_cases/process_webhook.py)
- [backend/app/domain/entities/client.py](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/backend/app/domain/entities/client.py)
- [backend/app/interfaces/api/routes/webhook_routes.py](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/backend/app/interfaces/api/routes/webhook_routes.py)
- [backend/app/infrastructure/external/pipefy_client.py](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/backend/app/infrastructure/external/pipefy_client.py)
- [localstack/init-aws.sh](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/localstack/init-aws.sh)
- [docker-compose.yml](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/docker-compose.yml)

## Navegación

- [Project guide](?menu=es&lang=es&id=6)
- [Source reference](?menu=es&lang=es&id=7)
