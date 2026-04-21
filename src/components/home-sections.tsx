import { Link } from "@tanstack/react-router";
import { SERVICE_LIST } from "@/data/services";

const TICKER = ["Free Diagnosis", "Facebook Ads", "Instagram Ads", "TikTok Ads", "Website Dev", "Google Reviews", "Facebook Reviews", "Video Testimonials", "Real Followers", "Marketing Consultant", "Email Automation", "Logo & Brand", "Sales Support"];

export function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-ink px-5 pt-24 pb-16">
      <div aria-hidden className="hero-grid-bg pointer-events-none absolute inset-0" />
      <div aria-hidden className="pointer-events-none absolute -top-32 -right-24 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,oklch(0.45_0.20_265/.2)_0%,transparent_70%)]" />
      <div aria-hidden className="pointer-events-none absolute -bottom-16 -left-16 h-[300px] w-[300px] rounded-full bg-[radial-gradient(circle,oklch(0.68_0.17_55/.07)_0%,transparent_70%)]" />

      <div className="container-page relative z-10 grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber/25 bg-amber/10 px-4 py-2 text-[10px] font-semibold uppercase tracking-[3px] text-amber">
            <span className="pulse-dot inline-block h-[6px] w-[6px] rounded-full bg-amber" />
            Free AI Business Tool · Nigeria
          </div>
          <h1 className="font-display text-[clamp(38px,8vw,72px)] font-bold leading-[1.08] tracking-tight text-white">
            Your business<br />growth partner<br />
            <span className="italic text-amber">is ready for you.</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg font-light leading-[1.78] text-white/70">
            Tell it what's going on. It listens, adapts to you, finds exactly what's limiting your growth — and tells you how to fix it. Free, in under 3 minutes.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:max-w-md">
            <Link
              to="/advisor"
              className="cta-pulse flex items-center justify-center gap-2 rounded-2xl bg-amber px-8 py-[18px] text-[17px] font-bold text-white shadow-[0_6px_24px_oklch(0.68_0.17_55/.4)] transition active:scale-[0.97]"
            >
              Start Free Diagnosis →
            </Link>
            <a href="#services" className="flex items-center justify-center rounded-2xl border border-white/25 px-7 py-4 text-base font-medium text-white/75 transition hover:border-white/50 hover:text-white">
              View Services
            </a>
          </div>
          <div className="mt-10 flex items-center gap-3">
            <div className="flex">
              {[
                "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=64&h=64&fit=crop&crop=face&q=72",
                "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=64&h=64&fit=crop&crop=face&q=72",
                "https://images.unsplash.com/photo-1607990283143-e81e7a2c9349?w=64&h=64&fit=crop&crop=face&q=72",
                "https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=64&h=64&fit=crop&crop=face&q=72",
              ].map((src, i) => (
                <img key={src} src={src} alt="" loading="eager" className={`h-8 w-8 rounded-full border-2 border-white/15 object-cover ${i ? "-ml-2" : ""}`} />
              ))}
            </div>
            <div className="text-[13px] leading-tight text-white/50">
              <strong className="text-white/85">200+ businesses helped</strong>
              <br />across Lagos, Abuja & beyond
            </div>
          </div>
        </div>

        <div className="relative hidden lg:block">
          <div className="relative h-[440px] w-[320px] overflow-hidden rounded-2xl shadow-[0_32px_80px_oklch(0.18_0.04_260/.55),0_0_0_1px_rgba(255,255,255,.08)]">
            <img src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=560&h=720&fit=crop&crop=faces&q=76" alt="Business growth partner" className="h-full w-full object-cover object-top" />
            <div className="float-card absolute -right-8 top-6 flex items-center gap-3 rounded-2xl bg-white/95 px-4 py-3 shadow-2xl">
              <div className="text-xl">📈</div>
              <div>
                <div className="font-display text-lg font-bold leading-none text-t-dark">3.2×</div>
                <div className="mt-1 text-[10px] text-t-soft">Avg revenue lift</div>
              </div>
            </div>
            <div className="float-card absolute -right-7 bottom-20 flex items-center gap-3 rounded-2xl bg-white/95 px-4 py-3 shadow-2xl" style={{ animationDelay: "1.6s" }}>
              <div className="text-xl">⚡</div>
              <div>
                <div className="font-display text-lg font-bold leading-none text-t-dark">Free</div>
                <div className="mt-1 text-[10px] text-t-soft">AI Diagnosis</div>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-5 -left-6 h-[170px] w-[140px] overflow-hidden rounded-2xl border-[3px] border-ink shadow-[0_16px_44px_oklch(0.18_0.04_260/.5)]">
            <img src="https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=280&h=320&fit=crop&crop=face&q=72" alt="" className="h-full w-full object-cover object-top" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function Ticker() {
  const items = [...TICKER, ...TICKER];
  return (
    <div aria-hidden className="overflow-hidden border-y border-white/5 bg-ink-2 py-3">
      <div className="ticker-track flex whitespace-nowrap">
        {items.map((t, i) => (
          <span key={i} className="inline-flex items-center gap-2 px-6 text-[11px] font-semibold uppercase tracking-[1.5px] text-white/25">
            <span className="h-1 w-1 rounded-full bg-amber" />
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

const STEPS = [
  { num: "01", icon: "🤝", title: "Talk to the AI", body: "Describe your business in your own words. The AI adapts to how you speak — pidgin, formal, brief or detailed. No scripts.", free: true },
  { num: "02", icon: "🧠", title: "Get a real diagnosis", body: "Not generic advice. A specific finding — what's limiting your growth, why it's happening, and what it's costing you monthly." },
  { num: "03", icon: "⚡", title: "Decide your move", body: "Apply the insight yourself — or let our experts execute it in 2–5 days. Either way, you leave with more clarity than you came with." },
  { num: "04", icon: "📈", title: "See the difference", body: "Businesses that act on the diagnosis grow faster. The gap doesn't close itself — but you now know exactly where it is." },
];

export function HowItWorks() {
  return (
    <section id="how" className="relative overflow-hidden bg-ink px-5 py-20">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_75%_50%,oklch(0.45_0.20_265/.18)_0%,transparent_70%)]" />
      <div className="container-page relative">
        <div className="mb-4 inline-flex items-center gap-2.5">
          <div className="h-[2.5px] w-5 rounded-full bg-amber" />
          <div className="text-[11px] font-bold uppercase tracking-[3.5px] text-amber">How It Works</div>
        </div>
        <h2 className="font-display text-[clamp(32px,6vw,52px)] font-bold leading-[1.14] text-white">
          From one conversation<br />to <em className="text-amber">real results.</em>
        </h2>
        <p className="mt-4 max-w-2xl text-lg font-light leading-[1.78] text-white/65">
          No jargon. No forms. No tech knowledge needed. Just talk to the AI like you'd talk to a trusted advisor — it does the rest.
        </p>
        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <div key={s.num} className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur-sm transition hover:-translate-y-1 hover:border-brand/40 hover:bg-white/[0.06]">
              {s.free && <div className="mb-3 inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300">✦ Always Free</div>}
              <div className="font-display text-[52px] font-bold italic leading-none text-white/5">{s.num}</div>
              <div className="mt-3 text-3xl">{s.icon}</div>
              <div className="mt-2 text-base font-bold text-white">{s.title}</div>
              <div className="mt-2 text-sm font-light leading-[1.72] text-white/55">{s.body}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const STATS = [
  { n: "200+", l: "Businesses Helped" },
  { n: "Free", l: "Always Free" },
  { n: "3×", l: "Revenue Lift" },
  { n: "2–5", l: "Days to Execute" },
];

const TESTIMONIALS = [
  { num: "3.2×", lbl: "Revenue increase", text: "The AI found it in 3 minutes — 6 months of posting with no system behind it. They set up my ads. Revenue tripled in 30 days.", name: "Amaka Okafor", biz: "Fashion · Lagos", tag: "Instagram Ads", img: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=72&h=72&fit=crop&crop=face&q=74" },
  { num: "₦840K", lbl: "New revenue, 90 days", text: "The AI diagnosed it instantly — no website meant clients searched and found nothing. HIPROFEET built it in 4 days. ₦840K in new deals that quarter.", name: "Chidi Nwosu", biz: "Logistics · Abuja", tag: "Website Dev", img: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=72&h=72&fit=crop&crop=face&q=74" },
  { num: "68%", lbl: "More repeat buyers", text: "I didn't know a retention gap existed until the AI showed me. Email automation now runs by itself and brings back 68% of past buyers every month.", name: "Ngozi Eze", biz: "Ecommerce · Port Harcourt", tag: "Email Automation", img: "https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=72&h=72&fit=crop&crop=face&q=74" },
];

export function Testimonials() {
  return (
    <section className="bg-ink px-5 py-20">
      <div className="container-page">
        <div className="mb-4 inline-flex items-center gap-2.5">
          <div className="h-[2.5px] w-5 rounded-full bg-amber" />
          <div className="text-[11px] font-bold uppercase tracking-[3.5px] text-amber">Real Results</div>
        </div>
        <h2 className="font-display text-[clamp(32px,6vw,52px)] font-bold leading-[1.14] text-white">
          Nigerian businesses.<br /><em className="text-amber">Real growth.</em>
        </h2>
        <p className="mt-3 text-base text-white/60">Diagnosed by the same AI — then fixed by our team.</p>

        <div className="mt-10 grid grid-cols-2 overflow-hidden rounded-2xl border border-white/10 bg-white/5 sm:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.l} className="border-r border-b border-white/10 bg-white/[0.02] p-5 text-center last:border-r-0 sm:border-b-0">
              <div className="font-display text-2xl font-bold leading-none text-white">{s.n}</div>
              <div className="mt-1 text-[10px] font-medium uppercase tracking-wider text-white/35">{s.l}</div>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="rounded-2xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-md transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.07]">
              <div className="font-display text-[36px] font-bold leading-none text-emerald-400">{t.num}</div>
              <div className="mt-1 text-[10px] uppercase tracking-[1.5px] text-white/35">{t.lbl}</div>
              <div className="mt-3 tracking-wider text-amber">★★★★★</div>
              <p className="mt-3 text-sm font-light leading-[1.78] text-white/72">"{t.text}"</p>
              <div className="mt-5 flex items-center gap-3">
                <img src={t.img} alt="" className="h-9 w-9 rounded-full object-cover" loading="lazy" />
                <div>
                  <div className="text-sm font-semibold text-white">{t.name}</div>
                  <div className="text-[11px] text-white/40">{t.biz}</div>
                  <div className="mt-1 inline-block rounded-full bg-emerald-500/25 px-2 py-0.5 text-[10px] font-bold text-emerald-300">{t.tag}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const BADGE_CLASS: Record<string, string> = {
  popular: "bg-brand text-white",
  trust: "bg-success text-white",
  quick: "bg-amber text-white",
};

export function Services() {
  return (
    <section id="services" className="bg-cream px-5 py-20">
      <div className="container-page">
        <div className="mb-4 inline-flex items-center gap-2.5">
          <div className="h-[2.5px] w-5 rounded-full bg-brand" />
          <div className="text-[11px] font-bold uppercase tracking-[3.5px] text-brand">Expert Services</div>
        </div>
        <h2 className="font-display text-[clamp(32px,6vw,52px)] font-bold leading-[1.14] text-t-dark">
          When you're ready<br />to <em className="text-brand">execute.</em>
        </h2>
        <div className="my-7 flex items-start gap-3 rounded-2xl border border-success/25 bg-success/10 p-4 text-sm leading-relaxed text-success">
          🎯 <span><strong className="font-bold">The AI diagnosis is always free.</strong> These services are optional — only for businesses that want our team to execute. The AI recommends the right one after your chat.</span>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICE_LIST.map((s) => (
            <Link
              key={s.id}
              to="/order/$id"
              params={{ id: s.id }}
              className="group flex flex-col overflow-hidden rounded-2xl border border-brand/10 bg-white shadow-sm transition hover:-translate-y-1 hover:border-brand/25 hover:shadow-xl"
            >
              <div className="relative h-32 overflow-hidden">
                <img src={s.img} alt={s.name} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-ink/55" />
                <span className={`absolute left-2.5 top-2.5 rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider ${BADGE_CLASS[s.badge]}`}>{s.badgeTxt}</span>
              </div>
              <div className="flex flex-1 flex-col p-4">
                <div className="text-2xl">{s.icon}</div>
                <div className="font-display text-base font-bold leading-tight text-t-dark">{s.name}</div>
                <div className="mt-1 text-xs font-light leading-relaxed text-t-mid">{s.tag}</div>
                <div className="mt-3 rounded-md border border-ember/15 bg-ember/5 p-2 text-[11px] leading-relaxed text-ember">
                  ⚠ {s.pain}
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-brand/10 pt-3">
                  <div>
                    <div className="font-display text-base font-bold text-t-dark">{s.price}</div>
                    <div className="text-[10px] text-t-soft">{s.period}</div>
                  </div>
                  <span className="rounded-full bg-t-dark px-3.5 py-2 text-[11px] font-bold text-white transition group-hover:bg-brand">Order</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-ink px-5 py-20">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_65%_40%,oklch(0.45_0.20_265/.28)_0%,transparent_70%),radial-gradient(ellipse_40%_40%_at_20%_80%,oklch(0.68_0.17_55/.08)_0%,transparent_60%)]" />
      <div className="container-page relative grid gap-10 md:grid-cols-2 md:items-center">
        <div className="overflow-hidden rounded-3xl shadow-[0_32px_80px_oklch(0.18_0.04_260/.45),0_0_0_1px_rgba(255,255,255,.07)]">
          <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=900&h=600&fit=crop&crop=faces&q=72" alt="" loading="lazy" className="h-full w-full object-cover" />
        </div>
        <div>
          <div className="mb-4 inline-flex items-center gap-2.5">
            <div className="h-[2.5px] w-5 rounded-full bg-amber" />
            <div className="text-[11px] font-bold uppercase tracking-[3.5px] text-amber">Stop Waiting</div>
          </div>
          <h2 className="font-display text-[clamp(32px,5vw,48px)] font-bold leading-[1.14] text-white">
            Every day you wait<br />is another day your<br /><em className="text-amber">competitors win.</em>
          </h2>
          <p className="mt-4 text-lg font-light leading-[1.78] text-white/65">
            Your problem won't fix itself. A 3-minute conversation and 5 days of expert work can change your trajectory entirely.
          </p>
          <Link to="/advisor" className="cta-pulse mt-7 inline-flex items-center justify-center gap-2 rounded-2xl bg-amber px-8 py-[18px] text-[17px] font-bold text-white shadow-[0_6px_24px_oklch(0.68_0.17_55/.4)] transition active:scale-[0.97]">
            Start Free — Talk to the AI →
          </Link>
          <div className="mt-6 flex flex-col gap-2.5">
            {["Always free to diagnose", "No signup needed", "Expert execution from ₦8,000", "Results in 2–5 days"].map((c) => (
              <div key={c} className="flex items-center gap-2 text-sm font-light text-white/65">
                <span className="text-[15px] font-bold text-amber">✓</span>{c}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
