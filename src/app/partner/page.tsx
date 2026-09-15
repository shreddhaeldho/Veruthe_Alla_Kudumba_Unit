import Link from "next/link";
import {
  HandshakeIcon,
  HomeIcon,
  StarIcon,
  UsersIcon,
  PhoneDeviceIcon,
  TargetIcon,
  LightbulbIcon,
  ArrowRightIcon,
} from "@/components/ui/minimal-graphics";

export const metadata = {
  title: "Partner With Us",
  description: "Collaborate, host or sponsor events with Veruthe Alla Kudumba Unit.",
};

export default function PartnerPage() {
  return (
    <div className="flex flex-col min-h-screen bg-cream text-navy">
      {/* Hero */}
      <section className="pt-20 pb-16 px-4 max-w-[1280px] mx-auto text-center w-full">
        <span className="inline-block px-4 py-1.5 rounded-full bg-peach/15 text-peach font-display text-xs font-bold uppercase tracking-wider mb-6">
          Partner With Us
        </span>
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-black text-navy leading-tight tracking-tight mb-6">
          Let&apos;s make something<br />people talk about.
        </h1>
        <p className="text-navy-60 text-lg md:text-xl max-w-2xl mx-auto font-body leading-relaxed">
          Whether you have a venue, a brand, a skill, or just a crazy idea — we&apos;re into it. Let&apos;s create experiences people actually remember.
        </p>
      </section>

      {/* Partner Options */}
      <section className="py-20 bg-navy text-cream px-4">
        <div className="max-w-[1280px] mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Collaborate */}
            <div className="bg-navy-90 border border-cream/10 rounded-3xl p-8 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-peach/20 text-peach flex items-center justify-center mb-6">
                <HandshakeIcon size={32} />
              </div>
              <h3 className="font-display text-2xl font-bold mb-3">Collaborate</h3>
              <p className="text-cream/70 text-sm leading-relaxed mb-6 flex-grow">
                Have an idea? Are you a brand, creator, or community that wants to do something cool together? Let&apos;s talk.
              </p>
              <Link
                href="/contact"
                className="w-full py-3 rounded-full border border-cream/20 text-cream hover:bg-cream hover:text-navy font-display text-xs font-bold uppercase tracking-wider transition-all"
              >
                Let&apos;s Talk →
              </Link>
            </div>

            {/* Host */}
            <div className="bg-navy-90 border border-cream/10 rounded-3xl p-8 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-blue/20 text-blue flex items-center justify-center mb-6">
                <HomeIcon size={32} />
              </div>
              <h3 className="font-display text-2xl font-bold mb-3">Host</h3>
              <p className="text-cream/70 text-sm leading-relaxed mb-6 flex-grow">
                Have a venue, skill or experience? We&apos;re always looking for unique spaces and talented people to create events with.
              </p>
              <Link
                href="/contact"
                className="w-full py-3 rounded-full border border-cream/20 text-cream hover:bg-cream hover:text-navy font-display text-xs font-bold uppercase tracking-wider transition-all"
              >
                Host With Us →
              </Link>
            </div>

            {/* Sponsor */}
            <div className="bg-navy-90 border border-cream/10 rounded-3xl p-8 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-pink/20 text-pink flex items-center justify-center mb-6">
                <StarIcon size={32} />
              </div>
              <h3 className="font-display text-2xl font-bold mb-3">Sponsor</h3>
              <p className="text-cream/70 text-sm leading-relaxed mb-6 flex-grow">
                Want your brand involved in real experiences with real people? No boring sponsorship decks — just authentic integration.
              </p>
              <Link
                href="/contact"
                className="w-full py-3 rounded-full border border-cream/20 text-cream hover:bg-cream hover:text-navy font-display text-xs font-bold uppercase tracking-wider transition-all"
              >
                Sponsor An Event →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Partner */}
      <section className="py-24 px-4 max-w-[1280px] mx-auto w-full">
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2 className="font-display text-4xl font-extrabold text-navy tracking-tight">
            Why partner with us?
          </h2>
          <p className="text-navy-60 text-lg mt-3">
            We&apos;re building a community of real people who actually show up. That&apos;s rare.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="p-8 rounded-3xl bg-white border border-navy/5 shadow-sm flex items-start gap-5">
            <div className="w-12 h-12 rounded-2xl bg-blue/10 text-blue flex items-center justify-center flex-shrink-0">
              <UsersIcon size={24} />
            </div>
            <div>
              <h4 className="font-display text-xl font-bold text-navy mb-2">Engaged Community</h4>
              <p className="text-sm text-navy-60 leading-relaxed">
                Real people who attend events, share experiences, and talk about what they love.
              </p>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-navy/5 shadow-sm flex items-start gap-5">
            <div className="w-12 h-12 rounded-2xl bg-peach/10 text-peach flex items-center justify-center flex-shrink-0">
              <PhoneDeviceIcon size={24} />
            </div>
            <div>
              <h4 className="font-display text-xl font-bold text-navy mb-2">Organic Reach</h4>
              <p className="text-sm text-navy-60 leading-relaxed">
                Our community shares. Your brand gets authentic exposure through real experiences.
              </p>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-navy/5 shadow-sm flex items-start gap-5">
            <div className="w-12 h-12 rounded-2xl bg-pink/10 text-pink flex items-center justify-center flex-shrink-0">
              <TargetIcon size={24} />
            </div>
            <div>
              <h4 className="font-display text-xl font-bold text-navy mb-2">Targeted Audience</h4>
              <p className="text-sm text-navy-60 leading-relaxed">
                Young, social, adventurous people who are always looking for the next cool thing.
              </p>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-navy/5 shadow-sm flex items-start gap-5">
            <div className="w-12 h-12 rounded-2xl bg-navy/10 text-navy flex items-center justify-center flex-shrink-0">
              <LightbulbIcon size={24} />
            </div>
            <div>
              <h4 className="font-display text-xl font-bold text-navy mb-2">Creative Freedom</h4>
              <p className="text-sm text-navy-60 leading-relaxed">
                No boring sponsorship packages. We work together to create something genuinely fun.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-blush px-4 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="font-display text-4xl font-extrabold text-navy tracking-tight mb-4">
            Got something in mind?
          </h2>
          <p className="text-navy-80 text-lg mb-8">
            We&apos;re all ears. Drop us a message and let&apos;s figure it out together.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-3 px-8 py-4 bg-navy text-cream font-display text-sm font-bold uppercase tracking-wider rounded-full hover:bg-blue hover:shadow-xl transition-all"
          >
            Get in Touch
            <ArrowRightIcon size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
