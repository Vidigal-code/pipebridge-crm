"use client";

import { WebhookForm } from "@/features/simulate-webhook";
import Card from "@/shared/ui/card";
import { Webhook } from "lucide-react";

const BUSINESS_RULES = [
  {
    label: "Prioridade Alta",
    description: "Patrimônio ≥ R$ 200.000,00",
    colorClass: "bg-emerald-500/10 border-emerald-500/20",
    textClass: "text-emerald-500 dark:text-emerald-400",
  },
  {
    label: "Prioridade Normal",
    description: "Patrimônio < R$ 200.000,00",
    colorClass: "bg-sky-500/10 border-sky-500/20",
    textClass: "text-sky-500 dark:text-sky-400",
  },
  {
    label: "Idempotência",
    description: "Eventos duplicados (mesmo event_id) retornam 409",
    colorClass: "bg-amber-500/10 border-amber-500/20",
    textClass: "text-amber-500 dark:text-amber-400",
  },
] as const;

function RuleCard({
  label,
  description,
  colorClass,
  textClass,
}: (typeof BUSINESS_RULES)[number]) {
  return (
    <div className={`p-3 rounded-xl border ${colorClass}`}>
      <p className={`font-medium ${textClass}`}>{label}</p>
      <p className="text-content-secondary text-sm mt-1">{description}</p>
    </div>
  );
}

function WebhookFormSection() {
  return (
    <Card>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shrink-0">
          <Webhook className="w-5 h-5 text-white" />
        </div>
        <div className="min-w-0">
          <h2 className="text-base sm:text-lg font-semibold text-content">Card Updated</h2>
          <p className="text-xs text-content-tertiary truncate">
            POST /webhooks/pipefy/card-updated
          </p>
        </div>
      </div>
      <WebhookForm />
    </Card>
  );
}

function BusinessRulesSection() {
  return (
    <Card className="flex flex-col gap-4">
      <h2 className="text-base sm:text-lg font-semibold text-content">Regras de Negócio</h2>
      <div className="space-y-3 text-sm">
        {BUSINESS_RULES.map((rule) => (
          <RuleCard key={rule.label} {...rule} />
        ))}
      </div>
    </Card>
  );
}

export default function WebhooksPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-content">
          Simulação de Webhook
        </h1>
        <p className="text-content-secondary text-sm mt-1">
          Simule webhooks do Pipefy para atualizar status e prioridade dos clientes
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <WebhookFormSection />
        <BusinessRulesSection />
      </div>
    </div>
  );
}
