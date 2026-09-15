"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeftIcon, SparklesIcon, CheckCircleIcon, ArrowRightIcon } from "@/components/ui/minimal-graphics";

export default function MembershipApplyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [plan, setPlan] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("UPI");

  const supabase = createClient();

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login?redirectTo=/membership/apply");
        return;
      }
      setUser(user);

      // Fetch plan details
      const { data: planData } = await supabase
        .from("membership_plans")
        .select("*")
        .eq("slug", "founding-50")
        .single();

      if (planData) {
        setPlan(planData);
      } else {
        setPlan({
          id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
          name: "Founding 50 Membership",
          price: 199,
          duration_months: 6,
        });
      }
      setLoading(false);
    }

    loadData();
  }, [router, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !plan) return;

    setSubmitting(true);
    setErrorMsg(null);

    try {
      // Call Supabase RPC function for atomic claim
      const { data, error } = await supabase.rpc("claim_founding_membership", {
        p_user_id: user.id,
        p_plan_id: plan.id,
        p_payment_method: paymentMethod,
      });

      if (error) {
        // Fallback insert if RPC not present in environment
        const refCode = "F50-" + Math.random().toString(36).substring(2, 8).toUpperCase();
        const { error: insertErr } = await supabase.from("memberships").insert({
          user_id: user.id,
          plan_id: plan.id,
          status: "PENDING",
          payment_status: "PENDING",
          payment_method: paymentMethod,
          membership_reference: refCode,
        });

        if (insertErr) {
          setErrorMsg(insertErr.message);
          setSubmitting(false);
          return;
        }

        router.push("/membership/confirmation");
        return;
      }

      if (data && !data.success) {
        setErrorMsg(data.error || "Failed to submit membership application");
        setSubmitting(false);
        return;
      }

      router.push("/membership/confirmation");
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred.");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-navy font-display text-sm font-bold uppercase tracking-wider animate-pulse">
          Loading application...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream text-navy py-12 px-4">
      <div className="max-w-xl mx-auto">
        <Link
          href="/membership"
          className="inline-flex items-center gap-2 text-xs font-display font-bold uppercase tracking-wider text-navy-60 hover:text-navy mb-8 transition-colors"
        >
          <ArrowLeftIcon size={14} /> Back to Membership Info
        </Link>

        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-navy/10 shadow-xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink/15 text-pink font-display text-[11px] font-bold uppercase tracking-wider mb-4">
            <SparklesIcon size={13} /> Step 2 of 2 • Secure Your Spot
          </div>

          <h1 className="font-display text-2xl sm:text-3xl font-black text-navy mb-2">
            Founding 50 Application
          </h1>
          <p className="text-navy-60 text-sm font-body mb-6">
            Confirm your membership claim for ₹{plan?.price || 199} (6 months pass).
          </p>

          {errorMsg && (
            <div className="p-4 rounded-2xl bg-pink/10 border border-pink/20 text-pink text-xs font-medium mb-6">
              {errorMsg}
            </div>
          )}

          {/* Payment Summary */}
          <div className="bg-cream/60 rounded-2xl p-5 border border-navy/5 mb-6">
            <div className="flex justify-between items-center mb-3 pb-3 border-b border-navy/10">
              <span className="font-display text-xs font-bold uppercase text-navy-60">Plan</span>
              <span className="font-display font-bold text-navy text-sm">{plan?.name || "Founding 50"}</span>
            </div>
            <div className="flex justify-between items-center mb-3 pb-3 border-b border-navy/10">
              <span className="font-display text-xs font-bold uppercase text-navy-60">Duration</span>
              <span className="font-body text-navy text-sm">{plan?.duration_months || 6} Months</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-display text-xs font-bold uppercase text-navy-60">Total Fee</span>
              <span className="font-display font-black text-navy text-xl">₹{plan?.price || 199}</span>
            </div>
          </div>

          {/* Payment Details / UPI Instructions */}
          <div className="p-5 rounded-2xl border-2 border-dashed border-navy/20 bg-blue/5 mb-8">
            <h4 className="font-display font-bold text-navy text-xs uppercase tracking-wider mb-2">
              Payment Instructions (UPI)
            </h4>
            <p className="text-xs text-navy-80 font-body leading-relaxed mb-3">
              Transfer <strong className="text-navy">₹{plan?.price || 199}</strong> via any UPI app (GPay / PhonePe / Paytm) to:
            </p>
            <div className="p-3 bg-white rounded-xl border border-navy/10 font-mono text-sm font-bold text-navy text-center mb-3">
              veruthealla@upi
            </div>
            <p className="text-[11px] text-navy-60">
              After submitting, our admin team will verify your transaction against your account details.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 rounded-full bg-navy text-cream font-display text-sm font-bold uppercase tracking-wider hover:bg-blue hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? "Claiming Spot..." : `Confirm & Submit Application — ₹${plan?.price || 199}`}
              <ArrowRightIcon size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
