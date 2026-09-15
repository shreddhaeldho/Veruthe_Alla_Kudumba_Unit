"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeftIcon, HandshakeIcon, CheckCircleIcon } from "@/components/ui/minimal-graphics";

export default function PartnerWithUsPage() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    organization: "",
    email: "",
    phone: "",
    website: "",
    instagram: "",
    partnership_type: "COLLABORATE",
    location: "",
    message: "",
  });

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);

    const { error } = await supabase.from("partner_requests").insert({
      name: formData.name.trim(),
      organization: formData.organization.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim() || null,
      website: formData.website.trim() || null,
      instagram: formData.instagram.trim() || null,
      partnership_type: formData.partnership_type,
      location: formData.location.trim() || null,
      message: formData.message.trim(),
      status: "PENDING",
    });

    if (error) {
      setErrorMsg(error.message);
      setSubmitting(false);
    } else {
      setSubmitted(true);
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 text-center border border-navy/10 shadow-xl">
          <div className="w-16 h-16 rounded-full bg-peach/20 text-peach flex items-center justify-center mx-auto mb-4">
            <CheckCircleIcon size={32} />
          </div>
          <h1 className="font-display text-3xl font-black text-navy mb-2">Message Received!</h1>
          <p className="text-xs text-navy-60 font-body mb-6">
            Thanks for reaching out! Our partnerships team will review your message and get back to you within 24 hours.
          </p>
          <Link
            href="/partners"
            className="w-full py-3.5 rounded-full bg-navy text-cream font-display text-xs font-bold uppercase tracking-wider block text-center"
          >
            Explore Partner Directory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream text-navy py-12 px-4">
      <div className="max-w-xl mx-auto">
        <Link
          href="/partners"
          className="inline-flex items-center gap-2 text-xs font-display font-bold uppercase tracking-wider text-navy-60 hover:text-navy mb-8 transition-colors"
        >
          <ArrowLeftIcon size={14} /> Back to Partners
        </Link>

        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-navy/10 shadow-xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink/15 text-pink font-display text-[11px] font-bold uppercase tracking-wider mb-4">
            <HandshakeIcon size={14} /> Let&apos;s Build Together
          </div>

          <h1 className="font-display text-3xl font-black text-navy mb-2">
            Partner With Us
          </h1>
          <p className="text-xs text-navy-60 font-body mb-6">
            Host an event, offer a member perk, sponsor a meetup, or collaborate on a unique experience in Kochi.
          </p>

          {errorMsg && (
            <div className="p-4 rounded-2xl bg-pink/10 text-pink text-xs mb-6">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-display font-bold uppercase text-navy-60 mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Rahul Menon"
                  className="w-full p-3 rounded-xl border border-navy/15 bg-cream/30 focus:outline-none focus:border-navy text-sm font-body"
                />
              </div>

              <div>
                <label className="block text-[11px] font-display font-bold uppercase text-navy-60 mb-1">
                  Organization / Brand *
                </label>
                <input
                  type="text"
                  required
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  placeholder="Coastline Cafe"
                  className="w-full p-3 rounded-xl border border-navy/15 bg-cream/30 focus:outline-none focus:border-navy text-sm font-body"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-display font-bold uppercase text-navy-60 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="rahul@coastline.in"
                  className="w-full p-3 rounded-xl border border-navy/15 bg-cream/30 focus:outline-none focus:border-navy text-sm font-body"
                />
              </div>

              <div>
                <label className="block text-[11px] font-display font-bold uppercase text-navy-60 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full p-3 rounded-xl border border-navy/15 bg-cream/30 focus:outline-none focus:border-navy text-sm font-body"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-display font-bold uppercase text-navy-60 mb-1">
                Partnership Type *
              </label>
              <select
                value={formData.partnership_type}
                onChange={(e) => setFormData({ ...formData, partnership_type: e.target.value })}
                className="w-full p-3 rounded-xl border border-navy/15 bg-cream/30 focus:outline-none focus:border-navy text-sm font-body"
              >
                <option value="COLLABORATE">Collaborate on an Event</option>
                <option value="HOST">Host an Event at Venue</option>
                <option value="SPONSOR">Sponsor an Event / Giveaways</option>
                <option value="OFFER_PERK">Offer a Member Exclusive Perk</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-display font-bold uppercase text-navy-60 mb-1">
                  Instagram Handle
                </label>
                <input
                  type="text"
                  value={formData.instagram}
                  onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                  placeholder="@coastlinecoffee"
                  className="w-full p-3 rounded-xl border border-navy/15 bg-cream/30 focus:outline-none focus:border-navy text-sm font-body"
                />
              </div>

              <div>
                <label className="block text-[11px] font-display font-bold uppercase text-navy-60 mb-1">
                  Location / Area
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Fort Kochi, Ernakulam"
                  className="w-full p-3 rounded-xl border border-navy/15 bg-cream/30 focus:outline-none focus:border-navy text-sm font-body"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-display font-bold uppercase text-navy-60 mb-1">
                Message / Idea *
              </label>
              <textarea
                rows={4}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Tell us what you have in mind or what perk you'd like to offer to our circle..."
                className="w-full p-3 rounded-xl border border-navy/15 bg-cream/30 focus:outline-none focus:border-navy text-sm font-body"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 rounded-full bg-navy text-cream font-display text-xs font-bold uppercase tracking-wider hover:bg-blue transition-all disabled:opacity-50 mt-2"
            >
              {submitting ? "Submitting..." : "Let's Talk →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
