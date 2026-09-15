"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Bell, Sparkles, Send, Check } from "lucide-react";

export default function AdminNotificationsPage() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    content: "",
    type: "COMMUNITY_UPDATE",
    action_url: "",
    action_text: "",
  });

  const supabase = createClient();

  useEffect(() => {
    fetchAnnouncements();
  }, [supabase]);

  const fetchAnnouncements = async () => {
    const { data } = await supabase
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setAnnouncements(data);
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMsg(null);

    const { error } = await supabase.from("announcements").insert({
      title: form.title.trim(),
      content: form.content.trim(),
      type: form.type,
      action_url: form.action_url.trim() || null,
      action_text: form.action_text.trim() || null,
      is_published: true,
      published_at: new Date().toISOString(),
    });

    if (error) {
      setMsg("Error publishing announcement: " + error.message);
    } else {
      setMsg("Announcement published to public feed! ✨");
      setForm({
        title: "",
        content: "",
        type: "COMMUNITY_UPDATE",
        action_url: "",
        action_text: "",
      });
      fetchAnnouncements();
    }
    setSubmitting(false);
  };

  return (
    <div className="flex flex-col gap-8 text-slate-100 max-w-4xl">
      <div>
        <h1 className="font-display text-3xl font-black text-white tracking-tight">
          Announcements & Notifications HQ
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Publish public community feed updates and broadcast announcements.
        </p>
      </div>

      {msg && (
        <div className="p-4 rounded-xl bg-pink/15 border border-pink/30 text-pink text-xs font-bold">
          {msg}
        </div>
      )}

      {/* Create Announcement Form */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
        <h3 className="font-display font-bold text-white text-lg mb-4 flex items-center gap-2">
          <Sparkles size={20} className="text-pink" /> Publish New Announcement
        </h3>

        <form onSubmit={handlePublish} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-display font-bold uppercase text-slate-400 mb-1">
                Announcement Title *
              </label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Founding 50 Membership is Open!"
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-body text-white focus:outline-none focus:border-blue"
              />
            </div>

            <div>
              <label className="block text-xs font-display font-bold uppercase text-slate-400 mb-1">
                Category Type *
              </label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-body text-white focus:outline-none focus:border-blue"
              >
                <option value="COMMUNITY_UPDATE">Community Update</option>
                <option value="NEW_EVENT">New Event Alert</option>
                <option value="PARTNER_SPOTLIGHT">Partner Spotlight</option>
                <option value="EVENT_RECAP">Event Recap</option>
                <option value="MEMBERSHIP_UPDATE">Membership Update</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-display font-bold uppercase text-slate-400 mb-1">
              Content Body *
            </label>
            <textarea
              rows={4}
              required
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="Write the full announcement message..."
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-body text-white focus:outline-none focus:border-blue"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-display font-bold uppercase text-slate-400 mb-1">
                Action URL (optional)
              </label>
              <input
                type="text"
                value={form.action_url}
                onChange={(e) => setForm({ ...form, action_url: e.target.value })}
                placeholder="/membership or /events"
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-body text-white focus:outline-none focus:border-blue"
              />
            </div>

            <div>
              <label className="block text-xs font-display font-bold uppercase text-slate-400 mb-1">
                Button Label (optional)
              </label>
              <input
                type="text"
                value={form.action_text}
                onChange={(e) => setForm({ ...form, action_text: e.target.value })}
                placeholder="Join Founding 50"
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-body text-white focus:outline-none focus:border-blue"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 rounded-xl bg-pink hover:bg-pink/90 text-white font-display text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all mt-2"
          >
            <Send size={16} /> Publish Announcement
          </button>
        </form>
      </div>

      {/* Published List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h3 className="font-display font-bold text-white text-base mb-4">Published Announcements</h3>
        <div className="flex flex-col gap-3">
          {announcements.map((a) => (
            <div key={a.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-start">
              <div>
                <span className="text-[10px] font-display font-bold text-pink uppercase tracking-wider block mb-1">
                  {a.type}
                </span>
                <h4 className="font-display font-bold text-white text-sm">{a.title}</h4>
                <p className="text-xs text-slate-400 font-body mt-1">{a.content}</p>
              </div>
              <span className="text-[10px] text-slate-500">{new Date(a.published_at || a.created_at).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
