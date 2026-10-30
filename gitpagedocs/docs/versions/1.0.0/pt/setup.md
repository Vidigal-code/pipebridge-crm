# Instalação e Execução

CRM de solicitações de clientes integrado a cards Pipefy. Cadastra clientes, processa um webhook simulado/autenticado, calcula prioridade por patrimônio e publica eventos em SQS/SNS. LocalStack representa os serviços AWS no desenvolvimento. As respostas indicam se a operação Pipefy foi real ou simulada.

## Configuração e implantação

Copie .env.example.txt para .env; configure LocalStack/AWS, tabelas, filas/tópico, Pipefy token/pipe/fields e autenticação. docker compose up --build executa inicialização em localstack/init-aws.sh. Backend padrão: 8001; frontend: 3000; Swagger /pt/docs e /en/docs. Instale requirements.txt e rode python -m pytest tests/ -v; frontend tem lint/build. Para 409 confira event_id; 404 confira email; simulated confira token/IDs/logs; falha AWS confira endpoint, região e recursos inicializados. A visão Lambda/ECS do README é uma possibilidade de evolução, não um deploy provisionado por este código.

## Comandos de execução

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

Nomes extraídos apenas dos arquivos de exemplo e das referências a variáveis no código. Configure os valores localmente; credenciais privadas não fazem parte desta referência. Variáveis NEXT_PUBLIC_ e VITE_ são públicas no navegador.

| Variable | Origem |
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

## Arquivos relacionados

- [backend/app/application/use_cases/create_client.py](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/backend/app/application/use_cases/create_client.py)
- [backend/app/application/use_cases/process_webhook.py](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/backend/app/application/use_cases/process_webhook.py)
- [backend/app/domain/entities/client.py](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/backend/app/domain/entities/client.py)
- [backend/app/interfaces/api/routes/webhook_routes.py](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/backend/app/interfaces/api/routes/webhook_routes.py)
- [backend/app/infrastructure/external/pipefy_client.py](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/backend/app/infrastructure/external/pipefy_client.py)
- [localstack/init-aws.sh](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/localstack/init-aws.sh)
- [docker-compose.yml](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/docker-compose.yml)

## Navegação

- [Project guide](?menu=pt&lang=pt&id=6)
- [Source reference](?menu=pt&lang=pt&id=7)
