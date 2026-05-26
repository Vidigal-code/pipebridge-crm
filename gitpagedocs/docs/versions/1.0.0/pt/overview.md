# Visão Geral do Projeto

**PipeBridge CRM** é um sistema fullstack de gerenciamento de clientes com integração Pipefy via GraphQL, persistência em DynamoDB (AWS LocalStack) e processamento assíncrono via SQS/SNS. Desenvolvido como solução para um teste técnico de Client Management & Pipefy Integration.

## Funcionalidades Principais
- 👥 CRUD completo de clientes (criar, listar, editar, remover)
- 🔗 Integração bidirecional com Pipefy via GraphQL
- ⚡ Processamento de webhooks com regras de prioridade automatizadas
- 🛡️ Autenticação segura com JWT e PBKDF2-SHA256
- 🎨 Interface de usuário moderna e responsiva (Next.js + Tailwind CSS)
