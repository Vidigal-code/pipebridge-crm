"use client";

import { LoginForm } from "@/features/auth";
import Card from "@/shared/ui/card";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="p-6 sm:p-8">
          <LoginForm />
        </Card>
        <p className="text-center text-content-tertiary text-xs mt-6">
          PipeBridge CRM © 2026 — Mundo Invest
        </p>
      </div>
    </div>
  );
}
