"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
  title: string;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function Modal({ title, open, onClose, children }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-(--backdrop) sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="sheet-in max-h-[88vh] w-full overflow-y-auto border-t-2 border-[#0b2545] bg-white p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:max-w-md sm:border-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-extrabold tracking-tight text-ink-primary">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="-m-2 p-2 text-ink-muted hover:text-ink-primary"
          >
            <X size={16} aria-hidden />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
