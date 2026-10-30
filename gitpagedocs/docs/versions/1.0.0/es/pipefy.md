# Integración Pipefy

CRM de solicitudes integrado con cards Pipefy. Registra clientes, procesa webhook simulado/autenticado, calcula prioridad por patrimonio y publica eventos SQS/SNS. LocalStack representa AWS en desarrollo. Las respuestas indican ejecución Pipefy real o simulada.

## Flujo y casos de fallo

1. POST /auth/login valida contraseña y devuelve Bearer JWT; PUT /auth/password la cambia. CRUD /clientes y /pipefy/cards requieren usuario. El webhook también usa get_current_user; no acepta callbacks Pipefy arbitrarios sin credenciales.

2. Crear cliente valida nombre/email/solicitud/patrimonio; persiste Client Aguardando Análise en DynamoDB; llama createCard; asocia card_id solo con éxito e ID; publica SNS. Con fallback simulated puede existir cliente local sin card real. Lista/edición/eliminación y cards son rutas separadas.

3. POST /webhooks/pipefy/card-updated recibe event_id, card_id, cliente_email y timestamp. Evento registrado: 409; cliente ausente: 404. Tiene preferencia card_id ya asociado. Marca Processado y prioridade_alta para patrimonio >= 200000; si no prioridade_normal. Actualiza cliente/Pipefy, registra evento, envía SQS y publica SNS en ese orden.

4. PipefyClient construye createCard/updateFieldsValues y otras operaciones GraphQL con IDs configurables. Fallos HTTP/GraphQL o indisponibilidad pueden producir simulación. Muestre/revise pipefy_status/pipefy_message. Publicar SQS no implica worker de reconciliación; el repositorio no garantiza replay automático del fallback.

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
