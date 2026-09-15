import Image from "next/image";
import Link from "next/link";
import { getActivePlan, getFoundingMemberCount } from "@/lib/membership";
import {
  SparklesIcon,
  UsersIcon,
  CameraIcon,
  TicketIcon,
  HandshakeIcon,
  ArrowRightIcon,
  UtensilsIcon,
  ActivityIcon,
  PaletteIcon,
  LightbulbIcon,
  CompassIcon,
  HeartIcon,
} from "@/components/ui/minimal-graphics";

export const revalidate = 60; // Refresh every minute

export default async function HomePage() {
  const plan = await getActivePlan();
  const foundingCount = await getFoundingMemberCount();
  const maxFounding = plan?.maximum_members || 50;
  const spotsLeft = Math.max(0, maxFounding - foundingCount);
  const isFull = spotsLeft <= 0;
  const progressPercent = Math.min(100, Math.round((foundingCount / maxFounding) * 100));

  return (
    <div className="flex flex-col min-h-screen bg-cream text-navy overflow-hidden">
      {/* 01 — HERO SECTION */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 px-4 max-w-[1440px] mx-auto w-full">
        <div className="absolute top-10 left-[-100px] w-96 h-96 bg-blush/30 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-40 right-[-100px] w-96 h-96 bg-ltblue rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 flex flex-col items-start gap-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink/15 text-pink font-display text-xs font-bold uppercase tracking-wider">
              <SparklesIcon size={14} /> Your unofficial social circle.
            </div>

            <h1 className="font-logo text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-navy font-bold leading-[1.05] tracking-tight">
              Veruthe Alla<br />
              <span className="text-brown">Kudumba Unit.</span>
            </h1>

            <p className="text-lg md:text-xl text-navy-80 max-w-xl font-body leading-relaxed">
              Meet people. Try things. Make memories. A real-life community for those who want to get out, do something different, and build genuine connections.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/events"
                className="inline-flex items-center gap-3 px-8 py-4 bg-navy text-cream font-display text-sm font-bold uppercase tracking-wider rounded-full hover:bg-blue hover:-translate-y-0.5 hover:shadow-xl transition-all duration-300 group"
              >
                Explore Events
                <ArrowRightIcon size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/membership"
                className="inline-flex items-center gap-2 px-8 py-4 bg-pink text-white font-display text-sm font-bold uppercase tracking-wider rounded-full hover:bg-navy hover:shadow-xl transition-all duration-300"
              >
                {isFull ? "Explore Membership" : `Join Founding 50 — ₹${plan?.price || 199}`}
              </Link>
            </div>

            <div className="flex items-center gap-2 text-pink font-handwritten text-xl font-bold pt-2">
              <SparklesIcon size={20} className="text-pink animate-pulse" />
              <span>Come alone. Bring friends. Leave with new ones.</span>
            </div>
          </div>

          {/* Hero Right Collage */}
          <div className="lg:col-span-5 relative flex justify-center items-center min-h-[420px]">
            <div className="relative w-64 h-80 rounded-3xl overflow-hidden shadow-2xl border-4 border-white transform -rotate-3 hover:rotate-0 transition-transform duration-500 z-10">
              <Image
                src="/images/hero_community.jpg"
                alt="Community gathering at sunset"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute bottom-3 right-3 bg-pink text-white text-xs font-display font-bold uppercase px-3 py-1.5 rounded-full shadow-sm">
                MEET PEOPLE
              </div>
            </div>

            <div className="absolute -top-4 right-2 sm:right-6 w-52 h-40 rounded-2xl overflow-hidden shadow-lg border-4 border-white transform rotate-6 hover:rotate-0 transition-transform duration-500 z-20">
              <Image
                src="/images/sunset_social.jpg"
                alt="Sunset social event"
                fill
                className="object-cover"
              />
              <div className="absolute top-2 left-2 bg-cream/90 backdrop-blur-sm text-navy font-handwritten text-sm px-2.5 py-1 rounded-full shadow-sm">
                no boring weekends
              </div>
            </div>

            <div className="absolute -bottom-6 left-2 sm:left-6 w-48 h-36 rounded-2xl overflow-hidden shadow-lg border-4 border-white transform rotate-3 hover:rotate-0 transition-transform duration-500 z-20">
              <Image
                src="/images/food_walk.jpg"
                alt="Food walk experience"
                fill
                className="object-cover"
              />
              <div className="absolute bottom-2 left-2 bg-peach text-white text-xs font-display font-bold uppercase px-2.5 py-1 rounded-full shadow-sm">
                TRY THINGS
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE BANNER */}
      <div className="w-full bg-navy py-4 overflow-hidden select-none border-y border-navy-80">
        <div className="flex w-max animate-marquee space-x-8 text-cream font-display font-black text-sm uppercase tracking-widest items-center">
          <span>MEET PEOPLE</span>
          <span className="text-pink">✦</span>
          <span>TRY THINGS</span>
          <span className="text-peach">✦</span>
          <span>MAKE MEMORIES</span>
          <span className="text-blue">✦</span>
          <span>SHOW UP</span>
          <span className="text-pink">✦</span>
          <span>DO SOMETHING DIFFERENT</span>
          <span className="text-peach">✦</span>
        </div>
      </div>

      {/* FOUNDING 50 PROGRESS BANNER */}
      {!isFull && (
        <section className="bg-blush/60 border-b border-navy/10 py-6 px-4">
          <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-pink text-white flex items-center justify-center font-display font-black text-lg shadow-sm">
                50
              </div>
              <div>
                <h3 className="font-display font-bold text-navy text-lg">
                  Founding 50 Membership is Live
                </h3>
                <p className="text-xs text-navy-60 font-body">
                  Limited to the first 50 members. Only {spotsLeft} spot{spotsLeft === 1 ? "" : "s"} remaining!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6 w-full md:w-auto">
              <div className="w-48 bg-white h-3.5 rounded-full overflow-hidden border border-navy/10 relative">
                <div
                  className="h-full bg-pink rounded-full transition-all duration-1000"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <Link
                href="/membership"
                className="px-6 py-2.5 rounded-full bg-navy text-cream font-display text-xs font-bold uppercase tracking-wider hover:bg-blue transition-all whitespace-nowrap"
              >
                Claim Your Spot →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 02 — WHAT'S HAPPENING IN THE CIRCLE */}
      <section className="py-24 bg-ltblue/30 px-4">
        <div className="max-w-[1280px] mx-auto w-full">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-display font-bold uppercase tracking-widest text-navy-40 block mb-2">
                Curated Experiences
              </span>
              <h2 className="font-display text-4xl md:text-5xl font-extrabold text-navy tracking-tight">
                What&apos;s happening in the circle?
              </h2>
            </div>
            <Link
              href="/events"
              className="inline-flex items-center gap-2 font-display text-sm font-bold text-navy hover:text-pink transition-colors uppercase tracking-wider"
            >
              See all events <ArrowRightIcon size={16} />
            </Link>
          </div>

          <div className="text-center py-20 bg-white rounded-3xl border border-navy/5 shadow-sm w-full">
            <h3 className="font-display text-2xl font-bold text-navy mb-2">
              Events to be announced soon
            </h3>
            <p className="text-navy-60 font-body">
              We are working on some exciting new experiences. Check back soon!
            </p>
          </div>
        </div>
      </section>

      {/* 03 — MEET THE PEOPLE BEHIND THE CIRCLE */}
      <section className="py-24 px-4 max-w-[1280px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6">
            <span className="text-xs font-display font-bold uppercase tracking-widest text-pink block mb-2">
              Community Ethos
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-black text-navy tracking-tight mb-6">
              Meet the people behind the circle.
            </h2>
            <p className="text-navy-80 text-base font-body leading-relaxed mb-6">
              Veruthe Alla Kudumba Unit started with a simple thought: adulting in the city can get repetitive. We wanted a place where showing up alone isn’t awkward, where weekend plans write themselves, and where good conversations flow naturally over chai, sports, food, and games.
            </p>
            <div className="flex flex-col gap-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-pink/15 text-pink flex items-center justify-center flex-shrink-0 mt-0.5">
                  <SparklesIcon size={16} />
                </div>
                <div>
                  <h4 className="font-display font-bold text-navy text-sm">No pressure, just vibes</h4>
                  <p className="text-xs text-navy-60 font-body">Come as you are. Host-led icebreakers ensure nobody feels left out.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-peach/15 text-peach flex items-center justify-center flex-shrink-0 mt-0.5">
                  <UsersIcon size={16} />
                </div>
                <div>
                  <h4 className="font-display font-bold text-navy text-sm">Curated group sizes</h4>
                  <p className="text-xs text-navy-60 font-body">Intimate gatherings where you actually get to talk to everyone.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative flex justify-center">
            <div className="w-full h-96 relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <Image
                src="/images/hero_community.jpg"
                alt="Community hosts and members"
                fill
                className="object-cover"
              />
              <div className="absolute bottom-6 left-6 right-6 bg-cream/90 backdrop-blur-md p-6 rounded-2xl border border-navy/10">
                <p className="font-handwritten text-xl text-navy">
                  &ldquo;We don’t do networking events. We do human connections.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 04 — GOOD PEOPLE KNOW GOOD PEOPLE (PARTNERS) */}
      <section className="py-24 bg-navy text-cream px-4">
        <div className="max-w-[1280px] mx-auto w-full text-center">
          <span className="text-xs font-display font-bold uppercase tracking-widest text-pink block mb-2">
            Partners & Collaborators
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-black tracking-tight mb-6">
            Good people know good people.
          </h2>
          <p className="text-cream/80 max-w-xl mx-auto font-body text-base mb-12">
            We partner with Kochi’s finest cafes, venues, creators, and local brands to craft unforgettable experiences and offer exclusive perks to our members.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-8 mb-12 opacity-80">
            {["Cafes & Micro-roasteries", "Art Studios", "Board Game Hubs", "Culinary Pop-ups", "Outdoor Spaces"].map((item, idx) => (
              <span key={idx} className="px-6 py-3 rounded-full bg-white/10 text-cream font-display text-xs font-bold uppercase tracking-wider border border-white/10">
                {item}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-center gap-4">
            <Link
              href="/partners"
              className="px-8 py-4 rounded-full bg-pink text-white font-display text-xs font-bold uppercase tracking-wider hover:bg-peach transition-all"
            >
              Explore Partner Directory
            </Link>
            <Link
              href="/partner-with-us"
              className="px-8 py-4 rounded-full border border-white/30 text-cream font-display text-xs font-bold uppercase tracking-wider hover:bg-white hover:text-navy transition-all"
            >
              Partner With Us →
            </Link>
          </div>
        </div>
      </section>

      {/* 05 — BE ONE OF THE FIRST 50 (MEMBERSHIP CTA) */}
      <section className="py-24 bg-blush px-4">
        <div className="max-w-[1280px] mx-auto w-full text-center">
          <div className="max-w-xl mx-auto mb-12">
            <span className="text-xs font-display font-bold uppercase tracking-widest text-pink block mb-2">
              Founding Membership
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-black text-navy tracking-tight leading-tight">
              Be one of the first 50.
            </h2>
            <p className="text-navy-80 text-base mt-3 font-body">
              ₹199 for 6 months. Unlock first access to events, member pricing, partner perks, and profile badges.
            </p>
          </div>

          <div className="max-w-md mx-auto bg-white rounded-3xl p-8 border border-navy/10 shadow-xl mb-8">
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-navy/10">
              <span className="font-display font-bold text-navy text-sm">Founding 50 Progress</span>
              <span className="font-display font-black text-pink text-sm">{foundingCount} / {maxFounding}</span>
            </div>
            <div className="w-full bg-cream h-3 rounded-full overflow-hidden mb-6 border border-navy/5">
              <div className="h-full bg-pink rounded-full" style={{ width: `${progressPercent}%` }} />
            </div>

            <Link
              href="/membership"
              className="w-full py-4 rounded-full bg-navy text-cream font-display text-xs font-bold uppercase tracking-wider hover:bg-blue transition-all flex items-center justify-center gap-2"
            >
              {isFull ? "Explore Membership" : "Join the Founding 50 — ₹199"}
              <ArrowRightIcon size={14} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
