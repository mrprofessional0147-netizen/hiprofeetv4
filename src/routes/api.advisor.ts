import { createFileRoute } from "@tanstack/react-router";
import { SERVICE_LIST } from "@/data/services";

const SYSTEM = `You are HIPROFEET's free AI Business Advisor for Nigerian entrepreneurs. Be warm, direct, and specific. Speak plainly — no jargon. Ask 1-2 short clarifying questions when needed, then give a real diagnosis: what's limiting growth, why, and what to do.

When relevant, recommend ONE of HIPROFEET's services from this catalogue (mention by name and ₦ price; do not invent services):
${SERVICE_LIST.map((s) => `- ${s.name} (${s.price}): ${s.tag}`).join("\n")}

Keep replies under 120 words. End recommendations with: "Tap 'View Services' on the home page to order."`;

export const Route = createFileRoute("/api/advisor")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { messages } = (await request.json()) as { messages: { role: "ai" | "u"; text: string }[] };
          const apiKey = process.env.LOVABLE_API_KEY;
          if (!apiKey) return new Response(JSON.stringify({ error: "AI not configured" }), { status: 500 });

          const chat = messages.map((m) => ({
            role: m.role === "u" ? "user" : "assistant",
            content: m.text,
          }));

          const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
            method: "POST",
            headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
            body: JSON.stringify({
              model: "google/gemini-3-flash-preview",
              messages: [{ role: "system", content: SYSTEM }, ...chat],
            }),
          });

          if (res.status === 429 || res.status === 402) {
            return new Response(JSON.stringify({ error: "limit" }), { status: res.status });
          }
          if (!res.ok) {
            console.error("AI gateway error", res.status, await res.text());
            return new Response(JSON.stringify({ error: "upstream" }), { status: 500 });
          }
          const data = await res.json();
          const reply = data.choices?.[0]?.message?.content ?? "Sorry, I had trouble thinking that through. Try again?";
          return Response.json({ reply });
        } catch (e) {
          console.error(e);
          return new Response(JSON.stringify({ error: "server" }), { status: 500 });
        }
      },
    },
  },
});
