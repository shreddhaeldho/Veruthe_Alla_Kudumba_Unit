"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { MessageSquare, Check, X, EyeOff } from "lucide-react";
import StarRating from "@/components/ui/star-rating";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    fetchReviews();
  }, [supabase]);

  const fetchReviews = async () => {
    setLoading(true);

    const { data } = await supabase
      .from("event_reviews")
      .select(`
        *,
        events(title),
        profiles(full_name, email)
      `)
      .order("created_at", { ascending: false });

    if (data && data.length > 0) {
      setReviews(data);
    } else {
      setReviews([
        {
          id: "r1",
          rating: 5,
          review: "Best evening of the month! Made 4 new friends over sunset mocktails.",
          status: "PENDING",
          created_at: new Date().toISOString(),
          events: { title: "Sunset Social" },
          profiles: { full_name: "Sneha Roy", email: "sneha@example.com" },
        },
        {
          id: "r2",
          rating: 4,
          review: "Great food and awesome walk through Fort Kochi.",
          status: "APPROVED",
          created_at: new Date().toISOString(),
          events: { title: "Food Walk" },
          profiles: { full_name: "Vikram Das", email: "vikram@example.com" },
        },
      ]);
    }
    setLoading(false);
  };

  const updateReviewStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from("event_reviews")
      .update({ status })
      .eq("id", id);

    if (!error) {
      fetchReviews();
    }
  };

  const filtered = reviews.filter((r) => filter === "ALL" || r.status === filter);

  return (
    <div className="flex flex-col gap-6 text-slate-100">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-black text-white tracking-tight">
            Review Moderation
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Approve, hide, or reject user event reviews before public display.
          </p>
        </div>

        <div className="flex gap-2">
          {["ALL", "PENDING", "APPROVED", "REJECTED", "HIDDEN"].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-display font-bold uppercase tracking-wider transition-all ${
                filter === st
                  ? "bg-blue text-white"
                  : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/50 text-slate-400 font-display uppercase tracking-wider">
                <th className="p-4">User & Event</th>
                <th className="p-4">Rating</th>
                <th className="p-4">Review Text</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-body">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-white">{r.profiles?.full_name || "Community Member"}</div>
                    <div className="text-[11px] text-slate-400">{r.events?.title}</div>
                  </td>
                  <td className="p-4">
                    <StarRating value={r.rating} readonly size={14} />
                  </td>
                  <td className="p-4 max-w-sm text-slate-300">
                    &ldquo;{r.review || "No written review"}&rdquo;
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        r.status === "APPROVED"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : r.status === "PENDING"
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          : "bg-pink/10 text-pink border-pink/20"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {r.status !== "APPROVED" && (
                        <button
                          onClick={() => updateReviewStatus(r.id, "APPROVED")}
                          className="px-3 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 font-bold hover:bg-emerald-500 hover:text-white flex items-center gap-1"
                        >
                          <Check size={12} /> Approve
                        </button>
                      )}
                      {r.status !== "REJECTED" && (
                        <button
                          onClick={() => updateReviewStatus(r.id, "REJECTED")}
                          className="px-2.5 py-1.5 rounded-lg bg-pink/15 text-pink font-bold hover:bg-pink hover:text-white"
                        >
                          <X size={12} />
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
