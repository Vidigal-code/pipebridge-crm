"use client";

import { usePathname } from "next/navigation";
import { AuthProvider, useAuth } from "@/shared/auth/provider";
import { ThemeProvider } from "@/shared/theme/provider";
import { AuthGuard } from "@/shared/auth";
import Sidebar from "@/widgets/sidebar";

const PUBLIC_PATHS = ["/login"];
const HYBRID_PATHS = ["/sobre"];

function isPublic(pathname: string): boolean {
  return PUBLIC_PATHS.includes(pathname);
}

function isHybrid(pathname: string): boolean {
  return HYBRID_PATHS.includes(pathname);
}

function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 w-full lg:ml-64 pt-16 lg:pt-0">
          <div className="max-w-5xl mx-auto w-full px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}

function StandalonePage({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-4xl mx-auto w-full px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {children}
      </div>
    </div>
  );
}

function HybridPage({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isHydrating } = useAuth();

  if (isHydrating) {
    return <StandalonePage>{children}</StandalonePage>;
  }

  return isAuthenticated ? (
    <AppShell>{children}</AppShell>
  ) : (
    <StandalonePage>{children}</StandalonePage>
  );
}

function LayoutRouter({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (isHybrid(pathname)) {
    return <HybridPage>{children}</HybridPage>;
  }

  if (isPublic(pathname)) {
    return <>{children}</>;
  }

  return <AppShell>{children}</AppShell>;
}

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LayoutRouter>{children}</LayoutRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
