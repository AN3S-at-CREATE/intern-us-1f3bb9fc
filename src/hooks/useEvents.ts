import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface Event {
  id: string;
  title: string;
  description: string | null;
  event_type: string;
  start_date: string;
  end_date: string;
  location: string | null;
  location_type: string;
  venue_address: string | null;
  virtual_link: string | null;
  max_attendees: number | null;
  registration_deadline: string | null;
  organizer_id: string;
  organizer_type: string;
  company_name: string | null;
  company_logo_url: string | null;
  cover_image_url: string | null;
  industries: string[];
  target_roles: string[];
  is_featured: boolean;
  is_active: boolean;
  registration_count: number;
  attendance_count: number;
  created_at: string;
  updated_at: string;
}

export interface EventRegistration {
  id: string;
  event_id: string;
  user_id: string;
  status: string;
  registered_at: string;
  attended_at: string | null;
  check_in_code: string | null;
  notes: string | null;
}

export function useEvents() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch all active events
  const { data: events, isLoading: eventsLoading } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('is_active', true)
        .order('start_date', { ascending: true });
      
      if (error) throw error;
      return data as Event[];
    },
  });

  // Fetch user's registrations
  const { data: myRegistrations, isLoading: registrationsLoading } = useQuery({
    queryKey: ['my-registrations', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('event_registrations')
        .select('*, events(*)')
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Register for an event
  const registerMutation = useMutation({
    mutationFn: async (eventId: string) => {
      if (!user?.id) throw new Error('Must be logged in');
      
      const checkInCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      
      const { data, error } = await supabase
        .from('event_registrations')
        .insert({
          event_id: eventId,
          user_id: user.id,
          check_in_code: checkInCode,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['my-registrations'] });
      toast({
        title: 'Registered!',
        description: 'You have successfully registered for this event.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Registration Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Cancel registration
  const cancelRegistrationMutation = useMutation({
    mutationFn: async (registrationId: string) => {
      const { error } = await supabase
        .from('event_registrations')
        .delete()
        .eq('id', registrationId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['my-registrations'] });
      toast({
        title: 'Registration Cancelled',
        description: 'Your registration has been cancelled.',
      });
    },
  });

  // Check if user is registered for an event
  const isRegistered = (eventId: string) => {
    return myRegistrations?.some((reg: any) => reg.event_id === eventId);
  };

  const getRegistration = (eventId: string) => {
    return myRegistrations?.find((reg: any) => reg.event_id === eventId);
  };

  return {
    events,
    eventsLoading,
    myRegistrations,
    registrationsLoading,
    register: registerMutation.mutate,
    cancelRegistration: cancelRegistrationMutation.mutate,
    isRegistering: registerMutation.isPending,
    isCancelling: cancelRegistrationMutation.isPending,
    isRegistered,
    getRegistration,
  };
}

export function useEventManagement() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch events organized by user
  const { data: myEvents, isLoading: myEventsLoading } = useQuery({
    queryKey: ['my-events', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('organizer_id', user.id)
        .order('start_date', { ascending: true });
      
      if (error) throw error;
      return data as Event[];
    },
    enabled: !!user?.id,
  });

  // Create event
  const createEventMutation = useMutation({
    mutationFn: async (eventData: Omit<Partial<Event>, 'id' | 'created_at' | 'updated_at' | 'organizer_id'>) => {
      if (!user?.id) throw new Error('Must be logged in');
      
      const { data, error } = await supabase
        .from('events')
        .insert({
          title: eventData.title || '',
          start_date: eventData.start_date || new Date().toISOString(),
          end_date: eventData.end_date || new Date().toISOString(),
          description: eventData.description,
          event_type: eventData.event_type || 'career_fair',
          location: eventData.location,
          location_type: eventData.location_type || 'in_person',
          venue_address: eventData.venue_address,
          virtual_link: eventData.virtual_link,
          max_attendees: eventData.max_attendees,
          registration_deadline: eventData.registration_deadline,
          organizer_id: user.id,
          organizer_type: eventData.organizer_type || 'employer',
          company_name: eventData.company_name,
          company_logo_url: eventData.company_logo_url,
          cover_image_url: eventData.cover_image_url,
          industries: eventData.industries || [],
          target_roles: eventData.target_roles || [],
          is_featured: eventData.is_featured || false,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-events'] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast({
        title: 'Event Created',
        description: 'Your event has been created successfully.',
      });
    },
  });

  // Get registrations for an event
  const getEventRegistrations = async (eventId: string) => {
    const { data, error } = await supabase
      .from('event_registrations')
      .select('*, profiles:user_id(first_name, last_name, email)')
      .eq('event_id', eventId);
    
    if (error) throw error;
    return data;
  };

  // Mark attendance
  const markAttendanceMutation = useMutation({
    mutationFn: async ({ registrationId, attended }: { registrationId: string; attended: boolean }) => {
      const { error } = await supabase
        .from('event_registrations')
        .update({
          status: attended ? 'attended' : 'registered',
          attended_at: attended ? new Date().toISOString() : null,
        })
        .eq('id', registrationId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event-registrations'] });
      toast({
        title: 'Attendance Updated',
        description: 'Attendance has been recorded.',
      });
    },
  });

  return {
    myEvents,
    myEventsLoading,
    createEvent: createEventMutation.mutate,
    isCreating: createEventMutation.isPending,
    getEventRegistrations,
    markAttendance: markAttendanceMutation.mutate,
  };
}
