"use client";

import { useEffect } from "react";

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
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="modal-sheet max-h-[88vh] w-full overflow-y-auto rounded-t-2xl border-t border-border bg-surface p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-xl sm:max-w-md sm:rounded-xl sm:border"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="mx-auto mb-3 h-1.5 w-10 shrink-0 rounded-full bg-baseline sm:hidden"
          aria-hidden
        />
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-ink-primary">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="-m-2 rounded-md p-2 text-ink-muted hover:bg-page hover:text-ink-primary"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
