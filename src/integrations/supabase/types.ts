export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      applications: {
        Row: {
          applied_at: string
          cover_letter: string | null
          id: string
          interview_date: string | null
          match_reasons: string[] | null
          match_score: number | null
          notes: string | null
          opportunity_id: string
          status: string
          status_history: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          applied_at?: string
          cover_letter?: string | null
          id?: string
          interview_date?: string | null
          match_reasons?: string[] | null
          match_score?: number | null
          notes?: string | null
          opportunity_id: string
          status?: string
          status_history?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          applied_at?: string
          cover_letter?: string | null
          id?: string
          interview_date?: string | null
          match_reasons?: string[] | null
          match_score?: number | null
          notes?: string | null
          opportunity_id?: string
          status?: string
          status_history?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      data_access_requests: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          processed_at: string | null
          processed_by: string | null
          reason: string | null
          request_type: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          processed_at?: string | null
          processed_by?: string | null
          reason?: string | null
          request_type: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          processed_at?: string | null
          processed_by?: string | null
          reason?: string | null
          request_type?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      education: {
        Row: {
          created_at: string
          description: string | null
          end_date: string | null
          field_of_study: string | null
          grade: string | null
          id: string
          institution_name: string
          is_current: boolean | null
          qualification: string
          start_date: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_date?: string | null
          field_of_study?: string | null
          grade?: string | null
          id?: string
          institution_name: string
          is_current?: boolean | null
          qualification: string
          start_date?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          end_date?: string | null
          field_of_study?: string | null
          grade?: string | null
          id?: string
          institution_name?: string
          is_current?: boolean | null
          qualification?: string
          start_date?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      employer_profiles: {
        Row: {
          bbbee_level: string | null
          company_logo_url: string | null
          company_name: string
          company_size: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          description: string | null
          eti_eligible: boolean | null
          id: string
          industry: string | null
          is_verified: boolean | null
          location: string | null
          updated_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          bbbee_level?: string | null
          company_logo_url?: string | null
          company_name: string
          company_size?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          eti_eligible?: boolean | null
          id?: string
          industry?: string | null
          is_verified?: boolean | null
          location?: string | null
          updated_at?: string
          user_id: string
          website?: string | null
        }
        Update: {
          bbbee_level?: string | null
          company_logo_url?: string | null
          company_name?: string
          company_size?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          eti_eligible?: boolean | null
          id?: string
          industry?: string | null
          is_verified?: boolean | null
          location?: string | null
          updated_at?: string
          user_id?: string
          website?: string | null
        }
        Relationships: []
      }
      endorsements: {
        Row: {
          created_at: string
          from_user_id: string
          id: string
          is_verified: boolean
          message: string | null
          skill_id: string | null
          skill_name: string
          to_user_id: string
        }
        Insert: {
          created_at?: string
          from_user_id: string
          id?: string
          is_verified?: boolean
          message?: string | null
          skill_id?: string | null
          skill_name: string
          to_user_id: string
        }
        Update: {
          created_at?: string
          from_user_id?: string
          id?: string
          is_verified?: boolean
          message?: string | null
          skill_id?: string | null
          skill_name?: string
          to_user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "endorsements_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      event_registrations: {
        Row: {
          attended_at: string | null
          check_in_code: string | null
          created_at: string
          event_id: string
          id: string
          notes: string | null
          registered_at: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          attended_at?: string | null
          check_in_code?: string | null
          created_at?: string
          event_id: string
          id?: string
          notes?: string | null
          registered_at?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          attended_at?: string | null
          check_in_code?: string | null
          created_at?: string
          event_id?: string
          id?: string
          notes?: string | null
          registered_at?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          attendance_count: number
          company_logo_url: string | null
          company_name: string | null
          cover_image_url: string | null
          created_at: string
          description: string | null
          end_date: string
          event_type: string
          id: string
          industries: string[] | null
          is_active: boolean
          is_featured: boolean
          location: string | null
          location_type: string
          max_attendees: number | null
          organizer_id: string
          organizer_type: string
          registration_count: number
          registration_deadline: string | null
          start_date: string
          target_roles: string[] | null
          title: string
          updated_at: string
          venue_address: string | null
          virtual_link: string | null
        }
        Insert: {
          attendance_count?: number
          company_logo_url?: string | null
          company_name?: string | null
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          end_date: string
          event_type?: string
          id?: string
          industries?: string[] | null
          is_active?: boolean
          is_featured?: boolean
          location?: string | null
          location_type?: string
          max_attendees?: number | null
          organizer_id: string
          organizer_type?: string
          registration_count?: number
          registration_deadline?: string | null
          start_date: string
          target_roles?: string[] | null
          title: string
          updated_at?: string
          venue_address?: string | null
          virtual_link?: string | null
        }
        Update: {
          attendance_count?: number
          company_logo_url?: string | null
          company_name?: string | null
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          end_date?: string
          event_type?: string
          id?: string
          industries?: string[] | null
          is_active?: boolean
          is_featured?: boolean
          location?: string | null
          location_type?: string
          max_attendees?: number | null
          organizer_id?: string
          organizer_type?: string
          registration_count?: number
          registration_deadline?: string | null
          start_date?: string
          target_roles?: string[] | null
          title?: string
          updated_at?: string
          venue_address?: string | null
          virtual_link?: string | null
        }
        Relationships: []
      }
      mentor_connections: {
        Row: {
          connected_at: string | null
          created_at: string
          id: string
          mentee_user_id: string
          mentor_id: string
          message: string | null
          status: string
        }
        Insert: {
          connected_at?: string | null
          created_at?: string
          id?: string
          mentee_user_id: string
          mentor_id: string
          message?: string | null
          status?: string
        }
        Update: {
          connected_at?: string | null
          created_at?: string
          id?: string
          mentee_user_id?: string
          mentor_id?: string
          message?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentor_connections_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "mentors"
            referencedColumns: ["id"]
          },
        ]
      }
      mentors: {
        Row: {
          availability: string
          bio: string | null
          company: string | null
          created_at: string
          id: string
          industry: string
          is_active: boolean
          max_mentees: number
          title: string
          updated_at: string
          user_id: string
          years_experience: number
        }
        Insert: {
          availability?: string
          bio?: string | null
          company?: string | null
          created_at?: string
          id?: string
          industry: string
          is_active?: boolean
          max_mentees?: number
          title: string
          updated_at?: string
          user_id: string
          years_experience?: number
        }
        Update: {
          availability?: string
          bio?: string | null
          company?: string | null
          created_at?: string
          id?: string
          industry?: string
          is_active?: boolean
          max_mentees?: number
          title?: string
          updated_at?: string
          user_id?: string
          years_experience?: number
        }
        Relationships: []
      }
      module_completions: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          module_id: string
          progress_percent: number
          quiz_score: number | null
          started_at: string
          time_spent_minutes: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          module_id: string
          progress_percent?: number
          quiz_score?: number | null
          started_at?: string
          time_spent_minutes?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          module_id?: string
          progress_percent?: number
          quiz_score?: number | null
          started_at?: string
          time_spent_minutes?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "module_completions_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      modules: {
        Row: {
          category: string
          content: Json | null
          created_at: string
          description: string | null
          difficulty: string
          duration_minutes: number
          id: string
          is_active: boolean
          skills_covered: string[] | null
          thumbnail_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          content?: Json | null
          created_at?: string
          description?: string | null
          difficulty?: string
          duration_minutes?: number
          id?: string
          is_active?: boolean
          skills_covered?: string[] | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          content?: Json | null
          created_at?: string
          description?: string | null
          difficulty?: string
          duration_minutes?: number
          id?: string
          is_active?: boolean
          skills_covered?: string[] | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      notification_preferences: {
        Row: {
          application_updates: boolean
          community_activity: boolean
          created_at: string
          email_enabled: boolean
          id: string
          in_app_enabled: boolean
          interview_reminders: boolean
          marketing_updates: boolean
          opportunity_matches: boolean
          updated_at: string
          user_id: string
          whatsapp_enabled: boolean
          whatsapp_number: string | null
        }
        Insert: {
          application_updates?: boolean
          community_activity?: boolean
          created_at?: string
          email_enabled?: boolean
          id?: string
          in_app_enabled?: boolean
          interview_reminders?: boolean
          marketing_updates?: boolean
          opportunity_matches?: boolean
          updated_at?: string
          user_id: string
          whatsapp_enabled?: boolean
          whatsapp_number?: string | null
        }
        Update: {
          application_updates?: boolean
          community_activity?: boolean
          created_at?: string
          email_enabled?: boolean
          id?: string
          in_app_enabled?: boolean
          interview_reminders?: boolean
          marketing_updates?: boolean
          opportunity_matches?: boolean
          updated_at?: string
          user_id?: string
          whatsapp_enabled?: boolean
          whatsapp_number?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          action_url: string | null
          channel: string
          created_at: string
          id: string
          is_read: boolean
          message: string
          metadata: Json | null
          read_at: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          action_url?: string | null
          channel?: string
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          metadata?: Json | null
          read_at?: string | null
          title: string
          type?: string
          user_id: string
        }
        Update: {
          action_url?: string | null
          channel?: string
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          metadata?: Json | null
          read_at?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      opportunities: {
        Row: {
          application_deadline: string | null
          applications_count: number
          company_logo_url: string | null
          company_name: string
          created_at: string
          description: string
          duration_months: number | null
          employer_id: string
          field_of_study: string[] | null
          id: string
          industry: string
          is_active: boolean
          is_featured: boolean
          location: string
          location_type: string
          min_qualification: string | null
          opportunity_type: string
          requirements: string | null
          responsibilities: string | null
          start_date: string | null
          stipend_max: number | null
          stipend_min: number | null
          title: string
          updated_at: string
          views_count: number
        }
        Insert: {
          application_deadline?: string | null
          applications_count?: number
          company_logo_url?: string | null
          company_name: string
          created_at?: string
          description: string
          duration_months?: number | null
          employer_id: string
          field_of_study?: string[] | null
          id?: string
          industry: string
          is_active?: boolean
          is_featured?: boolean
          location: string
          location_type?: string
          min_qualification?: string | null
          opportunity_type?: string
          requirements?: string | null
          responsibilities?: string | null
          start_date?: string | null
          stipend_max?: number | null
          stipend_min?: number | null
          title: string
          updated_at?: string
          views_count?: number
        }
        Update: {
          application_deadline?: string | null
          applications_count?: number
          company_logo_url?: string | null
          company_name?: string
          created_at?: string
          description?: string
          duration_months?: number | null
          employer_id?: string
          field_of_study?: string[] | null
          id?: string
          industry?: string
          is_active?: boolean
          is_featured?: boolean
          location?: string
          location_type?: string
          min_qualification?: string | null
          opportunity_type?: string
          requirements?: string | null
          responsibilities?: string | null
          start_date?: string | null
          stipend_max?: number | null
          stipend_min?: number | null
          title?: string
          updated_at?: string
          views_count?: number
        }
        Relationships: []
      }
      popia_consents: {
        Row: {
          consent_type: string
          created_at: string
          granted_at: string | null
          id: string
          ip_address: string | null
          is_granted: boolean
          revoked_at: string | null
          updated_at: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          consent_type: string
          created_at?: string
          granted_at?: string | null
          id?: string
          ip_address?: string | null
          is_granted?: boolean
          revoked_at?: string | null
          updated_at?: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          consent_type?: string
          created_at?: string
          granted_at?: string | null
          id?: string
          ip_address?: string | null
          is_granted?: boolean
          revoked_at?: string | null
          updated_at?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      saved_opportunities: {
        Row: {
          id: string
          opportunity_id: string
          saved_at: string
          user_id: string
        }
        Insert: {
          id?: string
          opportunity_id: string
          saved_at?: string
          user_id: string
        }
        Update: {
          id?: string
          opportunity_id?: string
          saved_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_opportunities_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      skills: {
        Row: {
          category: string | null
          created_at: string
          id: string
          name: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      squad_members: {
        Row: {
          id: string
          joined_at: string
          role: string
          squad_id: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string
          role?: string
          squad_id: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string
          role?: string
          squad_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "squad_members_squad_id_fkey"
            columns: ["squad_id"]
            isOneToOne: false
            referencedRelation: "squads"
            referencedColumns: ["id"]
          },
        ]
      }
      squads: {
        Row: {
          category: string
          created_at: string
          created_by: string
          description: string | null
          id: string
          is_active: boolean
          max_members: number
          name: string
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          is_active?: boolean
          max_members?: number
          name: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          is_active?: boolean
          max_members?: number
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      student_profiles: {
        Row: {
          bio: string | null
          blind_match_enabled: boolean | null
          created_at: string
          cv_url: string | null
          date_of_birth: string | null
          disability_status: boolean | null
          expected_graduation: string | null
          field_of_study: string | null
          gender: string | null
          gpa: number | null
          headline: string | null
          id: string
          id_number: string | null
          institution: string | null
          is_available: boolean | null
          linkedin_url: string | null
          location: string | null
          nationality: string | null
          portfolio_url: string | null
          profile_completeness: number | null
          qualification: string | null
          race: string | null
          university_user_id: string | null
          updated_at: string
          user_id: string
          year_of_study: number | null
        }
        Insert: {
          bio?: string | null
          blind_match_enabled?: boolean | null
          created_at?: string
          cv_url?: string | null
          date_of_birth?: string | null
          disability_status?: boolean | null
          expected_graduation?: string | null
          field_of_study?: string | null
          gender?: string | null
          gpa?: number | null
          headline?: string | null
          id?: string
          id_number?: string | null
          institution?: string | null
          is_available?: boolean | null
          linkedin_url?: string | null
          location?: string | null
          nationality?: string | null
          portfolio_url?: string | null
          profile_completeness?: number | null
          qualification?: string | null
          race?: string | null
          university_user_id?: string | null
          updated_at?: string
          user_id: string
          year_of_study?: number | null
        }
        Update: {
          bio?: string | null
          blind_match_enabled?: boolean | null
          created_at?: string
          cv_url?: string | null
          date_of_birth?: string | null
          disability_status?: boolean | null
          expected_graduation?: string | null
          field_of_study?: string | null
          gender?: string | null
          gpa?: number | null
          headline?: string | null
          id?: string
          id_number?: string | null
          institution?: string | null
          is_available?: boolean | null
          linkedin_url?: string | null
          location?: string | null
          nationality?: string | null
          portfolio_url?: string | null
          profile_completeness?: number | null
          qualification?: string | null
          race?: string | null
          university_user_id?: string | null
          updated_at?: string
          user_id?: string
          year_of_study?: number | null
        }
        Relationships: []
      }
      student_skills: {
        Row: {
          created_at: string
          id: string
          proficiency_level: number | null
          skill_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          proficiency_level?: number | null
          skill_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          proficiency_level?: number | null
          skill_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      trust_scores: {
        Row: {
          endorsements_given: number
          endorsements_received: number
          id: string
          modules_completed: number
          profile_verified: boolean
          score: number
          updated_at: string
          user_id: string
        }
        Insert: {
          endorsements_given?: number
          endorsements_received?: number
          id?: string
          modules_completed?: number
          profile_verified?: boolean
          score?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          endorsements_given?: number
          endorsements_received?: number
          id?: string
          modules_completed?: number
          profile_verified?: boolean
          score?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      university_profiles: {
        Row: {
          address: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          department: string | null
          faculty: string | null
          id: string
          institution_name: string
          institution_type: string | null
          is_verified: boolean | null
          logo_url: string | null
          updated_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          address?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          department?: string | null
          faculty?: string | null
          id?: string
          institution_name: string
          institution_type?: string | null
          is_verified?: boolean | null
          logo_url?: string | null
          updated_at?: string
          user_id: string
          website?: string | null
        }
        Update: {
          address?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          department?: string | null
          faculty?: string | null
          id?: string
          institution_name?: string
          institution_type?: string | null
          is_verified?: boolean | null
          logo_url?: string | null
          updated_at?: string
          user_id?: string
          website?: string | null
        }
        Relationships: []
      }
      wil_placements: {
        Row: {
          assessment_score: number | null
          created_at: string
          employer_feedback: string | null
          employer_name: string | null
          end_date: string | null
          hours_completed: number | null
          hours_required: number | null
          id: string
          notes: string | null
          opportunity_id: string | null
          placement_type: string
          risk_factors: Json | null
          risk_level: string | null
          start_date: string | null
          status: string
          student_feedback: string | null
          student_user_id: string
          supervisor_email: string | null
          supervisor_name: string | null
          university_user_id: string
          updated_at: string
        }
        Insert: {
          assessment_score?: number | null
          created_at?: string
          employer_feedback?: string | null
          employer_name?: string | null
          end_date?: string | null
          hours_completed?: number | null
          hours_required?: number | null
          id?: string
          notes?: string | null
          opportunity_id?: string | null
          placement_type?: string
          risk_factors?: Json | null
          risk_level?: string | null
          start_date?: string | null
          status?: string
          student_feedback?: string | null
          student_user_id: string
          supervisor_email?: string | null
          supervisor_name?: string | null
          university_user_id: string
          updated_at?: string
        }
        Update: {
          assessment_score?: number | null
          created_at?: string
          employer_feedback?: string | null
          employer_name?: string | null
          end_date?: string | null
          hours_completed?: number | null
          hours_required?: number | null
          id?: string
          notes?: string | null
          opportunity_id?: string | null
          placement_type?: string
          risk_factors?: Json | null
          risk_level?: string | null
          start_date?: string | null
          status?: string
          student_feedback?: string | null
          student_user_id?: string
          supervisor_email?: string | null
          supervisor_name?: string | null
          university_user_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "wil_placements_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      work_experience: {
        Row: {
          company_name: string
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          is_current: boolean | null
          job_title: string
          location: string | null
          start_date: string
          updated_at: string
          user_id: string
        }
        Insert: {
          company_name: string
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          is_current?: boolean | null
          job_title: string
          location?: string | null
          start_date: string
          updated_at?: string
          user_id: string
        }
        Update: {
          company_name?: string
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          is_current?: boolean | null
          job_title?: string
          location?: string | null
          start_date?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: "student" | "employer" | "university" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["student", "employer", "university", "admin"],
    },
  },
} as const
