"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export function ClientLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col antialiased">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col antialiased bg-cream text-navy pt-20">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
