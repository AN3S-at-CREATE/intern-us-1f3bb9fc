import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useOpportunities } from '@/hooks/useOpportunities';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { buildMatchRequestPayload } from '@/lib/matchingService';
import { 
  Search, 
  MapPin, 
  Building2, 
  Clock, 
  Bookmark,
  BookmarkCheck,
  Sparkles,
  Filter,
  Briefcase,
  GraduationCap,
  Loader2,
  Calendar,
  DollarSign,
  Eye,
  EyeOff,
  ChevronRight,
  TrendingUp,
  X
} from 'lucide-react';

interface MatchScore {
  score: number;
  reasons: string[];
  recommendation: string;
  biasAssessment?: {
    risk: string;
    flags: string[];
  };
  normalizedDemographics?: {
    province: string | null;
    languages: string[];
    genderProxy: string | null;
  };
  featureLog?: {
    notes: string[];
    blindMatchEnforced: boolean;
  };
}

export default function Opportunities() {
  const [search, setSearch] = useState('');
  const [industry, setIndustry] = useState('all');
  const [opportunityType, setOpportunityType] = useState('all');
  const [locationType, setLocationType] = useState('all');
  const [location, setLocation] = useState('all');
  const [blindMatchMode, setBlindMatchMode] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [matchScores, setMatchScores] = useState<Record<string, MatchScore>>({});
  const [loadingScores, setLoadingScores] = useState<Set<string>>(new Set());
  const [selectedOpportunity, setSelectedOpportunity] = useState<string | null>(null);

  const { opportunities, isLoading, savedIds, appliedIds, fetchOpportunities, toggleSave } = useOpportunities();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchOpportunities({ search, industry, location, opportunityType, locationType });
  }, [search, industry, location, opportunityType, locationType]);

  const getMatchScore = async (opportunityId: string, opportunity: any) => {
    if (matchScores[opportunityId] || loadingScores.has(opportunityId)) return;
    
    setLoadingScores(prev => new Set(prev).add(opportunityId));
    
    try {
      // Fetch student profile
      const { data: studentProfile } = await supabase
        .from('student_profiles')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      const matchRequest = buildMatchRequestPayload(studentProfile || {}, opportunity, { blindMatchMode });

      console.info('match_features', matchRequest.featureLog);

      const { data, error } = await supabase.functions.invoke('ai-match-score', {
        body: matchRequest,
      });

      if (error) throw error;
      setMatchScores(prev => ({ ...prev, [opportunityId]: data }));
    } catch (error) {
      console.error('Error getting match score:', error);
    } finally {
      setLoadingScores(prev => {
        const next = new Set(prev);
        next.delete(opportunityId);
        return next;
      });
    }
  };

  const handleApply = async (opportunityId: string) => {
    if (!user) {
      toast({ title: 'Please sign in to apply', variant: 'destructive' });
      return;
    }

    try {
      const matchScore = matchScores[opportunityId];
      const { error } = await supabase.from('applications').insert({
        opportunity_id: opportunityId,
        user_id: user.id,
        match_score: matchScore?.score || null,
        match_reasons: matchScore?.reasons || null,
      });

      if (error) throw error;
      
      toast({ title: 'Application submitted successfully!' });
      fetchOpportunities({ search, industry, location, opportunityType, locationType });
    } catch (error: any) {
      toast({ title: 'Failed to apply', description: error.message, variant: 'destructive' });
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'internship': return 'bg-primary/20 text-primary border-primary/30';
      case 'graduate': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'wil': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'learnership': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const getBiasColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'text-green-400';
      case 'medium':
        return 'text-yellow-400';
      default:
        return 'text-orange-400';
    }
  };

  const formatStipend = (min?: number | null, max?: number | null) => {
    if (!min && !max) return null;
    if (min && max) return `R${min.toLocaleString()} - R${max.toLocaleString()}`;
    if (min) return `From R${min.toLocaleString()}`;
    return `Up to R${max?.toLocaleString()}`;
  };

  const clearFilters = () => {
    setSearch('');
    setIndustry('all');
    setOpportunityType('all');
    setLocationType('all');
    setLocation('all');
  };

  const hasActiveFilters = search || industry !== 'all' || opportunityType !== 'all' || locationType !== 'all' || location !== 'all';

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-accent/5 border border-primary/30">
              <Briefcase className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-heading text-foreground">Opportunities</h1>
              <p className="text-muted-foreground">{opportunities.length} opportunities available</p>
            </div>
          </div>

          {/* Blind Match Toggle */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-card/50 border border-border/50">
            <div className="flex items-center gap-2">
              {blindMatchMode ? <EyeOff className="h-4 w-4 text-accent" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
              <span className="text-sm font-medium text-foreground">Blind Match</span>
            </div>
            <Switch 
              checked={blindMatchMode} 
              onCheckedChange={setBlindMatchMode}
              className="data-[state=checked]:bg-accent"
            />
          </div>
        </div>

        {/* Search & Filters */}
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search opportunities, companies..."
                className="pl-10 bg-card/50 border-border/50"
              />
            </div>
            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)}
              className={`border-border/50 ${showFilters ? 'bg-primary/10 border-primary/30' : ''}`}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {hasActiveFilters && (
                <span className="ml-2 w-2 h-2 rounded-full bg-primary" />
              )}
            </Button>
          </div>

          {showFilters && (
            <div className="p-4 rounded-xl bg-card/50 border border-border/50 space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">Industry</label>
                  <Select value={industry} onValueChange={setIndustry}>
                    <SelectTrigger className="bg-background/50 border-border/50">
                      <SelectValue placeholder="All Industries" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Industries</SelectItem>
                      <SelectItem value="Technology">Technology</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Retail">Retail</SelectItem>
                      <SelectItem value="Mining">Mining</SelectItem>
                      <SelectItem value="Media">Media</SelectItem>
                      <SelectItem value="Healthcare">Healthcare</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">Type</label>
                  <Select value={opportunityType} onValueChange={setOpportunityType}>
                    <SelectTrigger className="bg-background/50 border-border/50">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="internship">Internship</SelectItem>
                      <SelectItem value="graduate">Graduate Programme</SelectItem>
                      <SelectItem value="wil">WIL Placement</SelectItem>
                      <SelectItem value="learnership">Learnership</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">Work Mode</label>
                  <Select value={locationType} onValueChange={setLocationType}>
                    <SelectTrigger className="bg-background/50 border-border/50">
                      <SelectValue placeholder="All Modes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Modes</SelectItem>
                      <SelectItem value="remote">Remote</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                      <SelectItem value="onsite">On-site</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">Province</label>
                  <Select value={location} onValueChange={setLocation}>
                    <SelectTrigger className="bg-background/50 border-border/50">
                      <SelectValue placeholder="All Locations" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      <SelectItem value="Gauteng">Gauteng</SelectItem>
                      <SelectItem value="Western Cape">Western Cape</SelectItem>
                      <SelectItem value="KwaZulu-Natal">KwaZulu-Natal</SelectItem>
                      <SelectItem value="Eastern Cape">Eastern Cape</SelectItem>
                      <SelectItem value="Remote">Remote</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
                  <X className="h-4 w-4 mr-1" />
                  Clear filters
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Opportunities Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : opportunities.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No opportunities found</h3>
            <p className="text-muted-foreground">Try adjusting your filters or search terms</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {opportunities.map((opp) => {
              const matchScore = matchScores[opp.id];
              const isLoadingScore = loadingScores.has(opp.id);
              const isSaved = savedIds.has(opp.id);
              const hasApplied = appliedIds.has(opp.id);
              const isExpanded = selectedOpportunity === opp.id;
              const stipend = formatStipend(opp.stipend_min, opp.stipend_max);

              return (
                <div
                  key={opp.id}
                  className={`p-5 rounded-2xl bg-card/80 backdrop-blur-sm border transition-all duration-200 ${
                    opp.is_featured 
                      ? 'border-primary/50 shadow-lg shadow-primary/10' 
                      : 'border-border/50 hover:border-border'
                  } ${isExpanded ? 'ring-2 ring-primary/30' : ''}`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                    {/* Company Logo / Icon */}
                    <div className="shrink-0">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 flex items-center justify-center">
                        {blindMatchMode ? (
                          <Building2 className="h-6 w-6 text-primary" />
                        ) : (
                          <span className="text-lg font-bold text-primary">
                            {opp.company_name.charAt(0)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0 space-y-3">
                      <div className="flex flex-wrap items-start gap-2">
                        {opp.is_featured && (
                          <Badge className="bg-primary/20 text-primary border-primary/30">
                            <Sparkles className="h-3 w-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                        <Badge className={`border ${getTypeColor(opp.opportunity_type)}`}>
                          {opp.opportunity_type === 'wil' ? 'WIL' : opp.opportunity_type.charAt(0).toUpperCase() + opp.opportunity_type.slice(1)}
                        </Badge>
                        <Badge variant="outline" className="border-border/50">
                          {opp.industry}
                        </Badge>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-foreground">{opp.title}</h3>
                        <p className="text-muted-foreground">
                          {blindMatchMode ? 'Company Hidden' : opp.company_name}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {opp.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Briefcase className="h-4 w-4" />
                          {opp.location_type}
                        </span>
                        {opp.duration_months && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {opp.duration_months} months
                          </span>
                        )}
                        {stipend && (
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            {stipend}/month
                          </span>
                        )}
                        {opp.application_deadline && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Closes {new Date(opp.application_deadline).toLocaleDateString()}
                          </span>
                        )}
                      </div>

                      {isExpanded && (
                        <div className="pt-3 space-y-3 border-t border-border/30">
                          <p className="text-sm text-foreground/80">{opp.description}</p>
                          {opp.requirements && (
                            <div>
                              <h4 className="text-sm font-medium text-foreground mb-1">Requirements</h4>
                              <p className="text-sm text-muted-foreground">{opp.requirements}</p>
                            </div>
                          )}
                          {opp.field_of_study && opp.field_of_study.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              <GraduationCap className="h-4 w-4 text-muted-foreground" />
                              {opp.field_of_study.map((field) => (
                                <Badge key={field} variant="outline" className="text-xs border-border/30">
                                  {field}
                                </Badge>
                              ))}
                            </div>
                          )}
                          
                          {/* Match Score Details */}
                          {matchScore && (
                            <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-foreground flex items-center gap-2">
                                  <TrendingUp className="h-4 w-4 text-primary" />
                                  AI Match Analysis
                                </span>
                                <span className={`text-2xl font-bold ${getScoreColor(matchScore.score)}`}>
                                  {matchScore.score}%
                                </span>
                              </div>
                              <ul className="space-y-1">
                                {matchScore.reasons.slice(0, 3).map((reason, i) => (
                                  <li key={i} className="text-sm text-foreground/80 flex items-start gap-2">
                                    <span className="text-primary mt-1">•</span>
                                    {reason}
                                  </li>
                                ))}
                              </ul>
                              <p className="text-sm text-muted-foreground italic">
                                {matchScore.recommendation}
                              </p>
                              {(matchScore.biasAssessment || matchScore.featureLog) && (
                                <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                                  {matchScore.biasAssessment && (
                                    <div className="flex items-center gap-2">
                                      <span>Bias check:</span>
                                      <span className={`font-semibold ${getBiasColor(matchScore.biasAssessment.risk)}`}>
                                        {matchScore.biasAssessment.risk}
                                      </span>
                                      {matchScore.biasAssessment.flags.length > 0 && (
                                        <span className="italic">({matchScore.biasAssessment.flags.join(', ')})</span>
                                      )}
                                    </div>
                                  )}
                                  {matchScore.featureLog && (
                                    <div className="flex items-center gap-2">
                                      <span>Blind match enforced:</span>
                                      <Badge variant={matchScore.featureLog.blindMatchEnforced ? 'secondary' : 'outline'}>
                                        {matchScore.featureLog.blindMatchEnforced ? 'On' : 'Off'}
                                      </Badge>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex lg:flex-col items-center gap-2 shrink-0">
                      {/* Match Score Badge */}
                      {matchScore ? (
                        <div className={`px-3 py-2 rounded-lg bg-card border border-border/50 text-center`}>
                          <div className={`text-xl font-bold ${getScoreColor(matchScore.score)}`}>
                            {matchScore.score}%
                          </div>
                          <div className="text-xs text-muted-foreground">Match</div>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => getMatchScore(opp.id, opp)}
                          disabled={isLoadingScore}
                          className="border-accent/30 text-accent hover:bg-accent/10"
                        >
                          {isLoadingScore ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <Sparkles className="h-4 w-4 mr-1" />
                              Match
                            </>
                          )}
                        </Button>
                      )}

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleSave(opp.id)}
                        className={isSaved ? 'text-primary' : 'text-muted-foreground'}
                      >
                        {isSaved ? <BookmarkCheck className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedOpportunity(isExpanded ? null : opp.id)}
                        className="text-muted-foreground"
                      >
                        <ChevronRight className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                      </Button>

                      {hasApplied ? (
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                          Applied
                        </Badge>
                      ) : (
                        <Button
                          onClick={() => handleApply(opp.id)}
                          className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
                          size="sm"
                        >
                          Apply
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
