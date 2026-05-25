"use client";

import { usePathname } from "next/navigation";
import { AuthProvider } from "@/shared/auth/provider";
import { ThemeProvider } from "@/shared/theme/provider";
import { AuthGuard } from "@/shared/auth";
import Sidebar from "@/widgets/sidebar";

const PUBLIC_PATHS = ["/login"];

export function AuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublicPage = PUBLIC_PATHS.includes(pathname);

  return (
    <ThemeProvider>
      <AuthProvider>
        {isPublicPage ? (
          children
        ) : (
          <AuthGuard>
            <div className="flex min-h-screen">
              <Sidebar />
              <main className="flex-1 lg:ml-64 p-4 pt-16 lg:p-8 lg:pt-8">
                <div className="max-w-5xl mx-auto w-full">{children}</div>
              </main>
            </div>
          </AuthGuard>
        )}
      </AuthProvider>
    </ThemeProvider>
  );
}
