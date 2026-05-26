# Setup and Execution

The project is fully containerized for easy local development and testing.

## Prerequisites
- Docker
- Docker Compose

## How to Run

1. Clone the repository:
```bash
git clone https://github.com/Vidigal-code/pipebridge-crm.git
cd pipebridge-crm
```

2. Start the containers:
```bash
docker compose up --build
```

## Available Services
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8001
- **Swagger Docs (EN)**: http://localhost:8001/en/docs

## Default Credentials
- **Email**: `admin@mundoinvest.com`
- **Password**: `Admin@12345`
