import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  Clock, 
  Star, 
  ChevronRight,
  MapPin,
  GraduationCap
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Application {
  id: string;
  status: string;
  match_score: number | null;
  applied_at: string;
  opportunity?: {
    title: string;
  };
  profile?: {
    first_name: string | null;
    last_name: string | null;
    email: string;
    avatar_url: string | null;
  };
  student_profile?: {
    institution: string | null;
    field_of_study: string | null;
    headline: string | null;
    location: string | null;
  };
}

interface RecentApplicationsProps {
  applications: Application[];
  onViewAll?: () => void;
}

export function RecentApplications({ applications, onViewAll }: RecentApplicationsProps) {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-warning/20 text-warning border-warning/30';
      case 'reviewed': return 'bg-info/20 text-info border-info/30';
      case 'shortlisted': return 'bg-primary/20 text-primary border-primary/30';
      case 'interview': return 'bg-accent/20 text-accent border-accent/30';
      case 'offered': return 'bg-success/20 text-success border-success/30';
      case 'rejected': return 'bg-destructive/20 text-destructive border-destructive/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-muted-foreground';
  };

  const recentApps = applications.slice(0, 5);

  return (
    <div className="rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50 overflow-hidden">
      <div className="p-5 border-b border-border/50 flex items-center justify-between">
        <h3 className="text-lg font-semibold font-heading text-foreground">Recent Applications</h3>
        {onViewAll && (
          <Button variant="ghost" size="sm" onClick={onViewAll} className="text-primary">
            View All
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        )}
      </div>

      <div className="divide-y divide-border/30">
        {recentApps.length === 0 ? (
          <div className="p-8 text-center">
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No applications yet</p>
            <p className="text-sm text-muted-foreground mt-1">Post an opportunity to start receiving applications</p>
          </div>
        ) : (
          recentApps.map((app, index) => {
            const initials = app.profile?.first_name && app.profile?.last_name
              ? `${app.profile.first_name[0]}${app.profile.last_name[0]}`
              : 'A';
            const name = app.profile?.first_name && app.profile?.last_name
              ? `${app.profile.first_name} ${app.profile.last_name}`
              : 'Anonymous';

            return (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 hover:bg-muted/30 transition-colors cursor-pointer"
                onClick={() => navigate('/employer/applicants')}
              >
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12 border-2 border-primary/20">
                    <AvatarImage src={app.profile?.avatar_url || ''} />
                    <AvatarFallback className="bg-primary/10 text-primary">{initials}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-medium text-foreground">{name}</h4>
                        <p className="text-sm text-muted-foreground truncate">
                          {app.student_profile?.headline || app.student_profile?.field_of_study || 'Student'}
                        </p>
                      </div>
                      <Badge className={`shrink-0 ${getStatusColor(app.status)}`}>
                        {app.status}
                      </Badge>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      {app.student_profile?.institution && (
                        <span className="flex items-center gap-1">
                          <GraduationCap className="h-3 w-3" />
                          {app.student_profile.institution}
                        </span>
                      )}
                      {app.student_profile?.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {app.student_profile.location}
                        </span>
                      )}
                      {app.match_score && (
                        <span className={`flex items-center gap-1 ${getScoreColor(app.match_score)}`}>
                          <Star className="h-3 w-3" />
                          {app.match_score}% match
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-muted-foreground mt-2">
                      Applied for <span className="text-foreground">{app.opportunity?.title}</span>
                      {' · '}
                      {formatDistanceToNow(new Date(app.applied_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}