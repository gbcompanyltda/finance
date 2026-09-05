"use client";

import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";
import { MonthSwitcher } from "./MonthSwitcher";
import { NewMonthModal } from "./NewMonthModal";
import { LoginScreen } from "./LoginScreen";
import { useFinanceStore } from "@/lib/store";
import { useAuthStore } from "@/lib/authStore";
import { monthIdToLabel } from "@/lib/format";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [newMonthOpen, setNewMonthOpen] = useState(false);
  const currentMonthId = useFinanceStore((s) => s.currentMonthId);
  const ready = useFinanceStore((s) => s.ready);
  const loadForUser = useFinanceStore((s) => s.loadForUser);
  const resetFinance = useFinanceStore((s) => s.reset);
  const session = useAuthStore((s) => s.session);
  const authLoading = useAuthStore((s) => s.loading);
  const signOut = useAuthStore((s) => s.signOut);

  const userId = session?.user.id;
  useEffect(() => {
    if (userId) {
      loadForUser(userId);
    } else {
      resetFinance();
    }
  }, [userId, loadForUser, resetFinance]);

  if (authLoading) {
    return <div className="min-h-screen bg-page" />;
  }

  if (!session) {
    return <LoginScreen />;
  }

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-page text-sm text-ink-muted">
        Carregando…
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar onSignOut={signOut} />
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
          <div className="flex shrink-0 items-center gap-1.5">
            <MonthSwitcher onNewMonth={() => setNewMonthOpen(true)} />
            <button
              onClick={signOut}
              aria-label="Sair"
              title="Sair"
              className="rounded-md p-2 text-ink-muted hover:bg-page hover:text-critical md:hidden"
            >
              <LogOut size={18} aria-hidden />
            </button>
          </div>
        </header>

        <main className="flex-1 bg-page p-4 pb-24 md:p-6 md:pb-6">{children}</main>

        <BottomNav />
      </div>

      <NewMonthModal open={newMonthOpen} onClose={() => setNewMonthOpen(false)} />
    </div>
  );
}
