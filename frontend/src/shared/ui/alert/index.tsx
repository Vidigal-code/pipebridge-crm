import { cn } from "@/shared/lib/styles";

type AlertVariant = "error" | "success";

interface AlertProps {
  message: string;
  variant?: AlertVariant;
}

const VARIANT_STYLES: Record<AlertVariant, string> = {
  error: "bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400",
  success: "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400",
};

const BASE_STYLES = "p-3 rounded-xl border text-sm text-center";

export default function Alert({ message, variant = "error" }: AlertProps) {
  return (
    <div className={cn(BASE_STYLES, VARIANT_STYLES[variant])}>
      {message}
    </div>
  );
}
