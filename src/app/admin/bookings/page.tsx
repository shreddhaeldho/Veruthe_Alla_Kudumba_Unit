"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Filter, Eye, CheckCircle2, XCircle } from "lucide-react";

export default function AdminBookingsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [bookings, setBookings] = useState([
    {
      id: "b1",
      reference: "VAKU-7F3A9C",
      userName: "Rahul Nair",
      userEmail: "rahul@example.com",
      userPhone: "+91 98765 11223",
      eventName: "Sunset Social",
      ticketType: "General Ticket",
      quantity: 1,
      totalAmount: 399,
      status: "CONFIRMED",
      paymentMethod: "MANUAL",
      date: "2026-09-13",
    },
    {
      id: "b2",
      reference: "VAKU-2D91EE",
      userName: "Ananya Menon",
      userEmail: "ananya@example.com",
      userPhone: "+91 94471 88990",
      eventName: "Food Walk",
      ticketType: "General Ticket",
      quantity: 2,
      totalAmount: 698,
      status: "CONFIRMED",
      paymentMethod: "CASH_AT_VENUE",
      date: "2026-09-12",
    },
    {
      id: "b3",
      reference: "VAKU-48BA91",
      userName: "Farhan Ali",
      userEmail: "farhan@example.com",
      userPhone: "+91 91234 56789",
      eventName: "Sunset Social",
      ticketType: "General Ticket",
      quantity: 1,
      totalAmount: 499,
      status: "CANCELLED",
      paymentMethod: "MANUAL",
      date: "2026-09-11",
    },
  ]);

  const handleUpdateStatus = (id: string, newStatus: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    );
  };

  const filtered = bookings.filter((b) => {
    const matchSearch =
      b.reference.toLowerCase().includes(search.toLowerCase()) ||
      b.userName.toLowerCase().includes(search.toLowerCase()) ||
      b.userEmail.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "ALL" || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-black text-white tracking-tight">
          Booking Management
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Monitor attendee reservations and manual payment records.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by reference, name, or email..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue"
          />
        </div>

        <div className="flex items-center gap-2">
          {["ALL", "CONFIRMED", "CANCELLED", "COMPLETED"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-display font-bold uppercase tracking-wider transition-all ${
                statusFilter === st
                  ? "bg-blue text-white"
                  : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/50 text-slate-400 font-display uppercase tracking-wider">
                <th className="p-4">Reference</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Event</th>
                <th className="p-4">Ticket</th>
                <th className="p-4">Value</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-body">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-4 font-mono font-bold text-white">
                    {b.reference}
                  </td>
                  <td className="p-4">
                    <div className="font-semibold text-white">{b.userName}</div>
                    <div className="text-[11px] text-slate-500">{b.userEmail}</div>
                  </td>
                  <td className="p-4 text-slate-300 font-medium">
                    {b.eventName}
                  </td>
                  <td className="p-4 text-slate-300">
                    {b.quantity} × {b.ticketType}
                  </td>
                  <td className="p-4 font-bold text-slate-200">
                    ₹{b.totalAmount}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        b.status === "CONFIRMED"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : b.status === "COMPLETED"
                          ? "bg-blue/10 text-blue border-blue/20"
                          : "bg-pink/10 text-pink border-pink/20"
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/bookings/${b.id}`}
                        className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                        title="View Details"
                      >
                        <Eye size={14} />
                      </Link>
                      {b.status !== "CONFIRMED" && (
                        <button
                          onClick={() => handleUpdateStatus(b.id, "CONFIRMED")}
                          className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500 hover:text-white"
                          title="Confirm Booking"
                        >
                          <CheckCircle2 size={14} />
                        </button>
                      )}
                      {b.status !== "CANCELLED" && (
                        <button
                          onClick={() => handleUpdateStatus(b.id, "CANCELLED")}
                          className="p-1.5 rounded-lg bg-pink/15 text-pink hover:bg-pink hover:text-white"
                          title="Cancel Booking"
                        >
                          <XCircle size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
