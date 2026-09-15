"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  CalendarIcon,
  SparklesIcon,
  TicketIcon,
  ArrowRightIcon,
  PinIcon,
  HeartIcon,
  BellIcon,
} from "@/components/ui/minimal-graphics";
import ReferralShare from "@/components/ui/referral-share";

export default function AccountDashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<{ full_name: string | null; id?: string } | null>(null);
  const [membership, setMembership] = useState<{ status: string; end_date: string | null; plan?: any } | null>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [savedEvents, setSavedEvents] = useState<any[]>([]);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    async function loadUserData() {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      // Fetch Profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("id, full_name")
        .eq("id", user.id)
        .single();

      if (profileData) setProfile(profileData);

      // Fetch Membership
      const { data: memberData } = await supabase
        .from("memberships")
        .select("status, end_date, membership_plans(*)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (memberData) setMembership(memberData);

      // Fetch Bookings
      const { data: bookingsData } = await supabase
        .from("bookings")
        .select(`
          id,
          booking_reference,
          status,
          total_amount,
          created_at,
          events (
            id,
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

      if (bookingsData) setBookings(bookingsData);

      // Fetch Saved Events
      const { data: savedData } = await supabase
        .from("saved_events")
        .select(`
          id,
          events (
            id,
            title,
            slug,
            date,
            location,
            featured_image
          )
        `)
        .eq("user_id", user.id);

      if (savedData) setSavedEvents(savedData);

      // Fetch Referral Code
      const { data: refData } = await supabase
        .from("referral_codes")
        .select("code")
        .eq("user_id", user.id)
        .maybeSingle();

      if (refData) {
        setReferralCode(refData.code);
      } else {
        // Generate referral code if missing
        const newCode = "VAKU-" + user.id.substring(0, 6).toUpperCase();
        await supabase.from("referral_codes").insert({ user_id: user.id, code: newCode });
        setReferralCode(newCode);
      }

      // Fetch unread notifications count
      const { count } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("is_read", false);

      setUnreadNotifications(count || 0);

      setLoading(false);
    }

    loadUserData();
  }, [router, supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="font-display font-bold text-navy-40 animate-pulse">Loading your circle dashboard...</p>
      </div>
    );
  }

  const upcomingBookings = bookings.filter((b) => b.status === "CONFIRMED" || b.status === "PENDING");
  const pastBookings = bookings.filter((b) => b.status === "COMPLETED");

  const isFoundingActive = membership?.status === "ACTIVE";
  const isMembershipPending = membership?.status === "PENDING";

  return (
    <div className="max-w-[1280px] mx-auto px-4 py-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-navy/10 mb-10">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-4xl sm:text-5xl font-black text-navy tracking-tight">
              Hey, {profile?.full_name?.split(" ")[0] || "Friend"}.
            </h1>
            {isFoundingActive && (
              <span className="px-3 py-1 bg-pink text-white font-display text-[10px] font-black uppercase tracking-widest rounded-full">
                ✨ Founding Member
              </span>
            )}
          </div>
          <p className="text-navy-60 font-body text-base mt-1">
            Welcome to your unofficial social circle hub.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Link
            href="/account/notifications"
            className="relative px-4 py-2.5 rounded-full border border-navy/20 font-display text-xs font-bold uppercase tracking-wider text-navy hover:bg-navy hover:text-cream transition-all flex items-center gap-2"
          >
            <BellIcon size={14} /> Notifications
            {unreadNotifications > 0 && (
              <span className="w-5 h-5 rounded-full bg-pink text-white text-[10px] font-black flex items-center justify-center">
                {unreadNotifications}
              </span>
            )}
          </Link>

          <Link
            href="/account/profile"
            className="px-5 py-2.5 rounded-full border border-navy/20 font-display text-xs font-bold uppercase tracking-wider text-navy hover:bg-navy hover:text-cream transition-all"
          >
            Edit Profile
          </Link>

          <button
            onClick={handleSignOut}
            className="px-5 py-2.5 rounded-full bg-cream text-navy-60 hover:text-pink font-display text-xs font-bold uppercase tracking-wider transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Bookings & Saved Events */}
        <div className="lg:col-span-2 flex flex-col gap-10">
          {/* Upcoming Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl font-bold text-navy">
                Your next plans
              </h2>
              <Link
                href="/account/bookings"
                className="text-xs font-display font-bold text-pink hover:underline uppercase tracking-wider"
              >
                View all bookings →
              </Link>
            </div>

            {upcomingBookings.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 text-center border border-navy/5 shadow-sm">
                <p className="font-display text-lg font-bold text-navy mb-2">
                  Your calendar looks suspiciously empty.
                </p>
                <p className="text-xs text-navy-60 mb-6 font-body">
                  No upcoming events booked yet. Time to fix that!
                </p>
                <Link
                  href="/events"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-navy text-cream font-display text-xs font-bold uppercase tracking-wider hover:bg-blue transition-all"
                >
                  Find Something Fun <ArrowRightIcon size={14} />
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {upcomingBookings.map((b) => (
                  <div
                    key={b.id}
                    className="bg-white rounded-3xl p-6 border border-navy/5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <span className="text-[10px] font-display font-bold uppercase tracking-widest text-pink bg-pink/10 px-2.5 py-1 rounded-full inline-block mb-2">
                        {b.status}
                      </span>
                      <h3 className="font-display text-xl font-bold text-navy">
                        {b.events?.title}
                      </h3>
                      <div className="flex items-center gap-4 text-xs text-navy-60 mt-2 font-body">
                        <span className="flex items-center gap-1">
                          <CalendarIcon size={14} /> {b.events?.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <PinIcon size={14} /> {b.events?.location}
                        </span>
                      </div>
                    </div>
                    <Link
                      href={`/account/bookings/${b.id}`}
                      className="px-5 py-2.5 rounded-full bg-navy/5 hover:bg-navy hover:text-cream text-navy font-display text-xs font-bold uppercase tracking-wider text-center transition-all"
                    >
                      View Ticket
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Saved Events ("Things I might do") */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl font-bold text-navy flex items-center gap-2">
                <HeartIcon size={20} className="text-pink" /> Things I might do
              </h2>
            </div>
            {savedEvents.length === 0 ? (
              <div className="p-6 bg-white rounded-3xl border border-navy/5 text-center text-xs text-navy-60">
                You haven&apos;t saved any events yet. Tap the heart on any event to keep it on your radar!
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {savedEvents.map((item) => (
                  <Link
                    key={item.id}
                    href={`/events/${item.events?.slug}`}
                    className="p-5 bg-white rounded-2xl border border-navy/10 hover:border-pink transition-all group flex flex-col justify-between"
                  >
                    <div>
                      <h4 className="font-display font-bold text-navy group-hover:text-pink transition-colors">
                        {item.events?.title}
                      </h4>
                      <p className="text-xs text-navy-60 font-body mt-1">
                        {item.events?.date} • {item.events?.location}
                      </p>
                    </div>
                    <span className="text-xs font-display font-bold text-navy mt-4 block">View Event →</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Past Events */}
          <div>
            <h2 className="font-display text-2xl font-bold text-navy mb-6">
              Past events
            </h2>
            {pastBookings.length === 0 ? (
              <div className="p-6 bg-white/50 rounded-2xl border border-navy/5 text-center text-xs text-navy-40">
                You haven&apos;t attended any past events yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {pastBookings.map((b) => (
                  <div key={b.id} className="p-5 bg-white rounded-2xl border border-navy/5 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-navy text-sm">{b.events?.title}</p>
                      <p className="text-[11px] text-navy-60">{b.events?.date}</p>
                    </div>
                    <Link
                      href={`/account/bookings/${b.id}/review`}
                      className="px-3 py-1.5 rounded-full bg-pink/10 text-pink hover:bg-pink hover:text-white font-display text-[11px] font-bold uppercase transition-all"
                    >
                      Leave Review
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Circle Status & Referrals */}
        <div className="flex flex-col gap-6">
          {/* Founding Circle Status Card */}
          <div className="bg-blush rounded-3xl p-6 sm:p-8 flex flex-col justify-between border border-navy/10 relative overflow-hidden shadow-sm">
            <div>
              <span className="text-[10px] font-display font-black tracking-widest text-navy/40 uppercase block mb-1">
                Your Circle Status
              </span>
              <h3 className="font-display text-2xl font-black text-navy mb-2">
                {isFoundingActive
                  ? "Founding Member"
                  : isMembershipPending
                  ? "Application Pending"
                  : "Community Guest"}
              </h3>
              <p className="text-xs text-navy-80 leading-relaxed font-body mb-6">
                {isFoundingActive
                  ? `Your Founding 50 membership is active until ${
                      membership?.end_date ? new Date(membership.end_date).toLocaleDateString() : "6 months from approval"
                    }. Enjoy member pricing & exclusive perks!`
                  : isMembershipPending
                  ? "We are verifying your ₹199 manual UPI payment. Activation usually completes within 2 hours."
                  : "Join the Founding 50 (₹199 / 6 months) for member-only access, discounts, and voting rights."}
              </p>
            </div>

            {isFoundingActive ? (
              <div className="py-3 px-4 rounded-2xl bg-white text-center font-display text-xs font-bold text-pink border border-pink/20 shadow-sm flex items-center justify-center gap-2">
                <SparklesIcon size={14} /> Founding Member Active
              </div>
            ) : isMembershipPending ? (
              <Link
                href="/membership/confirmation"
                className="py-3 px-4 rounded-2xl bg-white text-center font-display text-xs font-bold text-navy border border-navy/10 hover:border-navy transition-all"
              >
                View Pending Application →
              </Link>
            ) : (
              <Link
                href="/membership"
                className="w-full py-3.5 rounded-full bg-navy text-cream font-display text-xs font-bold uppercase tracking-wider text-center hover:bg-blue transition-all"
              >
                Join Founding 50 (₹199) →
              </Link>
            )}
          </div>

          {/* Referral Share Widget ("Invite a Friend") */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-navy/10 shadow-sm">
            <h3 className="font-display text-xl font-bold text-navy mb-2">
              Good people know good people.
            </h3>
            <p className="text-xs text-navy-60 font-body mb-6">
              Invite your friends to the circle using your unique referral code.
            </p>
            <ReferralShare code={referralCode || "VAKU-FRIEND"} />
          </div>
        </div>
      </div>
    </div>
  );
}
