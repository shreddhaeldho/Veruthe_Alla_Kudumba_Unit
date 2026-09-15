"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/cn";
import { Menu, X } from "lucide-react";
import { InstagramIcon as Instagram } from "@/components/ui/icons";
import NotificationBell from "@/components/layout/notification-bell";

const navLinks = [
  { href: "/events", label: "Events" },
  { href: "/membership", label: "Founding 50" },
  { href: "/partners", label: "Partners" },
  { href: "/announcements", label: "Updates" },
  { href: "/about", label: "About" },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-350",
          scrolled
            ? "bg-cream/95 backdrop-blur-xl shadow-[0_1px_20px_rgba(3,11,19,0.06)] py-2.5"
            : "py-4"
        )}
      >
        <div className="max-w-[1440px] mx-auto px-[clamp(1rem,0.5rem+2vw,2rem)] flex items-center justify-between">
          {/* Logo */}
          <div className="z-[500]">
            <Logo size={scrolled ? "sm" : "md"} />
          </div>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-display text-[length:var(--text-sm)] font-semibold text-navy tracking-wide relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-pink rounded-full transition-all duration-350 ease-[var(--ease-out)] group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* Desktop Right */}
          <div className="hidden lg:flex items-center gap-4">
            <NotificationBell />

            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-navy hover:text-pink transition-colors p-1"
              aria-label="Instagram"
            >
              <Instagram size={20} />
            </a>
            <Link
              href="/login"
              className="font-display text-[length:var(--text-sm)] font-semibold text-navy hover:text-blue transition-colors"
            >
              Account
            </Link>
            <Link
              href="/events"
              className="inline-flex items-center gap-2 px-6 py-3 bg-navy text-cream font-display text-[length:var(--text-sm)] font-bold uppercase tracking-wider rounded-full hover:bg-blue hover:-translate-y-0.5 hover:shadow-lg transition-all duration-350"
            >
              Explore Events
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden z-[500] p-2"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? (
              <X size={24} className="text-navy" />
            ) : (
              <Menu size={24} className="text-navy" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed inset-0 bg-cream z-40 flex flex-col items-center justify-center gap-6 transition-all duration-500",
          menuOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none"
        )}
      >
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setMenuOpen(false)}
            className="font-display text-[length:var(--text-3xl)] font-extrabold text-navy hover:text-pink transition-colors"
          >
            {link.label}
          </Link>
        ))}
        <div className="flex flex-col items-center gap-3 mt-4">
          <Link
            href="/account"
            onClick={() => setMenuOpen(false)}
            className="font-display text-[length:var(--text-xl)] font-bold text-navy-60 hover:text-navy transition-colors"
          >
            My Account
          </Link>
          <Link
            href="/events"
            onClick={() => setMenuOpen(false)}
            className="inline-flex items-center gap-2 px-8 py-4 bg-navy text-cream font-display text-base font-bold uppercase tracking-wider rounded-full mt-2"
          >
            Explore Events →
          </Link>
        </div>
      </div>
    </>
  );
}
