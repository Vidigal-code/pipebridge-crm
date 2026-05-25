"use client";

import {
  Users,
  Webhook,
  Layers,
  Shield,
  Database,
  Zap,
  Bell,
  Code2,
  Boxes,
  FileText,
  Pencil,
  Trash2,
  CheckSquare,
  Sun,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const APP_TITLE = "PipeBridge CRM";
const APP_SUBTITLE = "Client Management & Pipefy Integration";
const APP_DESCRIPTION =
  "Sistema fullstack de gestão de clientes com integração Pipefy via GraphQL, persistência DynamoDB (AWS LocalStack), processamento assíncrono via SQS/SNS e documentação Swagger bilíngue (PT-BR / EN).";

interface FeatureConfig {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient: string;
}

interface TechConfig {
  layer: string;
  tech: string;
}

interface EndpointConfig {
  method: string;
  path: string;
  description: string;
  color: string;
}

const FEATURES: FeatureConfig[] = [
  {
    icon: Users,
    title: "CRUD de Clientes",
    description: "Criar, listar, editar e remover clientes com seleção em lote via checkbox e paginação via URL.",
    gradient: "from-indigo-500 to-purple-600",
  },
  {
    icon: Layers,
    title: "Cards Pipefy",
    description: "Gerenciamento de cards diretamente no Pipefy via GraphQL — listar, editar campos e remover.",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    icon: Webhook,
    title: "Webhooks Idempotentes",
    description: "Processamento de webhooks com verificação de event_id duplicado (409) e regras de prioridade automáticas.",
    gradient: "from-amber-500 to-orange-600",
  },
  {
    icon: Shield,
    title: "Autenticação JWT",
    description: "Login seguro com JWT HS256, hash PBKDF2-SHA256, rate limiting por IP e security headers OWASP.",
    gradient: "from-sky-500 to-cyan-600",
  },
  {
    icon: FileText,
    title: "Swagger Bilíngue",
    description: "Documentação interativa em /pt/docs (PT-BR) e /en/docs (EN) com esquemas detalhados.",
    gradient: "from-rose-500 to-pink-600",
  },
  {
    icon: Boxes,
    title: "Design System",
    description: "Componentes reutilizáveis com tokens CSS para dark/light mode — Button, Input, Select, Card, Modal, Pagination.",
    gradient: "from-violet-500 to-fuchsia-600",
  },
];

const TECH_STACK: TechConfig[] = [
  { layer: "Backend", tech: "Python 3.12, FastAPI, Pydantic v2" },
  { layer: "Frontend", tech: "Next.js 15, React 19, TypeScript, Tailwind CSS" },
  { layer: "Banco de Dados", tech: "Amazon DynamoDB (LocalStack)" },
  { layer: "Fila", tech: "Amazon SQS (LocalStack)" },
  { layer: "Notificações", tech: "Amazon SNS (LocalStack)" },
  { layer: "Autenticação", tech: "JWT HS256 + PBKDF2-SHA256" },
  { layer: "Documentação", tech: "Swagger bilíngue (PT-BR / EN)" },
  { layer: "Containerização", tech: "Docker Compose" },
];

const ENDPOINTS: EndpointConfig[] = [
  { method: "POST", path: "/auth/login", description: "Autenticação JWT", color: "bg-emerald-500" },
  { method: "POST", path: "/clientes", description: "Criar cliente + createCard Pipefy", color: "bg-emerald-500" },
  { method: "GET", path: "/clientes", description: "Listar clientes", color: "bg-sky-500" },
  { method: "PUT", path: "/clientes/{id}", description: "Atualizar cliente", color: "bg-amber-500" },
  { method: "DELETE", path: "/clientes/{id}", description: "Remover cliente", color: "bg-red-500" },
  { method: "POST", path: "/webhooks/pipefy/card-updated", description: "Processar webhook", color: "bg-emerald-500" },
  { method: "GET", path: "/pipefy/cards", description: "Listar cards Pipefy", color: "bg-sky-500" },
  { method: "PUT", path: "/pipefy/cards/{card_id}", description: "Editar card", color: "bg-amber-500" },
  { method: "DELETE", path: "/pipefy/cards/{card_id}", description: "Remover card", color: "bg-red-500" },
];

const FRONTEND_FEATURES = [
  { icon: CheckSquare, label: "Seleção em lote com checkbox" },
  { icon: Trash2, label: "ConfirmDialog global para exclusão" },
  { icon: Pencil, label: "Edição inline com modal" },
  { icon: Zap, label: "Paginação via URL (?page=N)" },
  { icon: Sun, label: "Dark / Light mode com design tokens" },
  { icon: Code2, label: "FSD (Feature-Sliced Design)" },
];

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xl sm:text-2xl font-bold text-content mb-6 text-center">
      {children}
    </h2>
  );
}

function FeatureCard({ icon: Icon, title, description, gradient }: FeatureConfig) {
  return (
    <div className="bg-surface-card border border-border-subtle rounded-2xl p-5 sm:p-6 hover:border-accent/30 transition-all duration-300 group">
      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <h3 className="text-base font-semibold text-content mb-2">{title}</h3>
      <p className="text-sm text-content-secondary leading-relaxed">{description}</p>
    </div>
  );
}

function TechRow({ layer, tech }: TechConfig) {
  return (
    <tr className="border-b border-border-subtle hover:bg-surface-hover transition-colors">
      <td className="py-3 px-4 text-sm font-medium text-content">{layer}</td>
      <td className="py-3 px-4 text-sm text-content-secondary">{tech}</td>
    </tr>
  );
}

function EndpointRow({ method, path, description, color }: EndpointConfig) {
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-border-subtle last:border-b-0">
      <span className={`${color} text-white text-xs font-bold px-2 py-0.5 rounded shrink-0 min-w-[52px] text-center`}>
        {method}
      </span>
      <code className="text-xs text-accent font-mono truncate flex-1">{path}</code>
      <span className="text-xs text-content-secondary hidden sm:block shrink-0">{description}</span>
    </div>
  );
}

function FrontendFeatureItem({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <Icon className="w-4 h-4 text-accent shrink-0" />
      <span className="text-sm text-content-secondary">{label}</span>
    </div>
  );
}

function HeroSection() {
  return (
    <div className="text-center mb-8">
      <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-1.5 rounded-full text-xs font-medium mb-4">
        <Database className="w-3.5 h-3.5" />
        Mundo Invest — Teste Técnico
      </div>
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-content tracking-tight mb-3">
        {APP_TITLE}
      </h1>
      <p className="text-base sm:text-lg text-accent font-medium mb-3">{APP_SUBTITLE}</p>
      <p className="text-sm text-content-secondary max-w-2xl mx-auto leading-relaxed">
        {APP_DESCRIPTION}
      </p>
    </div>
  );
}

function FeaturesSection() {
  return (
    <section className="py-6">
      <SectionTitle>Funcionalidades</SectionTitle>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {FEATURES.map((feature) => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </div>
    </section>
  );
}

function EndpointsSection() {
  return (
    <section className="py-6">
      <SectionTitle>API Endpoints</SectionTitle>
      <div className="bg-surface-card border border-border-subtle rounded-2xl p-4 sm:p-6">
        {ENDPOINTS.map((endpoint) => (
          <EndpointRow key={`${endpoint.method}-${endpoint.path}`} {...endpoint} />
        ))}
      </div>
    </section>
  );
}

function TechSection() {
  return (
    <section className="py-6">
      <SectionTitle>Stack Tecnológico</SectionTitle>
      <div className="bg-surface-card border border-border-subtle rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-subtle">
              <th className="text-left py-3 px-4 text-content-secondary font-medium">Camada</th>
              <th className="text-left py-3 px-4 text-content-secondary font-medium">Tecnologia</th>
            </tr>
          </thead>
          <tbody>
            {TECH_STACK.map((row) => (
              <TechRow key={row.layer} {...row} />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function FrontendSection() {
  return (
    <section className="py-6">
      <SectionTitle>Frontend</SectionTitle>
      <div className="bg-surface-card border border-border-subtle rounded-2xl p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
          {FRONTEND_FEATURES.map((item) => (
            <FrontendFeatureItem key={item.label} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FlowCard({ step, title, items }: { step: string; title: string; items: string[] }) {
  return (
    <div className="bg-surface-card border border-border-subtle rounded-2xl p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white text-sm font-bold">
          {step}
        </div>
        <h3 className="text-sm font-semibold text-content">{title}</h3>
      </div>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-xs text-content-secondary">
            <Bell className="w-3.5 h-3.5 text-accent mt-0.5 shrink-0" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FlowSection() {
  return (
    <section className="py-6">
      <SectionTitle>Fluxos Principais</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FlowCard
          step="1"
          title="Criação de Cliente"
          items={[
            "POST /clientes com dados do cliente",
            "Persiste no DynamoDB com status 'Aguardando Análise'",
            "Mutation createCard enviada ao Pipefy",
            "Notificação SNS publicada",
          ]}
        />
        <FlowCard
          step="2"
          title="Webhook Processing"
          items={[
            "POST /webhooks/pipefy/card-updated",
            "Verificação de idempotência (event_id)",
            "Regra: patrimônio ≥ R$ 200k → prioridade_alta",
            "Mutation updateFieldsValues no Pipefy",
          ]}
        />
        <FlowCard
          step="3"
          title="Cards Pipefy"
          items={[
            "Listar todos os cards do pipe",
            "Editar campos de um card",
            "Remover card do Pipefy",
            "Sincronização em tempo real",
          ]}
        />
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-6 text-center border-t border-border-subtle mt-6">
      <p className="text-xs text-content-tertiary">
        PipeBridge CRM — Mundo Invest © {new Date().getFullYear()}
      </p>
    </footer>
  );
}

export default function SobrePage() {
  return (
    <div>
      <HeroSection />
      <FeaturesSection />
      <FlowSection />
      <EndpointsSection />
      <TechSection />
      <FrontendSection />
      <Footer />
    </div>
  );
}
