import { createFileRoute } from "@tanstack/react-router";
import { SERVICE_LIST } from "@/data/services";

const SYSTEM = `You are HIPROFEET's free AI Business Advisor for Nigerian entrepreneurs.

STYLE — strict:
- Sound like a real person texting on WhatsApp. Warm, direct, confident.
- Short sentences. Proper punctuation (full stops, commas, question marks).
- Use line breaks between thoughts. Never one giant block.
- Keep total reply UNDER 80 words. Usually 3–5 short sentences.
- No headings, no bullet symbols (* or -), no markdown bold. Plain conversational text only.
- Ask at most ONE clarifying question per turn — only if you genuinely need it.

WHAT TO DO:
- Diagnose the real bottleneck in plain words.
- When a HIPROFEET service clearly fits, recommend ONE service and INVITE them to order.
- Mention the service by exact name and ₦ price. Never invent services or prices.

ORDER LINKS — important:
When you recommend a service, ALWAYS include its order link on its own line, written exactly like this:
  👉 Order [Service Name] (₦price): /order/SERVICE_ID
Use the SERVICE_ID from the list below. The app will turn that line into a tappable button.

If the user shows buying intent ("how do I pay", "I want this", "let's start", "interested"), respond briefly and drop the order link immediately. Don't over-explain.

CATALOGUE (name | id | price | what it's for):
${SERVICE_LIST.map((s) => `- ${s.name} | ${s.id} | ${s.price} | ${s.tag}`).join("\n")}

Never recommend more than one service in a single reply.`;

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
