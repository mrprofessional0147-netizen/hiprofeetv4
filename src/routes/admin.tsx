import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Nav } from "@/components/layout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — HIPROFEET" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

type Stats = {
  totalUsers: number;
  totalConversations: number;
  totalMessages: number;
  newUsers7d: number;
  conversations7d: number;
  totalOrders: number;
  pendingOrders: number;
  revenue: number;
};

type RecentUser = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  business_name: string | null;
  country: string | null;
  created_at: string;
};

type RecentConversation = {
  id: string;
  user_id: string;
  title: string;
  last_message_at: string;
};

type Order = {
  id: string;
  user_id: string;
  service_name: string;
  quantity: number | null;
  platform: string | null;
  amount: number;
  customer_name: string;
  customer_phone: string;
  business_name: string | null;
  receipt_url: string | null;
  status: string;
  admin_notes: string | null;
  created_at: string;
};

const STATUS_OPTIONS = ["pending", "confirmed", "in_progress", "completed", "cancelled"];
const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber/15 text-amber border-amber/30",
  confirmed: "bg-sky/15 text-sky border-sky/30",
  in_progress: "bg-brand/15 text-brand border-brand/30",
  completed: "bg-emerald-400/15 text-emerald-400 border-emerald-400/30",
  cancelled: "bg-white/10 text-white/50 border-white/15",
};

function AdminPage() {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"overview" | "orders">("overview");
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [recentChats, setRecentChats] = useState<RecentConversation[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [error, setError] = useState<string | null>(null);

  const loadAll = async () => {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const [
      { count: totalUsers },
      { count: totalConversations },
      { count: totalMessages },
      { count: newUsers7d },
      { count: conversations7d },
      { count: totalOrders },
      { count: pendingOrders },
      { data: revenueRows },
      { data: users },
      { data: chats },
      { data: orderRows },
    ] = await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("conversations").select("*", { count: "exact", head: true }),
      supabase.from("messages").select("*", { count: "exact", head: true }),
      supabase.from("profiles").select("*", { count: "exact", head: true }).gte("created_at", sevenDaysAgo),
      supabase.from("conversations").select("*", { count: "exact", head: true }).gte("created_at", sevenDaysAgo),
      supabase.from("orders").select("*", { count: "exact", head: true }),
      supabase.from("orders").select("*", { count: "exact", head: true }).eq("status", "pending"),
      supabase.from("orders").select("amount").in("status", ["confirmed", "in_progress", "completed"]),
      supabase.from("profiles").select("id,full_name,avatar_url,business_name,country,created_at").order("created_at", { ascending: false }).limit(8),
      supabase.from("conversations").select("id,user_id,title,last_message_at").order("last_message_at", { ascending: false }).limit(8),
      supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(100),
    ]);

    const revenue = (revenueRows as { amount: number }[] | null)?.reduce((s, r) => s + r.amount, 0) ?? 0;

    setStats({
      totalUsers: totalUsers ?? 0,
      totalConversations: totalConversations ?? 0,
      totalMessages: totalMessages ?? 0,
      newUsers7d: newUsers7d ?? 0,
      conversations7d: conversations7d ?? 0,
      totalOrders: totalOrders ?? 0,
      pendingOrders: pendingOrders ?? 0,
      revenue,
    });
    setRecentUsers((users as RecentUser[]) ?? []);
    setRecentChats((chats as RecentConversation[]) ?? []);
    setOrders((orderRows as Order[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      window.location.href = "/auth?redirect=/admin";
      return;
    }
    if (!isAdmin) {
      setError("You don't have access to this dashboard.");
      setLoading(false);
      return;
    }
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading, isAdmin]);

  const filteredOrders = useMemo(
    () => (statusFilter === "all" ? orders : orders.filter((o) => o.status === statusFilter)),
    [orders, statusFilter],
  );

  const updateOrder = async (id: string, patch: Partial<Order>) => {
    const { error: e } = await supabase.from("orders").update(patch).eq("id", id);
    if (e) {
      toast.error(e.message);
      return;
    }
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, ...patch } : o)));
    toast.success("Order updated");
  };

  const viewReceipt = async (path: string) => {
    const { data, error: e } = await supabase.storage.from("receipts").createSignedUrl(path, 60 * 5);
    if (e || !data) {
      toast.error("Could not load receipt");
      return;
    }
    window.open(data.signedUrl, "_blank", "noopener");
  };

  if (authLoading || loading) {
    return (
      <>
        <Nav />
        <div className="flex min-h-screen items-center justify-center bg-ink pt-16 text-white/60">Loading dashboard…</div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Nav />
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-ink pt-16 text-white">
          <div className="text-2xl font-bold">Access denied</div>
          <div className="text-white/60">{error}</div>
          <Link to="/" className="rounded-xl bg-brand px-5 py-2.5 text-sm font-bold text-white">Back home</Link>
        </div>
      </>
    );
  }

  const cards = [
    { label: "Revenue", value: `₦${(stats?.revenue ?? 0).toLocaleString()}`, hint: "confirmed & later", accent: "from-emerald-400/30 to-emerald-400/0" },
    { label: "Orders", value: (stats?.totalOrders ?? 0).toLocaleString(), hint: `${stats?.pendingOrders ?? 0} pending`, accent: "from-amber/30 to-amber/0" },
    { label: "Total users", value: (stats?.totalUsers ?? 0).toLocaleString(), hint: `+${stats?.newUsers7d ?? 0} this week`, accent: "from-sky/30 to-sky/0" },
    { label: "Conversations", value: (stats?.totalConversations ?? 0).toLocaleString(), hint: `+${stats?.conversations7d ?? 0} this week`, accent: "from-brand/30 to-brand/0" },
  ];

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-ink pt-20 text-white">
        <div className="container-page">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-amber">Admin</div>
              <h1 className="mt-1 font-display text-3xl font-bold sm:text-4xl">Business dashboard</h1>
              <p className="mt-1 text-sm text-white/50">Live snapshot of HIPROFEET activity.</p>
            </div>
            <button onClick={() => { setLoading(true); loadAll(); }} className="rounded-xl border border-white/15 px-4 py-2 text-sm hover:border-sky/40">↻ Refresh</button>
          </div>

          {/* Tabs */}
          <div className="mb-6 inline-flex rounded-xl border border-white/10 bg-ink-2 p-1">
            {(["overview", "orders"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`rounded-lg px-4 py-1.5 text-sm font-semibold capitalize transition ${tab === t ? "bg-brand text-white" : "text-white/60 hover:text-white"}`}
              >
                {t}
                {t === "orders" && stats?.pendingOrders ? <span className="ml-2 rounded-full bg-amber px-1.5 text-[10px] text-ink">{stats.pendingOrders}</span> : null}
              </button>
            ))}
          </div>

          {tab === "overview" && (
            <>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {cards.map((c, i) => (
                  <motion.div
                    key={c.label}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="relative overflow-hidden rounded-2xl border border-white/10 bg-ink-2 p-5"
                  >
                    <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${c.accent}`} />
                    <div className="relative">
                      <div className="text-[11px] font-semibold uppercase tracking-widest text-white/50">{c.label}</div>
                      <div className="mt-2 font-display text-3xl font-bold tabular-nums">{c.value}</div>
                      <div className="mt-1 text-xs text-white/40">{c.hint}</div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-10 grid gap-6 lg:grid-cols-2">
                <section className="rounded-2xl border border-white/10 bg-ink-2 p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="font-display text-lg font-bold">Recent signups</h2>
                    <span className="text-xs text-white/40">last 8</span>
                  </div>
                  <ul className="divide-y divide-white/5">
                    {recentUsers.length === 0 && <li className="py-4 text-sm text-white/40">No users yet.</li>}
                    {recentUsers.map((u) => (
                      <li key={u.id} className="flex items-center gap-3 py-3">
                        <div className="flex h-9 w-9 flex-none items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-sky/30 to-brand/30 text-sm font-bold">
                          {u.avatar_url ? <img src={u.avatar_url} alt="" className="h-full w-full object-cover" /> : (u.full_name || "U").charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-semibold">{u.full_name || "Anonymous"}</div>
                          <div className="truncate text-xs text-white/40">{u.business_name || u.country || "—"}</div>
                        </div>
                        <div className="text-xs text-white/40">{new Date(u.created_at).toLocaleDateString()}</div>
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="rounded-2xl border border-white/10 bg-ink-2 p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="font-display text-lg font-bold">Latest advisor chats</h2>
                    <span className="text-xs text-white/40">last 8</span>
                  </div>
                  <ul className="divide-y divide-white/5">
                    {recentChats.length === 0 && <li className="py-4 text-sm text-white/40">No conversations yet.</li>}
                    {recentChats.map((c) => (
                      <li key={c.id} className="flex items-center gap-3 py-3">
                        <div className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-brand/20 text-base">💬</div>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-semibold">{c.title}</div>
                          <div className="truncate text-xs text-white/40">{new Date(c.last_message_at).toLocaleString()}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            </>
          )}

          {tab === "orders" && (
            <section className="rounded-2xl border border-white/10 bg-ink-2 p-4 sm:p-5">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <h2 className="mr-auto font-display text-lg font-bold">Orders ({filteredOrders.length})</h2>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-lg border border-white/15 bg-ink px-3 py-1.5 text-sm"
                >
                  <option value="all">All statuses</option>
                  {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {filteredOrders.length === 0 ? (
                <div className="py-10 text-center text-sm text-white/40">No orders match this filter.</div>
              ) : (
                <div className="space-y-3">
                  {filteredOrders.map((o) => {
                    const detail = o.platform && o.quantity ? `${o.quantity.toLocaleString()} ${o.platform}` : o.quantity ? `${o.quantity.toLocaleString()} units` : null;
                    return (
                      <div key={o.id} className="rounded-xl border border-white/10 bg-ink p-4">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="font-display text-base font-bold">{o.service_name}</div>
                            {detail && <div className="text-xs text-white/50">{detail}</div>}
                            <div className="mt-1 text-xs text-white/40">
                              {o.customer_name} · {o.customer_phone}
                              {o.business_name ? ` · ${o.business_name}` : ""}
                            </div>
                            <div className="text-[11px] text-white/30">{new Date(o.created_at).toLocaleString()}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-display text-base font-bold text-amber">₦{o.amount.toLocaleString()}</div>
                            <span className={`mt-1 inline-block rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLES[o.status] ?? STATUS_STYLES.pending}`}>
                              {o.status}
                            </span>
                          </div>
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <select
                            value={o.status}
                            onChange={(e) => updateOrder(o.id, { status: e.target.value })}
                            className="rounded-lg border border-white/15 bg-ink-2 px-2.5 py-1 text-xs"
                          >
                            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                          </select>
                          {o.receipt_url && (
                            <button onClick={() => viewReceipt(o.receipt_url!)} className="rounded-lg border border-sky/30 bg-sky/10 px-3 py-1 text-xs text-sky hover:bg-sky/20">
                              View receipt
                            </button>
                          )}
                          <a
                            href={`https://wa.me/${o.customer_phone.replace(/\D/g, "").replace(/^0/, "234")}`}
                            target="_blank" rel="noopener"
                            className="rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-400 hover:bg-emerald-400/20"
                          >
                            WhatsApp
                          </a>
                        </div>

                        <details className="mt-3">
                          <summary className="cursor-pointer text-xs text-white/50 hover:text-white">Add / edit note</summary>
                          <NoteEditor order={o} onSave={(notes) => updateOrder(o.id, { admin_notes: notes })} />
                        </details>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          )}

          <div className="h-16" />
        </div>
      </div>
    </>
  );
}

function NoteEditor({ order, onSave }: { order: Order; onSave: (notes: string) => void }) {
  const [val, setVal] = useState(order.admin_notes ?? "");
  return (
    <div className="mt-2 flex flex-col gap-2">
      <textarea
        value={val}
        onChange={(e) => setVal(e.target.value)}
        rows={2}
        placeholder="Visible to the customer on their orders page…"
        className="w-full rounded-lg border border-white/15 bg-ink-2 p-2 text-sm"
      />
      <button onClick={() => onSave(val)} className="self-start rounded-lg bg-brand px-3 py-1 text-xs font-bold">Save note</button>
    </div>
  );
}
