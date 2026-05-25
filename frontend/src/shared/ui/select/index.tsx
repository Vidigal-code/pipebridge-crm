import { SelectHTMLAttributes, forwardRef } from "react";
import { cn, FIELD_BASE, FIELD_ERROR_BORDER, LABEL_STYLE, ERROR_TEXT } from "@/shared/lib/styles";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

function ChevronIcon() {
  return (
    <svg
      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-content-tertiary"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      <label className={LABEL_STYLE}>{label}</label>
      <div className="relative">
        <select
          ref={ref}
          className={cn(FIELD_BASE, "appearance-none cursor-pointer pr-10", error && FIELD_ERROR_BORDER, className)}
          {...props}
        >
          {placeholder && (
            <option value="" className="text-content-tertiary">
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronIcon />
      </div>
      {error && <span className={ERROR_TEXT}>{error}</span>}
    </div>
  )
);

Select.displayName = "Select";

export default Select;
