import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, SparklesIcon, UsersIcon } from "@/components/ui/minimal-graphics";
import { InstagramIcon as Instagram } from "@/components/ui/icons";

export const metadata = {
  title: "About Us",
  description:
    "We think life should have more things worth showing up for. Veruthe Alla Kudumba Unit is your unofficial social circle.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-cream text-navy">
      {/* 01 — THE ROUTINE HERO */}
      <section className="pt-20 pb-12 px-4 max-w-[800px] mx-auto text-center w-full">
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 font-display text-4xl sm:text-6xl md:text-7xl font-black text-navy/20 uppercase tracking-tighter select-none">
          <span className="hover:text-navy transition-colors">Work.</span>
          <span className="hover:text-navy transition-colors">College.</span>
          <span className="hover:text-navy transition-colors">Commute.</span>
          <span className="hover:text-navy transition-colors">Scroll.</span>
          <span className="hover:text-navy transition-colors">Sleep.</span>
          <span className="hover:text-navy transition-colors">Repeat.</span>
        </div>

        <div className="my-16">
          <h2 className="font-display text-6xl sm:text-7xl md:text-8xl font-black text-pink tracking-tight uppercase">
            Boring.
          </h2>
        </div>

        <p className="font-display text-2xl sm:text-3xl font-bold text-navy leading-snug max-w-xl mx-auto">
          We think life should have more things worth showing up for.
        </p>
      </section>

      {/* 02 — THE WHY */}
      <section className="py-16 px-4 max-w-[800px] mx-auto w-full">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-navy/5 shadow-sm">
          <p className="text-xl md:text-2xl font-display font-bold text-navy mb-4 leading-relaxed">
            <span className="text-blue">Veruthe Alla Kudumba Unit</span> is your unofficial social circle.
          </p>
          <p className="text-navy-70 text-base md:text-lg leading-relaxed font-body mb-6">
            A real-life community where people come together to meet, try new things, and make memories.
            Not online. Not through a screen. In real life.
          </p>

          <p className="font-display font-bold text-navy text-sm uppercase tracking-wider mb-4">
            We create:
          </p>

          <div className="flex flex-wrap gap-2.5">
            {[
              "Real-life Events",
              "Unplanned Experiences",
              "Opportunities to meet people",
              "Reasons to escape the usual routine",
            ].map((item) => (
              <span
                key={item}
                className="px-4 py-2 rounded-full bg-cream text-navy font-display text-xs font-bold border border-navy/10 shadow-sm"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 03 — BIG STATEMENT */}
      <section className="py-20 bg-navy text-cream px-4 text-center">
        <div className="max-w-[800px] mx-auto flex flex-col gap-2">
          <h2 className="font-display text-4xl sm:text-6xl font-black tracking-tight">
            Meet people.
          </h2>
          <h2 className="font-display text-4xl sm:text-6xl font-black tracking-tight text-pink">
            Try things.
          </h2>
          <h2 className="font-display text-4xl sm:text-6xl font-black tracking-tight">
            Make memories.
          </h2>
        </div>
      </section>

      {/* 04 — COMMUNITY PHOTO */}
      <section className="py-16 px-4 max-w-[1000px] mx-auto w-full">
        <div className="relative h-[360px] sm:h-[480px] rounded-3xl overflow-hidden shadow-xl border-4 border-white">
          <Image
            src="/images/hero_community.jpg"
            alt="Veruthe Alla community gathering"
            fill
            className="object-cover"
          />
        </div>
      </section>

      {/* 05 — THE FOUNDERS */}
      <section className="py-20 bg-ltblue/60 px-4">
        <div className="max-w-[800px] mx-auto text-center w-full">
          <span className="text-xs font-display font-bold uppercase tracking-widest text-blue block mb-2">
            The Humans Behind This
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-navy tracking-tight mb-12">
            We&apos;re just two people who<br />wanted more fun weekends.
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Shreddha */}
            <div className="bg-white rounded-3xl p-8 border border-navy/5 shadow-sm flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-blush text-pink flex items-center justify-center mb-4">
                <UsersIcon size={32} />
              </div>
              <h3 className="font-display text-xl font-bold text-navy">
                Shreddha Eldho
              </h3>
              <a
                href="https://instagram.com/_shreddha._"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-2 text-xs font-display font-bold text-blue hover:text-pink transition-colors"
              >
                <Instagram size={14} />
                @_shreddha._
              </a>
            </div>

            {/* Kevin */}
            <div className="bg-white rounded-3xl p-8 border border-navy/5 shadow-sm flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-ltblue text-blue flex items-center justify-center mb-4">
                <SparklesIcon size={32} />
              </div>
              <h3 className="font-display text-xl font-bold text-navy">
                Kevin Egidues
              </h3>
              <a
                href="https://instagram.com/kevin_egidues_"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-2 text-xs font-display font-bold text-blue hover:text-pink transition-colors"
              >
                <Instagram size={14} />
                @kevin_egidues_
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 06 — CLOSING CTA */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-md mx-auto">
          <p className="font-display text-2xl font-bold text-navy mb-6">
            So... what are you doing this weekend?
          </p>
          <Link
            href="/events"
            className="inline-flex items-center gap-3 px-8 py-4 bg-navy text-cream font-display text-xs font-bold uppercase tracking-wider rounded-full hover:bg-blue hover:shadow-xl transition-all"
          >
            Explore Events
            <ArrowRightIcon size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
