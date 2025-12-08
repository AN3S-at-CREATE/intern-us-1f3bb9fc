import { Calendar, MapPin, Clock, Video, QrCode } from 'lucide-react';
import { format } from 'date-fns';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/badge';
import { NeonButton } from '@/components/ui/NeonButton';
import { Event } from '@/hooks/useEvents';

interface MyRegistrationsProps {
  registrations: Array<{
    id: string;
    event_id: string;
    status: string;
    registered_at: string;
    check_in_code: string | null;
    events: Event;
  }>;
  onCancelRegistration: (registrationId: string) => void;
  onViewEvent: (event: Event, checkInCode: string | null) => void;
  isLoading?: boolean;
}

export function MyRegistrations({ 
  registrations, 
  onCancelRegistration, 
  onViewEvent,
  isLoading 
}: MyRegistrationsProps) {
  if (!registrations || registrations.length === 0) {
    return (
      <GlassCard className="p-8 text-center">
        <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">
          No Registrations Yet
        </h3>
        <p className="text-sm text-muted-foreground">
          You haven't registered for any events yet. Browse upcoming events to get started!
        </p>
      </GlassCard>
    );
  }

  const upcomingRegistrations = registrations.filter(
    reg => new Date(reg.events.start_date) > new Date()
  );
  const pastRegistrations = registrations.filter(
    reg => new Date(reg.events.start_date) <= new Date()
  );

  return (
    <div className="space-y-6">
      {/* Upcoming Events */}
      {upcomingRegistrations.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Upcoming Events ({upcomingRegistrations.length})
          </h3>
          <div className="space-y-4">
            {upcomingRegistrations.map((registration) => {
              const event = registration.events;
              return (
                <GlassCard key={registration.id} className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="secondary" className="text-xs">
                          {event.event_type.replace('_', ' ')}
                        </Badge>
                        {registration.status === 'attended' && (
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                            Attended
                          </Badge>
                        )}
                      </div>
                      <h4 
                        className="font-medium text-foreground cursor-pointer hover:text-primary transition-colors"
                        onClick={() => onViewEvent(event, registration.check_in_code)}
                      >
                        {event.title}
                      </h4>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {format(new Date(event.start_date), 'MMM d, h:mm a')}
                        </span>
                        <span className="flex items-center gap-1">
                          {event.location_type === 'virtual' ? (
                            <Video className="w-4 h-4" />
                          ) : (
                            <MapPin className="w-4 h-4" />
                          )}
                          {event.location_type === 'virtual' ? 'Online' : event.location}
                        </span>
                      </div>
                    </div>

                    {/* Check-in Code */}
                    {registration.check_in_code && (
                      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 border border-primary/30">
                        <QrCode className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-xs text-muted-foreground">Check-in Code</p>
                          <p className="font-mono font-bold text-primary">
                            {registration.check_in_code}
                          </p>
                        </div>
                      </div>
                    )}

                    <NeonButton
                      variant="outline"
                      size="sm"
                      onClick={() => onCancelRegistration(registration.id)}
                      disabled={isLoading}
                    >
                      Cancel
                    </NeonButton>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>
      )}

      {/* Past Events */}
      {pastRegistrations.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-muted-foreground mb-4">
            Past Events ({pastRegistrations.length})
          </h3>
          <div className="space-y-3">
            {pastRegistrations.map((registration) => {
              const event = registration.events;
              return (
                <GlassCard 
                  key={registration.id} 
                  className="p-4 opacity-70 hover:opacity-100 transition-opacity"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-foreground">{event.title}</h4>
                        {registration.status === 'attended' && (
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                            Attended
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(event.start_date), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
