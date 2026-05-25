"use client";

import { WebhookForm } from "@/features/simulate-webhook";
import Card from "@/shared/ui/card";
import { Webhook } from "lucide-react";

export default function WebhooksPage() {
  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-content">Simulação de Webhook</h1>
        <p className="text-content-secondary mt-1">
          Simule webhooks do Pipefy para atualizar status e prioridade dos clientes
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
              <Webhook className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-content">Card Updated</h2>
              <p className="text-xs text-content-tertiary">POST /webhooks/pipefy/card-updated</p>
            </div>
          </div>
          <WebhookForm />
        </Card>

        <Card className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-content">Regras de Negócio</h2>
          <div className="space-y-3 text-sm">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <p className="font-medium text-emerald-500 dark:text-emerald-400">Prioridade Alta</p>
              <p className="text-content-secondary mt-1">Patrimônio ≥ R$ 200.000,00</p>
            </div>
            <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20">
              <p className="font-medium text-sky-500 dark:text-sky-400">Prioridade Normal</p>
              <p className="text-content-secondary mt-1">Patrimônio &lt; R$ 200.000,00</p>
            </div>
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <p className="font-medium text-amber-500 dark:text-amber-400">Idempotência</p>
              <p className="text-content-secondary mt-1">Eventos duplicados (mesmo event_id) retornam 409</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
