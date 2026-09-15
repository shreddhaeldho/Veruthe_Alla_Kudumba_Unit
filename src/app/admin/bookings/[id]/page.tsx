"use client";

import { useState, use } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, XCircle, CreditCard } from "lucide-react";

export default function AdminBookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);

  const [booking, setBooking] = useState({
    id: resolvedParams.id,
    reference: "VAKU-7F3A9C",
    status: "CONFIRMED",
    totalAmount: 399,
    paymentStatus: "CONFIRMED_MANUAL",
    paymentMethod: "UPI",
    manualReference: "UPI-98234791823",
    customer: {
      name: "Rahul Nair",
      email: "rahul@example.com",
      phone: "+91 98765 11223",
    },
    event: {
      title: "Sunset Social",
      date: "September 27, 2026",
      time: "5:00 PM – 8:00 PM",
      location: "Marine Drive Promenade, Kochi",
    },
    tickets: {
      type: "General Ticket",
      quantity: 1,
    },
  });

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [method, setMethod] = useState("UPI");
  const [amount, setAmount] = useState(399);
  const [refCode, setRefCode] = useState("");

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setBooking((prev) => ({
      ...prev,
      paymentStatus: "PAID_MANUAL",
      paymentMethod: method,
      manualReference: refCode || "OFFLINE-REC",
    }));
    setShowPaymentModal(false);
    alert("Manual payment record logged successfully.");
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/bookings"
          className="inline-flex items-center gap-2 text-xs font-display font-bold uppercase tracking-wider text-slate-400 hover:text-white"
        >
          <ArrowLeft size={14} /> Back to Bookings
        </Link>
        <span
          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
            booking.status === "CONFIRMED"
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              : "bg-pink/10 text-pink border-pink/20"
          }`}
        >
          {booking.status}
        </span>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col gap-6">
        <div className="border-b border-slate-800 pb-4">
          <span className="text-[10px] font-mono uppercase text-slate-500 block">
            Booking ID
          </span>
          <h1 className="font-mono text-3xl font-black text-white">
            {booking.reference}
          </h1>
        </div>

        {/* Customer & Event Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <h3 className="text-xs font-display font-bold uppercase text-slate-400 mb-2">
              Customer Information
            </h3>
            <p className="font-bold text-white text-sm">{booking.customer.name}</p>
            <p className="text-xs text-slate-400">{booking.customer.email}</p>
            <p className="text-xs text-slate-400">{booking.customer.phone}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <h3 className="text-xs font-display font-bold uppercase text-slate-400 mb-2">
              Event Details
            </h3>
            <p className="font-bold text-white text-sm">{booking.event.title}</p>
            <p className="text-xs text-slate-400">{booking.event.date} • {booking.event.time}</p>
            <p className="text-xs text-slate-400">{booking.event.location}</p>
          </div>
        </div>

        {/* Tickets & Payment Value */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <h3 className="text-xs font-display font-bold uppercase text-slate-400 mb-1">
              Ticket Details
            </h3>
            <p className="text-sm font-semibold text-white">
              {booking.tickets.quantity} × {booking.tickets.type}
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs text-slate-400 block">Booking Value</span>
            <span className="font-display text-2xl font-black text-white">
              ₹{booking.totalAmount}
            </span>
            <span className="block text-[10px] text-slate-500">
              Payment: {booking.paymentMethod} ({booking.manualReference})
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => setShowPaymentModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-bold hover:bg-slate-700"
          >
            <CreditCard size={14} /> Record Manual Payment
          </button>

          <div className="flex items-center gap-2">
            {booking.status !== "CONFIRMED" && (
              <button
                onClick={() => setBooking((b) => ({ ...b, status: "CONFIRMED" }))}
                className="px-4 py-2 rounded-xl bg-emerald-500/15 text-emerald-400 text-xs font-bold hover:bg-emerald-500 hover:text-white"
              >
                Confirm Spot
              </button>
            )}
            {booking.status !== "CANCELLED" && (
              <button
                onClick={() => setBooking((b) => ({ ...b, status: "CANCELLED" }))}
                className="px-4 py-2 rounded-xl bg-pink/15 text-pink text-xs font-bold hover:bg-pink hover:text-white"
              >
                Cancel Spot
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Manual Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full">
            <h3 className="font-display text-xl font-bold text-white mb-4">
              Record Manual Payment
            </h3>
            <form onSubmit={handleRecordPayment} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs uppercase text-slate-400 mb-1">
                  Payment Method
                </label>
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                >
                  <option value="UPI">UPI Transfer</option>
                  <option value="Cash">Cash at Venue</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase text-slate-400 mb-1">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs uppercase text-slate-400 mb-1">
                  Reference Note / Transaction ID
                </label>
                <input
                  type="text"
                  value={refCode}
                  onChange={(e) => setRefCode(e.target.value)}
                  placeholder="e.g. GPay UPI ref #8291..."
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue text-white text-xs font-bold"
                >
                  Save Payment Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
