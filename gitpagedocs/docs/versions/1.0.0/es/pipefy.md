# Integración Pipefy

PipeBridge CRM estructura mutations GraphQL siguiendo rigurosamente la documentación oficial de Pipefy.

## Mutation: createCard

Se usa al crear un nuevo cliente (`POST /clientes`).

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

## Fallback de Integración

El sistema intenta enviar las mutations a la API **real** de Pipefy. Si la API no está disponible o devuelve un error, se activa automáticamente un sistema de **fallback**:
La persistencia local en DynamoDB se mantiene y la acción se registra para auditoría o reintento futuro.
