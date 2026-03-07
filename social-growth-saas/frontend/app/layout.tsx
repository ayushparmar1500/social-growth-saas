import type { Metadata } from "next";
import "./globals.css";
import { ReactNode } from "react";
import { AuthProvider } from "../components/auth/AuthProvider";
import { SiteShell } from "../components/layout/SiteShell";

export const metadata: Metadata = {
  title: "NovaGrowth – Social Media Growth SaaS",
  description: "Boost your social media presence with a modern, high‑performance SMM panel for Instagram, TikTok, and YouTube.",
  openGraph: {
    title: "NovaGrowth – Social Media Growth SaaS",
    description:
      "Buy high‑quality followers, likes, views, and engagement with a beautiful dashboard and real‑time order tracking.",
    type: "website"
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="page-shell">
        <AuthProvider>
          <SiteShell>{children}</SiteShell>
        </AuthProvider>
      </body>
    </html>
  );
}

