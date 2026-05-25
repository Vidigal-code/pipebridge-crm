"use client";

import { useState, useCallback, useMemo, Suspense } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";

import {
  fetchPipefyCards,
  updatePipefyCard,
  deletePipefyCard,
} from "@/entities/pipefy";
import type { PipefyCard, PipefyCardField } from "@/shared/types";
import Card from "@/shared/ui/card";
import Badge from "@/shared/ui/badge";
import Button from "@/shared/ui/button";
import Input from "@/shared/ui/input";
import Modal from "@/shared/ui/modal";
import Loading from "@/shared/ui/loading";
import ConfirmDialog from "@/shared/ui/confirm-dialog";
import Pagination from "@/shared/ui/pagination";
import { usePagination } from "@/shared/lib/use-pagination";
import { formatDate } from "@/shared/lib/formatters";
import { EMPTY_PLACEHOLDER } from "@/shared/lib/constants";

const QUERY_KEY = ["pipefy-cards"];
const PAGE_SIZE = 6;

function findFieldValue(fields: PipefyCardField[], name: string): string {
  return fields.find((f) => f.name.toLowerCase() === name.toLowerCase())?.value || EMPTY_PLACEHOLDER;
}

function resolvePhaseVariant(phase: string): "success" | "warning" | "info" {
  if (phase.toLowerCase().includes("fazendo")) return "info";
  if (phase.toLowerCase().includes("feito") || phase.toLowerCase().includes("done")) return "success";
  return "warning";
}

function CardFieldRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start gap-2 py-1.5">
      <span className="text-xs text-content-tertiary shrink-0">{label}</span>
      <span className="text-xs text-content text-right break-all">{value || EMPTY_PLACEHOLDER}</span>
    </div>
  );
}

function CardActions({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex gap-2 mt-3 pt-3 border-t border-border-subtle">
      <button
        onClick={onEdit}
        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium text-accent bg-accent/10 hover:bg-accent/20 transition-colors"
      >
        <Pencil className="w-3.5 h-3.5" />
        Editar
      </button>
      <button
        onClick={onDelete}
        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium text-red-600 dark:text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-colors"
      >
        <Trash2 className="w-3.5 h-3.5" />
        Remover
      </button>
    </div>
  );
}

function PipefyCardItem({
  card,
  onEdit,
  onDelete,
}: {
  card: PipefyCard;
  onEdit: (card: PipefyCard) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-content truncate">{card.title || findFieldValue(card.fields, "cliente_nome")}</p>
          <p className="text-xs text-content-tertiary mt-0.5">ID: {card.id}</p>
        </div>
        <Badge label={card.phase || EMPTY_PLACEHOLDER} variant={resolvePhaseVariant(card.phase)} />
      </div>

      <div className="divide-y divide-border-subtle">
        {card.fields.map((field) => (
          <CardFieldRow key={field.field_id || field.name} label={field.name} value={field.value} />
        ))}
      </div>

      {card.created_at && (
        <p className="text-xs text-content-tertiary mt-3">
          Criado: {formatDate(card.created_at)}
        </p>
      )}

      <CardActions
        onEdit={() => onEdit(card)}
        onDelete={() => onDelete(card.id)}
      />
    </Card>
  );
}

function EditFieldRow({
  field,
  value,
  onChange,
}: {
  field: PipefyCardField;
  value: string;
  onChange: (fieldId: string, value: string) => void;
}) {
  return (
    <Input
      label={field.name}
      value={value}
      onChange={(e) => onChange(field.field_id, e.target.value)}
    />
  );
}

function EditModal({
  card,
  isOpen,
  onClose,
  onSave,
  isSaving,
}: {
  card: PipefyCard | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (cardId: string, fields: { fieldId: string; value: string }[]) => void;
  isSaving: boolean;
}) {
  const [editValues, setEditValues] = useState<Record<string, string>>({});

  const handleOpen = useCallback(() => {
    if (!card) return;
    const initial: Record<string, string> = {};
    card.fields.forEach((f) => {
      initial[f.field_id] = f.value;
    });
    setEditValues(initial);
  }, [card]);

  useMemo(() => {
    if (isOpen && card) handleOpen();
  }, [isOpen, card, handleOpen]);

  const handleFieldChange = useCallback((fieldId: string, value: string) => {
    setEditValues((prev) => ({ ...prev, [fieldId]: value }));
  }, []);

  const handleSave = useCallback(() => {
    if (!card) return;
    const fields = Object.entries(editValues).map(([fieldId, value]) => ({
      fieldId,
      value,
    }));
    onSave(card.id, fields);
  }, [card, editValues, onSave]);

  if (!card) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Editar: ${card.title || card.id}`}>
      <div className="flex flex-col gap-3">
        {card.fields
          .filter((f) => f.field_id)
          .map((field) => (
            <EditFieldRow
              key={field.field_id}
              field={field}
              value={editValues[field.field_id] ?? field.value}
              onChange={handleFieldChange}
            />
          ))}
        <Button onClick={handleSave} loading={isSaving} className="w-full mt-2">
          Salvar Alterações
        </Button>
      </div>
    </Modal>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-16">
      <ExternalLink className="w-12 h-12 text-content-tertiary mx-auto mb-4" />
      <p className="text-content-secondary text-sm">Nenhum card encontrado no Pipefy</p>
    </div>
  );
}

function PipefyCardsContent() {
  const queryClient = useQueryClient();
  const [editingCard, setEditingCard] = useState<PipefyCard | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data: cards = [], isLoading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: fetchPipefyCards,
  });

  const { paginatedItems, currentPage, totalItems, goToPage } = usePagination(cards, PAGE_SIZE);

  const deleteMutation = useMutation({
    mutationFn: deletePipefyCard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast.success("Card removido do Pipefy!");
      setDeletingId(null);
    },
    onError: () => {
      toast.error("Erro ao remover card.");
      setDeletingId(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ cardId, fields }: { cardId: string; fields: { fieldId: string; value: string }[] }) =>
      updatePipefyCard(cardId, fields),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast.success("Card atualizado no Pipefy!");
      setEditingCard(null);
    },
    onError: () => toast.error("Erro ao atualizar card."),
  });

  const handleEdit = useCallback((card: PipefyCard) => setEditingCard(card), []);
  const handleCloseEdit = useCallback(() => setEditingCard(null), []);
  const handleRequestDelete = useCallback((id: string) => setDeletingId(id), []);
  const handleCancelDelete = useCallback(() => setDeletingId(null), []);
  const handleConfirmDelete = useCallback(() => {
    if (deletingId) deleteMutation.mutate(deletingId);
  }, [deletingId, deleteMutation]);

  const handleSave = useCallback(
    (cardId: string, fields: { fieldId: string; value: string }[]) => {
      updateMutation.mutate({ cardId, fields });
    },
    [updateMutation]
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-content">
          Cards Pipefy
        </h1>
        <p className="text-content-secondary text-sm mt-1">
          Gerencie os cards diretamente no Pipefy em tempo real
        </p>
      </div>

      {isLoading ? (
        <Loading />
      ) : cards.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {paginatedItems.map((card) => (
              <PipefyCardItem
                key={card.id}
                card={card}
                onEdit={handleEdit}
                onDelete={handleRequestDelete}
              />
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalItems={totalItems}
            pageSize={PAGE_SIZE}
            onPageChange={goToPage}
          />
        </>
      )}

      <EditModal
        card={editingCard}
        isOpen={!!editingCard}
        onClose={handleCloseEdit}
        onSave={handleSave}
        isSaving={updateMutation.isPending}
      />

      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Remover Card"
        message="Tem certeza que deseja remover este card do Pipefy? Esta ação não pode ser desfeita."
        confirmLabel="Remover"
        loading={deleteMutation.isPending}
      />
    </div>
  );
}

export default function PipefyCardsPage() {
  return (
    <Suspense fallback={<Loading />}>
      <PipefyCardsContent />
    </Suspense>
  );
}
