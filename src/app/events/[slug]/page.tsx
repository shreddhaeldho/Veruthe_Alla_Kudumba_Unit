"use client";

import { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  CalendarIcon,
  PinIcon,
  TicketIcon,
  UsersIcon,
  ArrowRightIcon,
  SparklesIcon,
} from "@/components/ui/minimal-graphics";
import SaveEventButton from "@/components/ui/save-event-button";
import StarRating from "@/components/ui/star-rating";
import EventGallery from "@/components/ui/event-gallery";

export default function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const [event, setEvent] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    async function loadEventDetails() {
      const { data: { user } } = await supabase.auth.getUser();

      const { data } = await supabase
        .from("events")
        .select(`
          *,
          event_categories (name),
          ticket_types (*),
          event_faqs (*)
        `)
        .eq("slug", resolvedParams.slug)
        .single();

      if (data) {
        setEvent(data);

        // Fetch approved reviews
        const { data: revData } = await supabase
          .from("event_reviews")
          .select("*, profiles(full_name, avatar_url)")
          .eq("event_id", data.id)
          .eq("status", "APPROVED")
          .order("created_at", { ascending: false });

        if (revData) setReviews(revData);

        // Fetch published gallery images
        const { data: galData } = await supabase
          .from("event_gallery")
          .select("*")
          .eq("event_id", data.id)
          .eq("is_published", true)
          .order("display_order", { ascending: true });

        if (galData) setGallery(galData);

        // Check if user saved this event
        if (user) {
          const { data: savedData } = await supabase
            .from("saved_events")
            .select("id")
            .eq("user_id", user.id)
            .eq("event_id", data.id)
            .maybeSingle();

          if (savedData) setIsSaved(true);
        }
      } else {
        // Fallback demo object
        setEvent({
          id: "1",
          title: "Sunset Social",
          slug: "sunset-social",
          description:
            "A relaxed evening with music, drinks, and good conversations as the sun sets over Kochi. Come alone, bring your friends, or leave with a brand new circle.",
          date: "2026-09-27",
          start_time: "17:00:00",
          end_time: "20:00:00",
          location: "Kochi Marine Drive",
          featured_image: "/images/sunset_social.jpg",
          max_capacity: 40,
          category: "Social",
          ticket_types: [
            {
              id: "t1",
              name: "General Ticket",
              price: 499,
              member_price: 399,
              capacity: 40,
              sold_count: 28,
            },
          ],
          event_faqs: [
            {
              question: "Can I come alone?",
              answer: "Absolutely! More than 60% of our attendees come by themselves. It's the best way to make new friends.",
            },
            {
              question: "What should I wear?",
              answer: "Casual, comfortable sunset vibes. Nothing formal!",
            },
          ],
        });
      }
      setLoading(false);
    }

    loadEventDetails();
  }, [resolvedParams.slug, supabase]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-cream">
        <p className="font-display font-bold text-navy-40 animate-pulse">
          Loading event details...
        </p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-md mx-auto py-24 text-center">
        <h2 className="font-display text-3xl font-bold text-navy mb-4">
          Event Not Found
        </h2>
        <Link href="/events" className="text-pink font-bold text-sm">
          ← Back to All Events
        </Link>
      </div>
    );
  }

  const primaryTicket = event.ticket_types?.[0] || {
    name: "General Ticket",
    price: 499,
    member_price: 399,
    capacity: 40,
    sold_count: 28,
  };

  const availableSpots = (primaryTicket.capacity || 40) - (primaryTicket.sold_count || 0);

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="max-w-[1100px] mx-auto px-4 py-12 text-navy">
      <Link
        href="/events"
        className="text-xs font-display font-bold text-navy-40 hover:text-navy uppercase tracking-wider block mb-6"
      >
        ← Back to Events
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main Left Details */}
        <div className="lg:col-span-8 flex flex-col gap-10">
          <div className="relative h-[340px] sm:h-[440px] rounded-3xl overflow-hidden shadow-md">
            <Image
              src={event.featured_image || "/images/sunset_social.jpg"}
              alt={event.title}
              fill
              className="object-cover"
              priority
            />
            <span className="absolute top-4 left-4 bg-navy text-cream text-xs font-display font-bold uppercase px-4 py-1.5 rounded-full z-10">
              {event.event_categories?.name || event.category || "Social"}
            </span>

            <div className="absolute top-4 right-4 z-10">
              <SaveEventButton eventId={event.id} initialSaved={isSaved} />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="font-display text-4xl sm:text-5xl font-black text-navy tracking-tight">
                {event.title}
              </h1>
              {avgRating && (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 rounded-full border border-amber-200">
                  <StarRating value={Number(avgRating)} readonly size={14} />
                  <span className="font-display font-bold text-xs text-amber-900">{avgRating}</span>
                </div>
              )}
            </div>
            <p className="text-navy-80 text-base sm:text-lg leading-relaxed font-body">
              {event.description}
            </p>
          </div>

          {/* Gallery Section */}
          {gallery.length > 0 && (
            <EventGallery images={gallery} />
          )}

          {/* Schedule & What to expect */}
          <div className="bg-white rounded-3xl p-8 border border-navy/5 shadow-sm">
            <h3 className="font-display text-2xl font-bold text-navy mb-6">
              What to Expect
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex flex-col gap-2">
                <span className="font-display font-bold text-pink text-sm uppercase tracking-wider">
                  01. Arrive
                </span>
                <p className="text-xs text-navy-60 font-body leading-relaxed">
                  Grab a refreshing drink and introduce yourself to the hosts and guests.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <span className="font-display font-bold text-peach text-sm uppercase tracking-wider">
                  02. Connect
                </span>
                <p className="text-xs text-navy-60 font-body leading-relaxed">
                  Engage in casual group games, music, and sunset appreciation.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <span className="font-display font-bold text-blue text-sm uppercase tracking-wider">
                  03. Make Memories
                </span>
                <p className="text-xs text-navy-60 font-body leading-relaxed">
                  Leave with new memories, shared stories, and brand new contacts.
                </p>
              </div>
            </div>
          </div>

          {/* Approved Reviews Section */}
          {reviews.length > 0 && (
            <div className="bg-white rounded-3xl p-8 border border-navy/5 shadow-sm">
              <h3 className="font-display text-2xl font-bold text-navy mb-6">
                Community Reviews
              </h3>
              <div className="flex flex-col gap-4">
                {reviews.map((r) => (
                  <div key={r.id} className="p-5 rounded-2xl bg-cream/40 border border-navy/5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-display font-bold text-navy text-sm">
                        {r.profiles?.full_name || "Community Member"}
                      </span>
                      <StarRating value={r.rating} readonly size={16} />
                    </div>
                    {r.review && (
                      <p className="text-xs text-navy-80 font-body leading-relaxed">
                        &ldquo;{r.review}&rdquo;
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FAQs */}
          {event.event_faqs && event.event_faqs.length > 0 && (
            <div>
              <h3 className="font-display text-2xl font-bold text-navy mb-6">
                Frequently Asked Questions
              </h3>
              <div className="flex flex-col gap-4">
                {event.event_faqs.map((faq: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-6 rounded-2xl bg-white border border-navy/5 shadow-sm"
                  >
                    <h4 className="font-display font-bold text-navy text-base mb-2">
                      {faq.question}
                    </h4>
                    <p className="text-xs text-navy-60 leading-relaxed font-body">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sticky Booking Card */}
        <div className="lg:col-span-4">
          <div className="sticky top-28 bg-white rounded-3xl p-6 sm:p-8 border border-navy/10 shadow-xl flex flex-col gap-6">
            <div>
              <span className="text-[10px] font-display font-black tracking-widest text-navy-40 uppercase block mb-1">
                Ticket Availability
              </span>
              <div className="flex items-center gap-2">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                <span className="font-display font-bold text-sm text-navy">
                  {availableSpots > 5 ? `${availableSpots} spots left` : `Only ${availableSpots} spots left!`}
                </span>
              </div>
            </div>

            <div className="border-t border-navy/5 pt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-navy-60 font-body">Regular price</span>
                <span className="font-display font-bold text-navy text-base">
                  ₹{primaryTicket.price}
                </span>
              </div>
              <div className="flex items-center justify-between text-pink">
                <span className="text-xs font-semibold">Member price</span>
                <span className="font-display font-bold text-base">
                  ₹{primaryTicket.member_price}
                </span>
              </div>
            </div>

            <div className="p-4 bg-cream rounded-2xl border border-navy/5 text-xs text-navy-60">
              <p>
                Founding members get ₹{primaryTicket.price - primaryTicket.member_price} off this ticket automatically at checkout.
              </p>
            </div>

            <div className="flex flex-col gap-3 text-xs text-navy-80 font-medium">
              <div className="flex items-center gap-2">
                <CalendarIcon size={14} className="text-pink flex-shrink-0" />
                <span>{event.date} • {event.start_time?.slice(0, 5)} – {event.end_time?.slice(0, 5)}</span>
              </div>
              <div className="flex items-center gap-2">
                <PinIcon size={14} className="text-blue flex-shrink-0" />
                <span>{event.location}</span>
              </div>
            </div>

            <Link
              href={`/events/${event.slug}/book`}
              className="w-full py-4 rounded-full bg-navy text-cream font-display text-sm font-bold uppercase tracking-wider text-center hover:bg-blue hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              Book Your Spot →
            </Link>

            <p className="text-[11px] text-center text-navy-40 font-body">
              Instant spot confirmation. No online payment needed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
