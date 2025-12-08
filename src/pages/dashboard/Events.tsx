import { useState, useMemo } from 'react';
import { Calendar, List, Ticket } from 'lucide-react';
import { isToday, isThisWeek, isThisMonth, isFuture } from 'date-fns';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { GlassCard } from '@/components/ui/GlassCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EventCard } from '@/components/events/EventCard';
import { EventCalendarView } from '@/components/events/EventCalendarView';
import { EventFilters } from '@/components/events/EventFilters';
import { EventDetailDialog } from '@/components/events/EventDetailDialog';
import { MyRegistrations } from '@/components/events/MyRegistrations';
import { useEvents, Event } from '@/hooks/useEvents';
import { Skeleton } from '@/components/ui/skeleton';

export default function Events() {
  const [view, setView] = useState<'grid' | 'calendar' | 'my-events'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [eventType, setEventType] = useState('all');
  const [locationType, setLocationType] = useState('all');
  const [timeFilter, setTimeFilter] = useState('upcoming');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedCheckInCode, setSelectedCheckInCode] = useState<string | null>(null);

  const {
    events,
    eventsLoading,
    myRegistrations,
    register,
    cancelRegistration,
    isRegistering,
    isCancelling,
    isRegistered,
    getRegistration,
  } = useEvents();

  const filteredEvents = useMemo(() => {
    if (!events) return [];

    return events.filter((event) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
          !event.title.toLowerCase().includes(query) &&
          !event.description?.toLowerCase().includes(query) &&
          !event.company_name?.toLowerCase().includes(query)
        ) {
          return false;
        }
      }

      // Event type filter
      if (eventType !== 'all' && event.event_type !== eventType) {
        return false;
      }

      // Location type filter
      if (locationType !== 'all' && event.location_type !== locationType) {
        return false;
      }

      // Time filter
      const eventDate = new Date(event.start_date);
      switch (timeFilter) {
        case 'today':
          if (!isToday(eventDate)) return false;
          break;
        case 'this_week':
          if (!isThisWeek(eventDate)) return false;
          break;
        case 'this_month':
          if (!isThisMonth(eventDate)) return false;
          break;
        case 'upcoming':
          if (!isFuture(eventDate)) return false;
          break;
      }

      return true;
    });
  }, [events, searchQuery, eventType, locationType, timeFilter]);

  const handleEventClick = (event: Event, checkInCode?: string | null) => {
    setSelectedEvent(event);
    setSelectedCheckInCode(checkInCode || getRegistration(event.id)?.check_in_code || null);
  };

  const handleRegister = () => {
    if (selectedEvent) {
      register(selectedEvent.id);
    }
  };

  const handleCancelFromDialog = () => {
    if (selectedEvent) {
      const registration = getRegistration(selectedEvent.id);
      if (registration) {
        cancelRegistration(registration.id);
        setSelectedEvent(null);
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Events & Career Fairs
            </h1>
            <p className="text-muted-foreground mt-1">
              Discover networking opportunities and career events
            </p>
          </div>

          {/* View Toggle */}
          <Tabs value={view} onValueChange={(v) => setView(v as typeof view)}>
            <TabsList className="bg-card/50 border border-border/30">
              <TabsTrigger value="grid" className="gap-2">
                <List className="w-4 h-4" />
                <span className="hidden sm:inline">List</span>
              </TabsTrigger>
              <TabsTrigger value="calendar" className="gap-2">
                <Calendar className="w-4 h-4" />
                <span className="hidden sm:inline">Calendar</span>
              </TabsTrigger>
              <TabsTrigger value="my-events" className="gap-2">
                <Ticket className="w-4 h-4" />
                <span className="hidden sm:inline">My Events</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Filters - Only show for grid/calendar views */}
        {view !== 'my-events' && (
          <EventFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            eventType={eventType}
            onEventTypeChange={setEventType}
            locationType={locationType}
            onLocationTypeChange={setLocationType}
            timeFilter={timeFilter}
            onTimeFilterChange={setTimeFilter}
          />
        )}

        {/* Content */}
        {eventsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <GlassCard key={i} className="p-4">
                <Skeleton className="h-40 w-full mb-4" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full" />
              </GlassCard>
            ))}
          </div>
        ) : view === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <div key={event.id} onClick={() => handleEventClick(event)}>
                  <EventCard
                    event={event}
                    isRegistered={isRegistered(event.id)}
                    onRegister={() => register(event.id)}
                    onCancel={() => {
                      const registration = getRegistration(event.id);
                      if (registration) cancelRegistration(registration.id);
                    }}
                    isLoading={isRegistering || isCancelling}
                  />
                </div>
              ))
            ) : (
              <GlassCard className="col-span-full p-8 text-center">
                <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No Events Found
                </h3>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your filters to find more events
                </p>
              </GlassCard>
            )}
          </div>
        ) : view === 'calendar' ? (
          <EventCalendarView 
            events={filteredEvents} 
            onEventClick={handleEventClick}
          />
        ) : (
          <MyRegistrations
            registrations={myRegistrations || []}
            onCancelRegistration={cancelRegistration}
            onViewEvent={handleEventClick}
            isLoading={isCancelling}
          />
        )}

        {/* Event Detail Dialog */}
        <EventDetailDialog
          event={selectedEvent}
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          isRegistered={selectedEvent ? isRegistered(selectedEvent.id) : false}
          onRegister={handleRegister}
          onCancel={handleCancelFromDialog}
          isLoading={isRegistering || isCancelling}
          checkInCode={selectedCheckInCode}
        />
      </div>
    </DashboardLayout>
  );
}
