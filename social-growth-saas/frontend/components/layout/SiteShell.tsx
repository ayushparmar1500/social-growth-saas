import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="page-main">
        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-8 lg:px-6 lg:py-10">
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
}

