import { useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import {
  FileText,
  Sparkles,
  Download,
  Copy,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  BarChart3,
  ClipboardList,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface WILReportGeneratorProps {
  onGenerateReport: (reportType: string, dateRange?: { start: string; end: string }) => Promise<any>;
  isLoading?: boolean;
}

const reportTypes = [
  {
    id: "placement_summary",
    label: "Placement Summary",
    description: "Comprehensive overview of all placements",
    icon: BarChart3,
  },
  {
    id: "risk_assessment",
    label: "At-Risk Assessment",
    description: "Students requiring intervention",
    icon: AlertTriangle,
  },
  {
    id: "compliance_checklist",
    label: "Compliance Checklist",
    description: "DHET/SETA submission requirements",
    icon: ClipboardList,
  },
  {
    id: "quarterly_report",
    label: "Quarterly Report",
    description: "Period progress and achievements",
    icon: Calendar,
  },
];

export function WILReportGenerator({ onGenerateReport, isLoading }: WILReportGeneratorProps) {
  const [selectedReport, setSelectedReport] = useState<string>("");
  const [generatedReport, setGeneratedReport] = useState<string>("");
  const [reportStats, setReportStats] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!selectedReport) {
      toast.error("Please select a report type");
      return;
    }

    setIsGenerating(true);
    setGeneratedReport("");
    setReportStats(null);

    try {
      const result = await onGenerateReport(selectedReport);
      if (result) {
        setGeneratedReport(result.report);
        setReportStats(result.stats);
        toast.success("Report generated successfully");
      }
    } catch (error) {
      toast.error("Failed to generate report");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedReport);
    toast.success("Report copied to clipboard");
  };

  const handleDownload = () => {
    const blob = new Blob([generatedReport], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `wil-report-${selectedReport}-${format(new Date(), "yyyy-MM-dd")}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Report downloaded");
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Report Selection */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-primary/20">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">AI Report Generator</h2>
            <p className="text-sm text-muted-foreground">
              Generate professional WIL reports for DHET/SETA compliance
            </p>
          </div>
        </div>

        {/* Report Type Selection */}
        <div className="space-y-4 mb-6">
          <label className="text-sm font-medium">Select Report Type</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {reportTypes.map((report) => (
              <motion.button
                key={report.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedReport(report.id)}
                className={`p-4 rounded-lg border text-left transition-all ${
                  selectedReport === report.id
                    ? "border-primary bg-primary/10"
                    : "border-border/50 hover:border-primary/50"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <report.icon
                    className={`h-5 w-5 ${
                      selectedReport === report.id ? "text-primary" : "text-muted-foreground"
                    }`}
                  />
                  <span className="font-medium">{report.label}</span>
                </div>
                <p className="text-xs text-muted-foreground">{report.description}</p>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <Button
          onClick={handleGenerate}
          disabled={!selectedReport || isGenerating}
          className="w-full gap-2"
        >
          {isGenerating ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="h-4 w-4" />
              </motion.div>
              Generating Report...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Generate Report
            </>
          )}
        </Button>

        {/* Stats Preview */}
        {reportStats && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 rounded-lg bg-muted/30 border border-border/50"
          >
            <h3 className="text-sm font-medium mb-3">Report Statistics</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-xl font-bold text-primary">{reportStats.total}</div>
                <div className="text-xs text-muted-foreground">Total Students</div>
              </div>
              <div>
                <div className="text-xl font-bold text-green-400">{reportStats.placed}</div>
                <div className="text-xs text-muted-foreground">Placed</div>
              </div>
              <div>
                <div className="text-xl font-bold text-red-400">{reportStats.atRisk}</div>
                <div className="text-xs text-muted-foreground">At Risk</div>
              </div>
            </div>
          </motion.div>
        )}
      </GlassCard>

      {/* Generated Report Preview */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-secondary/20">
              <FileText className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Generated Report</h2>
              <p className="text-sm text-muted-foreground">Preview and export</p>
            </div>
          </div>
          {generatedReport && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCopy}>
                <Copy className="h-4 w-4 mr-1" />
                Copy
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
            </div>
          )}
        </div>

        <div className="relative h-[400px]">
          {generatedReport ? (
            <Textarea
              value={generatedReport}
              readOnly
              className="h-full resize-none bg-background/50 font-mono text-sm"
            />
          ) : (
            <div className="h-full flex items-center justify-center border border-dashed border-border/50 rounded-lg">
              <div className="text-center text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Select a report type and click Generate</p>
                <p className="text-xs mt-1">AI will create a professional report</p>
              </div>
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
}
