"use client";

import { useState, use } from "react";
import Link from "next/link";
import { ArrowLeft, Check, ExternalLink } from "lucide-react";

export default function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);

  const [title, setTitle] = useState("Sunset Social");
  const [slug, setSlug] = useState("sunset-social");
  const [status, setStatus] = useState("PUBLISHED");
  const [date, setDate] = useState("2026-09-27");
  const [location, setLocation] = useState("Kochi Marine Drive");
  const [capacity, setCapacity] = useState(40);
  const [saved, setSaved] = useState(false);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/events"
          className="inline-flex items-center gap-2 text-xs font-display font-bold uppercase tracking-wider text-slate-400 hover:text-white"
        >
          <ArrowLeft size={14} /> Back to Events
        </Link>
        <Link
          href={`/events/${slug}`}
          target="_blank"
          className="inline-flex items-center gap-2 text-xs font-display font-bold text-blue hover:underline"
        >
          <ExternalLink size={14} /> View Public Event Page
        </Link>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-800">
          <div>
            <h1 className="font-display text-2xl font-black text-white">
              Edit Event: {title}
            </h1>
            <p className="text-xs text-slate-500 font-mono">ID: {resolvedParams.id}</p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              status === "PUBLISHED"
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
            }`}
          >
            {status}
          </span>
        </div>

        {saved && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
            <Check size={16} /> Changes saved successfully!
          </div>
        )}

        <form onSubmit={handleUpdate} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-display font-bold uppercase text-slate-400 mb-1">
              Event Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-display font-bold uppercase text-slate-400 mb-1">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue"
              />
            </div>
            <div>
              <label className="block text-xs font-display font-bold uppercase text-slate-400 mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue"
              >
                <option value="DRAFT">DRAFT</option>
                <option value="PUBLISHED">PUBLISHED</option>
                <option value="SOLD_OUT">SOLD_OUT</option>
                <option value="CANCELLED">CANCELLED</option>
                <option value="COMPLETED">COMPLETED</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-display font-bold uppercase text-slate-400 mb-1">
              Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue"
            />
          </div>

          <div>
            <label className="block text-xs font-display font-bold uppercase text-slate-400 mb-1">
              Capacity
            </label>
            <input
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue text-white font-display text-xs font-bold uppercase tracking-wider hover:bg-blue/90"
            >
              Update Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
