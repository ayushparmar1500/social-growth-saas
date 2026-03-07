"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../components/auth/AuthProvider";
import { api } from "../../../lib/api";
import { DashboardShell } from "../../../components/dashboard/DashboardShell";

type Service = {
  _id: string;
  name: string;
  platform: string;
  pricePerUnit: number;
  minQuantity: number;
  maxQuantity: number;
};

type OrderResponse = {
  _id: string;
};

export default function NewOrderPage() {
  const { user, loading, token } = useAuth();
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [serviceId, setServiceId] = useState("");
  const [quantity, setQuantity] = useState<number>(100);
  const [link, setLink] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [loadingServices, setLoadingServices] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!token) return;
    api
      .get<Service[]>("/services")
      .then((data) => {
        setServices(data);
        if (data[0]) {
          setServiceId(data[0]._id);
          setQuantity(data[0].minQuantity);
        }
      })
      .catch((err) => setError(err.message || "Failed to load services"))
      .finally(() => setLoadingServices(false));
  }, [token]);

  const currentService = services.find((s) => s._id === serviceId);
  const estimatedPrice =
    currentService && quantity
      ? (currentService.pricePerUnit * quantity).toFixed(4)
      : "0.0000";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!currentService) return;
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      const body = {
        serviceId,
        quantity,
        link,
        couponCode: couponCode || undefined
      };
      const data = await api.post<OrderResponse>("/orders", body);
      setSuccess(`Order ${data._id} created successfully.`);
      setLink("");
      setCouponCode("");
    } catch (err) {
      setError((err as Error).message || "Failed to create order");
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <DashboardShell>
      <div className="space-y-5">
        <div>
          <h1 className="text-lg font-semibold text-slate-50 sm:text-xl">New order</h1>
          <p className="text-sm text-slate-400">
            Choose a service, set quantity and link your profile or post.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="glass grid gap-6 border border-slate-800/80 p-5 md:grid-cols-[minmax(0,1.3fr),minmax(0,0.9fr)]"
        >
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Service</label>
              <select
                value={serviceId}
                onChange={(e) => {
                  const nextId = e.target.value;
                  setServiceId(nextId);
                  const svc = services.find((s) => s._id === nextId);
                  if (svc) setQuantity(svc.minQuantity);
                }}
                disabled={loadingServices}
                className="w-full rounded-xl border border-slate-700/80 bg-slate-950/70 px-3 py-2 text-xs text-slate-100 outline-none focus:border-blue-500"
              >
                {services.map((svc) => (
                  <option key={svc._id} value={svc._id}>
                    {svc.name} · {svc.platform}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Quantity</label>
              <input
                type="number"
                min={currentService?.minQuantity ?? 0}
                max={currentService?.maxQuantity ?? undefined}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value || "0", 10))}
                className="w-full rounded-xl border border-slate-700/80 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 outline-none focus:border-blue-500"
              />
              {currentService && (
                <p className="text-[11px] text-slate-500">
                  Min {currentService.minQuantity} · Max {currentService.maxQuantity}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Profile / post link</label>
              <input
                type="text"
                required
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="@username or https://..."
                className="w-full rounded-xl border border-slate-700/80 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">
                Coupon code (optional)
              </label>
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="w-full rounded-xl border border-slate-700/80 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="space-y-3 rounded-2xl bg-slate-950/80 p-4">
            <h2 className="text-sm font-semibold text-slate-100">Order summary</h2>
            <p className="text-xs text-slate-400">
              Estimated price based on the selected quantity and service rate.
            </p>
            <div className="mt-2 flex items-end justify-between">
              <div>
                <p className="text-xs text-slate-400">Estimated total</p>
                <p className="text-2xl font-semibold text-sky-300">${estimatedPrice}</p>
              </div>
            </div>

            {error && <p className="text-xs text-red-400">{error}</p>}
            {success && <p className="text-xs text-emerald-400">{success}</p>}

            <button
              type="submit"
              disabled={submitting || !currentService}
              className="btn-primary mt-2 w-full justify-center"
            >
              {submitting ? "Creating order..." : "Place order"}
            </button>
          </div>
        </form>
      </div>
    </DashboardShell>
  );
}

