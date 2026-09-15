"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { UsersIcon, ArrowRightIcon } from "@/components/ui/minimal-graphics";

function JoinContent() {
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref");

  useEffect(() => {
    if (ref) {
      localStorage.setItem("vaku_ref_code", ref);
    }
  }, [ref]);

  return (
    <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 text-center border border-navy/10 shadow-2xl relative overflow-hidden">
      <div className="w-16 h-16 bg-pink/15 text-pink rounded-full flex items-center justify-center mx-auto mb-6">
        <UsersIcon size={32} />
      </div>

      <span className="inline-block px-3.5 py-1 rounded-full bg-pink/10 text-pink font-display text-[11px] font-bold uppercase tracking-wider mb-4">
        ✨ YOU WERE INVITED TO THE CIRCLE
      </span>

      <h1 className="font-display text-3xl font-black text-navy mb-3">
        Good people know good people.
      </h1>

      <p className="text-navy-60 font-body text-sm leading-relaxed mb-8">
        A friend invited you to join Veruthe Alla Kudumba Unit — Kochi&apos;s unofficial social circle for meeting people, trying new things, and making memories.
      </p>

      {ref && (
        <div className="p-3 bg-cream rounded-xl border border-navy/10 font-mono text-xs font-bold text-navy mb-6">
          Referral Code: <span className="text-pink">{ref}</span>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <Link
          href={`/signup${ref ? `?ref=${ref}` : ""}`}
          className="w-full py-4 rounded-full bg-navy text-cream font-display text-xs font-bold uppercase tracking-wider hover:bg-blue transition-all flex items-center justify-center gap-2"
        >
          Create Your Account
          <ArrowRightIcon size={14} />
        </Link>
        <Link
          href="/events"
          className="text-xs text-navy-60 hover:text-navy font-bold uppercase tracking-wider pt-2"
        >
          Explore Events First →
        </Link>
      </div>
    </div>
  );
}

export default function JoinReferralPage() {
  return (
    <div className="min-h-screen bg-cream text-navy py-20 px-4 flex items-center justify-center">
      <Suspense fallback={
        <div className="text-navy font-display text-xs font-bold uppercase tracking-wider animate-pulse">
          Loading invitation...
        </div>
      }>
        <JoinContent />
      </Suspense>
    </div>
  );
}
