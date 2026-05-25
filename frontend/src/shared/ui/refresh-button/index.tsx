"use client";

import { RefreshCw } from "lucide-react";
import { cn } from "@/shared/lib/styles";

interface RefreshButtonProps {
  onClick: () => void;
  isRefreshing: boolean;
  label?: string;
}

const BASE_STYLES = [
  "inline-flex items-center justify-center gap-2",
  "px-4 py-2.5 rounded-xl text-sm font-semibold",
  "bg-accent/10 text-accent",
  "hover:bg-accent/20 active:scale-95",
  "transition-all duration-200",
  "disabled:opacity-50 disabled:cursor-not-allowed",
  "w-full sm:w-auto",
].join(" ");

const SPIN_CLASS = "animate-spin";

export default function RefreshButton({
  onClick,
  isRefreshing,
  label = "Atualizar",
}: RefreshButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isRefreshing}
      className={BASE_STYLES}
    >
      <RefreshCw className={cn("w-4 h-4 shrink-0", isRefreshing && SPIN_CLASS)} />
      <span className="truncate">{isRefreshing ? "Atualizando..." : label}</span>
    </button>
  );
}
