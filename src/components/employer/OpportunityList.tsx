import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useNavigate } from 'react-router-dom';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  Eye, 
  Users,
  Edit,
  ChevronRight,
  Calendar,
  Plus,
  Sparkles
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';

interface Opportunity {
  id: string;
  title: string;
  company_name: string;
  description: string;
  location: string;
  location_type: string;
  opportunity_type: string;
  industry: string;
  is_active: boolean;
  is_featured: boolean;
  views_count: number;
  applications_count: number;
  created_at: string;
  application_deadline: string | null;
  ai_generated?: boolean;
  ai_review_status?: 'pending' | 'flagged' | 'approved';
}

interface OpportunityListProps {
  opportunities: Opportunity[];
  onToggleActive: (id: string, isActive: boolean) => void;
  onEdit?: (id: string) => void;
}

export function OpportunityList({ opportunities, onToggleActive, onEdit }: OpportunityListProps) {
  const navigate = useNavigate();

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'internship': return 'bg-primary/20 text-primary border-primary/30';
      case 'graduate': return 'bg-success/20 text-success border-success/30';
      case 'wil': return 'bg-accent/20 text-accent border-accent/30';
      case 'learnership': return 'bg-warning/20 text-warning border-warning/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  if (opportunities.length === 0) {
    return (
      <div className="rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50 p-12 text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Briefcase className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No opportunities yet</h3>
        <p className="text-muted-foreground mb-6">Create your first job posting to start receiving applications</p>
        <Button 
          onClick={() => navigate('/employer/post-opportunity')}
          className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Post Opportunity
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {opportunities.map((opp, index) => (
        <motion.div
          key={opp.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className={`p-5 rounded-2xl bg-card/80 backdrop-blur-sm border transition-all duration-200 ${
            opp.is_featured 
              ? 'border-primary/50 shadow-lg shadow-primary/10' 
              : 'border-border/50 hover:border-border'
          }`}
        >
          <div className="flex flex-col lg:flex-row lg:items-start gap-4">
            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {opp.is_featured && (
                  <Badge className="bg-primary/20 text-primary border-primary/30">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Featured
                  </Badge>
                )}
                <Badge className={`border ${getTypeColor(opp.opportunity_type)}`}>
                  {opp.opportunity_type === 'wil' ? 'WIL' : opp.opportunity_type.charAt(0).toUpperCase() + opp.opportunity_type.slice(1)}
                </Badge>
                <Badge variant="outline" className="border-border/50">{opp.industry}</Badge>
                {opp.ai_generated && (
                  <Badge className="bg-warning/20 text-warning border-warning/30">AI draft</Badge>
                )}
                {opp.ai_review_status === 'approved' ? (
                  <Badge className="bg-success/20 text-success border-success/30">Reviewed</Badge>
                ) : opp.ai_review_status === 'flagged' ? (
                  <Badge className="bg-destructive/20 text-destructive border-destructive/30">Needs compliance fix</Badge>
                ) : opp.ai_review_status === 'pending' ? (
                  <Badge className="bg-warning/20 text-warning border-warning/30">Pending review</Badge>
                ) : null}
              </div>

              <h3 className="text-lg font-semibold text-foreground mb-1">{opp.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{opp.description}</p>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {opp.location} · {opp.location_type}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {opp.views_count} views
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {opp.applications_count} applications
                </span>
                {opp.application_deadline && (
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Closes {format(new Date(opp.application_deadline), 'MMM d, yyyy')}
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex lg:flex-col items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {opp.is_active ? 'Active' : 'Paused'}
                </span>
                <Switch
                  checked={opp.is_active}
                  onCheckedChange={(checked) => onToggleActive(opp.id, checked)}
                  className="data-[state=checked]:bg-success"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit?.(opp.id)}
                  className="border-border/50"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  onClick={() => navigate(`/employer/applicants?opportunity=${opp.id}`)}
                  className="bg-primary/10 text-primary hover:bg-primary/20"
                >
                  View Applicants
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}