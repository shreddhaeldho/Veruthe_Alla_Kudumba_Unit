"use client";

import { useState } from "react";
import {
  QrCode,
  Search,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Users,
  Camera,
} from "lucide-react";

export default function AdminCheckInPage() {
  const [selectedEvent, setSelectedEvent] = useState("sunset-social");
  const [bookingRefInput, setBookingRefInput] = useState("");
  const [checkInState, setCheckInState] = useState<
    "IDLE" | "SUCCESS" | "ALREADY_CHECKED" | "NOT_FOUND"
  >("IDLE");
  const [lastAttendee, setLastAttendee] = useState<any>(null);

  // Attendees list state
  const [attendees, setAttendees] = useState<any[]>([
    {
      id: "p1",
      reference: "VAKU-7F3A9C",
      name: "Rahul Nair",
      email: "rahul@example.com",
      ticketType: "General Ticket",
      checkedIn: true,
      checkedInAt: "17:15 PM",
    },
    {
      id: "p2",
      reference: "VAKU-2D91EE",
      name: "Ananya Menon",
      email: "ananya@example.com",
      ticketType: "Member Ticket",
      checkedIn: false,
      checkedInAt: null,
    },
    {
      id: "p3",
      reference: "VAKU-48BA91",
      name: "Farhan Ali",
      email: "farhan@example.com",
      ticketType: "General Ticket",
      checkedIn: false,
      checkedInAt: null,
    },
  ]);

  const totalAttendees = attendees.length;
  const checkedInCount = attendees.filter((a) => a.checkedIn).length;
  const attendanceRate = Math.round((checkedInCount / totalAttendees) * 100);

  const handleCheckInSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = bookingRefInput.trim().toUpperCase();

    if (!query) return;

    const match = attendees.find((a) => a.reference === query);

    if (!match) {
      setCheckInState("NOT_FOUND");
      return;
    }

    if (match.checkedIn) {
      setLastAttendee(match);
      setCheckInState("ALREADY_CHECKED");
      return;
    }

    // Success Check-in
    const nowTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const updatedAttendee = {
      ...match,
      checkedIn: true,
      checkedInAt: nowTime,
    };

    setAttendees((prev) =>
      prev.map((a) => (a.id === match.id ? updatedAttendee : a))
    );

    setLastAttendee(updatedAttendee);
    setCheckInState("SUCCESS");
    setBookingRefInput("");
  };

  const handleUndo = (attendeeId: string) => {
    setAttendees((prev) =>
      prev.map((a) =>
        a.id === attendeeId ? { ...a, checkedIn: false, checkedInAt: null } : a
      )
    );
    setCheckInState("IDLE");
  };

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto">
      {/* Header & Event Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-black text-white tracking-tight">
            Event Check-in Station
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Scan attendee digital passes or look up booking references.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 font-display font-bold uppercase">
            Active Event:
          </span>
          <select
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-white focus:outline-none focus:border-blue"
          >
            <option value="sunset-social">Sunset Social (Sep 27)</option>
            <option value="food-walk">Food Walk (Oct 4)</option>
            <option value="game-night">Game Night (Oct 11)</option>
            <option value="clay-chai">Clay & Chai (Oct 18)</option>
          </select>
        </div>
      </div>

      {/* Progress & Live Stats Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-display font-bold uppercase tracking-wider text-slate-400">
              Live Attendance
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-display text-3xl font-black text-white">
                {checkedInCount}
              </span>
              <span className="text-slate-400 text-sm">
                / {totalAttendees} Attendees
              </span>
            </div>
          </div>
          <span className="font-display text-2xl font-black text-emerald-400">
            {attendanceRate}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden border border-slate-800">
          <div
            className="bg-emerald-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${attendanceRate}%` }}
          />
        </div>
      </div>

      {/* Scanner & Manual Search Input */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 5 Cols: QR Verification Station */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col items-center text-center">
            {/* Camera / Visual Scanner Box */}
            <div className="w-full h-44 rounded-2xl bg-slate-950 border-2 border-dashed border-slate-800 flex flex-col items-center justify-center p-4 relative overflow-hidden group">
              <Camera size={36} className="text-slate-600 mb-2 group-hover:text-blue transition-colors" />
              <p className="text-xs text-slate-400 font-display font-bold">
                Camera QR Scanner Active
              </p>
              <span className="text-[10px] text-slate-600 mt-1">
                Point guest pass QR directly at camera
              </span>
              <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 h-0.5 bg-blue/50 animate-pulse" />
            </div>

            {/* Manual Search Form */}
            <form onSubmit={handleCheckInSubmit} className="w-full mt-4 flex flex-col gap-2">
              <div className="relative">
                <input
                  type="text"
                  value={bookingRefInput}
                  onChange={(e) => setBookingRefInput(e.target.value)}
                  placeholder="Enter Booking ID (e.g. VAKU-2D91EE)"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono uppercase tracking-widest text-white focus:outline-none focus:border-blue placeholder:normal-case placeholder:tracking-normal"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-blue text-white font-display text-xs font-bold uppercase tracking-wider hover:bg-blue/90 transition-all shadow-md shadow-blue/20"
              >
                Verify & Check In
              </button>
            </form>

            {/* Verification Feedback Alerts */}
            {checkInState === "SUCCESS" && lastAttendee && (
              <div className="w-full mt-4 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-left">
                <div className="flex items-center gap-2 text-emerald-400 font-display font-bold text-sm mb-1">
                  <CheckCircle2 size={18} /> You&apos;re on the list.
                </div>
                <p className="text-xs font-bold text-white">
                  {lastAttendee.name}
                </p>
                <p className="text-[11px] text-slate-400">
                  {lastAttendee.ticketType} • {lastAttendee.reference}
                </p>
                <button
                  onClick={() => handleUndo(lastAttendee.id)}
                  className="inline-flex items-center gap-1 text-[10px] text-slate-400 hover:text-white mt-2 font-bold"
                >
                  <RotateCcw size={12} /> Undo Check-in
                </button>
              </div>
            )}

            {checkInState === "ALREADY_CHECKED" && lastAttendee && (
              <div className="w-full mt-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-left">
                <div className="flex items-center gap-2 text-amber-400 font-display font-bold text-sm mb-1">
                  <AlertTriangle size={18} /> Already checked in.
                </div>
                <p className="text-xs text-slate-300">
                  <b>{lastAttendee.name}</b> was checked in at{" "}
                  <b>{lastAttendee.checkedInAt}</b>.
                </p>
              </div>
            )}

            {checkInState === "NOT_FOUND" && (
              <div className="w-full mt-4 p-4 rounded-2xl bg-pink/10 border border-pink/20 text-left">
                <div className="text-pink font-display font-bold text-sm mb-1">
                  Hmm, we couldn&apos;t find that ticket.
                </div>
                <p className="text-xs text-slate-300">
                  Please verify the reference code or confirm the guest is booked for this specific event.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right 7 Cols: Attendee Roster */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
            <h3 className="font-display text-lg font-bold text-white mb-4">
              Guest Roster for This Event
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-display uppercase tracking-wider">
                    <th className="pb-3">Name</th>
                    <th className="pb-3">Reference</th>
                    <th className="pb-3">Ticket</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-body">
                  {attendees.map((att) => (
                    <tr key={att.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 font-semibold text-white">
                        {att.name}
                        <span className="block text-[10px] text-slate-500 font-normal">
                          {att.email}
                        </span>
                      </td>
                      <td className="py-3 font-mono text-slate-300">
                        {att.reference}
                      </td>
                      <td className="py-3 text-slate-300">
                        {att.ticketType}
                      </td>
                      <td className="py-3">
                        {att.checkedIn ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            In ({att.checkedInAt})
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-400">
                            Not Arrived
                          </span>
                        )}
                      </td>
                      <td className="py-3 text-right">
                        {att.checkedIn ? (
                          <button
                            onClick={() => handleUndo(att.id)}
                            className="text-[11px] text-slate-400 hover:text-pink"
                          >
                            Undo
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setBookingRefInput(att.reference);
                              setTimeout(() => handleCheckInSubmit(), 50);
                            }}
                            className="px-3 py-1 rounded-lg bg-blue/20 text-blue font-bold hover:bg-blue hover:text-white"
                          >
                            Check In
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
