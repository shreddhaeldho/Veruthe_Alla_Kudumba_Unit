import Link from 'next/link';
import { getActivePlan, getFoundingMemberCount } from '@/lib/membership';
import { CheckCircleIcon, ArrowRightIcon, SparklesIcon, TicketIcon } from '@/components/ui/minimal-graphics';

export const revalidate = 0; // Always fresh data

export default async function MembershipPage() {
  const plan = await getActivePlan();
  const count = await getFoundingMemberCount();
  const max = plan?.maximum_members || 50;
  const spotsLeft = Math.max(0, max - count);
  const isFull = spotsLeft <= 0;
  const progressPercent = Math.min(100, Math.round((count / max) * 100));

  return (
    <div className="flex flex-col min-h-screen bg-cream text-navy">
      {/* Hero */}
      <section className="pt-20 pb-12 px-4 max-w-[1280px] mx-auto text-center w-full">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink/15 text-pink font-display text-xs font-bold uppercase tracking-wider mb-6">
          <SparklesIcon size={14} /> Limited Release • Founding 50
        </div>
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-black text-navy leading-tight tracking-tight mb-4">
          Be one of the first 50.
        </h1>
        <p className="text-navy-60 text-lg md:text-xl max-w-2xl mx-auto font-body leading-relaxed">
          We’re building Kochi’s unofficial social circle. The Founding 50 are the pioneers who will shape the future of our events, community, and culture.
        </p>
      </section>

      {/* Counter Progress Bar */}
      <section className="px-4 max-w-xl mx-auto w-full mb-8">
        <div className="bg-white rounded-2xl p-6 border border-navy/10 shadow-lg flex flex-col gap-3">
          <div className="flex items-center justify-between font-display text-xs font-bold uppercase tracking-wider">
            <span className="text-navy-60">Founding 50 Spots Claimed</span>
            <span className="text-pink font-black text-sm">
              {count} / {max}
            </span>
          </div>

          {/* Progress Bar Track */}
          <div className="w-full h-3.5 bg-cream rounded-full overflow-hidden p-0.5 border border-navy/10 relative">
            <div
              className="h-full bg-gradient-to-r from-pink to-peach rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs font-body text-navy-60 pt-1">
            <span>{isFull ? 'Sold Out' : `${spotsLeft} spot${spotsLeft === 1 ? '' : 's'} remaining`}</span>
            <span className="font-medium text-navy">Exclusive Pioneer Benefits</span>
          </div>
        </div>
      </section>

      {/* Pricing Card */}
      <section className="py-6 pb-20 px-4 max-w-xl mx-auto w-full">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border-2 border-navy/10 shadow-2xl relative overflow-hidden flex flex-col items-center text-center">
          <div className="absolute top-0 right-0 bg-pink text-white text-[10px] font-display font-black tracking-widest uppercase px-6 py-2 rounded-bl-2xl">
            {isFull ? 'CLOSED' : 'FOUNDING MEMBER'}
          </div>

          <span className="text-xs font-display font-bold uppercase tracking-widest text-navy-40 mb-2">
            {plan?.name || 'Founding 50 Membership'}
          </span>

          <div className="flex items-baseline justify-center gap-1 my-4">
            <span className="font-display text-5xl sm:text-6xl font-black text-navy">
              ₹{plan?.price || 199}
            </span>
            <span className="text-navy-60 font-body text-base">/ {plan?.duration_months || 6} months</span>
          </div>

          <p className="text-xs text-navy-60 mb-8 max-w-sm">
            {isFull
              ? 'All 50 Founding Member spots have been claimed. Stay tuned for upcoming general membership plans!'
              : `One-time payment for ${plan?.duration_months || 6} months of founding member perks.`}
          </p>

          {/* Benefits */}
          <div className="w-full flex flex-col gap-4 text-left border-y border-navy/5 py-8 mb-8">
            {(plan?.benefits || [
              'First access to limited-capacity events',
              'Member-only ticket pricing & special discounts',
              'Direct voice in future event planning & community direction',
              'Exclusive Founding Member badge on your profile',
              'Special perks at partner venues across the city',
              'Dedicated WhatsApp group invite & community circles',
            ]).map((benefit, index) => (
              <div key={index} className="flex items-start gap-3.5">
                <div className="w-6 h-6 rounded-full bg-pink/10 text-pink flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircleIcon size={16} />
                </div>
                <p className="text-sm font-body text-navy-80 font-medium">{benefit}</p>
              </div>
            ))}
          </div>

          {!isFull ? (
            <Link
              href="/membership/apply"
              className="w-full py-4 rounded-full bg-navy text-cream font-display text-sm font-bold uppercase tracking-wider hover:bg-blue hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              Join the Founding 50 — ₹{plan?.price || 199}
              <ArrowRightIcon size={16} />
            </Link>
          ) : (
            <div className="w-full flex flex-col gap-3">
              <button
                disabled
                className="w-full py-4 rounded-full bg-navy/30 text-white font-display text-sm font-bold uppercase tracking-wider cursor-not-allowed"
              >
                Founding 50 is Full
              </button>
              <Link
                href="/events"
                className="w-full py-3.5 rounded-full border-2 border-navy text-navy font-display text-sm font-bold uppercase tracking-wider hover:bg-navy hover:text-white transition-all flex items-center justify-center gap-2"
              >
                Explore Public Events
              </Link>
            </div>
          )}

          <span className="text-[11px] text-navy-40 mt-4 font-body">
            Manual UPI verification by admin. Status updated within 2 hours.
          </span>
        </div>
      </section>
    </div>
  );
}
