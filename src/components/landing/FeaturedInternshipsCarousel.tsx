import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { 
  MapPin, 
  Clock, 
  Briefcase, 
  Building2, 
  TrendingUp,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Opportunity = Tables<"opportunities">;

export function FeaturedInternshipsCarousel() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeatured() {
      const { data, error } = await supabase
        .from("opportunities")
        .select("*")
        .eq("is_active", true)
        .eq("is_featured", true)
        .order("created_at", { ascending: false })
        .limit(6);

      if (!error && data) {
        setOpportunities(data);
      }
      setLoading(false);
    }

    fetchFeatured();
  }, []);

  // Fallback mock data if no featured opportunities
  const mockOpportunities: Partial<Opportunity>[] = [
    {
      id: "1",
      title: "Software Engineering Intern",
      company_name: "Standard Bank",
      location: "Johannesburg",
      location_type: "hybrid",
      industry: "Finance",
      opportunity_type: "internship",
      stipend_min: 8000,
      stipend_max: 12000,
      duration_months: 6,
    },
    {
      id: "2",
      title: "Data Analytics Graduate",
      company_name: "Discovery",
      location: "Cape Town",
      location_type: "on-site",
      industry: "Insurance",
      opportunity_type: "graduate",
      stipend_min: 15000,
      stipend_max: 20000,
      duration_months: 12,
    },
    {
      id: "3",
      title: "Marketing WIL Placement",
      company_name: "Vodacom",
      location: "Durban",
      location_type: "remote",
      industry: "Telecommunications",
      opportunity_type: "wil",
      stipend_min: 6000,
      stipend_max: 8000,
      duration_months: 3,
    },
    {
      id: "4",
      title: "Civil Engineering Intern",
      company_name: "WBHO Construction",
      location: "Pretoria",
      location_type: "on-site",
      industry: "Construction",
      opportunity_type: "internship",
      stipend_min: 10000,
      stipend_max: 14000,
      duration_months: 6,
    },
    {
      id: "5",
      title: "UX Design Intern",
      company_name: "Takealot",
      location: "Cape Town",
      location_type: "hybrid",
      industry: "E-commerce",
      opportunity_type: "internship",
      stipend_min: 7500,
      stipend_max: 11000,
      duration_months: 4,
    },
  ];

  const displayOpportunities = opportunities.length > 0 ? opportunities : mockOpportunities;

  const getTypeColor = (type: string) => {
    switch (type) {
      case "internship": return "bg-primary/20 text-primary border-primary/30";
      case "graduate": return "bg-secondary/20 text-secondary border-secondary/30";
      case "wil": return "bg-accent/20 text-accent border-accent/30";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  const getLocationIcon = (type: string) => {
    switch (type) {
      case "remote": return "🌐";
      case "hybrid": return "🏠";
      default: return "🏢";
    }
  };

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-secondary/10 rounded-full blur-[150px]" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary font-ui text-sm">
            <TrendingUp className="h-4 w-4" />
            <span>Featured Opportunities</span>
          </div>
          <h2 className="font-heading text-3xl md:text-4xl font-bold">
            Hot Internships{" "}
            <span className="text-glow text-primary">Right Now</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Curated opportunities from top South African employers looking for talent like you.
          </p>
        </div>

        {/* Carousel */}
        <div className="relative px-12">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {displayOpportunities.map((opp, index) => (
                <CarouselItem key={opp.id || index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <GlassCard className="p-6 h-full flex flex-col space-y-4 group">
                    {/* Company Header */}
                    <div className="flex items-start gap-4">
                      <div className="h-14 w-14 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0">
                        <span className="font-heading font-bold text-primary text-lg">
                          {opp.company_name?.substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-heading font-semibold text-foreground truncate">
                          {opp.title}
                        </h3>
                        <p className="text-muted-foreground text-sm flex items-center gap-1">
                          <Building2 className="h-3 w-3" />
                          {opp.company_name}
                        </p>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-ui border ${getTypeColor(opp.opportunity_type || "")}`}>
                        {opp.opportunity_type?.toUpperCase()}
                      </span>
                      <span className="px-2.5 py-1 rounded-full text-xs font-ui bg-muted text-muted-foreground border border-border">
                        {opp.industry}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span>{opp.location}</span>
                        <span className="text-xs">{getLocationIcon(opp.location_type || "")}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 text-secondary" />
                        <span>{opp.duration_months} months</span>
                      </div>
                      {opp.stipend_min && (
                        <div className="flex items-center gap-2 text-sm">
                          <Briefcase className="h-4 w-4 text-accent" />
                          <span className="text-foreground font-semibold">
                            R{opp.stipend_min?.toLocaleString()} - R{opp.stipend_max?.toLocaleString()}
                          </span>
                          <span className="text-muted-foreground">/month</span>
                        </div>
                      )}
                    </div>

                    {/* AI Match Badge */}
                    <div className="flex items-center justify-between pt-2 border-t border-border/50">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <span className="text-xs text-muted-foreground">AI Match Available</span>
                      </div>
                      <div className="h-8 w-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <ArrowRight className="h-4 w-4 text-primary" />
                      </div>
                    </div>
                  </GlassCard>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-0 bg-background/80 border-primary/30 text-primary hover:bg-primary/10 hover:text-primary" />
            <CarouselNext className="right-0 bg-background/80 border-primary/30 text-primary hover:bg-primary/10 hover:text-primary" />
          </Carousel>
        </div>

        {/* View All CTA */}
        <div className="text-center mt-12">
          <Link to="/dashboard/opportunities">
            <NeonButton variant="ghost" size="lg">
              View All Opportunities
              <ArrowRight className="h-5 w-5 ml-2" />
            </NeonButton>
          </Link>
        </div>
      </div>
    </section>
  );
}
