"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { BellIcon, ArrowLeftIcon, SparklesIcon } from "@/components/ui/minimal-graphics";

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login?redirectTo=/account/notifications");
        return;
      }

      setUserId(user.id);

      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (data) {
        setNotifications(data);
      }
      setLoading(false);
    }

    loadData();
  }, [router, supabase]);

  const markAllRead = async () => {
    if (!userId) return;
    await supabase.from("notifications").update({ is_read: true }).eq("user_id", userId);
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-cream">
        <p className="font-display font-bold text-navy-40 animate-pulse">Loading notifications...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream text-navy py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/account"
          className="inline-flex items-center gap-2 text-xs font-display font-bold uppercase tracking-wider text-navy-60 hover:text-navy mb-8 transition-colors"
        >
          <ArrowLeftIcon size={14} /> Back to Account
        </Link>

        <div className="bg-white rounded-3xl p-8 border border-navy/10 shadow-xl">
          <div className="flex items-center justify-between pb-6 border-b border-navy/10 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-pink/15 text-pink flex items-center justify-center">
                <BellIcon size={20} />
              </div>
              <div>
                <h1 className="font-display text-2xl font-black text-navy">Notifications</h1>
                <p className="text-xs text-navy-60 font-body">Updates on your circle, events, and membership</p>
              </div>
            </div>

            {notifications.some((n) => !n.is_read) && (
              <button
                onClick={markAllRead}
                className="px-4 py-2 rounded-full bg-pink/10 text-pink hover:bg-pink hover:text-white font-display text-xs font-bold uppercase tracking-wider transition-all"
              >
                Mark All Read
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="py-16 text-center text-navy-40 font-body">
              <p className="font-display text-lg font-bold mb-1">No notifications yet.</p>
              <p className="text-xs">We&apos;ll notify you when new events drop or when your status updates!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-5 rounded-2xl border transition-all flex flex-col gap-1 ${
                    n.is_read
                      ? "bg-cream/40 border-navy/5 text-navy-80"
                      : "bg-pink/5 border-pink/20 font-medium text-navy shadow-sm"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-display font-bold uppercase tracking-widest text-pink">
                      {n.type?.replace("_", " ")}
                    </span>
                    <span className="text-[10px] text-navy-40">
                      {new Date(n.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="font-display font-bold text-navy text-base mt-1">{n.title}</h4>
                  <p className="text-xs text-navy-60 font-body leading-relaxed">{n.message}</p>
                  {n.action_url && (
                    <Link
                      href={n.action_url}
                      className="inline-block text-xs font-display font-bold text-pink hover:underline uppercase tracking-wider mt-2"
                    >
                      View Details →
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
