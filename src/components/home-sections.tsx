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

const TICKER = ["Growth Diagnostics", "Strategy Consultation", "Facebook Ads", "Instagram Ads", "TikTok Ads", "Website Development", "Google Reviews", "Facebook Reviews", "Video Testimonials", "Audience Growth", "Email Automation", "Brand Identity", "Sales Support"];

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
            Business Growth Intelligence · Nigeria
          </motion.div>
          <h1 className="font-display text-[clamp(40px,8vw,76px)] font-bold leading-[1.05] tracking-tight text-white">
            <motion.span
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.7 }}
              className="block"
            >
              Why isn't your business
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="text-gradient-animate bg-gradient-to-r from-sky-2 via-sky to-amber bg-clip-text italic text-transparent"
            >
              growing as fast as it should?
            </motion.span>
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45, duration: 0.7 }}
            className="mt-6 max-w-xl text-xl font-light leading-[1.7] text-white/75 sm:text-[22px]"
          >
            Most business owners don't have a growth problem. They have a clarity problem. Find out what's holding your business back — or get expert help to move forward with confidence.
          </motion.p>

          {/* TWO CLEAR PATHS */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.55 } } }}
            className="mt-9 grid gap-4 sm:grid-cols-2 sm:max-w-2xl"
          >
            <motion.div variants={itemVariants}>
              <Link
                to="/advisor"
                className="shimmer-border lift group relative flex h-full flex-col overflow-hidden rounded-2xl border border-sky/40 bg-gradient-to-br from-sky/20 via-brand/15 to-transparent p-5 hover:border-sky hover:from-sky/30"
              >
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[2px] text-sky">
                  <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-sky" /> Free · Confidential
                </div>
                <div className="mt-2 font-display text-xl font-bold text-white">Find Out What's Holding My Business Back</div>
                <div className="mt-1 text-[13px] leading-snug text-white/65">
                  Not getting the results you expected? Get a personalized business growth review and uncover the biggest factors limiting your growth.
                </div>
                <div className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-sky px-5 py-3 text-sm font-bold text-ink shadow-[0_8px_24px_oklch(0.78_0.13_230/.35)] transition-all group-hover:bg-sky-2 group-hover:shadow-[0_10px_30px_oklch(0.78_0.13_230/.5)]">
                  Find Out Now
                  <motion.span animate={reduce ? {} : { x: [0, 4, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>→</motion.span>
                </div>
              </Link>
            </motion.div>

            <motion.div variants={itemVariants}>
              <a
                href="#services"
                className="lift group relative flex h-full flex-col overflow-hidden rounded-2xl border border-amber/40 bg-gradient-to-br from-amber/20 via-amber/5 to-transparent p-5 hover:border-amber hover:from-amber/30"
              >
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[2px] text-amber">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber" /> Work With Experts
                </div>
                <div className="mt-2 font-display text-xl font-bold text-white">Get Expert Help To Grow</div>
                <div className="mt-1 text-[13px] leading-snug text-white/65">
                  Work with Hiprofeet growth experts to improve visibility, trust, customer acquisition, and business performance.
                </div>
                <div className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber px-5 py-3 text-sm font-bold text-white shadow-[0_8px_24px_oklch(0.68_0.17_55/.4)] transition-all group-hover:brightness-110 group-hover:shadow-[0_10px_30px_oklch(0.68_0.17_55/.55)]">
                  Get Expert Help
                  <motion.span animate={reduce ? {} : { x: [0, 4, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>→</motion.span>
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
            {["No card required", "Naira-priced", "Built for Nigerian operators"].map((c) => (
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
              <div className="mt-0.5">from <strong className="text-white/85">200+</strong> Nigerian operators</div>
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
                Growth Diagnosis · Live
              </div>
              <div className="mt-2 font-display text-[15px] font-bold leading-snug text-white caret-blink">
                "Retention gap is costing ₦340K/month. Closeable in 2 days."
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
            className="float-card absolute left-1 top-6 flex items-center gap-2 rounded-2xl border border-sky/20 bg-white/95 px-3 py-2 shadow-2xl sm:-left-2 sm:top-10 sm:gap-3 sm:px-4 sm:py-3"
          >
            <div className="grid h-8 w-8 place-items-center rounded-full bg-sky/20 text-sm sm:h-9 sm:w-9 sm:text-base">📈</div>
            <div>
              <div className="font-display text-base font-bold leading-none text-t-dark sm:text-lg">3.2×</div>
              <div className="mt-1 text-[9px] text-t-soft sm:text-[10px]">Avg revenue lift</div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.25, duration: 0.6 }}
            className="float-card absolute right-1 bottom-20 flex items-center gap-2 rounded-2xl border border-amber/20 bg-white/95 px-3 py-2 shadow-2xl sm:-right-2 sm:bottom-24 sm:gap-3 sm:px-4 sm:py-3"
            style={{ animationDelay: "1.6s" }}
          >
            <div className="grid h-8 w-8 place-items-center rounded-full bg-amber/15 text-sm sm:h-9 sm:w-9 sm:text-base">⚡</div>
            <div>
              <div className="font-display text-base font-bold leading-none text-t-dark sm:text-lg">2–5d</div>
              <div className="mt-1 text-[9px] text-t-soft sm:text-[10px]">Delivery window</div>
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
          Working with operators across Nigeria
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
            <div className="text-[11px] font-bold uppercase tracking-[3.5px] text-amber">The Method</div>
            <div className="h-[2.5px] w-5 rounded-full bg-amber" />
          </div>
          <h2 className="font-display text-[clamp(32px,5.5vw,52px)] font-bold leading-[1.1] text-white">
            A structured conversation.<br />
            <em className="text-amber">A clear finding.</em>
          </h2>
          <p className="mt-4 text-xl font-light leading-[1.7] text-white/75 sm:text-[22px]">
            No forms. No surveys. A focused dialogue — in pidgin, English, formal or casual — with an advisor trained on Nigerian business patterns. It asks the right questions and returns a specific diagnosis with the cost of inaction.
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
            <div className="text-[11px] text-white/30">Confidential</div>
          </div>

          {/* Chat */}
          <div className="grid gap-0 md:grid-cols-[1fr_320px]">
            <Stagger className="space-y-4 p-6 sm:p-8" stagger={0.18}>
              <ChatBubble role="ai">Welcome. I'm your HIPROFEET growth advisor. Briefly — what does your business do, and what's the single biggest constraint on revenue right now?</ChatBubble>
              <ChatBubble role="user">I sell women's fashion on Instagram in Lagos. I post every day but sales are slow. Just ₦180k last month.</ChatBubble>
              <ChatBubble role="ai">Understood. One question — when a buyer DMs about a dress, what's your average response time, and do you have a follow-up sequence if they go quiet?</ChatBubble>
              <ChatBubble role="user">Sometimes hours later. And no, I don't follow up.</ChatBubble>
              <ChatBubble role="ai" highlight>
                <strong className="block font-display text-amber">Diagnosis</strong>
                Approximately 68% of warm leads are lost in the follow-up gap — roughly ₦380K of monthly revenue forfeited. The intervention: a three-step automated sequence, then paid Instagram traffic to scale qualified DMs. Projected lift: 2.5–3.5×.
              </ChatBubble>
              <MotionItem variants={itemVariants} className="flex flex-wrap gap-2 pt-2">
                <button type="button" className="rounded-full bg-amber px-4 py-2 text-[12px] font-bold text-white transition hover:scale-105 active:scale-95">
                  Review the intervention
                </button>
                <button type="button" className="rounded-full border border-white/20 px-4 py-2 text-[12px] font-semibold text-white/75 transition hover:border-white/40">
                  Ask a follow-up
                </button>
              </MotionItem>
            </Stagger>

            {/* Side panel */}
            <div className="border-t border-white/10 bg-white/[0.02] p-6 md:border-t-0 md:border-l">
              <div className="text-[10px] font-semibold uppercase tracking-[2px] text-white/40">Recommended Intervention</div>
              <motion.div whileHover={{ y: -3 }} className="mt-3 rounded-xl border border-amber/30 bg-amber/10 p-4">
                <div className="text-2xl">✉️</div>
                <div className="mt-2 font-display text-base font-bold text-white">Email + DM Automation</div>
                <div className="mt-1 text-[11px] text-white/55">Recover the 68% currently lost in follow-up.</div>
                <div className="mt-3 flex items-end justify-between border-t border-white/10 pt-3">
                  <div>
                    <div className="font-display text-lg font-bold text-white">₦20,000</div>
                    <div className="text-[10px] text-white/45">2–3 days delivery</div>
                  </div>
                  <span className="rounded-full bg-amber px-3 py-1.5 text-[10px] font-bold text-white">Deploy</span>
                </div>
              </motion.div>
              <div className="mt-5 space-y-2 text-[12px] text-white/55">
                {["Confidential by default", "English, pidgin, or formal", "Findings saved to your account"].map((t) => (
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
  { icon: "🧠", title: "Trained on Nigerian operators", body: "Pattern-matched against 200+ real diagnoses across fashion, food, logistics, ecommerce, and services. It understands the market you actually sell in." },
  { icon: "🗣️", title: "Speaks the language you operate in", body: "Pidgin, formal English, voice notes — the advisor adapts. No jargon, no scripts, no friction." },
  { icon: "🎯", title: "Specific, never generic", body: "Every diagnosis names the exact constraint, quantifies the monthly cost in naira, and prescribes the right intervention. No motivational filler." },
  { icon: "⚡", title: "Execution on demand", body: "When you're ready, our team deploys the fix in 2–5 days from ₦8,000. Or take the diagnosis and execute it yourself — entirely your decision." },
  { icon: "🔒", title: "Private and confidential", body: "Your business numbers are never shared, sold, or used for marketing. Conversations are yours to keep or delete." },
  { icon: "🇳🇬", title: "Naira-priced, naira-paid", body: "No dollar conversions, no hidden fees, no foreign processors. Direct bank transfer in the currency you actually trade in." },
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
              Intelligence built for<br />
              <em className="text-amber">how Nigerians</em><br />
              actually trade.
            </h2>
            <p className="mt-5 text-base font-light leading-[1.78] text-white/60">
              Imported playbooks ignore WhatsApp commerce, naira-economy pricing, and the real friction in your sales process. HIPROFEET was built locally — diagnostics calibrated to the market you operate in.
            </p>
          </Reveal>
          <Stagger className="grid gap-3 sm:grid-cols-2">
            {FEATURES.map((f) => (
              <MotionItem
                key={f.title}
                variants={itemVariants}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                whileTap={{ scale: 0.97, y: -2 }}
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
  { num: "01", title: "Describe your business", body: "Your words, your language. Pidgin, formal English, or somewhere between — no forms, no scripts. The audit is always free." },
  { num: "02", title: "Receive a precise diagnosis", body: "A specific finding: the exact constraint limiting growth, why it exists, and what it costs you in naira each month." },
  { num: "03", title: "Choose your next move", body: "Apply the recommendation yourself, or commission our team to deploy it in 2–5 days from ₦8,000." },
  { num: "04", title: "Compound the result", body: "Operators who act on the diagnosis compound faster. The constraint will not close itself." },
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
              <div className="text-[10px] font-semibold uppercase tracking-wider text-t-soft">Median time</div>
              <div className="font-display text-2xl font-bold text-t-dark">2.4 min</div>
              <div className="text-[10px] text-t-soft">to a precise diagnosis</div>
            </div>
          </Reveal>

          <div className="order-1 lg:order-2">
            <Reveal>
              <div className="mb-4 inline-flex items-center gap-2.5">
                <div className="h-[2.5px] w-5 rounded-full bg-amber" />
                <div className="text-[11px] font-bold uppercase tracking-[3.5px] text-amber">The Process</div>
              </div>
              <h2 className="font-display text-[clamp(32px,5vw,48px)] font-bold leading-[1.12] text-white">
                One conversation.<br />A <em className="text-amber">measurable change.</em>
              </h2>
            </Reveal>
            <Stagger className="mt-8 space-y-3">
              {STEPS.map((s) => (
                <MotionItem
                  key={s.num}
                  variants={itemVariants}
                  whileHover={{ x: 4, transition: { duration: 0.2 } }}
                  whileTap={{ scale: 0.98, x: 2 }}
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
  { n: "200+", l: "Businesses Diagnosed" },
  { n: "₦340K", l: "Median monthly recovery" },
  { n: "3.2×", l: "Average revenue lift" },
  { n: "2–5", l: "Day execution window" },
];

const TESTIMONIALS = [
  { num: "3.2×", lbl: "Revenue increase", text: "The advisor surfaced the real constraint in three minutes — six months of posting without a system underneath it. Their team set up the ads. Revenue tripled in 30 days.", name: "Amaka Okafor", biz: "Fashion · Lagos", tag: "Instagram Ads", img: founder3 },
  { num: "₦840K", lbl: "New revenue, 90 days", text: "Diagnosis was immediate — no website meant prospects searched and found nothing. HIPROFEET built it in four days. ₦840K in new business that quarter.", name: "Chidi Nwosu", biz: "Logistics · Abuja", tag: "Website Dev", img: founder2 },
  { num: "68%", lbl: "More repeat buyers", text: "I didn't know a retention gap existed until the advisor named it. Email automation now runs on its own and recovers 68% of past buyers each month.", name: "Ngozi Eze", biz: "Ecommerce · Port Harcourt", tag: "Email Automation", img: founder5 },
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
          <div className="text-[11px] font-bold uppercase tracking-[3.5px] text-amber">Case Studies</div>
        </div>
        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
          <h2 className="font-display text-[clamp(32px,5.5vw,52px)] font-bold leading-[1.1] text-white">
            Nigerian operators.<br />
            <em className="text-amber">Measured outcomes.</em>
          </h2>
          <p className="text-base text-white/55 md:max-w-sm md:text-right">Diagnosed by the same advisor you'll use. Executed by our team.</p>
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
              whileTap={{ scale: 0.98, y: -3 }}
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
              <div className="text-[11px] font-bold uppercase tracking-[3.5px] text-brand">Execution Services</div>
            </div>
            <h2 className="font-display text-[clamp(32px,5.5vw,52px)] font-bold leading-[1.1] text-t-dark">
              When the diagnosis<br />calls for <em className="text-brand">deployment.</em>
            </h2>
          </div>
          <Link to="/advisor" className="hidden rounded-full border border-t-dark px-5 py-2.5 text-[12px] font-bold uppercase tracking-wider text-t-dark transition hover:bg-t-dark hover:text-cream md:inline-flex">
            Get matched →
          </Link>
        </div>

        <div className="my-8 flex items-start gap-3 rounded-2xl border border-success/25 bg-success/8 p-5 text-sm leading-relaxed text-success">
          <span className="text-lg">🎯</span>
          <span><strong className="font-bold">The growth audit is always free.</strong> Services below are optional — for when you want our team to execute the recommendation. The advisor will name the right one after your audit.</span>
        </div>

        <Stagger className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.06}>
          {SERVICE_LIST.map((s) => (
            <MotionItem
              key={s.id}
              variants={itemVariants}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              whileTap={{ scale: 0.97, y: -3 }}
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
  { q: "Is the growth audit really free?", a: "Yes — entirely. No login, no card, no email capture required. Our revenue comes only from operators who choose to commission execution. You're welcome to take the diagnosis and apply it yourself; that path is free in perpetuity." },
  { q: "How is this different from ChatGPT?", a: "General-purpose models give global, generic advice. HIPROFEET is calibrated on Nigerian SMB patterns — WhatsApp commerce, naira-economy pricing, local trust signals, and 200+ documented diagnoses. It also returns a specific intervention with a specific naira figure, not open-ended suggestions." },
  { q: "How quickly does your team execute?", a: "Most services deliver within 2–5 working days. Brand identity ships in 1–2. Sales support engages within 24 hours. Every service page states the exact delivery window." },
  { q: "How do payments work?", a: "Direct bank transfer to our Nigerian Union Bank account. Upload the receipt, we verify within hours, and execution begins. No international cards, no dollar conversions." },
  { q: "What if I don't want to commission a service?", a: "Entirely acceptable. The audit is genuinely obligation-free. Many founders use it for clarity before deciding any next move — that alone is the point." },
];

export function FAQ() {
  return (
    <section className="bg-ink-2 px-5 py-24">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2.5">
            <div className="h-[2.5px] w-5 rounded-full bg-amber" />
            <div className="text-[11px] font-bold uppercase tracking-[3.5px] text-amber">Questions</div>
            <div className="h-[2.5px] w-5 rounded-full bg-amber" />
          </div>
          <h2 className="font-display text-[clamp(30px,5vw,44px)] font-bold leading-[1.14] text-white">
            What operators <em className="text-amber">usually ask.</em>
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
        <Reveal y={40} className="relative">
          <div className="tilt aspect-[4/5] overflow-hidden rounded-[28px] shadow-[0_40px_100px_oklch(0.18_0.04_260/.55),0_0_0_1px_rgba(255,255,255,.06)]">
            <img src={founder4} alt="" loading="lazy" width={512} height={512} className="h-full w-full object-cover" />
          </div>
          <div className="float-card absolute -bottom-5 -right-4 hidden rounded-2xl bg-white px-5 py-4 shadow-2xl sm:block">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-t-soft">Diagnosed today</div>
            <div className="font-display text-2xl font-bold text-t-dark">17 operators</div>
            <div className="mt-1 flex items-center gap-1.5 text-[11px] text-emerald-700">
              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Advisor online · responds in seconds
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="mb-4 inline-flex items-center gap-2.5">
            <div className="h-[2.5px] w-5 rounded-full bg-amber" />
            <div className="text-[11px] font-bold uppercase tracking-[3.5px] text-amber">The Cost of Delay</div>
          </div>
          <h2 className="font-display text-[clamp(32px,5vw,50px)] font-bold leading-[1.1] text-white">
            Each week unmeasured<br />is another week your<br /><em className="text-gradient-animate bg-gradient-to-r from-amber via-sky-2 to-amber bg-clip-text not-italic text-transparent">constraint compounds.</em>
          </h2>
          <p className="mt-5 text-lg font-light leading-[1.78] text-white/65">
            A three-minute audit today. A five-day execution sprint this week. A measurably different trajectory next month.
          </p>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="mt-8 inline-block">
            <Link to="/advisor" className="cta-pulse inline-flex items-center justify-center gap-2 rounded-2xl bg-amber px-8 py-[18px] text-[16px] font-bold text-white shadow-[0_6px_24px_oklch(0.68_0.17_55/.4)]">
              Start Free Business Assessment <motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 1.4, repeat: Infinity }}>→</motion.span>
            </Link>
          </motion.div>
          <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
            {["Assessment always free", "No signup required", "Execution from ₦8,000", "Delivered in 2–5 days"].map((c) => (
              <div key={c} className="flex items-center gap-2 text-sm font-light text-white/65">
                <span className="text-[15px] font-bold text-amber">✓</span>{c}
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
