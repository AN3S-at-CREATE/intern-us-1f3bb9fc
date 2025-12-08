import { Calendar, MapPin, Users, Video, Clock, Building2 } from 'lucide-react';
import { format } from 'date-fns';
import { GlassCard } from '@/components/ui/GlassCard';
import { NeonButton } from '@/components/ui/NeonButton';
import { Badge } from '@/components/ui/badge';
import { Event } from '@/hooks/useEvents';

interface EventCardProps {
  event: Event;
  isRegistered?: boolean;
  onRegister?: () => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function EventCard({ 
  event, 
  isRegistered, 
  onRegister, 
  onCancel,
  isLoading 
}: EventCardProps) {
  const eventTypeLabels: Record<string, string> = {
    career_fair: 'Career Fair',
    workshop: 'Workshop',
    webinar: 'Webinar',
    networking: 'Networking',
    info_session: 'Info Session',
    hackathon: 'Hackathon',
  };

  const isUpcoming = new Date(event.start_date) > new Date();
  const isFull = event.max_attendees ? event.registration_count >= event.max_attendees : false;
  const registrationClosed = event.registration_deadline 
    ? new Date(event.registration_deadline) < new Date() 
    : false;

  return (
    <GlassCard className="overflow-hidden group hover:scale-[1.02] transition-transform duration-200">
      {/* Cover Image */}
      {event.cover_image_url ? (
        <div className="h-40 overflow-hidden">
          <img 
            src={event.cover_image_url} 
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="h-40 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
          <Calendar className="w-12 h-12 text-primary/50" />
        </div>
      )}

      <div className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="secondary" className="text-xs">
                {eventTypeLabels[event.event_type] || event.event_type}
              </Badge>
              {event.is_featured && (
                <Badge className="bg-accent/20 text-accent border-accent/30 text-xs">
                  Featured
                </Badge>
              )}
              {event.location_type === 'virtual' && (
                <Badge variant="outline" className="text-xs">
                  <Video className="w-3 h-3 mr-1" />
                  Virtual
                </Badge>
              )}
            </div>
            <h3 className="font-semibold text-lg text-foreground line-clamp-2 group-hover:text-primary transition-colors">
              {event.title}
            </h3>
          </div>
        </div>

        {/* Organizer */}
        {event.company_name && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Building2 className="w-4 h-4" />
            <span>{event.company_name}</span>
          </div>
        )}

        {/* Date & Time */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4 text-primary" />
          <span>
            {format(new Date(event.start_date), 'MMM d, yyyy • h:mm a')}
          </span>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {event.location_type === 'virtual' ? (
            <Video className="w-4 h-4 text-primary" />
          ) : (
            <MapPin className="w-4 h-4 text-primary" />
          )}
          <span className="line-clamp-1">
            {event.location_type === 'virtual' 
              ? 'Online Event' 
              : event.location || 'Location TBA'}
          </span>
        </div>

        {/* Attendees */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="w-4 h-4 text-primary" />
          <span>
            {event.registration_count} registered
            {event.max_attendees && ` / ${event.max_attendees} spots`}
          </span>
        </div>

        {/* Industries */}
        {event.industries && event.industries.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {event.industries.slice(0, 3).map((industry) => (
              <Badge key={industry} variant="outline" className="text-xs">
                {industry}
              </Badge>
            ))}
            {event.industries.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{event.industries.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="pt-2 border-t border-border/30">
          {isRegistered ? (
            <div className="flex items-center justify-between">
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                Registered
              </Badge>
              <NeonButton
                variant="outline"
                size="sm"
                onClick={onCancel}
                disabled={isLoading || !isUpcoming}
              >
                Cancel
              </NeonButton>
            </div>
          ) : (
            <NeonButton
              className="w-full"
              onClick={onRegister}
              disabled={isLoading || isFull || registrationClosed || !isUpcoming}
            >
              {isFull 
                ? 'Event Full' 
                : registrationClosed 
                  ? 'Registration Closed'
                  : !isUpcoming
                    ? 'Event Ended'
                    : 'Register Now'}
            </NeonButton>
          )}
        </div>
      </div>
    </GlassCard>
  );
}
