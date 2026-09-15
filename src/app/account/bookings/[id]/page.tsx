"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { QRCodeTicket } from "@/components/ui/qr-ticket";

export default function BookingDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    async function loadBooking() {
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          id,
          booking_reference,
          status,
          total_amount,
          created_at,
          events (
            title,
            date,
            start_time,
            end_time,
            location
          ),
          participants (
            full_name,
            email,
            phone
          ),
          booking_items (
            quantity,
            unit_price,
            ticket_types (
              name
            )
          )
        `)
        .eq("id", resolvedParams.id)
        .single();

      if (data) setBooking(data);
      setLoading(false);
    }

    loadBooking();
  }, [resolvedParams.id, supabase]);

  const handleCancel = async () => {
    setCancelling(true);
    const { error } = await supabase
      .from("bookings")
      .update({ status: "CANCELLED" })
      .eq("id", resolvedParams.id);

    if (!error) {
      setBooking((prev: any) => ({ ...prev, status: "CANCELLED" }));
      setShowCancelModal(false);
    } else {
      alert("Failed to cancel: " + error.message);
    }
    setCancelling(false);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="font-display font-bold text-navy-40 animate-pulse">
          Loading ticket details...
        </p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="max-w-md mx-auto py-20 text-center">
        <h2 className="font-display text-2xl font-bold text-navy mb-4">
          Booking Not Found
        </h2>
        <Link href="/account/bookings" className="text-pink font-bold text-sm">
          ← Back to Bookings
        </Link>
      </div>
    );
  }

  const participant = booking.participants?.[0] || { full_name: "Valued Guest" };
  const ticketItem = booking.booking_items?.[0];
  const ticketTypeName = ticketItem?.ticket_types?.name || "General Ticket";

  return (
    <div className="max-w-[768px] mx-auto px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <Link
          href="/account/bookings"
          className="text-xs font-display font-bold text-navy-40 hover:text-navy uppercase tracking-wider"
        >
          ← Back to Bookings
        </Link>
        <span
          className={`text-[10px] font-display font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
            booking.status === "CONFIRMED"
              ? "bg-green-100 text-green-800"
              : booking.status === "CANCELLED"
              ? "bg-pink/10 text-pink"
              : "bg-peach/15 text-peach"
          }`}
        >
          {booking.status}
        </span>
      </div>

      {/* Ticket Rendering */}
      <div className="mb-10">
        <QRCodeTicket
          bookingReference={booking.booking_reference}
          eventName={booking.events?.title || "Event"}
          participantName={participant.full_name}
          date={booking.events?.date || "Date TBA"}
          time={`${booking.events?.start_time?.slice(0, 5) || "5:00 PM"} – ${booking.events?.end_time?.slice(0, 5) || "8:00 PM"}`}
          location={booking.events?.location || "Kochi"}
          ticketType={ticketTypeName}
          amount={booking.total_amount}
        />
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => alert("Added to device calendar!")}
          className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-navy text-cream font-display text-xs font-bold uppercase tracking-wider hover:bg-blue transition-all"
        >
          Add to Calendar
        </button>

        <button
          type="button"
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: booking.events?.title,
                text: `My ticket for ${booking.events?.title}`,
                url: window.location.href,
              });
            } else {
              navigator.clipboard.writeText(window.location.href);
              alert("Ticket link copied to clipboard!");
            }
          }}
          className="w-full sm:w-auto px-8 py-3.5 rounded-full border border-navy/20 text-navy font-display text-xs font-bold uppercase tracking-wider hover:bg-navy hover:text-cream transition-all"
        >
          Share Ticket
        </button>

        {booking.status !== "CANCELLED" && (
          <button
            type="button"
            onClick={() => setShowCancelModal(true)}
            className="w-full sm:w-auto px-6 py-3.5 rounded-full text-navy-40 hover:text-pink font-display text-xs font-bold uppercase tracking-wider transition-colors"
          >
            Cancel Booking
          </button>
        )}
      </div>

      {/* Cancellation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-navy/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="font-display text-2xl font-black text-navy mb-2">
              Want to cancel your spot?
            </h3>
            <p className="text-xs text-navy-60 font-body leading-relaxed mb-6">
              Please note: No online payment was collected for this booking. Cancelling will immediately release your spot to others.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-3 rounded-full bg-cream text-navy font-display text-xs font-bold uppercase tracking-wider hover:bg-navy/5"
              >
                Keep My Spot
              </button>
              <button
                type="button"
                disabled={cancelling}
                onClick={handleCancel}
                className="flex-1 py-3 rounded-full bg-pink text-white font-display text-xs font-bold uppercase tracking-wider hover:bg-pink/90 disabled:opacity-50"
              >
                {cancelling ? "Cancelling..." : "Cancel Booking"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
