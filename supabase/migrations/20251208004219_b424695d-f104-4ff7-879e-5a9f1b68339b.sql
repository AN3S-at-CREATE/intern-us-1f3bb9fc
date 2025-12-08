-- Create university_profiles table
CREATE TABLE public.university_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  institution_name TEXT NOT NULL,
  institution_type TEXT DEFAULT 'university',
  faculty TEXT,
  department TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  address TEXT,
  website TEXT,
  logo_url TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on university_profiles
ALTER TABLE public.university_profiles ENABLE ROW LEVEL SECURITY;

-- RLS policies for university_profiles
CREATE POLICY "Universities can view their own profile"
ON public.university_profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Universities can insert their own profile"
ON public.university_profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Universities can update their own profile"
ON public.university_profiles FOR UPDATE
USING (auth.uid() = user_id);

-- Create wil_placements table for tracking student placements
CREATE TABLE public.wil_placements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_user_id UUID NOT NULL,
  university_user_id UUID NOT NULL,
  employer_name TEXT,
  opportunity_id UUID REFERENCES public.opportunities(id),
  placement_type TEXT NOT NULL DEFAULT 'internship',
  status TEXT NOT NULL DEFAULT 'pending',
  start_date DATE,
  end_date DATE,
  hours_completed INTEGER DEFAULT 0,
  hours_required INTEGER DEFAULT 0,
  supervisor_name TEXT,
  supervisor_email TEXT,
  assessment_score INTEGER,
  employer_feedback TEXT,
  student_feedback TEXT,
  risk_level TEXT DEFAULT 'low',
  risk_factors JSONB DEFAULT '[]'::jsonb,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on wil_placements
ALTER TABLE public.wil_placements ENABLE ROW LEVEL SECURITY;

-- RLS policies for wil_placements
CREATE POLICY "Universities can view their student placements"
ON public.wil_placements FOR SELECT
USING (auth.uid() = university_user_id);

CREATE POLICY "Universities can create placements"
ON public.wil_placements FOR INSERT
WITH CHECK (auth.uid() = university_user_id);

CREATE POLICY "Universities can update their placements"
ON public.wil_placements FOR UPDATE
USING (auth.uid() = university_user_id);

CREATE POLICY "Students can view their own placements"
ON public.wil_placements FOR SELECT
USING (auth.uid() = student_user_id);

-- Allow universities to view student profiles for their students
CREATE POLICY "Universities can view student profiles for their placements"
ON public.student_profiles FOR SELECT
USING (user_id IN (
  SELECT student_user_id FROM public.wil_placements
  WHERE university_user_id = auth.uid()
));

-- Allow universities to view profiles for their students
CREATE POLICY "Universities can view profiles for their placements"
ON public.profiles FOR SELECT
USING (user_id IN (
  SELECT student_user_id FROM public.wil_placements
  WHERE university_user_id = auth.uid()
));

-- Add university_id to student_profiles for linking students to institutions
ALTER TABLE public.student_profiles 
ADD COLUMN IF NOT EXISTS university_user_id UUID;

-- Create trigger for updated_at on new tables
CREATE TRIGGER update_university_profiles_updated_at
BEFORE UPDATE ON public.university_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_wil_placements_updated_at
BEFORE UPDATE ON public.wil_placements
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();