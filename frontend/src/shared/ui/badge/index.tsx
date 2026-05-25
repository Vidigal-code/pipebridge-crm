import { cn } from "@/shared/lib/styles";

type BadgeVariant = "success" | "warning" | "info" | "danger";

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
}

const VARIANT_STYLES: Record<BadgeVariant, string> = {
  success: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  warning: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
  info: "bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30",
  danger: "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30",
};

const BASE_STYLES =
  "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border whitespace-nowrap";

export default function Badge({ label, variant = "info" }: BadgeProps) {
  return (
    <span className={cn(BASE_STYLES, VARIANT_STYLES[variant])}>
      {label}
    </span>
  );
}
