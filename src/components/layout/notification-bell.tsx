"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { BellIcon, SparklesIcon } from "@/components/ui/minimal-graphics";

export default function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    async function initUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        fetchNotifications(user.id);
      }
    }

    initUser();

    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [supabase]);

  const fetchNotifications = async (uId: string) => {
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", uId)
      .order("created_at", { ascending: false })
      .limit(5);

    if (data) {
      setNotifications(data);
      const unread = data.filter((n) => !n.is_read).length;
      setUnreadCount(unread);
    }
  };

  const markAllRead = async () => {
    if (!userId) return;
    await supabase.from("notifications").update({ is_read: true }).eq("user_id", userId);
    setUnreadCount(0);
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  if (!userId) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="p-2.5 rounded-full border border-navy/15 text-navy hover:bg-navy hover:text-white transition-all relative flex items-center justify-center"
        aria-label="View notifications"
      >
        <BellIcon size={18} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-pink text-white text-[10px] font-black flex items-center justify-center border-2 border-cream shadow-sm">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-3xl p-5 border border-navy/10 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-navy/10 mb-3">
            <span className="font-display font-bold text-navy text-sm flex items-center gap-2">
              <BellIcon size={16} className="text-pink" /> Notifications
            </span>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-[11px] font-display font-bold text-pink hover:underline uppercase tracking-wider"
              >
                Mark all read
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="py-8 text-center text-xs text-navy-40 font-body">
              All caught up! No new notifications.
            </div>
          ) : (
            <div className="flex flex-col gap-2.5 max-h-72 overflow-y-auto">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-3 rounded-2xl border text-xs transition-all ${
                    n.is_read
                      ? "bg-cream/40 border-navy/5 text-navy-80"
                      : "bg-pink/5 border-pink/20 font-medium text-navy"
                  }`}
                >
                  <p className="font-bold font-display">{n.title}</p>
                  <p className="text-[11px] text-navy-60 font-body mt-0.5">{n.message}</p>
                  {n.action_url && (
                    <Link
                      href={n.action_url}
                      onClick={() => setOpen(false)}
                      className="inline-block text-[10px] font-bold text-pink uppercase tracking-wider mt-2 hover:underline"
                    >
                      View Details →
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="pt-3 border-t border-navy/10 mt-3 text-center">
            <Link
              href="/account/notifications"
              onClick={() => setOpen(false)}
              className="text-xs font-display font-bold text-navy hover:text-pink transition-colors uppercase tracking-wider block"
            >
              See All Notifications →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
