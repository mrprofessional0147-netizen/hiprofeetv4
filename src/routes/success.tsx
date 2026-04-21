import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { WHATSAPP_DISPLAY, WHATSAPP_NUMBER } from "@/data/services";

const search = z.object({ wa: z.string().optional() });

export const Route = createFileRoute("/success")({
  validateSearch: search,
  head: () => ({ meta: [{ title: "Order Received — HIPROFEET" }] }),
  component: SuccessPage,
});

function SuccessPage() {
  const { wa } = Route.useSearch();
  const link = wa || `https://wa.me/${WHATSAPP_NUMBER}`;
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-5 py-20">
      <div className="w-full max-w-md text-center">
        <div className="pop-in text-6xl">🎉</div>
        <h1 className="mt-4 font-display text-4xl font-bold text-white">Order <em className="not-italic text-amber italic">Received!</em></h1>
        <p className="mt-3 text-base font-light leading-[1.78] text-white/60">
          Screenshot submitted. Message us on WhatsApp now and we'll confirm and start immediately.
        </p>

        <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 text-left">
          {[
            ["1", <><strong className="font-semibold text-white">Tap WhatsApp below</strong> — your order details are pre-filled and ready to send.</>],
            ["2", <><strong className="font-semibold text-white">Send the message</strong> — we confirm payment and assign your project immediately.</>],
            ["3", <><strong className="font-semibold text-white">We deliver in 2–5 days</strong> — you run your business, we handle everything.</>],
          ].map(([n, body]) => (
            <div key={n as string} className="flex items-start gap-3">
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">{n}</div>
              <div className="text-sm font-light leading-relaxed text-white/65">{body}</div>
            </div>
          ))}
        </div>

        <a href={link} target="_blank" rel="noopener" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-4 text-base font-bold text-white transition active:scale-[0.98]">
          <span className="text-xl">💬</span> Message Us on WhatsApp
        </a>
        <p className="mt-3 text-xs text-white/40">{WHATSAPP_DISPLAY} · We respond within a few hours during business hours.</p>
        <Link to="/" className="mt-6 inline-block text-sm text-white/50 underline">← Back to home</Link>
      </div>
    </div>
  );
}
