import { createServerFn } from "@tanstack/react-start";

const ADMIN_EMAIL = "hiprofitafrica2021@gmail.com";
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

export type OrderNotifyInput = {
  service: string;
  quantity: number | null;
  platform: string | null;
  amount: number;
  customer_name: string;
  customer_phone: string;
  business_name: string | null;
  coupon_code: string | null;
  is_free: boolean;
};

export const notifyAdminOfOrder = createServerFn({ method: "POST" })
  .inputValidator((d: OrderNotifyInput) => d)
  .handler(async ({ data }) => {
    const lovableKey = process.env.LOVABLE_API_KEY;
    const gmailKey = process.env.GOOGLE_MAIL_API_KEY;
    if (!lovableKey || !gmailKey) {
      console.error("notifyAdminOfOrder: missing keys");
      return { ok: false, reason: "missing_keys" };
    }

    const qty = data.quantity
      ? `${data.quantity}${data.platform ? ` ${data.platform}` : ""}`
      : "—";
    const subject = data.is_free
      ? `🎁 FREE giveaway claimed: ${data.service}`
      : `🛒 New order: ${data.service} (₦${data.amount.toLocaleString()})`;

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:20px;color:#111">
        <h2 style="margin:0 0 12px">${data.is_free ? "🎁 Giveaway claimed" : "🛒 New order received"}</h2>
        <table style="width:100%;border-collapse:collapse;font-size:14px">
          <tr><td style="padding:6px 0;color:#666">Service</td><td style="padding:6px 0;font-weight:600">${data.service}</td></tr>
          <tr><td style="padding:6px 0;color:#666">Quantity</td><td style="padding:6px 0;font-weight:600">${qty}</td></tr>
          <tr><td style="padding:6px 0;color:#666">Amount</td><td style="padding:6px 0;font-weight:600">${data.is_free ? "FREE" : `₦${data.amount.toLocaleString()}`}</td></tr>
          ${data.coupon_code ? `<tr><td style="padding:6px 0;color:#666">Coupon</td><td style="padding:6px 0;font-weight:600">${data.coupon_code}</td></tr>` : ""}
          <tr><td style="padding:6px 0;color:#666">Customer</td><td style="padding:6px 0;font-weight:600">${data.customer_name}</td></tr>
          <tr><td style="padding:6px 0;color:#666">WhatsApp</td><td style="padding:6px 0;font-weight:600"><a href="https://wa.me/${data.customer_phone.replace(/\D/g, "")}">${data.customer_phone}</a></td></tr>
          ${data.business_name ? `<tr><td style="padding:6px 0;color:#666">Business</td><td style="padding:6px 0;font-weight:600">${data.business_name}</td></tr>` : ""}
        </table>
        <p style="margin-top:18px;font-size:13px;color:#666">Open the admin dashboard to view the receipt and update order status.</p>
      </div>
    `;

    const raw = buildRaw(ADMIN_EMAIL, `HIPROFEET Orders <${ADMIN_EMAIL}>`, subject, html);

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
        console.error("Gmail send failed", res.status, body);
        return { ok: false, status: res.status };
      }
      return { ok: true };
    } catch (e: any) {
      console.error("Gmail send error", e?.message);
      return { ok: false, reason: "exception" };
    }
  });
