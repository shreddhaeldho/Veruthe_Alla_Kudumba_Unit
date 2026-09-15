"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "@/components/ui/logo";
import { ArrowRightIcon } from "@/components/ui/minimal-graphics";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [authMode, setAuthMode] = useState<"email" | "phone">("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
    } else {
      router.push("/account");
      router.refresh();
    }
  };

  const handleOAuthLogin = async (provider: "google") => {
    setLoading(true);
    setError(null);
    const { error: oAuthError } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (oAuthError) {
      setError(oAuthError.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-navy/5">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo size="lg" />
          </div>
          <h1 className="font-display text-3xl font-extrabold text-navy tracking-tight">
            Welcome back.
          </h1>
          <p className="text-navy-60 text-sm mt-2">
            Your unofficial social circle missed you.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-pink/10 border border-pink/20 text-pink text-sm">
            {error}
          </div>
        )}

        {/* OAuth Option */}
        <button
          onClick={() => handleOAuthLogin("google")}
          disabled={loading}
          type="button"
          className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-2xl border border-navy/15 text-navy font-display text-sm font-bold hover:bg-cream transition-all mb-6 disabled:opacity-50"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Continue with Google
        </button>

        <div className="relative flex items-center justify-center mb-6">
          <div className="border-t border-navy/10 w-full" />
          <span className="bg-white px-3 text-xs text-navy-40 uppercase tracking-wider font-display">
            or
          </span>
          <div className="border-t border-navy/10 w-full" />
        </div>

        {/* Tab switch */}
        <div className="flex rounded-xl bg-cream p-1 mb-6 border border-navy/5">
          <button
            type="button"
            onClick={() => setAuthMode("email")}
            className={`flex-1 py-2 text-xs font-display font-bold rounded-lg transition-all ${
              authMode === "email"
                ? "bg-white text-navy shadow-sm"
                : "text-navy-60 hover:text-navy"
            }`}
          >
            Email
          </button>
          <button
            type="button"
            onClick={() => setAuthMode("phone")}
            className={`flex-1 py-2 text-xs font-display font-bold rounded-lg transition-all ${
              authMode === "phone"
                ? "bg-white text-navy shadow-sm"
                : "text-navy-60 hover:text-navy"
            }`}
          >
            Phone
          </button>
        </div>

        {authMode === "email" ? (
          <form onSubmit={handleEmailLogin} className="flex flex-col gap-4">
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

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-display font-bold text-navy uppercase tracking-wider">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-navy-60 hover:text-pink transition-colors font-medium"
                >
                  Forgot?
                </Link>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-navy/15 text-sm focus:outline-none focus:border-navy"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 px-4 rounded-full bg-navy text-cream font-display text-sm font-bold uppercase tracking-wider hover:bg-blue transition-all disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Continue with Email"}
            </button>
          </form>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("Phone OTP login will send an SMS to " + phone);
            }}
            className="flex flex-col gap-4"
          >
            <div>
              <label className="block text-xs font-display font-bold text-navy uppercase tracking-wider mb-1.5">
                Phone Number
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-3 rounded-xl border border-navy/15 text-sm focus:outline-none focus:border-navy"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3.5 px-4 rounded-full bg-navy text-cream font-display text-sm font-bold uppercase tracking-wider hover:bg-blue transition-all"
            >
              Continue with Phone
            </button>
          </form>
        )}

        <div className="mt-8 text-center">
          <p className="text-xs text-navy-60">
            Don&apos;t have an account yet?{" "}
            <Link
              href="/signup"
              className="font-bold text-navy hover:text-pink transition-colors"
            >
              Join the circle →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
