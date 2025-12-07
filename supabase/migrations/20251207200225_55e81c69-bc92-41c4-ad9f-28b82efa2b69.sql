-- Create enum for user roles
CREATE TYPE public.user_role AS ENUM ('student', 'employer', 'university', 'admin');

-- Create profiles table for all users
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users ON DELETE CASCADE,
  email TEXT NOT NULL,
  role public.user_role NOT NULL DEFAULT 'student',
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create student_profiles table for extended student info
CREATE TABLE public.student_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users ON DELETE CASCADE,
  headline TEXT,
  bio TEXT,
  location TEXT,
  date_of_birth DATE,
  id_number TEXT,
  gender TEXT,
  race TEXT,
  disability_status BOOLEAN DEFAULT false,
  nationality TEXT DEFAULT 'South African',
  institution TEXT,
  qualification TEXT,
  field_of_study TEXT,
  year_of_study INTEGER,
  expected_graduation DATE,
  gpa DECIMAL(3,2),
  linkedin_url TEXT,
  portfolio_url TEXT,
  cv_url TEXT,
  profile_completeness INTEGER DEFAULT 0,
  is_available BOOLEAN DEFAULT true,
  blind_match_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create skills table
CREATE TABLE public.skills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create student_skills junction table
CREATE TABLE public.student_skills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES public.skills ON DELETE CASCADE,
  proficiency_level INTEGER DEFAULT 1 CHECK (proficiency_level >= 1 AND proficiency_level <= 5),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, skill_id)
);

-- Create work_experience table
CREATE TABLE public.work_experience (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  job_title TEXT NOT NULL,
  location TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  is_current BOOLEAN DEFAULT false,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create education table
CREATE TABLE public.education (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  institution_name TEXT NOT NULL,
  qualification TEXT NOT NULL,
  field_of_study TEXT,
  start_date DATE,
  end_date DATE,
  is_current BOOLEAN DEFAULT false,
  grade TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for student_profiles
CREATE POLICY "Students can view their own student profile" 
ON public.student_profiles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Students can update their own student profile" 
ON public.student_profiles FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Students can insert their own student profile" 
ON public.student_profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for skills (public read)
CREATE POLICY "Anyone can view skills" 
ON public.skills FOR SELECT 
USING (true);

-- RLS Policies for student_skills
CREATE POLICY "Users can view their own skills" 
ON public.student_skills FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own skills" 
ON public.student_skills FOR ALL 
USING (auth.uid() = user_id);

-- RLS Policies for work_experience
CREATE POLICY "Users can view their own work experience" 
ON public.work_experience FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own work experience" 
ON public.work_experience FOR ALL 
USING (auth.uid() = user_id);

-- RLS Policies for education
CREATE POLICY "Users can view their own education" 
ON public.education FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own education" 
ON public.education FOR ALL 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_student_profiles_updated_at
BEFORE UPDATE ON public.student_profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_work_experience_updated_at
BEFORE UPDATE ON public.work_experience
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_education_updated_at
BEFORE UPDATE ON public.education
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, first_name, last_name, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    NEW.raw_user_meta_data ->> 'first_name', 
    NEW.raw_user_meta_data ->> 'last_name',
    COALESCE((NEW.raw_user_meta_data ->> 'role')::public.user_role, 'student')
  );
  
  -- If role is student, also create student_profile
  IF COALESCE((NEW.raw_user_meta_data ->> 'role')::public.user_role, 'student') = 'student' THEN
    INSERT INTO public.student_profiles (user_id)
    VALUES (NEW.id);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert some default skills
INSERT INTO public.skills (name, category) VALUES
('Microsoft Excel', 'Software'),
('Microsoft Word', 'Software'),
('Python', 'Programming'),
('JavaScript', 'Programming'),
('Data Analysis', 'Analytics'),
('Communication', 'Soft Skills'),
('Teamwork', 'Soft Skills'),
('Problem Solving', 'Soft Skills'),
('Project Management', 'Management'),
('Customer Service', 'Service'),
('Sales', 'Business'),
('Marketing', 'Business'),
('Accounting', 'Finance'),
('Graphic Design', 'Creative'),
('Social Media', 'Marketing'),
('SQL', 'Programming'),
('React', 'Programming'),
('Leadership', 'Soft Skills'),
('Time Management', 'Soft Skills'),
('Critical Thinking', 'Soft Skills');