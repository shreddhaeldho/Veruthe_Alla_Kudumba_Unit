import Link from "next/link";
import Image from "next/image";
import { SparklesIcon, CalendarIcon, PinIcon } from "@/components/ui/minimal-graphics";
import SaveEventButton from "@/components/ui/save-event-button";

interface EventRecommendationsProps {
  events: Array<{
    id: string;
    title: string;
    slug: string;
    date: string;
    location: string;
    featured_image: string | null;
  }>;
  title?: string;
}

export default function EventRecommendations({
  events,
  title = "You might be into this.",
}: EventRecommendationsProps) {
  if (!events || events.length === 0) return null;

  return (
    <section className="py-10 bg-cream">
      <div className="flex items-center gap-2 mb-6">
        <SparklesIcon size={20} className="text-pink" />
        <h3 className="font-display text-2xl font-bold text-navy">{title}</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-3xl overflow-hidden border border-navy/10 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group relative"
          >
            <div className="relative h-44 w-full overflow-hidden bg-navy/5">
              <Image
                src={event.featured_image || "/images/hero_community.jpg"}
                alt={event.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 right-3 z-10">
                <SaveEventButton eventId={event.id} />
              </div>
            </div>

            <div className="p-5 flex flex-col flex-grow justify-between">
              <div>
                <h4 className="font-display font-bold text-navy text-lg group-hover:text-pink transition-colors">
                  {event.title}
                </h4>
                <div className="flex items-center gap-3 text-xs text-navy-60 font-body mt-2">
                  <span className="flex items-center gap-1">
                    <CalendarIcon size={13} /> {event.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <PinIcon size={13} /> {event.location}
                  </span>
                </div>
              </div>

              <Link
                href={`/events/${event.slug}`}
                className="mt-4 w-full py-2.5 rounded-xl bg-navy/5 hover:bg-navy hover:text-white text-navy font-display text-xs font-bold uppercase tracking-wider text-center transition-all"
              >
                Explore Event →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
