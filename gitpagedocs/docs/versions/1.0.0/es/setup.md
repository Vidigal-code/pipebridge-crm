# Instalación y Ejecución

El proyecto está completamente contenerizado para facilitar su ejecución local.

## Requisitos Previos
- Docker
- Docker Compose

## Pasos para Ejecutar

1. Clona el repositorio:
```bash
git clone https://github.com/Vidigal-code/pipebridge-crm.git
cd pipebridge-crm
```

2. Levanta los contenedores:
```bash
docker compose up --build
```

## Servicios Disponibles
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8001
- **Swagger Docs**: http://localhost:8001/es/docs

## Credenciales por Defecto
- **Email**: `admin@mundoinvest.com`
- **Contraseña**: `Admin@12345`
