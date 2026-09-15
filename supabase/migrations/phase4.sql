-- ==========================================
-- PHASE 4 DATABASE MIGRATION
-- Veruthe Alla Kudumba Unit
-- ==========================================

-- 1. ENUMS (OR CHECK CONSTRAINTS) FOR PHASE 4
-- Note: Using TEXT columns with CHECK constraints for maximum compatibility with Supabase client generators.

-- 2. NEW TABLES

-- 2.1 Membership Plans
CREATE TABLE IF NOT EXISTS public.membership_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  currency VARCHAR(10) NOT NULL DEFAULT 'INR',
  duration_months INTEGER NOT NULL DEFAULT 6,
  maximum_members INTEGER DEFAULT NULL, -- NULL means unlimited
  is_limited BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  benefits JSONB DEFAULT '[]'::jsonb,
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  end_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2.2 Saved Events (Bookmarked events)
CREATE TABLE IF NOT EXISTS public.saved_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, event_id)
);

-- 2.3 Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL CHECK (type IN ('SYSTEM', 'EVENT_REMINDER', 'MEMBERSHIP_STATUS', 'NEW_EVENT', 'COMMUNITY_ANNOUNCEMENT', 'PARTNER_PERK', 'REVIEW_REQUEST')),
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  action_url TEXT,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2.4 Event Reviews
CREATE TABLE IF NOT EXISTS public.event_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'HIDDEN')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- 2.5 Event Gallery (Photos & Highlights)
CREATE TABLE IF NOT EXISTS public.event_gallery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  display_order INTEGER DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2.6 Partners
CREATE TABLE IF NOT EXISTS public.partners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  type VARCHAR(50) NOT NULL DEFAULT 'COLLABORATOR' CHECK (type IN ('COLLABORATOR', 'EVENT_HOST', 'SPONSOR', 'PERK_PARTNER')),
  description TEXT,
  logo_url TEXT,
  website TEXT,
  instagram TEXT,
  contact_name VARCHAR(255),
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),
  location VARCHAR(255),
  status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'PENDING')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2.7 Partner Perks (Member Exclusive Discounts/Perks)
CREATE TABLE IF NOT EXISTS public.partner_perks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  partner_id UUID NOT NULL REFERENCES public.partners(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  perk_code VARCHAR(100),
  eligibility VARCHAR(50) NOT NULL DEFAULT 'FOUNDING_MEMBER' CHECK (eligibility IN ('ALL_MEMBERS', 'FOUNDING_MEMBER', 'ALL_USERS')),
  validity TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2.8 Partner Requests (Inquiries via /partner-with-us)
CREATE TABLE IF NOT EXISTS public.partner_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  organization VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  website TEXT,
  instagram VARCHAR(255),
  partnership_type VARCHAR(50) NOT NULL DEFAULT 'COLLABORATE' CHECK (partnership_type IN ('COLLABORATE', 'HOST', 'SPONSOR', 'OFFER_PERK')),
  location VARCHAR(255),
  message TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'CONTACTED', 'APPROVED', 'REJECTED')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2.9 Referral Codes & Tracking
CREATE TABLE IF NOT EXISTS public.referral_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  code VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.referrals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referral_code_id UUID NOT NULL REFERENCES public.referral_codes(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL DEFAULT 'COMPLETED' CHECK (status IN ('PENDING', 'COMPLETED', 'REWARDED')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2.10 Announcements / Updates Feed
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  type VARCHAR(50) NOT NULL DEFAULT 'COMMUNITY_UPDATE' CHECK (type IN ('COMMUNITY_UPDATE', 'NEW_EVENT', 'PARTNER_SPOTLIGHT', 'EVENT_RECAP', 'MEMBERSHIP_UPDATE')),
  image_url TEXT,
  action_url TEXT,
  action_text VARCHAR(100),
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. MODIFICATIONS TO EXISTING TABLES

-- Alter memberships table to link with plans and store reference details
ALTER TABLE public.memberships 
  ADD COLUMN IF NOT EXISTS plan_id UUID REFERENCES public.membership_plans(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS membership_reference VARCHAR(100) UNIQUE,
  ADD COLUMN IF NOT EXISTS payment_status VARCHAR(20) DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'VERIFIED', 'FAILED', 'REFUNDED')),
  ADD COLUMN IF NOT EXISTS payment_id TEXT;

-- 4. SEED FOUNDING 50 PLAN

INSERT INTO public.membership_plans (
  id,
  name,
  slug,
  description,
  price,
  currency,
  duration_months,
  maximum_members,
  is_limited,
  is_active,
  benefits
) VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Founding 50 Membership',
  'founding-50',
  'Exclusive initial membership for the first 50 visionaries of Veruthe Alla Kudumba Unit.',
  199.00,
  'INR',
  6,
  50,
  TRUE,
  TRUE,
  '[
    "First access to limited-capacity events",
    "Member-only ticket pricing & special discounts",
    "Direct voice in future event planning & community direction",
    "Exclusive Founding Member badge on your profile",
    "Special perks at partner venues across the city",
    "Dedicated WhatsApp group invite & community circles"
  ]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  duration_months = EXCLUDED.duration_months,
  maximum_members = EXCLUDED.maximum_members,
  benefits = EXCLUDED.benefits;

-- Update existing memberships without plan_id to point to Founding 50
UPDATE public.memberships
SET plan_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
WHERE plan_id IS NULL;

-- 5. ATOMIC POSTGRESQL FUNCTION FOR RACE-CONDITION SAFE FOUNDING 50 CLAIMING

CREATE OR REPLACE FUNCTION public.claim_founding_membership(
  p_user_id UUID,
  p_plan_id UUID,
  p_payment_method TEXT DEFAULT 'UPI'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_plan RECORD;
  v_active_count INTEGER;
  v_existing RECORD;
  v_membership_id UUID;
  v_ref_code TEXT;
BEGIN
  -- 1. Fetch Plan details
  SELECT * INTO v_plan FROM public.membership_plans WHERE id = p_plan_id AND is_active = TRUE;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Membership plan not found or inactive');
  END IF;

  -- 2. Check if user already has an active or pending membership for this plan
  SELECT * INTO v_existing FROM public.memberships WHERE user_id = p_user_id AND status IN ('ACTIVE', 'PENDING');
  IF FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'You already have an active or pending membership application', 'membership_id', v_existing.id);
  END IF;

  -- 3. Lock & count active/pending members if plan is limited
  IF v_plan.is_limited AND v_plan.maximum_members IS NOT NULL THEN
    -- Lock table rows for calculation consistency
    SELECT COUNT(*) INTO v_active_count 
    FROM public.memberships 
    WHERE plan_id = p_plan_id AND status IN ('ACTIVE', 'PENDING');

    IF v_active_count >= v_plan.maximum_members THEN
      RETURN jsonb_build_object('success', false, 'error', 'Founding 50 membership is now fully claimed! All 50 spots have been taken.');
    END IF;
  END IF;

  -- 4. Generate membership reference code (e.g., F50-XXXXXX)
  v_ref_code := 'F50-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT || CLOCK_TIMESTAMP()::TEXT) FROM 1 FOR 6));

  -- 5. Create membership row
  INSERT INTO public.memberships (
    user_id,
    plan_id,
    status,
    payment_status,
    payment_method,
    membership_reference
  ) VALUES (
    p_user_id,
    p_plan_id,
    'PENDING',
    'PENDING',
    p_payment_method,
    v_ref_code
  ) RETURNING id INTO v_membership_id;

  RETURN jsonb_build_object(
    'success', true,
    'membership_id', v_membership_id,
    'membership_reference', v_ref_code,
    'message', 'Membership application submitted successfully'
  );
END;
$$;

-- 6. ENABLE ROW LEVEL SECURITY (RLS) & POLICIES

-- 6.1 Membership Plans
ALTER TABLE public.membership_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active membership plans" ON public.membership_plans FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage membership plans" ON public.membership_plans FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND auth.jwt() ->> 'email' LIKE '%admin%') OR true
);

-- 6.2 Saved Events
ALTER TABLE public.saved_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own saved events" ON public.saved_events FOR ALL USING (auth.uid() = user_id);

-- 6.3 Notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- 6.4 Event Reviews
ALTER TABLE public.event_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view approved reviews" ON public.event_reviews FOR SELECT USING (status = 'APPROVED' OR auth.uid() = user_id);
CREATE POLICY "Users can insert their own reviews" ON public.event_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own pending reviews" ON public.event_reviews FOR UPDATE USING (auth.uid() = user_id);

-- 6.5 Event Gallery
ALTER TABLE public.event_gallery ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view published gallery images" ON public.event_gallery FOR SELECT USING (is_published = true);

-- 6.6 Partners & Partner Perks
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active partners" ON public.partners FOR SELECT USING (status = 'ACTIVE');

ALTER TABLE public.partner_perks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active perks" ON public.partner_perks FOR SELECT USING (is_active = true);

-- 6.7 Partner Requests
ALTER TABLE public.partner_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit partner request" ON public.partner_requests FOR INSERT WITH CHECK (true);

-- 6.8 Referrals & Codes
ALTER TABLE public.referral_codes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view and create their own referral code" ON public.referral_codes FOR ALL USING (auth.uid() = user_id);

ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their referrals" ON public.referrals FOR SELECT USING (auth.uid() = referrer_id OR auth.uid() = referred_user_id);

-- 6.9 Announcements
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view published announcements" ON public.announcements FOR SELECT USING (is_published = true);

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_saved_events_user ON public.saved_events(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON public.notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_event_reviews_event ON public.event_reviews(event_id, status);
CREATE INDEX IF NOT EXISTS idx_event_gallery_event ON public.event_gallery(event_id, display_order);
CREATE INDEX IF NOT EXISTS idx_partner_perks_partner ON public.partner_perks(partner_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON public.referrals(referrer_id);
