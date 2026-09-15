import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { HandshakeIcon, SparklesIcon, ArrowRightIcon, PinIcon } from "@/components/ui/minimal-graphics";
import { getUserMembership } from "@/lib/membership";

export const revalidate = 60;

export default async function PartnersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const membership = user ? await getUserMembership(user.id) : null;
  const isMember = membership?.status === "ACTIVE";

  // Fetch partners & active perks
  const { data: partners } = await supabase
    .from("partners")
    .select("*, partner_perks(*)")
    .eq("status", "ACTIVE")
    .order("created_at", { ascending: false });

  const partnerList = partners || [
    {
      id: "p1",
      name: "Coastline Coffee Roasters",
      type: "PERK_PARTNER",
      description: "Artisanal specialty coffee roastery located near Fort Kochi. The perfect spot for Sunday morning conversations.",
      logo_url: "/images/hero_community.jpg",
      location: "Fort Kochi",
      website: "https://example.com",
      instagram: "@coastlinecoffee",
      partner_perks: [
        {
          id: "perk1",
          title: "15% Off All Brews & Pastries",
          description: "Flash your Founding Member badge on your account page to claim.",
          eligibility: "FOUNDING_MEMBER",
          perk_code: "FOUNDER15",
        },
      ],
    },
    {
      id: "p2",
      name: "The Game Vault",
      type: "EVENT_HOST",
      description: "Kochi's premier board game arena featuring 200+ tabletop titles, cozy lounge seating, and craft snacks.",
      logo_url: "/images/game_night.jpg",
      location: "Panampilly Nagar",
      website: "https://example.com",
      instagram: "@thegamevault",
      partner_perks: [
        {
          id: "perk2",
          title: "Free Board Game Pass on Tuesdays",
          description: "Complimentary 2-hour gaming pass for all active circle members.",
          eligibility: "ALL_MEMBERS",
          perk_code: "CIRCLEPLAY",
        },
      ],
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-cream text-navy">
      {/* Hero */}
      <section className="pt-20 pb-12 px-4 max-w-[1280px] mx-auto text-center w-full">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink/15 text-pink font-display text-xs font-bold uppercase tracking-wider mb-6">
          <HandshakeIcon size={14} /> Circle Network
        </span>
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-black text-navy leading-tight tracking-tight mb-4">
          Good people know good people.
        </h1>
        <p className="text-navy-60 text-lg md:text-xl max-w-2xl mx-auto font-body leading-relaxed">
          We collaborate with Kochi’s best local spots, cafes, venues, and creators to bring you memorable experiences and exclusive perks.
        </p>

        <div className="mt-8 flex justify-center">
          <Link
            href="/partner-with-us"
            className="inline-flex items-center gap-2 px-8 py-4 bg-navy text-cream font-display text-xs font-bold uppercase tracking-wider rounded-full hover:bg-blue transition-all"
          >
            Become a Partner <ArrowRightIcon size={14} />
          </Link>
        </div>
      </section>

      {/* Directory Grid */}
      <section className="py-12 px-4 max-w-[1280px] mx-auto w-full pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {partnerList.map((partner) => (
            <div
              key={partner.id}
              className="bg-white rounded-3xl p-8 border border-navy/10 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-display font-bold uppercase tracking-widest text-pink bg-pink/10 px-3 py-1 rounded-full">
                    {partner.type?.replace("_", " ")}
                  </span>
                  {partner.location && (
                    <span className="flex items-center gap-1 text-xs text-navy-60 font-body">
                      <PinIcon size={13} /> {partner.location}
                    </span>
                  )}
                </div>

                <h3 className="font-display text-2xl font-black text-navy mb-2">
                  {partner.name}
                </h3>
                <p className="text-xs text-navy-80 font-body leading-relaxed mb-6">
                  {partner.description}
                </p>

                {/* Perks list */}
                {partner.partner_perks && partner.partner_perks.length > 0 && (
                  <div className="p-4 rounded-2xl bg-cream/70 border border-navy/5 mb-6 space-y-3">
                    <span className="text-[10px] font-display font-bold uppercase tracking-wider text-navy-40 block">
                      Exclusive Member Perk
                    </span>
                    {partner.partner_perks.map((perk: any) => (
                      <div key={perk.id}>
                        <h4 className="font-display font-bold text-navy text-sm">{perk.title}</h4>
                        <p className="text-xs text-navy-60 font-body mt-0.5">{perk.description}</p>
                        
                        {isMember ? (
                          <div className="mt-2 text-xs font-mono font-bold text-pink bg-pink/10 px-3 py-1 rounded-lg inline-block">
                            Perk Code: {perk.perk_code || "SHOW_BADGE"}
                          </div>
                        ) : (
                          <p className="text-[11px] text-pink font-semibold mt-2">
                            🔒 Join Founding 50 to unlock this perk code
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-navy/5 text-xs">
                {partner.instagram && (
                  <a
                    href={`https://instagram.com/${partner.instagram.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-display font-bold text-pink hover:underline"
                  >
                    {partner.instagram} →
                  </a>
                )}
                {partner.website && (
                  <a
                    href={partner.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-display font-bold text-navy hover:underline"
                  >
                    Visit Website →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
