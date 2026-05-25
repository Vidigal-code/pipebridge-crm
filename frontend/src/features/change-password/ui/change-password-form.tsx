"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import toast from "react-hot-toast";

import apiClient from "@/shared/api/client";
import { changePasswordSchema, type ChangePasswordFormData } from "../model/schema";
import Button from "@/shared/ui/button";
import Input from "@/shared/ui/input";

export default function ChangePasswordForm() {
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    setSuccess(false);
    try {
      await apiClient.put("/auth/password", {
        old_password: data.old_password,
        new_password: data.new_password,
      });
      setSuccess(true);
      toast.success("Senha alterada com sucesso!");
      reset();
    } catch (err: any) {
      const detail = err?.response?.data?.detail;
      toast.error(detail || "Erro ao alterar senha.");
    }
  };

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

      {success && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm text-center">
          Senha alterada com sucesso!
        </div>
      )}

      <Button type="submit" loading={isSubmitting} className="w-full mt-2">
        Alterar Senha
      </Button>
    </form>
  );
}
