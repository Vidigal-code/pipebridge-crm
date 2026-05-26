# Project Overview

<div style="display: flex; justify-content: center; margin: 2rem 0;">
  <iframe width="800" height="450" src="https://www.youtube.com/embed/xx69DcHDPa8" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

**PipeBridge CRM** is a fullstack client management system with Pipefy integration via GraphQL, DynamoDB persistence (AWS LocalStack), and asynchronous processing via SQS/SNS. Built as a solution for a Client Management & Pipefy Integration technical challenge.

## Core Features
- 👥 Full client CRUD (create, list, update, delete)
- 🔗 Bidirectional Pipefy integration via GraphQL
- ⚡ Webhook processing with automated priority rules
- 🛡️ Secure authentication using JWT and PBKDF2-SHA256
- 🎨 Modern and responsive UI (Next.js + Tailwind CSS)
