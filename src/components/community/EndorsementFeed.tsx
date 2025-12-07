import { GlassCard } from "@/components/ui/GlassCard";
import { Award, Heart, MessageSquare, ArrowRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { Endorsement } from "@/hooks/useCommunity";

interface EndorsementFeedProps {
  endorsements: Endorsement[];
}

export function EndorsementFeed({ endorsements }: EndorsementFeedProps) {
  if (endorsements.length === 0) {
    return (
      <GlassCard className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Award className="h-5 w-5 text-secondary" />
          <h3 className="font-heading text-lg font-semibold text-foreground">Endorsement Feed</h3>
        </div>
        <div className="text-center py-8">
          <Award className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">No endorsements yet</p>
          <p className="text-xs text-muted-foreground mt-1">Be the first to endorse a peer!</p>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Award className="h-5 w-5 text-secondary" />
          <h3 className="font-heading text-lg font-semibold text-foreground">Endorsement Feed</h3>
        </div>
        <span className="text-xs text-muted-foreground">{endorsements.length} recent</span>
      </div>

      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
        {endorsements.map((endorsement) => (
          <div 
            key={endorsement.id}
            className="p-4 rounded-xl bg-muted/30 border border-border/50 space-y-3 hover:border-secondary/30 transition-colors"
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2 text-sm">
                <div className="h-8 w-8 rounded-full bg-secondary/20 border border-secondary/30 flex items-center justify-center">
                  <span className="text-xs font-semibold text-secondary">
                    {endorsement.from_user_name?.charAt(0).toUpperCase() || "?"}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-foreground">{endorsement.from_user_name}</span>
                  <span className="text-muted-foreground mx-1.5">endorsed</span>
                  <span className="font-medium text-foreground">{endorsement.to_user_name}</span>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(endorsement.created_at), { addSuffix: true })}
              </span>
            </div>

            {/* Skill badge */}
            <div className="flex items-center gap-2">
              <ArrowRight className="h-3 w-3 text-muted-foreground" />
              <span className="px-3 py-1 rounded-full text-xs font-ui bg-secondary/20 text-secondary border border-secondary/30">
                {endorsement.skill_name}
              </span>
              {endorsement.is_verified && (
                <span className="px-2 py-0.5 rounded-full text-xs bg-success/20 text-success">
                  Verified
                </span>
              )}
            </div>

            {/* Message */}
            {endorsement.message && (
              <p className="text-sm text-muted-foreground italic pl-5 border-l-2 border-secondary/30">
                "{endorsement.message}"
              </p>
            )}

            {/* Actions */}
            <div className="flex items-center gap-4 pt-1">
              <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">
                <Heart className="h-3.5 w-3.5" />
                <span>Like</span>
              </button>
              <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">
                <MessageSquare className="h-3.5 w-3.5" />
                <span>Comment</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
