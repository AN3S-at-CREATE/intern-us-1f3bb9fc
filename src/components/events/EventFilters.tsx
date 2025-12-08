import { Search, Filter, Calendar, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { GlassCard } from '@/components/ui/GlassCard';

interface EventFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  eventType: string;
  onEventTypeChange: (value: string) => void;
  locationType: string;
  onLocationTypeChange: (value: string) => void;
  timeFilter: string;
  onTimeFilterChange: (value: string) => void;
}

export function EventFilters({
  searchQuery,
  onSearchChange,
  eventType,
  onEventTypeChange,
  locationType,
  onLocationTypeChange,
  timeFilter,
  onTimeFilterChange,
}: EventFiltersProps) {
  return (
    <GlassCard className="p-4">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-background/50 border-border/30"
          />
        </div>

        {/* Event Type Filter */}
        <Select value={eventType} onValueChange={onEventTypeChange}>
          <SelectTrigger className="w-full md:w-[180px] bg-background/50 border-border/30">
            <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Event Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="career_fair">Career Fairs</SelectItem>
            <SelectItem value="workshop">Workshops</SelectItem>
            <SelectItem value="webinar">Webinars</SelectItem>
            <SelectItem value="networking">Networking</SelectItem>
            <SelectItem value="info_session">Info Sessions</SelectItem>
            <SelectItem value="hackathon">Hackathons</SelectItem>
          </SelectContent>
        </Select>

        {/* Location Type Filter */}
        <Select value={locationType} onValueChange={onLocationTypeChange}>
          <SelectTrigger className="w-full md:w-[180px] bg-background/50 border-border/30">
            <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            <SelectItem value="in_person">In-Person</SelectItem>
            <SelectItem value="virtual">Virtual</SelectItem>
            <SelectItem value="hybrid">Hybrid</SelectItem>
          </SelectContent>
        </Select>

        {/* Time Filter */}
        <Select value={timeFilter} onValueChange={onTimeFilterChange}>
          <SelectTrigger className="w-full md:w-[180px] bg-background/50 border-border/30">
            <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="When" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Events</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="this_week">This Week</SelectItem>
            <SelectItem value="this_month">This Month</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </GlassCard>
  );
}
