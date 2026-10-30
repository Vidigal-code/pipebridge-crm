# Integração Pipefy

CRM de solicitações de clientes integrado a cards Pipefy. Cadastra clientes, processa um webhook simulado/autenticado, calcula prioridade por patrimônio e publica eventos em SQS/SNS. LocalStack representa os serviços AWS no desenvolvimento. As respostas indicam se a operação Pipefy foi real ou simulada.

## Fluxo e casos de falha

1. POST /auth/login valida senha e retorna Bearer JWT; PUT /auth/password altera senha. CRUD /clientes e rotas /pipefy/cards exigem usuário. O webhook também usa get_current_user: não é um endpoint público que recebe qualquer callback Pipefy sem credenciais.

2. Criar cliente valida nome, email, solicitação e patrimônio; persiste Client com status Aguardando Análise no DynamoDB; chama createCard; só associa card_id quando a integração retorna sucesso e ID; publica SNS. Se Pipefy retornar fallback simulated, o cliente local pode existir sem card real. Lista/edição/exclusão e operações sobre cards são rotas separadas.

3. POST /webhooks/pipefy/card-updated recebe event_id, card_id, cliente_email e timestamp. Evento já registrado retorna 409; cliente ausente, 404. Usa card_id já associado ao cliente quando disponível. Marca Processado e prioridade_alta para patrimônio >= 200000; abaixo disso prioridade_normal. Atualiza cliente e campos Pipefy, grava evento, envia SQS e publica SNS, nessa ordem.

4. PipefyClient monta createCard/updateFieldsValues e demais operações GraphQL com IDs de campo configuráveis. Falha HTTP, erro GraphQL ou indisponibilidade pode acionar resultado simulado. O retorno pipefy_status/pipefy_message deve ser exibido e verificado. Publicar SQS não significa existir um worker de reconciliação: este repositório não implementa uma garantia de replay automático do fallback.

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
