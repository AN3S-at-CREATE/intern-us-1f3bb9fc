-- Create employer_profiles table for company information
CREATE TABLE public.employer_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  company_name TEXT NOT NULL,
  company_logo_url TEXT,
  industry TEXT,
  company_size TEXT,
  website TEXT,
  description TEXT,
  location TEXT,
  bbbee_level TEXT,
  eti_eligible BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false,
  contact_email TEXT,
  contact_phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.employer_profiles ENABLE ROW LEVEL SECURITY;

-- RLS policies for employer_profiles
CREATE POLICY "Employers can view their own profile" 
ON public.employer_profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Employers can insert their own profile" 
ON public.employer_profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Employers can update their own profile" 
ON public.employer_profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_employer_profiles_updated_at
BEFORE UPDATE ON public.employer_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add employer-specific RLS policy for opportunities: employers can view all their applicants
CREATE POLICY "Employers can view applications for their opportunities" 
ON public.applications 
FOR SELECT 
USING (
  opportunity_id IN (
    SELECT id FROM public.opportunities WHERE employer_id = auth.uid()
  )
);

-- Allow employers to update application status
CREATE POLICY "Employers can update applications for their opportunities" 
ON public.applications 
FOR UPDATE 
USING (
  opportunity_id IN (
    SELECT id FROM public.opportunities WHERE employer_id = auth.uid()
  )
);

-- Allow students to view their own profile for employer view (limited)
CREATE POLICY "Employers can view student profiles for applicants" 
ON public.student_profiles 
FOR SELECT 
USING (
  user_id IN (
    SELECT a.user_id 
    FROM public.applications a 
    JOIN public.opportunities o ON a.opportunity_id = o.id 
    WHERE o.employer_id = auth.uid()
  )
);

-- Allow employers to view profiles of applicants
CREATE POLICY "Employers can view profiles for applicants" 
ON public.profiles 
FOR SELECT 
USING (
  user_id IN (
    SELECT a.user_id 
    FROM public.applications a 
    JOIN public.opportunities o ON a.opportunity_id = o.id 
    WHERE o.employer_id = auth.uid()
  )
);