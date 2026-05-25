# PipeBridge CRM — Frontend

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

> **GitHub:** [https://github.com/Vidigal-code/pipebridge-crm](https://github.com/Vidigal-code/pipebridge-crm)

---

## 🇧🇷 Descrição em Português

<details>
<summary><strong>Ver Detalhes</strong></summary>

### Visão Geral

Interface fullstack em Next.js 16 + React 19 + Tailwind CSS v4 com autenticação JWT, tema dark/light, layout 100% responsivo e arquitetura FSD (Feature-Sliced Design).

### Stack

| Tecnologia | Versão |
|---|---|
| Next.js | 16 (App Router) |
| React | 19 |
| TypeScript | 5.x |
| Tailwind CSS | v4 (config via CSS) |
| React Query | @tanstack/react-query v5 |
| React Hook Form | + Zod validation |
| Axios | HTTP client |
| Lucide React | Ícones |

### Arquitetura FSD

```
frontend/src/
├── app/                        # Pages (Next.js App Router)
│   ├── layout.tsx              # Root layout + providers
│   ├── globals.css             # Variáveis de tema (dark/light)
│   ├── page.tsx                # Dashboard
│   ├── login/page.tsx          # Login
│   ├── clientes/page.tsx       # Gerenciar clientes
│   ├── webhooks/page.tsx       # Simular webhooks
│   └── configuracoes/page.tsx  # Alterar senha
│
├── entities/                   # Entidades de domínio
│   ├── client/
│   │   ├── api/queries.ts      # fetchClients, createClient
│   │   └── ui/client-table.tsx # Tabela de clientes
│   └── webhook/
│       └── api/queries.ts      # sendWebhook
│
├── features/                   # Funcionalidades
│   ├── auth/                   # Login
│   │   ├── model/schema.ts     # Zod schema
│   │   └── ui/login-form.tsx   # Form de login
│   ├── create-client/          # Criar cliente
│   │   ├── model/schema.ts
│   │   └── ui/create-client-form.tsx
│   ├── simulate-webhook/       # Simular webhook
│   │   ├── model/schema.ts
│   │   └── ui/webhook-form.tsx # event_id, card_id, email, timestamp
│   └── change-password/        # Alterar senha
│       ├── model/schema.ts     # Validação de senha forte
│       └── ui/change-password-form.tsx
│
├── shared/                     # Compartilhado
│   ├── api/
│   │   ├── client.ts           # Axios + JWT interceptor
│   │   └── endpoints.ts        # Constantes de rotas
│   ├── auth/
│   │   ├── provider.tsx        # AuthContext + localStorage
│   │   └── guard.tsx           # Proteção de rotas (redirect /login)
│   ├── theme/
│   │   └── provider.tsx        # Toggle dark/light + localStorage
│   ├── config/env.ts           # Variáveis de ambiente
│   ├── lib/formatters.ts       # formatCurrency, formatDate
│   ├── types/index.ts          # Interfaces TypeScript
│   └── ui/                     # Componentes reutilizáveis
│       ├── badge/              # Badge com variantes
│       ├── button/             # Button (primary, secondary, danger)
│       ├── card/               # Card glassmorphism (theme-aware)
│       ├── input/              # Input com label + error
│       ├── loading/            # Spinner
│       └── modal/              # Modal com overlay
│
├── store/
│   └── provider.tsx            # React Query + React Hot Toast
│
└── widgets/                    # Composições
    ├── auth-layout/            # Layout com sidebar + guard
    ├── client-dashboard/       # Dashboard com stats + tabela
    └── sidebar/                # Sidebar responsiva + hamburger + toggle tema
```

### Funcionalidades

#### Autenticação
- Login com JWT Bearer token
- Guard automático (redireciona para `/login` se não autenticado)
- Dados do usuário persistidos em `localStorage`
- Botão de logout no sidebar

#### Tema
- **Dark mode** e **Light mode** com toggle no sidebar
- Tema padrão configurável via `NEXT_PUBLIC_START_THEME` no `.env`
- Preferência salva em `localStorage`
- Transição suave (CSS `transition-colors duration-300`)

#### Responsividade
- **Desktop (≥ 1024px)**: Sidebar fixa à esquerda, conteúdo com margem
- **Mobile/Tablet (< 1024px)**: Sidebar oculta, botão hamburger no topo
  - Menu abre com overlay + botão X para fechar
  - Conteúdo ocupa 100% da largura
- Cards empilham em coluna no mobile
- Tabelas com scroll horizontal (`overflow-x-auto`)
- Botões full-width no mobile, auto no desktop

### Páginas

| Rota | Funcionalidade |
|---|---|
| `/login` | Login com email e senha |
| `/` | Dashboard com 4 stat cards + tabela de clientes recentes |
| `/clientes` | Listagem + modal para criar novo cliente |
| `/webhooks` | Formulário com `event_id`, `card_id`, `email`, `timestamp` + regras de negócio |
| `/configuracoes` | Alterar senha (antiga + nova + confirmar) |

### Design System (CSS Variables)

| Variável | Light | Dark |
|---|---|---|
| `--bg-surface` | `#f1f5f9` | `#020617` |
| `--bg-card` | `rgba(255,255,255,0.85)` | `rgba(255,255,255,0.05)` |
| `--text-content` | `#0f172a` | `#f8fafc` |
| `--text-secondary` | `#475569` | `#94a3b8` |
| `--border-subtle` | `rgba(0,0,0,0.08)` | `rgba(255,255,255,0.1)` |

### Variáveis de Ambiente

| Variável | Descrição | Default |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | URL do backend | `http://localhost:8001` |
| `NEXT_PUBLIC_START_THEME` | Tema inicial (`dark` / `light`) | `dark` |

</details>

---

## 🇺🇸 English Description

<details>
<summary><strong>View Details</strong></summary>

### Overview

Fullstack interface in Next.js 16 + React 19 + Tailwind CSS v4 with JWT auth, dark/light theme, 100% responsive layout and FSD (Feature-Sliced Design) architecture.

### Stack

| Technology | Version |
|---|---|
| Next.js | 16 (App Router) |
| React | 19 |
| TypeScript | 5.x |
| Tailwind CSS | v4 (CSS-based config) |
| React Query | @tanstack/react-query v5 |
| React Hook Form | + Zod validation |
| Axios | HTTP client |
| Lucide React | Icons |

### FSD Architecture

```
frontend/src/
├── app/                        # Pages (Next.js App Router)
│   ├── layout.tsx              # Root layout + providers
│   ├── globals.css             # Theme variables (dark/light)
│   ├── page.tsx                # Dashboard
│   ├── login/page.tsx          # Login
│   ├── clientes/page.tsx       # Manage clients
│   ├── webhooks/page.tsx       # Simulate webhooks
│   └── configuracoes/page.tsx  # Change password
│
├── entities/                   # Domain Entities
│   ├── client/
│   │   ├── api/queries.ts      # fetchClients, createClient
│   │   └── ui/client-table.tsx # Client table
│   └── webhook/
│       └── api/queries.ts      # sendWebhook
│
├── features/                   # Features
│   ├── auth/                   # Login
│   │   ├── model/schema.ts     # Zod schema
│   │   └── ui/login-form.tsx   # Login form
│   ├── create-client/          # Create client
│   │   ├── model/schema.ts
│   │   └── ui/create-client-form.tsx
│   ├── simulate-webhook/       # Simulate webhook
│   │   ├── model/schema.ts
│   │   └── ui/webhook-form.tsx # event_id, card_id, email, timestamp
│   └── change-password/        # Change password
│       ├── model/schema.ts     # Strong password validation
│       └── ui/change-password-form.tsx
│
├── shared/                     # Shared
│   ├── api/
│   │   ├── client.ts           # Axios + JWT interceptor
│   │   └── endpoints.ts        # Route constants
│   ├── auth/
│   │   ├── provider.tsx        # AuthContext + localStorage
│   │   └── guard.tsx           # Route protection (redirect /login)
│   ├── theme/
│   │   └── provider.tsx        # Dark/Light toggle + localStorage
│   ├── config/env.ts           # Environment variables
│   ├── lib/formatters.ts       # formatCurrency, formatDate
│   ├── types/index.ts          # TypeScript interfaces
│   └── ui/                     # Reusable components
│       ├── badge/              # Badge with variants
│       ├── button/             # Button (primary, secondary, danger)
│       ├── card/               # Glassmorphism card (theme-aware)
│       ├── input/              # Input with label + error
│       ├── loading/            # Spinner
│       └── modal/              # Modal with overlay
│
├── store/
│   └── provider.tsx            # React Query + React Hot Toast
│
└── widgets/                    # Compositions
    ├── auth-layout/            # Layout with sidebar + guard
    ├── client-dashboard/       # Dashboard with stats + table
    └── sidebar/                # Responsive sidebar + hamburger + theme toggle
```

### Features

#### Authentication
- JWT Bearer token login
- Automatic guard (redirects to `/login` if not authenticated)
- User data persisted in `localStorage`
- Logout button in sidebar

#### Theme
- **Dark mode** and **Light mode** with toggle in sidebar
- Default theme configurable via `NEXT_PUBLIC_START_THEME` in `.env`
- Preference saved in `localStorage`
- Smooth transition (CSS `transition-colors duration-300`)

#### Responsiveness
- **Desktop (≥ 1024px)**: Fixed sidebar on the left, content with margin
- **Mobile/Tablet (< 1024px)**: Hidden sidebar, hamburger button on top
  - Menu opens with overlay + X button to close
  - Content takes 100% width
- Cards stack vertically on mobile
- Tables with horizontal scroll (`overflow-x-auto`)
- Buttons full-width on mobile, auto on desktop

### Pages

| Route | Feature |
|---|---|
| `/login` | Login with email and password |
| `/` | Dashboard with 4 stat cards + recent clients table |
| `/clientes` | Client listing + modal to create new client |
| `/webhooks` | Form with `event_id`, `card_id`, `email`, `timestamp` + business rules |
| `/configuracoes` | Change password (current + new + confirm) |

### Design System (CSS Variables)

| Variable | Light | Dark |
|---|---|---|
| `--bg-surface` | `#f1f5f9` | `#020617` |
| `--bg-card` | `rgba(255,255,255,0.85)` | `rgba(255,255,255,0.05)` |
| `--text-content` | `#0f172a` | `#f8fafc` |
| `--text-secondary` | `#475569` | `#94a3b8` |
| `--border-subtle` | `rgba(0,0,0,0.08)` | `rgba(255,255,255,0.1)` |

### Environment Variables

| Variable | Description | Default |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Backend URL | `http://localhost:8001` |
| `NEXT_PUBLIC_START_THEME` | Initial theme (`dark` / `light`) | `dark` |

</details>
