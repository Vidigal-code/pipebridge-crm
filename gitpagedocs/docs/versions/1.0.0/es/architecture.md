# Arquitectura del Sistema

El sistema está dividido en múltiples capas, siguiendo las mejores prácticas de Clean Architecture y SOLID en el backend, y Feature-Sliced Design (FSD) en el frontend.

```text
┌─────────────┐     ┌──────────────┐     ┌──────────────────┐
│   Frontend  │────▶│   Backend    │────▶│   LocalStack     │
│   Next.js   │     │   FastAPI    │     │  (DynamoDB/SQS)  │
│   Port 3000 │◀────│   Port 8001  │◀────│  Port 4566       │
└─────────────┘     └──────────────┘     └──────────────────┘
```

## Stack Tecnológico

| Capa | Tecnología |
|---|---|
| **Frontend** | Next.js 16, React 19, Tailwind CSS v4, TypeScript |
| **Backend** | Python 3.12, FastAPI, Pydantic v2 |
| **Base de Datos** | Amazon DynamoDB (via LocalStack) |
| **Colas de Mensajes** | Amazon SQS (via LocalStack) |
| **Notificaciones** | Amazon SNS (via LocalStack) |
| **Contenedores** | Docker Compose |
