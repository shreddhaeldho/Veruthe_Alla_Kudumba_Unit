"use client";

import { useState } from "react";
import { Settings, Shield, Bell, Check } from "lucide-react";

export default function AdminSettingsPage() {
  const [communityName, setCommunityName] = useState("Veruthe Alla Kudumba Unit");
  const [tagline, setTagline] = useState("Your unofficial social circle.");
  const [membershipPrice, setMembershipPrice] = useState(299);
  const [validityDays, setValidityDays] = useState(365);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-8 pb-16">
      <div>
        <h1 className="font-display text-3xl font-black text-white tracking-tight">
          Admin Settings & Roles
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Configure community parameters, annual membership prices, and admin permissions.
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
          <Check size={16} /> Settings saved successfully!
        </div>
      )}

      <form onSubmit={handleSave} className="flex flex-col gap-8">
        {/* Community Configuration */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col gap-4">
          <h2 className="font-display text-lg font-bold text-white border-b border-slate-800 pb-3">
            Community Profile
          </h2>
          <div>
            <label className="block text-xs font-display font-bold uppercase text-slate-400 mb-1.5">
              Community Name
            </label>
            <input
              type="text"
              value={communityName}
              onChange={(e) => setCommunityName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue"
            />
          </div>
          <div>
            <label className="block text-xs font-display font-bold uppercase text-slate-400 mb-1.5">
              Tagline
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue"
            />
          </div>
        </div>

        {/* Membership Rules */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col gap-4">
          <h2 className="font-display text-lg font-bold text-white border-b border-slate-800 pb-3">
            Membership Plan Rules
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-display font-bold uppercase text-slate-400 mb-1.5">
                Annual Membership Price (₹)
              </label>
              <input
                type="number"
                value={membershipPrice}
                onChange={(e) => setMembershipPrice(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-display font-bold uppercase text-slate-400 mb-1.5">
                Pass Duration (Days)
              </label>
              <input
                type="number"
                value={validityDays}
                onChange={(e) => setValidityDays(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue"
              />
            </div>
          </div>
        </div>

        {/* Role Matrix */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col gap-4">
          <h2 className="font-display text-lg font-bold text-white border-b border-slate-800 pb-3">
            Role-Based Access Control
          </h2>
          <div className="flex flex-col gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
              <div>
                <span className="font-bold text-white">SUPER_ADMIN</span>
                <p className="text-[11px] text-slate-400">Full platform control, finances, and role management.</p>
              </div>
              <span className="px-2.5 py-0.5 rounded bg-blue/10 text-blue font-mono text-[10px] font-bold">ALL</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
              <div>
                <span className="font-bold text-white">EVENT_MANAGER</span>
                <p className="text-[11px] text-slate-400">Can create, duplicate, and publish events and ticket tiers.</p>
              </div>
              <span className="px-2.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px] font-bold">EVENTS</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
              <div>
                <span className="font-bold text-white">CHECKIN_MANAGER</span>
                <p className="text-[11px] text-slate-400">Access to event day QR scanner and attendee verification.</p>
              </div>
              <span className="px-2.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px] font-bold">CHECK-IN</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-8 py-3 rounded-xl bg-blue text-white font-display text-xs font-bold uppercase tracking-wider hover:bg-blue/90 shadow-md shadow-blue/20"
          >
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}
