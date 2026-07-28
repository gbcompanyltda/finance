"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/", label: "Painel", icon: "📊" },
  { href: "/renda", label: "Renda", icon: "💰" },
  { href: "/despesas", label: "Despesas", icon: "🧾" },
  { href: "/economia", label: "Economia", icon: "🏦" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-56 shrink-0 flex-col border-r border-border bg-surface p-4 md:flex">
      <div className="mb-6 flex items-center gap-2 px-2">
        <span className="text-xl">💸</span>
        <span className="text-sm font-semibold text-ink-primary">
          Minhas Finanças
        </span>
      </div>
      <nav className="flex flex-col gap-1">
        {NAV.map((item) => {
          const active = pathname === item.href;
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
              <span aria-hidden>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
