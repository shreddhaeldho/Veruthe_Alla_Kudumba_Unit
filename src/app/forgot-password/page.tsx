"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "@/components/ui/logo";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (resetError) {
      setError(resetError.message);
      setLoading(false);
    } else {
      setSent(true);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-navy/5">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo size="lg" />
          </div>
          <h1 className="font-display text-2xl font-extrabold text-navy tracking-tight">
            Reset your password
          </h1>
          <p className="text-navy-60 text-sm mt-2">
            Enter your email and we&apos;ll send you recovery instructions.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-pink/10 border border-pink/20 text-pink text-sm">
            {error}
          </div>
        )}

        {sent ? (
          <div className="text-center p-6 bg-cream rounded-2xl border border-navy/5">
            <p className="text-sm font-bold text-navy mb-2">Check your email</p>
            <p className="text-xs text-navy-60 mb-6 leading-relaxed">
              We&apos;ve sent password reset instructions to <b>{email}</b>.
            </p>
            <Link
              href="/login"
              className="inline-block py-2.5 px-6 rounded-full bg-navy text-cream font-display text-xs font-bold uppercase tracking-wider"
            >
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleReset} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-display font-bold text-navy uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-4 py-3 rounded-xl border border-navy/15 text-sm focus:outline-none focus:border-navy"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 px-4 rounded-full bg-navy text-cream font-display text-sm font-bold uppercase tracking-wider hover:bg-blue transition-all disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}

        <div className="mt-8 text-center">
          <Link
            href="/login"
            className="text-xs text-navy-60 hover:text-navy transition-colors font-medium"
          >
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
