"use client";

import { useEffect, useState } from "react";
import { api } from "../../lib/api";

type Service = {
  _id: string;
  name: string;
  platform: string;
  pricePerUnit: number;
  minQuantity: number;
  maxQuantity: number;
  description?: string;
};

const platformLabels: Record<string, string> = {
  instagram: "Instagram",
  tiktok: "TikTok",
  youtube: "YouTube"
};

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    api
      .get<Service[]>("/services")
      .then((data) => {
        if (mounted) {
          setServices(data);
        }
      })
      .catch((err) => {
        setError(err.message || "Failed to load services");
      })
      .finally(() => setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  const grouped = services.reduce<Record<string, Service[]>>((acc, svc) => {
    if (!acc[svc.platform]) acc[svc.platform] = [];
    acc[svc.platform].push(svc);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-xl font-semibold text-slate-50 sm:text-2xl">Services</h1>
        <p className="text-sm text-slate-400">
          Curated growth services for Instagram, TikTok and YouTube with transparent pricing.
        </p>
      </div>

      {loading && <p className="text-sm text-slate-300">Loading services...</p>}
      {error && <p className="text-sm text-red-400">{error}</p>}

      {!loading && !error && (
        <div className="space-y-6">
          {Object.entries(grouped).map(([platform, list]) => (
            <section key={platform} className="space-y-3">
              <h2 className="text-sm font-semibold text-slate-200">
                {platformLabels[platform] ?? platform}
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                {list.map((svc) => (
                  <div
                    key={svc._id}
                    className="glass flex flex-col justify-between border border-slate-800/80 p-4"
                  >
                    <div>
                      <h3 className="text-sm font-semibold text-slate-50">{svc.name}</h3>
                      {svc.description && (
                        <p className="mt-1 text-xs text-slate-400">{svc.description}</p>
                      )}
                      <p className="mt-2 text-xs text-slate-400">
                        From{" "}
                        <span className="font-semibold text-sky-300">
                          ${svc.pricePerUnit.toFixed(4)}
                        </span>{" "}
                        per unit · {svc.minQuantity} – {svc.maxQuantity}
                      </p>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <p className="text-[11px] text-slate-500">
                        Optimized for {platformLabels[platform] ?? platform}
                      </p>
                      <a href="/dashboard/order" className="btn-primary px-4 py-1.5 text-xs">
                        Order
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
          {services.length === 0 && (
            <p className="text-sm text-slate-400">
              No services are available yet. Check back soon.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

