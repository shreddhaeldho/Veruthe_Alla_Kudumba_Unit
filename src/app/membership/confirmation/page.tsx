import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserMembership } from "@/lib/membership";
import { CheckCircleIcon, SparklesIcon, ArrowRightIcon } from "@/components/ui/minimal-graphics";

export const revalidate = 0;

export default async function MembershipConfirmationPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirectTo=/membership/confirmation");
  }

  const membership = await getUserMembership(user.id);

  const isPending = !membership || membership.status === "PENDING" || membership.payment_status === "PENDING";
  const isActive = membership?.status === "ACTIVE";

  return (
    <div className="min-h-screen bg-cream text-navy py-16 px-4 flex items-center justify-center">
      <div className="max-w-lg w-full bg-white rounded-3xl p-8 sm:p-10 border border-navy/10 shadow-2xl text-center relative overflow-hidden">
        {/* Decorative Badge */}
        <div className="w-16 h-16 bg-pink/15 text-pink rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
          <SparklesIcon size={32} />
        </div>

        {isActive ? (
          <>
            <span className="inline-block px-4 py-1 rounded-full bg-pink/15 text-pink font-display text-[11px] font-bold uppercase tracking-wider mb-4">
              ✨ FOUNDING MEMBER #50
            </span>
            <h1 className="font-display text-3xl font-black text-navy tracking-tight mb-3">
              Welcome to the first 50.
            </h1>
            <p className="text-navy-60 font-body text-sm leading-relaxed mb-8">
              Your Founding 50 membership is active! You now have exclusive early access, member pricing, and special perks.
            </p>
          </>
        ) : (
          <>
            <span className="inline-block px-4 py-1 rounded-full bg-peach/20 text-peach font-display text-[11px] font-bold uppercase tracking-wider mb-4">
              ⏳ APPLICATION SUBMITTED
            </span>
            <h1 className="font-display text-3xl font-black text-navy tracking-tight mb-3">
              You&apos;re in the first 50... almost.
            </h1>
            <p className="text-navy-60 font-body text-sm leading-relaxed mb-8">
              We&apos;ve reserved your Founding Member spot. Complete your UPI transfer and our admin team will verify and activate your pass shortly.
            </p>
          </>
        )}

        {/* Membership Details Card */}
        <div className="bg-cream/70 rounded-2xl p-6 border border-navy/10 text-left mb-8 space-y-3 text-xs">
          <div className="flex justify-between border-b border-navy/10 pb-2.5">
            <span className="text-navy-60">Plan:</span>
            <span className="font-display font-bold text-navy">{membership?.plan?.name || "Founding 50 Membership"}</span>
          </div>

          {membership?.membership_reference && (
            <div className="flex justify-between border-b border-navy/10 pb-2.5">
              <span className="text-navy-60">Reference Code:</span>
              <span className="font-mono font-bold text-pink">{membership.membership_reference}</span>
            </div>
          )}

          <div className="flex justify-between border-b border-navy/10 pb-2.5">
            <span className="text-navy-60">Fee & Validity:</span>
            <span className="font-bold text-navy">₹{membership?.plan?.price || 199} • 6 Months</span>
          </div>

          <div className="flex justify-between">
            <span className="text-navy-60">Verification Status:</span>
            <span className={`font-display font-bold uppercase ${isActive ? "text-green-600" : "text-peach"}`}>
              {isActive ? "ACTIVE MEMBER" : "PENDING VERIFICATION"}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Link
            href="/account"
            className="w-full py-4 rounded-full bg-navy text-cream font-display text-xs font-bold uppercase tracking-wider hover:bg-blue transition-all flex items-center justify-center gap-2"
          >
            View Circle Status in Account
            <ArrowRightIcon size={14} />
          </Link>
          <Link
            href="/events"
            className="text-xs text-navy-60 hover:text-navy font-bold uppercase tracking-wider transition-colors pt-2"
          >
            Browse Upcoming Events →
          </Link>
        </div>
      </div>
    </div>
  );
}
