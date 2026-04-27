import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Nav } from "@/components/layout";
import { SERVICES } from "@/data/services";

// Parse "👉 Order Name (₦price): /order/ID" into clickable CTA cards.
// Returns text with link lines stripped + array of detected service IDs (in order).
function parseReply(text: string): { body: string; ctas: { id: string; label: string }[] } {
  const ctas: { id: string; label: string }[] = [];
  const seen = new Set<string>();
  const linkRe = /\/order\/([a-z]+)/gi;

  // Split by lines, drop lines that are pure CTA lines (start with 👉 or contain /order/)
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

  // Also catch service mentions by name when no link was provided
  if (ctas.length === 0) {
    for (const s of Object.values(SERVICES)) {
      if (text.toLowerCase().includes(s.name.toLowerCase()) && !seen.has(s.id)) {
        seen.add(s.id);
        ctas.push({ id: s.id, label: s.name });
        break; // only one CTA max
      }
    }
  }

  return { body: keptLines.join("\n").replace(/\n{3,}/g, "\n\n").trim(), ctas };
}

export const Route = createFileRoute("/advisor")({
  head: () => ({ meta: [{ title: "Free AI Business Advisor — HIPROFEET" }] }),
  component: AdvisorPage,
});

type Msg = { role: "ai" | "u"; text: string };

function AdvisorPage() {
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "ai", text: "Hi 👋 I'm your HIPROFEET business advisor. Tell me — what's the biggest thing slowing your business down right now?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async (text?: string) => {
    const t = (text ?? input).trim();
    if (!t || loading) return;
    setInput("");
    const next = [...msgs, { role: "u" as const, text: t }];
    setMsgs(next);
    setLoading(true);
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
      setMsgs((m) => [...m, { role: "ai", text: data.reply }]);
    } catch (e) {
      setMsgs((m) => [...m, { role: "ai", text: e instanceof Error ? e.message : "Something went wrong." }]);
    } finally {
      setLoading(false);
    }
  };

  const quick = ["Sales are slow", "Few followers", "No website", "Customers don't return"];

  return (
    <>
      <Nav />
      <div className="flex min-h-screen flex-col bg-ink pt-16">
        <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 pt-4">
          <Link to="/" className="mb-2 inline-flex items-center gap-2 px-2 py-3 text-sm font-bold text-white/70">← Back to Home</Link>
          <div className="flex items-center gap-3 rounded-t-2xl border-b border-white/10 bg-ink-2 p-4">
            <img src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&h=80&fit=crop&crop=face&q=72" alt="" className="h-10 w-10 rounded-full border-2 border-white/15 object-cover" />
            <div>
              <div className="text-sm font-bold text-white">HIPROFEET Business Advisor</div>
              <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-white/45">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Free · No signup · Real insight
              </div>
            </div>
            <div className="ml-auto rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[10px] font-bold text-white/60">🤝 Advisor</div>
          </div>

          <div className="flex flex-1 flex-col gap-3 overflow-y-auto bg-white p-4">
            {msgs.map((m, i) => {
              if (m.role === "u") {
                return (
                  <div key={i} className="flex justify-end">
                    <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-brand px-4 py-2.5 text-[15px] leading-relaxed text-white whitespace-pre-wrap">
                      {m.text}
                    </div>
                  </div>
                );
              }
              const { body, ctas } = parseReply(m.text);
              return (
                <div key={i} className="flex flex-col items-start gap-2">
                  <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-[oklch(0.95_0.012_85)] px-4 py-2.5 text-[15px] leading-relaxed text-t-dark whitespace-pre-wrap">
                    {body}
                  </div>
                  {ctas.map((c) => {
                    const s = SERVICES[c.id];
                    return (
                      <Link
                        key={c.id}
                        to="/order/$id"
                        params={{ id: c.id }}
                        className="group inline-flex max-w-[85%] items-center gap-3 rounded-2xl border border-brand/20 bg-white px-4 py-3 shadow-sm transition hover:border-brand hover:bg-brand/5"
                      >
                        <span className="text-2xl">{s.icon}</span>
                        <span className="flex flex-col">
                          <span className="text-[13px] font-bold text-t-dark">{s.name}</span>
                          <span className="text-[12px] text-t-soft">{s.price} · Tap to order →</span>
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
          </div>

          <div className="flex flex-wrap gap-2 border-t border-brand/10 bg-white px-3 py-2.5">
            {quick.map((q) => (
              <button key={q} onClick={() => send(q)} disabled={loading} className="rounded-xl border border-brand/15 bg-cream px-4 py-2 text-sm font-medium text-t-dark transition hover:border-brand hover:bg-brand/10 hover:text-brand">
                {q}
              </button>
            ))}
          </div>
          <div className="flex gap-2 rounded-b-2xl border-t border-brand/10 bg-white p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Tell me about your business…"
              className="min-w-0 flex-1 rounded-2xl border border-brand/15 bg-off px-5 py-3 text-[15px] text-t-dark outline-none focus:border-brand focus:bg-white"
            />
            <button onClick={() => send()} disabled={loading} className="rounded-2xl bg-brand px-5 text-sm font-bold text-white transition active:bg-brand-2 disabled:opacity-50">
              Send
            </button>
          </div>
          <div className="h-4" />
        </div>
      </div>
    </>
  );
}
