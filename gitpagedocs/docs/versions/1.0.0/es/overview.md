# Visión General del Proyecto

CRM de solicitudes integrado con cards Pipefy. Registra clientes, procesa webhook simulado/autenticado, calcula prioridad por patrimonio y publica eventos SQS/SNS. LocalStack representa AWS en desarrollo. Las respuestas indican ejecución Pipefy real o simulada.

## Comportamiento implementado

Python 3.12, FastAPI 0.115.12, Pydantic 2.11.3, boto3 1.38.19, HTTPX 0.28.1 y PyJWT 2.10.1. Backend separa domain, application, infrastructure e interfaces; conecta puertos a DynamoDB/SQS/SNS/Pipefy. Frontend Next.js 16.2.6/React 19.2.4 usa React Hook Form/Zod y TanStack Query. Dominio/casos de uso se separan de UI, aunque varios errores HTTP nacen en casos de uso.

```mermaid
sequenceDiagram
  participant UI as Authenticated client
  participant API as FastAPI
  participant DB as DynamoDB
  participant P as Pipefy
  participant AWS as SQS and SNS
  UI->>API: card-updated event
  API->>DB: Check event and find client
  API->>DB: Update status and priority
  API->>P: Update card fields
  P-->>API: success or simulated
  API->>DB: Save event
  API->>AWS: Publish messages
  API-->>UI: Result and integration status
```

## Flujo y casos de fallo

1. POST /auth/login valida contraseña y devuelve Bearer JWT; PUT /auth/password la cambia. CRUD /clientes y /pipefy/cards requieren usuario. El webhook también usa get_current_user; no acepta callbacks Pipefy arbitrarios sin credenciales.

2. Crear cliente valida nombre/email/solicitud/patrimonio; persiste Client Aguardando Análise en DynamoDB; llama createCard; asocia card_id solo con éxito e ID; publica SNS. Con fallback simulated puede existir cliente local sin card real. Lista/edición/eliminación y cards son rutas separadas.

3. POST /webhooks/pipefy/card-updated recibe event_id, card_id, cliente_email y timestamp. Evento registrado: 409; cliente ausente: 404. Tiene preferencia card_id ya asociado. Marca Processado y prioridade_alta para patrimonio >= 200000; si no prioridade_normal. Actualiza cliente/Pipefy, registra evento, envía SQS y publica SNS en ese orden.

4. PipefyClient construye createCard/updateFieldsValues y otras operaciones GraphQL con IDs configurables. Fallos HTTP/GraphQL o indisponibilidad pueden producir simulación. Muestre/revise pipefy_status/pipefy_message. Publicar SQS no implica worker de reconciliación; el repositorio no garantiza replay automático del fallback.

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
