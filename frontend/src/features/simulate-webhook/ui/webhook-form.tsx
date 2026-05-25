"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { sendWebhook } from "@/entities/webhook";
import { webhookSchema, type WebhookFormData } from "../model/schema";
import Button from "@/shared/ui/button";
import Input from "@/shared/ui/input";

export default function WebhookForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<WebhookFormData>({
    resolver: zodResolver(webhookSchema),
    defaultValues: {
      event_id: `evt_${Date.now()}`,
      card_id: "card_456",
      timestamp: new Date().toISOString(),
    },
  });

  const mutation = useMutation({
    mutationFn: sendWebhook,
    onSuccess: (data) => {
      toast.success(
        `Webhook processado! Status: ${data.status} | Prioridade: ${data.prioridade}`
      );
      reset({
        event_id: `evt_${Date.now()}`,
        card_id: "card_456",
        cliente_email: "",
        timestamp: new Date().toISOString(),
      });
    },
    onError: (error: any) => {
      const status = error?.response?.status;
      const detail = error?.response?.data?.detail;

      if (status === 409) {
        toast.error(`Evento duplicado: ${detail}`);
        return;
      }
      if (status === 404) {
        toast.error(`Cliente não encontrado: ${detail}`);
        return;
      }
      toast.error("Erro ao processar webhook.");
    },
  });

  const onSubmit = (data: WebhookFormData) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        label="Event ID"
        placeholder="evt_123"
        error={errors.event_id?.message}
        {...register("event_id")}
      />
      <Input
        label="Card ID"
        placeholder="card_456"
        error={errors.card_id?.message}
        {...register("card_id")}
      />
      <Input
        label="Email do Cliente"
        type="text"
        placeholder="joao.silva@example.com"
        error={errors.cliente_email?.message}
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
