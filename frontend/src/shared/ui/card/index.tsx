import { ReactNode } from "react";
import { cn, CARD_BASE } from "@/shared/lib/styles";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export default function Card({ children, className }: CardProps) {
  return (
    <div className={cn(CARD_BASE, "p-4 sm:p-6", className)}>
      {children}
    </div>
  );
}
