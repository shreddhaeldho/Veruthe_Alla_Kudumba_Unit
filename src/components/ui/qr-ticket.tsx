"use client";

import { QRCodeSVG } from "qrcode.react";
import { Logo } from "@/components/ui/logo";
import { CalendarIcon, PinIcon, TicketIcon } from "@/components/ui/minimal-graphics";

interface QRCodeTicketProps {
  bookingReference: string;
  eventName: string;
  participantName: string;
  date: string;
  time: string;
  location: string;
  ticketType: string;
  amount?: number;
}

export function QRCodeTicket({
  bookingReference,
  eventName,
  participantName,
  date,
  time,
  location,
  ticketType,
  amount,
}: QRCodeTicketProps) {
  return (
    <div className="relative w-full max-w-md mx-auto bg-white rounded-3xl overflow-hidden shadow-2xl border border-navy/10 flex flex-col">
      {/* Top Header */}
      <div className="bg-navy p-6 flex items-center justify-between border-b border-navy-80">
        <Logo size="sm" className="[&_span]:text-cream [&_span:last-child]:text-blush" />
        <span className="text-[10px] font-display font-black tracking-widest text-pink bg-pink/10 px-2.5 py-1 rounded-full uppercase">
          Official Pass
        </span>
      </div>

      {/* Main Ticket Content */}
      <div className="p-6 sm:p-8 flex flex-col gap-6">
        <div>
          <span className="text-xs font-display font-bold uppercase tracking-wider text-navy-40 block mb-1">
            Event
          </span>
          <h3 className="font-display text-2xl font-black text-navy leading-tight">
            {eventName}
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-4 border-y border-dashed border-navy/15 py-4">
          <div>
            <span className="text-[11px] font-display uppercase tracking-wider text-navy-40 block mb-1">
              Attendee
            </span>
            <p className="font-display font-bold text-navy text-sm truncate">
              {participantName}
            </p>
          </div>
          <div>
            <span className="text-[11px] font-display uppercase tracking-wider text-navy-40 block mb-1">
              Ticket Type
            </span>
            <p className="font-display font-bold text-navy text-sm truncate">
              {ticketType}
            </p>
          </div>
          <div>
            <span className="text-[11px] font-display uppercase tracking-wider text-navy-40 block mb-1 flex items-center gap-1">
              <CalendarIcon size={12} /> Date & Time
            </span>
            <p className="text-xs text-navy-80 font-medium">
              {date}
            </p>
            <p className="text-[11px] text-navy-60">{time}</p>
          </div>
          <div>
            <span className="text-[11px] font-display uppercase tracking-wider text-navy-40 block mb-1 flex items-center gap-1">
              <PinIcon size={12} /> Location
            </span>
            <p className="text-xs text-navy-80 font-medium truncate">
              {location}
            </p>
          </div>
        </div>

        {/* QR Code Container */}
        <div className="flex flex-col items-center justify-center p-6 bg-cream rounded-2xl border border-navy/5">
          <div className="p-3 bg-white rounded-xl shadow-sm border border-navy/10">
            <QRCodeSVG
              value={bookingReference}
              size={180}
              level="M"
              includeMargin={false}
            />
          </div>
          <p className="mt-4 font-mono text-xs font-bold text-navy tracking-widest uppercase">
            {bookingReference}
          </p>
          <span className="text-[10px] text-navy-40 mt-1 font-body">
            Scan at entry to check-in
          </span>
        </div>
      </div>

      {/* Ticket Footer / Stub Notch Design */}
      <div className="bg-cream/50 p-4 text-center border-t border-navy/5">
        <p className="text-[11px] font-display font-medium text-navy-60">
          Veruthe Alla Kudumba Unit • No online payment collected
        </p>
      </div>
    </div>
  );
}
