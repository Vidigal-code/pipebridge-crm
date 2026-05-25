import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`bg-surface-card backdrop-blur-xl border border-border-subtle rounded-2xl p-6 shadow-xl transition-colors duration-300 ${className}`}
    >
      {children}
    </div>
  );
}
