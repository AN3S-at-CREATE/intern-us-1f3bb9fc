import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrustScorePanel } from "@/components/community/TrustScorePanel";
import { EndorsementFeed } from "@/components/community/EndorsementFeed";
import { Leaderboard } from "@/components/community/Leaderboard";
import { SquadMatching } from "@/components/community/SquadMatching";
import { MentorConnection } from "@/components/community/MentorConnection";
import { useCommunity } from "@/hooks/useCommunity";
import { Users, Award, Trophy, GraduationCap, Loader2, RefreshCw } from "lucide-react";
import { NeonButton } from "@/components/ui/NeonButton";

export default function CommunityHub() {
  const { 
    loading,
    squads,
    mySquads,
    endorsements,
    myTrustScore,
    leaderboard,
    mentors,
    createSquad,
    joinSquad,
    leaveSquad,
    giveEndorsement,
    requestMentor,
    refresh,
  } = useCommunity();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
              Community Squad Hub
            </h1>
            <p className="text-muted-foreground mt-1">
              Connect with peers, build trust, and find mentors
            </p>
          </div>
          <NeonButton variant="ghost" size="sm" onClick={refresh} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </NeonButton>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Trust Score & Leaderboard */}
            <div className="space-y-6">
              <TrustScorePanel trustScore={myTrustScore} />
              <Leaderboard entries={leaderboard} />
            </div>

            {/* Right Column - Tabs for other features */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="feed" className="space-y-6">
                <TabsList className="bg-muted/50 border border-border/50 p-1 w-full grid grid-cols-3">
                  <TabsTrigger 
                    value="feed"
                    className="data-[state=active]:bg-secondary/20 data-[state=active]:text-secondary flex items-center gap-2"
                  >
                    <Award className="h-4 w-4" />
                    <span className="hidden sm:inline">Endorsements</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="squads"
                    className="data-[state=active]:bg-accent/20 data-[state=active]:text-accent flex items-center gap-2"
                  >
                    <Users className="h-4 w-4" />
                    <span className="hidden sm:inline">Squads</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="mentors"
                    className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary flex items-center gap-2"
                  >
                    <GraduationCap className="h-4 w-4" />
                    <span className="hidden sm:inline">Mentors</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="feed" className="mt-0">
                  <EndorsementFeed endorsements={endorsements} />
                </TabsContent>

                <TabsContent value="squads" className="mt-0">
                  <SquadMatching
                    squads={squads}
                    mySquads={mySquads}
                    onCreateSquad={createSquad}
                    onJoinSquad={joinSquad}
                    onLeaveSquad={leaveSquad}
                  />
                </TabsContent>

                <TabsContent value="mentors" className="mt-0">
                  <MentorConnection
                    mentors={mentors}
                    onRequestMentor={requestMentor}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
