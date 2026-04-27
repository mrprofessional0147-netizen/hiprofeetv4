import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import { Reveal, Stagger, itemVariants, MotionItem } from "@/components/motion";
import { SERVICE_LIST } from "@/data/services";
import heroFounder from "@/assets/hero-founder.jpg";
import founder2 from "@/assets/founder-2.jpg";
import founder3 from "@/assets/founder-3.jpg";
import founder4 from "@/assets/founder-4.jpg";
import founder5 from "@/assets/founder-5.jpg";
import lagosSkyline from "@/assets/lagos-skyline.jpg";

const TICKER = ["Free Diagnosis", "Facebook Ads", "Instagram Ads", "TikTok Ads", "Website Dev", "Google Reviews", "Facebook Reviews", "Video Testimonials", "Real Followers", "Marketing Consultant", "Email Automation", "Logo & Brand", "Sales Support"];

/* ─────────────────────────  HERO  ───────────────────────── */
export function Hero() {
  const reduce = useReducedMotion();
  return (
    <section className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-ink px-5 pt-28 pb-20">
      <div aria-hidden className="hero-grid-bg pointer-events-none absolute inset-0" />
      {/* Sky-blue luxury aurora glows */}
      <div aria-hidden className="aurora-blob glow-breathe pointer-events-none absolute -top-40 -right-32 h-[620px] w-[620px] rounded-full bg-[radial-gradient(circle,oklch(0.78_0.13_230/.28)_0%,transparent_70%)]" />
      <div aria-hidden className="aurora-blob pointer-events-none absolute top-1/3 -left-40 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,oklch(0.45_0.20_265/.22)_0%,transparent_70%)]" style={{ animationDelay: "-8s" }} />
      <div aria-hidden className="aurora-blob pointer-events-none absolute -bottom-24 right-1/4 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,oklch(0.68_0.17_55/.10)_0%,transparent_70%)]" style={{ animationDelay: "-14s" }} />

      <div className="container-page relative z-10 grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-sky/30 bg-sky/10 px-4 py-2 text-[10px] font-semibold uppercase tracking-[3px] text-sky"
          >
            <span className="pulse-dot inline-block h-[6px] w-[6px] rounded-full bg-sky" />
            AI Growth Partner · Built for Nigeria
          </motion.div>
          <h1 className="font-display text-[clamp(40px,8vw,76px)] font-bold leading-[1.05] tracking-tight text-white">
            <motion.span
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.7 }}
              className="block"
            >
              Grow your business
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="text-gradient-animate bg-gradient-to-r from-sky-2 via-sky to-amber bg-clip-text italic text-transparent"
            >
              two simple ways.
            </motion.span>
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45, duration: 0.7 }}
            className="mt-6 max-w-xl text-lg font-light leading-[1.78] text-white/70"
          >
            Talk to our AI advisor for a free diagnosis of what's slowing your sales — or jump straight in and order the exact service you need. Done in days, not months.
          </motion.p>

          {/* TWO CLEAR PATHS */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.55 } } }}
            className="mt-9 grid gap-3 sm:grid-cols-2 sm:max-w-2xl"
          >
            <motion.div variants={itemVariants}>
              <Link
                to="/advisor"
                className="shimmer-border lift group relative block overflow-hidden rounded-2xl border border-sky/40 bg-gradient-to-br from-sky/20 via-brand/15 to-transparent p-5 hover:border-sky hover:from-sky/30"
              >
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[2px] text-sky">
                  <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-sky" /> Free · No signup
                </div>
                <div className="mt-2 font-display text-xl font-bold text-white">💬 Chat with AI Advisor</div>
                <div className="mt-1 text-[13px] leading-snug text-white/65">
                  Not sure what you need? Describe your problem — get a real diagnosis in 60 seconds.
                </div>
                <div className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-bold text-sky-2 transition-all group-hover:gap-2.5">
                  Start Free Diagnosis <motion.span animate={reduce ? {} : { x: [0, 4, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>→</motion.span>
                </div>
              </Link>
            </motion.div>

            <motion.div variants={itemVariants}>
              <a
                href="#services"
                className="lift group relative block overflow-hidden rounded-2xl border border-amber/40 bg-gradient-to-br from-amber/20 via-amber/5 to-transparent p-5 hover:border-amber hover:from-amber/30"
              >
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[2px] text-amber">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber" /> Order in 2 minutes
                </div>
                <div className="mt-2 font-display text-xl font-bold text-white">🛒 Browse Services</div>
                <div className="mt-1 text-[13px] leading-snug text-white/65">
                  Already know what you need? Pick a service from ₦8,000 — delivered in 2–5 days.
                </div>
                <div className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-bold text-amber transition-all group-hover:gap-2.5">
                  See All Services →
                </div>
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-[13px] text-white/55"
          >
            {["No card required", "Pay by bank transfer", "Built for Nigeria"].map((c) => (
              <div key={c} className="flex items-center gap-2">
                <span className="text-sky">✓</span>
                {c}
              </div>
            ))}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05, duration: 0.6 }}
            className="mt-10 flex items-center gap-4"
          >
            <div className="flex">
              {[heroFounder, founder2, founder3, founder5].map((src, i) => (
                <img
                  key={src}
                  src={src}
                  alt=""
                  className={`h-10 w-10 rounded-full border-2 border-ink object-cover transition hover:scale-110 hover:z-10 ${i ? "-ml-3" : ""}`}
                />
              ))}
            </div>
            <div className="text-[13px] leading-tight text-white/55">
              <div className="flex items-center gap-1.5 text-amber">
                {"★★★★★".split("").map((s, i) => <span key={i}>{s}</span>)}
                <span className="ml-1.5 font-semibold text-white">4.9/5</span>
              </div>
              <div className="mt-0.5">from <strong className="text-white/85">200+</strong> Nigerian founders</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Hero visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <motion.div
            animate={reduce ? {} : { y: [0, -10, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="tilt relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[28px] shadow-[0_40px_100px_oklch(0.78_0.13_230/.35),0_0_0_1px_oklch(0.78_0.13_230/.15)]"
          >
            <img
              src={heroFounder}
              alt="Nigerian founder using HIPROFEET"
              fetchPriority="high"
              width={1024}
              height={1280}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-sky/10" />

            {/* Diagnosis card overlay */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="absolute left-4 right-4 bottom-4 rounded-2xl border border-sky/25 bg-ink/80 p-4 backdrop-blur-xl"
            >
              <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[2px] text-sky">
                <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-emerald-400" />
                AI Diagnosis · Live
              </div>
              <div className="mt-2 font-display text-[15px] font-bold leading-snug text-white caret-blink">
                "Your retention gap is costing ₦340K/month. Fix in 2 days."
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3 text-[11px]">
                <span className="text-white/55">Email Automation · ₦20,000</span>
                <span className="rounded-full bg-amber px-2.5 py-1 font-bold text-white">Recommended</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Floating stats */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            className="float-card absolute -left-2 top-10 hidden rounded-2xl border border-sky/20 bg-white/95 px-4 py-3 shadow-2xl sm:flex sm:items-center sm:gap-3"
          >
            <div className="grid h-9 w-9 place-items-center rounded-full bg-sky/20 text-base">📈</div>
            <div>
              <div className="font-display text-lg font-bold leading-none text-t-dark">3.2×</div>
              <div className="mt-1 text-[10px] text-t-soft">Avg revenue lift</div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.25, duration: 0.6 }}
            className="float-card absolute -right-2 bottom-24 hidden rounded-2xl border border-amber/20 bg-white/95 px-4 py-3 shadow-2xl sm:flex sm:items-center sm:gap-3"
            style={{ animationDelay: "1.6s" }}
          >
            <div className="grid h-9 w-9 place-items-center rounded-full bg-amber/15 text-base">⚡</div>
            <div>
              <div className="font-display text-lg font-bold leading-none text-t-dark">2–5d</div>
              <div className="mt-1 text-[10px] text-t-soft">Expert delivery</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────  TICKER  ───────────────────────── */
export function Ticker() {
  const items = [...TICKER, ...TICKER];
  return (
    <div aria-hidden className="overflow-hidden border-y border-white/5 bg-ink-2 py-3">
      <div className="ticker-track flex whitespace-nowrap">
        {items.map((t, i) => (
          <span key={i} className="inline-flex items-center gap-2 px-6 text-[11px] font-semibold uppercase tracking-[1.5px] text-white/30">
            <span className="h-1 w-1 rounded-full bg-amber" />
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────  TRUST BAR  ───────────────────────── */
export function TrustBar() {
  const cities = ["Lagos", "Abuja", "Port Harcourt", "Ibadan", "Kano", "Benin", "Enugu", "Uyo"];
  return (
    <section className="bg-ink-2 px-5 py-10">
      <div className="container-page">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[3px] text-white/40">
          Trusted by entrepreneurs across Nigeria
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {cities.map((c) => (
            <span key={c} className="font-display text-lg font-bold text-white/35 transition hover:text-white/60">
              {c}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────  PRODUCT PREVIEW  ───────────────────────── */
export function ProductPreview() {
  return (
    <section className="relative overflow-hidden bg-ink px-5 py-24">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,oklch(0.45_0.20_265/.16)_0%,transparent_70%)]" />
      <div className="container-page relative">
        <Reveal className="mx-auto max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2.5">
            <div className="h-[2.5px] w-5 rounded-full bg-amber" />
            <div className="text-[11px] font-bold uppercase tracking-[3.5px] text-amber">The Product</div>
            <div className="h-[2.5px] w-5 rounded-full bg-amber" />
          </div>
          <h2 className="font-display text-[clamp(32px,5.5vw,52px)] font-bold leading-[1.1] text-white">
            A real conversation.<br />
            <em className="text-amber">A real plan.</em>
          </h2>
          <p className="mt-4 text-base font-light leading-[1.78] text-white/65">
            No forms. No surveys. Just talk to the AI like you would a trusted business partner — in pidgin, English, formal or casual. It listens, asks the right questions, and delivers a precise diagnosis.
          </p>
        </Reveal>

        {/* Mock chat product UI */}
        <Reveal y={40} delay={0.1} className="mt-14 mx-auto max-w-4xl overflow-hidden rounded-[24px] border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] shadow-[0_40px_120px_oklch(0.18_0.04_260/.6)]">
          {/* Top bar */}
          <div className="flex items-center justify-between border-b border-white/10 bg-ink-2/80 px-5 py-3">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
              <div className="h-2.5 w-2.5 rounded-full bg-amber/70" />
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
            </div>
            <div className="flex items-center gap-2 text-[11px] font-semibold text-white/50">
              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-emerald-400" />
              hiprofeet.ai / advisor
            </div>
            <div className="text-[11px] text-white/30">Free · No login</div>
          </div>

          {/* Chat */}
          <div className="grid gap-0 md:grid-cols-[1fr_320px]">
            <Stagger className="space-y-4 p-6 sm:p-8" stagger={0.18}>
              <ChatBubble role="ai">Hi! I'm your free business growth partner. Tell me — what kind of business do you run, and what's frustrating you most right now?</ChatBubble>
              <ChatBubble role="user">I sell women's fashion on Instagram in Lagos. I post every day but sales are slow. Just ₦180k last month.</ChatBubble>
              <ChatBubble role="ai">Got it. Quick question — when someone DMs asking about a dress, how long before you reply, and do you follow up if they don't respond?</ChatBubble>
              <ChatBubble role="user">Sometimes hours later. And no, I don't follow up.</ChatBubble>
              <ChatBubble role="ai" highlight>
                <strong className="block font-display text-amber">Diagnosis</strong>
                You're losing ~68% of warm leads in the follow-up gap. That's roughly ₦380K/month leaving the table. The fix is a 3-step automated sequence + paid Instagram traffic to scale it. Estimated lift: 2.5–3.5×.
              </ChatBubble>
              <MotionItem variants={itemVariants} className="flex flex-wrap gap-2 pt-2">
                <button type="button" className="rounded-full bg-amber px-4 py-2 text-[12px] font-bold text-white transition hover:scale-105 active:scale-95">
                  📋 See recommended fix
                </button>
                <button type="button" className="rounded-full border border-white/20 px-4 py-2 text-[12px] font-semibold text-white/75 transition hover:border-white/40">
                  Ask a follow-up
                </button>
              </MotionItem>
            </Stagger>

            {/* Side panel */}
            <div className="border-t border-white/10 bg-white/[0.02] p-6 md:border-t-0 md:border-l">
              <div className="text-[10px] font-semibold uppercase tracking-[2px] text-white/40">Recommended Service</div>
              <motion.div whileHover={{ y: -3 }} className="mt-3 rounded-xl border border-amber/30 bg-amber/10 p-4">
                <div className="text-2xl">✉️</div>
                <div className="mt-2 font-display text-base font-bold text-white">Email + DM Automation</div>
                <div className="mt-1 text-[11px] text-white/55">Win back the 68% you're losing.</div>
                <div className="mt-3 flex items-end justify-between border-t border-white/10 pt-3">
                  <div>
                    <div className="font-display text-lg font-bold text-white">₦20,000</div>
                    <div className="text-[10px] text-white/45">2–3 days delivery</div>
                  </div>
                  <span className="rounded-full bg-amber px-3 py-1.5 text-[10px] font-bold text-white">Order</span>
                </div>
              </motion.div>
              <div className="mt-5 space-y-2 text-[12px] text-white/55">
                {["Confidential, no logins", "Switch language anytime", "Save your full report"].map((t) => (
                  <div key={t} className="flex items-center gap-2">
                    <span className="text-amber">✓</span>{t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ChatBubble({ role, children, highlight }: { role: "ai" | "user"; children: React.ReactNode; highlight?: boolean }) {
  if (role === "user") {
    return (
      <motion.div variants={itemVariants} className="flex justify-end">
        <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-amber/95 px-4 py-3 text-[14px] leading-relaxed text-white shadow-lg">
          {children}
        </div>
      </motion.div>
    );
  }
  return (
    <motion.div variants={itemVariants} className="flex gap-3">
      <div className="grid h-8 w-8 flex-none place-items-center rounded-full bg-gradient-to-br from-brand to-brand-2 font-display text-[11px] font-bold text-white">AI</div>
      <div className={`max-w-[80%] rounded-2xl rounded-tl-sm px-4 py-3 text-[14px] leading-relaxed ${highlight ? "border border-amber/40 bg-amber/10 text-white" : "bg-white/[0.06] text-white/80"}`}>
        {children}
      </div>
    </motion.div>
  );
}

/* ─────────────────────────  FEATURES  ───────────────────────── */
const FEATURES = [
  { icon: "🧠", title: "Trained on Nigerian businesses", body: "200+ real diagnoses across fashion, food, logistics, ecommerce, services. It speaks your market." },
  { icon: "🗣️", title: "Talks how you talk", body: "Pidgin, formal English, voice notes — the AI adapts. No jargon, no scripts, no awkward forms." },
  { icon: "🎯", title: "Specific, not generic", body: "Every diagnosis names the exact bottleneck, the cost in ₦, and the right fix. No 'work harder' fluff." },
  { icon: "⚡", title: "Done-for-you execution", body: "Like the diagnosis? Our experts execute in 2–5 days. From ₦8,000. Or take it and run yourself — your call." },
  { icon: "🔒", title: "Private & confidential", body: "No login, no email capture, no spam. Your business numbers stay between you and the AI." },
  { icon: "🇳🇬", title: "Naira-first pricing", body: "No dollar conversions, no hidden fees. Pay by transfer to a Nigerian bank. Built for our economy." },
];

export function Features() {
  return (
    <section className="bg-ink-2 px-5 py-24">
      <div className="container-page">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <Reveal>
            <div className="mb-4 inline-flex items-center gap-2.5">
              <div className="h-[2.5px] w-5 rounded-full bg-amber" />
              <div className="text-[11px] font-bold uppercase tracking-[3.5px] text-amber">Why HIPROFEET</div>
            </div>
            <h2 className="font-display text-[clamp(32px,5vw,46px)] font-bold leading-[1.12] text-white">
              Built for the way<br />
              <em className="text-amber">Nigerians actually</em><br />
              do business.
            </h2>
            <p className="mt-5 text-base font-light leading-[1.78] text-white/60">
              Generic Western marketing tools don't understand Lagos traffic, WhatsApp orders, or BVN trust. HIPROFEET does — because it was built here, for here.
            </p>
          </Reveal>
          <Stagger className="grid gap-3 sm:grid-cols-2">
            {FEATURES.map((f) => (
              <MotionItem
                key={f.title}
                variants={itemVariants}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-amber/30 hover:bg-white/[0.06]"
              >
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber/15 text-xl transition group-hover:scale-110 group-hover:bg-amber/25">
                  {f.icon}
                </div>
                <div className="mt-4 font-display text-[17px] font-bold leading-tight text-white">{f.title}</div>
                <div className="mt-2 text-[13px] font-light leading-[1.7] text-white/55">{f.body}</div>
              </MotionItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────  HOW IT WORKS  ───────────────────────── */
const STEPS = [
  { num: "01", title: "Talk to the AI", body: "Describe your business in your own words. Pidgin, formal, brief or detailed — no scripts. Free, always." },
  { num: "02", title: "Get a real diagnosis", body: "A specific finding: what's limiting growth, why, and what it's costing you each month." },
  { num: "03", title: "Decide your move", body: "Apply the insight yourself — or let our experts execute it in 2–5 days from ₦8,000." },
  { num: "04", title: "See the difference", body: "Businesses that act on the diagnosis grow faster. The gap won't close itself." },
];

export function HowItWorks() {
  return (
    <section id="how" className="relative overflow-hidden bg-ink px-5 py-24">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_75%_50%,oklch(0.45_0.20_265/.18)_0%,transparent_70%)]" />
      <div className="container-page relative">
        <div className="grid gap-14 lg:grid-cols-[1fr_1fr] lg:items-center">
          <Reveal y={40} className="relative order-2 lg:order-1">
            <div className="tilt relative aspect-[4/5] overflow-hidden rounded-[28px] shadow-[0_40px_100px_oklch(0.18_0.04_260/.55),0_0_0_1px_rgba(255,255,255,.06)]">
              <img src={founder3} alt="Nigerian fashion entrepreneur" loading="lazy" width={1024} height={1280} className="h-full w-full object-cover transition duration-700 hover:scale-105" />
            </div>
            <div className="absolute -bottom-6 -right-4 hidden w-56 overflow-hidden rounded-2xl border-4 border-ink shadow-2xl sm:block">
              <img src={founder2} alt="" loading="lazy" width={768} height={896} className="aspect-square w-full object-cover" />
            </div>
            <div className="float-card absolute -top-5 -left-3 hidden rounded-2xl bg-white px-4 py-3 shadow-2xl sm:block">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-t-soft">Avg time</div>
              <div className="font-display text-2xl font-bold text-t-dark">2.4 min</div>
              <div className="text-[10px] text-t-soft">to a real diagnosis</div>
            </div>
          </Reveal>

          <div className="order-1 lg:order-2">
            <Reveal>
              <div className="mb-4 inline-flex items-center gap-2.5">
                <div className="h-[2.5px] w-5 rounded-full bg-amber" />
                <div className="text-[11px] font-bold uppercase tracking-[3.5px] text-amber">How It Works</div>
              </div>
              <h2 className="font-display text-[clamp(32px,5vw,48px)] font-bold leading-[1.12] text-white">
                From one conversation<br />to <em className="text-amber">real results.</em>
              </h2>
            </Reveal>
            <Stagger className="mt-8 space-y-3">
              {STEPS.map((s) => (
                <MotionItem
                  key={s.num}
                  variants={itemVariants}
                  whileHover={{ x: 4, transition: { duration: 0.2 } }}
                  className="group flex gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-amber/30 hover:bg-white/[0.06]"
                >
                  <div className="grid h-12 w-12 flex-none place-items-center rounded-xl border border-amber/30 bg-amber/10 font-display text-base font-bold text-amber transition group-hover:scale-110 group-hover:bg-amber/25">
                    {s.num}
                  </div>
                  <div>
                    <div className="font-display text-[16px] font-bold text-white">{s.title}</div>
                    <div className="mt-1 text-[13px] font-light leading-[1.7] text-white/55">{s.body}</div>
                  </div>
                </MotionItem>
              ))}
            </Stagger>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────  TESTIMONIALS  ───────────────────────── */
const STATS = [
  { n: "200+", l: "Businesses Helped" },
  { n: "₦340K", l: "Avg new revenue / mo" },
  { n: "3.2×", l: "Avg revenue lift" },
  { n: "2–5", l: "Days to execute" },
];

const TESTIMONIALS = [
  { num: "3.2×", lbl: "Revenue increase", text: "The AI found it in 3 minutes — 6 months of posting with no system behind it. They set up my ads. Revenue tripled in 30 days.", name: "Amaka Okafor", biz: "Fashion · Lagos", tag: "Instagram Ads", img: founder3 },
  { num: "₦840K", lbl: "New revenue, 90 days", text: "The AI diagnosed it instantly — no website meant clients searched and found nothing. HIPROFEET built it in 4 days. ₦840K in new deals that quarter.", name: "Chidi Nwosu", biz: "Logistics · Abuja", tag: "Website Dev", img: founder2 },
  { num: "68%", lbl: "More repeat buyers", text: "I didn't know a retention gap existed until the AI showed me. Email automation now runs by itself and brings back 68% of past buyers every month.", name: "Ngozi Eze", biz: "Ecommerce · Port Harcourt", tag: "Email Automation", img: founder5 },
];

export function Testimonials() {
  return (
    <section className="relative overflow-hidden bg-ink-2 px-5 py-24">
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-30">
        <img src={lagosSkyline} alt="" className="h-full w-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-2 via-ink-2/85 to-ink-2" />
      </div>
      <div className="container-page relative">
        <div className="mb-4 inline-flex items-center gap-2.5">
          <div className="h-[2.5px] w-5 rounded-full bg-amber" />
          <div className="text-[11px] font-bold uppercase tracking-[3.5px] text-amber">Real Results</div>
        </div>
        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
          <h2 className="font-display text-[clamp(32px,5.5vw,52px)] font-bold leading-[1.1] text-white">
            Nigerian businesses.<br />
            <em className="text-amber">Real growth.</em>
          </h2>
          <p className="text-base text-white/55 md:max-w-sm md:text-right">Diagnosed by the same AI you'll use — then fixed by our team.</p>
        </div>

        <Stagger className="mt-12 grid grid-cols-2 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md sm:grid-cols-4" stagger={0.1}>
          {STATS.map((s, i) => (
            <MotionItem
              key={s.l}
              variants={itemVariants}
              className={`p-6 text-center ${i < STATS.length - 1 ? "border-b border-r border-white/10 sm:border-b-0" : "border-b border-white/10 sm:border-b-0"} ${i === 1 ? "border-r-0 sm:border-r" : ""}`}
            >
              <div className="font-display text-3xl font-bold leading-none text-white">{s.n}</div>
              <div className="mt-2 text-[10px] font-semibold uppercase tracking-[1.5px] text-white/40">{s.l}</div>
            </MotionItem>
          ))}
        </Stagger>

        <Stagger className="mt-10 grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <MotionItem
              key={t.name}
              variants={itemVariants}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group flex flex-col rounded-2xl border border-white/10 bg-white/[0.05] p-7 backdrop-blur-md transition hover:border-amber/30 hover:bg-white/[0.08]"
            >
              <div className="flex items-baseline gap-3">
                <div className="font-display text-[40px] font-bold leading-none text-emerald-400">{t.num}</div>
                <div className="text-[10px] uppercase tracking-[1.5px] text-white/40">{t.lbl}</div>
              </div>
              <div className="mt-3 tracking-wider text-amber">★★★★★</div>
              <p className="mt-3 flex-1 text-[14px] font-light leading-[1.78] text-white/75">"{t.text}"</p>
              <div className="mt-6 flex items-center gap-3 border-t border-white/10 pt-5">
                <img src={t.img} alt={t.name} className="h-11 w-11 rounded-full object-cover ring-2 ring-amber/40 transition group-hover:ring-amber" loading="lazy" />
                <div>
                  <div className="text-[14px] font-semibold text-white">{t.name}</div>
                  <div className="text-[11px] text-white/45">{t.biz}</div>
                </div>
                <span className="ml-auto rounded-full bg-emerald-500/20 px-2.5 py-1 text-[10px] font-bold text-emerald-300">{t.tag}</span>
              </div>
            </MotionItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/* ─────────────────────────  SERVICES  ───────────────────────── */
const BADGE_CLASS: Record<string, string> = {
  popular: "bg-brand text-white",
  trust: "bg-success text-white",
  quick: "bg-amber text-white",
};

export function Services() {
  return (
    <section id="services" className="bg-cream px-5 py-24">
      <div className="container-page">
        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <div className="mb-4 inline-flex items-center gap-2.5">
              <div className="h-[2.5px] w-5 rounded-full bg-brand" />
              <div className="text-[11px] font-bold uppercase tracking-[3.5px] text-brand">Expert Services</div>
            </div>
            <h2 className="font-display text-[clamp(32px,5.5vw,52px)] font-bold leading-[1.1] text-t-dark">
              When you're ready<br />to <em className="text-brand">execute.</em>
            </h2>
          </div>
          <Link to="/advisor" className="hidden rounded-full border border-t-dark px-5 py-2.5 text-[12px] font-bold uppercase tracking-wider text-t-dark transition hover:bg-t-dark hover:text-cream md:inline-flex">
            Get matched →
          </Link>
        </div>

        <div className="my-8 flex items-start gap-3 rounded-2xl border border-success/25 bg-success/8 p-5 text-sm leading-relaxed text-success">
          <span className="text-lg">🎯</span>
          <span><strong className="font-bold">The AI diagnosis is always free.</strong> These services are optional — only if you want our team to execute. The AI recommends the right one after your chat.</span>
        </div>

        <Stagger className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.06}>
          {SERVICE_LIST.map((s) => (
            <MotionItem
              key={s.id}
              variants={itemVariants}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
            >
              <Link
                to="/order/$id"
                params={{ id: s.id }}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-brand/10 bg-white shadow-sm transition hover:border-brand/30 hover:shadow-2xl"
              >
                <div className="relative h-36 overflow-hidden">
                  <img src={s.img} alt={s.name} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-ink/55" />
                  <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider ${BADGE_CLASS[s.badge]}`}>{s.badgeTxt}</span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="text-2xl transition duration-300 group-hover:scale-110">{s.icon}</div>
                  <div className="mt-1 font-display text-base font-bold leading-tight text-t-dark">{s.name}</div>
                  <div className="mt-1 text-xs font-light leading-relaxed text-t-mid">{s.tag}</div>
                  <div className="mt-3 rounded-md border border-ember/15 bg-ember/5 p-2 text-[11px] leading-relaxed text-ember">
                    ⚠ {s.pain}
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-brand/10 pt-3">
                    <div>
                      <div className="font-display text-base font-bold text-t-dark">{s.price}</div>
                      <div className="text-[10px] text-t-soft">{s.period}</div>
                    </div>
                    <span className="rounded-full bg-t-dark px-3.5 py-2 text-[11px] font-bold text-white transition group-hover:gap-2 group-hover:bg-brand">Order →</span>
                  </div>
                </div>
              </Link>
            </MotionItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/* ─────────────────────────  FAQ  ───────────────────────── */
const FAQ_ITEMS = [
  { q: "Is the AI diagnosis really free?", a: "Yes — completely. No login, no card, no email capture. We make money only when you choose to hire our team to execute the recommended fix. You can take the diagnosis and apply it yourself, free forever." },
  { q: "How is this different from ChatGPT?", a: "ChatGPT gives generic global advice. HIPROFEET is trained specifically on Nigerian SMB patterns — Lagos buying behaviour, WhatsApp commerce, naira-economy pricing, and the gaps we've fixed for 200+ businesses. It also recommends a specific service and price, not just suggestions." },
  { q: "How fast can your team execute?", a: "Most services deliver in 2–5 working days. Logo & branding ships in 1–2 days. Sales support starts within 24 hours. Every service has a clear delivery window on its order page." },
  { q: "How do payments work?", a: "Bank transfer to our Nigerian Union Bank account. You upload the receipt, we verify within hours, and work begins. No international cards or dollar conversions." },
  { q: "What if I don't want to buy anything?", a: "That's fine. The diagnosis is genuinely free with no follow-up pressure. Many founders use it for clarity before deciding their next move — that alone is valuable." },
];

export function FAQ() {
  return (
    <section className="bg-ink-2 px-5 py-24">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2.5">
            <div className="h-[2.5px] w-5 rounded-full bg-amber" />
            <div className="text-[11px] font-bold uppercase tracking-[3.5px] text-amber">FAQ</div>
            <div className="h-[2.5px] w-5 rounded-full bg-amber" />
          </div>
          <h2 className="font-display text-[clamp(30px,5vw,44px)] font-bold leading-[1.14] text-white">
            Questions, <em className="text-amber">answered.</em>
          </h2>
        </div>
        <Stagger className="mx-auto mt-12 max-w-3xl space-y-3" stagger={0.06}>
          {FAQ_ITEMS.map((item) => (
            <MotionItem key={item.q} variants={itemVariants}>
              <details className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition open:border-amber/30 open:bg-white/[0.05] hover:border-amber/20">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-[16px] font-bold text-white">
                  {item.q}
                  <span className="grid h-7 w-7 flex-none place-items-center rounded-full border border-white/15 text-amber transition duration-300 group-open:rotate-45 group-open:bg-amber/20">+</span>
                </summary>
                <p className="mt-3 text-[14px] font-light leading-[1.78] text-white/65">{item.a}</p>
              </details>
            </MotionItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/* ─────────────────────────  FINAL CTA  ───────────────────────── */
export function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-ink px-5 py-24">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_65%_40%,oklch(0.45_0.20_265/.32)_0%,transparent_70%),radial-gradient(ellipse_40%_40%_at_20%_80%,oklch(0.68_0.17_55/.12)_0%,transparent_60%)]" />
      <div className="container-page relative grid gap-12 md:grid-cols-2 md:items-center">
        <div className="relative">
          <div className="aspect-[4/5] overflow-hidden rounded-[28px] shadow-[0_40px_100px_oklch(0.18_0.04_260/.55),0_0_0_1px_rgba(255,255,255,.06)]">
            <img src={founder4} alt="" loading="lazy" width={512} height={512} className="h-full w-full object-cover" />
          </div>
          <div className="float-card absolute -bottom-5 -right-4 hidden rounded-2xl bg-white px-5 py-4 shadow-2xl sm:block">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-t-soft">Diagnosed today</div>
            <div className="font-display text-2xl font-bold text-t-dark">17 founders</div>
            <div className="mt-1 flex items-center gap-1.5 text-[11px] text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              AI online · respond in 2s
            </div>
          </div>
        </div>
        <div>
          <div className="mb-4 inline-flex items-center gap-2.5">
            <div className="h-[2.5px] w-5 rounded-full bg-amber" />
            <div className="text-[11px] font-bold uppercase tracking-[3.5px] text-amber">Stop Waiting</div>
          </div>
          <h2 className="font-display text-[clamp(32px,5vw,50px)] font-bold leading-[1.1] text-white">
            Every day you wait<br />is another day your<br /><em className="text-amber">competitors win.</em>
          </h2>
          <p className="mt-5 text-lg font-light leading-[1.78] text-white/65">
            A 3-minute conversation today. A 5-day expert sprint this week. A different trajectory by next month.
          </p>
          <Link to="/advisor" className="cta-pulse mt-8 inline-flex items-center justify-center gap-2 rounded-2xl bg-amber px-8 py-[18px] text-[16px] font-bold text-white shadow-[0_6px_24px_oklch(0.68_0.17_55/.4)] transition active:scale-[0.97]">
            Start Free — Talk to the AI →
          </Link>
          <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
            {["Always free to diagnose", "No signup required", "Expert work from ₦8,000", "Results in 2–5 days"].map((c) => (
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
