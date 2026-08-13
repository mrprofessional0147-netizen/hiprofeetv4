import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import mark from "@/assets/hiprofeet-mark.jpg.asset.json";

export const BRAND_MARK = mark.url;

/** Reusable brand lockup — the mark is the memorability anchor, the wordmark carries the name. */
export function BrandMark({ size = 34, className = "" }: { size?: number; className?: string }) {
  return (
    <img
      src={BRAND_MARK}
      alt="HIPROFEET logo"
      width={size}
      height={size}
      className={`rounded-full ring-1 ring-sky/40 shadow-[0_0_18px_oklch(0.78_0.13_230/.35)] ${className}`}
      style={{ width: size, height: size }}
    />
  );
}

export function Nav() {
  const loc = useLocation();
  const onChat = loc.pathname.startsWith("/advisor");
  const onAuth = loc.pathname.startsWith("/auth") || loc.pathname.startsWith("/reset-password");
  const { user, profile, loading, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const initial = (profile?.full_name || user?.email || "U").trim().charAt(0).toUpperCase();
  const displayName = profile?.full_name || user?.email?.split("@")[0] || "Account";

  return (
    <nav className="fixed inset-x-0 top-0 z-50 h-16 border-b border-white/10 bg-[oklch(0.18_0.04_260/0.88)] backdrop-blur-2xl">
      <div className="container-page flex h-full items-center justify-between gap-3">
        <Link to="/" className="group flex items-center gap-2.5">
          <BrandMark size={34} className="transition group-hover:scale-105" />
          <span className="font-display text-[20px] font-bold leading-none tracking-tight text-amber sm:text-[22px]">
            HIPRO<span>FEET</span>
          </span>
        </Link>
        <div className="hidden items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-white/45 md:flex">
          <span className="pulse-dot inline-block h-[7px] w-[7px] rounded-full bg-emerald-400" />
          Growth Advisor · Online
        </div>
        <div className="flex items-center gap-2">
          {!onChat && !onAuth && (
            <Link
              to="/services"
              className="hidden rounded-xl border border-white/15 px-4 py-2.5 text-[13px] font-semibold text-white/80 transition hover:border-sky/40 hover:text-white sm:inline-flex"
            >
              Services
            </Link>
          )}
          {!onChat && !onAuth && (
            <Link
              to="/diagnosis"
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-sky to-brand px-4 py-2.5 text-[13px] font-bold text-white shadow-[0_4px_16px_oklch(0.78_0.13_230/.4)] transition active:scale-95"
            >
              Start Diagnosis
            </Link>
          )}

          {/* Auth control */}
          {!loading && !onAuth && (
            user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen((o) => !o)}
                  className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-gradient-to-br from-sky/30 to-brand/30 text-sm font-bold text-white transition hover:border-sky/50"
                  aria-label="Account menu"
                >
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="" className="h-full w-full object-cover" />
                  ) : (
                    initial
                  )}
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-white/10 bg-[#0F1729] shadow-[0_20px_60px_oklch(0_0_0/.5)]">
                    <div className="border-b border-white/5 px-4 py-3">
                      <div className="truncate text-sm font-semibold text-white">{displayName}</div>
                      <div className="truncate text-xs text-white/50">{user.email}</div>
                    </div>
                    <Link
                      to="/orders"
                      onClick={() => setMenuOpen(false)}
                      className="block w-full px-4 py-2.5 text-left text-sm text-white/80 transition hover:bg-white/5 hover:text-white"
                    >
                      🛒 My orders
                    </Link>
                    <Link
                      to="/advisor"
                      onClick={() => setMenuOpen(false)}
                      className="block w-full border-t border-white/5 px-4 py-2.5 text-left text-sm text-white/80 transition hover:bg-white/5 hover:text-white"
                    >
                      💬 My chats
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setMenuOpen(false)}
                        className="block w-full border-t border-white/5 px-4 py-2.5 text-left text-sm text-amber transition hover:bg-white/5"
                      >
                        ⚡ Admin dashboard
                      </Link>
                    )}
                    <button
                      onClick={async () => {
                        setMenuOpen(false);
                        await signOut();
                        navigate({ to: "/" });
                      }}
                      className="block w-full border-t border-white/5 px-4 py-2.5 text-left text-sm text-white/80 transition hover:bg-white/5 hover:text-white"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/auth"
                className="inline-flex items-center rounded-xl border border-white/15 px-4 py-2.5 text-[13px] font-semibold text-white/85 transition hover:border-sky/40 hover:text-white"
              >
                Sign in
              </Link>
            )
          )}
        </div>
      </div>
    </nav>
  );
}

/* Floating "Chat with AI" pill — always reachable on every page except advisor/auth */
export function FloatingChatCTA() {
  const loc = useLocation();
  const hide = ["/diagnosis", "/advisor", "/auth", "/reset-password", "/report"].some((p) => loc.pathname.startsWith(p));
  if (hide) return null;
  return (
    <Link
      to="/diagnosis"
      className="group fixed bottom-5 right-5 z-40 inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-sky to-brand px-5 py-3.5 text-[14px] font-bold text-white shadow-[0_10px_36px_oklch(0.78_0.13_230/.55)] transition hover:scale-105 active:scale-95 sm:bottom-6 sm:right-6"
    >
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/70 opacity-75" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white" />
      </span>
      <span>Start Free Diagnosis</span>
    </Link>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#050B18] px-5 py-10 text-center">
      <div className="flex items-center justify-center gap-2.5">
        <BrandMark size={40} />
        <span className="font-display text-xl font-bold text-amber">HIPRO<em className="not-italic">FEET</em></span>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-white/30">
        Business Growth Intelligence for Nigerian founders. Diagnose precisely. Execute professionally.
      </p>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-white/40">
        <Link to="/diagnosis" className="hover:text-white">Free Diagnosis</Link>
        <span className="text-white/10">·</span>
        <Link to="/services" className="hover:text-white">Growth Services</Link>
        <span className="text-white/10">·</span>
        <a href="https://wa.me/2349014244117" target="_blank" rel="noopener" className="hover:text-white">WhatsApp Strategist</a>
      </div>
      <p className="mt-4 text-[11px] text-white/25">© 2025 HIPROFEET. All rights reserved.</p>
    </footer>
  );
}
