import { createClient } from "@/lib/supabase/server";

export interface RecommendedEvent {
  id: string;
  title: string;
  slug: string;
  date: string;
  location: string;
  featured_image: string | null;
  status: string;
  is_members_only?: boolean;
}

export async function getRecommendationsForUser(userId?: string, limit = 3): Promise<RecommendedEvent[]> {
  const supabase = await createClient();

  // Fetch published upcoming events
  const { data: events, error } = await supabase
    .from("events")
    .select("id, title, slug, date, location, featured_image, status, is_members_only")
    .eq("status", "PUBLISHED")
    .order("date", { ascending: true })
    .limit(limit);

  if (error || !events) {
    return [];
  }

  return events as RecommendedEvent[];
}
