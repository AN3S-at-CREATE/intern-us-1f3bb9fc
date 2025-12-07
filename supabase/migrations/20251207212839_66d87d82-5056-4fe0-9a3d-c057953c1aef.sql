-- Create opportunities table
CREATE TABLE public.opportunities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employer_id UUID NOT NULL,
  title TEXT NOT NULL,
  company_name TEXT NOT NULL,
  company_logo_url TEXT,
  description TEXT NOT NULL,
  requirements TEXT,
  responsibilities TEXT,
  location TEXT NOT NULL,
  location_type TEXT NOT NULL DEFAULT 'hybrid' CHECK (location_type IN ('remote', 'hybrid', 'onsite')),
  opportunity_type TEXT NOT NULL DEFAULT 'internship' CHECK (opportunity_type IN ('internship', 'graduate', 'wil', 'learnership')),
  industry TEXT NOT NULL,
  field_of_study TEXT[],
  min_qualification TEXT,
  stipend_min INTEGER,
  stipend_max INTEGER,
  duration_months INTEGER,
  start_date DATE,
  application_deadline DATE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  views_count INTEGER NOT NULL DEFAULT 0,
  applications_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create applications table
CREATE TABLE public.applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'shortlisted', 'interviewed', 'offered', 'rejected', 'withdrawn')),
  cover_letter TEXT,
  match_score INTEGER,
  match_reasons TEXT[],
  applied_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(opportunity_id, user_id)
);

-- Create saved_opportunities table for bookmarks
CREATE TABLE public.saved_opportunities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  saved_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(opportunity_id, user_id)
);

-- Enable RLS
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_opportunities ENABLE ROW LEVEL SECURITY;

-- Opportunities: Anyone can view active opportunities
CREATE POLICY "Anyone can view active opportunities"
ON public.opportunities
FOR SELECT
USING (is_active = true);

-- Employers can manage their own opportunities (for future)
CREATE POLICY "Employers can manage their own opportunities"
ON public.opportunities
FOR ALL
USING (auth.uid() = employer_id);

-- Applications: Users can manage their own applications
CREATE POLICY "Users can view their own applications"
ON public.applications
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own applications"
ON public.applications
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own applications"
ON public.applications
FOR UPDATE
USING (auth.uid() = user_id);

-- Saved opportunities: Users can manage their own saved opportunities
CREATE POLICY "Users can manage their own saved opportunities"
ON public.saved_opportunities
FOR ALL
USING (auth.uid() = user_id);

-- Add triggers for updated_at
CREATE TRIGGER update_opportunities_updated_at
BEFORE UPDATE ON public.opportunities
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_applications_updated_at
BEFORE UPDATE ON public.applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample opportunities for demo
INSERT INTO public.opportunities (employer_id, title, company_name, description, requirements, location, location_type, opportunity_type, industry, field_of_study, stipend_min, stipend_max, duration_months, application_deadline) VALUES
(gen_random_uuid(), 'Software Development Intern', 'TechCorp SA', 'Join our dynamic team and gain hands-on experience in full-stack development. You will work on real projects using modern technologies.', 'Currently enrolled in Computer Science or related field. Basic knowledge of JavaScript and Python.', 'Johannesburg, Gauteng', 'hybrid', 'internship', 'Technology', ARRAY['Computer Science', 'Information Technology', 'Software Engineering'], 8000, 12000, 6, CURRENT_DATE + INTERVAL '30 days'),
(gen_random_uuid(), 'Marketing Graduate Programme', 'Retail Giants', 'Comprehensive 12-month graduate programme covering all aspects of retail marketing, from digital campaigns to in-store promotions.', 'Recent graduate with Marketing or Communications degree. Strong analytical and creative skills.', 'Cape Town, Western Cape', 'onsite', 'graduate', 'Retail', ARRAY['Marketing', 'Communications', 'Business Administration'], 15000, 18000, 12, CURRENT_DATE + INTERVAL '45 days'),
(gen_random_uuid(), 'Data Analytics WIL Placement', 'FinServe Bank', 'Work-Integrated Learning opportunity in our data analytics division. Gain practical experience in financial data analysis.', 'Final year student in Data Science, Statistics, or related field. Proficiency in SQL and Excel required.', 'Pretoria, Gauteng', 'hybrid', 'wil', 'Finance', ARRAY['Data Science', 'Statistics', 'Mathematics', 'Computer Science'], 10000, 14000, 6, CURRENT_DATE + INTERVAL '21 days'),
(gen_random_uuid(), 'HR Learnership', 'Mining Corp', 'Structured learnership programme in Human Resources. Includes NQF Level 5 qualification upon completion.', 'Matric certificate. Interest in Human Resources and people management.', 'Rustenburg, North West', 'onsite', 'learnership', 'Mining', ARRAY['Human Resources', 'Business Administration', 'Psychology'], 6000, 8000, 12, CURRENT_DATE + INTERVAL '60 days'),
(gen_random_uuid(), 'UX/UI Design Intern', 'Creative Agency Plus', 'Help design beautiful user experiences for our diverse client base. Work with experienced designers on real projects.', 'Portfolio demonstrating design skills. Proficiency in Figma or Adobe XD. Understanding of user-centered design.', 'Remote', 'remote', 'internship', 'Media', ARRAY['Graphic Design', 'Digital Media', 'Information Technology'], 9000, 11000, 3, CURRENT_DATE + INTERVAL '14 days'),
(gen_random_uuid(), 'Accounting Graduate Trainee', 'Big Four Accounting', 'Join our graduate programme and work towards your CA qualification with comprehensive support and mentorship.', 'BCom Accounting degree with CTA preferred. Strong academic record. Excellent communication skills.', 'Sandton, Gauteng', 'hybrid', 'graduate', 'Finance', ARRAY['Accounting', 'Finance', 'Business Administration'], 20000, 25000, 36, CURRENT_DATE + INTERVAL '90 days');