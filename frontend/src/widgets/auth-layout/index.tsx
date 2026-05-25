"use client";

import { usePathname } from "next/navigation";
import { AuthProvider } from "@/shared/auth/provider";
import { ThemeProvider } from "@/shared/theme/provider";
import { AuthGuard } from "@/shared/auth";
import Sidebar from "@/widgets/sidebar";

const PUBLIC_PATHS = ["/login", "/sobre"];

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

export function AuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublicPage = PUBLIC_PATHS.includes(pathname);

  return (
    <ThemeProvider>
      <AuthProvider>
        {isPublicPage ? children : <AppShell>{children}</AppShell>}
      </AuthProvider>
    </ThemeProvider>
  );
}
