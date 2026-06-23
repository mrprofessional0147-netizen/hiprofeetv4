import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Nav } from "@/components/layout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/orders")({
  head: () => ({
    meta: [
      { title: "My Orders — HIPROFEET" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OrdersPage,
});

type Order = {
  id: string;
  service_id: string;
  service_name: string;
  quantity: number | null;
  platform: string | null;
  amount: number;
  status: string;
  admin_notes: string | null;
  created_at: string;
  receipt_url: string | null;
};

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber/15 text-amber border-amber/30",
  confirmed: "bg-sky/15 text-sky border-sky/30",
  in_progress: "bg-brand/15 text-brand border-brand/30",
  completed: "bg-emerald-400/15 text-emerald-400 border-emerald-400/30",
  cancelled: "bg-white/10 text-white/50 border-white/15",
};

const STATUS_LABEL: Record<string, string> = {
  pending: "Pending review",
  confirmed: "Confirmed",
  in_progress: "In progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      window.location.href = "/auth?redirect=/orders";
      return;
    }
    (async () => {
      const { data } = await supabase
        .from("orders")
        .select("id,service_id,service_name,quantity,platform,amount,status,admin_notes,created_at,receipt_url")
        .order("created_at", { ascending: false });
      setOrders((data as Order[]) ?? []);
      setLoading(false);
    })();
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <>
        <Nav />
        <div className="flex min-h-screen items-center justify-center bg-ink pt-16 text-white/60">Loading orders…</div>
      </>
    );
  }

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-ink pt-20 pb-16 text-white">
        <div className="container-page">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-amber">Account</div>
              <h1 className="mt-1 font-display text-3xl font-bold sm:text-4xl">Engagements</h1>
              <p className="mt-1 text-sm text-white/50">A record of every service you've commissioned through HIPROFEET.</p>
            </div>
            <Link to="/" className="rounded-xl border border-white/15 px-4 py-2 text-sm text-white/80 hover:border-sky/40">Browse services</Link>
          </div>

          {orders.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 bg-ink-2 p-10 text-center">
              <div className="text-4xl">📋</div>
              <div className="mt-3 font-display text-xl font-bold">No engagements yet</div>
              <p className="mt-1 text-sm text-white/50">Commissioned services will appear here for tracking.</p>
              <Link to="/" className="mt-5 inline-block rounded-xl bg-amber px-5 py-2.5 text-sm font-bold text-white">Explore services</Link>
            </div>
          ) : (
            <div className="grid gap-3">
              {orders.map((o) => {
                const detail = o.platform && o.quantity
                  ? `${o.quantity.toLocaleString()} ${o.platform}`
                  : o.quantity ? `${o.quantity.toLocaleString()} units` : null;
                return (
                  <div key={o.id} className="rounded-2xl border border-white/10 bg-ink-2 p-4 sm:p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-display text-lg font-bold">{o.service_name}</div>
                        {detail && <div className="mt-0.5 text-xs text-white/50">{detail}</div>}
                        <div className="mt-1 text-xs text-white/40">{new Date(o.created_at).toLocaleString()}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-display text-lg font-bold text-amber">₦{o.amount.toLocaleString()}</div>
                        <span className={`mt-1 inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLES[o.status] ?? STATUS_STYLES.pending}`}>
                          {STATUS_LABEL[o.status] ?? o.status}
                        </span>
                      </div>
                    </div>
                    {o.admin_notes && (
                      <div className="mt-3 rounded-xl border border-sky/20 bg-sky/5 p-3 text-sm text-white/80">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-sky">Update from team</div>
                        <div className="mt-1">{o.admin_notes}</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
