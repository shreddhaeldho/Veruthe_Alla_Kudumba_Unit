"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Check, X, Handshake, ExternalLink } from "lucide-react";

export default function AdminPartnersPage() {
  const [activeTab, setActiveTab] = useState<"PARTNERS" | "REQUESTS" | "PERKS">("PARTNERS");
  const [partners, setPartners] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [perks, setPerks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New partner modal state
  const [newPartner, setNewPartner] = useState({
    name: "",
    slug: "",
    type: "COLLABORATOR",
    description: "",
    location: "",
    instagram: "",
    website: "",
  });

  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, [supabase]);

  const fetchData = async () => {
    setLoading(true);

    const { data: pData } = await supabase.from("partners").select("*").order("created_at", { ascending: false });
    if (pData) setPartners(pData);

    const { data: rData } = await supabase.from("partner_requests").select("*").order("created_at", { ascending: false });
    if (rData) setRequests(rData);

    const { data: perkData } = await supabase.from("partner_perks").select("*, partners(name)").order("created_at", { ascending: false });
    if (perkData) setPerks(perkData);

    setLoading(false);
  };

  const handleCreatePartner = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug = newPartner.slug.trim() || newPartner.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const { error } = await supabase.from("partners").insert({
      ...newPartner,
      slug,
      status: "ACTIVE",
    });

    if (!error) {
      setNewPartner({
        name: "",
        slug: "",
        type: "COLLABORATOR",
        description: "",
        location: "",
        instagram: "",
        website: "",
      });
      fetchData();
    }
  };

  const handleUpdateRequestStatus = async (id: string, status: string) => {
    await supabase.from("partner_requests").update({ status }).eq("id", id);
    fetchData();
  };

  return (
    <div className="flex flex-col gap-6 text-slate-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-black text-white tracking-tight">
            Partners & Perks Network
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage partner venues, member perk offers, and incoming partnership applications.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex gap-2 p-1 bg-slate-900 border border-slate-800 rounded-xl">
          <button
            onClick={() => setActiveTab("PARTNERS")}
            className={`px-4 py-2 rounded-lg text-xs font-display font-bold uppercase transition-all ${
              activeTab === "PARTNERS" ? "bg-blue text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            Directory ({partners.length})
          </button>
          <button
            onClick={() => setActiveTab("REQUESTS")}
            className={`px-4 py-2 rounded-lg text-xs font-display font-bold uppercase transition-all ${
              activeTab === "REQUESTS" ? "bg-blue text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            Inquiries ({requests.filter((r) => r.status === "PENDING").length})
          </button>
          <button
            onClick={() => setActiveTab("PERKS")}
            className={`px-4 py-2 rounded-lg text-xs font-display font-bold uppercase transition-all ${
              activeTab === "PERKS" ? "bg-blue text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            Member Perks ({perks.length})
          </button>
        </div>
      </div>

      {activeTab === "PARTNERS" && (
        <div className="flex flex-col gap-6">
          {/* Add Partner Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="font-display font-bold text-white text-base mb-4">Add New Partner</h3>
            <form onSubmit={handleCreatePartner} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <input
                type="text"
                required
                placeholder="Partner Name *"
                value={newPartner.name}
                onChange={(e) => setNewPartner({ ...newPartner, name: e.target.value })}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-body text-white focus:outline-none focus:border-blue"
              />
              <select
                value={newPartner.type}
                onChange={(e) => setNewPartner({ ...newPartner, type: e.target.value })}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-body text-white focus:outline-none focus:border-blue"
              >
                <option value="COLLABORATOR">Collaborator</option>
                <option value="EVENT_HOST">Event Host</option>
                <option value="SPONSOR">Sponsor</option>
                <option value="PERK_PARTNER">Perk Partner</option>
              </select>
              <input
                type="text"
                placeholder="Location (e.g. Fort Kochi)"
                value={newPartner.location}
                onChange={(e) => setNewPartner({ ...newPartner, location: e.target.value })}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-body text-white focus:outline-none focus:border-blue"
              />
              <input
                type="text"
                placeholder="Instagram (@handle)"
                value={newPartner.instagram}
                onChange={(e) => setNewPartner({ ...newPartner, instagram: e.target.value })}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-body text-white focus:outline-none focus:border-blue"
              />
              <input
                type="url"
                placeholder="Website (https://...)"
                value={newPartner.website}
                onChange={(e) => setNewPartner({ ...newPartner, website: e.target.value })}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-body text-white focus:outline-none focus:border-blue"
              />
              <button
                type="submit"
                className="py-3 px-6 rounded-xl bg-blue hover:bg-blue/90 text-white font-display text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <Plus size={16} /> Save Partner
              </button>
            </form>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/50 text-slate-400 font-display uppercase tracking-wider">
                  <th className="p-4">Organization</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Instagram</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-body">
                {partners.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-4 font-bold text-white text-sm">{p.name}</td>
                    <td className="p-4 text-slate-300">
                      <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] font-bold uppercase">
                        {p.type?.replace("_", " ")}
                      </span>
                    </td>
                    <td className="p-4 text-slate-300">{p.location || "Kochi"}</td>
                    <td className="p-4 text-pink font-mono">{p.instagram || "—"}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "REQUESTS" && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/50 text-slate-400 font-display uppercase tracking-wider">
                <th className="p-4">Applicant & Brand</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Partnership Type</th>
                <th className="p-4">Message</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-body">
              {requests.map((r) => (
                <tr key={r.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-white">{r.name}</div>
                    <div className="text-[11px] text-slate-400">{r.organization}</div>
                  </td>
                  <td className="p-4 text-slate-300">
                    <div>{r.email}</div>
                    <div className="text-[11px] text-slate-500">{r.phone}</div>
                  </td>
                  <td className="p-4 text-slate-300 font-semibold">{r.partnership_type}</td>
                  <td className="p-4 text-slate-400 max-w-xs">{r.message}</td>
                  <td className="p-4 text-right">
                    {r.status === "PENDING" ? (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleUpdateRequestStatus(r.id, "CONTACTED")}
                          className="px-3 py-1 rounded-lg bg-blue/20 text-blue font-bold hover:bg-blue hover:text-white"
                        >
                          Mark Contacted
                        </button>
                      </div>
                    ) : (
                      <span className="text-slate-500 text-[11px] uppercase">{r.status}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
