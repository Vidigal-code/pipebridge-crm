"use client";

import type { Client } from "@/shared/types";
import Badge from "@/shared/ui/badge";
import { formatCurrency, formatDate } from "@/shared/lib/formatters";

interface ClientTableProps {
  clients: Client[];
}

function getStatusBadgeVariant(status: string) {
  if (status === "Processado") return "success";
  return "warning";
}

function getPriorityBadgeVariant(priority: string | null) {
  if (priority === "prioridade_alta") return "danger";
  return "info";
}

function formatPriorityLabel(priority: string | null): string {
  if (!priority) return "—";
  if (priority === "prioridade_alta") return "Alta";
  return "Normal";
}

export default function ClientTable({ clients }: ClientTableProps) {
  if (clients.length === 0) {
    return (
      <div className="text-center py-12 text-content-tertiary">
        Nenhum cliente cadastrado
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm min-w-[700px]">
        <thead>
          <tr className="border-b border-border-subtle">
            <th className="text-left py-3 px-4 text-content-secondary font-medium">Nome</th>
            <th className="text-left py-3 px-4 text-content-secondary font-medium">Email</th>
            <th className="text-left py-3 px-4 text-content-secondary font-medium">Solicitação</th>
            <th className="text-right py-3 px-4 text-content-secondary font-medium">Patrimônio</th>
            <th className="text-center py-3 px-4 text-content-secondary font-medium">Status</th>
            <th className="text-center py-3 px-4 text-content-secondary font-medium">Prioridade</th>
            <th className="text-right py-3 px-4 text-content-secondary font-medium">Criado</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr
              key={client.id}
              className="border-b border-border-subtle hover:bg-surface-input transition-colors"
            >
              <td className="py-3 px-4 text-content font-medium">{client.cliente_nome}</td>
              <td className="py-3 px-4 text-content-secondary">{client.cliente_email}</td>
              <td className="py-3 px-4 text-content-secondary">{client.tipo_solicitacao}</td>
              <td className="py-3 px-4 text-right text-emerald-600 dark:text-emerald-400 font-mono">
                {formatCurrency(client.valor_patrimonio)}
              </td>
              <td className="py-3 px-4 text-center">
                <Badge label={client.status} variant={getStatusBadgeVariant(client.status)} />
              </td>
              <td className="py-3 px-4 text-center">
                {client.prioridade ? (
                  <Badge
                    label={formatPriorityLabel(client.prioridade)}
                    variant={getPriorityBadgeVariant(client.prioridade)}
                  />
                ) : (
                  <span className="text-content-tertiary">—</span>
                )}
              </td>
              <td className="py-3 px-4 text-right text-content-tertiary text-xs">
                {formatDate(client.created_at)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
