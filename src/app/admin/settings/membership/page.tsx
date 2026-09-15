"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Sparkles, Save, Plus, Check } from "lucide-react";

export default function AdminMembershipSettingsPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    fetchPlans();
  }, [supabase]);

  const fetchPlans = async () => {
    const { data } = await supabase
      .from("membership_plans")
      .select("*")
      .order("created_at", { ascending: true });

    if (data && data.length > 0) {
      setPlans(data);
    } else {
      setPlans([
        {
          id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
          name: "Founding 50 Membership",
          slug: "founding-50",
          price: 199,
          currency: "INR",
          duration_months: 6,
          maximum_members: 50,
          is_limited: true,
          is_active: true,
          benefits: [
            "First access to limited-capacity events",
            "Member-only ticket pricing & special discounts",
            "Direct voice in future event planning & community direction",
            "Exclusive Founding Member badge on your profile",
            "Special perks at partner venues across the city",
            "Dedicated WhatsApp group invite & community circles",
          ],
        },
      ]);
    }
    setLoading(false);
  };

  const handleUpdatePlan = async (plan: any) => {
    setSaving(true);
    setMsg(null);

    const { error } = await supabase
      .from("membership_plans")
      .upsert(plan);

    if (error) {
      setMsg("Error saving plan: " + error.message);
    } else {
      setMsg("Plan settings saved successfully! ✨");
      fetchPlans();
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="font-display font-bold text-slate-400 animate-pulse">Loading plan settings...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 text-slate-100 max-w-4xl">
      <div>
        <h1 className="font-display text-3xl font-black text-white tracking-tight">
          Membership Plan Settings
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Configure tier pricing, member capacity caps, duration, and benefits.
        </p>
      </div>

      {msg && (
        <div className="p-4 rounded-xl bg-pink/15 border border-pink/30 text-pink text-xs font-bold">
          {msg}
        </div>
      )}

      <div className="flex flex-col gap-6">
        {plans.map((plan) => (
          <div key={plan.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-pink/15 text-pink flex items-center justify-center">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="font-display font-bold text-white text-lg">{plan.name}</h3>
                  <span className="text-xs text-slate-400 font-mono">slug: {plan.slug}</span>
                </div>
              </div>

              <button
                onClick={() => handleUpdatePlan(plan)}
                disabled={saving}
                className="px-5 py-2.5 rounded-xl bg-blue hover:bg-blue/90 text-white font-display text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all"
              >
                <Save size={14} /> Save Changes
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-display font-bold uppercase text-slate-400 mb-1.5">
                  Price (INR)
                </label>
                <input
                  type="number"
                  value={plan.price}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setPlans(plans.map((p) => (p.id === plan.id ? { ...p, price: val } : p)));
                  }}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-sm font-bold text-white focus:outline-none focus:border-blue"
                />
              </div>

              <div>
                <label className="block text-xs font-display font-bold uppercase text-slate-400 mb-1.5">
                  Duration (Months)
                </label>
                <input
                  type="number"
                  value={plan.duration_months}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setPlans(plans.map((p) => (p.id === plan.id ? { ...p, duration_months: val } : p)));
                  }}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-sm font-bold text-white focus:outline-none focus:border-blue"
                />
              </div>

              <div>
                <label className="block text-xs font-display font-bold uppercase text-slate-400 mb-1.5">
                  Member Limit Cap
                </label>
                <input
                  type="number"
                  value={plan.maximum_members || 50}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setPlans(plans.map((p) => (p.id === plan.id ? { ...p, maximum_members: val } : p)));
                  }}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-sm font-bold text-white focus:outline-none focus:border-blue"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-display font-bold uppercase text-slate-400 mb-2">
                Member Benefits (One per line)
              </label>
              <textarea
                rows={6}
                value={Array.isArray(plan.benefits) ? plan.benefits.join("\n") : ""}
                onChange={(e) => {
                  const arr = e.target.value.split("\n");
                  setPlans(plans.map((p) => (p.id === plan.id ? { ...p, benefits: arr } : p)));
                }}
                className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 focus:outline-none focus:border-blue"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
