interface BadgeProps {
  label: string;
  variant?: "success" | "warning" | "info" | "danger";
}

const BADGE_STYLES = {
  success: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  warning: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  info: "bg-sky-500/20 text-sky-400 border-sky-500/30",
  danger: "bg-red-500/20 text-red-400 border-red-500/30",
} as const;

export default function Badge({ label, variant = "info" }: BadgeProps) {
  return (
    <span
      className={`${BADGE_STYLES[variant]} inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border`}
    >
      {label}
    </span>
  );
}
