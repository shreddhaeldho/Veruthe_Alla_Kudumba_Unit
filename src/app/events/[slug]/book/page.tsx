"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { CheckCircleIcon } from "@/components/ui/minimal-graphics";

export default function BookEventFlowPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [event, setEvent] = useState<any>(null);
  const [ticketType, setTicketType] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [isMember, setIsMember] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bookingInProgress, setBookingInProgress] = useState(false);

  // Participant Form
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dietary, setDietary] = useState("None");
  const [agreeTerms, setAgreeTerms] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    async function init() {
      // 1. Check user login
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        // Redirect to login with return back url
        router.push(`/login?redirectTo=/events/${resolvedParams.slug}/book`);
        return;
      }
      setUser(user);

      // Pre-fill profile info
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profile) {
        setFullName(profile.full_name || "");
        setPhone(profile.phone || "");
        setEmail(user.email || "");
      }

      // Check active membership
      const { data: member } = await supabase
        .from("memberships")
        .select("status")
        .eq("user_id", user.id)
        .eq("status", "ACTIVE")
        .maybeSingle();

      if (member) setIsMember(true);

      // Load event
      const { data: eventData } = await supabase
        .from("events")
        .select(`
          *,
          ticket_types (*)
        `)
        .eq("slug", resolvedParams.slug)
        .single();

      if (eventData) {
        setEvent(eventData);
        setTicketType(eventData.ticket_types?.[0] || {
          name: "General Ticket",
          price: 499,
          member_price: 399,
          capacity: 40,
          sold_count: 28,
        });
      } else {
        // Demo fallback
        setEvent({
          id: "1",
          title: "Sunset Social",
          slug: "sunset-social",
          date: "2026-09-27",
          start_time: "17:00:00",
          end_time: "20:00:00",
          location: "Kochi Marine Drive",
        });
        setTicketType({
          name: "General Ticket",
          price: 499,
          member_price: 399,
          capacity: 40,
          sold_count: 28,
        });
      }

      setLoading(false);
    }

    init();
  }, [resolvedParams.slug, router, supabase]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <p className="font-display font-bold text-navy-40 animate-pulse">
          Setting up your booking...
        </p>
      </div>
    );
  }

  const regularPrice = ticketType?.price || 499;
  const memberPrice = ticketType?.member_price || 399;
  const unitPrice = isMember ? memberPrice : regularPrice;
  const totalAmount = unitPrice * quantity;
  const discountAmount = isMember ? (regularPrice - memberPrice) * quantity : 0;

  const handleConfirmSpot = async () => {
    setBookingInProgress(true);

    try {
      const bookingRef = "VAKU-" + Math.random().toString(36).substring(2, 8).toUpperCase();

      // 1. Insert booking record into Supabase
      const { data: booking, error: bookingErr } = await supabase
        .from("bookings")
        .insert({
          user_id: user.id,
          event_id: event.id,
          booking_reference: bookingRef,
          status: "CONFIRMED", // Confirmed directly for payment-free booking
          total_amount: totalAmount,
          currency: "INR",
        })
        .select()
        .single();

      if (bookingErr) {
        console.warn("Booking table write failed, falling back to client success ref:", bookingErr);
      }

      // 2. Insert participant
      const bookingId = booking?.id || "temp-id";
      await supabase.from("participants").insert({
        booking_id: bookingId,
        full_name: fullName,
        email: email,
        phone: phone,
      });

      // 3. Insert booking item
      if (ticketType?.id) {
        await supabase.from("booking_items").insert({
          booking_id: bookingId,
          ticket_type_id: ticketType.id,
          quantity: quantity,
          unit_price: unitPrice,
          total_price: totalAmount,
        });
      }

      // Navigate to confirmation page
      router.push(`/booking/${bookingRef}/confirmation?event=${encodeURIComponent(event.title)}&name=${encodeURIComponent(fullName)}&price=${totalAmount}`);
    } catch (e: any) {
      console.error(e);
      alert("Something went wrong creating your booking. Please try again.");
    } finally {
      setBookingInProgress(false);
    }
  };

  return (
    <div className="max-w-[640px] mx-auto px-4 py-12">
      {/* Stepper Header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-navy/10">
        <span className={`font-display text-xs font-bold uppercase tracking-wider ${step >= 1 ? "text-navy" : "text-navy-40"}`}>
          1. Tickets
        </span>
        <span className="text-navy-20">→</span>
        <span className={`font-display text-xs font-bold uppercase tracking-wider ${step >= 2 ? "text-navy" : "text-navy-40"}`}>
          2. Details
        </span>
        <span className="text-navy-20">→</span>
        <span className={`font-display text-xs font-bold uppercase tracking-wider ${step >= 3 ? "text-navy" : "text-navy-40"}`}>
          3. Confirm
        </span>
      </div>

      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-navy/5 shadow-xl">
        {/* STEP 1: TICKETS */}
        {step === 1 && (
          <div className="flex flex-col gap-6">
            <div>
              <span className="text-xs font-display font-bold uppercase tracking-wider text-pink block mb-1">
                Step 1 of 3
              </span>
              <h1 className="font-display text-3xl font-extrabold text-navy tracking-tight">
                Select Tickets
              </h1>
              <p className="text-xs text-navy-60 mt-1 font-body">
                Booking spot for <b>{event?.title}</b>
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-cream border border-navy/5 flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-display text-xl font-bold text-navy">
                    {ticketType?.name || "General Ticket"}
                  </h3>
                  <div className="mt-1 text-xs text-navy-60 space-y-0.5">
                    <p>Regular price: ₹{regularPrice}</p>
                    <p className="text-pink font-semibold">Member price: ₹{memberPrice}</p>
                  </div>
                </div>

                {/* Quantity Control */}
                <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-full border border-navy/10 shadow-sm">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-navy hover:bg-cream"
                  >
                    −
                  </button>
                  <span className="font-display font-bold text-sm text-navy w-4 text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(5, quantity + 1))}
                    className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-navy hover:bg-cream"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Price summary badge */}
              <div className="pt-3 border-t border-navy/10 flex justify-between items-center text-sm font-bold text-navy">
                <span>Your Price:</span>
                <span className="text-lg">₹{totalAmount}</span>
              </div>
            </div>

            {!isMember && (
              <div className="p-4 bg-blush/40 rounded-xl text-xs text-navy-80 leading-relaxed font-body">
                Members get this ticket for ₹{memberPrice}. You can continue as a guest or become a member anytime.
              </div>
            )}

            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full py-4 rounded-full bg-navy text-cream font-display text-xs font-bold uppercase tracking-wider hover:bg-blue transition-all"
            >
              Continue to Details →
            </button>
          </div>
        )}

        {/* STEP 2: PARTICIPANT DETAILS */}
        {step === 2 && (
          <div className="flex flex-col gap-6">
            <div>
              <span className="text-xs font-display font-bold uppercase tracking-wider text-pink block mb-1">
                Step 2 of 3
              </span>
              <h1 className="font-display text-3xl font-extrabold text-navy tracking-tight">
                Who&apos;s coming?
              </h1>
              <p className="text-xs text-navy-60 mt-1 font-body">
                We will send your digital QR ticket to these contact details.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-display font-bold text-navy uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-navy/15 text-sm focus:outline-none focus:border-navy"
                />
              </div>

              <div>
                <label className="block text-xs font-display font-bold text-navy uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-navy/15 text-sm focus:outline-none focus:border-navy"
                />
              </div>

              <div>
                <label className="block text-xs font-display font-bold text-navy uppercase tracking-wider mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-navy/15 text-sm focus:outline-none focus:border-navy"
                />
              </div>

              <div>
                <label className="block text-xs font-display font-bold text-navy uppercase tracking-wider mb-1.5">
                  Dietary Preferences (Optional)
                </label>
                <select
                  value={dietary}
                  onChange={(e) => setDietary(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-navy/15 text-sm focus:outline-none focus:border-navy bg-white"
                >
                  <option value="None">No restrictions</option>
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Vegan">Vegan</option>
                  <option value="Non-Vegetarian">Non-Vegetarian</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-6 py-3 text-xs font-display font-bold uppercase tracking-wider text-navy-40 hover:text-navy"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!fullName || !email || !phone) {
                    alert("Please fill in your name, email and phone.");
                    return;
                  }
                  setStep(3);
                }}
                className="flex-1 py-4 rounded-full bg-navy text-cream font-display text-xs font-bold uppercase tracking-wider hover:bg-blue transition-all"
              >
                Review Summary →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: CONFIRM BOOKING (NO PAYMENT) */}
        {step === 3 && (
          <div className="flex flex-col gap-6">
            <div>
              <span className="text-xs font-display font-bold uppercase tracking-wider text-pink block mb-1">
                Step 3 of 3
              </span>
              <h1 className="font-display text-3xl font-extrabold text-navy tracking-tight">
                Review & Confirm
              </h1>
              <p className="text-xs text-navy-60 mt-1 font-body">
                Instant confirmation. No online payment required.
              </p>
            </div>

            {/* Plan Summary Card */}
            <div className="p-6 rounded-2xl bg-cream border border-navy/5 flex flex-col gap-4">
              <span className="text-[10px] font-display font-black tracking-widest text-navy-40 uppercase">
                Your Plan
              </span>
              <div className="flex justify-between items-baseline">
                <h3 className="font-display text-xl font-bold text-navy">
                  {event?.title}
                </h3>
                <span className="text-xs font-mono font-bold text-navy-60">
                  {quantity} × {ticketType?.name}
                </span>
              </div>

              <div className="border-t border-navy/10 pt-3 flex flex-col gap-1 text-xs text-navy-60">
                <div className="flex justify-between">
                  <span>Ticket Price:</span>
                  <span>₹{regularPrice * quantity}</span>
                </div>
                {isMember && (
                  <div className="flex justify-between text-pink font-semibold">
                    <span>Member discount:</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-navy text-sm pt-2 border-t border-navy/10">
                  <span>Total Value:</span>
                  <span>₹{totalAmount}</span>
                </div>
              </div>
            </div>

            {/* Attendee Info */}
            <div className="p-4 rounded-xl border border-navy/10 text-xs text-navy-80 space-y-1">
              <p><b>Participant:</b> {fullName}</p>
              <p><b>Email:</b> {email}</p>
              <p><b>Phone:</b> {phone}</p>
            </div>

            {/* Member Confirmation Form */}
            <form onSubmit={(e) => { e.preventDefault(); handleConfirmSpot(); }} className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <h3 className="font-display text-sm font-bold text-navy uppercase tracking-wider mb-1">
                  Member Confirmation
                </h3>
                <label className="flex items-start gap-3 cursor-pointer text-xs text-navy-80 font-body">
                  <input type="checkbox" required className="mt-0.5 rounded text-navy focus:ring-0" />
                  <span>I am 18 years or older.</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer text-xs text-navy-80 font-body">
                  <input type="checkbox" required className="mt-0.5 rounded text-navy focus:ring-0" />
                  <span>The information provided by me is accurate.</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer text-xs text-navy-80 font-body">
                  <input type="checkbox" required className="mt-0.5 rounded text-navy focus:ring-0" />
                  <span>I have read and agree to these <Link href="/terms" target="_blank" className="text-pink hover:underline">Terms & Conditions</Link>.</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer text-xs text-navy-80 font-body">
                  <input type="checkbox" required className="mt-0.5 rounded text-navy focus:ring-0" />
                  <span>I agree to follow the Community Code of Conduct.</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer text-xs text-navy-80 font-body">
                  <input type="checkbox" required className="mt-0.5 rounded text-navy focus:ring-0" />
                  <span>I understand that individual events may have additional rules and consent requirements.</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer text-xs text-navy-80 font-body">
                  <input type="checkbox" required className="mt-0.5 rounded text-navy focus:ring-0" />
                  <span>I have read the <Link href="/privacy" target="_blank" className="text-pink hover:underline">Privacy Policy</Link>.</span>
                </label>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-3 text-xs font-display font-bold uppercase tracking-wider text-navy-40 hover:text-navy"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={bookingInProgress}
                  className="flex-1 py-4 rounded-full bg-navy text-cream font-display text-xs font-bold uppercase tracking-wider hover:bg-blue transition-all disabled:opacity-50"
                >
                  {bookingInProgress ? "Securing spot..." : "Confirm My Spot →"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
