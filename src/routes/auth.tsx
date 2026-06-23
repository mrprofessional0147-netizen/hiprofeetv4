import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>): { redirect?: string; mode?: "signin" | "signup" } => ({
    redirect: (search.redirect as string) || undefined,
    mode: (search.mode as "signin" | "signup") || undefined,
  }),
  head: () => ({
    meta: [
      { title: "Sign in — HIPROFEET" },
      { name: "description", content: "Access your HIPROFEET account to save growth audits, track interventions, and commission execution." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup" | "forgot" | "check-email">(search.mode ?? "signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const redirectTo = search.redirect ?? "/";

  // Redirect away if already signed in
  useEffect(() => {
    if (!authLoading && user) {
      navigate({ to: redirectTo as "/" });
    }
  }, [user, authLoading, navigate, redirectTo]);

  const handleGoogle = async () => {
    setSubmitting(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin + redirectTo,
      });
      if (result.error) {
        toast.error("Couldn't sign in with Google. Try again.");
      }
      // If redirected, browser navigates away. If tokens returned, session is set.
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEmail = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}${redirectTo}` },
        });
        if (error) throw error;
        setMode("check-email");
      } else if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back!");
      } else if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        toast.success("Check your email for the reset link.");
        setMode("signin");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0A0F1F] px-4 py-12">
      {/* Aurora glow background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-sky/20 blur-[140px]" />
        <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-brand/15 blur-[140px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative w-full max-w-md"
      >
        {/* Header */}
        <div className="mb-8 text-center">
          <Link to="/" className="inline-block font-display text-[28px] font-bold tracking-tight text-amber">
            HIPRO<span>FEET</span>
          </Link>
          <p className="mt-2 text-sm text-white/50">
            {mode === "signup" && "Create your operator account"}
            {mode === "signin" && "Welcome back"}
            {mode === "forgot" && "Reset your password"}
            {mode === "check-email" && "One step remaining"}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-[0_20px_60px_oklch(0_0_0/.4)] backdrop-blur-xl sm:p-8">
          {mode === "check-email" ? (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-sky/15 text-3xl">
                ✉️
              </div>
              <h2 className="font-display text-xl font-bold text-white">Check your inbox</h2>
              <p className="mt-2 text-sm text-white/60">
                We sent a verification link to <span className="font-semibold text-white">{email}</span>.
                Click it to activate your account.
              </p>
              <button
                onClick={() => setMode("signin")}
                className="mt-6 text-sm font-semibold text-sky hover:text-sky-2"
              >
                Back to sign in
              </button>
            </div>
          ) : (
            <>
              {mode !== "forgot" && (
                <>
                  <button
                    onClick={handleGoogle}
                    disabled={submitting}
                    className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:border-sky/40 hover:bg-white/10 active:scale-[0.98] disabled:opacity-50"
                  >
                    <GoogleIcon />
                    Continue with Google
                  </button>

                  <div className="my-5 flex items-center gap-3">
                    <div className="h-px flex-1 bg-white/10" />
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-white/40">or</span>
                    <div className="h-px flex-1 bg-white/10" />
                  </div>
                </>
              )}

              <form onSubmit={handleEmail} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-white/50">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@business.com"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 transition focus:border-sky/50 focus:bg-white/10 focus:outline-none"
                  />
                </div>

                {mode !== "forgot" && (
                  <div>
                    <div className="mb-1.5 flex items-center justify-between">
                      <label className="text-xs font-semibold uppercase tracking-wider text-white/50">
                        Password
                      </label>
                      {mode === "signin" && (
                        <button
                          type="button"
                          onClick={() => setMode("forgot")}
                          className="text-xs font-semibold text-sky hover:text-sky-2"
                        >
                          Forgot?
                        </button>
                      )}
                    </div>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={mode === "signup" ? "At least 6 characters" : "Your password"}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 transition focus:border-sky/50 focus:bg-white/10 focus:outline-none"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-xl bg-gradient-to-r from-sky to-brand px-4 py-3 text-sm font-bold text-white shadow-[0_8px_24px_oklch(0.78_0.13_230/.4)] transition hover:shadow-[0_12px_32px_oklch(0.78_0.13_230/.55)] active:scale-[0.98] disabled:opacity-60"
                >
                  {submitting
                    ? "Please wait…"
                    : mode === "signup"
                    ? "Create account"
                    : mode === "forgot"
                    ? "Send reset link"
                    : "Sign in"}
                </button>
              </form>

              <div className="mt-6 text-center text-sm text-white/50">
                {mode === "signin" && (
                  <>
                    New here?{" "}
                    <button onClick={() => setMode("signup")} className="font-semibold text-sky hover:text-sky-2">
                      Create an account
                    </button>
                  </>
                )}
                {mode === "signup" && (
                  <>
                    Already have an account?{" "}
                    <button onClick={() => setMode("signin")} className="font-semibold text-sky hover:text-sky-2">
                      Sign in
                    </button>
                  </>
                )}
                {mode === "forgot" && (
                  <button onClick={() => setMode("signin")} className="font-semibold text-sky hover:text-sky-2">
                    ← Back to sign in
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-white/30">
          By continuing, you accept our terms. Your business information stays confidential.
        </p>
      </motion.div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}
