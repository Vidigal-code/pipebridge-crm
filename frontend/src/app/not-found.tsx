"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/shared/auth/provider";
import { AlertTriangle } from "lucide-react";
import Button from "@/shared/ui/button";
import Loading from "@/shared/ui/loading";

const REDIRECT_DELAY_MS = 5000;
const AUTHENTICATED_REDIRECT = "/";
const UNAUTHENTICATED_REDIRECT = "/login";

function resolveRedirect(isAuthenticated: boolean): string {
  return isAuthenticated ? AUTHENTICATED_REDIRECT : UNAUTHENTICATED_REDIRECT;
}

function resolveLabel(isAuthenticated: boolean): string {
  return isAuthenticated ? "Voltar ao Dashboard" : "Ir para Login";
}

export default function NotFoundPage() {
  const { isAuthenticated, isHydrating } = useAuth();
  const router = useRouter();

  const redirectPath = resolveRedirect(isAuthenticated);
  const buttonLabel = resolveLabel(isAuthenticated);

  useEffect(() => {
    if (isHydrating) return;
    const timer = setTimeout(() => router.replace(redirectPath), REDIRECT_DELAY_MS);
    return () => clearTimeout(timer);
  }, [isHydrating, redirectPath, router]);

  if (isHydrating) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface">
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-surface px-4">
      <div className="text-center max-w-sm w-full">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/15 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-amber-500" />
        </div>
        <h1 className="text-5xl sm:text-6xl font-extrabold text-content mb-2">404</h1>
        <p className="text-base text-content-secondary mb-2">Página não encontrada</p>
        <p className="text-xs text-content-tertiary mb-8">
          Você será redirecionado automaticamente em alguns segundos...
        </p>
        <Button
          onClick={() => router.replace(redirectPath)}
          className="w-full sm:w-auto px-8"
        >
          {buttonLabel}
        </Button>
      </div>
    </div>
  );
}
