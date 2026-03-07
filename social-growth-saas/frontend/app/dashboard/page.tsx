"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../components/auth/AuthProvider";
import { api } from "../../lib/api";
import { DashboardShell } from "../../components/dashboard/DashboardShell";

type Order = {
  _id: string;
  status: string;
  price: number;
  createdAt: string;
  service?: {
    name: string;
    platform: string;
  };
};

type WalletResponse = {
  wallet: {
    balance: number;
    currency: string;
  };
};

export default function DashboardPage() {
  const { user, loading, token } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [wallet, setWallet] = useState<WalletResponse["wallet"] | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!token) return;
    api
      .get<Order[]>("/orders")
      .then(setOrders)
      .catch(() => {});
    api
      .get<WalletResponse>("/wallet")
      .then((data) => setWallet(data.wallet))
      .catch(() => {});
  }, [token]);

  if (!user) {
    return null;
  }

  return (
    <DashboardShell>
      <div className="space-y-5">
        <div>
          <h1 className="text-lg font-semibold text-slate-50 sm:text-xl">Dashboard</h1>
          <p className="text-sm text-slate-400">
            Track your latest orders, wallet balance and activity.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="glass border border-slate-800/80 p-4">
            <p className="text-xs text-slate-400">Wallet balance</p>
            <p className="mt-2 text-2xl font-semibold text-sky-300">
              {wallet ? `$${wallet.balance.toFixed(2)}` : "$0.00"}
            </p>
            <p className="mt-1 text-[11px] text-slate-500">
              {wallet?.currency || "USD"} across all platforms
            </p>
          </div>
          <div className="glass border border-slate-800/80 p-4">
            <p className="text-xs text-slate-400">Active orders</p>
            <p className="mt-2 text-2xl font-semibold text-slate-100">
              {orders.filter((o) => o.status === "pending" || o.status === "processing").length}
            </p>
            <p className="mt-1 text-[11px] text-slate-500">Pending and processing</p>
          </div>
          <div className="glass border border-slate-800/80 p-4">
            <p className="text-xs text-slate-400">Completed orders</p>
            <p className="mt-2 text-2xl font-semibold text-emerald-300">
              {orders.filter((o) => o.status === "completed").length}
            </p>
            <p className="mt-1 text-[11px] text-slate-500">All time</p>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-200">Recent orders</h2>
          <div className="glass border border-slate-800/80">
            <div className="grid grid-cols-4 gap-2 border-b border-slate-800/80 px-4 py-2 text-[11px] text-slate-400">
              <span>Service</span>
              <span>Status</span>
              <span>Price</span>
              <span>Date</span>
            </div>
            {orders.slice(0, 6).map((order) => (
              <div
                key={order._id}
                className="grid grid-cols-4 gap-2 border-t border-slate-900/60 px-4 py-2 text-[11px] text-slate-300"
              >
                <span>
                  {order.service?.name ?? "Custom service"}
                  <span className="ml-1 text-slate-500">
                    ({order.service?.platform ?? "multi"})
                  </span>
                </span>
                <span className="capitalize">{order.status}</span>
                <span>${order.price.toFixed(2)}</span>
                <span>{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
            ))}
            {orders.length === 0 && (
              <p className="px-4 py-3 text-xs text-slate-400">
                You don&apos;t have any orders yet. Create your first order from the{" "}
                <span className="text-sky-400">New order</span> tab.
              </p>
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

