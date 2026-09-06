"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Delete } from "lucide-react";
import { useFinanceStore } from "@/lib/store";
import { useUIStore } from "@/lib/uiStore";
import { formatCurrency, todayISO } from "@/lib/format";

const DEFAULT_CATS = [
  "mercado",
  "feira",
  "extra",
  "lazer",
  "transporte",
  "saúde",
  "aluguel",
  "internet",
  "agua",
  "luz",
  "gas",
  "outros",
];
const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "⌫"];

function press(draft: string, key: string): string {
  if (key === "⌫") return draft.slice(0, -1);
  if (key === ".") {
    if (draft.includes(".")) return draft;
    return draft === "" ? "0." : `${draft}.`;
  }
  if (draft.includes(".") && draft.split(".")[1].length >= 2) return draft;
  if (draft.replace(".", "").length >= 7) return draft;
  return draft === "0" ? key : draft + key;
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function NewTransactionSheet() {
  const router = useRouter();
  const closeAdd = useUIStore((s) => s.closeAdd);
  const flash = useUIStore((s) => s.flash);
  const draftCat = useUIStore((s) => s.draftCat);
  const setDraftCat = useUIStore((s) => s.setDraftCat);
  const currentMonthId = useFinanceStore((s) => s.currentMonthId);
  const month = useFinanceStore((s) => s.months[s.currentMonthId]);
  const addExpense = useFinanceStore((s) => s.addExpense);

  const [draft, setDraft] = useState("");

  const categories = useMemo(() => {
    const seen = new Set<string>();
    const list: string[] = [];
    for (const cat of [
      ...DEFAULT_CATS,
      ...(month?.expenses ?? [])
        .filter((e) => e.kind === "variavel" && e.tag?.trim())
        .map((e) => e.tag!.trim()),
    ]) {
      const key = cat.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        list.push(cat);
      }
    }
    return list;
  }, [month]);

  const amount = parseFloat(draft);
  const valid = amount > 0;

  function close() {
    setDraft("");
    closeAdd();
  }

  function save() {
    if (!valid) {
      flash("Informe um valor primeiro.");
      return;
    }
    const tag = draftCat.toLowerCase();
    addExpense(currentMonthId, {
      description: capitalize(draftCat),
      value: Math.round(amount * 100) / 100,
      date: todayISO(),
      kind: "variavel",
      tag,
    });
    flash(`${formatCurrency(amount)} lançado em ${draftCat}.`);
    setDraft("");
    closeAdd();
    router.push("/");
  }

  return (
    <div
      className="absolute inset-0 z-50 flex flex-col justify-end bg-(--backdrop)"
      role="dialog"
      aria-modal="true"
      aria-label="Nova transação"
    >
      <button
        type="button"
        aria-label="Fechar"
        onClick={close}
        className="flex-1 min-h-[40px]"
      />
      <div className="sheet-in border-t-2 border-[#0b2545] bg-white px-5 pb-[max(1.875rem,env(safe-area-inset-bottom))] pt-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-baseline justify-between">
          <h2 className="text-lg font-extrabold tracking-tight text-ink-primary">
            Nova transação
          </h2>
          <button
            type="button"
            onClick={close}
            className="text-xs font-bold text-ink-secondary"
          >
            Cancelar
          </button>
        </div>

        <div className="mt-[18px] flex items-baseline gap-1.5 border-b-2 border-[#0b2545] pb-[14px]">
          <span className="text-[34px] font-extrabold leading-none text-(--save-disabled)">
            R$
          </span>
          <span className="text-[44px] font-extrabold leading-none tracking-tight text-ink-primary tabular-nums">
            {draft === "" ? "0" : draft}
          </span>
        </div>

        <p className="kicker mt-4">Categoria</p>
        
        {/* Adicionado max-h e overflow-y-auto para permitir rolagem no container de tags */}
        <div className="mt-2.5 flex flex-wrap gap-2 max-h-36 overflow-y-auto pr-1">
          {categories.map((cat) => {
            const active = cat.toLowerCase() === draftCat.toLowerCase();
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setDraftCat(cat)}
                aria-pressed={active}
                className={`border px-3 py-2 text-xs font-bold ${
                  active
                    ? "border-[#0b2545] bg-[#0b2545] text-white"
                    : "border-chip-border bg-white text-ink-primary"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <div className="mt-[18px] grid grid-cols-3 gap-2">
          {KEYS.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setDraft((d) => press(d, key))}
              aria-label={key === "⌫" ? "Apagar" : key}
              className="flex items-center justify-center bg-key-bg py-3.5 text-[19px] font-bold text-ink-primary"
            >
              {key === "⌫" ? <Delete size={19} aria-hidden /> : key}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={save}
          className={`mt-3.5 w-full px-4 py-[15px] text-left text-sm font-extrabold text-white ${
            valid ? "bg-accent" : "bg-(--save-disabled)"
          }`}
        >
          Salvar transação
        </button>
      </div>
    </div>
  );
}