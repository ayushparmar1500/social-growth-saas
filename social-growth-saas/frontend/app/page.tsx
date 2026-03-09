"use client";
import { motion } from "framer-motion";
import Link from "next/link";

const stats = [
  { label: "Total orders", value: "120K+" },
  { label: "Happy creators", value: "48K+" },
  { label: "Avg. uptime", value: "99.9%" },
];

const categories = [
  {
    title: "Instagram Growth",
    description: "Followers, likes, views & story engagement built for brands and creators.",
  },
  {
    title: "TikTok Growth",
    description: "Boost your short‑form videos with targeted views and creator‑safe growth.",
  },
  {
    title: "YouTube Growth",
    description: "Watch‑time, views and engagement to push your content to the algorithm.",
  },
];
export const dynamic = "force-dynamic";
export default function HomePage() {
  return (
    <div className="flex flex-col gap-12">
      <section className="grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-center">
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-slate-700/60 bg-slate-900/60 px-3 py-1 text-xs text-slate-300 shadow-sm"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Live orders updating in real‑time
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.65 }}
            className="text-balance text-4xl font-semibold tracking-tight text-slate-50 sm:text-5xl lg:text-6xl"
          >
            Boost your{" "}
            <span className="bg-gradient-to-r from-blue-400 via-sky-400 to-indigo-300 bg-clip-text text-transparent">
              social presence
            </span>{" "}
            with one dashboard.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.65 }}
            className="max-w-xl text-sm text-slate-300/90 sm:text-base"
          >
            NovaGrowth is a modern SMM platform that lets you buy safe, high‑quality followers,
            likes, views and engagement for Instagram, TikTok and YouTube — with transparent pricing
            and real‑time order tracking.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.5 }}
            className="flex flex-wrap items-center gap-3"
          >
            <Link href="/register" className="btn-primary">
              Get started
            </Link>
            <Link href="/services" className="btn-outline">
              View services
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="grid gap-4 text-xs text-slate-300 sm:grid-cols-3"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="glass p-4">
                <p className="text-sm font-semibold text-slate-50">{stat.value}</p>
                <p className="mt-1 text-[11px] text-slate-400">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="glass relative overflow-hidden border-slate-700/70"
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-radial opacity-60" />
          <div className="relative space-y-4 p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-slate-200">Live dashboard preview</p>
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                Secure & real‑time
              </span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-3 rounded-2xl bg-slate-900/60 p-4">
                <p className="text-xs text-slate-400">Active orders</p>
                <p className="text-2xl font-semibold text-slate-50">247</p>
                <p className="text-[11px] text-emerald-300">+18% vs last 24h</p>
              </div>
              <div className="space-y-3 rounded-2xl bg-slate-900/60 p-4">
                <p className="text-xs text-slate-400">Avg. fulfillment speed</p>
                <p className="text-2xl font-semibold text-slate-50">7m 32s</p>
                <p className="text-[11px] text-sky-300">Across all providers</p>
              </div>
            </div>
            <div className="mt-2 space-y-2 text-[11px] text-slate-300">
              <p>• One wallet for all platforms</p>
              <p>• Smart routing to the fastest SMM providers</p>
              <p>• Transparent status updates for every order</p>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="space-y-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-50 sm:text-xl">
              Built for modern creators
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Choose a platform and unlock growth with curated, high‑quality services.
            </p>
          </div>
          <Link href="/services" className="text-xs text-sky-400 hover:text-sky-300">
            Explore services →
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {categories.map((cat) => (
            <div key={cat.title} className="glass group border-slate-800/80 p-5 transition hover:border-blue-500/80 hover:bg-slate-900/80">
              <h3 className="text-sm font-semibold text-slate-50">{cat.title}</h3>
              <p className="mt-2 text-xs text-slate-400">{cat.description}</p>
              <p className="mt-3 text-xs text-sky-400 opacity-0 transition group-hover:opacity-100">
                View packages →
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

