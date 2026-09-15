"use client";

import { use } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { QRCodeTicket } from "@/components/ui/qr-ticket";
import { CheckCircleIcon, ArrowRightIcon } from "@/components/ui/minimal-graphics";

export default function BookingConfirmationPage({
  params,
}: {
  params: Promise<{ "booking-reference": string }>;
}) {
  const resolvedParams = use(params);
  const searchParams = useSearchParams();

  const eventTitle = searchParams.get("event") || "Sunset Social";
  const attendeeName = searchParams.get("name") || "Valued Attendee";
  const amount = Number(searchParams.get("price")) || 499;

  return (
    <div className="max-w-[768px] mx-auto px-4 py-16 text-center">
      {/* Success Badge */}
      <div className="w-16 h-16 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircleIcon size={32} />
      </div>

      <h1 className="font-display text-4xl sm:text-5xl font-black text-navy tracking-tight mb-2">
        You&apos;re in.
      </h1>
      <p className="text-navy-60 font-body text-base max-w-md mx-auto mb-10">
        Your spot is officially saved. Your digital pass with check-in QR code has been generated.
      </p>

      {/* Render Digital Pass */}
      <div className="mb-10 text-left">
        <QRCodeTicket
          bookingReference={resolvedParams["booking-reference"]}
          eventName={eventTitle}
          participantName={attendeeName}
          date="September 27, 2026"
          time="5:00 PM – 8:00 PM"
          location="Kochi"
          ticketType="General Ticket"
          amount={amount}
        />
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/account/bookings"
          className="px-8 py-3.5 rounded-full bg-navy text-cream font-display text-xs font-bold uppercase tracking-wider hover:bg-blue transition-all"
        >
          View in My Bookings
        </Link>
        <Link
          href="/events"
          className="px-8 py-3.5 rounded-full border border-navy/20 text-navy font-display text-xs font-bold uppercase tracking-wider hover:bg-navy hover:text-cream transition-all"
        >
          Back to Events
        </Link>
      </div>
    </div>
  );
}
