-- Create modules table for microlearning content
CREATE TABLE public.modules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL DEFAULT 'beginner',
  duration_minutes INTEGER NOT NULL DEFAULT 15,
  content JSONB,
  skills_covered TEXT[] DEFAULT '{}',
  thumbnail_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create module_completions table for progress tracking
CREATE TABLE public.module_completions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  progress_percent INTEGER NOT NULL DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  quiz_score INTEGER,
  time_spent_minutes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, module_id)
);

-- Enable RLS
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.module_completions ENABLE ROW LEVEL SECURITY;

-- RLS policies for modules (anyone can view active modules)
CREATE POLICY "Anyone can view active modules"
ON public.modules
FOR SELECT
USING (is_active = true);

-- RLS policies for module_completions
CREATE POLICY "Users can view their own completions"
ON public.module_completions
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own completions"
ON public.module_completions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own completions"
ON public.module_completions
FOR UPDATE
USING (auth.uid() = user_id);

-- Add update trigger
CREATE TRIGGER update_modules_updated_at
BEFORE UPDATE ON public.modules
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_module_completions_updated_at
BEFORE UPDATE ON public.module_completions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample modules
INSERT INTO public.modules (title, description, category, difficulty, duration_minutes, skills_covered, content) VALUES
('Professional Communication', 'Master workplace communication skills including email etiquette, presentations, and meetings.', 'Soft Skills', 'beginner', 20, ARRAY['Communication', 'Presentation', 'Email Etiquette'], '{"lessons": [{"title": "Email Etiquette Basics", "content": "Learn how to write professional emails that get responses."}, {"title": "Meeting Participation", "content": "Tips for contributing effectively in meetings."}]}'),
('Excel Fundamentals', 'Learn essential spreadsheet skills for data analysis and reporting.', 'Technical', 'beginner', 30, ARRAY['Microsoft Excel', 'Data Analysis', 'Spreadsheets'], '{"lessons": [{"title": "Formulas & Functions", "content": "Master basic Excel formulas."}, {"title": "Data Visualization", "content": "Create charts and graphs."}]}'),
('Time Management', 'Develop strategies to manage your time effectively and boost productivity.', 'Soft Skills', 'beginner', 15, ARRAY['Time Management', 'Productivity', 'Organization'], '{"lessons": [{"title": "Priority Matrix", "content": "Learn the Eisenhower matrix for prioritization."}, {"title": "Pomodoro Technique", "content": "Use time-boxing for focus."}]}'),
('Python Basics', 'Introduction to Python programming for beginners.', 'Technical', 'beginner', 45, ARRAY['Python', 'Programming', 'Problem Solving'], '{"lessons": [{"title": "Variables & Data Types", "content": "Understanding Python basics."}, {"title": "Control Flow", "content": "Loops and conditionals."}]}'),
('Interview Skills', 'Prepare for job interviews with confidence and strategy.', 'Career', 'intermediate', 25, ARRAY['Interview Preparation', 'Communication', 'Personal Branding'], '{"lessons": [{"title": "STAR Method", "content": "Structure your answers effectively."}, {"title": "Common Questions", "content": "Prepare for typical interview questions."}]}'),
('Digital Marketing Basics', 'Understand the fundamentals of digital marketing and social media.', 'Technical', 'beginner', 35, ARRAY['Digital Marketing', 'Social Media', 'SEO'], '{"lessons": [{"title": "Social Media Strategy", "content": "Build your online presence."}, {"title": "SEO Fundamentals", "content": "Basics of search optimization."}]}'),
('Financial Literacy', 'Essential money management skills for young professionals.', 'Life Skills', 'beginner', 20, ARRAY['Financial Planning', 'Budgeting', 'Savings'], '{"lessons": [{"title": "Budgeting 101", "content": "Create and stick to a budget."}, {"title": "Understanding Tax", "content": "Basics of income tax in SA."}]}'),
('Leadership Foundations', 'Develop leadership skills for career advancement.', 'Soft Skills', 'intermediate', 30, ARRAY['Leadership', 'Team Management', 'Decision Making'], '{"lessons": [{"title": "Leading Without Authority", "content": "Influence without formal power."}, {"title": "Team Dynamics", "content": "Build and motivate teams."}]}');