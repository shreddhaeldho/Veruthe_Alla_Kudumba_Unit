import { createClient } from "@/lib/supabase/server";

export async function getOrCreateReferralCode(userId: string): Promise<string> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("referral_codes")
    .select("code")
    .eq("user_id", userId)
    .maybeSingle();

  if (data) return data.code;

  const code = "VAKU-" + userId.substring(0, 6).toUpperCase();
  await supabase.from("referral_codes").insert({
    user_id: userId,
    code,
  });

  return code;
}

export async function trackReferral(code: string, newUserId: string) {
  const supabase = await createClient();

  const { data: refCode } = await supabase
    .from("referral_codes")
    .select("id, user_id")
    .eq("code", code)
    .single();

  if (!refCode || refCode.user_id === newUserId) {
    return false; // Can't refer self or invalid code
  }

  const { error } = await supabase.from("referrals").insert({
    referrer_id: refCode.user_id,
    referred_user_id: newUserId,
    referral_code_id: refCode.id,
    status: "COMPLETED",
  });

  if (!error) {
    // Notify referrer
    await supabase.from("notifications").insert({
      user_id: refCode.user_id,
      type: "COMMUNITY_ANNOUNCEMENT",
      title: "New Friend Joined! 🎉",
      message: "Someone joined Veruthe Alla Kudumba Unit using your referral link!",
      action_url: "/account",
    });
    return true;
  }

  return false;
}
