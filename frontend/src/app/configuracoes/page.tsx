"use client";

import { KeyRound } from "lucide-react";
import Card from "@/shared/ui/card";
import { ChangePasswordForm } from "@/features/change-password";

function SectionHeader() {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shrink-0">
        <KeyRound className="w-5 h-5 text-white" />
      </div>
      <div className="min-w-0">
        <h2 className="text-base sm:text-lg font-semibold text-content">Alterar Senha</h2>
        <p className="text-xs text-content-secondary">
          Min. 8 chars, maiúscula, número e especial
        </p>
      </div>
    </div>
  );
}

export default function ConfiguracoesPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-content">
          Configurações
        </h1>
        <p className="text-content-secondary text-sm mt-1">Gerencie sua conta e segurança</p>
      </div>

      <div className="max-w-lg mx-auto">
        <Card>
          <SectionHeader />
          <ChangePasswordForm />
        </Card>
      </div>
    </div>
  );
}
