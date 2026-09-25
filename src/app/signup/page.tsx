"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "@/components/ui/logo";

const KERALA_DISTRICTS = [
  "Thiruvananthapuram",
  "Kollam",
  "Pathanamthitta",
  "Alappuzha",
  "Kottayam",
  "Idukki",
  "Ernakulam",
  "Thrissur",
  "Palakkad",
  "Malappuram",
  "Kozhikode",
  "Wayanad",
  "Kannur",
  "Kasaragod",
];

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [district, setDistrict] = useState("");
  const [nativePlace, setNativePlace] = useState("");
  const [college, setCollege] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);

  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("[signup] form submitted");
    setLoading(true);
    setError(null);

    try {
      console.log("[signup] calling supabase.auth.signUp for", email);
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: phone,
          },
        },
      });

      console.log("[signup] signUp result:", { data, error: signUpError });

      if (signUpError) {
        console.error("[signup] signUp error:", signUpError);
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        console.log("[signup] user created, session:", !!data.session);

        const profilePayload = {
          id: data.user.id,
          full_name: fullName,
          phone: phone,
          email: email,
          gender: gender,
          age: age ? parseInt(age) : null,
          district: district,
          native_place: nativePlace,
          college: college,
          updated_at: new Date().toISOString(),
        };

        if (data.session) {
          console.log("[signup] auto-confirmed, upserting profile...");
          const { error: upsertError } = await supabase
            .from("profiles")
            .upsert(profilePayload);
          if (upsertError) console.warn("[signup] profile upsert error:", upsertError);

          router.push("/account");
          router.refresh();
        } else {
          console.log("[signup] email confirmation required");
          // Save profile data to localStorage so we can upsert after email confirmation
          localStorage.setItem("pending_profile", JSON.stringify(profilePayload));
          setAwaitingConfirmation(true);
          setLoading(false);
        }
      } else {
        console.warn("[signup] no user returned");
        setError("Something went wrong. Please try again.");
        setLoading(false);
      }
    } catch (err) {
      console.error("[signup] unexpected exception:", err);
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  // Show email confirmation screen
  if (awaitingConfirmation) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-navy/5 text-center">
          <div className="flex justify-center mb-6">
            <Logo size="lg" />
          </div>
          <div className="text-5xl mb-4">📬</div>
          <h1 className="font-display text-2xl font-extrabold text-navy tracking-tight mb-3">
            Check your inbox!
          </h1>
          <p className="text-navy-60 text-sm mb-2">
            We sent a confirmation email to
          </p>
          <p className="font-bold text-navy text-sm mb-6">{email}</p>
          <p className="text-navy-60 text-xs leading-relaxed mb-8">
            Click the link in the email to confirm your account and complete your sign-up. Check your spam folder if you don&apos;t see it within a minute.
          </p>
          <Link
            href="/login"
            className="inline-block py-3 px-8 rounded-full bg-navy text-cream font-display text-sm font-bold uppercase tracking-wider hover:bg-blue transition-all"
          >
            Go to Login →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-navy/5">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo size="lg" />
          </div>
          <h1 className="font-display text-3xl font-extrabold text-navy tracking-tight">
            Join the circle.
          </h1>
          <p className="text-navy-60 text-sm mt-2 font-handwritten text-lg text-pink font-bold">
            You&apos;re officially unofficial.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-pink/10 border border-pink/20 text-pink text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="flex flex-col gap-4">

          {/* Full Name */}
          <div>
            <label className="block text-xs font-display font-bold text-navy uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your name"
              className="w-full px-4 py-3 rounded-xl border border-navy/15 text-sm focus:outline-none focus:border-navy"
            />
          </div>

          {/* Email */}
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

          {/* Phone */}
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

          {/* Password */}
          <div>
            <label className="block text-xs font-display font-bold text-navy uppercase tracking-wider mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              minLength={6}
              className="w-full px-4 py-3 rounded-xl border border-navy/15 text-sm focus:outline-none focus:border-navy"
            />
          </div>

          {/* Gender + Age row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-display font-bold text-navy uppercase tracking-wider mb-1.5">
                Gender
              </label>
              <select
                required
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-navy/15 text-sm focus:outline-none focus:border-navy bg-white"
              >
                <option value="" disabled>Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="non-binary">Non-binary</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-display font-bold text-navy uppercase tracking-wider mb-1.5">
                Age
              </label>
              <input
                type="number"
                required
                min={18}
                max={60}
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="e.g. 22"
                className="w-full px-4 py-3 rounded-xl border border-navy/15 text-sm focus:outline-none focus:border-navy"
              />
            </div>
          </div>

          {/* District */}
          <div>
            <label className="block text-xs font-display font-bold text-navy uppercase tracking-wider mb-1.5">
              District (Kerala)
            </label>
            <select
              required
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-navy/15 text-sm focus:outline-none focus:border-navy bg-white"
            >
              <option value="" disabled>Select your district</option>
              {KERALA_DISTRICTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Native Place */}
          <div>
            <label className="block text-xs font-display font-bold text-navy uppercase tracking-wider mb-1.5">
              Native Place
            </label>
            <input
              type="text"
              required
              value={nativePlace}
              onChange={(e) => setNativePlace(e.target.value)}
              placeholder="e.g. Thrissur, Munnar..."
              className="w-full px-4 py-3 rounded-xl border border-navy/15 text-sm focus:outline-none focus:border-navy"
            />
          </div>

          {/* College */}
          <div>
            <label className="block text-xs font-display font-bold text-navy uppercase tracking-wider mb-1.5">
              College / Institution
            </label>
            <input
              type="text"
              required
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              placeholder="e.g. College of Engineering, Trivandrum"
              className="w-full px-4 py-3 rounded-xl border border-navy/15 text-sm focus:outline-none focus:border-navy"
            />
          </div>

          {/* Member Confirmation */}
          <div className="mt-4 flex flex-col gap-3">
            <h3 className="font-display text-sm font-bold text-navy uppercase tracking-wider mb-2">
              Member Confirmation
            </h3>

            <label className="flex items-start gap-3 cursor-pointer text-xs text-navy-80 font-body">
              <input type="checkbox" required className="mt-0.5 rounded text-navy focus:ring-0" />
              <span>I am 18 years or older.</span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer text-xs text-navy-80 font-body">
              <input type="checkbox" required className="mt-0.5 rounded text-navy focus:ring-0" />
              <span>The information provided by me is accurate.</span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer text-xs text-navy-80 font-body">
              <input type="checkbox" required className="mt-0.5 rounded text-navy focus:ring-0" />
              <span>I have read and agree to these <Link href="/terms" target="_blank" className="text-pink hover:underline">Terms & Conditions</Link>.</span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer text-xs text-navy-80 font-body">
              <input type="checkbox" required className="mt-0.5 rounded text-navy focus:ring-0" />
              <span>I agree to follow the Community Code of Conduct.</span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer text-xs text-navy-80 font-body">
              <input type="checkbox" required className="mt-0.5 rounded text-navy focus:ring-0" />
              <span>I understand that individual events may have additional rules and consent requirements.</span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer text-xs text-navy-80 font-body">
              <input type="checkbox" required className="mt-0.5 rounded text-navy focus:ring-0" />
              <span>I have read the <Link href="/privacy" target="_blank" className="text-pink hover:underline">Privacy Policy</Link>.</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-3.5 px-4 rounded-full bg-navy text-cream font-display text-sm font-bold uppercase tracking-wider hover:bg-blue transition-all disabled:opacity-50"
          >
            {loading ? "Joining..." : "Join the Circle"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-xs text-navy-60">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-navy hover:text-pink transition-colors"
            >
              Log in →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
