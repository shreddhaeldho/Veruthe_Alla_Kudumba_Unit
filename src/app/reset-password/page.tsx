"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "@/components/ui/logo";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
    } else {
      router.push("/login?message=Password updated successfully");
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
            Create New Password
          </h1>
          <p className="text-navy-60 text-sm mt-2">
            Enter your new secure password below.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-pink/10 border border-pink/20 text-pink text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleUpdate} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-display font-bold text-navy uppercase tracking-wider mb-1.5">
              New Password
            </label>
            <input
              type="password"
              required
              minLength={6}
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
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
