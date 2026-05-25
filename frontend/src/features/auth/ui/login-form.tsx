"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Info } from "lucide-react";

import { useAuth } from "@/shared/auth/provider";
import apiClient from "@/shared/api/client";
import ENDPOINTS from "@/shared/api/endpoints";
import { loginSchema, type LoginFormData } from "../model/schema";
import Button from "@/shared/ui/button";
import Input from "@/shared/ui/input";
import Alert from "@/shared/ui/alert";

function LoginHeader() {
  return (
    <>
      <div className="flex items-center justify-center mb-2">
        <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center shadow-lg shadow-accent-glow">
          <Lock className="w-7 h-7 text-white" />
        </div>
      </div>
      <div className="text-center mb-2">
        <h1 className="text-xl sm:text-2xl font-bold text-content">PipeBridge CRM</h1>
        <p className="text-content-secondary text-sm mt-1">Acesse o painel administrativo</p>
      </div>
    </>
  );
}

function AboutLink() {
  return (
    <Link
      href="/sobre"
      className="flex items-center justify-center gap-2 text-sm text-content-secondary hover:text-accent transition-colors"
    >
      <Info className="w-4 h-4" />
      Sobre a plataforma
    </Link>
  );
}

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

  const onSubmit = useCallback(
    async (data: LoginFormData) => {
      setError("");
      try {
        const response = await apiClient.post(ENDPOINTS.auth.login, data);
        const { access_token, email, name, role } = response.data;
        login(access_token, { email, name, role });
        router.push("/");
      } catch {
        setError("Credenciais inválidas. Tente novamente.");
      }
    },
    [login, router]
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <LoginHeader />
      {error && <Alert message={error} variant="error" />}
      <Input label="Email" type="text" placeholder="admin@mundoinvest.com" error={errors.email?.message} {...register("email")} />
      <Input label="Senha" type="password" placeholder="••••••••" error={errors.password?.message} {...register("password")} />
      <Button type="submit" loading={isSubmitting} className="w-full mt-2">Entrar</Button>
      <AboutLink />
    </form>
  );
}
