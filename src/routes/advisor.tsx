import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Nav } from "@/components/layout";
import { SERVICES } from "@/data/services";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

// Parse "👉 Order Name (₦price): /order/ID" into clickable CTA cards.
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

  if (ctas.length === 0) {
    for (const s of Object.values(SERVICES)) {
      if (text.toLowerCase().includes(s.name.toLowerCase()) && !seen.has(s.id)) {
        seen.add(s.id);
        ctas.push({ id: s.id, label: s.name });
        break;
      }
    }
  }

  return { body: keptLines.join("\n").replace(/\n{3,}/g, "\n\n").trim(), ctas };
}

export const Route = createFileRoute("/advisor")({
  head: () => ({ meta: [{ title: "Growth Audit — HIPROFEET Advisor" }] }),
  component: AdvisorPage,
});

type Msg = { role: "ai" | "u"; text: string };
type Conversation = { id: string; title: string; last_message_at: string };

const WELCOME: Msg = {
  role: "ai",
  text: "Welcome. I'm your HIPROFEET growth advisor. Briefly — what does your business do, and what's the single biggest constraint on revenue right now?",
};

function AdvisorPage() {
  const { user } = useAuth();
  const [msgs, setMsgs] = useState<Msg[]>([WELCOME]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load conversation list when user is logged in
  useEffect(() => {
    if (!user) {
      setConversations([]);
      return;
    }
    supabase
      .from("conversations")
      .select("id,title,last_message_at")
      .eq("user_id", user.id)
      .order("last_message_at", { ascending: false })
      .limit(50)
      .then(({ data }) => {
        if (data) setConversations(data as Conversation[]);
      });
  }, [user]);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, loading]);

  const openConversation = async (id: string) => {
    setSidebarOpen(false);
    const { data } = await supabase
      .from("messages")
      .select("role,content")
      .eq("conversation_id", id)
      .order("created_at", { ascending: true });
    if (data && data.length > 0) {
      setMsgs(data.map((m) => ({ role: m.role as "ai" | "u", text: m.content })));
      setConversationId(id);
    }
  };

  const newChat = () => {
    setMsgs([WELCOME]);
    setConversationId(null);
    setSidebarOpen(false);
  };

  const persistTurn = async (
    convId: string | null,
    userMsg: Msg,
    aiMsg: Msg,
    isFirstTurn: boolean,
  ): Promise<string | null> => {
    if (!user) return null;
    let cid = convId;
    if (!cid) {
      const title = userMsg.text.slice(0, 60);
      const { data: conv, error } = await supabase
        .from("conversations")
        .insert({ user_id: user.id, title, last_message_at: new Date().toISOString() })
        .select("id,title,last_message_at")
        .single();
      if (error || !conv) return null;
      cid = conv.id;
      setConversations((prev) => [conv as Conversation, ...prev]);
    } else if (isFirstTurn) {
      // already linked, just bump last_message_at
      await supabase.from("conversations").update({ last_message_at: new Date().toISOString() }).eq("id", cid);
    } else {
      await supabase.from("conversations").update({ last_message_at: new Date().toISOString() }).eq("id", cid);
      setConversations((prev) =>
        prev
          .map((c) => (c.id === cid ? { ...c, last_message_at: new Date().toISOString() } : c))
          .sort((a, b) => +new Date(b.last_message_at) - +new Date(a.last_message_at)),
      );
    }

    await supabase.from("messages").insert([
      { conversation_id: cid, user_id: user.id, role: userMsg.role, content: userMsg.text },
      { conversation_id: cid, user_id: user.id, role: aiMsg.role, content: aiMsg.text },
    ]);
    return cid;
  };

  const deleteConversation = async (id: string) => {
    if (!confirm("Delete this conversation?")) return;
    await supabase.from("conversations").delete().eq("id", id);
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (conversationId === id) newChat();
  };

  const send = async (text?: string) => {
    const t = (text ?? input).trim();
    if (!t || loading) return;
    setInput("");
    const userMsg: Msg = { role: "u", text: t };
    const next = [...msgs, userMsg];
    setMsgs(next);
    setLoading(true);
    const wasFirstTurn = !conversationId;
    try {
      const res = await fetch("/api/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      if (!res.ok) {
        if (res.status === 429) throw new Error("Too many requests right now. Try again in a minute.");
        if (res.status === 402) throw new Error("AI credits exhausted. Please contact support.");
        throw new Error("Advisor unavailable. Try again.");
      }
      const data = await res.json();
      const aiMsg: Msg = { role: "ai", text: data.reply };
      setMsgs((m) => [...m, aiMsg]);
      // Persist if logged in
      if (user) {
        const cid = await persistTurn(conversationId, userMsg, aiMsg, wasFirstTurn);
        if (cid && !conversationId) setConversationId(cid);
      }
    } catch (e) {
      setMsgs((m) => [...m, { role: "ai", text: e instanceof Error ? e.message : "Something went wrong." }]);
    } finally {
      setLoading(false);
    }
  };

  const quick = [
    "Getting more customers",
    "Increasing sales",
    "Building trust",
    "Marketing effectively",
    "Customers don't return",
    "Revenue has plateaued",
    "No website yet",
    "Something else",
  ];

  return (
    <>
      <Nav />
      <div className="flex min-h-screen flex-col bg-ink pt-16">
        <div className="mx-auto flex w-full max-w-5xl flex-1 gap-4 px-3 pt-4 sm:px-4">
          {/* Sidebar — desktop */}
          {user && (
            <aside className="hidden w-64 flex-none flex-col gap-2 lg:flex">
              <button
                onClick={newChat}
                className="rounded-xl border border-white/10 bg-ink-2 px-4 py-2.5 text-left text-sm font-bold text-white transition hover:border-sky/40 hover:bg-white/5"
              >
                + New chat
              </button>
              <div className="rounded-xl border border-white/10 bg-ink-2 p-2">
                <div className="px-2 pb-1.5 pt-1 text-[10px] font-bold uppercase tracking-widest text-white/40">History</div>
                <ul className="max-h-[60vh] space-y-0.5 overflow-y-auto">
                  {conversations.length === 0 && (
                    <li className="px-2 py-2 text-xs text-white/40">No saved chats yet.</li>
                  )}
                  {conversations.map((c) => (
                    <li key={c.id} className="group relative">
                      <button
                        onClick={() => openConversation(c.id)}
                        className={`block w-full truncate rounded-lg px-2.5 py-2 pr-7 text-left text-[13px] transition ${
                          conversationId === c.id ? "bg-brand/15 text-white" : "text-white/70 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        {c.title}
                      </button>
                      <button
                        onClick={() => deleteConversation(c.id)}
                        className="absolute right-1 top-1.5 hidden h-6 w-6 items-center justify-center rounded text-white/40 hover:bg-white/10 hover:text-white group-hover:flex"
                        aria-label="Delete"
                      >
                        ×
                      </button>
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
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSidebarOpen(false)}
                  className="fixed inset-0 z-40 bg-black/60 lg:hidden"
                />
                <motion.aside
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ type: "tween", duration: 0.25 }}
                  className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col gap-2 border-r border-white/10 bg-ink-2 p-3 pt-20 lg:hidden"
                >
                  <button
                    onClick={newChat}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-left text-sm font-bold text-white"
                  >
                    + New chat
                  </button>
                  <div className="px-1 pb-1.5 pt-2 text-[10px] font-bold uppercase tracking-widest text-white/40">History</div>
                  <ul className="flex-1 space-y-0.5 overflow-y-auto">
                    {conversations.length === 0 && <li className="px-2 py-2 text-xs text-white/40">No saved chats yet.</li>}
                    {conversations.map((c) => (
                      <li key={c.id}>
                        <button
                          onClick={() => openConversation(c.id)}
                          className={`block w-full truncate rounded-lg px-2.5 py-2 text-left text-[13px] ${
                            conversationId === c.id ? "bg-brand/15 text-white" : "text-white/70"
                          }`}
                        >
                          {c.title}
                        </button>
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
              <Link to="/" className="inline-flex items-center gap-2 px-2 py-3 text-sm font-bold text-white/70">
                ← Back to Home
              </Link>
              {user && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-bold text-white/70 lg:hidden"
                >
                  ☰ History
                </button>
              )}
            </div>
            <div className="flex items-center gap-3 rounded-t-2xl border-b border-white/10 bg-ink-2 p-4">
              <img
                src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&h=80&fit=crop&crop=face&q=72"
                alt=""
                className="h-10 w-10 rounded-full border-2 border-white/15 object-cover"
              />
              <div className="min-w-0">
                <div className="truncate text-sm font-bold text-white">HIPROFEET Growth Advisor</div>
                <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-white/45">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  {user ? "Saved to your account" : "Confidential · No signup required"}
                </div>
              </div>
              <div className="ml-auto rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[10px] font-bold text-white/60">
                Advisor
              </div>
            </div>

            <div ref={scrollRef} className="flex flex-1 flex-col gap-3 overflow-y-auto bg-white p-4">
              {msgs.map((m, i) => {
                if (m.role === "u") {
                  return (
                    <div key={i} className="flex justify-end">
                      <div className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-sm bg-brand px-4 py-2.5 text-[15px] leading-relaxed text-white">
                        {m.text}
                      </div>
                    </div>
                  );
                }
                const { body, ctas } = parseReply(m.text);
                return (
                  <div key={i} className="flex flex-col items-start gap-2">
                    <div className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-bl-sm bg-[oklch(0.95_0.012_85)] px-4 py-2.5 text-[15px] leading-relaxed text-t-dark">
                      {body}
                    </div>
                    {ctas.map((c) => {
                      const s = SERVICES[c.id];
                      return (
                        <Link
                          key={c.id}
                          to="/order/$id"
                          params={{ id: c.id }}
                          className="group inline-flex max-w-[85%] items-center gap-3 rounded-2xl border-2 border-amber bg-amber px-4 py-3 font-bold text-ink shadow-lg shadow-amber/30 ring-2 ring-amber/30 transition hover:scale-[1.02] hover:bg-amber/90 active:scale-[0.98]"
                        >
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
              {loading && (
                <div className="flex gap-1 px-4 py-2">
                  {[0, 1, 2].map((i) => (
                    <span key={i} className="h-2 w-2 animate-bounce rounded-full bg-t-soft" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              )}
              {!user && msgs.length > 3 && (
                <Link
                  to="/auth"
                  className="self-center rounded-full border border-brand/30 bg-brand/5 px-4 py-1.5 text-[12px] font-semibold text-brand hover:bg-brand/10"
                >
                  Sign in to save this audit
                </Link>
              )}
            </div>

            <div className="border-t border-brand/10 bg-white px-3 pt-2.5">
              <div className="px-1 pb-1.5 text-[11px] font-semibold uppercase tracking-wide text-t-soft">
                Choose what best describes your biggest challenge
              </div>
              <div className="flex flex-wrap gap-2 pb-2.5">
                {quick.map((q) => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    disabled={loading}
                    className="rounded-xl border border-brand/15 bg-cream px-4 py-2 text-sm font-medium text-t-dark transition hover:border-brand hover:bg-brand/10 hover:text-brand"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2 rounded-b-2xl border-t border-brand/10 bg-white p-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Describe your business or the constraint you're facing…"
                className="min-w-0 flex-1 rounded-2xl border border-brand/15 bg-off px-5 py-3 text-[15px] text-t-dark outline-none focus:border-brand focus:bg-white"
              />
              <button
                onClick={() => send()}
                disabled={loading}
                className="rounded-2xl bg-brand px-5 text-sm font-bold text-white transition active:bg-brand-2 disabled:opacity-50"
              >
                Send
              </button>
            </div>
            <div className="h-4" />
          </div>
        </div>
      </div>
    </>
  );
}
