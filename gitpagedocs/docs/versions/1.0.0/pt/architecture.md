# Arquitetura do Sistema

O sistema é dividido em múltiplas camadas, seguindo as melhores práticas de Clean Architecture e SOLID no backend, e Feature-Sliced Design (FSD) no frontend.

```text
┌─────────────┐     ┌──────────────┐     ┌──────────────────┐
│   Frontend  │────▶│   Backend    │────▶│   LocalStack     │
│   Next.js   │     │   FastAPI    │     │  (DynamoDB/SQS)  │
│   Port 3000 │◀────│   Port 8001  │◀────│  Port 4566       │
└─────────────┘     └──────────────┘     └──────────────────┘
```

## Stack Tecnológico

| Camada | Tecnologia |
|---|---|
| **Frontend** | Next.js 16, React 19, Tailwind CSS v4, TypeScript |
| **Backend** | Python 3.12, FastAPI, Pydantic v2 |
| **Banco de Dados** | Amazon DynamoDB (via LocalStack) |
| **Mensageria** | Amazon SQS (via LocalStack) |
| **Notificações** | Amazon SNS (via LocalStack) |
| **Containerização** | Docker Compose |
