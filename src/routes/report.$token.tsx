import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Nav, Footer } from "@/components/layout";

type Pillar = "awareness" | "acquisition" | "conversion" | "retention" | "measurement";
type Report = {
  headline: string;
  summary: string;
  strengths: string[];
  bottlenecks: string[];
  opportunities: string[];
  recommendations: { title: string; detail: string }[];
  next_step: string;
};
type Diagnosis = {
  id: string;
  name: string;
  business_name: string | null;
  industry: string | null;
  score: number;
  pillar_scores: Record<Pillar, number>;
  report: Report;
  status: string;
  created_at: string;
};

export const Route = createFileRoute("/report/$token")({
  head: () => ({
    meta: [
      { title: "Your Customer Acquisition Report — HIPROFEET" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ReportPage,
});

function ReportPage() {
  const { token } = useParams({ from: "/report/$token" });
  const [diag, setDiag] = useState<Diagnosis | null>(null);
  const [pillarMeta, setPillarMeta] = useState<Record<Pillar, { label: string; blurb: string }> | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [booking, setBooking] = useState(false);
  const [booked, setBooked] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/diagnosis/report", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "failed");
        setDiag(json.diagnosis);
        setPillarMeta(json.pillar_meta);
      } catch (e) {
        setErr((e as Error).message);
      }
    })();
  }, [token]);

  async function bookConsultation() {
    setBooking(true);
    try {
      await fetch("/api/diagnosis/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      setBooked(true);
    } catch {}
    finally { setBooking(false); }
    const msg = `Hi Hiprofeet, I just completed my Customer Acquisition Diagnosis (Score: ${diag?.score}/100${diag?.business_name ? ` — ${diag.business_name}` : ""}). I'd like to book a Strategy Session.`;
    window.open(`https://wa.me/2349014244117?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
  }

  if (err) {
    return (
      <>
        <Nav />
        <main className="min-h-screen bg-ink px-5 pt-32 pb-16">
          <div className="mx-auto max-w-md text-center">
            <div className="text-6xl">🔒</div>
            <h1 className="mt-6 font-display text-2xl font-bold text-white">Report unavailable</h1>
            <p className="mt-3 text-white/60">This link may have expired, been mistyped, or the report hasn't been generated yet.</p>
            <Link to="/diagnosis" className="mt-6 inline-flex rounded-xl bg-sky px-6 py-3 text-sm font-bold text-ink">Start a new diagnosis →</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!diag || !pillarMeta) {
    return (
      <>
        <Nav />
        <main className="grid min-h-screen place-items-center bg-ink">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-sky/30 border-t-sky" />
        </main>
      </>
    );
  }

  const scoreTier = diag.score >= 75 ? { label: "Strong", tone: "text-emerald-300" } : diag.score >= 50 ? { label: "Developing", tone: "text-amber" } : diag.score >= 25 ? { label: "Fragile", tone: "text-orange-300" } : { label: "Critical", tone: "text-red-300" };

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-ink px-4 pt-24 pb-20">
        <div className="mx-auto max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="rounded-3xl border border-sky/20 bg-gradient-to-br from-[#0F1729] via-[#0A0F1F] to-ink p-6 sm:p-10 shadow-[0_40px_100px_oklch(0.78_0.13_230/.25)]">
            <div className="text-[10px] font-bold uppercase tracking-[3px] text-sky">Confidential · Prepared for {diag.name}</div>
            <h1 className="mt-2 font-display text-3xl font-bold leading-tight text-white sm:text-4xl">{diag.report.headline}</h1>
            <p className="mt-4 text-[15px] leading-relaxed text-white/70 sm:text-base">{diag.report.summary}</p>

            <div className="mt-8 grid gap-4 sm:grid-cols-[auto_1fr] sm:items-center">
              <div className="flex flex-col items-start">
                <div className="text-[10px] font-bold uppercase tracking-[2px] text-white/45">Customer Acquisition Score</div>
                <div className="font-display text-6xl font-bold text-white sm:text-7xl">
                  {diag.score}<span className="text-2xl text-sky">/100</span>
                </div>
                <div className={`mt-1 text-sm font-bold ${scoreTier.tone}`}>{scoreTier.label}</div>
              </div>
              <div className="space-y-2.5">
                {(Object.entries(diag.pillar_scores) as [Pillar, number][]).map(([p, s]) => (
                  <div key={p}>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold uppercase tracking-wider text-white/70">{pillarMeta[p].label}</span>
                      <span className="font-mono text-white/60">{s}/100</span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/5">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${s}%` }} transition={{ duration: 0.9, delay: 0.2 }} className={`h-full ${s >= 65 ? "bg-emerald-400" : s >= 40 ? "bg-amber" : "bg-red-400"}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <Card title="Strengths" tone="emerald" items={diag.report.strengths} />
            <Card title="Bottlenecks" tone="red" items={diag.report.bottlenecks} />
            <Card title="Opportunities" tone="sky" items={diag.report.opportunities} />
            <Card title="Where you are now" tone="amber" items={[`Industry: ${diag.industry || "Unspecified"}`, `Business: ${diag.business_name || "Unspecified"}`, `Report generated: ${new Date(diag.created_at).toLocaleDateString()}`]} />
          </div>

          <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-9">
            <div className="text-[10px] font-bold uppercase tracking-[3px] text-amber">Priority Recommendations</div>
            <h2 className="mt-2 font-display text-2xl font-bold text-white sm:text-3xl">What to do next</h2>
            <div className="mt-6 space-y-4">
              {diag.report.recommendations.map((r, i) => (
                <div key={i} className="flex gap-4">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-amber to-brand font-display text-lg font-bold text-white">{i + 1}</div>
                  <div>
                    <div className="font-display text-lg font-bold text-white">{r.title}</div>
                    <p className="mt-1 text-sm leading-relaxed text-white/70">{r.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-8 overflow-hidden rounded-3xl border border-amber/30 bg-gradient-to-br from-amber/15 via-amber/5 to-transparent p-6 sm:p-10">
            <div className="text-[10px] font-bold uppercase tracking-[3px] text-amber">Next Step</div>
            <h2 className="mt-2 font-display text-2xl font-bold leading-tight text-white sm:text-3xl">{diag.report.next_step}</h2>
            <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-white/70">
              The report shows the <em>what</em>. In your Strategy Session, a Hiprofeet Growth Strategist walks you through the exact <em>how</em> — built for your industry, your revenue level, your team.
            </p>
            <div className="mt-4 flex items-baseline gap-3">
              <span className="font-display text-3xl font-bold text-white">₦4,500</span>
              <span className="text-white/40 line-through">₦15,000</span>
              <span className="rounded-full bg-amber px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-ink">Introductory</span>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={bookConsultation}
                disabled={booking}
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber to-brand px-7 py-4 text-base font-bold text-white shadow-[0_10px_30px_oklch(0.68_0.17_55/.4)] transition hover:scale-[1.02] active:scale-95 disabled:opacity-60"
              >
                {booked ? "✓ Redirecting to WhatsApp…" : "Book my Strategy Session →"}
              </button>
              <a href="https://wa.me/2349014244117" target="_blank" rel="noopener" className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/[0.03] px-6 py-4 text-sm font-semibold text-white/85 hover:border-white/30">
                Ask a question first
              </a>
            </div>
            <p className="mt-4 text-xs text-white/45">Booking opens a WhatsApp chat with our team at +234 901 424 4117. Payment link is shared after we confirm your slot.</p>
          </motion.div>

          <div className="mt-8 text-center text-xs text-white/40">
            This report is private to {diag.name}. Please do not share the link publicly. · <Link to="/" className="hover:text-white">HIPROFEET home</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function Card({ title, tone, items }: { title: string; tone: "emerald" | "red" | "sky" | "amber"; items: string[] }) {
  const toneMap: Record<string, string> = {
    emerald: "border-emerald-400/25 from-emerald-400/10",
    red: "border-red-400/25 from-red-400/10",
    sky: "border-sky/25 from-sky/10",
    amber: "border-amber/25 from-amber/10",
  };
  const dot: Record<string, string> = { emerald: "bg-emerald-400", red: "bg-red-400", sky: "bg-sky", amber: "bg-amber" };
  return (
    <div className={`rounded-2xl border ${toneMap[tone]} bg-gradient-to-b to-transparent p-5`}>
      <div className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white`}>
        <span className={`h-2 w-2 rounded-full ${dot[tone]}`} />
        {title}
      </div>
      <ul className="mt-3 space-y-2 text-sm leading-relaxed text-white/75">
        {items.map((it, i) => <li key={i} className="flex gap-2"><span className="mt-1 text-white/30">•</span><span>{it}</span></li>)}
      </ul>
    </div>
  );
}
