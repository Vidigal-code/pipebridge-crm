# Setup and Execution

Client-request CRM integrated with Pipefy cards. It registers clients, processes an authenticated simulated webhook, calculates priority from assets and publishes SQS/SNS events. LocalStack represents AWS services in development. Responses indicate whether Pipefy execution was real or simulated.

## Configuration and deployment

Copy .env.example.txt to .env; configure LocalStack/AWS, tables/queues/topic, Pipefy token/pipe/fields and authentication. docker compose up --build runs localstack/init-aws.sh. Default backend: 8001; frontend: 3000; Swagger /pt/docs and /en/docs. Install requirements.txt and run python -m pytest tests/ -v; frontend has lint/build. For 409 check event_id; 404 email; simulated token/IDs/logs; AWS failures endpoint/region/initialized resources. README Lambda/ECS architecture is a possible evolution, not provisioned deployment.

## Execution commands

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

Names are extracted only from example files and environment references in source. Configure values locally; private credentials are excluded. NEXT_PUBLIC_ and VITE_ variables are public in the browser.

| Variable | Source |
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

## Related files

- [backend/app/application/use_cases/create_client.py](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/backend/app/application/use_cases/create_client.py)
- [backend/app/application/use_cases/process_webhook.py](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/backend/app/application/use_cases/process_webhook.py)
- [backend/app/domain/entities/client.py](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/backend/app/domain/entities/client.py)
- [backend/app/interfaces/api/routes/webhook_routes.py](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/backend/app/interfaces/api/routes/webhook_routes.py)
- [backend/app/infrastructure/external/pipefy_client.py](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/backend/app/infrastructure/external/pipefy_client.py)
- [localstack/init-aws.sh](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/localstack/init-aws.sh)
- [docker-compose.yml](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/docker-compose.yml)

## Navigation

- [Project guide](?menu=en&lang=en&id=6)
- [Source reference](?menu=en&lang=en&id=7)
