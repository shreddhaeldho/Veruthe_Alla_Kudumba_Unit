import { createClient } from "@/lib/supabase/server";
import { NotificationType } from "@/types/database.types";

export interface NotificationItem {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  action_url: string | null;
  is_read: boolean;
  created_at: string;
}

export async function createNotification(
  userId: string,
  type: NotificationType,
  title: string,
  message: string,
  actionUrl?: string
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("notifications")
    .insert({
      user_id: userId,
      type,
      title,
      message,
      action_url: actionUrl || null,
      is_read: false,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating notification:", error);
    return null;
  }

  return data;
}

export async function getNotificationsForUser(userId: string, limit = 20): Promise<NotificationItem[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) {
    return [];
  }

  return data as NotificationItem[];
}

export async function getUnreadCount(userId: string): Promise<number> {
  const supabase = await createClient();

  const { count, error } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("is_read", false);

  if (error) {
    return 0;
  }

  return count || 0;
}
