export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export const FIELD_BASE = [
  "w-full px-4 py-2.5",
  "bg-surface-input border border-border-subtle rounded-xl",
  "text-content placeholder-content-tertiary",
  "transition-all duration-200",
  "focus:outline-none focus:ring-2 focus:ring-accent-glow focus:border-border-focus",
].join(" ");

export const FIELD_ERROR_BORDER = "border-red-500 focus:border-red-500 focus:ring-red-500/25";

export const LABEL_STYLE = "text-sm font-medium text-content-secondary";

export const ERROR_TEXT = "text-xs text-red-400";

export const CARD_BASE = [
  "bg-surface-card",
  "backdrop-blur-xl",
  "border border-border-subtle",
  "rounded-2xl",
  "shadow-xl",
  "transition-colors duration-300",
].join(" ");
