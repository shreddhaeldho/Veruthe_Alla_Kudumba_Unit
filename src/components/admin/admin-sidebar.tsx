"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/ui/logo";
import {
  LayoutDashboard,
  Calendar,
  Ticket,
  QrCode,
  Users,
  ShieldCheck,
  Handshake,
  CreditCard,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
  MessageSquare,
  Bell,
  Sparkles,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/events", label: "Events", icon: Calendar },
  { href: "/admin/bookings", label: "Bookings", icon: Ticket },
  { href: "/admin/check-in", label: "Check-in", icon: QrCode },
  { href: "/admin/members", label: "Founding Members", icon: ShieldCheck },
  { href: "/admin/reviews", label: "Reviews", icon: MessageSquare },
  { href: "/admin/partners", label: "Partners", icon: Handshake },
  { href: "/admin/notifications", label: "Notifications", icon: Bell },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/payments", label: "Payments", icon: CreditCard },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/settings/membership", label: "Plan Settings", icon: Sparkles },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const NavLinks = () => (
    <div className="flex flex-col gap-1.5 flex-grow">
      {navItems.map((item) => {
        const isActive = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3.5 px-4 py-2.5 rounded-xl font-display text-sm font-semibold transition-all ${
              isActive
                ? "bg-blue text-white shadow-md shadow-blue/20"
                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <Icon size={18} className="flex-shrink-0" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </div>
  );

  return (
    <>
      {/* Mobile Top Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <Logo size="sm" className="[&_span]:text-white [&_span:last-child]:text-slate-400" />
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-slate-300 hover:text-white"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 top-16 bg-slate-950 z-40 p-6 flex flex-col justify-between overflow-y-auto">
          <NavLinks />
          <div className="pt-6 border-t border-slate-800 flex flex-col gap-3">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white"
            >
              <ExternalLink size={14} /> View Public Website
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-xs font-semibold text-pink hover:text-pink/80 pt-2"
            >
              <LogOut size={14} /> Log Out
            </button>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col justify-between w-64 bg-slate-950 border-r border-slate-800/80 p-6 h-screen sticky top-0 flex-shrink-0 overflow-y-auto">
        <div>
          {/* Logo & Operational Label */}
          <div className="mb-8">
            <Logo size="md" className="[&_span]:text-white [&_span:last-child]:text-slate-400" />
            <div className="mt-3 inline-block px-2.5 py-0.5 rounded-full bg-slate-800 text-[10px] font-mono tracking-widest text-slate-300 uppercase font-bold">
              HQ • Ops Dashboard
            </div>
          </div>

          <NavLinks />
        </div>

        {/* Footer actions */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col gap-3 mt-6">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ExternalLink size={14} /> View Public Website
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-xs font-semibold text-pink hover:text-pink/80 transition-colors pt-1"
          >
            <LogOut size={14} /> Log Out
          </button>
        </div>
      </aside>
    </>
  );
}
