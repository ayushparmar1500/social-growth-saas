"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { useAuth } from "../auth/AuthProvider";

const items = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/order", label: "New order" },
  { href: "/dashboard/wallet", label: "Wallet" }
];

export function DashboardShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();

  const isAdmin = user?.role === "admin";

  return (
    <div className="grid gap-6 md:grid-cols-[220px,1fr]">
      <aside className="glass h-full border border-slate-800/80 p-4">
        <div className="mb-4">
          <p className="text-xs text-slate-400">Signed in as</p>
          <p className="text-sm font-medium text-slate-100">{user?.name}</p>
          <p className="text-[11px] text-slate-500">{user?.email}</p>
        </div>
        <nav className="space-y-1 text-sm">
          {items.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs transition ${
                  active
                    ? "bg-blue-500/20 text-blue-100"
                    : "text-slate-300 hover:bg-slate-800/80 hover:text-slate-50"
                }`}
              >
                <span>{item.label}</span>
              </Link>
            );
          })}
          {isAdmin && (
            <Link
              href="/admin"
              className={`mt-3 flex items-center justify-between rounded-xl px-3 py-2 text-xs transition ${
                pathname.startsWith("/admin")
                  ? "bg-emerald-500/20 text-emerald-100"
                  : "text-emerald-300 hover:bg-slate-800/80 hover:text-emerald-100"
              }`}
            >
              <span>Admin dashboard</span>
            </Link>
          )}
        </nav>
      </aside>
      <section>{children}</section>
    </div>
  );
}

