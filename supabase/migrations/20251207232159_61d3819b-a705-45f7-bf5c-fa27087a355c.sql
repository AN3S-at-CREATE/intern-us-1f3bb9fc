-- Create squads table for accountability groups
CREATE TABLE public.squads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  max_members INTEGER NOT NULL DEFAULT 5,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create squad_members table
CREATE TABLE public.squad_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  squad_id UUID NOT NULL REFERENCES public.squads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role TEXT NOT NULL DEFAULT 'member',
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(squad_id, user_id)
);

-- Create endorsements table for peer skill verifications
CREATE TABLE public.endorsements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  from_user_id UUID NOT NULL,
  to_user_id UUID NOT NULL,
  skill_id UUID REFERENCES public.skills(id) ON DELETE SET NULL,
  skill_name TEXT NOT NULL,
  message TEXT,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create trust_scores table
CREATE TABLE public.trust_scores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  score INTEGER NOT NULL DEFAULT 0,
  endorsements_received INTEGER NOT NULL DEFAULT 0,
  endorsements_given INTEGER NOT NULL DEFAULT 0,
  modules_completed INTEGER NOT NULL DEFAULT 0,
  profile_verified BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create mentors table for mentor connections
CREATE TABLE public.mentors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  title TEXT NOT NULL,
  company TEXT,
  industry TEXT NOT NULL,
  years_experience INTEGER NOT NULL DEFAULT 0,
  bio TEXT,
  availability TEXT NOT NULL DEFAULT 'limited',
  max_mentees INTEGER NOT NULL DEFAULT 3,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create mentor_connections table
CREATE TABLE public.mentor_connections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mentor_id UUID NOT NULL REFERENCES public.mentors(id) ON DELETE CASCADE,
  mentee_user_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  message TEXT,
  connected_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(mentor_id, mentee_user_id)
);

-- Enable RLS on all tables
ALTER TABLE public.squads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.squad_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.endorsements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trust_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentor_connections ENABLE ROW LEVEL SECURITY;

-- Squads policies
CREATE POLICY "Anyone can view active squads" ON public.squads
  FOR SELECT USING (is_active = true);

CREATE POLICY "Users can create squads" ON public.squads
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Creators can update their squads" ON public.squads
  FOR UPDATE USING (auth.uid() = created_by);

-- Squad members policies
CREATE POLICY "Members can view squad members" ON public.squad_members
  FOR SELECT USING (true);

CREATE POLICY "Users can join squads" ON public.squad_members
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave squads" ON public.squad_members
  FOR DELETE USING (auth.uid() = user_id);

-- Endorsements policies
CREATE POLICY "Anyone can view endorsements" ON public.endorsements
  FOR SELECT USING (true);

CREATE POLICY "Users can give endorsements" ON public.endorsements
  FOR INSERT WITH CHECK (auth.uid() = from_user_id AND auth.uid() != to_user_id);

CREATE POLICY "Users can delete their given endorsements" ON public.endorsements
  FOR DELETE USING (auth.uid() = from_user_id);

-- Trust scores policies
CREATE POLICY "Anyone can view trust scores" ON public.trust_scores
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own trust score" ON public.trust_scores
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own trust score" ON public.trust_scores
  FOR UPDATE USING (auth.uid() = user_id);

-- Mentors policies
CREATE POLICY "Anyone can view active mentors" ON public.mentors
  FOR SELECT USING (is_active = true);

CREATE POLICY "Users can register as mentors" ON public.mentors
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Mentors can update their profile" ON public.mentors
  FOR UPDATE USING (auth.uid() = user_id);

-- Mentor connections policies
CREATE POLICY "Users can view their mentor connections" ON public.mentor_connections
  FOR SELECT USING (
    auth.uid() = mentee_user_id OR 
    auth.uid() IN (SELECT user_id FROM public.mentors WHERE id = mentor_id)
  );

CREATE POLICY "Users can request mentor connections" ON public.mentor_connections
  FOR INSERT WITH CHECK (auth.uid() = mentee_user_id);

CREATE POLICY "Users can update their connections" ON public.mentor_connections
  FOR UPDATE USING (
    auth.uid() = mentee_user_id OR 
    auth.uid() IN (SELECT user_id FROM public.mentors WHERE id = mentor_id)
  );

-- Add triggers for updated_at
CREATE TRIGGER update_squads_updated_at
  BEFORE UPDATE ON public.squads
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_trust_scores_updated_at
  BEFORE UPDATE ON public.trust_scores
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_mentors_updated_at
  BEFORE UPDATE ON public.mentors
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_squad_members_squad_id ON public.squad_members(squad_id);
CREATE INDEX idx_squad_members_user_id ON public.squad_members(user_id);
CREATE INDEX idx_endorsements_to_user ON public.endorsements(to_user_id);
CREATE INDEX idx_endorsements_from_user ON public.endorsements(from_user_id);
CREATE INDEX idx_trust_scores_score ON public.trust_scores(score DESC);
CREATE INDEX idx_mentor_connections_mentee ON public.mentor_connections(mentee_user_id);
CREATE INDEX idx_mentor_connections_status ON public.mentor_connections(status);