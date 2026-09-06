"use client";

import { useCallback, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { Plus, RefreshCw } from "lucide-react";
import { BottomNav } from "./BottomNav";
import { LoginScreen } from "./LoginScreen";
import { LoadingScreen } from "./LoadingScreen";
import { NewTransactionSheet } from "./NewTransactionSheet";
import { WalletMark } from "./WalletMark";
import { Avatar, initialsFrom } from "./ui/kit";
import { useFinanceStore } from "@/lib/store";
import { useAuthStore } from "@/lib/authStore";
import { useUIStore } from "@/lib/uiStore";
import { usePullToRefresh } from "@/lib/usePullToRefresh";

const TITLES: Record<string, string> = {
  "/": "Início",
  "/atividade": "Atividade",
  "/orcamento": "Orçamento",
  "/analises": "Análises",
  "/conta": "Conta",
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const ready = useFinanceStore((s) => s.ready);
  const loadForUser = useFinanceStore((s) => s.loadForUser);
  const resetFinance = useFinanceStore((s) => s.reset);
  const session = useAuthStore((s) => s.session);
  const authLoading = useAuthStore((s) => s.loading);
  const addOpen = useUIStore((s) => s.addOpen);
  const openAdd = useUIStore((s) => s.openAdd);
  const closeAdd = useUIStore((s) => s.closeAdd);
  const toast = useUIStore((s) => s.toast);

  const mainRef = useRef<HTMLElement>(null);
  const handleRefresh = useCallback(() => {
    window.location.reload();
  }, []);
  const { pull, refreshing, threshold } = usePullToRefresh(
    mainRef,
    handleRefresh,
    !addOpen
  );

  const userId = session?.user.id;
  useEffect(() => {
    if (userId) loadForUser(userId);
    else resetFinance();
  }, [userId, loadForUser, resetFinance]);

  // Trocar de aba fecha a folha aberta.
  const path = pathname.replace(/\/$/, "") || "/";
  useEffect(() => {
    closeAdd();
  }, [path, closeAdd]);

  if (authLoading || (session && !ready)) return <LoadingScreen />;
  if (!session) return <LoginScreen />;

  const title = TITLES[path] ?? "Finance";
  const initials = initialsFrom(session.user.email);

  return (
    <div className="relative mx-auto flex h-[100dvh] w-full max-w-[430px] flex-col overflow-hidden bg-white">
      <header className="shrink-0 pt-[max(0.5rem,env(safe-area-inset-top))]">
        <div className="flex items-center justify-between px-5 pb-[14px] pt-2">
          <div className="flex items-center gap-[9px]">
            <WalletMark size={23} color="#0b2545" minimal />
            <span className="text-[17px] font-extrabold tracking-[-0.045em] text-ink-primary">
              {title}
            </span>
          </div>
          <Avatar initials={initials} size={30} />
        </div>
        <div className="rule" />
      </header>

      <main
        ref={mainRef}
        className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain"
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-10 flex justify-center"
          style={{
            transform: `translateY(${pull - 30}px)`,
            opacity: Math.min(1, pull / threshold),
          }}
          aria-hidden
        >
          <RefreshCw
            size={20}
            className={`mt-2 text-ink-secondary ${refreshing ? "animate-spin" : ""}`}
            style={{ transform: refreshing ? undefined : `rotate(${pull * 2.5}deg)` }}
          />
        </div>
        <div
          style={{
            transform: pull ? `translateY(${pull}px)` : undefined,
            transition: pull ? "none" : "transform 0.2s ease-out",
          }}
        >
          {children}
        </div>
      </main>

      <BottomNav />

      <button
        type="button"
        onClick={openAdd}
        aria-label="Nova transação"
        className="absolute right-[18px] bottom-[calc(66px+env(safe-area-inset-bottom))] z-40 flex size-[54px] items-center justify-center bg-accent text-white"
        style={{ boxShadow: "0 4px 14px rgba(11,37,69,.28)" }}
      >
        <Plus size={24} strokeWidth={2.4} aria-hidden />
      </button>

      {addOpen && <NewTransactionSheet />}

      {toast && (
        <div
          role="status"
          className="absolute inset-x-5 bottom-[96px] z-50 bg-[#0b2545] px-[15px] py-[13px] text-[12.5px] font-semibold text-white"
          style={{ boxShadow: "0 6px 20px rgba(11,37,69,.3)" }}
        >
          {toast}
        </div>
      )}
    </div>
  );
}
