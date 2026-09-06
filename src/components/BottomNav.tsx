"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, List, Wallet, ChartColumn, User, type LucideIcon } from "lucide-react";

const NAV: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/", label: "Início", icon: House },
  { href: "/atividade", label: "Atividade", icon: List },
  { href: "/orcamento", label: "Orçamento", icon: Wallet },
  { href: "/analises", label: "Análises", icon: ChartColumn },
  { href: "/conta", label: "Conta", icon: User },
];

function isActive(pathname: string, href: string) {
  const path = pathname.replace(/\/$/, "") || "/";
  return href === "/" ? path === "/" : path === href;
}

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="sticky bottom-0 z-30 shrink-0 bg-white pb-[env(safe-area-inset-bottom)]"
      aria-label="Navegação principal"
    >
      <div className="rule" />
      <div className="flex items-stretch">
        {NAV.map((item) => {
          const active = isActive(pathname, item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`flex flex-1 flex-col items-center gap-[5px] px-0 pb-1 pt-[11px] ${
                active ? "bg-key-bg text-ink-primary" : "bg-white text-ink-faint"
              }`}
            >
              <Icon size={21} strokeWidth={2} aria-hidden />
              <span className="text-[9.5px] font-bold tracking-[0.02em]">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
