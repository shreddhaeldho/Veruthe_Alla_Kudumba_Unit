"use client";

import { useState } from "react";
import { Search, Plus } from "lucide-react";

export default function AdminPaymentsPage() {
  const [search, setSearch] = useState("");
  const [methodFilter, setMethodFilter] = useState("ALL");

  const [payments, setPayments] = useState([
    {
      id: "pay-1",
      ref: "MAN-2026-001",
      user: "Rahul Nair",
      type: "Event Booking (Sunset Social)",
      amount: 399,
      method: "UPI",
      status: "PAID",
      date: "2026-09-13",
      recordedBy: "Admin",
    },
    {
      id: "pay-2",
      ref: "MAN-2026-002",
      user: "Diya Thomas",
      type: "Annual Membership (₹299/yr)",
      amount: 299,
      method: "Bank Transfer",
      status: "PAID",
      date: "2026-08-15",
      recordedBy: "Admin",
    },
    {
      id: "pay-3",
      ref: "MAN-2026-003",
      user: "Ananya Menon",
      type: "Event Booking (Food Walk)",
      amount: 698,
      method: "Cash",
      status: "PAID",
      date: "2026-09-12",
      recordedBy: "Event Manager",
    },
  ]);

  const filtered = payments.filter((p) => {
    const matchSearch =
      p.ref.toLowerCase().includes(search.toLowerCase()) ||
      p.user.toLowerCase().includes(search.toLowerCase());
    const matchMethod = methodFilter === "ALL" || p.method === methodFilter;
    return matchSearch && matchMethod;
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-black text-white tracking-tight">
            Manual Payments Journal
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Track all offline transactions, cash at venue, and direct UPI verifications.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search payments by ref or user..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue"
          />
        </div>

        <div className="flex items-center gap-2">
          {["ALL", "UPI", "Cash", "Bank Transfer"].map((m) => (
            <button
              key={m}
              onClick={() => setMethodFilter(m)}
              className={`px-3 py-1.5 rounded-lg text-xs font-display font-bold uppercase tracking-wider transition-all ${
                methodFilter === m
                  ? "bg-blue text-white"
                  : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/50 text-slate-400 font-display uppercase tracking-wider">
                <th className="p-4">Payment Ref</th>
                <th className="p-4">User</th>
                <th className="p-4">Description</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Method</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-body">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-4 font-mono font-bold text-white">{p.ref}</td>
                  <td className="p-4 text-slate-300 font-medium">{p.user}</td>
                  <td className="p-4 text-slate-300">{p.type}</td>
                  <td className="p-4 font-bold text-slate-100">₹{p.amount}</td>
                  <td className="p-4 text-slate-300">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-mono">
                      {p.method}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {p.status}
                    </span>
                  </td>
                  <td className="p-4 text-slate-400">{p.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
