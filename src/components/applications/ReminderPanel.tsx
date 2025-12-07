import { format, formatDistanceToNow, isToday, isTomorrow } from 'date-fns';
import { Bell, Calendar, Clock, ChevronRight, Sparkles } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ApplicationWithOpportunity } from '@/hooks/useApplications';
import { cn } from '@/lib/utils';

interface ReminderPanelProps {
  reminders: ApplicationWithOpportunity[];
  onViewApplication: (application: ApplicationWithOpportunity) => void;
}

export function ReminderPanel({ reminders, onViewApplication }: ReminderPanelProps) {
  if (reminders.length === 0) {
    return (
      <GlassCard className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Bell className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Upcoming Reminders</h3>
            <p className="text-sm text-muted-foreground">Stay on top of your applications</p>
          </div>
        </div>
        <div className="text-center py-6 text-muted-foreground">
          <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No upcoming interviews</p>
          <p className="text-xs mt-1">You're all caught up!</p>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center animate-pulse">
          <Bell className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold">Upcoming Reminders</h3>
          <p className="text-sm text-muted-foreground">{reminders.length} event{reminders.length > 1 ? 's' : ''} this week</p>
        </div>
      </div>

      <ScrollArea className="max-h-[300px]">
        <div className="space-y-3">
          {reminders.map((app) => {
            const interviewDate = new Date(app.interview_date!);
            const isInterviewToday = isToday(interviewDate);
            const isInterviewTomorrow = isTomorrow(interviewDate);

            return (
              <button
                key={app.id}
                onClick={() => onViewApplication(app)}
                className={cn(
                  "w-full p-4 rounded-xl text-left transition-all hover:scale-[1.02]",
                  isInterviewToday 
                    ? "bg-secondary/20 border border-secondary/30 animate-pulse" 
                    : isInterviewTomorrow
                      ? "bg-primary/10 border border-primary/20"
                      : "bg-muted/30 hover:bg-muted/50"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {isInterviewToday && (
                        <Badge className="bg-secondary text-secondary-foreground text-[10px]">
                          TODAY
                        </Badge>
                      )}
                      {isInterviewTomorrow && (
                        <Badge variant="outline" className="text-primary text-[10px]">
                          TOMORROW
                        </Badge>
                      )}
                    </div>
                    <h4 className="font-medium text-sm truncate">
                      {app.opportunity?.title}
                    </h4>
                    <p className="text-xs text-muted-foreground truncate">
                      {app.opportunity?.company_name}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                </div>
                
                <div className="flex items-center gap-4 mt-3 text-xs">
                  <span className="flex items-center gap-1 text-primary">
                    <Calendar className="h-3 w-3" />
                    {format(interviewDate, 'MMM d')}
                  </span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {format(interviewDate, 'h:mm a')}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </ScrollArea>

      {/* AI Tip */}
      <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
        <div className="flex items-start gap-2">
          <Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground">
            <span className="text-primary font-medium">AI Tip:</span> Practice common interview questions in the Interview Simulator before your next interview!
          </p>
        </div>
      </div>
    </GlassCard>
  );
}
