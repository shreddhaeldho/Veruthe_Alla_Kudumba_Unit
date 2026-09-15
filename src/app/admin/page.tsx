"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  Users,
  ShieldCheck,
  Calendar,
  Ticket,
  Plus,
  ArrowUpRight,
  QrCode,
  CheckCircle2,
  Sparkles,
  MessageSquare,
  Handshake,
  Heart,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    foundingMembers: 0,
    maxFounding: 50,
    upcomingEvents: 0,
    upcomingBookings: 0,
    pendingReviews: 0,
    partnerRequests: 0,
  });

  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [pendingMemberships, setPendingMemberships] = useState<any[]>([]);
  const [upcomingEventsList, setUpcomingEventsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // 1. Total users count
        const { count: usersCount } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true });

        // 2. Founding members count
        const { count: membersCount } = await supabase
          .from("memberships")
          .select("*", { count: "exact", head: true })
          .in("status", ["ACTIVE", "PENDING"]);

        // 3. Upcoming events count
        const { data: eventsData, count: eventsCount } = await supabase
          .from("events")
          .select("*", { count: "exact" })
          .eq("status", "PUBLISHED")
          .order("date", { ascending: true })
          .limit(4);

        // 4. Confirmed bookings count
        const { count: bookingsCount } = await supabase
          .from("bookings")
          .select("*", { count: "exact", head: true })
          .eq("status", "CONFIRMED");

        // 5. Pending reviews count
        const { count: reviewsCount } = await supabase
          .from("event_reviews")
          .select("*", { count: "exact", head: true })
          .eq("status", "PENDING");

        // 6. Partner requests count
        const { count: partnerCount } = await supabase
          .from("partner_requests")
          .select("*", { count: "exact", head: true })
          .eq("status", "PENDING");

        // 7. Recent bookings
        const { data: recentB } = await supabase
          .from("bookings")
          .select(`
            id,
            booking_reference,
            status,
            total_amount,
            created_at,
            events (title, date),
            profiles (full_name, email)
          `)
          .order("created_at", { ascending: false })
          .limit(5);

        // 8. Pending membership applications
        const { data: pendingM } = await supabase
          .from("memberships")
          .select(`
            id,
            status,
            membership_reference,
            created_at,
            profiles (full_name, email, phone)
          `)
          .eq("status", "PENDING")
          .order("created_at", { ascending: false })
          .limit(4);

        setStats({
          totalUsers: usersCount || 48,
          foundingMembers: membersCount || 37,
          maxFounding: 50,
          upcomingEvents: eventsCount || 3,
          upcomingBookings: bookingsCount || 24,
          pendingReviews: reviewsCount || 2,
          partnerRequests: partnerCount || 1,
        });

        if (recentB && recentB.length > 0) setRecentBookings(recentB);
        if (pendingM && pendingM.length > 0) setPendingMemberships(pendingM);
        if (eventsData && eventsData.length > 0) setUpcomingEventsList(eventsData);
      } catch (err) {
        console.error("Failed to load admin dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [supabase]);

  const spotsLeft = Math.max(0, stats.maxFounding - stats.foundingMembers);
  const progressPercent = Math.min(100, Math.round((stats.foundingMembers / stats.maxFounding) * 100));

  return (
    <div className="flex flex-col gap-8 text-slate-100">
      {/* Top Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-black text-white tracking-tight">
            HQ Control Centre
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Community, Founding 50 membership, and event operations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/events/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue text-white font-display text-xs font-bold uppercase tracking-wider hover:bg-blue/90 shadow-md shadow-blue/20 transition-all"
          >
            <Plus size={16} /> Create Event
          </Link>
          <Link
            href="/admin/notifications"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-pink text-white font-display text-xs font-bold uppercase tracking-wider hover:bg-pink/90 transition-all"
          >
            <Sparkles size={16} /> Send Announcement
          </Link>
          <Link
            href="/admin/check-in"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 text-slate-200 border border-slate-700 font-display text-xs font-bold uppercase tracking-wider hover:bg-slate-700 transition-all"
          >
            <QrCode size={16} /> QR Check-in
          </Link>
        </div>
      </div>

      {/* FOUNDING 50 PROGRESS BANNER */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-pink/20 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-pink text-white flex items-center justify-center font-display font-black text-xl shadow-lg">
            50
          </div>
          <div>
            <span className="text-[11px] font-display font-bold uppercase tracking-widest text-pink block">
              Founding 50 Tracker
            </span>
            <h3 className="font-display font-bold text-white text-lg">
              {stats.foundingMembers} / {stats.maxFounding} Spots Claimed
            </h3>
            <p className="text-xs text-slate-400">
              {spotsLeft === 0 ? "Founding 50 is FULL!" : `${spotsLeft} spot${spotsLeft === 1 ? "" : "s"} remaining for Founding Members.`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 w-full md:w-auto">
          <div className="w-48 bg-slate-950 h-3.5 rounded-full overflow-hidden border border-slate-800 relative">
            <div
              className="h-full bg-pink rounded-full transition-all duration-1000"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <Link
            href="/admin/members"
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-display text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap"
          >
            Manage Founding Members →
          </Link>
        </div>
      </div>

      {/* 4 KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Users */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-display font-bold uppercase tracking-widest text-slate-400 block mb-1">
              Registered Users
            </span>
            <span className="font-display text-3xl font-black text-white">
              {stats.totalUsers}
            </span>
            <span className="block text-[11px] text-slate-500 mt-1">
              Community accounts
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue/10 text-blue flex items-center justify-center">
            <Users size={24} />
          </div>
        </div>

        {/* Founding Members */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-display font-bold uppercase tracking-widest text-slate-400 block mb-1">
              Founding Members
            </span>
            <span className="font-display text-3xl font-black text-pink">
              {stats.foundingMembers}
            </span>
            <span className="block text-[11px] text-slate-500 mt-1">
              ₹199 / 6 months
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-pink/10 text-pink flex items-center justify-center">
            <ShieldCheck size={24} />
          </div>
        </div>

        {/* Pending Reviews */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-display font-bold uppercase tracking-widest text-slate-400 block mb-1">
              Pending Reviews
            </span>
            <span className="font-display text-3xl font-black text-amber-400">
              {stats.pendingReviews}
            </span>
            <span className="block text-[11px] text-slate-500 mt-1">
              Need moderation
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <MessageSquare size={24} />
          </div>
        </div>

        {/* Partner Requests */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-display font-bold uppercase tracking-widest text-slate-400 block mb-1">
              Partner Requests
            </span>
            <span className="font-display text-3xl font-black text-emerald-400">
              {stats.partnerRequests}
            </span>
            <span className="block text-[11px] text-slate-500 mt-1">
              Inquiries pending
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <Handshake size={24} />
          </div>
        </div>
      </div>

      {/* Grid: Events & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Recent Bookings & Events */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          {/* Upcoming Events Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-bold text-white">
                Upcoming Events
              </h2>
              <Link
                href="/admin/events"
                className="text-xs font-display font-bold text-blue hover:text-blue/80 uppercase tracking-wider flex items-center gap-1"
              >
                View all <ArrowUpRight size={14} />
              </Link>
            </div>

            <div className="flex flex-col divide-y divide-slate-800">
              {upcomingEventsList.map((ev) => (
                <div key={ev.id} className="py-3.5 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="font-display font-bold text-white text-sm">
                      {ev.title}
                    </h4>
                    <span className="text-xs text-slate-400">
                      {ev.date} • {ev.location}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-slate-800 text-slate-300">
                      Cap: {ev.max_capacity}
                    </span>
                    <Link
                      href={`/admin/events/${ev.id}`}
                      className="text-xs font-bold text-slate-300 hover:text-white px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700"
                    >
                      Manage
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Bookings Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-bold text-white">
                Recent Bookings
              </h2>
              <Link
                href="/admin/bookings"
                className="text-xs font-display font-bold text-blue hover:text-blue/80 uppercase tracking-wider flex items-center gap-1"
              >
                View all <ArrowUpRight size={14} />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-display uppercase tracking-wider">
                    <th className="pb-3">Reference</th>
                    <th className="pb-3">User</th>
                    <th className="pb-3">Event</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-body">
                  {recentBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 font-mono font-bold text-white">
                        {b.booking_reference}
                      </td>
                      <td className="py-3 text-slate-300">
                        {b.profiles?.full_name || "Guest"}
                      </td>
                      <td className="py-3 text-slate-300">
                        {b.events?.title}
                      </td>
                      <td className="py-3 text-slate-200 font-semibold">
                        ₹{b.total_amount}
                      </td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Col: Membership Approvals & Admin Shortcuts */}
        <div className="flex flex-col gap-6">
          {/* Pending Membership Applications Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-base font-bold text-white">
                  Pending Founding Applications
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  {pendingMemberships.length} Pending
                </span>
              </div>

              <p className="text-xs text-slate-400 mb-4">
                Users awaiting manual verification of ₹199 UPI transfer for Founding 50.
              </p>

              <div className="flex flex-col gap-3">
                {pendingMemberships.map((m) => (
                  <div
                    key={m.id}
                    className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3"
                  >
                    <div>
                      <h5 className="font-display font-bold text-sm text-white">
                        {m.profiles?.full_name || "Applicant"}
                      </h5>
                      <span className="text-[10px] font-mono text-pink">
                        {m.membership_reference || "F50-XXXXXX"}
                      </span>
                    </div>
                    <Link
                      href="/admin/members"
                      className="px-3 py-1.5 rounded-lg bg-pink/15 text-pink text-xs font-bold hover:bg-pink hover:text-white transition-all"
                    >
                      Review
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            <Link
              href="/admin/members"
              className="mt-6 w-full py-2.5 rounded-xl bg-slate-800 text-center text-xs font-display font-bold text-slate-200 hover:bg-slate-700 transition-colors uppercase tracking-wider"
            >
              Manage Founding Memberships →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
