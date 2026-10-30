# Pipefy Integration

Client-request CRM integrated with Pipefy cards. It registers clients, processes an authenticated simulated webhook, calculates priority from assets and publishes SQS/SNS events. LocalStack represents AWS services in development. Responses indicate whether Pipefy execution was real or simulated.

## Workflow and failure cases

1. POST /auth/login validates a password and returns Bearer JWT; PUT /auth/password changes it. /clientes CRUD and /pipefy/cards require a user. The webhook also uses get_current_user: it is not a public endpoint accepting arbitrary unauthenticated Pipefy callbacks.

2. Client creation validates name, email, request and assets; persists Client with Aguardando Análise in DynamoDB; invokes createCard; assigns card_id only on success with an ID; publishes SNS. With simulated fallback the local client can exist without a real card. Listing/editing/deletion and card operations have separate routes.

3. POST /webhooks/pipefy/card-updated receives event_id, card_id, cliente_email and timestamp. Recorded event returns 409; missing client returns 404. An already-associated card_id takes precedence. It marks Processado and prioridade_alta for assets >= 200000, otherwise prioridade_normal. It updates client/Pipefy fields, records the event, sends SQS and publishes SNS in that order.

4. PipefyClient builds createCard/updateFieldsValues and other GraphQL operations with configurable field IDs. HTTP/GraphQL errors or unavailability can produce simulated results. Display and inspect pipefy_status/pipefy_message. Publishing to SQS does not imply a reconciliation worker: this repository does not guarantee automatic fallback replay.

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
