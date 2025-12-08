import { Calendar, MapPin, Users, Video, Clock, Building2, ExternalLink, Share2 } from 'lucide-react';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { NeonButton } from '@/components/ui/NeonButton';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Event } from '@/hooks/useEvents';
import { toast } from '@/hooks/use-toast';

interface EventDetailDialogProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
  isRegistered?: boolean;
  onRegister?: () => void;
  onCancel?: () => void;
  isLoading?: boolean;
  checkInCode?: string | null;
}

export function EventDetailDialog({
  event,
  isOpen,
  onClose,
  isRegistered,
  onRegister,
  onCancel,
  isLoading,
  checkInCode,
}: EventDetailDialogProps) {
  if (!event) return null;

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

  const addToCalendar = () => {
    const startDate = new Date(event.start_date).toISOString().replace(/-|:|\.\d+/g, '');
    const endDate = new Date(event.end_date).toISOString().replace(/-|:|\.\d+/g, '');
    const location = event.location_type === 'virtual' ? event.virtual_link || 'Online' : event.venue_address || event.location || '';
    
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(event.description || '')}&location=${encodeURIComponent(location)}`;
    
    window.open(googleCalendarUrl, '_blank');
  };

  const shareEvent = async () => {
    const shareData = {
      title: event.title,
      text: `Check out this event: ${event.title}`,
      url: window.location.href,
    };

    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: 'Link Copied',
        description: 'Event link copied to clipboard!',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border/50">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="secondary">
                  {eventTypeLabels[event.event_type] || event.event_type}
                </Badge>
                {event.is_featured && (
                  <Badge className="bg-accent/20 text-accent border-accent/30">
                    Featured
                  </Badge>
                )}
                {event.location_type === 'virtual' && (
                  <Badge variant="outline">
                    <Video className="w-3 h-3 mr-1" />
                    Virtual
                  </Badge>
                )}
              </div>
              <DialogTitle className="text-2xl">{event.title}</DialogTitle>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Cover Image */}
          {event.cover_image_url && (
            <div className="rounded-lg overflow-hidden">
              <img 
                src={event.cover_image_url} 
                alt={event.title}
                className="w-full h-48 object-cover"
              />
            </div>
          )}

          {/* Organizer */}
          {event.company_name && (
            <div className="flex items-center gap-3">
              {event.company_logo_url ? (
                <img 
                  src={event.company_logo_url} 
                  alt={event.company_name}
                  className="w-10 h-10 rounded-lg object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-primary" />
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">Organized by</p>
                <p className="font-medium">{event.company_name}</p>
              </div>
            </div>
          )}

          <Separator className="bg-border/30" />

          {/* Event Details */}
          <div className="grid gap-4">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">Date & Time</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(event.start_date), 'EEEE, MMMM d, yyyy')}
                </p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(event.start_date), 'h:mm a')} - {format(new Date(event.end_date), 'h:mm a')}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              {event.location_type === 'virtual' ? (
                <Video className="w-5 h-5 text-primary mt-0.5" />
              ) : (
                <MapPin className="w-5 h-5 text-primary mt-0.5" />
              )}
              <div>
                <p className="font-medium">Location</p>
                <p className="text-sm text-muted-foreground">
                  {event.location_type === 'virtual' 
                    ? 'Online Event'
                    : event.venue_address || event.location || 'Location TBA'}
                </p>
                {event.location_type === 'virtual' && event.virtual_link && isRegistered && (
                  <a 
                    href={event.virtual_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline flex items-center gap-1 mt-1"
                  >
                    Join Meeting <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">Attendees</p>
                <p className="text-sm text-muted-foreground">
                  {event.registration_count} registered
                  {event.max_attendees && ` of ${event.max_attendees} spots`}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          {event.description && (
            <>
              <Separator className="bg-border/30" />
              <div>
                <h4 className="font-medium mb-2">About This Event</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {event.description}
                </p>
              </div>
            </>
          )}

          {/* Industries & Roles */}
          {(event.industries?.length > 0 || event.target_roles?.length > 0) && (
            <>
              <Separator className="bg-border/30" />
              <div className="space-y-3">
                {event.industries?.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Industries</h4>
                    <div className="flex flex-wrap gap-2">
                      {event.industries.map((industry) => (
                        <Badge key={industry} variant="outline">
                          {industry}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {event.target_roles?.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Target Roles</h4>
                    <div className="flex flex-wrap gap-2">
                      {event.target_roles.map((role) => (
                        <Badge key={role} variant="secondary">
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Check-in Code */}
          {isRegistered && checkInCode && (
            <>
              <Separator className="bg-border/30" />
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
                <p className="text-sm text-muted-foreground mb-1">Your Check-in Code</p>
                <p className="text-2xl font-mono font-bold text-primary tracking-wider">
                  {checkInCode}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Show this code at the event entrance
                </p>
              </div>
            </>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4">
            {isRegistered ? (
              <>
                <NeonButton
                  variant="outline"
                  onClick={onCancel}
                  disabled={isLoading || !isUpcoming}
                  className="flex-1"
                >
                  Cancel Registration
                </NeonButton>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={addToCalendar}
                  className="hover:bg-primary/10"
                >
                  <Calendar className="w-5 h-5" />
                </Button>
              </>
            ) : (
              <NeonButton
                onClick={onRegister}
                disabled={isLoading || isFull || !isUpcoming}
                className="flex-1"
              >
                {isFull ? 'Event Full' : !isUpcoming ? 'Event Ended' : 'Register Now'}
              </NeonButton>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={shareEvent}
              className="hover:bg-primary/10"
            >
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
