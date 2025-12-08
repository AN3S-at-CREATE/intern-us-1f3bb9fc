import { useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import {
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  Clock,
  MoreVertical,
  Eye,
  Edit,
  FileText,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { WILPlacement } from "@/hooks/useUniversity";

interface PlacementTableProps {
  placements: WILPlacement[];
  onViewPlacement?: (placement: WILPlacement) => void;
  onEditPlacement?: (placement: WILPlacement) => void;
}

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: "Pending", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", icon: Clock },
  placed: { label: "Placed", color: "bg-green-500/20 text-green-400 border-green-500/30", icon: CheckCircle2 },
  active: { label: "Active", color: "bg-blue-500/20 text-blue-400 border-blue-500/30", icon: CheckCircle2 },
  completed: { label: "Completed", color: "bg-purple-500/20 text-purple-400 border-purple-500/30", icon: CheckCircle2 },
  withdrawn: { label: "Withdrawn", color: "bg-gray-500/20 text-gray-400 border-gray-500/30", icon: AlertTriangle },
};

const riskConfig: Record<string, { label: string; color: string }> = {
  low: { label: "Low Risk", color: "bg-green-500/20 text-green-400" },
  medium: { label: "Medium Risk", color: "bg-yellow-500/20 text-yellow-400" },
  high: { label: "High Risk", color: "bg-red-500/20 text-red-400" },
};

export function PlacementTable({ placements, onViewPlacement, onEditPlacement }: PlacementTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [riskFilter, setRiskFilter] = useState<string>("all");

  const filteredPlacements = placements.filter((placement) => {
    const matchesSearch =
      placement.employer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      placement.student_user_id.includes(searchQuery);
    const matchesStatus = statusFilter === "all" || placement.status === statusFilter;
    const matchesRisk = riskFilter === "all" || placement.risk_level === riskFilter;
    return matchesSearch && matchesStatus && matchesRisk;
  });

  return (
    <GlassCard className="p-6">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by employer or student..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-background/50"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-[180px] bg-background/50">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="placed">Placed</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="withdrawn">Withdrawn</SelectItem>
          </SelectContent>
        </Select>
        <Select value={riskFilter} onValueChange={setRiskFilter}>
          <SelectTrigger className="w-full md:w-[180px] bg-background/50">
            <SelectValue placeholder="Filter by risk" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Risk Levels</SelectItem>
            <SelectItem value="low">Low Risk</SelectItem>
            <SelectItem value="medium">Medium Risk</SelectItem>
            <SelectItem value="high">High Risk</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50">
              <TableHead>Student</TableHead>
              <TableHead>Employer</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Risk</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPlacements.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No placements found
                </TableCell>
              </TableRow>
            ) : (
              filteredPlacements.map((placement, index) => {
                const status = statusConfig[placement.status] || statusConfig.pending;
                const risk = riskConfig[placement.risk_level] || riskConfig.low;
                const progress = placement.hours_required > 0
                  ? Math.round((placement.hours_completed / placement.hours_required) * 100)
                  : 0;

                return (
                  <motion.tr
                    key={placement.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-border/30 hover:bg-muted/20"
                  >
                    <TableCell>
                      <div className="font-medium">
                        {placement.student_profile?.first_name || 'Student'}{' '}
                        {placement.student_profile?.last_name || placement.student_user_id.slice(0, 8)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {placement.student_details?.qualification || 'Qualification pending'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{placement.employer_name || 'TBD'}</div>
                      {placement.supervisor_name && (
                        <div className="text-xs text-muted-foreground">
                          Supervisor: {placement.supervisor_name}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {placement.placement_type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${status.color} border`}>
                        <status.icon className="h-3 w-3 mr-1" />
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">{progress}%</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {placement.hours_completed}/{placement.hours_required} hrs
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={risk.color}>
                        {risk.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {placement.start_date
                        ? format(new Date(placement.start_date), 'dd MMM yyyy')
                        : 'Not set'}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onViewPlacement?.(placement)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onEditPlacement?.(placement)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Placement
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileText className="h-4 w-4 mr-2" />
                            Log Assessment
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </motion.tr>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Results count */}
      <div className="mt-4 text-sm text-muted-foreground">
        Showing {filteredPlacements.length} of {placements.length} placements
      </div>
    </GlassCard>
  );
}
