-- Add missing columns for Application Tracker
ALTER TABLE public.applications 
ADD COLUMN IF NOT EXISTS notes text,
ADD COLUMN IF NOT EXISTS interview_date timestamp with time zone,
ADD COLUMN IF NOT EXISTS status_history jsonb DEFAULT '[]'::jsonb;

-- Create index for faster status queries
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_user_status ON public.applications(user_id, status);