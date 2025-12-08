-- Create events table
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT NOT NULL DEFAULT 'career_fair',
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT,
  location_type TEXT NOT NULL DEFAULT 'in_person',
  venue_address TEXT,
  virtual_link TEXT,
  max_attendees INTEGER,
  registration_deadline TIMESTAMP WITH TIME ZONE,
  organizer_id UUID NOT NULL,
  organizer_type TEXT NOT NULL DEFAULT 'employer',
  company_name TEXT,
  company_logo_url TEXT,
  cover_image_url TEXT,
  industries TEXT[] DEFAULT '{}',
  target_roles TEXT[] DEFAULT '{}',
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  registration_count INTEGER NOT NULL DEFAULT 0,
  attendance_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create event registrations table
CREATE TABLE public.event_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'registered',
  registered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  attended_at TIMESTAMP WITH TIME ZONE,
  check_in_code TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(event_id, user_id)
);

-- Enable RLS
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

-- Events policies
CREATE POLICY "Anyone can view active events"
  ON public.events FOR SELECT
  USING (is_active = true);

CREATE POLICY "Organizers can manage their own events"
  ON public.events FOR ALL
  USING (auth.uid() = organizer_id);

-- Event registrations policies
CREATE POLICY "Users can view their own registrations"
  ON public.event_registrations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Organizers can view registrations for their events"
  ON public.event_registrations FOR SELECT
  USING (event_id IN (
    SELECT id FROM public.events WHERE organizer_id = auth.uid()
  ));

CREATE POLICY "Users can register for events"
  ON public.event_registrations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own registrations"
  ON public.event_registrations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Organizers can update registrations for their events"
  ON public.event_registrations FOR UPDATE
  USING (event_id IN (
    SELECT id FROM public.events WHERE organizer_id = auth.uid()
  ));

CREATE POLICY "Users can cancel their registrations"
  ON public.event_registrations FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_events_start_date ON public.events(start_date);
CREATE INDEX idx_events_organizer ON public.events(organizer_id);
CREATE INDEX idx_events_type ON public.events(event_type);
CREATE INDEX idx_registrations_event ON public.event_registrations(event_id);
CREATE INDEX idx_registrations_user ON public.event_registrations(user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_event_registrations_updated_at
  BEFORE UPDATE ON public.event_registrations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();