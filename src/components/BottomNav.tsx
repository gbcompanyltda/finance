"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Wallet, Receipt, PiggyBank } from "lucide-react";

const NAV = [
  { href: "/", label: "Painel", icon: LayoutDashboard },
  { href: "/renda", label: "Renda", icon: Wallet },
  { href: "/despesas", label: "Despesas", icon: Receipt },
  { href: "/economia", label: "Economia", icon: PiggyBank },
];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.replace(/\/$/, "") === href;
}

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 flex border-t border-border bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur supports-[backdrop-filter]:bg-surface/85 md:hidden"
      aria-label="Navegação principal"
    >
      {NAV.map((item) => {
        const active = isActive(pathname, item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium ${
              active ? "text-series-1" : "text-ink-muted"
            }`}
          >
            <Icon className="size-5" aria-hidden />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
