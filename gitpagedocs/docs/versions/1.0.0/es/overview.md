# Visión General del Proyecto

<div style="display: flex; justify-content: center; margin: 2rem 0;">
  <iframe width="800" height="450" src="https://www.youtube.com/embed/xx69DcHDPa8" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

**PipeBridge CRM** es un sistema fullstack de gestión de clientes con integración a Pipefy vía GraphQL, persistencia en DynamoDB (AWS LocalStack) y procesamiento asíncrono mediante SQS/SNS. Desarrollado como solución para un reto técnico de Gestión de Clientes e Integración con Pipefy.

## Características Principales
- 👥 CRUD completo de clientes (crear, listar, editar, eliminar)
- 🔗 Integración bidireccional con Pipefy vía GraphQL
- ⚡ Procesamiento de webhooks con reglas automáticas de prioridad
- 🛡️ Autenticación segura con JWT y PBKDF2-SHA256
- 🎨 Interfaz de usuario moderna y responsiva (Next.js + Tailwind CSS)
