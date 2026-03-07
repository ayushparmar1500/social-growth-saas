"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "../../lib/api";
import { useAuth } from "../../components/auth/AuthProvider";

type RegisterResponse = {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: "user" | "admin";
  };
};

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await api.post<RegisterResponse>("/auth/register", {
        name,
        email,
        password
      });
      login(data.token, data.user);
      router.push("/dashboard");
    } catch (err) {
      setError((err as Error).message || "Failed to register");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6">
      <div className="space-y-2 text-center">
        <h1 className="text-xl font-semibold text-slate-50">Create your NovaGrowth account</h1>
        <p className="text-sm text-slate-400">
          Set up your dashboard in seconds and start scaling your social presence.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="glass space-y-4 border border-slate-800/80 p-6">
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-300">Full name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-slate-700/80 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 outline-none ring-0 transition focus:border-blue-500"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-300">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-slate-700/80 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 outline-none ring-0 transition focus:border-blue-500"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-300">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-slate-700/80 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 outline-none ring-0 transition focus:border-blue-500"
          />
        </div>
        {error && <p className="text-xs text-red-400">{error}</p>}
        <button type="submit" className="btn-primary w-full justify-center" disabled={loading}>
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="text-center text-xs text-slate-400">
        Already have an account?{" "}
        <Link href="/login" className="text-sky-400 hover:text-sky-300">
          Log in
        </Link>
      </p>
    </div>
  );
}

