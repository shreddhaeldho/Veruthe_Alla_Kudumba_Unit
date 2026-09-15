import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { InstagramIcon as Instagram } from "@/components/ui/icons";

export const metadata = {
  title: "Contact",
  description: "Get in touch with the Veruthe Alla Kudumba Unit team.",
};

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen bg-cream text-navy py-16 px-4">
      <div className="max-w-xl mx-auto w-full bg-white rounded-3xl p-8 sm:p-12 border border-navy/5 shadow-xl text-center">
        <span className="inline-block px-4 py-1.5 rounded-full bg-peach/15 text-peach font-display text-xs font-bold uppercase tracking-wider mb-4">
          Say Hello
        </span>
        <h1 className="font-display text-4xl font-extrabold text-navy tracking-tight mb-3">
          Get in Touch
        </h1>
        <p className="text-navy-60 text-sm font-body mb-8">
          Got a question, an event idea, or just want to chat? Reach out to us directly.
        </p>

        <div className="flex flex-col gap-4 text-left mb-8">
          <a
            href="mailto:verutheallakudumbunit@gmail.com"
            className="flex items-center gap-4 p-4 rounded-2xl bg-cream border border-navy/5 hover:border-navy/20 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-pink/15 text-pink flex items-center justify-center flex-shrink-0">
              <Mail size={18} />
            </div>
            <div>
              <span className="text-[10px] font-display font-bold uppercase text-navy-40 block">Email Us</span>
              <span className="text-sm font-bold text-navy group-hover:text-pink transition-colors">verutheallakudumbunit@gmail.com</span>
            </div>
          </a>

          <a
            href="https://wa.me/919562241759"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 rounded-2xl bg-cream border border-navy/5 hover:border-navy/20 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-green-100 text-green-700 flex items-center justify-center flex-shrink-0">
              <Phone size={18} />
            </div>
            <div>
              <span className="text-[10px] font-display font-bold uppercase text-navy-40 block">WhatsApp / Phone</span>
              <span className="text-sm font-bold text-navy group-hover:text-green-700 transition-colors">+91 9562241759</span>
            </div>
          </a>

          <a
            href="https://instagram.com/_shreddha._"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 rounded-2xl bg-cream border border-navy/5 hover:border-navy/20 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue/15 text-blue flex items-center justify-center flex-shrink-0">
              <Instagram size={18} />
            </div>
            <div>
              <span className="text-[10px] font-display font-bold uppercase text-navy-40 block">Instagram</span>
              <span className="text-sm font-bold text-navy group-hover:text-blue transition-colors">@_shreddha._</span>
            </div>
          </a>
        </div>

        <Link
          href="/"
          className="text-xs font-display font-bold uppercase tracking-wider text-navy-40 hover:text-navy"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
