"use client";

import { useState } from "react";
import { Search, MapPin, Tag } from "lucide-react";

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [memberFilter, setMemberFilter] = useState("ALL");

  const [users, setUsers] = useState([
    {
      id: "u1",
      name: "Rahul Nair",
      email: "rahul@example.com",
      phone: "+91 98765 11223",
      location: "Kochi",
      membershipStatus: "ACTIVE",
      totalBookings: 3,
      interests: ["Social", "Food", "Workshops"],
      joinedAt: "2026-08-10",
    },
    {
      id: "u2",
      name: "Ananya Menon",
      email: "ananya@example.com",
      phone: "+91 94471 88990",
      location: "Fort Kochi",
      membershipStatus: "NON_MEMBER",
      totalBookings: 1,
      interests: ["Creative", "Art", "Travel"],
      joinedAt: "2026-09-01",
    },
    {
      id: "u3",
      name: "Farhan Ali",
      email: "farhan@example.com",
      phone: "+91 91234 56789",
      location: "Kochi",
      membershipStatus: "NON_MEMBER",
      totalBookings: 2,
      interests: ["Sports", "Games"],
      joinedAt: "2026-09-05",
    },
    {
      id: "u4",
      name: "Diya Thomas",
      email: "diya@gmail.com",
      phone: "+91 98951 88990",
      location: "Kadavanthra",
      membershipStatus: "ACTIVE",
      totalBookings: 4,
      interests: ["Music", "Social", "Photography"],
      joinedAt: "2026-08-15",
    },
  ]);

  const filtered = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.location.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      memberFilter === "ALL" ||
      (memberFilter === "MEMBERS" && u.membershipStatus === "ACTIVE") ||
      (memberFilter === "NON_MEMBERS" && u.membershipStatus === "NON_MEMBER");
    return matchSearch && matchStatus;
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl font-black text-white tracking-tight">
          Users Directory
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Registered community accounts, interest profiles, and activity history.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users by name, email, or location..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue"
          />
        </div>

        <div className="flex items-center gap-2">
          {["ALL", "MEMBERS", "NON_MEMBERS"].map((mf) => (
            <button
              key={mf}
              onClick={() => setMemberFilter(mf)}
              className={`px-3 py-1.5 rounded-lg text-xs font-display font-bold uppercase tracking-wider transition-all ${
                memberFilter === mf
                  ? "bg-blue text-white"
                  : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              {mf.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/50 text-slate-400 font-display uppercase tracking-wider">
                <th className="p-4">User</th>
                <th className="p-4">Location</th>
                <th className="p-4">Membership</th>
                <th className="p-4">Bookings</th>
                <th className="p-4">Interests</th>
                <th className="p-4">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-body">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-4">
                    <div className="font-semibold text-white">{u.name}</div>
                    <div className="text-[11px] text-slate-500">{u.email} • {u.phone}</div>
                  </td>
                  <td className="p-4 text-slate-300">
                    <span className="flex items-center gap-1">
                      <MapPin size={12} className="text-slate-500" /> {u.location}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        u.membershipStatus === "ACTIVE"
                          ? "bg-pink/10 text-pink border-pink/20"
                          : "bg-slate-800 text-slate-400 border-slate-700"
                      }`}
                    >
                      {u.membershipStatus === "ACTIVE" ? "Member (₹299)" : "Guest"}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-slate-200">
                    {u.totalBookings} events
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {u.interests.map((it) => (
                        <span
                          key={it}
                          className="px-2 py-0.5 rounded bg-slate-950 text-[10px] text-slate-400 border border-slate-800"
                        >
                          {it}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 text-slate-400">{u.joinedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
