"use client";

import { useCallback } from "react";
import { AlertTriangle } from "lucide-react";
import { cn, CARD_BASE } from "@/shared/lib/styles";
import Button from "@/shared/ui/button";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  loading = false,
}: ConfirmDialogProps) {
  const handleOverlay = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose]
  );

  if (!isOpen) return null;

  return (
    <div
      onClick={handleOverlay}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
    >
      <div className={cn(CARD_BASE, "w-full max-w-sm p-6 animate-in text-center")}>
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 rounded-full bg-red-500/15 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-500" />
          </div>
        </div>
        <h3 className="text-base font-semibold text-content mb-2">{title}</h3>
        <p className="text-sm text-content-secondary mb-6">{message}</p>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onClose} className="flex-1" disabled={loading}>
            {cancelLabel}
          </Button>
          <Button variant="danger" onClick={onConfirm} loading={loading} className="flex-1">
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
