"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  Plus,
  Search,
  Calendar,
  Copy,
  ExternalLink,
  Edit,
  XCircle,
  MoreVertical,
} from "lucide-react";

export default function AdminEventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    async function loadEvents() {
      try {
        const { data } = await supabase
          .from("events")
          .select(`
            id,
            title,
            slug,
            date,
            start_time,
            location,
            max_capacity,
            status,
            created_at,
            event_categories (name)
          `)
          .order("date", { ascending: false });

        if (data && data.length > 0) {
          setEvents(data);
        } else {
          // Demo fallback
          setEvents([
            {
              id: "e1",
              title: "Sunset Social",
              slug: "sunset-social",
              date: "2026-09-27",
              start_time: "17:00:00",
              location: "Kochi Marine Drive",
              max_capacity: 40,
              status: "PUBLISHED",
              created_at: "2026-09-01",
              category: "Social",
            },
            {
              id: "e2",
              title: "Food Walk",
              slug: "food-walk",
              date: "2026-10-04",
              start_time: "16:00:00",
              location: "Fort Kochi",
              max_capacity: 25,
              status: "PUBLISHED",
              created_at: "2026-09-02",
              category: "Food",
            },
            {
              id: "e3",
              title: "Game Night",
              slug: "game-night",
              date: "2026-10-11",
              start_time: "18:00:00",
              location: "Kochi",
              max_capacity: 30,
              status: "DRAFT",
              created_at: "2026-09-05",
              category: "Social",
            },
            {
              id: "e4",
              title: "Clay & Chai",
              slug: "clay-and-chai",
              date: "2026-10-18",
              start_time: "15:00:00",
              location: "Kochi",
              max_capacity: 20,
              status: "PUBLISHED",
              created_at: "2026-09-08",
              category: "Creative",
            },
          ]);
        }
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, [supabase]);

  const handleDuplicate = async (originalEvent: any) => {
    const copyTitle = `${originalEvent.title} (Copy)`;
    const copySlug = `${originalEvent.slug}-copy-${Math.random().toString(36).substring(2, 6)}`;

    const newEvent = {
      ...originalEvent,
      id: "copy-" + Math.random().toString(36).substring(2, 8),
      title: copyTitle,
      slug: copySlug,
      status: "DRAFT",
      created_at: new Date().toISOString(),
    };

    setEvents((prev) => [newEvent, ...prev]);
    alert(`Duplicated as "${copyTitle}". You can now edit and publish it.`);
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e))
    );
  };

  const filtered = events.filter((e) => {
    const matchSearch =
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.location?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "ALL" || e.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-black text-white tracking-tight">
            Events Management
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Create, manage, and monitor all community gatherings and workshops.
          </p>
        </div>

        <Link
          href="/admin/events/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue text-white font-display text-xs font-bold uppercase tracking-wider hover:bg-blue/90 shadow-md shadow-blue/20 transition-all self-start sm:self-auto"
        >
          <Plus size={16} /> Create Event
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events by title or location..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          {["ALL", "PUBLISHED", "DRAFT", "SOLD_OUT", "COMPLETED", "CANCELLED"].map(
            (st) => (
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
            )
          )}
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/50 text-slate-400 font-display uppercase tracking-wider">
                <th className="p-4">Event Name</th>
                <th className="p-4">Date & Time</th>
                <th className="p-4">Location</th>
                <th className="p-4">Capacity</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-body">
              {filtered.map((e) => (
                <tr key={e.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-4">
                    <div className="font-display font-bold text-white text-sm">
                      {e.title}
                    </div>
                    <span className="text-[11px] font-mono text-slate-500">
                      /{e.slug}
                    </span>
                  </td>
                  <td className="p-4 text-slate-300">
                    <div>{e.date}</div>
                    <span className="text-[11px] text-slate-500">
                      {e.start_time?.slice(0, 5) || "5:00 PM"}
                    </span>
                  </td>
                  <td className="p-4 text-slate-300 max-w-[160px] truncate">
                    {e.location}
                  </td>
                  <td className="p-4 text-slate-300">
                    <span className="font-mono">{e.max_capacity}</span> spots
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        e.status === "PUBLISHED"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : e.status === "DRAFT"
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          : e.status === "SOLD_OUT"
                          ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                          : "bg-pink/10 text-pink border-pink/20"
                      }`}
                    >
                      {e.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/events/${e.slug}`}
                        target="_blank"
                        title="View Live Public Event"
                        className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700"
                      >
                        <ExternalLink size={14} />
                      </Link>
                      <button
                        onClick={() => handleDuplicate(e)}
                        title="Duplicate Event Config"
                        className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700"
                      >
                        <Copy size={14} />
                      </button>
                      <Link
                        href={`/admin/events/${e.id}`}
                        title="Edit Event"
                        className="p-1.5 rounded-lg bg-blue/20 text-blue hover:bg-blue hover:text-white"
                      >
                        <Edit size={14} />
                      </Link>
                      {e.status !== "CANCELLED" && (
                        <button
                          onClick={() => handleStatusChange(e.id, "CANCELLED")}
                          title="Cancel Event"
                          className="p-1.5 rounded-lg bg-pink/15 text-pink hover:bg-pink hover:text-white"
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
