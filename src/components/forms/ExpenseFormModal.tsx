"use client";

import { useState } from "react";
import { Modal } from "../ui/Modal";
import { inputClass, labelClass, primaryButtonClass, ghostButtonClass } from "../ui/formStyles";
import type { ExpenseKind, ExpenseTransaction } from "@/lib/types";
import { todayISO } from "@/lib/format";

interface ExpenseFormModalProps {
  onClose: () => void;
  onSave: (item: Omit<ExpenseTransaction, "id">, id?: string) => void;
  onDelete?: () => void;
  initial?: ExpenseTransaction | null;
  defaultKind?: ExpenseKind;
}

const TAG_SUGGESTIONS = ["mercado", "feira", "extra", "presente", "saúde", "lazer", "transporte"];

export function ExpenseFormModal({
  onClose,
  onSave,
  onDelete,
  initial,
  defaultKind = "variavel",
}: ExpenseFormModalProps) {
  const [description, setDescription] = useState(initial?.description ?? "");
  const [value, setValue] = useState(initial ? String(initial.value) : "");
  const [date, setDate] = useState(initial?.date ?? todayISO());
  const [kind, setKind] = useState<ExpenseKind>(initial?.kind ?? defaultKind);
  const [tag, setTag] = useState(initial?.tag ?? "");
  const [note, setNote] = useState(initial?.note ?? "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const numeric = Number(value.replace(",", "."));
    if (!description.trim() || Number.isNaN(numeric)) return;
    onSave(
      {
        description: description.trim(),
        value: numeric,
        date,
        kind,
        tag: kind === "variavel" ? tag.trim() || undefined : undefined,
        note: note.trim() || undefined,
      },
      initial?.id
    );
    onClose();
  }

  return (
    <Modal title={initial ? "Editar despesa" : "Nova despesa"} open onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label className={labelClass}>
          Descrição
          <input
            className={inputClass}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ex: Aluguel, mercado, presente..."
            required
            autoFocus
          />
        </label>
        <div className="flex gap-3">
          <label className={`${labelClass} flex-1`}>
            Valor (R$)
            <input
              className={inputClass}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              inputMode="decimal"
              placeholder="0,00"
              required
            />
          </label>
          <label className={`${labelClass} flex-1`}>
            Data
            <input
              type="date"
              className={inputClass}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </label>
        </div>

        <div className={labelClass}>
          Tipo
          <div className="mt-1 flex gap-2">
            <button
              type="button"
              onClick={() => setKind("fixo")}
              className={`flex-1 border px-3 py-2 text-sm font-bold ${
                kind === "fixo"
                  ? "border-[#0b2545] bg-[#0b2545] text-white"
                  : "border-chip-border text-ink-secondary"
              }`}
            >
              Fixa
            </button>
            <button
              type="button"
              onClick={() => setKind("variavel")}
              className={`flex-1 border px-3 py-2 text-sm font-bold ${
                kind === "variavel"
                  ? "border-[#0b2545] bg-[#0b2545] text-white"
                  : "border-chip-border text-ink-secondary"
              }`}
            >
              Variável / diária
            </button>
          </div>
        </div>

        {kind === "variavel" && (
          <label className={labelClass}>
            Categoria (opcional)
            <input
              className={inputClass}
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              placeholder="mercado, feira, presente..."
              list="tag-suggestions"
            />
            <datalist id="tag-suggestions">
              {TAG_SUGGESTIONS.map((t) => (
                <option key={t} value={t} />
              ))}
            </datalist>
          </label>
        )}

        <label className={labelClass}>
          Observação (opcional)
          <input
            className={inputClass}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </label>

        <div className="mt-2 flex items-center justify-between gap-2">
          {initial && onDelete ? (
            <button
              type="button"
              onClick={() => {
                onDelete();
                onClose();
              }}
              className="px-2 py-2 text-sm font-bold text-critical"
            >
              Excluir
            </button>
          ) : (
            <span />
          )}
          <div className="flex gap-2">
            <button type="button" onClick={onClose} className={ghostButtonClass}>
              Cancelar
            </button>
            <button type="submit" className={primaryButtonClass}>
              Salvar
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
