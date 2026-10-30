# Referência do código — pipebridge-crm

Inventário extraído dos manifests e das declarações do código. Versões com `^` ou `~` são intervalos declarados; o lockfile determina a versão resolvida.

Commit: `c2273860c28f959a64f15ee2a7ae215f93a0802a`. GitPageDocs: `0.0.17`.

## Dependências e ferramentas

| Pacote | Versão declarada | Origem |
| --- | --- | --- |
| fastapi | 0.115.12 | [backend/requirements.txt](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/backend/requirements.txt) |
| uvicorn[standard] | 0.34.2 | [backend/requirements.txt](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/backend/requirements.txt) |
| pydantic | 2.11.3 | [backend/requirements.txt](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/backend/requirements.txt) |
| pydantic-settings | 2.9.1 | [backend/requirements.txt](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/backend/requirements.txt) |
| httpx | 0.28.1 | [backend/requirements.txt](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/backend/requirements.txt) |
| python-dotenv | 1.1.0 | [backend/requirements.txt](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/backend/requirements.txt) |
| email-validator | 2.2.0 | [backend/requirements.txt](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/backend/requirements.txt) |
| boto3 | 1.38.19 | [backend/requirements.txt](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/backend/requirements.txt) |
| PyJWT | 2.10.1 | [backend/requirements.txt](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/backend/requirements.txt) |
| pytest | 8.4.0 | [backend/requirements.txt](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/backend/requirements.txt) |
| pytest-asyncio | 0.24.0 | [backend/requirements.txt](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/backend/requirements.txt) |
| moto[dynamodb,sqs,sns] | 5.1.3 | [backend/requirements.txt](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/backend/requirements.txt) |
| `@hookform/resolvers` | `^5.4.0` | [frontend/package.json](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/frontend/package.json) / dependencies |
| `@reduxjs/toolkit` | `^2.12.0` | [frontend/package.json](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/frontend/package.json) / dependencies |
| `@tanstack/react-query` | `^5.100.14` | [frontend/package.json](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/frontend/package.json) / dependencies |
| `axios` | `^1.16.1` | [frontend/package.json](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/frontend/package.json) / dependencies |
| `lucide-react` | `^1.16.0` | [frontend/package.json](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/frontend/package.json) / dependencies |
| `next` | `16.2.6` | [frontend/package.json](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/frontend/package.json) / dependencies |
| `react` | `19.2.4` | [frontend/package.json](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/frontend/package.json) / dependencies |
| `react-dom` | `19.2.4` | [frontend/package.json](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/frontend/package.json) / dependencies |
| `react-hook-form` | `^7.76.1` | [frontend/package.json](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/frontend/package.json) / dependencies |
| `react-hot-toast` | `^2.6.0` | [frontend/package.json](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/frontend/package.json) / dependencies |
| `react-redux` | `^9.3.0` | [frontend/package.json](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/frontend/package.json) / dependencies |
| `zod` | `^4.4.3` | [frontend/package.json](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/frontend/package.json) / dependencies |
| `@tailwindcss/postcss` | `^4` | [frontend/package.json](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/frontend/package.json) / devDependencies |
| `@types/node` | `^20` | [frontend/package.json](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/frontend/package.json) / devDependencies |
| `@types/react` | `^19` | [frontend/package.json](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/frontend/package.json) / devDependencies |
| `@types/react-dom` | `^19` | [frontend/package.json](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/frontend/package.json) / devDependencies |
| `eslint` | `^9` | [frontend/package.json](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/frontend/package.json) / devDependencies |
| `eslint-config-next` | `16.2.6` | [frontend/package.json](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/frontend/package.json) / devDependencies |
| `tailwindcss` | `^4` | [frontend/package.json](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/frontend/package.json) / devDependencies |
| `typescript` | `^5` | [frontend/package.json](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/frontend/package.json) / devDependencies |

## Comandos disponíveis

| Arquivo | Script | Comando |
| --- | --- | --- |
| [frontend/package.json](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/frontend/package.json) | `dev` | `next dev` |
| [frontend/package.json](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/frontend/package.json) | `build` | `next build` |
| [frontend/package.json](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/frontend/package.json) | `start` | `next start` |
| [frontend/package.json](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/frontend/package.json) | `lint` | `eslint` |

## Rotas HTTP

O prefixo global está incluído quando definido no bootstrap. Autorização, DTOs, respostas e códigos de erro estão nos controllers vinculados; confira também o guia de fluxos.

| Método e caminho | Declaração |
| --- | --- |
| `DELETE /clientes/{client_id}` | [backend/app/interfaces/api/routes/client_routes.py](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/backend/app/interfaces/api/routes/client_routes.py) |
| `DELETE /pipefy/cards/{card_id}` | [backend/app/interfaces/api/routes/pipefy_routes.py](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/backend/app/interfaces/api/routes/pipefy_routes.py) |
| `GET /auth/me` | [backend/app/interfaces/api/routes/auth_routes.py](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/backend/app/interfaces/api/routes/auth_routes.py) |
| `GET /clientes` | [backend/app/interfaces/api/routes/client_routes.py](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/backend/app/interfaces/api/routes/client_routes.py) |
| `GET /health` | [backend/app/main.py](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/backend/app/main.py) |
| `GET /pipefy/cards` | [backend/app/interfaces/api/routes/pipefy_routes.py](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/backend/app/interfaces/api/routes/pipefy_routes.py) |
| `POST /auth/login` | [backend/app/interfaces/api/routes/auth_routes.py](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/backend/app/interfaces/api/routes/auth_routes.py) |
| `POST /clientes` | [backend/app/interfaces/api/routes/client_routes.py](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/backend/app/interfaces/api/routes/client_routes.py) |
| `POST /webhooks/pipefy/card-updated` | [backend/app/interfaces/api/routes/webhook_routes.py](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/backend/app/interfaces/api/routes/webhook_routes.py) |
| `PUT /auth/password` | [backend/app/interfaces/api/routes/auth_routes.py](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/backend/app/interfaces/api/routes/auth_routes.py) |
| `PUT /clientes/{client_id}` | [backend/app/interfaces/api/routes/client_routes.py](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/backend/app/interfaces/api/routes/client_routes.py) |
| `PUT /pipefy/cards/{card_id}` | [backend/app/interfaces/api/routes/pipefy_routes.py](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/backend/app/interfaces/api/routes/pipefy_routes.py) |

## Rotas da interface

- [frontend/src/app/clientes/page.tsx](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/frontend/src/app/clientes/page.tsx)
- [frontend/src/app/configuracoes/page.tsx](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/frontend/src/app/configuracoes/page.tsx)
- [frontend/src/app/login/page.tsx](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/frontend/src/app/login/page.tsx)
- [frontend/src/app/page.tsx](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/frontend/src/app/page.tsx)
- [frontend/src/app/pipefy/page.tsx](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/frontend/src/app/pipefy/page.tsx)
- [frontend/src/app/sobre/page.tsx](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/frontend/src/app/sobre/page.tsx)
- [frontend/src/app/webhooks/page.tsx](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/frontend/src/app/webhooks/page.tsx)

## Configuração de ambiente

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

## Persistência e contratos

- [backend/app/application/dtos/auth_dto.py](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/backend/app/application/dtos/auth_dto.py)
- [backend/app/application/dtos/client_dto.py](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/backend/app/application/dtos/client_dto.py)
- [backend/app/application/dtos/webhook_dto.py](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/backend/app/application/dtos/webhook_dto.py)
- [backend/app/domain/entities/client.py](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/backend/app/domain/entities/client.py)
- [backend/app/domain/entities/user.py](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/backend/app/domain/entities/user.py)
- [backend/app/domain/entities/webhook_event.py](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/backend/app/domain/entities/webhook_event.py)
- [backend/app/domain/enums/priority.py](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/backend/app/domain/enums/priority.py)
- [backend/app/domain/enums/role.py](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/backend/app/domain/enums/role.py)
- [backend/app/domain/enums/status.py](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/backend/app/domain/enums/status.py)
- [backend/app/domain/repositories/client_repository.py](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/backend/app/domain/repositories/client_repository.py)
- [backend/app/domain/repositories/user_repository.py](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/backend/app/domain/repositories/user_repository.py)
- [backend/app/domain/repositories/webhook_event_repository.py](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/backend/app/domain/repositories/webhook_event_repository.py)

## Testes existentes

- [backend/tests/integration/test_client_api.py](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/backend/tests/integration/test_client_api.py)
- [backend/tests/integration/test_webhook_api.py](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/backend/tests/integration/test_webhook_api.py)
- [backend/tests/unit/test_client_entity.py](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/backend/tests/unit/test_client_entity.py)
- [backend/tests/unit/test_pipefy_client.py](https://github.com/Vidigal-code/pipebridge-crm/blob/c2273860c28f959a64f15ee2a7ae215f93a0802a/backend/tests/unit/test_pipefy_client.py)
