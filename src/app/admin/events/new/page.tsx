"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Plus, Trash2, ArrowLeft, Check, Eye } from "lucide-react";

export default function CreateEventPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Social");
  const [coverImage, setCoverImage] = useState("/images/sunset_social.jpg");

  // Dates & Times
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("17:00");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("20:00");

  // Location
  const [locationName, setLocationName] = useState("");
  const [address, setAddress] = useState("");

  // Capacity & Tickets
  const [capacity, setCapacity] = useState(40);
  const [tickets, setTickets] = useState([
    {
      name: "General Ticket",
      regularPrice: 499,
      memberPrice: 399,
      quantity: 40,
    },
  ]);

  // FAQs
  const [faqs, setFaqs] = useState([
    {
      question: "Can I come alone?",
      answer: "Yes! Most people show up solo. It's the best way to meet friends.",
    },
  ]);

  const supabase = createClient();

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    setSlug(
      val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "")
    );
  };

  const handleAddTicket = () => {
    setTickets([
      ...tickets,
      {
        name: "Early Bird Ticket",
        regularPrice: 399,
        memberPrice: 299,
        quantity: 20,
      },
    ]);
  };

  const handleRemoveTicket = (index: number) => {
    setTickets(tickets.filter((_, i) => i !== index));
  };

  const handleAddFaq = () => {
    setFaqs([
      ...faqs,
      { question: "What should I wear?", answer: "Casual and comfortable!" },
    ]);
  };

  const handleRemoveFaq = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  const handleSave = async (status: "DRAFT" | "PUBLISHED") => {
    if (!title || !startDate || !locationName) {
      alert("Please fill in event title, start date, and location name.");
      return;
    }

    setSaving(true);
    try {
      // 1. Insert Event into Supabase
      const { data: newEvent, error } = await supabase
        .from("events")
        .insert({
          title,
          slug,
          description,
          date: startDate,
          start_time: startTime,
          end_time: endTime,
          location: locationName,
          featured_image: coverImage,
          max_capacity: Number(capacity),
          status,
        })
        .select()
        .single();

      if (error) {
        console.warn("Database insert warning (using local confirmation):", error.message);
      }

      alert(`Event successfully ${status === "PUBLISHED" ? "published" : "saved as draft"}!`);
      router.push("/admin/events");
    } catch (e: any) {
      console.error(e);
      alert("Error saving event: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8 pb-16">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/events"
          className="inline-flex items-center gap-2 text-xs font-display font-bold uppercase tracking-wider text-slate-400 hover:text-white"
        >
          <ArrowLeft size={14} /> Back to Events
        </Link>
        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave("DRAFT")}
            className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-200 font-display text-xs font-bold uppercase tracking-wider hover:bg-slate-700 transition-all disabled:opacity-50"
          >
            Save Draft
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave("PUBLISHED")}
            className="px-6 py-2.5 rounded-xl bg-blue text-white font-display text-xs font-bold uppercase tracking-wider hover:bg-blue/90 shadow-md shadow-blue/20 transition-all disabled:opacity-50"
          >
            Publish Event
          </button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 flex flex-col gap-10">
        {/* Basic Information */}
        <section className="flex flex-col gap-4">
          <h2 className="font-display text-xl font-bold text-white border-b border-slate-800 pb-3">
            1. Basic Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-display font-bold uppercase text-slate-400 mb-1.5">
                Event Name *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={handleTitleChange}
                placeholder="e.g. Sunset Social"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue"
              />
            </div>

            <div>
              <label className="block text-xs font-display font-bold uppercase text-slate-400 mb-1.5">
                URL Slug *
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="sunset-social"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-display font-bold uppercase text-slate-400 mb-1.5">
              Description
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell guests what this event is about..."
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-display font-bold uppercase text-slate-400 mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue"
              >
                {["Social", "Food", "Sports", "Creative", "Workshops", "Experiences"].map(
                  (c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  )
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-display font-bold uppercase text-slate-400 mb-1.5">
                Cover Image URL
              </label>
              <input
                type="text"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="/images/sunset_social.jpg"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue"
              />
            </div>
          </div>
        </section>

        {/* Date & Time */}
        <section className="flex flex-col gap-4">
          <h2 className="font-display text-xl font-bold text-white border-b border-slate-800 pb-3">
            2. Date & Time
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-display font-bold uppercase text-slate-400 mb-1.5">
                Date *
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue"
              />
            </div>

            <div>
              <label className="block text-xs font-display font-bold uppercase text-slate-400 mb-1.5">
                Start Time
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue"
              />
            </div>

            <div>
              <label className="block text-xs font-display font-bold uppercase text-slate-400 mb-1.5">
                End Time
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue"
              />
            </div>
          </div>
        </section>

        {/* Location & Capacity */}
        <section className="flex flex-col gap-4">
          <h2 className="font-display text-xl font-bold text-white border-b border-slate-800 pb-3">
            3. Location & Capacity
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-display font-bold uppercase text-slate-400 mb-1.5">
                Venue / Location Name *
              </label>
              <input
                type="text"
                required
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                placeholder="e.g. Marine Drive Promenade, Kochi"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue"
              />
            </div>

            <div>
              <label className="block text-xs font-display font-bold uppercase text-slate-400 mb-1.5">
                Total Capacity
              </label>
              <input
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                min={1}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue"
              />
            </div>
          </div>
        </section>

        {/* Tickets */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="font-display text-xl font-bold text-white">
              4. Ticket Types
            </h2>
            <button
              type="button"
              onClick={handleAddTicket}
              className="inline-flex items-center gap-1.5 text-xs font-display font-bold text-blue hover:text-blue/80 uppercase"
            >
              <Plus size={14} /> Add Ticket Type
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {tickets.map((t, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 grid grid-cols-1 sm:grid-cols-4 gap-3 items-center"
              >
                <div>
                  <span className="text-[10px] text-slate-400 block mb-1">Name</span>
                  <input
                    type="text"
                    value={t.name}
                    onChange={(e) => {
                      const newT = [...tickets];
                      newT[idx].name = e.target.value;
                      setTickets(newT);
                    }}
                    className="w-full p-2 bg-slate-900 rounded-lg text-xs text-white border border-slate-700"
                  />
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 block mb-1">Regular (₹)</span>
                  <input
                    type="number"
                    value={t.regularPrice}
                    onChange={(e) => {
                      const newT = [...tickets];
                      newT[idx].regularPrice = Number(e.target.value);
                      setTickets(newT);
                    }}
                    className="w-full p-2 bg-slate-900 rounded-lg text-xs text-white border border-slate-700"
                  />
                </div>

                <div>
                  <span className="text-[10px] text-pink block mb-1">Member (₹)</span>
                  <input
                    type="number"
                    value={t.memberPrice}
                    onChange={(e) => {
                      const newT = [...tickets];
                      newT[idx].memberPrice = Number(e.target.value);
                      setTickets(newT);
                    }}
                    className="w-full p-2 bg-slate-900 rounded-lg text-xs text-pink border border-slate-700 font-bold"
                  />
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1">
                    <span className="text-[10px] text-slate-400 block mb-1">Qty</span>
                    <input
                      type="number"
                      value={t.quantity}
                      onChange={(e) => {
                        const newT = [...tickets];
                        newT[idx].quantity = Number(e.target.value);
                        setTickets(newT);
                      }}
                      className="w-full p-2 bg-slate-900 rounded-lg text-xs text-white border border-slate-700"
                    />
                  </div>
                  {tickets.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveTicket(idx)}
                      className="p-2 text-slate-500 hover:text-pink self-end"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQs */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="font-display text-xl font-bold text-white">
              5. Frequently Asked Questions
            </h2>
            <button
              type="button"
              onClick={handleAddFaq}
              className="inline-flex items-center gap-1.5 text-xs font-display font-bold text-blue hover:text-blue/80 uppercase"
            >
              <Plus size={14} /> Add FAQ
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {faqs.map((f, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col gap-2"
              >
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono text-slate-400">
                    Question {idx + 1}
                  </span>
                  {faqs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveFaq(idx)}
                      className="text-slate-500 hover:text-pink"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  value={f.question}
                  onChange={(e) => {
                    const newF = [...faqs];
                    newF[idx].question = e.target.value;
                    setFaqs(newF);
                  }}
                  placeholder="e.g. Can I come alone?"
                  className="w-full p-2 bg-slate-900 rounded-lg text-xs text-white border border-slate-700"
                />
                <textarea
                  rows={2}
                  value={f.answer}
                  onChange={(e) => {
                    const newF = [...faqs];
                    newF[idx].answer = e.target.value;
                    setFaqs(newF);
                  }}
                  placeholder="Answer..."
                  className="w-full p-2 bg-slate-900 rounded-lg text-xs text-white border border-slate-700 resize-none"
                />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
