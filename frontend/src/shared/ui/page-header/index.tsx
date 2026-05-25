"use client";

import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description: string;
  actions?: ReactNode;
}

export default function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
      <div className="min-w-0">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-content truncate">
          {title}
        </h1>
        <p className="text-content-secondary text-sm mt-1">{description}</p>
      </div>
      {actions && (
        <div className="flex gap-2 w-full sm:w-auto shrink-0">{actions}</div>
      )}
    </div>
  );
}
