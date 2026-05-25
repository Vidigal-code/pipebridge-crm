"use client";

import { useState, useCallback, Suspense } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Pencil } from "lucide-react";
import toast from "react-hot-toast";

import { fetchClients, deleteClient, updateClient, ClientTable } from "@/entities/client";
import { CreateClientForm } from "@/features/create-client";
import type { Client, CreateClientPayload } from "@/shared/types";
import Button from "@/shared/ui/button";
import Card from "@/shared/ui/card";
import Modal from "@/shared/ui/modal";
import Input from "@/shared/ui/input";
import Loading from "@/shared/ui/loading";
import ConfirmDialog from "@/shared/ui/confirm-dialog";
import Pagination from "@/shared/ui/pagination";
import { usePagination } from "@/shared/lib/use-pagination";

const QUERY_KEY = ["clients"];
const PAGE_SIZE = 10;

function PageHeader({
  onCreateClick,
  selectedCount,
  onBulkDelete,
}: {
  onCreateClick: () => void;
  selectedCount: number;
  onBulkDelete: () => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
      <div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-content">Clientes</h1>
        <p className="text-content-secondary text-sm mt-1">
          Gerencie os clientes e seus patrimônios
        </p>
      </div>
      <div className="flex gap-2 w-full sm:w-auto">
        {selectedCount > 0 && (
          <Button
            variant="danger"
            onClick={onBulkDelete}
            className="flex items-center gap-2 flex-1 sm:flex-none justify-center"
          >
            <Trash2 className="w-4 h-4" />
            Excluir ({selectedCount})
          </Button>
        )}
        <Button
          onClick={onCreateClick}
          className="flex items-center gap-2 flex-1 sm:flex-none justify-center"
        >
          <Plus className="w-4 h-4" />
          Novo Cliente
        </Button>
      </div>
    </div>
  );
}

function EditClientModal({
  client,
  isOpen,
  onClose,
  onSave,
  isSaving,
}: {
  client: Client | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, data: CreateClientPayload) => void;
  isSaving: boolean;
}) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [tipo, setTipo] = useState("");
  const [patrimonio, setPatrimonio] = useState("");

  const populateFields = useCallback(() => {
    if (!client) return;
    setNome(client.cliente_nome);
    setEmail(client.cliente_email);
    setTipo(client.tipo_solicitacao);
    setPatrimonio(String(client.valor_patrimonio));
  }, [client]);

  if (isOpen && client && nome === "" && email === "") {
    populateFields();
  }

  const handleClose = useCallback(() => {
    setNome("");
    setEmail("");
    setTipo("");
    setPatrimonio("");
    onClose();
  }, [onClose]);

  const handleSubmit = useCallback(() => {
    if (!client) return;
    onSave(client.id, {
      cliente_nome: nome,
      cliente_email: email,
      tipo_solicitacao: tipo,
      valor_patrimonio: parseFloat(patrimonio) || 0,
    });
  }, [client, nome, email, tipo, patrimonio, onSave]);

  if (!client) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Editar Cliente">
      <div className="flex flex-col gap-3">
        <Input label="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input label="Tipo de Solicitação" value={tipo} onChange={(e) => setTipo(e.target.value)} />
        <Input label="Patrimônio (R$)" type="number" value={patrimonio} onChange={(e) => setPatrimonio(e.target.value)} />
        <Button onClick={handleSubmit} loading={isSaving} className="w-full mt-2">
          Salvar Alterações
        </Button>
      </div>
    </Modal>
  );
}

function ClientesContent() {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deleteTarget, setDeleteTarget] = useState<{ ids: string[]; message: string } | null>(null);

  const { data: clients = [], isLoading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: fetchClients,
  });

  const { paginatedItems, currentPage, totalItems, goToPage } = usePagination(clients, PAGE_SIZE);

  const deleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      await Promise.all(ids.map(deleteClient));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success("Cliente(s) removido(s) com sucesso!");
      setSelectedIds(new Set());
      setDeleteTarget(null);
    },
    onError: () => {
      toast.error("Erro ao remover cliente(s).");
      setDeleteTarget(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateClientPayload }) =>
      updateClient(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success("Cliente atualizado com sucesso!");
      setEditingClient(null);
    },
    onError: () => toast.error("Erro ao atualizar cliente."),
  });

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    setSelectedIds((prev) => {
      const pageIds = paginatedItems.map((c) => c.id);
      const allSelected = pageIds.every((id) => prev.has(id));
      const next = new Set(prev);
      pageIds.forEach((id) => (allSelected ? next.delete(id) : next.add(id)));
      return next;
    });
  }, [paginatedItems]);

  const handleRequestDelete = useCallback((id: string) => {
    setDeleteTarget({
      ids: [id],
      message: "Tem certeza que deseja remover este cliente? Esta ação não pode ser desfeita.",
    });
  }, []);

  const handleBulkDelete = useCallback(() => {
    const ids = Array.from(selectedIds);
    setDeleteTarget({
      ids,
      message: `Tem certeza que deseja remover ${ids.length} cliente(s)? Esta ação não pode ser desfeita.`,
    });
  }, [selectedIds]);

  const handleConfirmDelete = useCallback(() => {
    if (deleteTarget) deleteMutation.mutate(deleteTarget.ids);
  }, [deleteTarget, deleteMutation]);

  const handleEdit = useCallback((client: Client) => setEditingClient(client), []);

  const handleSaveEdit = useCallback(
    (id: string, data: CreateClientPayload) => {
      updateMutation.mutate({ id, data });
    },
    [updateMutation]
  );

  return (
    <div>
      <PageHeader
        onCreateClick={() => setIsCreateOpen(true)}
        selectedCount={selectedIds.size}
        onBulkDelete={handleBulkDelete}
      />

      <Card>
        {isLoading ? (
          <Loading />
        ) : (
          <>
            <ClientTable
              clients={paginatedItems}
              selectedIds={selectedIds}
              onToggleSelect={toggleSelect}
              onToggleSelectAll={toggleSelectAll}
              onDelete={handleRequestDelete}
              onEdit={handleEdit}
            />
            <Pagination
              currentPage={currentPage}
              totalItems={totalItems}
              pageSize={PAGE_SIZE}
              onPageChange={goToPage}
            />
          </>
        )}
      </Card>

      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Criar Novo Cliente">
        <CreateClientForm onSuccess={() => setIsCreateOpen(false)} />
      </Modal>

      <EditClientModal
        client={editingClient}
        isOpen={!!editingClient}
        onClose={() => setEditingClient(null)}
        onSave={handleSaveEdit}
        isSaving={updateMutation.isPending}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Remover Cliente"
        message={deleteTarget?.message || ""}
        confirmLabel="Remover"
        loading={deleteMutation.isPending}
      />
    </div>
  );
}

export default function ClientesPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ClientesContent />
    </Suspense>
  );
}
