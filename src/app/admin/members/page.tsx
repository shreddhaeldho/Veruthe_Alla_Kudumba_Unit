"use client";

import { useEffect, useState } from "react";
import { Search, ShieldCheck, Check, X, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function AdminMembersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [members, setMembers] = useState<any[]>([]);
  const [foundingCount, setFoundingCount] = useState(0);
  const maxFounding = 50;
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    fetchMembers();
  }, [supabase]);

  const fetchMembers = async () => {
    setLoading(true);

    const { data } = await supabase
      .from("memberships")
      .select(`
        *,
        profiles (full_name, email, phone),
        membership_plans (name, price, duration_months)
      `)
      .order("created_at", { ascending: false });

    if (data && data.length > 0) {
      setMembers(data);
      const activeCount = data.filter(
        (m) => m.status === "ACTIVE" || m.status === "PENDING"
      ).length;
      setFoundingCount(activeCount);
    } else {
      // Demo fallback
      setMembers([
        {
          id: "m1",
          membership_reference: "F50-7F89AB",
          user_id: "u1",
          status: "PENDING",
          payment_status: "PENDING",
          created_at: new Date().toISOString(),
          profiles: { full_name: "Gautham Krishna", email: "gautham@gmail.com", phone: "+91 94471 23456" },
          membership_plans: { name: "Founding 50 Membership", price: 199, duration_months: 6 },
        },
        {
          id: "m2",
          membership_reference: "F50-1A2B3C",
          user_id: "u2",
          status: "ACTIVE",
          payment_status: "VERIFIED",
          start_date: "2026-08-15",
          end_date: "2027-02-15",
          created_at: "2026-08-15",
          profiles: { full_name: "Diya Thomas", email: "diya@gmail.com", phone: "+91 98951 88990" },
          membership_plans: { name: "Founding 50 Membership", price: 199, duration_months: 6 },
        },
      ]);
      setFoundingCount(2);
    }
    setLoading(false);
  };

  const handleActivate = async (membershipId: string, userId: string, durationMonths = 6) => {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + durationMonths);

    const { error } = await supabase
      .from("memberships")
      .update({
        status: "ACTIVE",
        payment_status: "VERIFIED",
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
      })
      .eq("id", membershipId);

    if (error) {
      alert("Error activating membership: " + error.message);
      return;
    }

    // Create notification for user
    await supabase.from("notifications").insert({
      user_id: userId,
      type: "MEMBERSHIP_STATUS",
      title: "Welcome to the Founding 50! ✨",
      message: "Your Founding Member pass is now ACTIVE. Enjoy exclusive early access, member pricing, and partner perks!",
      action_url: "/account",
    });

    fetchMembers();
  };

  const handleReject = async (membershipId: string) => {
    const { error } = await supabase
      .from("memberships")
      .update({
        status: "CANCELLED",
        payment_status: "FAILED",
      })
      .eq("id", membershipId);

    if (!error) {
      fetchMembers();
    }
  };

  const filtered = members.filter((m) => {
    const name = m.profiles?.full_name || "";
    const email = m.profiles?.email || "";
    const ref = m.membership_reference || "";

    const matchSearch =
      name.toLowerCase().includes(search.toLowerCase()) ||
      email.toLowerCase().includes(search.toLowerCase()) ||
      ref.toLowerCase().includes(search.toLowerCase());

    const matchStatus = statusFilter === "ALL" || m.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const spotsLeft = Math.max(0, maxFounding - foundingCount);

  return (
    <div className="flex flex-col gap-6 text-slate-100">
      {/* Header & Founding 50 Tracker */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-black text-white tracking-tight">
            Founding Memberships
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Review ₹199 UPI payments and manage the Founding 50 limited membership list.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-pink text-white flex items-center justify-center font-display font-black">
            50
          </div>
          <div>
            <span className="text-[10px] font-display font-bold uppercase tracking-wider text-pink block">
              Founding 50 Cap
            </span>
            <span className="font-display font-bold text-white text-sm">
              {foundingCount} / {maxFounding} Claimed ({spotsLeft} Left)
            </span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search member name, email or ref code..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          {["ALL", "PENDING", "ACTIVE", "EXPIRED", "CANCELLED"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-display font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
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

      {/* Members Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/50 text-slate-400 font-display uppercase tracking-wider">
                <th className="p-4">Member</th>
                <th className="p-4">Reference</th>
                <th className="p-4">Plan & Price</th>
                <th className="p-4">Validity</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-body">
              {filtered.map((m) => (
                <tr key={m.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-4">
                    <div className="font-semibold text-white">{m.profiles?.full_name || "Applicant"}</div>
                    <div className="text-[11px] text-slate-400">{m.profiles?.email} • {m.profiles?.phone}</div>
                  </td>
                  <td className="p-4 font-mono font-bold text-pink">
                    {m.membership_reference || "F50-XXXXXX"}
                  </td>
                  <td className="p-4 text-slate-300">
                    <div>{m.membership_plans?.name || "Founding 50"}</div>
                    <div className="text-[11px] text-slate-500">₹{m.membership_plans?.price || 199} • {m.membership_plans?.duration_months || 6} mo</div>
                  </td>
                  <td className="p-4 text-slate-300">
                    {m.start_date ? (
                      <div>
                        {new Date(m.start_date).toLocaleDateString()} <span className="text-slate-500">to</span> {new Date(m.end_date).toLocaleDateString()}
                      </div>
                    ) : (
                      <span className="text-slate-500">Not activated</span>
                    )}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        m.status === "ACTIVE"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : m.status === "PENDING"
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse"
                          : m.status === "EXPIRED"
                          ? "bg-slate-800 text-slate-400 border-slate-700"
                          : "bg-pink/10 text-pink border-pink/20"
                      }`}
                    >
                      {m.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {m.status === "PENDING" ? (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleActivate(m.id, m.user_id, m.membership_plans?.duration_months || 6)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 font-bold hover:bg-emerald-500 hover:text-white flex items-center gap-1 transition-all"
                        >
                          <Check size={12} /> Verify & Activate
                        </button>
                        <button
                          onClick={() => handleReject(m.id)}
                          className="px-2.5 py-1.5 rounded-lg bg-pink/15 text-pink font-bold hover:bg-pink hover:text-white transition-all"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ) : (
                      <span className="text-slate-500 text-[11px]">Processed</span>
                    )}
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
