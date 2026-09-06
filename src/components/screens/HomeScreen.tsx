"use client";

import Link from "next/link";
import { useFinanceStore } from "@/lib/store";
import {
  balanceSparkline,
  buildActivity,
  computeTotals,
} from "@/lib/selectors";
import { Sparkline } from "@/components/ui/Sparkline";
import { TransactionRow } from "@/components/ui/TransactionRow";
import { Bar } from "@/components/ui/kit";
import {
  daysInMonth,
  formatCurrency,
  formatRounded,
  monthIdToLabel,
} from "@/lib/format";

export function HomeScreen() {
  const currentMonthId = useFinanceStore((s) => s.currentMonthId);
  const months = useFinanceStore((s) => s.months);
  const month = months[currentMonthId];

  if (!month) return null;

  const totals = computeTotals(month);
  const prevId = Object.keys(months)
    .filter((id) => id < currentMonthId)
    .sort()
    .at(-1);
  const prevBalance = prevId ? computeTotals(months[prevId]).balance : null;
  const changePct =
    prevBalance && prevBalance !== 0
      ? ((totals.balance - prevBalance) / Math.abs(prevBalance)) * 100
      : null;

  const monthBudget = Math.max(0, ...month.spendingLimits.map((l) => l.limit));
  const spent = totals.variableTotal;
  const usedPct = monthBudget > 0 ? Math.min(100, (spent / monthBudget) * 100) : 0;

  const spark = balanceSparkline(
    month,
    daysInMonth(currentMonthId),
    totals.balance
  );

  const recent = buildActivity(month).slice(0, 3);
  const monthLabel = monthIdToLabel(currentMonthId).split(" ")[0];

  return (
    <div className="pb-4">
      <section className="px-5 pb-5 pt-6">
        <p className="kicker">Saldo</p>
        <p className="mt-3 text-[clamp(32px,11vw,50px)] font-extrabold leading-none tracking-[-0.055em] text-ink-primary">
          {formatCurrency(totals.balance)}
        </p>
        {changePct !== null && (
          <div className="mt-3 flex items-center gap-2">
            <span className="bg-[#0b2545] px-[7px] py-[3px] text-[11px] font-bold leading-tight text-white">
              {changePct >= 0 ? "+" : "−"}
              {Math.abs(changePct).toFixed(1)}%
            </span>
            <span className="text-xs text-ink-secondary">vs. mês anterior</span>
          </div>
        )}
        <div className="mt-[18px]">
          <Sparkline data={spark} />
        </div>
      </section>

      <div className="rule-soft" />

      <section className="px-5 pb-2 pt-5">
        <p className="kicker mb-1.5">Contas</p>
      </section>
      {month.accounts.length === 0 ? (
        <p className="px-5 pb-4 text-sm text-ink-secondary">Nenhuma conta cadastrada.</p>
      ) : (
        month.accounts.map((a) => (
          <div
            key={a.id}
            className="flex items-center justify-between border-b border-border px-5 py-[14px]"
          >
            <span className="text-sm font-semibold text-ink-primary">{a.name}</span>
            <span className="text-[15px] font-bold tracking-tight text-ink-primary tabular-nums">
              {formatCurrency(a.balance)}
            </span>
          </div>
        ))
      )}

      <section className="px-5 pb-5 pt-6">
        <div className="flex items-baseline justify-between">
          <p className="kicker">Gastos de {monthLabel}</p>
          <p className="text-[11px] font-bold text-accent">
            {Math.round(usedPct)}% usado
          </p>
        </div>
        <div className="mt-3.5 flex items-end justify-between">
          <p className="text-[28px] font-extrabold leading-none tracking-[-0.04em] text-ink-primary">
            {formatRounded(spent)}
          </p>
          <p className="text-xs text-ink-secondary">de {formatRounded(monthBudget)}</p>
        </div>
        <div className="mt-3">
          <Bar pct={usedPct} color="#0b2545" height={10} />
        </div>
      </section>

      <div className="rule-soft" />

      <section className="flex items-baseline justify-between px-5 pb-2 pt-5">
        <p className="kicker">Recentes</p>
        <Link href="/atividade" className="text-[11px] font-bold text-accent">
          Ver tudo
        </Link>
      </section>
      {recent.map((item) => (
        <TransactionRow key={`${item.source}-${item.id}`} item={item} showDate />
      ))}
    </div>
  );
}
