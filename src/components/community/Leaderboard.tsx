import { GlassCard } from "@/components/ui/GlassCard";
import { Trophy, Medal, Crown, TrendingUp } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import type { LeaderboardEntry } from "@/hooks/useCommunity";

interface LeaderboardProps {
  entries: LeaderboardEntry[];
}

export function Leaderboard({ entries }: LeaderboardProps) {
  const { user } = useAuth();

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-warning" />;
      case 2:
        return <Medal className="h-5 w-5 text-muted-foreground" />;
      case 3:
        return <Medal className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="h-5 w-5 flex items-center justify-center text-sm font-semibold text-muted-foreground">{rank}</span>;
    }
  };

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-warning/10 border-warning/30";
      case 2:
        return "bg-muted/50 border-muted-foreground/30";
      case 3:
        return "bg-amber-600/10 border-amber-600/30";
      default:
        return "bg-muted/30 border-border/50";
    }
  };

  if (entries.length === 0) {
    return (
      <GlassCard className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="h-5 w-5 text-warning" />
          <h3 className="font-heading text-lg font-semibold text-foreground">Top Connectors</h3>
        </div>
        <div className="text-center py-8">
          <Trophy className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">No rankings yet</p>
          <p className="text-xs text-muted-foreground mt-1">Build your trust score to rank!</p>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-warning" />
          <h3 className="font-heading text-lg font-semibold text-foreground">Top Connectors</h3>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <TrendingUp className="h-3 w-3" />
          <span>Updated live</span>
        </div>
      </div>

      <div className="space-y-2">
        {entries.map((entry) => {
          const isCurrentUser = user?.id === entry.user_id;
          
          return (
            <div
              key={entry.user_id}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${getRankStyle(entry.rank)} ${
                isCurrentUser ? "ring-2 ring-primary/50" : ""
              }`}
            >
              {/* Rank */}
              <div className="flex-shrink-0 w-8 flex items-center justify-center">
                {getRankIcon(entry.rank)}
              </div>

              {/* Avatar */}
              <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                entry.rank === 1 ? "bg-warning/20 text-warning" :
                entry.rank === 2 ? "bg-muted text-muted-foreground" :
                entry.rank === 3 ? "bg-amber-600/20 text-amber-600" :
                "bg-primary/20 text-primary"
              }`}>
                <span className="font-heading font-semibold">
                  {entry.user_name?.charAt(0).toUpperCase() || "?"}
                </span>
              </div>

              {/* Name & Stats */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-foreground truncate">
                    {entry.user_name}
                  </p>
                  {isCurrentUser && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-primary/20 text-primary font-ui">
                      You
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {entry.endorsements_received} endorsements
                </p>
              </div>

              {/* Score */}
              <div className="text-right">
                <p className="font-heading text-lg font-bold text-foreground">{entry.score}</p>
                <p className="text-[10px] text-muted-foreground">points</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* User's rank if not in top 10 */}
      {user && !entries.some((e) => e.user_id === user.id) && (
        <div className="mt-4 pt-4 border-t border-border/50">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 border border-primary/20">
            <span className="text-sm text-muted-foreground">Your position:</span>
            <span className="text-sm font-medium text-primary">Keep building your trust score to rank!</span>
          </div>
        </div>
      )}
    </GlassCard>
  );
}
