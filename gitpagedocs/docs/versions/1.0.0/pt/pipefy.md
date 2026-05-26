# Integração Pipefy

O PipeBridge CRM estrutura mutations GraphQL seguindo rigorosamente a documentação oficial do Pipefy.

## Mutation: createCard

Utilizada ao criar um novo cliente (`POST /clientes`).

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

## Fallback de Integração

O sistema tenta enviar as mutations para a API **real** do Pipefy. Se a API estiver indisponível ou retornar erro, um sistema de **fallback** é ativado automaticamente:
A persistência local no DynamoDB é mantida, e a ação é logada para auditoria ou retentativa futura.
