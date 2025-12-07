import { GlassCard } from "@/components/ui/GlassCard";

const partners = [
  { name: "Standard Bank", initials: "SB" },
  { name: "Vodacom", initials: "VC" },
  { name: "Discovery", initials: "DS" },
  { name: "Nedbank", initials: "NB" },
  { name: "Sasol", initials: "SA" },
  { name: "MTN", initials: "MT" },
  { name: "Anglo American", initials: "AA" },
  { name: "Deloitte", initials: "DL" },
];

export function PartnersSection() {
  return (
    <section className="py-24 relative" id="partners">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
          <p className="text-muted-foreground font-ui uppercase tracking-wider text-sm">
            Trusted by Leading Companies
          </p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold">
            Join{" "}
            <span className="text-glow text-primary">500+ Partners</span>
          </h2>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {partners.map((partner) => (
            <GlassCard
              key={partner.name}
              className="p-6 flex items-center justify-center aspect-[2/1]"
              glow="none"
            >
              <div className="text-center space-y-2">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-muted/50 border border-border">
                  <span className="font-heading font-bold text-muted-foreground">
                    {partner.initials}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground font-ui">
                  {partner.name}
                </p>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}