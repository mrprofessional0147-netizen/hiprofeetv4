import { Link, useLocation } from "@tanstack/react-router";

export function Nav() {
  const loc = useLocation();
  const onChat = loc.pathname.startsWith("/advisor");
  return (
    <nav className="fixed inset-x-0 top-0 z-50 h-16 border-b border-white/10 bg-[oklch(0.18_0.04_260/0.88)] backdrop-blur-2xl">
      <div className="container-page flex h-full items-center justify-between">
        <Link to="/" className="font-display text-[22px] font-bold tracking-tight text-amber">
          HIPRO<span>FEET</span>
        </Link>
        <div className="hidden items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-white/45 sm:flex">
          <span className="pulse-dot inline-block h-[7px] w-[7px] rounded-full bg-emerald-400" />
          AI Online · Free
        </div>
        {!onChat && (
          <Link
            to="/advisor"
            className="rounded-xl bg-amber px-5 py-2.5 text-[13px] font-bold text-white transition active:scale-95"
          >
            Try Free →
          </Link>
        )}
      </div>
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#050B18] px-5 py-8 text-center">
      <div className="font-display text-xl font-bold text-amber">HIPRO<em className="not-italic">FEET</em></div>
      <p className="mt-2 text-xs leading-relaxed text-white/30">
        Free AI Business Growth Partner + Expert Execution — Built for Nigerian entrepreneurs.
        <br />© 2025 HIPROFEET. All rights reserved.
      </p>
    </footer>
  );
}
