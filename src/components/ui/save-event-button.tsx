"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HeartIcon } from "@/components/ui/minimal-graphics";

interface SaveEventButtonProps {
  eventId: string;
  initialSaved?: boolean;
  className?: string;
}

export default function SaveEventButton({
  eventId,
  initialSaved = false,
  className = "",
}: SaveEventButtonProps) {
  const [saved, setSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setLoading(true);
    const newSavedState = !saved;
    setSaved(newSavedState);

    try {
      const res = await fetch("/api/saved-events", {
        method: newSavedState ? "POST" : "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event_id: eventId }),
      });

      if (res.status === 401) {
        setSaved(initialSaved);
        router.push(`/login?redirectTo=/events`);
        return;
      }

      if (!res.ok) {
        setSaved(initialSaved);
      }
    } catch (err) {
      console.error("Failed to toggle save event", err);
      setSaved(initialSaved);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={loading}
      title={saved ? "Unsave event" : "Save event"}
      className={`p-2.5 rounded-full transition-all flex items-center justify-center ${
        saved
          ? "bg-pink text-white shadow-md scale-105"
          : "bg-white/80 backdrop-blur-sm text-navy hover:text-pink hover:bg-white shadow-sm"
      } ${className}`}
    >
      <HeartIcon size={18} className={saved ? "fill-current" : ""} />
    </button>
  );
}
