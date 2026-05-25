import { InputHTMLAttributes, forwardRef } from "react";
import { cn, FIELD_BASE, FIELD_ERROR_BORDER, LABEL_STYLE, ERROR_TEXT } from "@/shared/lib/styles";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      <label className={LABEL_STYLE}>{label}</label>
      <input
        ref={ref}
        className={cn(FIELD_BASE, error && FIELD_ERROR_BORDER, className)}
        {...props}
      />
      {error && <span className={ERROR_TEXT}>{error}</span>}
    </div>
  )
);

Input.displayName = "Input";

export default Input;
