export function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between lg:px-6">
        <p>© {new Date().getFullYear()} NovaGrowth. All rights reserved.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-slate-300">
            Terms
          </a>
          <a href="#" className="hover:text-slate-300">
            Privacy
          </a>
          <a href="#" className="hover:text-slate-300">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}

