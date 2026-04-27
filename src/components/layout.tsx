import { Link, useLocation } from "@tanstack/react-router";

export function Nav() {
  const loc = useLocation();
  const onChat = loc.pathname.startsWith("/advisor");
  return (
    <nav className="fixed inset-x-0 top-0 z-50 h-16 border-b border-white/10 bg-[oklch(0.18_0.04_260/0.88)] backdrop-blur-2xl">
      <div className="container-page flex h-full items-center justify-between gap-3">
        <Link to="/" className="font-display text-[22px] font-bold tracking-tight text-amber">
          HIPRO<span>FEET</span>
        </Link>
        <div className="hidden items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-white/45 md:flex">
          <span className="pulse-dot inline-block h-[7px] w-[7px] rounded-full bg-emerald-400" />
          AI Advisor Online
        </div>
        {!onChat && (
          <div className="flex items-center gap-2">
            <a
              href="/#services"
              className="hidden rounded-xl border border-white/15 px-4 py-2.5 text-[13px] font-semibold text-white/80 transition hover:border-sky/40 hover:text-white sm:inline-flex"
            >
              Browse Services
            </a>
            <Link
              to="/advisor"
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-sky to-brand px-4 py-2.5 text-[13px] font-bold text-white shadow-[0_4px_16px_oklch(0.78_0.13_230/.4)] transition active:scale-95"
            >
              💬 Chat Free
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

/* Floating "Chat with AI" pill — always reachable on every page except advisor */
export function FloatingChatCTA() {
  const loc = useLocation();
  if (loc.pathname.startsWith("/advisor")) return null;
  return (
    <Link
      to="/advisor"
      className="group fixed bottom-5 right-5 z-40 inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-sky to-brand px-5 py-3.5 text-[14px] font-bold text-white shadow-[0_10px_36px_oklch(0.78_0.13_230/.55)] transition hover:scale-105 active:scale-95 sm:bottom-6 sm:right-6"
    >
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/70 opacity-75" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white" />
      </span>
      <span>💬 Chat with AI — Free</span>
    </Link>
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
