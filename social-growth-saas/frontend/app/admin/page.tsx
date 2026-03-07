"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../components/auth/AuthProvider";
import { api } from "../../lib/api";
import { DashboardShell } from "../../components/dashboard/DashboardShell";

type Overview = {
  usersCount: number;
  ordersCount: number;
  servicesCount: number;
  totalRevenue: number;
};

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [overview, setOverview] = useState<Overview | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/login");
      } else if (user.role !== "admin") {
        router.replace("/dashboard");
      }
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user || user.role !== "admin") return;
    api
      .get<Overview>("/admin/overview")
      .then(setOverview)
      .catch((err) => setError(err.message || "Failed to load admin metrics"));
  }, [user]);

  if (!user || user.role !== "admin") return null;

  return (
    <DashboardShell>
      <div className="space-y-5">
        <div>
          <h1 className="text-lg font-semibold text-slate-50 sm:text-xl">Admin dashboard</h1>
          <p className="text-sm text-slate-400">
            High‑level overview of users, orders, services and revenue.
          </p>
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <div className="grid gap-4 md:grid-cols-4">
          <div className="glass border border-slate-800/80 p-4">
            <p className="text-xs text-slate-400">Users</p>
            <p className="mt-2 text-2xl font-semibold text-slate-100">
              {overview ? overview.usersCount : "-"}
            </p>
          </div>
          <div className="glass border border-slate-800/80 p-4">
            <p className="text-xs text-slate-400">Orders</p>
            <p className="mt-2 text-2xl font-semibold text-slate-100">
              {overview ? overview.ordersCount : "-"}
            </p>
          </div>
          <div className="glass border border-slate-800/80 p-4">
            <p className="text-xs text-slate-400">Active services</p>
            <p className="mt-2 text-2xl font-semibold text-slate-100">
              {overview ? overview.servicesCount : "-"}
            </p>
          </div>
          <div className="glass border border-slate-800/80 p-4">
            <p className="text-xs text-slate-400">Total revenue</p>
            <p className="mt-2 text-2xl font-semibold text-emerald-300">
              {overview ? `$${overview.totalRevenue.toFixed(2)}` : "-"}
            </p>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

