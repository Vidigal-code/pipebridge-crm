"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Webhook,
  LogOut,
  Shield,
  Sun,
  Moon,
  Menu,
  X,
  KeyRound,
  Layers,
} from "lucide-react";
import { useAuth } from "@/shared/auth/provider";
import { useTheme } from "@/shared/theme/provider";
import { cn } from "@/shared/lib/styles";
import type { LucideIcon } from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/clientes", label: "Clientes", icon: Users },
  { href: "/webhooks", label: "Webhooks", icon: Webhook },
  { href: "/pipefy", label: "Cards Pipefy", icon: Layers },
  { href: "/configuracoes", label: "Alterar Senha", icon: KeyRound },
];

const ACTIVE_STYLES = "bg-accent/10 text-accent shadow-sm";
const INACTIVE_STYLES = "text-content-secondary hover:text-content hover:bg-surface-hover";
const NAV_LINK_BASE = "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200";

function NavLink({
  href,
  label,
  icon: Icon,
  isActive,
  onClick,
}: NavItem & { isActive: boolean; onClick?: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(NAV_LINK_BASE, isActive ? ACTIVE_STYLES : INACTIVE_STYLES)}
    >
      <Icon className="w-5 h-5 shrink-0" />
      <span className="truncate">{label}</span>
    </Link>
  );
}

function UserInfo({ name, role }: { name: string; role: string }) {
  return (
    <div className="flex items-center gap-3 px-3 py-2">
      <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shrink-0">
        <Shield className="w-4 h-4 text-white" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-content truncate">{name}</p>
        <p className="text-xs text-content-tertiary truncate">{role.toUpperCase()}</p>
      </div>
    </div>
  );
}

function SidebarAction({
  icon: Icon,
  label,
  hoverClass,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  hoverClass: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-content-secondary transition-all duration-200 w-full",
        hoverClass
      )}
    >
      <Icon className="w-4 h-4 shrink-0" />
      <span className="truncate">{label}</span>
    </button>
  );
}

function SidebarBrand() {
  return (
    <div className="p-6 border-b border-border-subtle">
      <h1 className="text-xl font-bold text-accent">PipeBridge</h1>
      <p className="text-xs text-content-tertiary mt-1">Client Management System</p>
    </div>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = useCallback(() => setMobileOpen(false), []);
  const openMobile = useCallback(() => setMobileOpen(true), []);

  const themeLabel = theme === "dark" ? "Modo Claro" : "Modo Escuro";
  const ThemeIcon = theme === "dark" ? Sun : Moon;

  return (
    <>
      <button
        onClick={openMobile}
        className="fixed top-4 left-4 z-50 p-2 rounded-xl bg-surface-card backdrop-blur-xl border border-border-subtle text-content lg:hidden"
        aria-label="Abrir menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={closeMobile}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 h-screen w-64 bg-surface-card backdrop-blur-xl border-r border-border-subtle flex flex-col z-50 transition-transform duration-300 lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <button
          onClick={closeMobile}
          className="absolute top-4 right-4 p-1 rounded-lg text-content-secondary hover:text-content lg:hidden"
          aria-label="Fechar menu"
        >
          <X className="w-5 h-5" />
        </button>

        <SidebarBrand />

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.href}
              {...item}
              isActive={pathname === item.href}
              onClick={closeMobile}
            />
          ))}
        </nav>

        <div className="p-4 border-t border-border-subtle space-y-2">
          <SidebarAction
            icon={ThemeIcon}
            label={themeLabel}
            hoverClass="hover:text-amber-500 hover:bg-amber-500/10"
            onClick={toggleTheme}
          />
          {user && <UserInfo name={user.name} role={user.role} />}
          <SidebarAction
            icon={LogOut}
            label="Sair"
            hoverClass="hover:text-red-400 hover:bg-red-500/10"
            onClick={logout}
          />
        </div>
      </aside>
    </>
  );
}
