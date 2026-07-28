// Public diagnosis flow API. Start a session, submit answers, request/verify OTP,
// finalize (generate report + optionally require verification), fetch report, register consultation click.

import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import {
  serverSupabase,
  readVerificationRequired,
  generateToken,
  generateOtp,
  hashOtp,
} from "@/lib/hcas-config.server";
import {
  QUESTIONS,
  scoreAnswers,
  generateReport,
  PILLAR_META,
  type Answers,
  type Pillar,
} from "@/lib/diagnosis-engine.server";
import {
  sendVerificationEmail,
  sendReportReadyEmail,
  notifyAdminOfDiagnosis,
  notifyAdminOfConsultationClick,
} from "@/lib/hcas-email.server";

const startSchema = z.object({
  name: z.string().trim().min(1).max(80),
  business_name: z.string().trim().max(120).optional().nullable(),
  industry: z.string().trim().max(80).optional().nullable(),
  revenue_band: z.string().trim().max(40).optional().nullable(),
  source: z.string().trim().max(60).optional().nullable(),
});

const answerSchema = z.object({
  session_token: z.string().min(10),
  answers: z.record(z.string(), z.object({ value: z.string().max(60), note: z.string().max(600).optional() })),
});

const finalizeSchema = z.object({
  session_token: z.string().min(10),
  email: z.string().trim().email().max(200),
});

const verifySchema = z.object({
  session_token: z.string().min(10),
  code: z.string().regex(/^\d{6}$/),
});

const reportSchema = z.object({ token: z.string().min(10) });
const consultSchema = z.object({ token: z.string().min(10) });

async function handle(request: Request) {
  const url = new URL(request.url);
  const action = url.pathname.split("/").pop() || "";
  const sb = serverSupabase();

  if (request.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  try {
    if (action === "start") {
      const p = startSchema.parse(body);
      const session_token = generateToken(20);
      const { data, error } = await sb
        .from("diagnoses")
        .insert({
          session_token,
          name: p.name,
          business_name: p.business_name ?? null,
          industry: p.industry ?? null,
          revenue_band: p.revenue_band ?? null,
          source: p.source ?? null,
          ip: request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for") || null,
          user_agent: request.headers.get("user-agent") || null,
          status: "in_progress",
        })
        .select("id")
        .single();
      if (error) throw error;
      return json({ session_token, id: data.id, questions: QUESTIONS });
    }

    if (action === "answers") {
      const p = answerSchema.parse(body);
      const { error } = await sb
        .from("diagnoses")
        .update({ answers: p.answers })
        .eq("session_token", p.session_token);
      if (error) throw error;
      return json({ ok: true });
    }

    if (action === "finalize") {
      const p = finalizeSchema.parse(body);
      const { data: row, error } = await sb
        .from("diagnoses")
        .select("*")
        .eq("session_token", p.session_token)
        .maybeSingle();
      if (error) throw error;
      if (!row) return json({ error: "session_not_found" }, 404);

      const answers = (row.answers || {}) as Answers;
      const { score, pillar_scores } = scoreAnswers(answers);

      const requireVerify = await readVerificationRequired();

      // save email + scores + status
      await sb
        .from("diagnoses")
        .update({
          email: p.email.toLowerCase(),
          score,
          pillar_scores,
          status: requireVerify ? "awaiting_verification" : "verified",
        })
        .eq("id", row.id);

      if (requireVerify) {
        const code = generateOtp();
        const code_hash = hashOtp(code);
        const expires_at = new Date(Date.now() + 10 * 60 * 1000).toISOString();
        await sb.from("email_verifications").insert({
          diagnosis_id: row.id,
          email: p.email.toLowerCase(),
          code_hash,
          expires_at,
        });
        await sendVerificationEmail(p.email, code, row.name || "there");
        return json({ ok: true, verification: "required" });
      }

      // No verification — generate report immediately
      const report_token = await finalizeReportForDiagnosis(row.id);
      return json({ ok: true, verification: "skipped", report_token });
    }

    if (action === "verify") {
      const p = verifySchema.parse(body);
      const { data: diag, error } = await sb
        .from("diagnoses")
        .select("id, name, email, business_name, industry, score, pillar_scores, answers, revenue_band")
        .eq("session_token", p.session_token)
        .maybeSingle();
      if (error) throw error;
      if (!diag) return json({ error: "session_not_found" }, 404);

      const { data: v } = await sb
        .from("email_verifications")
        .select("*")
        .eq("diagnosis_id", diag.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!v) return json({ error: "no_code" }, 400);
      if (v.verified_at) return json({ error: "already_used" }, 400);
      if (new Date(v.expires_at).getTime() < Date.now()) return json({ error: "expired" }, 400);
      if (v.attempts >= 5) return json({ error: "too_many_attempts" }, 429);

      if (hashOtp(p.code) !== v.code_hash) {
        await sb.from("email_verifications").update({ attempts: v.attempts + 1 }).eq("id", v.id);
        return json({ error: "wrong_code", attempts_left: Math.max(0, 4 - v.attempts) }, 400);
      }

      await sb.from("email_verifications").update({ verified_at: new Date().toISOString() }).eq("id", v.id);
      const report_token = await finalizeReportForDiagnosis(diag.id);
      return json({ ok: true, report_token });
    }

    if (action === "resend") {
      const p = z.object({ session_token: z.string().min(10) }).parse(body);
      const { data: diag } = await sb
        .from("diagnoses")
        .select("id, name, email")
        .eq("session_token", p.session_token)
        .maybeSingle();
      if (!diag || !diag.email) return json({ error: "session_not_found" }, 404);
      const code = generateOtp();
      await sb.from("email_verifications").insert({
        diagnosis_id: diag.id,
        email: diag.email,
        code_hash: hashOtp(code),
        expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
      });
      await sendVerificationEmail(diag.email, code, diag.name || "there");
      return json({ ok: true });
    }

    if (action === "report") {
      const p = reportSchema.parse(body);
      const { data: diag, error } = await sb
        .from("diagnoses")
        .select("id, name, business_name, industry, score, pillar_scores, report, status, created_at")
        .eq("report_token", p.token)
        .maybeSingle();
      if (error) throw error;
      if (!diag || !diag.report) return json({ error: "not_found" }, 404);
      return json({ diagnosis: diag, pillar_meta: PILLAR_META });
    }

    if (action === "consultation") {
      const p = consultSchema.parse(body);
      const { data: diag } = await sb
        .from("diagnoses")
        .select("id, name, email, business_name, score, report_token")
        .eq("report_token", p.token)
        .maybeSingle();
      if (!diag) return json({ error: "not_found" }, 404);
      await sb.from("consultation_requests").insert({ diagnosis_id: diag.id, status: "new" });
      // fire-and-forget admin ping
      const origin = new URL(request.url).origin;
      notifyAdminOfConsultationClick({
        name: diag.name || "Founder",
        email: diag.email || "unknown",
        business_name: diag.business_name,
        score: diag.score || 0,
        reportUrl: `${origin}/report/${diag.report_token}`,
      }).catch(() => {});
      return json({ ok: true });
    }

    return json({ error: "unknown_action" }, 404);
  } catch (err) {
    if (err instanceof z.ZodError) return json({ error: "invalid_input", details: err.issues }, 400);
    console.error("diagnosis api error", (err as Error).message);
    return json({ error: "server_error" }, 500);
  }

  async function finalizeReportForDiagnosis(id: string): Promise<string> {
    const { data: full } = await sb.from("diagnoses").select("*").eq("id", id).single();
    if (!full) throw new Error("diag_missing");
    const answers = (full.answers || {}) as Answers;
    const { score, pillar_scores } = scoreAnswers(answers);
    const report = await generateReport({
      name: full.name || "there",
      business_name: full.business_name,
      industry: full.industry,
      revenue_band: full.revenue_band,
      answers,
      score,
      pillar_scores,
    });
    const report_token = generateToken(24);
    await sb
      .from("diagnoses")
      .update({
        report,
        report_token,
        score,
        pillar_scores,
        status: "delivered",
        verified_at: new Date().toISOString(),
        delivered_at: new Date().toISOString(),
      })
      .eq("id", id);

    const origin = new URL(request.url).origin;
    const reportUrl = `${origin}/report/${report_token}`;
    // Find worst pillar for the email
    const worst = (Object.entries(pillar_scores) as [Pillar, number][]).sort((a, b) => a[1] - b[1])[0];
    if (full.email) {
      sendReportReadyEmail({
        email: full.email,
        name: full.name || "there",
        business_name: full.business_name,
        score,
        reportUrl,
        topBottleneck: PILLAR_META[worst[0]].label,
      }).catch(() => {});
    }
    notifyAdminOfDiagnosis({
      name: full.name || "Founder",
      email: full.email || "unknown",
      business_name: full.business_name,
      industry: full.industry,
      score,
      reportUrl,
    }).catch(() => {});
    return report_token;
  }
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const Route = createFileRoute("/api/diagnosis/$")({
  server: {
    handlers: {
      POST: async ({ request }) => handle(request),
    },
  },
});
