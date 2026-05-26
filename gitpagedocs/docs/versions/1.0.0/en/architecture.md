# System Architecture

The system is divided into multiple layers, following best practices like Clean Architecture and SOLID on the backend, and Feature-Sliced Design (FSD) on the frontend.

```text
┌─────────────┐     ┌──────────────┐     ┌──────────────────┐
│   Frontend  │────▶│   Backend    │────▶│   LocalStack     │
│   Next.js   │     │   FastAPI    │     │  (DynamoDB/SQS)  │
│   Port 3000 │◀────│   Port 8001  │◀────│  Port 4566       │
└─────────────┘     └──────────────┘     └──────────────────┘
```

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 16, React 19, Tailwind CSS v4, TypeScript |
| **Backend** | Python 3.12, FastAPI, Pydantic v2 |
| **Database** | Amazon DynamoDB (via LocalStack) |
| **Queue** | Amazon SQS (via LocalStack) |
| **Notifications** | Amazon SNS (via LocalStack) |
| **Containerization** | Docker Compose |
