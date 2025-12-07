import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface Squad {
  id: string;
  name: string;
  description: string | null;
  category: string;
  max_members: number;
  is_active: boolean;
  created_by: string;
  created_at: string;
  member_count?: number;
}

export interface SquadMember {
  id: string;
  squad_id: string;
  user_id: string;
  role: string;
  joined_at: string;
}

export interface Endorsement {
  id: string;
  from_user_id: string;
  to_user_id: string;
  skill_id: string | null;
  skill_name: string;
  message: string | null;
  is_verified: boolean;
  created_at: string;
  from_user_name?: string;
  to_user_name?: string;
}

export interface TrustScore {
  id: string;
  user_id: string;
  score: number;
  endorsements_received: number;
  endorsements_given: number;
  modules_completed: number;
  profile_verified: boolean;
}

export interface Mentor {
  id: string;
  user_id: string;
  title: string;
  company: string | null;
  industry: string;
  years_experience: number;
  bio: string | null;
  availability: string;
  max_mentees: number;
  is_active: boolean;
  mentor_name?: string;
}

export interface LeaderboardEntry {
  user_id: string;
  score: number;
  endorsements_received: number;
  user_name?: string;
  rank: number;
}

export function useCommunity() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [squads, setSquads] = useState<Squad[]>([]);
  const [mySquads, setMySquads] = useState<Squad[]>([]);
  const [endorsements, setEndorsements] = useState<Endorsement[]>([]);
  const [myTrustScore, setMyTrustScore] = useState<TrustScore | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [mentors, setMentors] = useState<Mentor[]>([]);

  useEffect(() => {
    if (user) {
      fetchAllData();
    }
  }, [user]);

  async function fetchAllData() {
    setLoading(true);
    await Promise.all([
      fetchSquads(),
      fetchEndorsements(),
      fetchTrustScore(),
      fetchLeaderboard(),
      fetchMentors(),
    ]);
    setLoading(false);
  }

  async function fetchSquads() {
    const { data: allSquads, error } = await supabase
      .from("squads")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (!error && allSquads) {
      // Get member counts
      const squadsWithCounts = await Promise.all(
        allSquads.map(async (squad) => {
          const { count } = await supabase
            .from("squad_members")
            .select("*", { count: "exact", head: true })
            .eq("squad_id", squad.id);
          return { ...squad, member_count: count || 0 };
        })
      );
      setSquads(squadsWithCounts);

      // Get user's squads
      if (user) {
        const { data: myMemberships } = await supabase
          .from("squad_members")
          .select("squad_id")
          .eq("user_id", user.id);

        if (myMemberships) {
          const mySquadIds = myMemberships.map((m) => m.squad_id);
          setMySquads(squadsWithCounts.filter((s) => mySquadIds.includes(s.id)));
        }
      }
    }
  }

  async function fetchEndorsements() {
    const { data, error } = await supabase
      .from("endorsements")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);

    if (!error && data) {
      // Enrich with user names from profiles
      const enriched = await Promise.all(
        data.map(async (e) => {
          const { data: fromProfile } = await supabase
            .from("profiles")
            .select("first_name, last_name")
            .eq("user_id", e.from_user_id)
            .maybeSingle();
          const { data: toProfile } = await supabase
            .from("profiles")
            .select("first_name, last_name")
            .eq("user_id", e.to_user_id)
            .maybeSingle();
          return {
            ...e,
            from_user_name: fromProfile 
              ? `${fromProfile.first_name || ""} ${fromProfile.last_name || ""}`.trim() || "Anonymous"
              : "Anonymous",
            to_user_name: toProfile 
              ? `${toProfile.first_name || ""} ${toProfile.last_name || ""}`.trim() || "Anonymous"
              : "Anonymous",
          };
        })
      );
      setEndorsements(enriched);
    }
  }

  async function fetchTrustScore() {
    if (!user) return;

    const { data, error } = await supabase
      .from("trust_scores")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!error && data) {
      setMyTrustScore(data);
    } else if (!data) {
      // Create initial trust score
      const { data: newScore, error: insertError } = await supabase
        .from("trust_scores")
        .insert({ user_id: user.id, score: 10 })
        .select()
        .single();

      if (!insertError && newScore) {
        setMyTrustScore(newScore);
      }
    }
  }

  async function fetchLeaderboard() {
    const { data, error } = await supabase
      .from("trust_scores")
      .select("user_id, score, endorsements_received")
      .order("score", { ascending: false })
      .limit(10);

    if (!error && data) {
      const enriched = await Promise.all(
        data.map(async (entry, index) => {
          const { data: profile } = await supabase
            .from("profiles")
            .select("first_name, last_name")
            .eq("user_id", entry.user_id)
            .maybeSingle();
          return {
            ...entry,
            rank: index + 1,
            user_name: profile 
              ? `${profile.first_name || ""} ${profile.last_name || ""}`.trim() || "Anonymous"
              : "Anonymous",
          };
        })
      );
      setLeaderboard(enriched);
    }
  }

  async function fetchMentors() {
    const { data, error } = await supabase
      .from("mentors")
      .select("*")
      .eq("is_active", true)
      .order("years_experience", { ascending: false });

    if (!error && data) {
      const enriched = await Promise.all(
        data.map(async (mentor) => {
          const { data: profile } = await supabase
            .from("profiles")
            .select("first_name, last_name")
            .eq("user_id", mentor.user_id)
            .maybeSingle();
          return {
            ...mentor,
            mentor_name: profile 
              ? `${profile.first_name || ""} ${profile.last_name || ""}`.trim() || "Mentor"
              : "Mentor",
          };
        })
      );
      setMentors(enriched);
    }
  }

  async function createSquad(name: string, description: string, category: string) {
    if (!user) return;

    const { data, error } = await supabase
      .from("squads")
      .insert({
        name,
        description,
        category,
        created_by: user.id,
      })
      .select()
      .single();

    if (error) {
      toast({ title: "Error", description: "Failed to create squad", variant: "destructive" });
      return null;
    }

    // Auto-join as leader
    await supabase.from("squad_members").insert({
      squad_id: data.id,
      user_id: user.id,
      role: "leader",
    });

    toast({ title: "Squad Created", description: `${name} is ready for members!` });
    await fetchSquads();
    return data;
  }

  async function joinSquad(squadId: string) {
    if (!user) return;

    const { error } = await supabase.from("squad_members").insert({
      squad_id: squadId,
      user_id: user.id,
    });

    if (error) {
      toast({ title: "Error", description: "Failed to join squad", variant: "destructive" });
      return;
    }

    toast({ title: "Joined!", description: "You've joined the squad" });
    await fetchSquads();
  }

  async function leaveSquad(squadId: string) {
    if (!user) return;

    const { error } = await supabase
      .from("squad_members")
      .delete()
      .eq("squad_id", squadId)
      .eq("user_id", user.id);

    if (error) {
      toast({ title: "Error", description: "Failed to leave squad", variant: "destructive" });
      return;
    }

    toast({ title: "Left Squad", description: "You've left the squad" });
    await fetchSquads();
  }

  async function giveEndorsement(toUserId: string, skillName: string, message?: string) {
    if (!user || user.id === toUserId) return;

    const { error } = await supabase.from("endorsements").insert({
      from_user_id: user.id,
      to_user_id: toUserId,
      skill_name: skillName,
      message,
    });

    if (error) {
      toast({ title: "Error", description: "Failed to give endorsement", variant: "destructive" });
      return;
    }

    toast({ title: "Endorsed!", description: `You endorsed ${skillName}` });
    await fetchEndorsements();
  }

  async function requestMentor(mentorId: string, message?: string) {
    if (!user) return;

    const { error } = await supabase.from("mentor_connections").insert({
      mentor_id: mentorId,
      mentee_user_id: user.id,
      message,
    });

    if (error) {
      if (error.code === "23505") {
        toast({ title: "Already Requested", description: "You've already requested this mentor" });
      } else {
        toast({ title: "Error", description: "Failed to request mentor", variant: "destructive" });
      }
      return;
    }

    toast({ title: "Request Sent!", description: "Your mentor request has been sent" });
  }

  return {
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
    refresh: fetchAllData,
  };
}
