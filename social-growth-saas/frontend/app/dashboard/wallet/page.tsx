"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Elements, useElements, useStripe, CardElement } from "@stripe/react-stripe-js";
import { loadStripe, StripeCardElementOptions } from "@stripe/stripe-js";
import { useAuth } from "../../../components/auth/AuthProvider";
import { api } from "../../../lib/api";
import { DashboardShell } from "../../../components/dashboard/DashboardShell";

type WalletResponse = {
  wallet: {
    balance: number;
    currency: string;
  };
  transactions: {
    _id: string;
    amount: number;
    type: "credit" | "debit";
    status: "pending" | "completed" | "failed";
    createdAt: string;
    description?: string;
  }[];
};

type TopUpResponse = {
  clientSecret: string;
  transactionId: string;
};

const stripePromise =
  typeof window !== "undefined" && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
    : null;

const cardStyle: StripeCardElementOptions = {
  style: {
    base: {
      color: "#e5e7eb",
      fontSize: "14px",
      "::placeholder": {
        color: "#64748b"
      }
    },
    invalid: {
      color: "#f87171"
    }
  }
};

function WalletInner() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<WalletResponse | null>(null);
  const [amount, setAmount] = useState(25);
  const [loadingData, setLoadingData] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    api
      .get<WalletResponse>("/wallet")
      .then(setData)
      .catch(() => {})
      .finally(() => setLoadingData(false));
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const topup = await api.post<TopUpResponse>("/wallet/topup", { amount });
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error("Payment element not found");

      const result = await stripe.confirmCardPayment(topup.clientSecret, {
        payment_method: {
          card: cardElement
        }
      });

      if (result.error) {
        throw new Error(result.error.message || "Payment failed");
      }

      setSuccess("Wallet topped up successfully.");
      // Refresh wallet
      const refreshed = await api.get<WalletResponse>("/wallet");
      setData(refreshed);
    } catch (err) {
      setError((err as Error).message || "Failed to top up wallet");
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <DashboardShell>
      <div className="space-y-5">
        <div>
          <h1 className="text-lg font-semibold text-slate-50 sm:text-xl">Wallet</h1>
          <p className="text-sm text-slate-400">
            Manage your balance and review recent transactions.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-[minmax(0,1.1fr),minmax(0,1.1fr)]">
          <div className="glass space-y-4 border border-slate-800/80 p-4">
            <p className="text-xs text-slate-400">Current balance</p>
            <p className="text-3xl font-semibold text-sky-300">
              {data ? `$${data.wallet.balance.toFixed(2)}` : "$0.00"}
            </p>
            <p className="text-[11px] text-slate-500">
              Currency: {data?.wallet.currency || "USD"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="glass space-y-4 border border-slate-800/80 p-4">
            <h2 className="text-sm font-semibold text-slate-100">Top up wallet</h2>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Amount (USD)</label>
              <input
                type="number"
                min={5}
                value={amount}
                onChange={(e) => setAmount(parseInt(e.target.value || "0", 10))}
                className="w-full rounded-xl border border-slate-700/80 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 outline-none focus:border-blue-500"
              />
              <p className="text-[11px] text-slate-500">Minimum top up is $5.</p>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Card details</label>
              <div className="rounded-xl border border-slate-700/80 bg-slate-950/70 px-3 py-2">
                <CardElement options={cardStyle} />
              </div>
            </div>
            {error && <p className="text-xs text-red-400">{error}</p>}
            {success && <p className="text-xs text-emerald-400">{success}</p>}
            <button
              type="submit"
              disabled={submitting || !stripe}
              className="btn-primary w-full justify-center"
            >
              {submitting ? "Processing..." : "Top up wallet"}
            </button>
          </form>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-200">Recent transactions</h2>
          <div className="glass border border-slate-800/80">
            <div className="grid grid-cols-4 gap-2 border-b border-slate-800/80 px-4 py-2 text-[11px] text-slate-400">
              <span>Type</span>
              <span>Amount</span>
              <span>Status</span>
              <span>Date</span>
            </div>
            {!loadingData &&
              data?.transactions.map((tx) => (
                <div
                  key={tx._id}
                  className="grid grid-cols-4 gap-2 border-t border-slate-900/60 px-4 py-2 text-[11px] text-slate-300"
                >
                  <span className="capitalize">{tx.type}</span>
                  <span>${tx.amount.toFixed(2)}</span>
                  <span className="capitalize">{tx.status}</span>
                  <span>{new Date(tx.createdAt).toLocaleDateString()}</span>
                </div>
              ))}
            {!loadingData && (!data || data.transactions.length === 0) && (
              <p className="px-4 py-3 text-xs text-slate-400">
                No transactions yet. Top up your wallet or place an order to see activity here.
              </p>
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

export default function WalletPage() {
  if (!stripePromise) {
    return (
      <DashboardShell>
        <p className="text-sm text-red-400">
          Stripe is not configured. Set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to enable payments.
        </p>
      </DashboardShell>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <WalletInner />
    </Elements>
  );
}

