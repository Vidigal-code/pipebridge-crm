"use client";

import type { Client } from "@/shared/types";
import Badge from "@/shared/ui/badge";
import { Pencil, Trash2 } from "lucide-react";
import { formatCurrency, formatDate } from "@/shared/lib/formatters";
import {
  STATUS_PROCESSADO,
  PRIORITY_ALTA,
  PRIORITY_LABELS,
  EMPTY_PLACEHOLDER,
} from "@/shared/lib/constants";

interface ClientTableProps {
  clients: Client[];
  selectedIds?: Set<string>;
  onToggleSelect?: (id: string) => void;
  onToggleSelectAll?: () => void;
  onDelete?: (id: string) => void;
  onEdit?: (client: Client) => void;
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

function ActionButtons({
  client,
  onEdit,
  onDelete,
}: {
  client: Client;
  onEdit?: (client: Client) => void;
  onDelete?: (id: string) => void;
}) {
  if (!onEdit && !onDelete) return null;
  return (
    <div className="flex gap-1.5 justify-end">
      {onEdit && (
        <button
          onClick={() => onEdit(client)}
          className="p-1.5 rounded-lg text-accent hover:bg-accent/10 transition-colors"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
      )}
      {onDelete && (
        <button
          onClick={() => onDelete(client.id)}
          className="p-1.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

function Checkbox({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="w-4 h-4 rounded border-border-subtle accent-accent cursor-pointer"
    />
  );
}

function ClientMobileCard({
  client,
  isSelected,
  onToggle,
  onEdit,
  onDelete,
}: {
  client: Client;
  isSelected: boolean;
  onToggle?: () => void;
  onEdit?: (client: Client) => void;
  onDelete?: (id: string) => void;
}) {
  return (
    <div className="p-4 border-b border-border-subtle last:border-b-0 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-3 min-w-0">
          {onToggle && <Checkbox checked={isSelected} onChange={onToggle} />}
          <div className="min-w-0">
            <p className="text-sm font-medium text-content truncate">{client.cliente_nome}</p>
            <p className="text-xs text-content-secondary truncate">{client.cliente_email}</p>
          </div>
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
        <div className="flex items-center gap-2">
          <span className="text-content-tertiary">{formatDate(client.created_at)}</span>
          <ActionButtons client={client} onEdit={onEdit} onDelete={onDelete} />
        </div>
      </div>
    </div>
  );
}

function ClientDesktopRow({
  client,
  isSelected,
  onToggle,
  onEdit,
  onDelete,
}: {
  client: Client;
  isSelected: boolean;
  onToggle?: () => void;
  onEdit?: (client: Client) => void;
  onDelete?: (id: string) => void;
}) {
  return (
    <tr className="border-b border-border-subtle hover:bg-surface-hover transition-colors">
      {onToggle && (
        <td className="py-3 px-3">
          <Checkbox checked={isSelected} onChange={onToggle} />
        </td>
      )}
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
      <td className="py-3 px-4 text-right">
        <ActionButtons client={client} onEdit={onEdit} onDelete={onDelete} />
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
  { label: "Ações", align: "text-right" },
] as const;

export default function ClientTable({
  clients,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onDelete,
  onEdit,
}: ClientTableProps) {
  if (clients.length === 0) return <EmptyState />;

  const hasSelection = !!onToggleSelect;
  const allSelected = hasSelection && clients.every((c) => selectedIds?.has(c.id));

  return (
    <>
      <div className="block lg:hidden">
        {hasSelection && (
          <div className="p-3 border-b border-border-subtle flex items-center gap-2">
            <Checkbox checked={allSelected} onChange={() => onToggleSelectAll?.()} />
            <span className="text-xs text-content-secondary">Selecionar todos</span>
          </div>
        )}
        {clients.map((client) => (
          <ClientMobileCard
            key={client.id}
            client={client}
            isSelected={selectedIds?.has(client.id) ?? false}
            onToggle={onToggleSelect ? () => onToggleSelect(client.id) : undefined}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-subtle">
              {hasSelection && (
                <th className="py-3 px-3 w-10">
                  <Checkbox checked={allSelected} onChange={() => onToggleSelectAll?.()} />
                </th>
              )}
              {TABLE_HEADERS.map(({ label, align }) => (
                <th key={label} className={`${align} py-3 px-4 text-content-secondary font-medium`}>
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <ClientDesktopRow
                key={client.id}
                client={client}
                isSelected={selectedIds?.has(client.id) ?? false}
                onToggle={onToggleSelect ? () => onToggleSelect(client.id) : undefined}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
