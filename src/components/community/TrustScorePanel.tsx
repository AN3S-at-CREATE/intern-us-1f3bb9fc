import { GlassCard } from "@/components/ui/GlassCard";
import { Shield, CheckCircle, Award, BookOpen, Users } from "lucide-react";
import type { TrustScore } from "@/hooks/useCommunity";

interface TrustScorePanelProps {
  trustScore: TrustScore | null;
}

export function TrustScorePanel({ trustScore }: TrustScorePanelProps) {
  const score = trustScore?.score || 0;
  const maxScore = 100;
  const percentage = Math.min((score / maxScore) * 100, 100);
  
  const getTrustLevel = (score: number) => {
    if (score >= 80) return { label: "Trusted", color: "text-success", bg: "bg-success/20" };
    if (score >= 60) return { label: "Reliable", color: "text-primary", bg: "bg-primary/20" };
    if (score >= 40) return { label: "Growing", color: "text-warning", bg: "bg-warning/20" };
    if (score >= 20) return { label: "Starter", color: "text-accent", bg: "bg-accent/20" };
    return { label: "New", color: "text-muted-foreground", bg: "bg-muted" };
  };

  const level = getTrustLevel(score);

  const stats = [
    { 
      icon: Award, 
      label: "Endorsements Received", 
      value: trustScore?.endorsements_received || 0,
      color: "text-primary" 
    },
    { 
      icon: Users, 
      label: "Endorsements Given", 
      value: trustScore?.endorsements_given || 0,
      color: "text-secondary" 
    },
    { 
      icon: BookOpen, 
      label: "Modules Completed", 
      value: trustScore?.modules_completed || 0,
      color: "text-accent" 
    },
  ];

  return (
    <GlassCard className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-lg font-semibold text-foreground flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Trust Score
        </h3>
        <span className={`px-3 py-1 rounded-full text-xs font-ui font-medium ${level.bg} ${level.color}`}>
          {level.label}
        </span>
      </div>

      {/* Ring Gauge */}
      <div className="flex items-center justify-center py-4">
        <div className="relative h-40 w-40">
          {/* Background ring */}
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 160 160">
            <circle
              cx="80"
              cy="80"
              r="70"
              fill="none"
              stroke="currentColor"
              strokeWidth="12"
              className="text-muted/30"
            />
            <circle
              cx="80"
              cy="80"
              r="70"
              fill="none"
              stroke="url(#trustGradient)"
              strokeWidth="12"
              strokeDasharray={`${percentage * 4.4} 440`}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="trustGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(var(--primary))" />
                <stop offset="100%" stopColor="hsl(var(--secondary))" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-heading text-4xl font-bold text-foreground">{score}</span>
            <span className="text-xs text-muted-foreground font-ui">/ {maxScore}</span>
          </div>
        </div>
      </div>

      {/* Verified badge */}
      {trustScore?.profile_verified && (
        <div className="flex items-center justify-center gap-2 text-sm text-success">
          <CheckCircle className="h-4 w-4" />
          <span>Profile Verified</span>
        </div>
      )}

      {/* Stats */}
      <div className="space-y-3 pt-2 border-t border-border/50">
        {stats.map((stat) => (
          <div key={stat.label} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
              <span className="text-sm text-muted-foreground">{stat.label}</span>
            </div>
            <span className="font-heading font-semibold text-foreground">{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Tips */}
      <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
        <p className="text-xs text-muted-foreground">
          <span className="text-primary font-medium">Tip:</span> Complete skill modules and get peer endorsements to boost your trust score!
        </p>
      </div>
    </GlassCard>
  );
}
