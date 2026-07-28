"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";
import { MonthSwitcher } from "./MonthSwitcher";
import { NewMonthModal } from "./NewMonthModal";
import { useFinanceStore } from "@/lib/store";
import { monthIdToLabel } from "@/lib/format";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [newMonthOpen, setNewMonthOpen] = useState(false);
  const currentMonthId = useFinanceStore((s) => s.currentMonthId);

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-2 border-b border-border bg-surface/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-surface/80 md:px-6">
          <div className="min-w-0">
            <p className="truncate text-xs font-medium uppercase tracking-wide text-ink-muted">
              {monthIdToLabel(currentMonthId)}
            </p>
            <h1 className="truncate text-base font-semibold text-ink-primary md:text-lg">
              Orçamento do mês
            </h1>
          </div>
          <MonthSwitcher onNewMonth={() => setNewMonthOpen(true)} />
        </header>

        <main className="flex-1 bg-page p-4 pb-24 md:p-6 md:pb-6">{children}</main>

        <BottomNav />
      </div>

      <NewMonthModal open={newMonthOpen} onClose={() => setNewMonthOpen(false)} />
    </div>
  );
}
