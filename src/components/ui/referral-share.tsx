"use client";

import { useState } from "react";

interface ReferralShareProps {
  code: string;
}

export default function ReferralShare({ code }: ReferralShareProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== "undefined" 
    ? `${window.location.origin}/join?ref=${code}` 
    : `https://verutheallakudumbaunit.com/join?ref=${code}`;

  const shareText = `Join me on Veruthe Alla Kudumba Unit — Kochi's unofficial social circle! Sign up here: ${shareUrl}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (e) {
      console.error("Copy failed", e);
    }
  };

  const handleWhatsAppShare = () => {
    const waUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(waUrl, "_blank");
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && "share" in navigator && typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: "Veruthe Alla Kudumba Unit",
          text: "Join me on Veruthe Alla Kudumba Unit!",
          url: shareUrl,
        });
      } catch (err) {
        console.error("Share failed", err);
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Code Display Box */}
      <div className="p-4 bg-cream/70 rounded-2xl border border-navy/10 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-display font-bold uppercase tracking-widest text-navy-40 block">
            Your Code
          </span>
          <span className="font-mono font-bold text-navy text-lg">{code}</span>
        </div>
        <button
          onClick={handleCopy}
          className="px-4 py-2 rounded-xl bg-navy text-cream font-display text-xs font-bold uppercase tracking-wider hover:bg-blue transition-all"
        >
          {copied ? "Copied! ✨" : "Copy Link"}
        </button>
      </div>

      {/* Share Buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleWhatsAppShare}
          className="flex-1 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-display text-xs font-bold uppercase tracking-wider transition-all text-center"
        >
          WhatsApp Share
        </button>
        {typeof navigator !== "undefined" && "share" in navigator && (
          <button
            onClick={handleNativeShare}
            className="px-4 py-3 rounded-full border border-navy/20 text-navy font-display text-xs font-bold uppercase tracking-wider hover:bg-navy hover:text-white transition-all"
          >
            More
          </button>
        )}
      </div>
    </div>
  );
}
