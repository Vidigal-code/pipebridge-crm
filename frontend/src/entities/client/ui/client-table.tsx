"use client";

import type { Client } from "@/shared/types";
import Badge from "@/shared/ui/badge";
import { formatCurrency, formatDate } from "@/shared/lib/formatters";
import {
  STATUS_PROCESSADO,
  PRIORITY_ALTA,
  PRIORITY_LABELS,
  EMPTY_PLACEHOLDER,
} from "@/shared/lib/constants";

interface ClientTableProps {
  clients: Client[];
}

type BadgeVariant = "success" | "warning" | "info" | "danger";

function resolveStatusVariant(status: string): BadgeVariant {
  return status === STATUS_PROCESSADO ? "success" : "warning";
}

function resolvePriorityVariant(priority: string | null): BadgeVariant {
  return priority === PRIORITY_ALTA ? "danger" : "info";
}

function resolvePriorityLabel(priority: string | null): string {
  if (!priority) return EMPTY_PLACEHOLDER;
  return PRIORITY_LABELS[priority] ?? priority;
}

function ClientMobileCard({ client }: { client: Client }) {
  return (
    <div className="p-4 border-b border-border-subtle last:border-b-0 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-medium text-content truncate">{client.cliente_nome}</p>
          <p className="text-xs text-content-secondary truncate">{client.cliente_email}</p>
        </div>
        <Badge label={client.status} variant={resolveStatusVariant(client.status)} />
      </div>

      <div className="flex items-center justify-between gap-2 text-xs">
        <span className="text-content-secondary truncate">{client.tipo_solicitacao}</span>
        <span className="text-emerald-600 dark:text-emerald-400 font-mono shrink-0">
          {formatCurrency(client.valor_patrimonio)}
        </span>
      </div>

      <div className="flex items-center justify-between gap-2 text-xs">
        <div>
          {client.prioridade ? (
            <Badge
              label={resolvePriorityLabel(client.prioridade)}
              variant={resolvePriorityVariant(client.prioridade)}
            />
          ) : (
            <span className="text-content-tertiary">{EMPTY_PLACEHOLDER}</span>
          )}
        </div>
        <span className="text-content-tertiary">{formatDate(client.created_at)}</span>
      </div>
    </div>
  );
}

function ClientDesktopRow({ client }: { client: Client }) {
  return (
    <tr className="border-b border-border-subtle hover:bg-surface-hover transition-colors">
      <td className="py-3 px-4 text-content font-medium">{client.cliente_nome}</td>
      <td className="py-3 px-4 text-content-secondary">{client.cliente_email}</td>
      <td className="py-3 px-4 text-content-secondary">{client.tipo_solicitacao}</td>
      <td className="py-3 px-4 text-right text-emerald-600 dark:text-emerald-400 font-mono">
        {formatCurrency(client.valor_patrimonio)}
      </td>
      <td className="py-3 px-4 text-center">
        <Badge label={client.status} variant={resolveStatusVariant(client.status)} />
      </td>
      <td className="py-3 px-4 text-center">
        {client.prioridade ? (
          <Badge
            label={resolvePriorityLabel(client.prioridade)}
            variant={resolvePriorityVariant(client.prioridade)}
          />
        ) : (
          <span className="text-content-tertiary">{EMPTY_PLACEHOLDER}</span>
        )}
      </td>
      <td className="py-3 px-4 text-right text-content-tertiary text-xs">
        {formatDate(client.created_at)}
      </td>
    </tr>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-12 text-content-tertiary">
      Nenhum cliente cadastrado
    </div>
  );
}

const TABLE_HEADERS = [
  { label: "Nome", align: "text-left" },
  { label: "Email", align: "text-left" },
  { label: "Solicitação", align: "text-left" },
  { label: "Patrimônio", align: "text-right" },
  { label: "Status", align: "text-center" },
  { label: "Prioridade", align: "text-center" },
  { label: "Criado", align: "text-right" },
] as const;

export default function ClientTable({ clients }: ClientTableProps) {
  if (clients.length === 0) return <EmptyState />;

  return (
    <>
      <div className="block lg:hidden">
        {clients.map((client) => (
          <ClientMobileCard key={client.id} client={client} />
        ))}
      </div>

      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-subtle">
              {TABLE_HEADERS.map(({ label, align }) => (
                <th key={label} className={`${align} py-3 px-4 text-content-secondary font-medium`}>
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <ClientDesktopRow key={client.id} client={client} />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
