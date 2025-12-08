import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Upload, Download } from "lucide-react";
import { UniversityDashboardLayout } from "@/components/university/UniversityDashboardLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { PlacementTable } from "@/components/university/PlacementTable";
import { useUniversity } from "@/hooks/useUniversity";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function StudentPlacements() {
  const { placements, stats, isLoading, createPlacement } = useUniversity();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    student_user_id: "",
    employer_name: "",
    placement_type: "internship",
    status: "pending",
    start_date: "",
    end_date: "",
    hours_required: "480",
    supervisor_name: "",
    supervisor_email: "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.student_user_id) {
      toast.error("Student ID is required");
      return;
    }

    setIsSubmitting(true);
    try {
      await createPlacement({
        student_user_id: formData.student_user_id,
        employer_name: formData.employer_name || undefined,
        placement_type: formData.placement_type,
        status: formData.status,
        start_date: formData.start_date || undefined,
        end_date: formData.end_date || undefined,
        hours_required: parseInt(formData.hours_required) || 480,
        supervisor_name: formData.supervisor_name || undefined,
        supervisor_email: formData.supervisor_email || undefined,
        notes: formData.notes || undefined,
      });
      setIsDialogOpen(false);
      setFormData({
        student_user_id: "",
        employer_name: "",
        placement_type: "internship",
        status: "pending",
        start_date: "",
        end_date: "",
        hours_required: "480",
        supervisor_name: "",
        supervisor_email: "",
        notes: "",
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <UniversityDashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-96" />
        </div>
      </UniversityDashboardLayout>
    );
  }

  return (
    <UniversityDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl lg:text-3xl font-display font-bold"
            >
              Student Placements
            </motion.h1>
            <p className="text-muted-foreground">
              Manage and track WIL placements for your students
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Import CSV
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Placement
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Placement</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="student_user_id">Student ID *</Label>
                      <Input
                        id="student_user_id"
                        placeholder="Enter student user ID"
                        value={formData.student_user_id}
                        onChange={(e) =>
                          setFormData({ ...formData, student_user_id: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="employer_name">Employer Name</Label>
                      <Input
                        id="employer_name"
                        placeholder="Company name"
                        value={formData.employer_name}
                        onChange={(e) =>
                          setFormData({ ...formData, employer_name: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Placement Type</Label>
                      <Select
                        value={formData.placement_type}
                        onValueChange={(value) =>
                          setFormData({ ...formData, placement_type: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="internship">Internship</SelectItem>
                          <SelectItem value="wil">Work-Integrated Learning</SelectItem>
                          <SelectItem value="learnership">Learnership</SelectItem>
                          <SelectItem value="apprenticeship">Apprenticeship</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) =>
                          setFormData({ ...formData, status: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="placed">Placed</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="withdrawn">Withdrawn</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="start_date">Start Date</Label>
                      <Input
                        id="start_date"
                        type="date"
                        value={formData.start_date}
                        onChange={(e) =>
                          setFormData({ ...formData, start_date: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="end_date">End Date</Label>
                      <Input
                        id="end_date"
                        type="date"
                        value={formData.end_date}
                        onChange={(e) =>
                          setFormData({ ...formData, end_date: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hours_required">Hours Required</Label>
                      <Input
                        id="hours_required"
                        type="number"
                        value={formData.hours_required}
                        onChange={(e) =>
                          setFormData({ ...formData, hours_required: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="supervisor_name">Supervisor Name</Label>
                      <Input
                        id="supervisor_name"
                        placeholder="Workplace supervisor"
                        value={formData.supervisor_name}
                        onChange={(e) =>
                          setFormData({ ...formData, supervisor_name: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="supervisor_email">Supervisor Email</Label>
                      <Input
                        id="supervisor_email"
                        type="email"
                        placeholder="supervisor@company.com"
                        value={formData.supervisor_email}
                        onChange={(e) =>
                          setFormData({ ...formData, supervisor_email: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Additional notes about this placement..."
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Creating..." : "Create Placement"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <GlassCard className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{stats.totalStudents}</div>
            <div className="text-sm text-muted-foreground">Total Students</div>
          </GlassCard>
          <GlassCard className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{stats.placedStudents}</div>
            <div className="text-sm text-muted-foreground">Placed</div>
          </GlassCard>
          <GlassCard className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">{stats.pendingPlacements}</div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </GlassCard>
          <GlassCard className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">{stats.completedPlacements}</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </GlassCard>
        </div>

        {/* Placements Table */}
        <PlacementTable placements={placements} />
      </div>
    </UniversityDashboardLayout>
  );
}
