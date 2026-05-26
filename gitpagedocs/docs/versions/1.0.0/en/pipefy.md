# Pipefy Integration

PipeBridge CRM structures GraphQL mutations strictly following the official Pipefy documentation.

## Mutation: createCard

Used when creating a new client (`POST /clientes`).

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

## Integration Fallback

The system attempts to send mutations to the **real** Pipefy API. If the API is unavailable or returns an error, an automatic **fallback** system kicks in:
Local persistence in DynamoDB is maintained, and the action is logged for auditing or future retry.
