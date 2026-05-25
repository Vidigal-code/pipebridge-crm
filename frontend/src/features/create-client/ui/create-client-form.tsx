"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { createClient } from "@/entities/client";
import { createClientSchema, type CreateClientFormData } from "../model/schema";
import Button from "@/shared/ui/button";
import Input from "@/shared/ui/input";

interface CreateClientFormProps {
  onSuccess?: () => void;
}

export default function CreateClientForm({ onSuccess }: CreateClientFormProps) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateClientFormData>({
    resolver: zodResolver(createClientSchema),
  });

  const mutation = useMutation({
    mutationFn: createClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast.success("Cliente criado com sucesso!");
      reset();
      onSuccess?.();
    },
    onError: () => {
      toast.error("Erro ao criar cliente. Tente novamente.");
    },
  });

  const onSubmit = (data: CreateClientFormData) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        label="Nome"
        placeholder="João Silva"
        error={errors.cliente_nome?.message}
        {...register("cliente_nome")}
      />
      <Input
        label="Email"
        type="email"
        placeholder="joao.silva@example.com"
        error={errors.cliente_email?.message}
        {...register("cliente_email")}
      />
      <Input
        label="Tipo de Solicitação"
        placeholder="Atualização cadastral"
        error={errors.tipo_solicitacao?.message}
        {...register("tipo_solicitacao")}
      />
      <Input
        label="Valor Patrimônio (R$)"
        type="number"
        placeholder="250000"
        error={errors.valor_patrimonio?.message}
        {...register("valor_patrimonio", { valueAsNumber: true })}
      />
      <Button type="submit" loading={mutation.isPending} className="mt-2 w-full">
        Criar Cliente
      </Button>
    </form>
  );
}
