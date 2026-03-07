"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "../auth/AuthProvider";

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" }
];

export function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 lg:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-500 via-sky-500 to-indigo-500 shadow-lg shadow-blue-500/40">
            <span className="text-sm font-bold text-slate-950">NG</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-100 tracking-wide">NovaGrowth</p>
            <p className="text-[11px] text-slate-400">Social Growth Platform</p>
          </div>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link key={link.href} href={link.href} className="relative nav-link">
                {link.label}
                {active && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-1 left-0 h-[2px] w-full rounded-full bg-gradient-to-r from-blue-500 to-sky-400"
                  />
                )}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link href="/dashboard" className="btn-outline text-xs">
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="rounded-full border border-slate-700/80 px-3 py-1.5 text-xs text-slate-300 transition hover:border-red-500/70 hover:text-red-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hidden text-xs text-slate-300/90 hover:text-white sm:inline">
                Log in
              </Link>
              <Link href="/register" className="btn-primary text-xs">
                Get started
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

