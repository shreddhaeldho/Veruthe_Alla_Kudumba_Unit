"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { CalendarIcon, PinIcon } from "@/components/ui/minimal-graphics";

const CATEGORIES = ["All", "Social", "Food", "Sports", "Creative", "Workshops", "Experiences"];

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    async function loadEvents() {
      const { data, error } = await supabase
        .from("events")
        .select(`
          id,
          title,
          slug,
          description,
          date,
          start_time,
          end_time,
          location,
          featured_image,
          event_categories (
            name,
            slug
          ),
          ticket_types (
            name,
            price,
            member_price,
            capacity,
            sold_count
          )
        `)
        .eq("status", "PUBLISHED")
        .order("date", { ascending: true });

      if (data && data.length > 0) {
        setEvents(data);
      } else {
        // Fallback demo events matching Phase 1 in case Supabase doesn't have events seeded yet
        setEvents([
          {
            id: "1",
            title: "Sunset Social",
            slug: "sunset-social",
            description: "A relaxed evening with music, drinks, and good conversations as the sun sets over Kochi.",
            date: "2026-09-27",
            start_time: "17:00:00",
            end_time: "20:00:00",
            location: "Kochi",
            featured_image: "/images/sunset_social.jpg",
            category: "Social",
            price: 499,
            member_price: 399,
          },
          {
            id: "2",
            title: "Food Walk",
            slug: "food-walk",
            description: "Explore the hidden culinary gems and street food stories of Fort Kochi.",
            date: "2026-10-04",
            start_time: "16:00:00",
            end_time: "19:00:00",
            location: "Fort Kochi",
            featured_image: "/images/food_walk.jpg",
            category: "Food",
            price: 349,
            member_price: 249,
          },
          {
            id: "3",
            title: "Game Night",
            slug: "game-night",
            description: "Board games, card battles, and friendly competitions with fun people.",
            date: "2026-10-11",
            start_time: "18:00:00",
            end_time: "21:00:00",
            location: "Kochi",
            featured_image: "/images/game_night.jpg",
            category: "Social",
            price: 299,
            member_price: 199,
          },
          {
            id: "4",
            title: "Clay & Chai",
            slug: "clay-and-chai",
            description: "Get your hands messy with pottery while sipping warm spiced chai.",
            date: "2026-10-18",
            start_time: "15:00:00",
            end_time: "18:00:00",
            location: "Kochi",
            featured_image: "/images/clay_workshop.jpg",
            category: "Creative",
            price: 599,
            member_price: 499,
          },
        ]);
      }
      setLoading(false);
    }

    loadEvents();
  }, [supabase]);

  const filteredEvents = events.filter((event) => {
    const eventCategory = event.event_categories?.name || event.category || "Social";
    const matchesCategory = selectedCategory === "All" || eventCategory.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          event.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-[1280px] mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="inline-block px-4 py-1.5 rounded-full bg-blue/10 text-blue font-display text-xs font-bold uppercase tracking-wider mb-4">
          Discover
        </span>
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-black text-navy tracking-tight leading-tight">
          Explore Events.
        </h1>
        <p className="text-navy-60 text-base sm:text-lg mt-3 font-body mb-12">
          Pick something. Text your friends. Or just show up.
        </p>

        <div className="text-center py-20 bg-white rounded-3xl border border-navy/5 shadow-sm max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-pink/10 text-pink mb-6">
            <CalendarIcon size={32} />
          </div>
          <h2 className="font-display text-3xl font-bold text-navy mb-4">
            To be announced soon
          </h2>
          <p className="text-navy-60 font-body text-lg">
            We are curating some amazing experiences for you. Stay tuned!
          </p>
        </div>
      </div>
    </div>
  );
}
