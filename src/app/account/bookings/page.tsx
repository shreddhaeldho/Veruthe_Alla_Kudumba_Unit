"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { CalendarIcon, PinIcon } from "@/components/ui/minimal-graphics";

export default function MyBookingsPage() {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past" | "cancelled">("upcoming");
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    async function loadBookings() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("bookings")
        .select(`
          id,
          booking_reference,
          status,
          total_amount,
          created_at,
          events (
            title,
            slug,
            date,
            start_time,
            end_time,
            location,
            featured_image
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (data) setBookings(data);
      setLoading(false);
    }

    loadBookings();
  }, [supabase]);

  const filtered = bookings.filter((b) => {
    if (activeTab === "upcoming") return b.status === "CONFIRMED" || b.status === "PENDING";
    if (activeTab === "past") return b.status === "COMPLETED";
    if (activeTab === "cancelled") return b.status === "CANCELLED";
    return true;
  });

  return (
    <div className="max-w-[960px] mx-auto px-4 py-12">
      <div className="mb-8">
        <Link
          href="/account"
          className="text-xs font-display font-bold text-navy-40 hover:text-navy uppercase tracking-wider block mb-2"
        >
          ← Back to Dashboard
        </Link>
        <h1 className="font-display text-3xl sm:text-4xl font-black text-navy tracking-tight">
          My Bookings
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-navy/10 mb-8 pb-3">
        {(["upcoming", "past", "cancelled"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-full font-display text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === tab
                ? "bg-navy text-cream shadow-sm"
                : "text-navy-60 hover:text-navy hover:bg-navy/5"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-center font-display text-navy-40 font-bold py-12 animate-pulse">
          Loading bookings...
        </p>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-navy/5 shadow-sm">
          <p className="font-display text-xl font-bold text-navy mb-2">
            No {activeTab} bookings found.
          </p>
          <p className="text-xs text-navy-60 mb-6 font-body">
            {activeTab === "upcoming"
              ? "You don't have any upcoming plans right now."
              : `No ${activeTab} events to show.`}
          </p>
          {activeTab === "upcoming" && (
            <Link
              href="/events"
              className="inline-block px-6 py-3 rounded-full bg-navy text-cream font-display text-xs font-bold uppercase tracking-wider hover:bg-blue transition-all"
            >
              Browse Events →
            </Link>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-navy/5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6"
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-display font-bold uppercase tracking-widest text-pink bg-pink/10 px-2.5 py-1 rounded-full">
                    {booking.status}
                  </span>
                  <span className="text-xs font-mono font-bold text-navy-40">
                    {booking.booking_reference}
                  </span>
                </div>
                <h3 className="font-display text-2xl font-bold text-navy">
                  {booking.events?.title}
                </h3>
                <div className="flex flex-wrap items-center gap-4 text-xs text-navy-60 font-body">
                  <span className="flex items-center gap-1.5">
                    <CalendarIcon size={14} /> {booking.events?.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <PinIcon size={14} /> {booking.events?.location}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href={`/account/bookings/${booking.id}`}
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-navy text-cream font-display text-xs font-bold uppercase tracking-wider text-center hover:bg-blue transition-all"
                >
                  View Ticket →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
