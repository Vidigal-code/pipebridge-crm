"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/shared/auth/provider";
import Loading from "@/shared/ui/loading";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isHydrating } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isHydrating && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isHydrating, router]);

  if (isHydrating || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface">
        <Loading />
      </div>
    );
  }

  return <>{children}</>;
}
