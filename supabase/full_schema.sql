-- ==========================================
-- COMPLETE SUPABASE SCHEMA & SETUP SCRIPT
-- Veruthe Alla Kudumba Unit
-- ==========================================

-- 1. PROFILES TABLE (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  email TEXT,
  avatar_url TEXT,
  bio TEXT,
  instagram_handle TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    NEW.email,
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  location VARCHAR(255),
  venue VARCHAR(255),
  category VARCHAR(100) DEFAULT 'Community',
  image_url TEXT,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  status VARCHAR(20) DEFAULT 'UPCOMING' CHECK (status IN ('DRAFT', 'UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED')),
  capacity INTEGER DEFAULT 100,
  is_featured BOOLEAN DEFAULT FALSE,
  is_members_only BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Events are viewable by everyone" ON public.events FOR SELECT USING (true);
CREATE POLICY "Admins can manage events" ON public.events FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 3. TICKETS TABLE
CREATE TABLE IF NOT EXISTS public.tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  quantity INTEGER NOT NULL DEFAULT 100,
  sold_count INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tickets are viewable by everyone" ON public.tickets FOR SELECT USING (true);

-- 4. MEMBERSHIP PLANS TABLE
CREATE TABLE IF NOT EXISTS public.membership_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  currency VARCHAR(10) NOT NULL DEFAULT 'INR',
  duration_months INTEGER NOT NULL DEFAULT 6,
  maximum_members INTEGER DEFAULT NULL,
  is_limited BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  benefits JSONB DEFAULT '[]'::jsonb,
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  end_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.membership_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active membership plans" ON public.membership_plans FOR SELECT USING (is_active = true);

-- 5. MEMBERSHIPS TABLE
CREATE TABLE IF NOT EXISTS public.memberships (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES public.membership_plans(id) ON DELETE SET NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACTIVE', 'EXPIRED', 'REJECTED', 'CANCELLED')),
  payment_status VARCHAR(20) DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'VERIFIED', 'FAILED', 'REFUNDED')),
  payment_method VARCHAR(50) DEFAULT 'UPI',
  payment_id TEXT,
  membership_reference VARCHAR(100) UNIQUE,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own memberships" ON public.memberships FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own membership application" ON public.memberships FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 6. BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_reference VARCHAR(100) UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  status VARCHAR(20) DEFAULT 'CONFIRMED' CHECK (status IN ('PENDING', 'CONFIRMED', 'CANCELLED', 'REFUNDED')),
  payment_status VARCHAR(20) DEFAULT 'SUCCESS' CHECK (payment_status IN ('PENDING', 'SUCCESS', 'FAILED')),
  payment_id TEXT,
  qr_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own bookings" ON public.bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create bookings" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 7. BOOKING ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.booking_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  ticket_id UUID NOT NULL REFERENCES public.tickets(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  total_price DECIMAL(10,2) NOT NULL DEFAULT 0.00
);

ALTER TABLE public.booking_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own booking items" ON public.booking_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.bookings WHERE id = booking_items.booking_id AND user_id = auth.uid())
);

-- 8. PARTICIPANTS TABLE
CREATE TABLE IF NOT EXISTS public.participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  ticket_id UUID REFERENCES public.tickets(id) ON DELETE SET NULL,
  checked_in BOOLEAN DEFAULT FALSE,
  checked_in_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own participants" ON public.participants FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.bookings WHERE id = participants.booking_id AND user_id = auth.uid())
);

-- 9. SAVED EVENTS
CREATE TABLE IF NOT EXISTS public.saved_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, event_id)
);

ALTER TABLE public.saved_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage saved events" ON public.saved_events FOR ALL USING (auth.uid() = user_id);

-- 10. NOTIFICATIONS
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

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- 11. EVENT REVIEWS
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

ALTER TABLE public.event_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view approved reviews" ON public.event_reviews FOR SELECT USING (status = 'APPROVED' OR auth.uid() = user_id);
CREATE POLICY "Users can insert reviews" ON public.event_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 12. EVENT GALLERY
CREATE TABLE IF NOT EXISTS public.event_gallery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  display_order INTEGER DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.event_gallery ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view published gallery" ON public.event_gallery FOR SELECT USING (is_published = true);

-- 13. PARTNERS & PERKS & REQUESTS
CREATE TABLE IF NOT EXISTS public.partners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  type VARCHAR(50) NOT NULL DEFAULT 'COLLABORATOR',
  description TEXT,
  logo_url TEXT,
  website TEXT,
  instagram TEXT,
  contact_name VARCHAR(255),
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),
  location VARCHAR(255),
  status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public view active partners" ON public.partners FOR SELECT USING (status = 'ACTIVE');

CREATE TABLE IF NOT EXISTS public.partner_perks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  partner_id UUID NOT NULL REFERENCES public.partners(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  perk_code VARCHAR(100),
  eligibility VARCHAR(50) NOT NULL DEFAULT 'FOUNDING_MEMBER',
  validity TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.partner_perks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public view active perks" ON public.partner_perks FOR SELECT USING (is_active = true);

CREATE TABLE IF NOT EXISTS public.partner_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  organization VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  website TEXT,
  instagram VARCHAR(255),
  partnership_type VARCHAR(50) NOT NULL DEFAULT 'COLLABORATE',
  location VARCHAR(255),
  message TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.partner_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone submit partner request" ON public.partner_requests FOR INSERT WITH CHECK (true);

-- 14. REFERRALS
CREATE TABLE IF NOT EXISTS public.referral_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  code VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.referral_codes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own referral code" ON public.referral_codes FOR ALL USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.referrals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referral_code_id UUID NOT NULL REFERENCES public.referral_codes(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL DEFAULT 'COMPLETED',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view referrals" ON public.referrals FOR SELECT USING (auth.uid() = referrer_id OR auth.uid() = referred_user_id);

-- 15. ANNOUNCEMENTS
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  type VARCHAR(50) NOT NULL DEFAULT 'COMMUNITY_UPDATE',
  image_url TEXT,
  action_url TEXT,
  action_text VARCHAR(100),
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public view announcements" ON public.announcements FOR SELECT USING (is_published = true);

-- 16. SEED FOUNDING 50 MEMBERSHIP PLAN
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

-- 17. ATOMIC MEMBERSHIP CLAIM FUNCTION
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
  SELECT * INTO v_plan FROM public.membership_plans WHERE id = p_plan_id AND is_active = TRUE;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Membership plan not found or inactive');
  END IF;

  SELECT * INTO v_existing FROM public.memberships WHERE user_id = p_user_id AND status IN ('ACTIVE', 'PENDING');
  IF FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'You already have an active or pending membership application', 'membership_id', v_existing.id);
  END IF;

  IF v_plan.is_limited AND v_plan.maximum_members IS NOT NULL THEN
    SELECT COUNT(*) INTO v_active_count 
    FROM public.memberships 
    WHERE plan_id = p_plan_id AND status IN ('ACTIVE', 'PENDING');

    IF v_active_count >= v_plan.maximum_members THEN
      RETURN jsonb_build_object('success', false, 'error', 'Founding 50 membership is now fully claimed! All 50 spots have been taken.');
    END IF;
  END IF;

  v_ref_code := 'F50-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT || CLOCK_TIMESTAMP()::TEXT) FROM 1 FOR 6));

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
