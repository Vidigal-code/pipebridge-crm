"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";

const REDIRECT_DELAY_MS = 5000;
const AUTHENTICATED_REDIRECT = "/";
const UNAUTHENTICATED_REDIRECT = "/login";
const TOKEN_KEY = "pipebridge_token";

function checkAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem(TOKEN_KEY);
}

function resolveRedirect(isAuth: boolean): string {
  return isAuth ? AUTHENTICATED_REDIRECT : UNAUTHENTICATED_REDIRECT;
}

function resolveLabel(isAuth: boolean): string {
  return isAuth ? "Voltar ao Dashboard" : "Ir para Login";
}

export default function NotFoundPage() {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setIsAuth(checkAuthenticated());
    setReady(true);
  }, []);

  const redirectPath = resolveRedirect(isAuth);
  const buttonLabel = resolveLabel(isAuth);

  useEffect(() => {
    if (!ready) return;
    const timer = setTimeout(() => router.replace(redirectPath), REDIRECT_DELAY_MS);
    return () => clearTimeout(timer);
  }, [ready, redirectPath, router]);

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
        {ready && (
          <button
            onClick={() => router.replace(redirectPath)}
            className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-white px-8 py-3 rounded-xl font-medium transition-colors"
          >
            {buttonLabel}
          </button>
        )}
      </div>
    </div>
  );
}
