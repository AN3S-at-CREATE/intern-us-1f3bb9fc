import { AspectRatio } from "@/components/ui/aspect-ratio";
import { GlassCard } from "@/components/ui/GlassCard";
const placeholderLogo = "/partners/partnerships-coming-soon.svg";
const partners = [{
  name: "University of Cape Town"
}, {
  name: "University of the Witwatersrand"
}, {
  name: "Stellenbosch University"
}, {
  name: "Standard Bank"
}, {
  name: "MTN Group"
}, {
  name: "Vodacom"
}].map(partner => ({
  ...partner,
  logo: placeholderLogo,
  alt: `${partner.name} partnership placeholder`
}));
export function PartnersSection() {
  return <section className="py-24 relative" id="partners">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
          <p className="text-muted-foreground font-ui uppercase tracking-wider text-sm">
            Trusted by Leading Companies & Universities
          </p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold">
            Join <span className="text-glow text-primary">500+ Partners</span>
          </h2>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {partners.map(partner => <GlassCard key={partner.name} glow="none" className="p-4 sm:p-6 flex items-center justify-center aspect-[16/10] bg-background/80 border border-border/60 px-[30px] py-[30px]">
              <AspectRatio ratio={16 / 9} className="flex items-center justify-center w-full">
                <img src={partner.logo} alt={partner.alt} loading="lazy" className="h-full w-full mix-blend-normal object-fill" />
              </AspectRatio>
            </GlassCard>)}
        </div>
      </div>
    </section>;
}