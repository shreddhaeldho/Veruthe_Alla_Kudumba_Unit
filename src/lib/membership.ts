import { createClient } from '@/lib/supabase/server';

export interface MembershipPlan {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  currency: string;
  duration_months: number;
  maximum_members: number | null;
  is_limited: boolean;
  is_active: boolean;
  benefits: string[];
  start_date: string | null;
  end_date: string | null;
}

export interface UserMembership {
  id: string;
  user_id: string;
  plan_id: string | null;
  status: 'PENDING' | 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
  payment_status: 'PENDING' | 'VERIFIED' | 'FAILED' | 'REFUNDED' | null;
  start_date: string | null;
  end_date: string | null;
  payment_method: string | null;
  payment_id: string | null;
  membership_reference: string | null;
  created_at: string;
  plan?: MembershipPlan | null;
}

export async function getActivePlan(): Promise<MembershipPlan | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('membership_plans')
    .select('*')
    .eq('slug', 'founding-50')
    .eq('is_active', true)
    .single();

  if (error || !data) {
    // Fallback default Founding 50 plan object if DB not migrated yet
    return {
      id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      name: 'Founding 50 Membership',
      slug: 'founding-50',
      description: 'Exclusive initial membership for the first 50 visionaries of Veruthe Alla Kudumba Unit.',
      price: 199,
      currency: 'INR',
      duration_months: 6,
      maximum_members: 50,
      is_limited: true,
      is_active: true,
      benefits: [
        'First access to limited-capacity events',
        'Member-only ticket pricing & special discounts',
        'Direct voice in future event planning & community direction',
        'Exclusive Founding Member badge on your profile',
        'Special perks at partner venues across the city',
        'Dedicated WhatsApp group invite & community circles',
      ],
      start_date: null,
      end_date: null,
    };
  }

  return {
    ...data,
    benefits: Array.isArray(data.benefits) ? (data.benefits as string[]) : [],
  };
}

export async function getFoundingMemberCount(): Promise<number> {
  const supabase = await createClient();

  const { count, error } = await supabase
    .from('memberships')
    .select('*', { count: 'exact', head: true })
    .in('status', ['ACTIVE', 'PENDING']);

  if (error) {
    console.error('Error fetching founding member count:', error);
    return 0;
  }

  return count || 0;
}

export async function isFoundingAvailable(): Promise<{ available: boolean; count: number; max: number }> {
  const plan = await getActivePlan();
  const max = plan?.maximum_members || 50;
  const count = await getFoundingMemberCount();

  return {
    available: count < max,
    count,
    max,
  };
}

export async function getUserMembership(userId: string): Promise<UserMembership | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('memberships')
    .select('*, plan:membership_plans(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error || !data) {
    return null;
  }

  return {
    ...data,
    status: data.status as UserMembership['status'],
    payment_status: data.payment_status as UserMembership['payment_status'],
    plan: data.plan
      ? {
          ...data.plan,
          benefits: Array.isArray(data.plan.benefits) ? (data.plan.benefits as string[]) : [],
        }
      : null,
  };
}

export async function claimFoundingMembership(userId: string, planId: string, paymentMethod = 'UPI') {
  const supabase = await createClient();

  // Call the atomic PostgreSQL RPC function
  const { data, error } = await supabase.rpc('claim_founding_membership', {
    p_user_id: userId,
    p_plan_id: planId,
    p_payment_method: paymentMethod,
  });

  if (error) {
    console.error('RPC Error claiming founding membership:', error);
    
    // Fallback logic if RPC fails or is not executed in DB yet
    const { available, count } = await isFoundingAvailable();
    if (!available) {
      return { success: false, error: 'Founding 50 membership is fully claimed!' };
    }

    const ref = 'F50-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    const { data: newMem, error: insertError } = await supabase
      .from('memberships')
      .insert({
        user_id: userId,
        plan_id: planId,
        status: 'PENDING',
        payment_status: 'PENDING',
        payment_method: paymentMethod,
        membership_reference: ref,
      })
      .select()
      .single();

    if (insertError) {
      return { success: false, error: insertError.message };
    }

    return {
      success: true,
      membership_id: newMem.id,
      membership_reference: ref,
    };
  }

  return data as { success: boolean; membership_id?: string; membership_reference?: string; error?: string };
}
