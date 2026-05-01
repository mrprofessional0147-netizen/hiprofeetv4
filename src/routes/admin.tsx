import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Nav } from "@/components/layout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

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

function AdminPage() {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [recentChats, setRecentChats] = useState<RecentConversation[]>([]);
  const [error, setError] = useState<string | null>(null);

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

    (async () => {
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const [
        { count: totalUsers },
        { count: totalConversations },
        { count: totalMessages },
        { count: newUsers7d },
        { count: conversations7d },
        { data: users },
        { data: chats },
      ] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("conversations").select("*", { count: "exact", head: true }),
        supabase.from("messages").select("*", { count: "exact", head: true }),
        supabase.from("profiles").select("*", { count: "exact", head: true }).gte("created_at", sevenDaysAgo),
        supabase.from("conversations").select("*", { count: "exact", head: true }).gte("created_at", sevenDaysAgo),
        supabase.from("profiles").select("id,full_name,avatar_url,business_name,country,created_at").order("created_at", { ascending: false }).limit(8),
        supabase.from("conversations").select("id,user_id,title,last_message_at").order("last_message_at", { ascending: false }).limit(8),
      ]);

      setStats({
        totalUsers: totalUsers ?? 0,
        totalConversations: totalConversations ?? 0,
        totalMessages: totalMessages ?? 0,
        newUsers7d: newUsers7d ?? 0,
        conversations7d: conversations7d ?? 0,
      });
      setRecentUsers((users as RecentUser[]) ?? []);
      setRecentChats((chats as RecentConversation[]) ?? []);
      setLoading(false);
    })();
  }, [user, authLoading, isAdmin]);

  if (authLoading || loading) {
    return (
      <>
        <Nav />
        <div className="flex min-h-screen items-center justify-center bg-ink pt-16 text-white/60">
          Loading dashboard…
        </div>
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
    { label: "Total users", value: stats?.totalUsers ?? 0, hint: `+${stats?.newUsers7d ?? 0} this week`, accent: "from-sky/30 to-sky/0" },
    { label: "Conversations", value: stats?.totalConversations ?? 0, hint: `+${stats?.conversations7d ?? 0} this week`, accent: "from-brand/30 to-brand/0" },
    { label: "Messages", value: stats?.totalMessages ?? 0, hint: "all time", accent: "from-amber/30 to-amber/0" },
    { label: "Active 7d", value: stats?.conversations7d ?? 0, hint: "new chats", accent: "from-emerald-400/30 to-emerald-400/0" },
  ];

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-ink pt-20 text-white">
        <div className="container-page">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-amber">Admin</div>
              <h1 className="mt-1 font-display text-3xl font-bold sm:text-4xl">Business dashboard</h1>
              <p className="mt-1 text-sm text-white/50">Live snapshot of HIPROFEET activity.</p>
            </div>
          </div>

          {/* KPI cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((c, i) => (
              <motion.div
                key={c.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`relative overflow-hidden rounded-2xl border border-white/10 bg-ink-2 p-5`}
              >
                <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${c.accent}`} />
                <div className="relative">
                  <div className="text-[11px] font-semibold uppercase tracking-widest text-white/50">{c.label}</div>
                  <div className="mt-2 font-display text-3xl font-bold tabular-nums">{c.value.toLocaleString()}</div>
                  <div className="mt-1 text-xs text-white/40">{c.hint}</div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {/* Recent signups */}
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
                      <div className="truncate text-xs text-white/40">
                        {u.business_name || u.country || "—"}
                      </div>
                    </div>
                    <div className="text-xs text-white/40">{new Date(u.created_at).toLocaleDateString()}</div>
                  </li>
                ))}
              </ul>
            </section>

            {/* Recent chats */}
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

          <div className="mt-10 rounded-2xl border border-dashed border-white/10 bg-ink-2/50 p-6 text-sm text-white/50">
            <div className="font-semibold text-white/80">Coming next in the dashboard</div>
            <ul className="mt-2 grid gap-1 sm:grid-cols-2">
              <li>• Orders & revenue tracking</li>
              <li>• Marketing funnel & traffic sources</li>
              <li>• Conversion rates by service</li>
              <li>• Customer cohorts & retention</li>
              <li>• Advisor message search & moderation</li>
              <li>• Role management for the team</li>
            </ul>
          </div>
          <div className="h-16" />
        </div>
      </div>
    </>
  );
}
