"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import StarRating from "@/components/ui/star-rating";
import { ArrowLeftIcon, SparklesIcon, CheckCircleIcon } from "@/components/ui/minimal-graphics";

export default function SubmitReviewPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [booking, setBooking] = useState<any>(null);
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    async function loadBooking() {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push(`/login?redirectTo=/account/bookings/${bookingId}/review`);
        return;
      }

      const { data, error } = await supabase
        .from("bookings")
        .select("*, events(*)")
        .eq("id", bookingId)
        .eq("user_id", user.id)
        .single();

      if (error || !data) {
        setErrorMsg("Booking not found.");
      } else {
        setBooking(data);
      }
      setLoading(false);
    }

    loadBooking();
  }, [bookingId, router, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!booking) return;

    setSubmitting(true);
    setErrorMsg(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("event_reviews").upsert({
      event_id: booking.event_id,
      user_id: user.id,
      booking_id: booking.id,
      rating,
      review: review.trim(),
      status: "PENDING",
    });

    if (error) {
      setErrorMsg(error.message);
      setSubmitting(false);
    } else {
      setSubmitted(true);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-cream">
        <p className="font-display font-bold text-navy-40 animate-pulse">Loading event review form...</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 text-center border border-navy/10 shadow-xl">
          <div className="w-16 h-16 rounded-full bg-peach/20 text-peach flex items-center justify-center mx-auto mb-4">
            <CheckCircleIcon size={32} />
          </div>
          <h1 className="font-display text-3xl font-black text-navy mb-2">Thanks for coming.</h1>
          <p className="text-xs text-navy-60 font-body mb-6">
            Your review for <strong className="text-navy">{booking?.events?.title}</strong> has been submitted! It will appear on the event page once approved by our team.
          </p>
          <Link
            href="/account"
            className="w-full py-3.5 rounded-full bg-navy text-cream font-display text-xs font-bold uppercase tracking-wider block text-center"
          >
            Back to Account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream text-navy py-12 px-4">
      <div className="max-w-lg mx-auto">
        <Link
          href="/account"
          className="inline-flex items-center gap-2 text-xs font-display font-bold uppercase tracking-wider text-navy-60 hover:text-navy mb-8 transition-colors"
        >
          <ArrowLeftIcon size={14} /> Back to Dashboard
        </Link>

        <div className="bg-white rounded-3xl p-8 border border-navy/10 shadow-xl">
          <span className="text-[10px] font-display font-bold uppercase tracking-widest text-pink block mb-1">
            Event Feedback
          </span>
          <h1 className="font-display text-3xl font-black text-navy mb-1">How was it?</h1>
          <p className="text-xs text-navy-60 font-body mb-6">
            Share your experience for <strong className="text-navy">{booking?.events?.title}</strong>.
          </p>

          {errorMsg && (
            <div className="p-4 rounded-2xl bg-pink/10 text-pink text-xs mb-6">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
              <label className="block text-xs font-display font-bold uppercase text-navy-60 mb-2">
                Overall Rating
              </label>
              <StarRating value={rating} onChange={setRating} size={32} />
            </div>

            <div>
              <label className="block text-xs font-display font-bold uppercase text-navy-60 mb-2">
                Your Review
              </label>
              <textarea
                rows={4}
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="What did you love? Any cool memories or highlights?"
                className="w-full p-4 rounded-2xl border border-navy/15 bg-cream/30 focus:outline-none focus:border-navy text-sm font-body text-navy placeholder:text-navy-40"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 rounded-full bg-navy text-cream font-display text-xs font-bold uppercase tracking-wider hover:bg-blue transition-all disabled:opacity-50"
            >
              {submitting ? "Sending..." : "Send Feedback"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
