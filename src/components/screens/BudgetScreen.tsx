"use client";

import { useFinanceStore } from "@/lib/store";
import { computePeriodProgress, computeTotals, groupByTag } from "@/lib/selectors";
import { Bar } from "@/components/ui/kit";
import { tagColor } from "@/lib/categories";
import {
  daysInMonth,
  formatCurrency,
  formatRounded,
  monthIdToLabel,
  todayISO,
  todayMonthId,
} from "@/lib/format";

export function BudgetScreen() {
  const currentMonthId = useFinanceStore((s) => s.currentMonthId);
  const month = useFinanceStore((s) => s.months[s.currentMonthId]);

  if (!month) return null;

  const totals = computeTotals(month);
  const monthBudget = Math.max(0, ...month.spendingLimits.map((l) => l.limit));
  const left = monthBudget - totals.variableTotal;

  const totalDays = daysInMonth(currentMonthId);
  const isCurrent = currentMonthId === todayMonthId();
  const todayDay = Number(todayISO().split("-")[2]);
  const daysLeft = isCurrent ? Math.max(1, totalDays - todayDay) : totalDays;
  const perDay = left > 0 ? left / daysLeft : 0;

  const periods = computePeriodProgress(month);
  const byTag = groupByTag(month);
  const tagMax = Math.max(1, ...byTag.map((t) => t.total));

  const monthLabel = monthIdToLabel(currentMonthId).split(" ")[0];

  return (
    <div className="pb-4">
      <section className="px-5 pb-[18px] pt-[22px]">
        <p className="kicker">Falta gastar · {monthLabel}</p>
        <p className="mt-3 text-[clamp(30px,10vw,46px)] font-extrabold leading-none tracking-[-0.055em] text-ink-primary">
          {formatCurrency(Math.max(0, left))}
        </p>
        <p className="mt-2 text-xs text-ink-secondary">
          {daysLeft} {daysLeft === 1 ? "dia restante" : "dias restantes"} no período ·{" "}
          {formatRounded(perDay)} por dia
        </p>
      </section>

      <div className="rule" />

      <p className="kicker px-5 pb-1 pt-4">Por período (gasto variável)</p>
      {periods.map((p) => {
        const pct = p.limit > 0 ? (p.spent / p.limit) * 100 : 0;
        const alert = pct > 90;
        return (
          <div key={p.untilDay} className="border-b border-border px-5 py-4">
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-semibold text-ink-primary">
                Dias {p.fromDay} a {p.untilDay}
              </span>
              <span className="text-xs text-ink-secondary">
                {formatRounded(p.spent)} de {formatRounded(p.limit)}
              </span>
            </div>
            <div className="mt-2.5">
              <Bar pct={pct} color={alert ? "#2a78d6" : "#0b2545"} />
            </div>
          </div>
        );
      })}

      {byTag.length > 0 && (
        <>
          <div className="rule-soft mt-2" />
          <p className="kicker px-5 pb-1 pt-4">Por categoria</p>
          {byTag.map((t) => (
            <div key={t.tag} className="border-b border-border px-5 py-4">
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-semibold text-ink-primary">{t.tag}</span>
                <span className="text-xs text-ink-secondary">{formatRounded(t.total)}</span>
              </div>
              <div className="mt-2.5">
                <Bar pct={(t.total / tagMax) * 100} color={tagColor(t.tag)} />
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
