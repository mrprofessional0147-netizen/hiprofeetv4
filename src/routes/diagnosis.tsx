import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Nav, Footer } from "@/components/layout";

// Question/choice types mirrored from the server (kept structural).
type Choice = { value: string; label: string; score: number };
type Question = {
  id: string;
  pillar: "awareness" | "acquisition" | "conversion" | "retention" | "measurement";
  prompt: string;
  helper?: string;
  choices: Choice[];
  allowNote?: boolean;
};

const INDUSTRIES = ["Fashion / Clothing", "Beauty / Cosmetics", "Food & Drinks", "Real Estate", "Education / Coaching", "Health / Wellness", "Professional Services", "E-commerce / Retail", "Tech / SaaS", "Other"];
const REVENUE = ["Less than ₦200k / month", "₦200k – ₦1M / month", "₦1M – ₦5M / month", "₦5M – ₦20M / month", "Over ₦20M / month", "Prefer not to say"];

type Phase = "intro" | "questions" | "email" | "verify" | "loading" | "done";

export const Route = createFileRoute("/diagnosis")({
  head: () => ({
    meta: [
      { title: "Free Customer Acquisition Diagnosis — HIPROFEET" },
      { name: "description", content: "Find out exactly why your business isn't getting enough customers. Free 3-minute confidential diagnosis by HIPROFEET." },
      { property: "og:title", content: "Free Customer Acquisition Diagnosis — HIPROFEET" },
      { property: "og:description", content: "A conversational diagnosis that identifies your #1 growth bottleneck. Free, personalized report by email." },
    ],
  }),
  component: DiagnosisPage,
});

function DiagnosisPage() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>("intro");
  const [name, setName] = useState("");
  const [business, setBusiness] = useState("");
  const [industry, setIndustry] = useState("");
  const [revenue, setRevenue] = useState("");
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, { value: string; note?: string }>>({});
  const [qIdx, setQIdx] = useState(0);
  const [note, setNote] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [attemptsLeft, setAttemptsLeft] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const progress = useMemo(() => {
    if (phase === "intro") return 0.02;
    if (phase === "questions" && questions.length) return 0.1 + 0.7 * (qIdx / questions.length);
    if (phase === "email") return 0.85;
    if (phase === "verify") return 0.93;
    if (phase === "loading") return 0.97;
    return 1;
  }, [phase, qIdx, questions.length]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [qIdx, phase]);

  async function api(path: string, body: unknown) {
    const res = await fetch(`/api/diagnosis/${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json.error || `req_failed_${res.status}`);
    return json;
  }

  async function handleIntroSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setBusy(true); setErr(null);
    try {
      const r = await api("start", {
        name: name.trim(),
        business_name: business.trim() || null,
        industry: industry || null,
        revenue_band: revenue || null,
        source: typeof document !== "undefined" ? document.referrer.slice(0, 60) : null,
      });
      setSessionToken(r.session_token);
      setQuestions(r.questions);
      setPhase("questions");
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function chooseAnswer(q: Question, choice: Choice) {
    const next = { ...answers, [q.id]: { value: choice.value, note: note.trim() || undefined } };
    setAnswers(next);
    setNote("");
    // Persist in background
    if (sessionToken) api("answers", { session_token: sessionToken, answers: next }).catch(() => {});
    if (qIdx + 1 >= questions.length) {
      setPhase("email");
    } else {
      setQIdx(qIdx + 1);
    }
  }

  async function submitEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) { setErr("Please enter a valid email"); return; }
    setBusy(true); setErr(null);
    try {
      const r = await api("finalize", { session_token: sessionToken, email: email.trim() });
      if (r.verification === "required") setPhase("verify");
      else if (r.report_token) navigate({ to: "/report/$token", params: { token: r.report_token } });
    } catch (e) {
      setErr((e as Error).message);
    } finally { setBusy(false); }
  }

  async function submitOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!/^\d{6}$/.test(otp)) { setErr("Enter the 6-digit code from your email"); return; }
    setBusy(true); setErr(null);
    try {
      setPhase("loading");
      const r = await api("verify", { session_token: sessionToken, code: otp });
      if (r.report_token) navigate({ to: "/report/$token", params: { token: r.report_token } });
    } catch (e) {
      const msg = (e as Error).message;
      setPhase("verify");
      if (msg === "wrong_code") setErr("That code isn't right. Try again."); 
      else if (msg === "expired") setErr("Code expired. Request a new one below.");
      else if (msg === "too_many_attempts") setErr("Too many attempts. Request a new code.");
      else setErr(msg);
    } finally { setBusy(false); }
  }

  async function resendCode() {
    if (!sessionToken) return;
    setBusy(true); setErr(null);
    try {
      await api("resend", { session_token: sessionToken });
      setErr("New code sent. Check your email.");
    } catch (e) {
      setErr((e as Error).message);
    } finally { setBusy(false); }
  }

  const currentQ = questions[qIdx];

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-ink px-4 pt-24 pb-16">
        <div className="mx-auto max-w-2xl">
          {/* Progress */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[2px] text-white/50">
              <span>Customer Acquisition Diagnosis</span>
              <span>{Math.round(progress * 100)}%</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/5">
              <motion.div
                className="h-full bg-gradient-to-r from-sky to-amber"
                animate={{ width: `${progress * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          <div ref={scrollRef} className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.02] p-6 sm:p-9 shadow-[0_30px_80px_oklch(0.18_0.04_260/.5)]">
            <AnimatePresence mode="wait">
              {phase === "intro" && (
                <motion.form key="intro" onSubmit={handleIntroSubmit} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-5">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-[3px] text-sky">Step 1 · About you</div>
                    <h1 className="mt-2 font-display text-3xl font-bold leading-tight text-white sm:text-4xl">Let's find out what's holding your growth back.</h1>
                    <p className="mt-3 text-[15px] leading-relaxed text-white/65">Takes about 3 minutes. Answers stay private. You get a personalized report — free.</p>
                  </div>
                  <Field label="Your name *"><input required value={name} onChange={(e) => setName(e.target.value)} className={inputCls} placeholder="Chinyere Okafor" /></Field>
                  <Field label="Business name (optional)"><input value={business} onChange={(e) => setBusiness(e.target.value)} className={inputCls} placeholder="Amara Beauty Studio" /></Field>
                  <Field label="Industry (optional)">
                    <select value={industry} onChange={(e) => setIndustry(e.target.value)} className={inputCls}>
                      <option value="">Select industry</option>
                      {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
                    </select>
                  </Field>
                  <Field label="Monthly revenue range (optional)">
                    <select value={revenue} onChange={(e) => setRevenue(e.target.value)} className={inputCls}>
                      <option value="">Select range</option>
                      {REVENUE.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </Field>
                  {err && <div className="text-sm text-red-300">{err}</div>}
                  <button type="submit" disabled={busy} className="mt-2 w-full rounded-2xl bg-gradient-to-r from-sky to-brand px-6 py-4 text-base font-bold text-white shadow-[0_10px_30px_oklch(0.78_0.13_230/.4)] transition active:scale-[0.98] disabled:opacity-50">
                    {busy ? "Starting…" : "Begin diagnosis →"}
                  </button>
                  <p className="text-center text-xs text-white/40">Confidential · No credit card · By HIPROFEET</p>
                </motion.form>
              )}

              {phase === "questions" && currentQ && (
                <motion.div key={`q-${currentQ.id}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                  <div className="text-[10px] font-bold uppercase tracking-[3px] text-amber">Question {qIdx + 1} of {questions.length}</div>
                  <h2 className="mt-2 font-display text-2xl font-bold leading-snug text-white sm:text-3xl">{currentQ.prompt}</h2>
                  {currentQ.helper && <p className="mt-2 text-sm text-white/55">{currentQ.helper}</p>}
                  <div className="mt-6 space-y-2.5">
                    {currentQ.choices.map((c) => (
                      <button
                        key={c.value}
                        onClick={() => chooseAnswer(currentQ, c)}
                        className="group w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-left text-[15px] leading-snug text-white/85 transition hover:border-sky/50 hover:bg-sky/10 hover:text-white"
                      >
                        <span className="mr-3 inline-flex h-6 w-6 items-center justify-center rounded-full border border-white/20 text-xs group-hover:border-sky group-hover:bg-sky/30">·</span>
                        {c.label}
                      </button>
                    ))}
                  </div>
                  {currentQ.allowNote && (
                    <div className="mt-4">
                      <label className="text-xs text-white/50">Add a note (optional)</label>
                      <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} className={`${inputCls} mt-1`} placeholder="Anything specific we should know?" />
                    </div>
                  )}
                  {qIdx > 0 && (
                    <button onClick={() => setQIdx(qIdx - 1)} className="mt-6 text-sm text-white/50 hover:text-white">← back</button>
                  )}
                </motion.div>
              )}

              {phase === "email" && (
                <motion.form key="email" onSubmit={submitEmail} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-5">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-[3px] text-sky">Almost there</div>
                    <h2 className="mt-2 font-display text-3xl font-bold leading-tight text-white">Where should we send your report?</h2>
                    <p className="mt-3 text-[15px] leading-relaxed text-white/65">We'll deliver your personalized Customer Acquisition Report to your email — plus a private link to view it online.</p>
                  </div>
                  <Field label="Email address *">
                    <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} placeholder="you@business.com" />
                  </Field>
                  {err && <div className="text-sm text-red-300">{err}</div>}
                  <button type="submit" disabled={busy} className="w-full rounded-2xl bg-gradient-to-r from-sky to-brand px-6 py-4 text-base font-bold text-white shadow-[0_10px_30px_oklch(0.78_0.13_230/.4)] transition active:scale-[0.98] disabled:opacity-50">
                    {busy ? "Preparing your report…" : "Send my report →"}
                  </button>
                  <p className="text-center text-xs text-white/40">We'll send a 6-digit code to confirm your email.</p>
                </motion.form>
              )}

              {phase === "verify" && (
                <motion.form key="verify" onSubmit={submitOtp} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-5">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-[3px] text-sky">Verify your email</div>
                    <h2 className="mt-2 font-display text-3xl font-bold leading-tight text-white">Enter the 6-digit code</h2>
                    <p className="mt-3 text-[15px] leading-relaxed text-white/65">We just sent a code to <strong className="text-white">{email}</strong>. It expires in 10 minutes.</p>
                  </div>
                  <input
                    inputMode="numeric"
                    autoFocus
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className="w-full rounded-2xl border border-white/15 bg-white/[0.04] px-5 py-5 text-center font-mono text-3xl tracking-[10px] text-white outline-none focus:border-sky"
                    placeholder="••••••"
                  />
                  {err && <div className="text-sm text-red-300">{err}</div>}
                  {attemptsLeft !== null && attemptsLeft <= 2 && <div className="text-xs text-amber">{attemptsLeft} attempt(s) left</div>}
                  <button type="submit" disabled={busy || otp.length !== 6} className="w-full rounded-2xl bg-gradient-to-r from-sky to-brand px-6 py-4 text-base font-bold text-white shadow-[0_10px_30px_oklch(0.78_0.13_230/.4)] transition active:scale-[0.98] disabled:opacity-50">
                    {busy ? "Verifying…" : "Unlock my report →"}
                  </button>
                  <div className="flex items-center justify-between text-xs">
                    <button type="button" onClick={resendCode} disabled={busy} className="text-white/60 hover:text-white">Didn't get it? Resend code</button>
                    <button type="button" onClick={() => setPhase("email")} className="text-white/40 hover:text-white">Wrong email?</button>
                  </div>
                </motion.form>
              )}

              {phase === "loading" && (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-16 text-center">
                  <div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-sky/30 border-t-sky" />
                  <div className="mt-6 font-display text-xl text-white">Generating your report…</div>
                  <div className="mt-2 text-sm text-white/50">Analysing your answers across five growth pillars.</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-6 text-center text-xs text-white/40">
            Trouble with the flow? <a href="https://wa.me/2349014244117" className="text-sky hover:underline">Message us on WhatsApp</a> · <Link to="/" className="hover:text-white">Home</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

const inputCls = "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-[15px] text-white outline-none placeholder:text-white/30 focus:border-sky";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-white/50">{label}</div>
      {children}
    </label>
  );
}
