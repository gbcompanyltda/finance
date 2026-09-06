"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Wallet, Receipt, PiggyBank, LogOut } from "lucide-react";

const NAV = [
  { href: "/", label: "Painel", icon: LayoutDashboard },
  { href: "/renda", label: "Renda", icon: Wallet },
  { href: "/despesas", label: "Despesas", icon: Receipt },
  { href: "/economia", label: "Economia", icon: PiggyBank },
];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.replace(/\/$/, "") === href;
}

export function Sidebar({ onSignOut }: { onSignOut?: () => void }) {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-56 shrink-0 flex-col self-start overflow-y-auto border-r border-border bg-surface p-4 md:flex">
      <div className="mb-6 flex items-center gap-2 px-2">
        <Wallet className="size-5 text-series-1" aria-hidden />
        <span className="text-sm font-semibold text-ink-primary">
          Minhas Finanças
        </span>
      </div>
      <nav className="flex flex-col gap-1">
        {NAV.map((item) => {
          const active = isActive(pathname, item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-series-1/10 text-series-1"
                  : "text-ink-secondary hover:bg-page hover:text-ink-primary"
              }`}
            >
              <Icon className="size-4" aria-hidden />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <button
        onClick={onSignOut}
        className="mt-auto flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-ink-secondary transition-colors hover:bg-page hover:text-critical"
      >
        <LogOut className="size-4" aria-hidden />
        Sair
      </button>
    </aside>
  );
}
