"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Webhook, LogOut, Shield, Sun, Moon, Menu, X, KeyRound } from "lucide-react";
import { useAuth } from "@/shared/auth/provider";
import { useTheme } from "@/shared/theme/provider";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/clientes", label: "Clientes", icon: Users },
  { href: "/webhooks", label: "Webhooks", icon: Webhook },
  { href: "/configuracoes", label: "Alterar Senha", icon: KeyRound },
];

function NavLink({ href, label, icon: Icon, isActive, onClick }: { href: string; label: string; icon: any; isActive: boolean; onClick?: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
        isActive
          ? "bg-indigo-500/10 text-indigo-500 dark:text-sky-400 dark:bg-sky-500/10 shadow-lg"
          : "text-content-secondary hover:text-content hover:bg-surface-input"
      }`}
    >
      <Icon className="w-5 h-5" />
      {label}
    </Link>
  );
}

function UserInfo({ name, role }: { name: string; role: string }) {
  return (
    <div className="flex items-center gap-3 px-3 py-2">
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
        <Shield className="w-4 h-4 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-content truncate">{name}</p>
        <p className="text-xs text-content-tertiary truncate">{role.toUpperCase()}</p>
      </div>
    </div>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = () => setMobileOpen(false);

  const sidebarContent = (
    <>
      <div className="p-6 border-b border-border-subtle">
        <h1 className="text-xl font-bold bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">
          PipeBridge
        </h1>
        <p className="text-xs text-content-tertiary mt-1">Client Management System</p>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ href, label, icon }) => (
          <NavLink key={href} href={href} label={label} icon={icon} isActive={pathname === href} onClick={closeMobile} />
        ))}
      </nav>

      <div className="p-4 border-t border-border-subtle space-y-2">
        <button
          onClick={toggleTheme}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-content-secondary hover:text-amber-500 hover:bg-amber-500/10 transition-all duration-200 w-full"
        >
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          {theme === "dark" ? "Modo Claro" : "Modo Escuro"}
        </button>

        {user && <UserInfo name={user.name} role={user.role} />}

        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-content-secondary hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 w-full"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </button>
      </div>
    </>
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 p-2 rounded-xl bg-surface-card backdrop-blur-xl border border-border-subtle text-content lg:hidden"
        aria-label="Abrir menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={closeMobile} />
      )}

      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-surface-card backdrop-blur-xl border-r border-border-subtle flex flex-col z-50 transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={closeMobile}
          className="absolute top-4 right-4 p-1 rounded-lg text-content-secondary hover:text-content lg:hidden"
          aria-label="Fechar menu"
        >
          <X className="w-5 h-5" />
        </button>
        {sidebarContent}
      </aside>
    </>
  );
}
