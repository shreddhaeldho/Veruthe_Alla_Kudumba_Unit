export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type NotificationType =
  | 'SYSTEM'
  | 'EVENT_REMINDER'
  | 'MEMBERSHIP_STATUS'
  | 'NEW_EVENT'
  | 'COMMUNITY_ANNOUNCEMENT'
  | 'PARTNER_PERK'
  | 'REVIEW_REQUEST';

export type ReviewStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'HIDDEN';

export type PartnerType =
  | 'COLLABORATOR'
  | 'EVENT_HOST'
  | 'SPONSOR'
  | 'PERK_PARTNER';

export type PartnerStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING';

export type PartnershipType =
  | 'COLLABORATE'
  | 'HOST'
  | 'SPONSOR'
  | 'OFFER_PERK';

export type PerkEligibility =
  | 'ALL_MEMBERS'
  | 'FOUNDING_MEMBER'
  | 'ALL_USERS';

export type AnnouncementType =
  | 'COMMUNITY_UPDATE'
  | 'NEW_EVENT'
  | 'PARTNER_SPOTLIGHT'
  | 'EVENT_RECAP'
  | 'MEMBERSHIP_UPDATE';

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          phone: string | null;
          location: string | null;
          bio: string | null;
          date_of_birth: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          phone?: string | null;
          location?: string | null;
          bio?: string | null;
          date_of_birth?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          phone?: string | null;
          location?: string | null;
          bio?: string | null;
          date_of_birth?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      events: {
        Row: {
          id: string;
          category_id: string | null;
          title: string;
          slug: string;
          description: string | null;
          date: string;
          start_time: string;
          end_time: string;
          location: string;
          featured_image: string | null;
          max_capacity: number;
          status: string;
          is_members_only?: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          category_id?: string | null;
          title: string;
          slug: string;
          description?: string | null;
          date: string;
          start_time: string;
          end_time: string;
          location: string;
          featured_image?: string | null;
          max_capacity: number;
          status?: string;
          is_members_only?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          category_id?: string | null;
          title?: string;
          slug?: string;
          description?: string | null;
          date?: string;
          start_time?: string;
          end_time?: string;
          location?: string;
          featured_image?: string | null;
          max_capacity?: number;
          status?: string;
          is_members_only?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      membership_plans: {
        Row: {
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
          benefits: Json;
          start_date: string | null;
          end_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          price?: number;
          currency?: string;
          duration_months?: number;
          maximum_members?: number | null;
          is_limited?: boolean;
          is_active?: boolean;
          benefits?: Json;
          start_date?: string | null;
          end_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          price?: number;
          currency?: string;
          duration_months?: number;
          maximum_members?: number | null;
          is_limited?: boolean;
          is_active?: boolean;
          benefits?: Json;
          start_date?: string | null;
          end_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      memberships: {
        Row: {
          id: string;
          user_id: string;
          plan_id: string | null;
          status: string;
          payment_status: string | null;
          start_date: string | null;
          end_date: string | null;
          payment_method: string | null;
          payment_id: string | null;
          membership_reference: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          plan_id?: string | null;
          status?: string;
          payment_status?: string | null;
          start_date?: string | null;
          end_date?: string | null;
          payment_method?: string | null;
          payment_id?: string | null;
          membership_reference?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          plan_id?: string | null;
          status?: string;
          payment_status?: string | null;
          start_date?: string | null;
          end_date?: string | null;
          payment_method?: string | null;
          payment_id?: string | null;
          membership_reference?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      bookings: {
        Row: {
          id: string;
          user_id: string;
          event_id: string;
          booking_reference: string;
          status: string;
          total_amount: number;
          currency: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          event_id: string;
          booking_reference: string;
          status?: string;
          total_amount: number;
          currency?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          event_id?: string;
          booking_reference?: string;
          status?: string;
          total_amount?: number;
          currency?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      saved_events: {
        Row: {
          id: string;
          user_id: string;
          event_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          event_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          event_id?: string;
          created_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: NotificationType;
          title: string;
          message: string;
          action_url: string | null;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: NotificationType;
          title: string;
          message: string;
          action_url?: string | null;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: NotificationType;
          title?: string;
          message?: string;
          action_url?: string | null;
          is_read?: boolean;
          created_at?: string;
        };
      };
      event_reviews: {
        Row: {
          id: string;
          event_id: string;
          user_id: string;
          booking_id: string | null;
          rating: number;
          review: string | null;
          status: ReviewStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          user_id: string;
          booking_id?: string | null;
          rating: number;
          review?: string | null;
          status?: ReviewStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          user_id?: string;
          booking_id?: string | null;
          rating?: number;
          review?: string | null;
          status?: ReviewStatus;
          created_at?: string;
          updated_at?: string;
        };
      };
      event_gallery: {
        Row: {
          id: string;
          event_id: string;
          image_url: string;
          caption: string | null;
          display_order: number;
          is_published: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          image_url: string;
          caption?: string | null;
          display_order?: number;
          is_published?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          image_url?: string;
          caption?: string | null;
          display_order?: number;
          is_published?: boolean;
          created_at?: string;
        };
      };
      partners: {
        Row: {
          id: string;
          name: string;
          slug: string;
          type: PartnerType;
          description: string | null;
          logo_url: string | null;
          website: string | null;
          instagram: string | null;
          contact_name: string | null;
          contact_email: string | null;
          contact_phone: string | null;
          location: string | null;
          status: PartnerStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          type?: PartnerType;
          description?: string | null;
          logo_url?: string | null;
          website?: string | null;
          instagram?: string | null;
          contact_name?: string | null;
          contact_email?: string | null;
          contact_phone?: string | null;
          location?: string | null;
          status?: PartnerStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          type?: PartnerType;
          description?: string | null;
          logo_url?: string | null;
          website?: string | null;
          instagram?: string | null;
          contact_name?: string | null;
          contact_email?: string | null;
          contact_phone?: string | null;
          location?: string | null;
          status?: PartnerStatus;
          created_at?: string;
          updated_at?: string;
        };
      };
      partner_perks: {
        Row: {
          id: string;
          partner_id: string;
          title: string;
          description: string;
          perk_code: string | null;
          eligibility: PerkEligibility;
          validity: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          partner_id: string;
          title: string;
          description: string;
          perk_code?: string | null;
          eligibility?: PerkEligibility;
          validity?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          partner_id?: string;
          title?: string;
          description?: string;
          perk_code?: string | null;
          eligibility?: PerkEligibility;
          validity?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
      };
      partner_requests: {
        Row: {
          id: string;
          name: string;
          organization: string;
          email: string;
          phone: string | null;
          website: string | null;
          instagram: string | null;
          partnership_type: PartnershipType;
          location: string | null;
          message: string;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          organization: string;
          email: string;
          phone?: string | null;
          website?: string | null;
          instagram?: string | null;
          partnership_type?: PartnershipType;
          location?: string | null;
          message: string;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          organization?: string;
          email?: string;
          phone?: string | null;
          website?: string | null;
          instagram?: string | null;
          partnership_type?: PartnershipType;
          location?: string | null;
          message?: string;
          status?: string;
          created_at?: string;
        };
      };
      referral_codes: {
        Row: {
          id: string;
          user_id: string;
          code: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          code: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          code?: string;
          created_at?: string;
        };
      };
      referrals: {
        Row: {
          id: string;
          referrer_id: string;
          referred_user_id: string;
          referral_code_id: string;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          referrer_id: string;
          referred_user_id: string;
          referral_code_id: string;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          referrer_id?: string;
          referred_user_id?: string;
          referral_code_id?: string;
          status?: string;
          created_at?: string;
        };
      };
      announcements: {
        Row: {
          id: string;
          title: string;
          content: string;
          type: AnnouncementType;
          image_url: string | null;
          action_url: string | null;
          action_text: string | null;
          is_published: boolean;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          content: string;
          type?: AnnouncementType;
          image_url?: string | null;
          action_url?: string | null;
          action_text?: string | null;
          is_published?: boolean;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          content?: string;
          type?: AnnouncementType;
          image_url?: string | null;
          action_url?: string | null;
          action_text?: string | null;
          is_published?: boolean;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Functions: {
      claim_founding_membership: {
        Args: {
          p_user_id: string;
          p_plan_id: string;
          p_payment_method?: string;
        };
        Returns: Json;
      };
    };
  };
};
