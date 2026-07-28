// Gmail-connector powered emails for the HCAS flow.
const ADMIN_EMAIL = "hiprofitafrica2021@gmail.com";
const FROM = `HIPROFEET <${ADMIN_EMAIL}>`;
const GATEWAY_URL = "https://connector-gateway.lovable.dev/google_mail/gmail/v1";

function b64url(s: string) {
  return Buffer.from(s, "utf-8").toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function buildRaw(to: string, subject: string, html: string) {
  const msg = [
    `To: ${to}`,
    `From: ${FROM}`,
    `Subject: ${subject}`,
    "MIME-Version: 1.0",
    'Content-Type: text/html; charset="UTF-8"',
    "",
    html,
  ].join("\r\n");
  return b64url(msg);
}

async function sendGmail(to: string, subject: string, html: string) {
  const lovableKey = process.env.LOVABLE_API_KEY;
  const gmailKey = process.env.GOOGLE_MAIL_API_KEY;
  if (!lovableKey || !gmailKey) {
    console.error("hcas-email: missing keys");
    return { ok: false, reason: "missing_keys" as const };
  }
  const raw = buildRaw(to, subject, html);
  try {
    const res = await fetch(`${GATEWAY_URL}/users/me/messages/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${lovableKey}`,
        "X-Connection-Api-Key": gmailKey,
      },
      body: JSON.stringify({ raw }),
    });
    if (!res.ok) {
      const body = await res.text();
      console.error("gmail send failed", res.status, body);
      return { ok: false, status: res.status };
    }
    return { ok: true };
  } catch (e) {
    console.error("gmail send exception", (e as Error).message);
    return { ok: false, reason: "exception" };
  }
}

export function sendVerificationEmail(email: string, code: string, name: string) {
  const subject = `Your HIPROFEET verification code: ${code}`;
  const html = `
<div style="font-family:-apple-system,Segoe UI,Arial,sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;color:#111;background:#fff">
  <div style="font-family:Georgia,serif;font-size:22px;font-weight:700;color:#B8860B;letter-spacing:.5px">HIPRO<em>FEET</em></div>
  <div style="height:2px;width:40px;background:#B8860B;margin:8px 0 24px"></div>
  <h2 style="margin:0 0 12px;font-size:20px">Hi ${escapeHtml(name)}, one quick step.</h2>
  <p style="margin:0 0 20px;color:#333;line-height:1.55">To unlock your personalized Customer Acquisition Report, please enter this 6-digit verification code on the diagnosis page:</p>
  <div style="text-align:center;margin:28px 0;padding:20px;background:#F6F3EC;border:1px solid #E7DEC5;border-radius:12px">
    <div style="font-family:Courier,monospace;font-size:36px;font-weight:700;letter-spacing:8px;color:#111">${code}</div>
    <div style="margin-top:8px;font-size:12px;color:#666">Expires in 10 minutes</div>
  </div>
  <p style="margin:0 0 8px;font-size:13px;color:#555;line-height:1.55">Didn't request this? You can safely ignore this email.</p>
  <hr style="border:none;border-top:1px solid #eee;margin:28px 0 16px">
  <div style="font-size:11px;color:#999">HIPROFEET · Business Growth Intelligence for Nigerian founders</div>
</div>`;
  return sendGmail(email, subject, html);
}

export function sendReportReadyEmail(input: {
  email: string;
  name: string;
  business_name?: string | null;
  score: number;
  reportUrl: string;
  topBottleneck: string;
}) {
  const subject = `${input.name}, your Customer Acquisition Report is ready (Score: ${input.score}/100)`;
  const html = `
<div style="font-family:-apple-system,Segoe UI,Arial,sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;color:#111;background:#fff">
  <div style="font-family:Georgia,serif;font-size:22px;font-weight:700;color:#B8860B;letter-spacing:.5px">HIPRO<em>FEET</em></div>
  <div style="height:2px;width:40px;background:#B8860B;margin:8px 0 24px"></div>
  <h2 style="margin:0 0 8px;font-size:22px">Your report is ready, ${escapeHtml(input.name)}.</h2>
  <p style="margin:0 0 20px;color:#333;line-height:1.6">
    We analysed your answers across the five pillars of the HIPROFEET Customer Acquisition framework. Here is what we found.
  </p>
  <div style="padding:20px;background:#0F1729;border-radius:12px;color:#fff;margin:20px 0">
    <div style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#7AB8FF">Customer Acquisition Score</div>
    <div style="font-family:Georgia,serif;font-size:56px;font-weight:700;line-height:1;margin:6px 0 4px">${input.score}<span style="font-size:22px;color:#7AB8FF">/100</span></div>
    <div style="font-size:13px;color:#cfd7e6;margin-top:8px">Your #1 bottleneck: <strong style="color:#F5C86A">${escapeHtml(input.topBottleneck)}</strong></div>
  </div>
  <a href="${input.reportUrl}" style="display:block;text-align:center;padding:14px 20px;background:#B8860B;color:#fff;text-decoration:none;font-weight:700;border-radius:12px;margin:20px 0">Open your full report →</a>
  <p style="margin:24px 0 8px;color:#333;font-size:14px;line-height:1.6">
    The report is educational — it shows the <em>what</em>. To get the <em>exact how</em>, book a 45-minute Strategy Session with a Hiprofeet Growth Strategist. Introductory rate: <strong>₦4,500</strong> <span style="color:#888;text-decoration:line-through">₦15,000</span>.
  </p>
  <hr style="border:none;border-top:1px solid #eee;margin:28px 0 16px">
  <div style="font-size:11px;color:#999">HIPROFEET · Business Growth Intelligence for Nigerian founders<br>Report link is private to you. Please do not share.</div>
</div>`;
  return sendGmail(input.email, subject, html);
}

export function notifyAdminOfDiagnosis(input: {
  name: string;
  email: string;
  business_name?: string | null;
  industry?: string | null;
  score: number;
  reportUrl: string;
}) {
  const subject = `🧠 New Diagnosis: ${input.name} · Score ${input.score}/100`;
  const html = `
<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:20px;color:#111">
  <h2 style="margin:0 0 12px">New customer acquisition diagnosis</h2>
  <table style="width:100%;border-collapse:collapse;font-size:14px">
    <tr><td style="padding:6px 0;color:#666">Name</td><td style="padding:6px 0;font-weight:600">${escapeHtml(input.name)}</td></tr>
    <tr><td style="padding:6px 0;color:#666">Email</td><td style="padding:6px 0;font-weight:600">${escapeHtml(input.email)}</td></tr>
    <tr><td style="padding:6px 0;color:#666">Business</td><td style="padding:6px 0;font-weight:600">${escapeHtml(input.business_name || "—")}</td></tr>
    <tr><td style="padding:6px 0;color:#666">Industry</td><td style="padding:6px 0;font-weight:600">${escapeHtml(input.industry || "—")}</td></tr>
    <tr><td style="padding:6px 0;color:#666">Score</td><td style="padding:6px 0;font-weight:600">${input.score}/100</td></tr>
  </table>
  <p style="margin-top:16px"><a href="${input.reportUrl}" style="color:#B8860B">Open their report →</a></p>
</div>`;
  return sendGmail(ADMIN_EMAIL, subject, html);
}

export function notifyAdminOfConsultationClick(input: {
  name: string;
  email: string;
  business_name?: string | null;
  score: number;
  reportUrl: string;
}) {
  const subject = `🔥 Consultation request: ${input.name} clicked "Book Strategy Session"`;
  const html = `
<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:20px;color:#111">
  <h2 style="margin:0 0 12px">Hot lead — clicked to WhatsApp</h2>
  <table style="width:100%;border-collapse:collapse;font-size:14px">
    <tr><td style="padding:6px 0;color:#666">Name</td><td style="padding:6px 0;font-weight:600">${escapeHtml(input.name)}</td></tr>
    <tr><td style="padding:6px 0;color:#666">Email</td><td style="padding:6px 0;font-weight:600">${escapeHtml(input.email)}</td></tr>
    <tr><td style="padding:6px 0;color:#666">Business</td><td style="padding:6px 0;font-weight:600">${escapeHtml(input.business_name || "—")}</td></tr>
    <tr><td style="padding:6px 0;color:#666">Score</td><td style="padding:6px 0;font-weight:600">${input.score}/100</td></tr>
  </table>
  <p style="margin-top:16px"><a href="${input.reportUrl}" style="color:#B8860B">Open their report →</a></p>
  <p style="color:#666;font-size:13px">Expect a WhatsApp message from them shortly at +234 901 424 4117.</p>
</div>`;
  return sendGmail(ADMIN_EMAIL, subject, html);
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}
