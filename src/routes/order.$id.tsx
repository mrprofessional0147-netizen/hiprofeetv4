import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Nav } from "@/components/layout";
import { SERVICES, BANK, WHATSAPP_NUMBER } from "@/data/services";
import { toast } from "sonner";

export const Route = createFileRoute("/order/$id")({
  loader: ({ params }) => {
    const svc = SERVICES[params.id];
    if (!svc) throw notFound();
    return { svc };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `Order ${loaderData?.svc.name} — HIPROFEET` },
      { name: "description", content: loaderData?.svc.tag ?? "" },
    ],
  }),
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center bg-ink text-white">
      <div className="text-center">
        <h1 className="font-display text-3xl">Service not found</h1>
        <Link to="/" className="mt-4 inline-block text-amber underline">Go home</Link>
      </div>
    </div>
  ),
  component: OrderPage,
});

function OrderPage() {
  const { svc } = Route.useLoaderData();
  const navigate = useNavigate();
  const [folQty, setFolQty] = useState(500);
  const [folPlat, setFolPlat] = useState("Instagram");
  const [revQty, setRevQty] = useState(10);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [biz, setBiz] = useState("");
  const [receipt, setReceipt] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const total = useMemo(() => {
    if (svc.isFollowers) return folQty * svc.amt;
    if (svc.isReviews) return revQty * svc.amt;
    return svc.amt;
  }, [svc, folQty, revQty]);

  const totalDisplay = `₦${total.toLocaleString()}`;

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => setReceipt(r.result as string);
    r.readAsDataURL(f);
  };

  const copyAcct = async () => {
    await navigator.clipboard.writeText(BANK.account);
    toast.success("Account number copied");
  };

  const submit = () => {
    if (!name || !phone || !receipt) {
      toast.error("Please fill all required fields and upload receipt");
      return;
    }
    setSubmitting(true);
    const qty = svc.isFollowers ? `${folQty} ${folPlat} followers` : svc.isReviews ? `${revQty} ${svc.platform} reviews` : svc.name;
    const msg = `Hi HIPROFEET, I just placed an order:\n\n*Service:* ${qty}\n*Amount:* ${totalDisplay}\n*Name:* ${name}\n*WhatsApp:* ${phone}\n*Business:* ${biz || "—"}\n\nI've uploaded my payment receipt on the website. Please confirm and start.`;
    const wa = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    setTimeout(() => {
      navigate({ to: "/success", search: { wa } });
    }, 400);
  };

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-off pt-20 pb-16">
        <div className="container-page">
          <Link to="/" className="mb-6 inline-flex items-center gap-2 py-2 text-sm font-bold text-brand">← Back to Home</Link>
          <div className="grid gap-5 lg:grid-cols-[1fr_1.1fr]">
            {/* Service summary */}
            <div className="overflow-hidden rounded-3xl bg-ink">
              <div className="relative h-48">
                <img src={svc.img} alt={svc.name} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-ink/90" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <div className="text-3xl">{svc.icon}</div>
                  <div className="font-display text-2xl font-bold leading-tight">{svc.name}</div>
                  <div className="mt-1 text-xs font-light text-white/50">{svc.tag}</div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <div className="font-display text-2xl font-bold text-amber">{svc.price}</div>
                    <div className="text-[11px] font-light text-white/40">{svc.period}</div>
                  </div>
                </div>
              </div>
              <div className="p-5 text-white">
                <div className="text-[10px] font-bold uppercase tracking-[2.5px] text-amber">How this grows your business</div>
                <p className="mt-2 text-sm font-light leading-[1.78] text-white/65">{svc.helps}</p>
                <div className="mt-5 text-[10px] font-bold uppercase tracking-[2.5px] text-amber">What's included</div>
                <div className="mt-2 flex flex-col gap-2">
                  {svc.benefits.map((b) => (
                    <div key={b} className="flex gap-2 text-sm font-light text-white/65">
                      <span className="mt-0.5 text-emerald-400">✓</span><span>{b}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-3 text-sm font-light text-white/60">
                  ⚡<div><strong className="font-semibold text-white">Delivered in {svc.tl}.</strong> We handle everything — no tech skills needed.</div>
                </div>
              </div>
            </div>

            {/* Order form */}
            <div className="rounded-3xl border border-brand/10 bg-white p-6 shadow-sm">
              <div className="font-display text-2xl font-bold text-t-dark">Place Your Order</div>
              <div className="mt-1 text-sm font-light text-t-mid">Transfer payment, upload your receipt, and we start within 24 hours.</div>

              {svc.isFollowers && (
                <div className="mt-5 rounded-2xl border border-brand/15 bg-off p-4">
                  <div className="mb-3 text-[11px] font-bold uppercase tracking-[2px] text-brand">🎯 Choose Platform & Quantity</div>
                  <div className="mb-3 flex flex-wrap gap-2">
                    {["Instagram", "Facebook", "TikTok"].map((p) => (
                      <button key={p} onClick={() => setFolPlat(p)} className={`rounded-full border px-4 py-2 text-[13px] font-semibold transition ${folPlat === p ? "border-brand bg-brand text-white" : "border-brand/15 bg-white text-t-mid"}`}>
                        {p}
                      </button>
                    ))}
                  </div>
                  <QtyPicker value={folQty} setValue={setFolQty} step={100} min={100} />
                </div>
              )}

              {svc.isReviews && (
                <div className="mt-5 rounded-2xl border border-brand/15 bg-off p-4">
                  <div className="mb-2 text-[11px] font-bold uppercase tracking-[2px] text-brand">⭐ Choose Number of Reviews</div>
                  <div className="mb-3 text-[13px] text-t-mid">₦350 per review · minimum 5</div>
                  <QtyPicker value={revQty} setValue={setRevQty} step={5} min={5} />
                </div>
              )}

              <div className="mt-5 rounded-2xl border border-brand/15 bg-gradient-to-br from-off to-off/85 p-4">
                <div className="mb-3 text-[10px] font-bold uppercase tracking-[2px] text-brand">💳 Payment Details</div>
                <Row label="Bank" value={BANK.name} />
                <Row label="Account Name" value={BANK.holder} />
                <div className="flex items-center justify-between border-b border-brand/10 py-2.5">
                  <span className="text-[13px] text-t-mid">Account No.</span>
                  <div className="flex items-center gap-2">
                    <span className="font-display text-lg font-bold tracking-wider text-brand">{BANK.account}</span>
                    <button onClick={copyAcct} className="rounded-full border border-brand/20 bg-brand/10 px-3 py-1 text-[11px] font-bold text-brand transition active:bg-brand active:text-white">Copy</button>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between rounded-xl bg-ink p-3.5">
                  <span className="text-xs text-white/45">Total to pay</span>
                  <span className="font-display text-xl font-bold text-amber">{totalDisplay}</span>
                </div>
              </div>

              <Field label="Full Name *" value={name} onChange={setName} placeholder="Your full name" autoComplete="name" />
              <Field label="WhatsApp Number *" value={phone} onChange={setPhone} placeholder="e.g. 08012345678" autoComplete="tel" type="tel" />
              <Field label="Business Name" value={biz} onChange={setBiz} placeholder="Your business name" />

              <div className="mt-4">
                <label className="mb-1.5 block text-[13px] font-semibold text-t-dark">Payment Screenshot *</label>
                {!receipt ? (
                  <label className="relative flex cursor-pointer flex-col items-center rounded-2xl border-2 border-dashed border-brand/20 bg-off p-7 text-center transition hover:border-brand hover:bg-brand/[0.03]">
                    <input type="file" accept="image/*" onChange={onFile} className="absolute inset-0 cursor-pointer opacity-0" />
                    <div className="text-2xl">📎</div>
                    <div className="mt-2 text-sm font-semibold text-t-dark">Tap to upload receipt</div>
                    <div className="text-xs text-t-soft">Screenshot of your bank transfer</div>
                  </label>
                ) : (
                  <div className="text-center">
                    <img src={receipt} alt="" className="mx-auto max-h-36 rounded-xl border border-brand/15 object-contain" />
                    <div className="mt-2 text-xs font-bold text-success">✓ Uploaded</div>
                    <button onClick={() => setReceipt(null)} className="mt-1 text-xs text-t-soft underline">Replace</button>
                  </div>
                )}
              </div>

              <button
                disabled={submitting}
                onClick={submit}
                className="mt-5 w-full rounded-2xl bg-amber py-4 text-base font-bold text-white transition active:scale-[0.98] disabled:bg-gray-300"
              >
                {submitting ? "Submitting…" : "Submit Order & Get Started →"}
              </button>
              <p className="mt-2 text-center text-xs leading-relaxed text-t-soft">
                WhatsApp opens after submission with your order details pre-filled. We start within 24 hours.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-brand/10 py-2.5 last:border-b-0">
      <span className="text-[13px] text-t-mid">{label}</span>
      <span className="text-sm font-bold text-t-dark">{value}</span>
    </div>
  );
}

function Field({ label, value, onChange, ...rest }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; autoComplete?: string; type?: string }) {
  return (
    <div className="mt-4">
      <label className="mb-1.5 block text-[13px] font-semibold text-t-dark">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-brand/15 bg-off px-4 py-3.5 text-[15px] text-t-dark outline-none transition focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/10"
        {...rest}
      />
    </div>
  );
}

function QtyPicker({ value, setValue, step, min }: { value: number; setValue: (n: number) => void; step: number; min: number }) {
  return (
    <div className="flex items-center gap-3">
      <button onClick={() => setValue(Math.max(min, value - step))} className="h-9 w-9 rounded-full border border-brand/15 bg-white text-xl font-bold text-t-dark active:bg-brand active:text-white">−</button>
      <input
        type="number"
        value={value}
        min={min}
        step={step}
        onChange={(e) => setValue(Math.max(min, parseInt(e.target.value) || min))}
        className="flex-1 rounded-xl border border-brand/15 bg-white px-3 py-2 text-center font-display text-lg font-bold text-t-dark outline-none focus:border-brand"
      />
      <button onClick={() => setValue(value + step)} className="h-9 w-9 rounded-full border border-brand/15 bg-white text-xl font-bold text-t-dark active:bg-brand active:text-white">+</button>
    </div>
  );
}
