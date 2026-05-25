"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

import { useAuth } from "@/shared/auth/provider";
import apiClient from "@/shared/api/client";
import { loginSchema, type LoginFormData } from "../model/schema";
import Button from "@/shared/ui/button";
import Input from "@/shared/ui/input";

export default function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setError("");
    try {
      const response = await apiClient.post("/auth/login", data);
      const { access_token, email, name, role } = response.data;
      login(access_token, { email, name, role });
      router.push("/");
    } catch {
      setError("Credenciais inválidas. Tente novamente.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div className="flex items-center justify-center mb-2">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
          <Lock className="w-7 h-7 text-white" />
        </div>
      </div>

      <div className="text-center mb-2">
        <h1 className="text-2xl font-bold text-content">PipeBridge CRM</h1>
        <p className="text-content-secondary text-sm mt-1">Acesse o painel administrativo</p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
          {error}
        </div>
      )}

      <Input label="Email" type="text" placeholder="admin@mundoinvest.com" error={errors.email?.message} {...register("email")} />
      <Input label="Senha" type="password" placeholder="••••••••" error={errors.password?.message} {...register("password")} />

      <Button type="submit" loading={isSubmitting} className="w-full mt-2">
        Entrar
      </Button>
    </form>
  );
}
