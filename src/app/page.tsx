"use client";

import { useFinanceStore } from "@/lib/store";
import {
  computeDailySpend,
  computePeriodProgress,
  computeTotals,
  groupByTag,
} from "@/lib/selectors";
import { StatTile } from "@/components/ui/StatTile";
import { Meter } from "@/components/ui/Meter";
import { HorizontalBarChart } from "@/components/ui/HorizontalBarChart";
import { DailyTrendChart } from "@/components/ui/DailyTrendChart";
import { daysInMonth, formatCurrency } from "@/lib/format";

export default function DashboardPage() {
  const currentMonthId = useFinanceStore((s) => s.currentMonthId);
  const month = useFinanceStore((s) => s.months[s.currentMonthId]);

  if (!month) return null;

  const totals = computeTotals(month);
  const periods = computePeriodProgress(month);
  const tagBreakdown = groupByTag(month);
  const daily = computeDailySpend(month, daysInMonth(currentMonthId));

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile label="Renda total" value={totals.incomeTotal} accent="series-1" />
        <StatTile label="Despesas totais" value={totals.expenseTotal} accent="series-2" />
        <StatTile
          label="Saldo do mês"
          value={totals.balance}
          accent={totals.balance >= 0 ? "good" : "critical"}
        />
        <StatTile label="Economia guardada" value={totals.savingsTotal} accent="series-3" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-border bg-surface p-4">
          <h2 className="mb-3 text-sm font-semibold text-ink-primary">
            Despesas: fixas x variáveis
          </h2>
          <HorizontalBarChart
            data={[
              { label: "Fixas", value: totals.fixedTotal, colorVar: "var(--series-4)" },
              { label: "Variáveis (mercado + extra)", value: totals.variableTotal, colorVar: "var(--series-2)" },
            ]}
          />
        </section>

        <section className="rounded-xl border border-border bg-surface p-4">
          <h2 className="mb-3 text-sm font-semibold text-ink-primary">
            Saldo em dinheiro por conta
          </h2>
          <HorizontalBarChart
            data={month.accounts.map((a, i) => ({
              label: a.name,
              value: a.balance,
              colorVar: `var(--series-${(i % 8) + 1})`,
            }))}
          />
          <p className="mt-3 text-sm text-ink-secondary">
            Total: <span className="font-medium text-ink-primary">{formatCurrency(totals.accountsTotal)}</span>
          </p>
        </section>
      </div>

      <section className="rounded-xl border border-border bg-surface p-4">
        <h2 className="mb-4 text-sm font-semibold text-ink-primary">
          Limite de gastos variáveis por período
        </h2>
        <div className="flex flex-col gap-4">
          {periods.map((p) => (
            <Meter
              key={p.untilDay}
              label={`Dias ${p.fromDay} a ${p.untilDay}`}
              value={p.spent}
              max={p.limit}
            />
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-border bg-surface p-4">
        <h2 className="mb-3 text-sm font-semibold text-ink-primary">
          Gastos variáveis por dia
        </h2>
        <DailyTrendChart data={daily} />
      </section>

      {tagBreakdown.length > 0 && (
        <section className="rounded-xl border border-border bg-surface p-4">
          <h2 className="mb-3 text-sm font-semibold text-ink-primary">
            Gastos variáveis por categoria
          </h2>
          <HorizontalBarChart
            data={tagBreakdown.map((t, i) => ({
              label: t.tag,
              value: t.total,
              colorVar: `var(--series-${(i % 8) + 1})`,
            }))}
          />
        </section>
      )}
    </div>
  );
}
