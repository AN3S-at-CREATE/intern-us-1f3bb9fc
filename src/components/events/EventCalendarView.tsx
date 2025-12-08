import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  startOfWeek,
  endOfWeek
} from 'date-fns';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Event } from '@/hooks/useEvents';
import { cn } from '@/lib/utils';

interface EventCalendarViewProps {
  events: Event[];
  onEventClick?: (event: Event) => void;
}

export function EventCalendarView({ events, onEventClick }: EventCalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth));
    const end = endOfWeek(endOfMonth(currentMonth));
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const getEventsForDay = (day: Date) => {
    return events.filter(event => 
      isSameDay(new Date(event.start_date), day)
    );
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <GlassCard className="p-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-primary" />
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="hover:bg-primary/10"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentMonth(new Date())}
            className="hover:bg-primary/10"
          >
            Today
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="hover:bg-primary/10"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Week Day Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map(day => (
          <div 
            key={day} 
            className="text-center text-sm font-medium text-muted-foreground py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          const dayEvents = getEventsForDay(day);
          const isToday = isSameDay(day, new Date());
          const isCurrentMonth = isSameMonth(day, currentMonth);

          return (
            <div
              key={index}
              className={cn(
                'min-h-[100px] p-2 rounded-lg border border-border/20 transition-colors',
                isCurrentMonth 
                  ? 'bg-card/50' 
                  : 'bg-muted/20 opacity-50',
                isToday && 'ring-2 ring-primary/50 bg-primary/5',
                dayEvents.length > 0 && 'cursor-pointer hover:bg-primary/10'
              )}
            >
              <div className={cn(
                'text-sm font-medium mb-1',
                isToday ? 'text-primary' : 'text-muted-foreground'
              )}>
                {format(day, 'd')}
              </div>
              
              <div className="space-y-1">
                {dayEvents.slice(0, 2).map(event => (
                  <div
                    key={event.id}
                    onClick={() => onEventClick?.(event)}
                    className={cn(
                      'text-xs p-1 rounded truncate cursor-pointer transition-colors',
                      event.event_type === 'career_fair' 
                        ? 'bg-primary/20 text-primary hover:bg-primary/30'
                        : event.event_type === 'workshop'
                          ? 'bg-accent/20 text-accent hover:bg-accent/30'
                          : 'bg-secondary/50 text-secondary-foreground hover:bg-secondary/70'
                    )}
                  >
                    {event.title}
                  </div>
                ))}
                {dayEvents.length > 2 && (
                  <Badge variant="outline" className="text-xs w-full justify-center">
                    +{dayEvents.length - 2} more
                  </Badge>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border/30">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="w-3 h-3 rounded bg-primary/20" />
          <span>Career Fair</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="w-3 h-3 rounded bg-accent/20" />
          <span>Workshop</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="w-3 h-3 rounded bg-secondary/50" />
          <span>Other</span>
        </div>
      </div>
    </GlassCard>
  );
}
