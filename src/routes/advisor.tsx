import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Nav } from "@/components/layout";
import { SERVICES } from "@/data/services";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

// ---------- helpers ----------
function parseReply(text: string): { body: string; ctas: { id: string; label: string }[] } {
  const ctas: { id: string; label: string }[] = [];
  const seen = new Set<string>();
  const linkRe = /\/order\/([a-z]+)/gi;
  const keptLines: string[] = [];
  for (const line of text.split("\n")) {
    let m;
    let foundInLine = false;
    while ((m = linkRe.exec(line)) !== null) {
      const id = m[1].toLowerCase();
      if (SERVICES[id] && !seen.has(id)) {
        seen.add(id);
        ctas.push({ id, label: SERVICES[id].name });
      }
      foundInLine = true;
    }
    linkRe.lastIndex = 0;
    const isPureCta = foundInLine && /^[\s👉➡️→\-•*]*Order/i.test(line.trim());
    if (!isPureCta) keptLines.push(line);
  }
  return { body: keptLines.join("\n").replace(/\n{3,}/g, "\n\n").trim(), ctas };
}

type RouteKey = "A" | "B" | "C" | "D";
type Msg = { role: "ai" | "u"; text: string };
type Conversation = { id: string; title: string; last_message_at: string; route?: string | null };
type Upload = { kind: "url" | "file"; value: string; label?: string };
type Phase = "welcome" | "chat" | "progress" | "email" | "delivered";

export const Route = createFileRoute("/advisor")({
  head: () => ({ meta: [{ title: "Business Growth Advisor — HIPROFEET" }] }),
  component: AdvisorPage,
});

const WELCOME_INTRO =
  "Welcome to HIPROFEET.\nI'm your Business Growth Advisor.\n\nHow can I help you today?";

const ROUTE_META: Record<RouteKey, { icon: string; title: string; subtitle: string; accent: string }> = {
  A: { icon: "📈", title: "Understand why my business isn't growing", subtitle: "Guided assessment — end with a full Growth Review by email.", accent: "from-sky/25 to-brand/25 border-sky/40" },
  B: { icon: "💬", title: "Speak with a real Business Growth Expert", subtitle: "1-on-1 consultation with a HIPROFEET consultant.", accent: "from-amber/25 to-amber/5 border-amber/40" },
  C: { icon: "🛠", title: "I already know what I need", subtitle: "Order a specific solution and get it delivered.", accent: "from-brand/25 to-brand/5 border-brand/40" },
  D: { icon: "❓", title: "I have another business question", subtitle: "Ask anything about growing your business.", accent: "from-white/10 to-white/0 border-white/20" },
};

const ROUTE_OPENER: Record<RouteKey, string> = {
  A: "Great choice. I'll help you understand what may be limiting your growth.\n\nDepending on your answers, I may ask for your website, social media pages, screenshots or other materials so my read is accurate.\n\nTo start — tell me briefly what your business does.",
  B: "You're welcome to speak with one of our HIPROFEET Business Growth Experts.\n\nUnlike this AI conversation, your session is conducted by a real consultant who will review your business with you, answer questions and recommend practical next steps.\n\nYou can cover: growth, marketing, customer acquisition, branding, website, social media, sales, and business systems.\n\nWhat's the single topic you most want to focus on in the session?",
  C: "Understood. What are you looking for today — website, branding, followers, reviews, ads, video viewers, testimonials, a consultant session, sales support, or something else?",
  D: "I'm here. What's on your mind?",
};

const PROGRESS_STAGES = [
  "Reviewing your business…",
  "Identifying growth opportunities…",
  "Preparing recommendations…",
  "Building your Growth Review…",
];

function AdvisorPage() {
  const { user } = useAuth();
  const [phase, setPhase] = useState<Phase>("welcome");
  const [route, setRoute] = useState<RouteKey | null>(null);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [progressStage, setProgressStage] = useState(0);
  const [reviewSent, setReviewSent] = useState<string | null>(null);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Prefill email for logged-in
  useEffect(() => {
    if (user?.email) setEmailInput(user.email);
  }, [user?.email]);

  // Load conversation list
  useEffect(() => {
    if (!user) return;
    supabase
      .from("conversations")
      .select("id,title,last_message_at,route")
      .eq("user_id", user.id)
      .order("last_message_at", { ascending: false })
      .limit(50)
      .then(({ data }) => data && setConversations(data as Conversation[]));
  }, [user]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, loading, phase]);

  // Progress screen ticker
  useEffect(() => {
    if (phase !== "progress") return;
    setProgressStage(0);
    const id = setInterval(() => {
      setProgressStage((s) => (s < PROGRESS_STAGES.length - 1 ? s + 1 : s));
    }, 1200);
    return () => clearInterval(id);
  }, [phase]);

  const pickRoute = (r: RouteKey) => {
    setRoute(r);
    setMsgs([{ role: "ai", text: ROUTE_OPENER[r] }]);
    setPhase("chat");
  };

  const newChat = () => {
    setRoute(null);
    setMsgs([]);
    setConversationId(null);
    setUploads([]);
    setPhase("welcome");
    setSidebarOpen(false);
    setReviewSent(null);
    setReviewError(null);
  };

  const openConversation = async (id: string) => {
    setSidebarOpen(false);
    const { data } = await supabase
      .from("messages")
      .select("role,content")
      .eq("conversation_id", id)
      .order("created_at", { ascending: true });
    const conv = conversations.find((c) => c.id === id);
    if (data && data.length > 0) {
      setMsgs(data.map((m) => ({ role: m.role as "ai" | "u", text: m.content })));
      setConversationId(id);
      setRoute((conv?.route as RouteKey) ?? "D");
      setPhase("chat");
    }
  };

  const deleteConversation = async (id: string) => {
    if (!confirm("Delete this conversation?")) return;
    await supabase.from("conversations").delete().eq("id", id);
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (conversationId === id) newChat();
  };

  const persistTurn = async (
    convId: string | null,
    userMsg: Msg,
    aiMsg: Msg,
  ): Promise<string | null> => {
    if (!user) return null;
    let cid = convId;
    if (!cid) {
      const title = userMsg.text.slice(0, 60);
      const { data: conv, error } = await supabase
        .from("conversations")
        .insert({
          user_id: user.id,
          title,
          route,
          last_message_at: new Date().toISOString(),
        })
        .select("id,title,last_message_at,route")
        .single();
      if (error || !conv) return null;
      cid = conv.id;
      setConversations((prev) => [conv as Conversation, ...prev]);
    } else {
      await supabase.from("conversations").update({ last_message_at: new Date().toISOString() }).eq("id", cid);
    }
    await supabase.from("messages").insert([
      { conversation_id: cid, user_id: user.id, role: userMsg.role, content: userMsg.text },
      { conversation_id: cid, user_id: user.id, role: aiMsg.role, content: aiMsg.text },
    ]);
    return cid;
  };

  const send = async (text?: string) => {
    const t = (text ?? input).trim();
    if (!t || loading || !route) return;
    setInput("");
    const userMsg: Msg = { role: "u", text: t };
    const next = [...msgs, userMsg];
    setMsgs(next);
    setLoading(true);
    try {
      const res = await fetch("/api/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, route }),
      });
      if (!res.ok) {
        if (res.status === 429) throw new Error("Too many requests right now. Try again in a minute.");
        if (res.status === 402) throw new Error("AI credits exhausted. Please contact support.");
        throw new Error("Advisor unavailable. Try again.");
      }
      const data = await res.json();
      const aiMsg: Msg = { role: "ai", text: data.reply };
      setMsgs((m) => [...m, aiMsg]);
      if (user) {
        const cid = await persistTurn(conversationId, userMsg, aiMsg);
        if (cid && !conversationId) setConversationId(cid);
      }
    } catch (e) {
      setMsgs((m) => [...m, { role: "ai", text: e instanceof Error ? e.message : "Something went wrong." }]);
    } finally {
      setLoading(false);
    }
  };

  const addUpload = async (u: Upload) => {
    setUploads((prev) => [...prev, u]);
    // Announce in chat so the model sees it
    const label = u.kind === "url" ? `Shared: ${u.value}` : `Shared file: ${u.label || u.value}`;
    setMsgs((m) => [...m, { role: "u", text: label }]);
    if (user && conversationId) {
      supabase.from("assessment_uploads").insert({
        conversation_id: conversationId,
        user_id: user.id,
        kind: u.kind,
        value: u.value,
        label: u.label ?? null,
      });
    }
  };

  const submitReview = async () => {
    if (!/^\S+@\S+\.\S+$/.test(emailInput)) return;
    setPhase("progress");
    setReviewError(null);
    try {
      const res = await fetch("/api/growth-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: msgs,
          email: emailInput,
          conversation_id: conversationId,
          uploads,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Could not build your review");
      // Ensure minimum progress feel
      await new Promise((r) => setTimeout(r, 1400));
      setReviewSent(emailInput);
      setPhase("delivered");
    } catch (e) {
      setReviewError(e instanceof Error ? e.message : "Something went wrong");
      setPhase("email");
    }
  };

  const canFinalize = route === "A" && msgs.filter((m) => m.role === "u").length >= 3;

  return (
    <>
      <Nav />
      <div className="flex min-h-screen flex-col bg-ink pt-16">
        <div className="mx-auto flex w-full max-w-5xl flex-1 gap-4 px-3 pt-4 sm:px-4">
          {/* Sidebar */}
          {user && (
            <aside className="hidden w-64 flex-none flex-col gap-2 lg:flex">
              <button onClick={newChat} className="rounded-xl border border-white/10 bg-ink-2 px-4 py-2.5 text-left text-sm font-bold text-white transition hover:border-sky/40 hover:bg-white/5">
                + New chat
              </button>
              <div className="rounded-xl border border-white/10 bg-ink-2 p-2">
                <div className="px-2 pb-1.5 pt-1 text-[10px] font-bold uppercase tracking-widest text-white/40">History</div>
                <ul className="max-h-[60vh] space-y-0.5 overflow-y-auto">
                  {conversations.length === 0 && <li className="px-2 py-2 text-xs text-white/40">No saved chats yet.</li>}
                  {conversations.map((c) => (
                    <li key={c.id} className="group relative">
                      <button
                        onClick={() => openConversation(c.id)}
                        className={`block w-full truncate rounded-lg px-2.5 py-2 pr-7 text-left text-[13px] transition ${
                          conversationId === c.id ? "bg-brand/15 text-white" : "text-white/70 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        {c.route && <span className="mr-1 text-[10px] text-amber">·{c.route}</span>}
                        {c.title}
                      </button>
                      <button onClick={() => deleteConversation(c.id)} className="absolute right-1 top-1.5 hidden h-6 w-6 items-center justify-center rounded text-white/40 hover:bg-white/10 hover:text-white group-hover:flex" aria-label="Delete">×</button>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          )}

          {/* Mobile sidebar */}
          <AnimatePresence>
            {sidebarOpen && (
              <>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSidebarOpen(false)} className="fixed inset-0 z-40 bg-black/60 lg:hidden" />
                <motion.aside initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "tween", duration: 0.25 }} className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col gap-2 border-r border-white/10 bg-ink-2 p-3 pt-20 lg:hidden">
                  <button onClick={newChat} className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-left text-sm font-bold text-white">+ New chat</button>
                  <ul className="flex-1 space-y-0.5 overflow-y-auto">
                    {conversations.map((c) => (
                      <li key={c.id}>
                        <button onClick={() => openConversation(c.id)} className="block w-full truncate rounded-lg px-2.5 py-2 text-left text-[13px] text-white/70">{c.title}</button>
                      </li>
                    ))}
                  </ul>
                </motion.aside>
              </>
            )}
          </AnimatePresence>

          {/* Chat panel */}
          <div className="flex w-full min-w-0 flex-1 flex-col">
            <div className="mb-2 flex items-center justify-between">
              <Link to="/" className="inline-flex items-center gap-2 px-2 py-3 text-sm font-bold text-white/70">← Back to Home</Link>
              {user && (
                <button onClick={() => setSidebarOpen(true)} className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-bold text-white/70 lg:hidden">☰ History</button>
              )}
            </div>

            {/* Header */}
            <div className="flex items-center gap-3 rounded-t-2xl border-b border-white/10 bg-ink-2 p-4">
              <img src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&h=80&fit=crop&crop=face&q=72" alt="" className="h-10 w-10 rounded-full border-2 border-white/15 object-cover" />
              <div className="min-w-0">
                <div className="truncate text-sm font-bold text-white">HIPROFEET Business Growth Advisor</div>
                <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-white/45">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  {route ? `Session · Route ${route}` : "Confidential · No sign-up required"}
                </div>
              </div>
              {route && (
                <button onClick={newChat} className="ml-auto rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-bold text-white/60 hover:bg-white/10">Restart</button>
              )}
            </div>

            {/* Main content area */}
            <div ref={scrollRef} className="relative flex flex-1 flex-col gap-3 overflow-y-auto bg-white p-4">
              {phase === "welcome" && <WelcomeGate onPick={pickRoute} intro={WELCOME_INTRO} />}

              {phase === "chat" &&
                msgs.map((m, i) => {
                  if (m.role === "u") {
                    return (
                      <div key={i} className="flex justify-end">
                        <div className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-sm bg-brand px-4 py-2.5 text-[15px] leading-relaxed text-white">{m.text}</div>
                      </div>
                    );
                  }
                  const { body, ctas } = parseReply(m.text);
                  return (
                    <div key={i} className="flex flex-col items-start gap-2">
                      <div className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-bl-sm bg-[oklch(0.95_0.012_85)] px-4 py-2.5 text-[15px] leading-relaxed text-t-dark">{body}</div>
                      {ctas.map((c) => {
                        const s = SERVICES[c.id];
                        return (
                          <Link key={c.id} to="/order/$id" params={{ id: c.id }} className="group inline-flex max-w-[85%] items-center gap-3 rounded-2xl border-2 border-amber bg-amber px-4 py-3 font-bold text-ink shadow-lg shadow-amber/30 ring-2 ring-amber/30 transition hover:scale-[1.02] hover:bg-amber/90 active:scale-[0.98]">
                            <span className="text-2xl drop-shadow-sm">{s.icon}</span>
                            <span className="flex flex-col">
                              <span className="text-[14px] font-black leading-tight">{s.name}</span>
                              <span className="text-[12px] font-semibold opacity-80">{s.price} · Tap to order →</span>
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  );
                })}

              {phase === "chat" && loading && (
                <div className="flex gap-1 px-4 py-2">
                  {[0, 1, 2].map((i) => (
                    <span key={i} className="h-2 w-2 animate-bounce rounded-full bg-t-soft" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              )}

              {phase === "chat" && canFinalize && !loading && (
                <div className="my-2 flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-sky/50 bg-sky/5 p-4">
                  <div className="text-center text-[13px] font-semibold text-t-dark">Ready when you are — I'll prepare a personalized Growth Review.</div>
                  <button onClick={() => setPhase("email")} className="rounded-2xl bg-sky px-5 py-2.5 text-sm font-black text-white shadow-lg shadow-sky/30 transition hover:scale-[1.02] active:scale-[0.98]">
                    ✨ Prepare my Growth Review
                  </button>
                </div>
              )}

              {phase === "progress" && <ProgressScreen stage={progressStage} />}

              {phase === "email" && (
                <EmailCapture
                  email={emailInput}
                  onChange={setEmailInput}
                  onSubmit={submitReview}
                  error={reviewError}
                  onBack={() => setPhase("chat")}
                />
              )}

              {phase === "delivered" && <DeliveredScreen email={reviewSent!} onNew={newChat} />}

              {!user && msgs.length > 4 && phase === "chat" && (
                <Link to="/auth" className="self-center rounded-full border border-brand/30 bg-brand/5 px-4 py-1.5 text-[12px] font-semibold text-brand hover:bg-brand/10">
                  Sign in to save this session
                </Link>
              )}
            </div>

            {/* Persistent share pill (only in chat) */}
            {phase === "chat" && (
              <div className="flex items-center justify-between border-t border-brand/10 bg-white px-3 pt-2">
                <button
                  onClick={() => setShareOpen(true)}
                  className="inline-flex items-center gap-2 rounded-full border border-brand/25 bg-brand/5 px-3 py-1.5 text-[12px] font-bold text-brand hover:bg-brand/10"
                >
                  📎 Share Something for Review
                  {uploads.length > 0 && <span className="rounded-full bg-brand px-1.5 text-[10px] text-white">{uploads.length}</span>}
                </button>
                {route === "A" && msgs.filter((m) => m.role === "u").length >= 2 && (
                  <button onClick={() => setPhase("email")} className="text-[12px] font-bold text-sky hover:underline">
                    Skip to Growth Review →
                  </button>
                )}
              </div>
            )}

            {/* Input */}
            {phase === "chat" && (
              <div className="flex gap-2 rounded-b-2xl border-t border-brand/10 bg-white p-3">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send()}
                  placeholder="Type your reply…"
                  className="min-w-0 flex-1 rounded-2xl border border-brand/15 bg-off px-5 py-3 text-[15px] text-t-dark outline-none focus:border-brand focus:bg-white"
                />
                <button onClick={() => send()} disabled={loading} className="rounded-2xl bg-brand px-5 text-sm font-bold text-white transition active:bg-brand-2 disabled:opacity-50">Send</button>
              </div>
            )}

            <div className="h-4" />
          </div>
        </div>
      </div>

      {/* Share sheet */}
      <ShareSheet open={shareOpen} onClose={() => setShareOpen(false)} onAdd={addUpload} userId={user?.id} conversationId={conversationId} />
    </>
  );
}

// ---------- Sub-components ----------

function WelcomeGate({ onPick, intro }: { onPick: (r: RouteKey) => void; intro: string }) {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 py-4">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="whitespace-pre-line rounded-2xl bg-[oklch(0.95_0.012_85)] px-5 py-4 text-[16px] leading-relaxed text-t-dark">
        {intro}
      </motion.div>
      <div className="mt-1 text-[11px] font-bold uppercase tracking-widest text-t-soft">Choose the option that best describes why you're here</div>
      <div className="grid grid-cols-1 gap-3">
        {(Object.keys(ROUTE_META) as RouteKey[]).map((k, i) => {
          const m = ROUTE_META[k];
          return (
            <motion.button
              key={k}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 + i * 0.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onPick(k)}
              className={`group flex items-start gap-4 rounded-2xl border-2 bg-gradient-to-br ${m.accent} p-4 text-left transition hover:scale-[1.01]`}
            >
              <div className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-ink text-2xl text-white">{m.icon}</div>
              <div className="min-w-0 flex-1">
                <div className="font-display text-[15px] font-black text-t-dark sm:text-[16px]">{m.title}</div>
                <div className="mt-0.5 text-[13px] text-t-soft">{m.subtitle}</div>
              </div>
              <div className="mt-1 text-lg text-t-soft transition group-hover:translate-x-1">→</div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

function ProgressScreen({ stage }: { stage: number }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 py-10">
      <div className="relative h-16 w-16">
        <div className="absolute inset-0 animate-ping rounded-full bg-sky/30" />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-sky text-2xl text-white shadow-xl shadow-sky/40">📊</div>
      </div>
      <div className="flex flex-col items-center gap-2 text-center">
        {PROGRESS_STAGES.map((s, i) => (
          <motion.div
            key={s}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: i <= stage ? 1 : 0.25, y: 0 }}
            className={`text-[15px] font-semibold ${i === stage ? "text-t-dark" : "text-t-soft"}`}
          >
            {i < stage ? "✓ " : i === stage ? "· " : "  "}{s}
          </motion.div>
        ))}
      </div>
      <div className="text-[12px] text-t-soft">This usually takes a few seconds…</div>
    </div>
  );
}

function EmailCapture({
  email, onChange, onSubmit, error, onBack,
}: {
  email: string; onChange: (v: string) => void; onSubmit: () => void; error: string | null; onBack: () => void;
}) {
  const valid = /^\S+@\S+\.\S+$/.test(email);
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col items-center gap-4 py-6 text-center">
      <div className="text-4xl">📮</div>
      <div className="font-display text-2xl font-black text-t-dark">Your Growth Review is almost ready.</div>
      <div className="text-[14px] text-t-soft">
        We'll send a beautifully formatted copy to your email so you can keep it, revisit it, and use it as your reference while growing your business.
      </div>
      <div className="w-full">
        <label className="block text-[11px] font-bold uppercase tracking-widest text-t-soft">Where should we send your report?</label>
        <input
          type="email"
          value={email}
          onChange={(e) => onChange(e.target.value)}
          placeholder="you@company.com"
          className="mt-1 w-full rounded-2xl border border-brand/25 bg-off px-4 py-3 text-[15px] text-t-dark outline-none focus:border-brand focus:bg-white"
        />
      </div>
      {error && <div className="text-[13px] text-red-500">{error}</div>}
      <button
        disabled={!valid}
        onClick={onSubmit}
        className="w-full rounded-2xl bg-sky px-5 py-3 text-[15px] font-black text-white shadow-lg shadow-sky/30 transition hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
      >
        Send My Growth Review
      </button>
      <button onClick={onBack} className="text-[12px] font-semibold text-t-soft hover:text-t-dark">← Add more context first</button>
    </div>
  );
}

function DeliveredScreen({ email, onNew }: { email: string; onNew: () => void }) {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col items-center gap-4 py-8 text-center">
      <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-5xl">✅</motion.div>
      <div className="font-display text-2xl font-black text-t-dark">Delivered.</div>
      <div className="text-[14px] text-t-soft">Your HIPROFEET Business Growth Review is on its way to <b className="text-t-dark">{email}</b>. It typically arrives within 1–2 minutes.</div>
      <div className="mt-2 flex flex-col gap-2 sm:flex-row">
        <Link to="/order/$id" params={{ id: "consultant" }} className="rounded-2xl bg-amber px-5 py-2.5 text-sm font-black text-ink shadow-lg shadow-amber/30">Book a Human Expert</Link>
        <button onClick={onNew} className="rounded-2xl border border-brand/25 bg-white px-5 py-2.5 text-sm font-bold text-brand hover:bg-brand/5">Start a new session</button>
      </div>
      <div className="mt-3 text-[12px] text-t-soft">Didn't see it? Check spam, then reach out on WhatsApp.</div>
    </div>
  );
}

// -------- Share Sheet --------
function ShareSheet({
  open, onClose, onAdd, userId, conversationId,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (u: Upload) => void;
  userId?: string;
  conversationId: string | null;
}) {
  const [urlKind, setUrlKind] = useState("Website");
  const [urlValue, setUrlValue] = useState("");
  const [uploading, setUploading] = useState(false);
  const kinds = ["Website", "Facebook", "Instagram", "TikTok", "Google Business", "WhatsApp", "Competitor", "Other link"];

  const addUrl = () => {
    const v = urlValue.trim();
    if (!v) return;
    onAdd({ kind: "url", value: v, label: urlKind });
    setUrlValue("");
  };

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!userId) {
      alert("Please sign in to upload files. You can still share URLs without signing in.");
      return;
    }
    setUploading(true);
    const path = `${userId}/${conversationId ?? "session"}/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("assessment-uploads").upload(path, file, { upsert: false });
    setUploading(false);
    if (error) {
      alert(error.message);
      return;
    }
    onAdd({ kind: "file", value: path, label: file.name });
    e.target.value = "";
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-50 bg-black/60" />
          <motion.div
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "tween", duration: 0.25 }}
            className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl sm:inset-x-auto sm:right-4 sm:top-24 sm:bottom-auto sm:w-[400px] sm:rounded-3xl"
          >
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-t-soft/40 sm:hidden" />
            <div className="mb-1 flex items-center justify-between">
              <div className="font-display text-lg font-black text-t-dark">📎 Share for Review</div>
              <button onClick={onClose} className="text-t-soft">✕</button>
            </div>
            <div className="text-[12px] text-t-soft">Paste links or upload materials. The advisor will use them to sharpen your review.</div>

            <div className="mt-4 text-[11px] font-bold uppercase tracking-widest text-t-soft">Share a link</div>
            <div className="mt-1.5 flex gap-2">
              <select value={urlKind} onChange={(e) => setUrlKind(e.target.value)} className="rounded-xl border border-brand/20 bg-off px-2 py-2 text-[13px]">
                {kinds.map((k) => <option key={k} value={k}>{k}</option>)}
              </select>
              <input value={urlValue} onChange={(e) => setUrlValue(e.target.value)} placeholder="https://…" className="min-w-0 flex-1 rounded-xl border border-brand/20 bg-off px-3 py-2 text-[13px] outline-none focus:border-brand" />
            </div>
            <button onClick={addUrl} disabled={!urlValue.trim()} className="mt-2 w-full rounded-xl bg-brand px-3 py-2 text-sm font-bold text-white disabled:opacity-40">Add link</button>

            <div className="mt-5 text-[11px] font-bold uppercase tracking-widest text-t-soft">Upload a file</div>
            <div className="mt-1 text-[11px] text-t-soft">Screenshots, logo, flyers, product photos, documents.</div>
            <label className={`mt-2 flex cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-brand/30 bg-brand/5 px-3 py-4 text-sm font-bold text-brand ${uploading ? "opacity-50" : ""}`}>
              {uploading ? "Uploading…" : userId ? "Choose file" : "Sign in to upload files"}
              <input type="file" onChange={onFile} disabled={uploading || !userId} className="hidden" accept="image/*,application/pdf" />
            </label>

            <div className="mt-4 text-[11px] text-t-soft">Every shared item helps the advisor build a more accurate Growth Review.</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
