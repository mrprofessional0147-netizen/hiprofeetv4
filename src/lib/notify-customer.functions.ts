import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const FROM_EMAIL = "hiprofitafrica2021@gmail.com";
const GATEWAY_URL = "https://connector-gateway.lovable.dev/google_mail/gmail/v1";

function b64url(s: string) {
  return Buffer.from(s, "utf-8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function buildRaw(to: string, from: string, subject: string, html: string) {
  const msg = [
    `To: ${to}`,
    `From: ${from}`,
    `Subject: ${subject}`,
    "MIME-Version: 1.0",
    'Content-Type: text/html; charset="UTF-8"',
    "",
    html,
  ].join("\r\n");
  return b64url(msg);
}

const STATUS_COPY: Record<string, { title: string; body: string; emoji: string }> = {
  pending: { emoji: "⏳", title: "Order received — pending review", body: "We've received your order and our team will review it shortly." },
  confirmed: { emoji: "✅", title: "Order confirmed", body: "Great news! Your order has been confirmed and is queued for processing." },
  in_progress: { emoji: "🚀", title: "Order in progress", body: "Our team is now actively working on your order. You'll get another update soon." },
  completed: { emoji: "🎉", title: "Order completed", body: "Your order is complete! Thank you for trusting HIPROFEET. We'd love to serve you again." },
  cancelled: { emoji: "⚠️", title: "Order cancelled", body: "Your order has been cancelled. If this was unexpected, please reach out on WhatsApp." },
};

export const notifyCustomerOfStatus = createServerFn({ method: "POST" })
  .inputValidator((d: { order_id: string; new_status: string }) => d)
  .handler(async ({ data }) => {
    const lovableKey = process.env.LOVABLE_API_KEY;
    const gmailKey = process.env.GOOGLE_MAIL_API_KEY;
    if (!lovableKey || !gmailKey) return { ok: false, reason: "missing_keys" };

    const { data: order, error: oErr } = await supabaseAdmin
      .from("orders")
      .select("id,user_id,service_name,quantity,platform,amount,customer_name,admin_notes")
      .eq("id", data.order_id)
      .single();
    if (oErr || !order) return { ok: false, reason: "order_not_found" };

    const { data: userRes, error: uErr } = await supabaseAdmin.auth.admin.getUserById(order.user_id);
    if (uErr || !userRes?.user?.email) return { ok: false, reason: "no_email" };
    const toEmail = userRes.user.email;

    const copy = STATUS_COPY[data.new_status] ?? { emoji: "📦", title: `Order ${data.new_status}`, body: "Your order status has been updated." };
    const qty = order.quantity ? `${order.quantity}${order.platform ? ` ${order.platform}` : ""}` : "—";

    const subject = `${copy.emoji} ${copy.title} — ${order.service_name}`;
    const html = `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#111">
        <h2 style="margin:0 0 8px">${copy.emoji} ${copy.title}</h2>
        <p style="margin:0 0 16px;color:#444;font-size:14px;line-height:1.5">Hi ${order.customer_name?.split(" ")[0] ?? "there"}, ${copy.body}</p>
        <table style="width:100%;border-collapse:collapse;font-size:14px;background:#f7f8fa;border-radius:8px;padding:12px">
          <tr><td style="padding:8px 12px;color:#666">Service</td><td style="padding:8px 12px;font-weight:600">${order.service_name}</td></tr>
          <tr><td style="padding:8px 12px;color:#666">Quantity</td><td style="padding:8px 12px;font-weight:600">${qty}</td></tr>
          <tr><td style="padding:8px 12px;color:#666">Amount</td><td style="padding:8px 12px;font-weight:600">₦${order.amount.toLocaleString()}</td></tr>
          <tr><td style="padding:8px 12px;color:#666">Status</td><td style="padding:8px 12px;font-weight:700;text-transform:capitalize">${data.new_status.replace("_", " ")}</td></tr>
        </table>
        ${order.admin_notes ? `<div style="margin-top:16px;padding:12px;border-left:3px solid #2563eb;background:#eef4ff;font-size:13px"><b>Note from our team:</b><br>${order.admin_notes}</div>` : ""}
        <p style="margin-top:20px;font-size:13px;color:#666">Track your order anytime: <a href="https://hiprofeetv4.lovable.app/orders" style="color:#2563eb">My Orders</a></p>
        <p style="margin-top:8px;font-size:12px;color:#999">— The HIPROFEET Team</p>
      </div>
    `;

    const raw = buildRaw(toEmail, `HIPROFEET <${FROM_EMAIL}>`, subject, html);

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
        console.error("Customer email failed", res.status, body);
        return { ok: false, status: res.status };
      }
      return { ok: true };
    } catch (e: any) {
      console.error("Customer email error", e?.message);
      return { ok: false, reason: "exception" };
    }
  });
