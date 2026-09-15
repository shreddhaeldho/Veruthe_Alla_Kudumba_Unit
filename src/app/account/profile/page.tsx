"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const ALL_INTERESTS = [
  "Food",
  "Sports",
  "Music",
  "Art",
  "Travel",
  "Games",
  "Fitness",
  "Workshops",
  "Photography",
  "Social",
];

export default function ProfilePage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [dob, setDob] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      setEmail(user.email || "");

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profile) {
        setFullName(profile.full_name || "");
        setPhone(profile.phone || "");
        setLocation(profile.location || "");
        setBio(profile.bio || "");
        setDob(profile.date_of_birth || "");
      }

      setLoading(false);
    }

    loadProfile();
  }, [router, supabase]);

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      full_name: fullName,
      phone,
      location,
      bio,
      date_of_birth: dob || null,
      updated_at: new Date().toISOString(),
    });

    setSaving(false);
    if (error) {
      setMessage("Failed to save changes: " + error.message);
    } else {
      setMessage("Profile updated successfully!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="font-display font-bold text-navy-40 animate-pulse">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[720px] mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-navy/5 shadow-xl">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-extrabold text-navy tracking-tight">
            Edit Profile
          </h1>
          <p className="text-sm text-navy-60 mt-1">
            Keep your unofficial circle contact info up to date.
          </p>
        </div>

        {message && (
          <div
            className={`mb-6 p-4 rounded-xl text-sm ${
              message.includes("success")
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-pink/10 text-pink border border-pink/20"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSave} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-display font-bold text-navy uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-navy/15 text-sm focus:outline-none focus:border-navy"
              />
            </div>
            <div>
              <label className="block text-xs font-display font-bold text-navy uppercase tracking-wider mb-1.5">
                Email
              </label>
              <input
                type="email"
                disabled
                value={email}
                className="w-full px-4 py-3 rounded-xl border border-navy/10 bg-cream/50 text-sm text-navy-40 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-display font-bold text-navy uppercase tracking-wider mb-1.5">
                Phone
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-3 rounded-xl border border-navy/15 text-sm focus:outline-none focus:border-navy"
              />
            </div>
            <div>
              <label className="block text-xs font-display font-bold text-navy uppercase tracking-wider mb-1.5">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Kochi, Fort Kochi"
                className="w-full px-4 py-3 rounded-xl border border-navy/15 text-sm focus:outline-none focus:border-navy"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-display font-bold text-navy uppercase tracking-wider mb-1.5">
              Bio
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us what you like to do in your free time..."
              className="w-full px-4 py-3 rounded-xl border border-navy/15 text-sm focus:outline-none focus:border-navy resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-display font-bold text-navy uppercase tracking-wider mb-1.5">
              Date of Birth (Optional)
            </label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-navy/15 text-sm focus:outline-none focus:border-navy"
            />
          </div>

          {/* Interests Chips */}
          <div>
            <label className="block text-xs font-display font-bold text-navy uppercase tracking-wider mb-2">
              Your Interests
            </label>
            <div className="flex flex-wrap gap-2">
              {ALL_INTERESTS.map((interest) => {
                const isSelected = selectedInterests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`px-4 py-2 rounded-full text-xs font-display font-bold transition-all ${
                      isSelected
                        ? "bg-navy text-cream"
                        : "bg-cream text-navy hover:bg-navy/10 border border-navy/5"
                    }`}
                  >
                    {interest}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => router.back()}
              className="text-xs font-display font-bold text-navy-40 hover:text-navy uppercase tracking-wider"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="py-3 px-8 rounded-full bg-navy text-cream font-display text-xs font-bold uppercase tracking-wider hover:bg-blue transition-all disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
