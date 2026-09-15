import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { SparklesIcon, ArrowRightIcon } from "@/components/ui/minimal-graphics";

export const revalidate = 60;

export default async function AnnouncementsPage() {
  const supabase = await createClient();

  const { data: announcements } = await supabase
    .from("announcements")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  const feed = announcements || [
    {
      id: "a1",
      title: "Founding 50 Membership is Officially Live!",
      content: "We are thrilled to open applications for the first 50 visionaries of Veruthe Alla Kudumba Unit. As a Founding Member, you get first dibs on all events, discounted ticket prices, member-only experiences, and special perks across Kochi.",
      type: "MEMBERSHIP_UPDATE",
      published_at: "2026-09-14T10:00:00Z",
      action_url: "/membership",
      action_text: "Join Founding 50",
    }
  ];

  return (
    <div className="min-h-screen bg-cream text-navy py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink/15 text-pink font-display text-xs font-bold uppercase tracking-wider mb-4">
            <SparklesIcon size={14} /> Community Feed
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-black text-navy tracking-tight mb-3">
            Circle Announcements
          </h1>
          <p className="text-navy-60 font-body text-base max-w-lg mx-auto">
            Stay updated on new events, partner drops, community recaps, and member updates.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          {feed.map((item) => (
            <article
              key={item.id}
              className="bg-white rounded-3xl p-8 border border-navy/10 shadow-sm hover:shadow-md transition-all flex flex-col gap-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-display font-bold uppercase tracking-widest text-pink bg-pink/10 px-3 py-1 rounded-full">
                  {item.type?.replace("_", " ")}
                </span>
                <span className="text-xs text-navy-40 font-body">
                  {new Date(item.published_at || item.created_at).toLocaleDateString()}
                </span>
              </div>

              <h2 className="font-display text-2xl font-bold text-navy">
                {item.title}
              </h2>

              <p className="text-sm font-body text-navy-80 leading-relaxed whitespace-pre-line">
                {item.content}
              </p>

              {item.action_url && (
                <div className="pt-2">
                  <Link
                    href={item.action_url}
                    className="inline-flex items-center gap-2 text-xs font-display font-bold text-navy hover:text-pink uppercase tracking-wider transition-colors"
                  >
                    {item.action_text || "Read More"} <ArrowRightIcon size={14} />
                  </Link>
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
