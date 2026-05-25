"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useCallback } from "react";
import toast from "react-hot-toast";

import apiClient from "@/shared/api/client";
import ENDPOINTS from "@/shared/api/endpoints";
import { changePasswordSchema, type ChangePasswordFormData } from "../model/schema";
import Button from "@/shared/ui/button";
import Input from "@/shared/ui/input";
import Alert from "@/shared/ui/alert";

export default function ChangePasswordForm() {
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = useCallback(async (data: ChangePasswordFormData) => {
    setSuccessMessage("");
    try {
      await apiClient.put(ENDPOINTS.auth.password, {
        old_password: data.old_password,
        new_password: data.new_password,
      });
      setSuccessMessage("Senha alterada com sucesso!");
      toast.success("Senha alterada com sucesso!");
      reset();
    } catch (err: any) {
      const detail = err?.response?.data?.detail;
      toast.error(detail || "Erro ao alterar senha.");
    }
  }, [reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        label="Senha Atual"
        type="password"
        placeholder="••••••••"
        error={errors.old_password?.message}
        {...register("old_password")}
      />
      <Input
        label="Nova Senha"
        type="password"
        placeholder="Min. 8 chars com maiúscula, número e especial"
        error={errors.new_password?.message}
        {...register("new_password")}
      />
      <Input
        label="Confirmar Nova Senha"
        type="password"
        placeholder="••••••••"
        error={errors.confirm_password?.message}
        {...register("confirm_password")}
      />

      {successMessage && <Alert message={successMessage} variant="success" />}

      <Button type="submit" loading={isSubmitting} className="w-full mt-2">
        Alterar Senha
      </Button>
    </form>
  );
}
