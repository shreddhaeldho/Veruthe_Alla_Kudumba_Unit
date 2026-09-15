"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/logo";
import { Mail, Phone } from "lucide-react";
import { InstagramIcon as Instagram } from "@/components/ui/icons";

const exploreLinks = [
  { href: "/events", label: "Events" },
  { href: "/membership", label: "Founding 50" },
  { href: "/partners", label: "Partners Directory" },
  { href: "/announcements", label: "Community Feed" },
  { href: "/about", label: "About Us" },
];

const involvedLinks = [
  { href: "/partner-with-us", label: "Partner With Us" },
  { href: "/membership/apply", label: "Claim Founding Member Spot" },
  { href: "/signup", label: "Join the Circle" },
];

const connectLinks = [
  { href: "mailto:verutheallakudumbunit@gmail.com", label: "verutheallakudumbunit@gmail.com", icon: Mail },
  { href: "tel:+919562241759", label: "+91 9562241759", icon: Phone },
];

export function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="bg-navy text-cream pt-16 pb-6 border-t border-navy-80">
      <div className="max-w-[1440px] mx-auto px-[clamp(1rem,0.5rem+2vw,2rem)]">
        {/* Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1 max-w-[320px]">
            <Logo size="lg" className="mb-4 [&_span]:text-cream [&_span:last-child]:text-blush" />
            <p className="text-sm text-cream/60 leading-relaxed mt-4 font-body">
              Your unofficial social circle — where people come together to
              meet, try new things, and make memories.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <a
                href="https://www.instagram.com/verutheallakudumbaunit/?utm_source=ig_web_button_share_sheet"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-cream/15 flex items-center justify-center text-cream/60 hover:bg-pink hover:border-pink hover:text-white transition-all"
                aria-label="Instagram - Veruthe Alla"
              >
                <Instagram size={16} />
              </a>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h5 className="font-display text-[length:var(--text-xs)] font-bold tracking-[0.12em] uppercase text-cream/40 mb-5">
              Explore
            </h5>
            {exploreLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-sm text-cream/70 mb-3 hover:text-pink transition-colors font-body"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Get Involved */}
          <div>
            <h5 className="font-display text-[length:var(--text-xs)] font-bold tracking-[0.12em] uppercase text-cream/40 mb-5">
              Get Involved
            </h5>
            {involvedLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-sm text-cream/70 mb-3 hover:text-pink transition-colors font-body"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Connect */}
          <div>
            <h5 className="font-display text-[length:var(--text-xs)] font-bold tracking-[0.12em] uppercase text-cream/40 mb-5">
              Connect
            </h5>
            {connectLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="flex items-center gap-2 text-sm text-cream/70 mb-3 hover:text-pink transition-colors font-body"
              >
                <link.icon size={14} className="flex-shrink-0" />
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-cream/8">
          <p className="text-xs text-cream/40 font-body">
            © {new Date().getFullYear()} Veruthe Alla Kudumba Unit. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/terms" className="text-xs text-cream/40 hover:text-cream/70 transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="text-xs text-cream/40 hover:text-cream/70 transition-colors">
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
