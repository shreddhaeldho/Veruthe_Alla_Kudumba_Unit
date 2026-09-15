"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Camera, Plus, Trash2, ArrowLeft, Eye, EyeOff } from "lucide-react";

export default function AdminEventGalleryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const eventId = resolvedParams.id;

  const [event, setEvent] = useState<any>(null);
  const [gallery, setGallery] = useState<any[]>([]);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newCaption, setNewCaption] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, [eventId, supabase]);

  const fetchData = async () => {
    setLoading(true);

    const { data: ev } = await supabase
      .from("events")
      .select("id, title")
      .eq("id", eventId)
      .single();

    if (ev) setEvent(ev);

    const { data: gal } = await supabase
      .from("event_gallery")
      .select("*")
      .eq("event_id", eventId)
      .order("display_order", { ascending: true });

    if (gal) setGallery(gal);
    setLoading(false);
  };

  const handleAddPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImageUrl.trim()) return;

    setSubmitting(true);

    const { error } = await supabase.from("event_gallery").insert({
      event_id: eventId,
      image_url: newImageUrl.trim(),
      caption: newCaption.trim() || null,
      display_order: gallery.length + 1,
      is_published: true,
    });

    if (!error) {
      setNewImageUrl("");
      setNewCaption("");
      fetchData();
    }
    setSubmitting(false);
  };

  const togglePublish = async (id: string, current: boolean) => {
    await supabase.from("event_gallery").update({ is_published: !current }).eq("id", id);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this photo from the gallery?")) return;
    await supabase.from("event_gallery").delete().eq("id", id);
    fetchData();
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="font-display font-bold text-slate-400 animate-pulse">Loading gallery manager...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 text-slate-100 max-w-4xl">
      <Link
        href="/admin/events"
        className="inline-flex items-center gap-2 text-xs font-display font-bold text-slate-400 hover:text-white uppercase tracking-wider"
      >
        <ArrowLeft size={14} /> Back to Events
      </Link>

      <div>
        <h1 className="font-display text-3xl font-black text-white tracking-tight">
          Event Gallery Manager
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Add and manage photos for <strong className="text-white">{event?.title || "Event"}</strong>.
        </p>
      </div>

      {/* Add Photo Form */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h3 className="font-display font-bold text-white text-base mb-4 flex items-center gap-2">
          <Camera size={18} className="text-pink" /> Add Photo to Gallery
        </h3>

        <form onSubmit={handleAddPhoto} className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            required
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            placeholder="Image URL (e.g., https://.../photo.jpg)"
            className="flex-1 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-body text-white placeholder-slate-500 focus:outline-none focus:border-blue"
          />
          <input
            type="text"
            value={newCaption}
            onChange={(e) => setNewCaption(e.target.value)}
            placeholder="Caption (optional)"
            className="flex-1 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-body text-white placeholder-slate-500 focus:outline-none focus:border-blue"
          />
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-3 rounded-xl bg-blue hover:bg-blue/90 text-white font-display text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all"
          >
            <Plus size={16} /> Add Photo
          </button>
        </form>
      </div>

      {/* Photos Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {gallery.map((img) => (
          <div key={img.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden group relative">
            <div className="relative h-44 w-full bg-slate-950">
              <img src={img.image_url} alt={img.caption || "Gallery photo"} className="w-full h-full object-cover" />
              <div className="absolute top-2 right-2 flex items-center gap-2">
                <button
                  onClick={() => togglePublish(img.id, img.is_published)}
                  className={`p-2 rounded-lg backdrop-blur-md transition-all ${
                    img.is_published ? "bg-emerald-500/80 text-white" : "bg-slate-800/80 text-slate-400"
                  }`}
                  title={img.is_published ? "Unpublish" : "Publish"}
                >
                  {img.is_published ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
                <button
                  onClick={() => handleDelete(img.id)}
                  className="p-2 rounded-lg bg-pink/80 text-white backdrop-blur-md hover:bg-pink transition-all"
                  title="Delete photo"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            {img.caption && (
              <div className="p-3 text-xs text-slate-300 font-body border-t border-slate-800">
                {img.caption}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
