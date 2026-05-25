"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";

import { fetchClients, ClientTable } from "@/entities/client";
import { CreateClientForm } from "@/features/create-client";
import Button from "@/shared/ui/button";
import Card from "@/shared/ui/card";
import Modal from "@/shared/ui/modal";
import Loading from "@/shared/ui/loading";

export default function ClientesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: clients = [], isLoading } = useQuery({
    queryKey: ["clients"],
    queryFn: fetchClients,
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-content">Clientes</h1>
          <p className="text-content-secondary mt-1">Gerencie os clientes e seus patrimônios</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 w-full sm:w-auto justify-center">
          <Plus className="w-4 h-4" />
          Novo Cliente
        </Button>
      </div>

      <Card className="overflow-x-auto">
        {isLoading ? <Loading /> : <ClientTable clients={clients} />}
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Criar Novo Cliente">
        <CreateClientForm onSuccess={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
}
