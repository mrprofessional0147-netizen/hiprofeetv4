import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Nav } from "@/components/layout";
import { SERVICES, BANK, WHATSAPP_NUMBER, FOLLOWER_PRICES } from "@/data/services";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

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
  const { user, profile, loading: authLoading } = useAuth();
  const [folQty, setFolQty] = useState(500);
  const [folPlat, setFolPlat] = useState("Instagram");
  const [revQty, setRevQty] = useState(10);
  const [viewQty, setViewQty] = useState(500);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [biz, setBiz] = useState("");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; percent_off: number; id: string } | null>(null);
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  // Pre-fill from profile
  useEffect(() => {
    if (profile) {
      if (profile.full_name && !name) setName(profile.full_name);
      if (profile.phone && !phone) setPhone(profile.phone);
      if (profile.business_name && !biz) setBiz(profile.business_name);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  const platformForCoupon = svc.isFollowers ? folPlat : svc.platform || null;

  const subtotal = useMemo(() => {
    if (svc.isFollowers) return folQty * (FOLLOWER_PRICES[folPlat] ?? svc.amt);
    if (svc.isReviews) return revQty * svc.amt;
    if (svc.isViewers) return viewQty * svc.amt;
    return svc.amt;
  }, [svc, folQty, folPlat, revQty, viewQty]);

  const discount = appliedCoupon ? Math.floor((subtotal * appliedCoupon.percent_off) / 100) : 0;
  const total = Math.max(0, subtotal - discount);
  const isFree = total === 0;

  const totalDisplay = `₦${total.toLocaleString()}`;
  const subtotalDisplay = `₦${subtotal.toLocaleString()}`;

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setReceiptFile(f);
    const r = new FileReader();
    r.onload = () => setReceiptPreview(r.result as string);
    r.readAsDataURL(f);
  };

  const copyAcct = async () => {
    await navigator.clipboard.writeText(BANK.account);
    toast.success("Account number copied");
  };

  const applyCoupon = async () => {
    const code = couponInput.trim();
    if (!code) return;
    if (!user) {
      toast.info("Sign in to apply a coupon");
      navigate({ to: "/auth", search: { redirect: `/order/${svc.id}` } });
      return;
    }
    setApplyingCoupon(true);
    // Preview only — verify code matches an active coupon with remaining uses.
    // Actual atomic claim happens via redeem_coupon RPC at submit time.
    const { data, error } = await supabase
      .from("coupons")
      .select("id, code, percent_off, max_uses, used_count, service_id, platform")
      .ilike("code", code)
      .eq("active", true)
      .maybeSingle();
    setApplyingCoupon(false);
    if (error || !data) { toast.error("Invalid coupon code"); return; }
    if (data.service_id && data.service_id !== svc.id) { toast.error("Coupon not valid for this service"); return; }
    if (data.platform && data.platform !== platformForCoupon) {
      toast.error(`Coupon only valid for ${data.platform}${svc.isFollowers ? " followers" : ""}`);
      return;
    }
    if (data.used_count >= data.max_uses) { toast.error("Coupon fully claimed — too late!"); return; }
    setAppliedCoupon({ id: data.id, code: data.code, percent_off: data.percent_off });
    toast.success(`${data.percent_off}% off applied!`);
  };

  const submit = async () => {
    if (!name || !phone) {
      toast.error("Please fill all required fields");
      return;
    }
    if (!isFree && !receiptFile) {
      toast.error("Please upload your payment receipt");
      return;
    }
    if (!user) {
      const redirect = `/order/${svc.id}`;
      toast.info("Sign in to track your order");
      navigate({ to: "/auth", search: { redirect } });
      return;
    }

    setSubmitting(true);
    try {
      // Atomically claim coupon FIRST (prevents race past max_uses).
      if (appliedCoupon) {
        const { error: redeemErr } = await supabase.rpc("redeem_coupon", {
          _code: appliedCoupon.code,
          _service_id: svc.id,
          _platform: platformForCoupon,
        });
        if (redeemErr) throw new Error(redeemErr.message || "Coupon could not be claimed");
      }

      // Upload receipt if there's a payment to verify
      let path: string | null = null;
      if (receiptFile && !isFree) {
        const ext = receiptFile.name.split(".").pop() || "jpg";
        path = `${user.id}/${Date.now()}.${ext}`;
        const { error: upErr } = await supabase.storage.from("receipts").upload(path, receiptFile, {
          cacheControl: "3600",
          upsert: false,
        });
        if (upErr) throw upErr;
      }

      const quantity = svc.isFollowers ? folQty : svc.isReviews ? revQty : svc.isViewers ? viewQty : null;
      const platform = svc.isFollowers ? folPlat : (svc.isReviews || svc.isViewers) ? svc.platform || null : null;
      const { error: insErr } = await supabase.from("orders").insert({
        user_id: user.id,
        service_id: svc.id,
        service_name: svc.name,
        quantity,
        platform,
        amount: total,
        customer_name: name,
        customer_phone: phone,
        business_name: biz || null,
        receipt_url: path,
        status: "pending",
        coupon_code: appliedCoupon?.code || null,
        discount_amount: discount,
      });
      if (insErr) throw insErr;

      const qty = svc.isFollowers ? `${folQty} ${folPlat} followers`
        : svc.isReviews ? `${revQty} ${svc.platform} reviews`
        : svc.isViewers ? `${viewQty} ${svc.platform} viewers`
        : svc.name;
      const couponLine = appliedCoupon ? `\n*Coupon:* ${appliedCoupon.code} (${appliedCoupon.percent_off}% off)` : "";
      const msg = isFree
        ? `Hi HIPROFEET, I just claimed the ${appliedCoupon?.code} giveaway:\n\n*Service:* ${qty}\n*Amount:* FREE${couponLine}\n*Name:* ${name}\n*WhatsApp:* ${phone}\n\nPlease confirm and start.`
        : `Hi HIPROFEET, I just placed an order:\n\n*Service:* ${qty}\n*Amount:* ${totalDisplay}${couponLine}\n*Name:* ${name}\n*WhatsApp:* ${phone}\n*Business:* ${biz || "—"}\n\nI've uploaded my payment receipt on the website. Please confirm and start.`;
      const wa = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
      navigate({ to: "/success", search: { wa } });
    } catch (e: any) {
      toast.error(e.message || "Could not submit order. Please try again.");
      setSubmitting(false);
    }
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
                  {svc.benefits.map((b: string) => (
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
                  <div className="mb-3 text-[11px] font-bold uppercase tracking-[2px] text-brand">🎯 Pick your platform</div>
                  <div className="mb-4 grid grid-cols-3 gap-2.5">
                    {(
                      [
                        { id: "Instagram", logo: "📸", grad: "from-[#feda75] via-[#fa7e1e] to-[#d62976]" },
                        { id: "Facebook",  logo: "f",  grad: "from-[#1877f2] to-[#0a5dc1]" },
                        { id: "TikTok",    logo: "🎵", grad: "from-[#000000] via-[#25f4ee] to-[#fe2c55]" },
                      ] as const
                    ).map((p) => {
                      const active = folPlat === p.id;
                      return (
                        <button
                          key={p.id}
                          onClick={() => { setFolPlat(p.id); setAppliedCoupon(null); }}
                          aria-pressed={active}
                          className={`group relative flex flex-col items-center gap-1.5 rounded-2xl border-2 p-3 text-center transition ${active ? "border-brand bg-white shadow-md ring-2 ring-brand/25" : "border-brand/10 bg-white/70 hover:border-brand/40 hover:bg-white"}`}
                        >
                          <span className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${p.grad} text-lg font-black text-white shadow-sm`}>
                            {p.logo}
                          </span>
                          <span className={`text-[13px] font-bold leading-tight ${active ? "text-brand" : "text-t-dark"}`}>{p.id}</span>
                          <span className={`text-[11px] font-semibold ${active ? "text-brand" : "text-t-soft"}`}>₦{FOLLOWER_PRICES[p.id]}/follower</span>
                          {active && (
                            <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand text-[11px] font-black text-white shadow">✓</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  <div className="mb-2 text-[12px] text-t-mid">
                    <span className="font-bold text-t-dark">{folPlat}</span> selected · ₦{FOLLOWER_PRICES[folPlat]} per follower
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

              {svc.isViewers && (
                <div className="mt-5 rounded-2xl border border-brand/15 bg-off p-4">
                  <div className="mb-2 text-[11px] font-bold uppercase tracking-[2px] text-brand">▶️ Choose Number of Viewers</div>
                  <div className="mb-3 text-[13px] text-t-mid">₦{svc.amt} per viewer · minimum 100</div>
                  <QtyPicker value={viewQty} setValue={setViewQty} step={100} min={100} />
                </div>
              )}

              {/* Coupon code */}
              <div className="mt-5 rounded-2xl border border-amber/30 bg-amber/5 p-4">
                <div className="mb-2 text-[11px] font-bold uppercase tracking-[2px] text-amber">🎁 Have a coupon code?</div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between rounded-xl bg-emerald-50 px-3 py-2.5">
                    <div className="text-sm">
                      <span className="font-bold text-emerald-700">{appliedCoupon.code}</span>
                      <span className="ml-2 text-emerald-600">−{appliedCoupon.percent_off}%</span>
                    </div>
                    <button onClick={() => setAppliedCoupon(null)} className="text-xs text-t-soft underline">Remove</button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      placeholder="Enter code"
                      className="flex-1 rounded-xl border border-brand/15 bg-white px-3 py-2.5 text-sm uppercase tracking-wider text-t-dark outline-none focus:border-brand"
                    />
                    <button
                      onClick={applyCoupon}
                      disabled={applyingCoupon || !couponInput.trim()}
                      className="rounded-xl bg-brand px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50"
                    >
                      {applyingCoupon ? "..." : "Apply"}
                    </button>
                  </div>
                )}
              </div>

              {!isFree && (
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
                  {appliedCoupon && (
                    <div className="flex items-center justify-between border-b border-brand/10 py-2 text-[13px]">
                      <span className="text-t-mid">Subtotal</span>
                      <span className="text-t-soft line-through">{subtotalDisplay}</span>
                    </div>
                  )}
                  <div className="mt-3 flex items-center justify-between rounded-xl bg-ink p-3.5">
                    <span className="text-xs text-white/45">Total to pay</span>
                    <span className="font-display text-xl font-bold text-amber">{totalDisplay}</span>
                  </div>
                </div>
              )}

              {isFree && (
                <div className="mt-5 rounded-2xl border-2 border-emerald-300 bg-emerald-50 p-4 text-center">
                  <div className="text-[11px] font-bold uppercase tracking-[2px] text-emerald-700">🎉 You won the giveaway!</div>
                  <div className="mt-1 font-display text-2xl font-bold text-emerald-800">100% FREE</div>
                  <div className="mt-1 text-[12px] text-emerald-700">No payment needed. Submit the form to claim.</div>
                </div>
              )}

              <Field label="Full Name *" value={name} onChange={setName} placeholder="Your full name" autoComplete="name" />
              <Field label="WhatsApp Number *" value={phone} onChange={setPhone} placeholder="e.g. 08012345678" autoComplete="tel" type="tel" />
              <Field label="Business Name" value={biz} onChange={setBiz} placeholder="Your business name" />

              {!isFree && (
                <div className="mt-4">
                  <label className="mb-1.5 block text-[13px] font-semibold text-t-dark">Payment Screenshot *</label>
                  {!receiptPreview ? (
                    <label className="relative flex cursor-pointer flex-col items-center rounded-2xl border-2 border-dashed border-brand/20 bg-off p-7 text-center transition hover:border-brand hover:bg-brand/[0.03]">
                      <input type="file" accept="image/*" onChange={onFile} className="absolute inset-0 cursor-pointer opacity-0" />
                      <div className="text-2xl">📎</div>
                      <div className="mt-2 text-sm font-semibold text-t-dark">Tap to upload receipt</div>
                      <div className="text-xs text-t-soft">Screenshot of your bank transfer</div>
                    </label>
                  ) : (
                    <div className="text-center">
                      <img src={receiptPreview} alt="" className="mx-auto max-h-36 rounded-xl border border-brand/15 object-contain" />
                      <div className="mt-2 text-xs font-bold text-success">✓ Uploaded</div>
                      <button onClick={() => { setReceiptPreview(null); setReceiptFile(null); }} className="mt-1 text-xs text-t-soft underline">Replace</button>
                    </div>
                  )}
                </div>
              )}

              <button
                disabled={submitting}
                onClick={submit}
                className="mt-5 w-full rounded-2xl bg-amber py-4 text-base font-bold text-white transition active:scale-[0.98] disabled:bg-gray-300"
              >
                {submitting ? "Submitting…" : isFree ? "Claim Free Followers →" : "Submit Order & Get Started →"}
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
