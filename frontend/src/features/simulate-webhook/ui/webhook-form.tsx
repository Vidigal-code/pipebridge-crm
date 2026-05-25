"use client";

import { useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { fetchClients } from "@/entities/client";
import { sendWebhook } from "@/entities/webhook";
import type { Client } from "@/shared/types";
import { webhookSchema, type WebhookFormData } from "../model/schema";
import Button from "@/shared/ui/button";
import Input from "@/shared/ui/input";
import Select, { type SelectOption } from "@/shared/ui/select";
import { EMPTY_PLACEHOLDER } from "@/shared/lib/constants";

const HTTP_CONFLICT = 409;
const HTTP_NOT_FOUND = 404;

function generateEventId(): string {
  return `evt_${Date.now()}`;
}

function generateTimestamp(): string {
  return new Date().toISOString();
}

function buildDefaultValues(): WebhookFormData {
  return {
    event_id: generateEventId(),
    card_id: "",
    cliente_email: "",
    timestamp: generateTimestamp(),
  };
}

function buildClientOptions(clients: Client[]): SelectOption[] {
  return clients.map((client) => ({
    value: client.id,
    label: buildClientLabel(client),
  }));
}

function buildClientLabel(client: Client): string {
  const cardInfo = client.card_id ? `Card: ${client.card_id}` : EMPTY_PLACEHOLDER;
  return `${client.cliente_nome} — ${client.cliente_email} (${cardInfo})`;
}

function findClientById(clients: Client[], id: string): Client | undefined {
  return clients.find((c) => c.id === id);
}

function handleWebhookError(error: any) {
  const status = error?.response?.status;
  const detail = error?.response?.data?.detail;

  if (status === HTTP_CONFLICT) {
    toast.error(`Evento duplicado: ${detail}`);
    return;
  }
  if (status === HTTP_NOT_FOUND) {
    toast.error(`Cliente não encontrado: ${detail}`);
    return;
  }
  toast.error("Erro ao processar webhook.");
}

export default function WebhookForm() {
  const queryClient = useQueryClient();

  const { data: clients = [] } = useQuery({
    queryKey: ["clients"],
    queryFn: fetchClients,
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<WebhookFormData>({
    resolver: zodResolver(webhookSchema),
    defaultValues: buildDefaultValues(),
  });

  const clientOptions = useMemo(() => buildClientOptions(clients), [clients]);

  const handleClientSelect = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedId = e.target.value;
      if (!selectedId) return;

      const client = findClientById(clients, selectedId);
      if (!client) return;

      setValue("cliente_email", client.cliente_email, { shouldValidate: true });
      setValue("card_id", client.card_id || "", { shouldValidate: true });
      setValue("event_id", generateEventId());
      setValue("timestamp", generateTimestamp());
    },
    [clients, setValue]
  );

  const onSuccess = useCallback(
    (data: { status: string; prioridade: string | null }) => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast.success(
        `Webhook processado! Status: ${data.status} | Prioridade: ${data.prioridade}`
      );
      reset(buildDefaultValues());
    },
    [queryClient, reset]
  );

  const mutation = useMutation({
    mutationFn: sendWebhook,
    onSuccess,
    onError: handleWebhookError,
  });

  const onSubmit = useCallback(
    (data: WebhookFormData) => mutation.mutate(data),
    [mutation]
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Select
        label="Selecionar Cliente"
        placeholder="Escolha um cliente cadastrado..."
        options={clientOptions}
        onChange={handleClientSelect}
      />

      <Input
        label="Event ID"
        placeholder="evt_123"
        error={errors.event_id?.message}
        {...register("event_id")}
      />
      <Input
        label="Card ID"
        placeholder="Preenchido automaticamente ao selecionar cliente"
        error={errors.card_id?.message}
        readOnly
        {...register("card_id")}
      />
      <Input
        label="Email do Cliente"
        placeholder="Preenchido automaticamente ao selecionar cliente"
        error={errors.cliente_email?.message}
        readOnly
        {...register("cliente_email")}
      />
      <Input
        label="Timestamp"
        placeholder="2026-05-18T12:00:00Z"
        error={errors.timestamp?.message}
        {...register("timestamp")}
      />
      <Button type="submit" loading={mutation.isPending} className="mt-2 w-full">
        Simular Webhook
      </Button>
    </form>
  );
}
