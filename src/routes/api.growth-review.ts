import { createFileRoute } from "@tanstack/react-router";
import { SERVICE_LIST } from "@/data/services";

const CATALOGUE = SERVICE_LIST.map((s) => `- ${s.name} (id: ${s.id}) — ${s.price} — ${s.tag}`).join("\n");

const REVIEW_SYSTEM = `You are the HIPROFEET Business Growth Review writer. Given a full advisor conversation transcript and any shared materials, produce a structured, credible growth review for a Nigerian business owner.

Rules:
- Tone: senior consultant. Analytical, specific, respectful. Never hype language.
- Use concrete, plausible naira figures and percentages where reasonable.
- Reference facts the visitor actually shared; do not invent details.
- Recommend at most 2 HIPROFEET services, only if they clearly fit the diagnosis.
- Output ONLY valid JSON (no code fences, no commentary) with this exact shape:

{
  "business_name": string | null,
  "industry": string | null,
  "executive_summary": string,        // 2–4 sentences
  "strengths": string[],              // 2–4 short bullets
  "opportunities": string[],          // 3–5 short bullets, the growth constraints
  "priority_recommendations": [       // 3–5 actionable items, ordered by impact
    { "title": string, "why": string, "action": string }
  ],
  "next_steps": string[],             // 2–3 short items the owner should do this week
  "suggested_services": [             // 0 to 2 services from the HIPROFEET catalogue
    { "service_id": string, "reason": string }
  ]
}

HIPROFEET catalogue (use exact ids for suggested_services.service_id):
${CATALOGUE}`;

function renderEmail(review: any, businessName: string | null) {
  const brand = "#0f172a";
  const amber = "#f59e0b";
  const sky = "#0ea5e9";
  const rec = (review.priority_recommendations || [])
    .map(
      (r: any, i: number) => `
      <div style="margin:0 0 14px;padding:14px 16px;border:1px solid #e5e7eb;border-radius:10px;background:#fafafa">
        <div style="font-weight:700;color:${brand};font-size:15px">${i + 1}. ${escape(r.title)}</div>
        <div style="margin-top:6px;color:#4b5563;font-size:13px;line-height:1.5"><b>Why it matters:</b> ${escape(r.why)}</div>
        <div style="margin-top:6px;color:#111827;font-size:13px;line-height:1.5"><b>Action:</b> ${escape(r.action)}</div>
      </div>`,
    )
    .join("");
  const list = (arr: string[] = []) =>
    arr.length
      ? `<ul style="margin:8px 0 0;padding-left:18px;color:#374151;font-size:14px;line-height:1.6">${arr
          .map((x) => `<li>${escape(x)}</li>`)
          .join("")}</ul>`
      : `<div style="color:#9ca3af;font-size:13px">—</div>`;
  const services = (review.suggested_services || [])
    .map((s: any) => {
      const svc = SERVICE_LIST.find((x) => x.id === s.service_id);
      if (!svc) return "";
      return `
      <a href="https://hiprofeetv4.lovable.app/order/${svc.id}" style="display:block;margin:0 0 10px;padding:14px 16px;border:2px solid ${amber};border-radius:12px;background:#fffbeb;text-decoration:none;color:#111827">
        <div style="font-weight:800;font-size:15px">${svc.icon} ${escape(svc.name)} — ${svc.price}</div>
        <div style="margin-top:4px;font-size:13px;color:#4b5563">${escape(s.reason)}</div>
        <div style="margin-top:8px;font-size:12px;font-weight:700;color:${brand}">Deploy this →</div>
      </a>`;
    })
    .join("");
  return `<!doctype html>
<html><body style="margin:0;padding:0;background:#f3f4f6;font-family:'Helvetica Neue',Arial,sans-serif">
  <div style="max-width:640px;margin:0 auto;background:#ffffff">
    <div style="background:${brand};padding:28px 24px;color:#fff">
      <div style="font-size:11px;letter-spacing:2px;font-weight:700;color:${amber};text-transform:uppercase">HIPROFEET · Growth Intelligence</div>
      <div style="margin-top:6px;font-size:22px;font-weight:800">Your Business Growth Review</div>
      ${businessName ? `<div style="margin-top:4px;font-size:14px;color:#cbd5e1">Prepared for ${escape(businessName)}</div>` : ""}
    </div>

    <div style="padding:24px">
      <h3 style="margin:0 0 6px;color:${brand};font-size:15px">Executive summary</h3>
      <p style="margin:0;color:#374151;font-size:14px;line-height:1.6">${escape(review.executive_summary || "")}</p>

      <h3 style="margin:22px 0 6px;color:${brand};font-size:15px">What you're doing well</h3>
      ${list(review.strengths)}

      <h3 style="margin:22px 0 6px;color:${brand};font-size:15px">Growth opportunities</h3>
      ${list(review.opportunities)}

      <h3 style="margin:22px 0 10px;color:${brand};font-size:15px">Priority recommendations</h3>
      ${rec || `<div style="color:#9ca3af;font-size:13px">—</div>`}

      <h3 style="margin:22px 0 6px;color:${brand};font-size:15px">This week's next steps</h3>
      ${list(review.next_steps)}

      ${
        services
          ? `<h3 style="margin:26px 0 10px;color:${brand};font-size:15px">Suggested HIPROFEET solutions</h3>${services}`
          : ""
      }

      <div style="margin-top:28px;padding:18px;border-radius:12px;background:${brand};color:#fff;text-align:center">
        <div style="font-size:15px;font-weight:700">Want a real expert to walk you through this?</div>
        <div style="margin-top:4px;font-size:13px;color:#cbd5e1">Book a 60-minute session with a HIPROFEET consultant.</div>
        <a href="https://hiprofeetv4.lovable.app/order/consultant" style="display:inline-block;margin-top:12px;padding:10px 22px;border-radius:999px;background:${sky};color:#fff;text-decoration:none;font-weight:700;font-size:13px">Book Consultation</a>
      </div>

      <p style="margin-top:24px;font-size:12px;color:#9ca3af;line-height:1.5">Keep this email — it's your reference as you grow. When you're ready, HIPROFEET can execute any of the recommendations above for you.</p>
    </div>

    <div style="background:#0b1220;padding:16px 24px;color:#9ca3af;font-size:12px;text-align:center">
      HIPROFEET · Business Growth Intelligence · hiprofeetv4.lovable.app
    </div>
  </div>
</body></html>`;
}

function escape(s: string) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}

function b64url(s: string) {
  return Buffer.from(s, "utf-8").toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function buildRaw(to: string, from: string, subject: string, html: string, bcc?: string) {
  const lines = [`To: ${to}`, `From: ${from}`];
  if (bcc) lines.push(`Bcc: ${bcc}`);
  lines.push(`Subject: ${subject}`, "MIME-Version: 1.0", 'Content-Type: text/html; charset="UTF-8"', "", html);
  return b64url(lines.join("\r\n"));
}

async function sendEmail(to: string, subject: string, html: string) {
  const gmailKey = process.env.GOOGLE_MAIL_API_KEY;
  const lovableKey = process.env.LOVABLE_API_KEY;
  if (!gmailKey || !lovableKey) return { ok: false, reason: "missing_keys" };
  const raw = buildRaw(to, `HIPROFEET <hiprofitafrica2021@gmail.com>`, subject, html, "hiprofitafrica2021@gmail.com");
  const res = await fetch("https://connector-gateway.lovable.dev/google_mail/gmail/v1/users/me/messages/send", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${lovableKey}`, "X-Connection-Api-Key": gmailKey },
    body: JSON.stringify({ raw }),
  });
  if (!res.ok) {
    console.error("Growth review email failed", res.status, await res.text());
    return { ok: false, status: res.status };
  }
  return { ok: true };
}

export const Route = createFileRoute("/api/growth-review")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const {
            messages,
            email,
            conversation_id,
            uploads,
          } = (await request.json()) as {
            messages: { role: "ai" | "u"; text: string }[];
            email: string;
            conversation_id?: string | null;
            uploads?: { kind: string; value: string; label?: string }[];
          };

          if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
            return new Response(JSON.stringify({ error: "invalid_email" }), { status: 400 });
          }
          const apiKey = process.env.LOVABLE_API_KEY;
          if (!apiKey) return new Response(JSON.stringify({ error: "AI not configured" }), { status: 500 });

          const transcript = messages
            .map((m) => `${m.role === "u" ? "Visitor" : "Advisor"}: ${m.text}`)
            .join("\n");
          const uploadSummary = uploads?.length
            ? "\n\nShared materials:\n" + uploads.map((u) => `- ${u.kind}: ${u.value}${u.label ? ` (${u.label})` : ""}`).join("\n")
            : "";

          const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
            method: "POST",
            headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
            body: JSON.stringify({
              model: "google/gemini-3-flash-preview",
              response_format: { type: "json_object" },
              messages: [
                { role: "system", content: REVIEW_SYSTEM },
                { role: "user", content: `TRANSCRIPT:\n${transcript}${uploadSummary}` },
              ],
            }),
          });
          if (aiRes.status === 429 || aiRes.status === 402) {
            return new Response(JSON.stringify({ error: "limit" }), { status: aiRes.status });
          }
          if (!aiRes.ok) {
            console.error("Growth review AI error", aiRes.status, await aiRes.text());
            return new Response(JSON.stringify({ error: "upstream" }), { status: 500 });
          }
          const aiData = await aiRes.json();
          const raw = aiData.choices?.[0]?.message?.content ?? "{}";
          let review: any;
          try {
            review = JSON.parse(raw);
          } catch {
            const m = raw.match(/\{[\s\S]*\}/);
            review = m ? JSON.parse(m[0]) : {};
          }

          // Persist + send
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const { data: saved } = await supabaseAdmin
            .from("growth_reviews")
            .insert({
              conversation_id: conversation_id ?? null,
              email,
              business_name: review.business_name ?? null,
              industry: review.industry ?? null,
              review_json: review,
            })
            .select("id")
            .single();

          const subject = "Your HIPROFEET Business Growth Review is ready";
          const html = renderEmail(review, review.business_name ?? null);
          const sendRes = await sendEmail(email, subject, html);

          if (sendRes.ok && saved?.id) {
            await supabaseAdmin.from("growth_reviews").update({ sent_at: new Date().toISOString() }).eq("id", saved.id);
          }

          return Response.json({ ok: true, review, sent: sendRes.ok });
        } catch (e) {
          console.error("growth-review error", e);
          return new Response(JSON.stringify({ error: "server" }), { status: 500 });
        }
      },
    },
  },
});
