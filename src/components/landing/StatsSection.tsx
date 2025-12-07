import { GlassCard } from "@/components/ui/GlassCard";
import { TrendingUp, Users, Building2, Award } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "25,000+",
    label: "Active Students",
    description: "From 26 universities across all 9 provinces",
    color: "text-primary",
  },
  {
    icon: Building2,
    value: "500+",
    label: "Partner Companies",
    description: "Including top corporates and innovative startups",
    color: "text-secondary",
  },
  {
    icon: TrendingUp,
    value: "85%",
    label: "Placement Rate",
    description: "Students matched with opportunities within 90 days",
    color: "text-accent",
  },
  {
    icon: Award,
    value: "12,000+",
    label: "Successful Placements",
    description: "Internships, WIL, and graduate positions filled",
    color: "text-primary",
  },
];

export function StatsSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <GlassCard
              key={stat.label}
              className="p-8 text-center space-y-4"
              hover={false}
              glow="none"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`inline-flex p-3 rounded-xl bg-muted/50 ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <p className={`font-heading text-4xl font-bold ${stat.color}`}>
                  {stat.value}
                </p>
                <p className="font-heading font-semibold text-foreground">
                  {stat.label}
                </p>
              </div>
              <p className="text-muted-foreground text-sm">
                {stat.description}
              </p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}