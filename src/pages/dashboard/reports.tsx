import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Download,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Filter,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTheme } from '@/lib/theme-context';

const reportTypeLabels: Record<string, string> = {
  CHEAT_SHEET: 'Cheat Sheet',
  FULL_REPORT: 'Full Report',
  COMPETITOR_BRIEF: 'Competitor Brief',
  OPPORTUNITY_DECK: 'Opportunity Deck',
  AI_READINESS: 'AI Readiness Report',
};

const formatLabels: Record<string, string> = {
  PDF: 'PDF',
  DOCX: 'Word',
  JSON: 'JSON',
};

const statusIcons = {
  PENDING: Clock,
  GENERATING: Loader2,
  COMPLETED: CheckCircle,
  FAILED: XCircle,
};

export default function ReportsPage() {
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Note: We'll need to add a report.list endpoint to the API
  // For now, we'll show an empty state
  const isLoading = false;
  const reports: Array<{
    id: string;
    type: string;
    format: string;
    status: string;
    fileUrl?: string;
    createdAt: Date;
    completedAt?: Date;
    analysis: {
      id: string;
      company: { name: string; domain: string };
    };
  }> = [];

  return (
    <div className="space-y-8">
      {/* Header with Glassmorphism */}
      <div className={`relative overflow-hidden rounded-3xl p-8 backdrop-blur-2xl shadow-2xl border transition-colors duration-500 ${
        isDark ? 'bg-gradient-to-br from-white/10 via-white/5 to-white/[0.02] border-white/10' : 'bg-gradient-to-br from-white/70 via-white/50 to-white/30 border-white/40'
      }`}>
        {/* Decorative gradient orbs */}
        <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 transition-colors duration-500 ${
          isDark ? 'from-cyan-500/20' : 'from-[#d4c4a8]/40'
        }`} />
        <div className={`absolute bottom-0 left-1/4 w-48 h-48 bg-gradient-to-tr to-transparent rounded-full blur-2xl translate-y-1/2 transition-colors duration-500 ${
          isDark ? 'from-cyan-500/20' : 'from-[#c9b896]/30'
        }`} />

        <div className="relative">
          <div className="flex items-center gap-3 mb-2">
            <div className={`h-2 w-2 rounded-full bg-gradient-to-r animate-pulse transition-colors duration-500 ${
              isDark ? 'from-cyan-500 to-purple-500' : 'from-[#8B7355] to-[#5C4A2A]'
            }`} />
            <span className={`text-sm font-medium tracking-widest uppercase transition-colors duration-500 ${
              isDark ? 'text-cyan-400' : 'text-[#8B7355]'
            }`}>Reports</span>
          </div>
          <h1 className={`text-3xl font-light tracking-wide transition-colors duration-500 ${
            isDark ? 'text-white' : 'text-[#3D3124]'
          }`}>Your Reports</h1>
          <p className={`mt-1 font-light transition-colors duration-500 ${
            isDark ? 'text-white/60' : 'text-[#5C4A2A]/60'
          }`}>
            Generated reports from your analyses. Download and share with your team.
          </p>
        </div>
      </div>

      {/* Filters Card */}
      <div className={`relative overflow-hidden rounded-3xl backdrop-blur-2xl shadow-xl border p-6 transition-colors duration-500 ${
        isDark ? 'bg-white/5 border-white/10' : 'bg-white/60 border-white/40'
      }`}>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`flex h-8 w-8 items-center justify-center rounded-xl transition-colors duration-500 ${
              isDark ? 'bg-gradient-to-br from-cyan-500/20 to-purple-500/10 border-cyan-500/20' : 'bg-gradient-to-br from-[#5C4A2A]/10 to-[#8B7355]/10 border-[#5C4A2A]/10'
            }`}>
              <Filter className={`h-4 w-4 transition-colors duration-500 ${
                isDark ? 'text-cyan-400' : 'text-[#5C4A2A]'
              }`} />
            </div>
            <span className={`text-sm font-light transition-colors duration-500 ${
              isDark ? 'text-white/70' : 'text-[#5C4A2A]/70'
            }`}>Filter by type:</span>
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className={`w-48 backdrop-blur-sm rounded-xl transition-colors duration-500 ${
              isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white/70 border-[#5C4A2A]/15 text-[#3D3124]'
            }`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className={`backdrop-blur-xl rounded-xl transition-colors duration-500 ${
              isDark ? 'bg-black/95 border-white/10' : 'bg-white/95 border-[#5C4A2A]/10'
            }`}>
              <SelectItem value="all" className={`rounded-lg transition-colors duration-500 ${
                isDark ? 'text-white focus:bg-white/10' : 'text-[#5C4A2A] focus:bg-[#ebe3d3]'
              }`}>All Types</SelectItem>
              {Object.entries(reportTypeLabels).map(([value, label]) => (
                <SelectItem key={value} value={value} className={`rounded-lg transition-colors duration-500 ${
                  isDark ? 'text-white focus:bg-white/10' : 'text-[#5C4A2A] focus:bg-[#ebe3d3]'
                }`}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Reports List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={`relative overflow-hidden rounded-2xl backdrop-blur-2xl shadow-lg p-5 transition-colors duration-500 ${
              isDark ? 'bg-white/5 border-white/10' : 'bg-white/60 border-white/40'
            }`}>
              <div className="flex items-center gap-4">
                <Skeleton className={`h-12 w-12 rounded-2xl transition-colors duration-500 ${
                  isDark ? 'bg-white/10' : 'bg-[#5C4A2A]/10'
                }`} />
                <div className="flex-1 space-y-2">
                  <Skeleton className={`h-4 w-48 rounded-lg transition-colors duration-500 ${
                    isDark ? 'bg-white/10' : 'bg-[#5C4A2A]/10'
                  }`} />
                  <Skeleton className={`h-3 w-32 rounded-lg transition-colors duration-500 ${
                    isDark ? 'bg-white/10' : 'bg-[#5C4A2A]/10'
                  }`} />
                </div>
                <Skeleton className={`h-9 w-24 rounded-lg transition-colors duration-500 ${
                  isDark ? 'bg-white/10' : 'bg-[#5C4A2A]/10'
                }`} />
              </div>
            </div>
          ))}
        </div>
      ) : reports.length === 0 ? (
        <div className={`relative overflow-hidden rounded-3xl backdrop-blur-2xl shadow-xl border transition-colors duration-500 ${
          isDark ? 'bg-white/5 border-white/10' : 'bg-white/60 border-white/40'
        }`}>
          <div className={`absolute -top-20 -right-20 w-48 h-48 bg-gradient-to-br to-transparent rounded-full blur-2xl transition-colors duration-500 ${
            isDark ? 'from-cyan-500/20' : 'from-[#d4c4a8]/30'
          }`} />
          <div className="relative flex flex-col items-center justify-center py-16">
            <div className={`flex h-16 w-16 items-center justify-center rounded-2xl transition-colors duration-500 ${
              isDark ? 'bg-gradient-to-br from-cyan-500/20 to-purple-500/10 border-cyan-500/20' : 'bg-gradient-to-br from-[#5C4A2A]/10 to-[#8B7355]/10 border-[#5C4A2A]/10'
            }`}>
              <FileText className={`h-7 w-7 transition-colors duration-500 ${
                isDark ? 'text-white/50' : 'text-[#5C4A2A]/50'
              }`} />
            </div>
            <h3 className={`mt-5 font-medium tracking-wide text-lg transition-colors duration-500 ${
              isDark ? 'text-white' : 'text-[#3D3124]'
            }`}>No reports yet</h3>
            <p className={`mt-2 font-light text-center max-w-sm transition-colors duration-500 ${
              isDark ? 'text-white/60' : 'text-[#5C4A2A]/60'
            }`}>
              Reports are generated from completed analyses. Run an analysis and
              export reports from the results page.
            </p>
            <Link to="/dashboard/new">
              <Button className={`mt-6 gap-2 rounded-2xl px-6 shadow-lg transition-all duration-500 hover:scale-[1.02] ${
                isDark
                  ? 'bg-white/10 text-white border border-white/20 hover:bg-white/15 hover:border-cyan-500/40 hover:shadow-lg hover:shadow-cyan-500/20 backdrop-blur-sm'
                  : 'bg-gradient-to-r from-[#5C4A2A] to-[#8B7355] text-white hover:from-[#4a3a21] hover:to-[#7a6348] shadow-[#5C4A2A]/20'
              }`}>
                Start Analysis
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => {
            const StatusIcon = statusIcons[report.status as keyof typeof statusIcons] || Clock;
            const isGenerating = report.status === 'GENERATING';

            return (
              <div key={report.id} className={`group relative overflow-hidden rounded-2xl backdrop-blur-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border ${
                isDark ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white/60 border-white/40 hover:bg-white/70'
              }`}>
                {/* Hover gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                  isDark ? 'from-cyan-500/10 to-purple-500/10' : 'from-[#5C4A2A]/5 to-[#8B7355]/5'
                }`} />

                <div className="relative p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-all group-hover:scale-105 duration-500 ${
                          report.status === 'COMPLETED'
                            ? isDark
                              ? 'bg-gradient-to-br from-cyan-500/20 to-emerald-500/10 border border-cyan-500/20'
                              : 'bg-gradient-to-br from-[#5C4A2A]/15 to-[#8B7355]/10 border border-[#5C4A2A]/10'
                            : report.status === 'FAILED'
                            ? 'bg-red-100/80 border border-red-200'
                            : isDark
                            ? 'bg-white/5 border border-white/10'
                            : 'bg-[#5C4A2A]/5 border border-[#5C4A2A]/10'
                        }`}
                      >
                        <FileText
                          className={`h-6 w-6 transition-colors duration-500 ${
                            report.status === 'COMPLETED'
                              ? isDark ? 'text-cyan-400' : 'text-[#5C4A2A]'
                              : report.status === 'FAILED'
                              ? 'text-red-600'
                              : isDark ? 'text-white/40' : 'text-[#5C4A2A]/40'
                          }`}
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className={`font-medium tracking-wide transition-colors duration-500 ${
                            isDark ? 'text-white group-hover:text-cyan-400' : 'text-[#3D3124] group-hover:text-[#5C4A2A]'
                          }`}>
                            {reportTypeLabels[report.type] || report.type}
                          </h3>
                          <Badge variant="outline" className={`text-xs rounded-lg transition-colors duration-500 ${
                            isDark ? 'border-white/20 text-white bg-white/5' : 'border-[#5C4A2A]/20 text-[#5C4A2A] bg-white/50'
                          }`}>
                            {formatLabels[report.format] || report.format}
                          </Badge>
                        </div>
                        <div className={`flex items-center gap-2 text-sm font-light transition-colors duration-500 ${
                          isDark ? 'text-white/60' : 'text-[#5C4A2A]/60'
                        }`}>
                          <Link
                            to={`/dashboard/analysis/${report.analysis.id}`}
                            className={`transition-colors duration-500 ${
                              isDark ? 'hover:text-cyan-400' : 'hover:text-[#8B7355]'
                            }`}
                          >
                            {report.analysis.company.name}
                          </Link>
                          <span>•</span>
                          <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        className={`rounded-lg font-medium transition-colors duration-500 ${
                          report.status === 'COMPLETED'
                            ? isDark
                              ? 'bg-cyan-500/20 text-cyan-400 border-0'
                              : 'bg-[#5C4A2A]/10 text-[#5C4A2A] border-0'
                            : report.status === 'FAILED'
                            ? 'bg-red-100 text-red-700 border-0'
                            : isDark
                            ? 'bg-white/10 text-white border-0'
                            : 'bg-[#8B7355]/20 text-[#8B7355] border-0'
                        }`}
                      >
                        <StatusIcon
                          className={`mr-1 h-3 w-3 ${isGenerating ? 'animate-spin' : ''}`}
                        />
                        {report.status}
                      </Badge>
                      {report.status === 'COMPLETED' && report.fileUrl && (
                        <a href={report.fileUrl} download>
                          <Button variant="outline" size="sm" className={`gap-2 rounded-xl transition-colors duration-500 ${
                            isDark ? 'border-white/20 text-white hover:bg-white/10' : 'border-[#5C4A2A]/20 text-[#5C4A2A] hover:bg-[#5C4A2A]/5'
                          }`}>
                            <Download className="h-4 w-4" />
                            Download
                          </Button>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Report Types Info Card */}
      <div className={`relative overflow-hidden rounded-3xl backdrop-blur-2xl shadow-xl border transition-colors duration-500 ${
        isDark ? 'bg-white/5 border-white/10' : 'bg-white/60 border-white/40'
      }`}>
        {/* Decorative gradient orbs */}
        <div className={`absolute -bottom-20 -left-20 w-48 h-48 bg-gradient-to-tr to-transparent rounded-full blur-2xl transition-colors duration-500 ${
          isDark ? 'from-cyan-500/20' : 'from-[#c9b896]/25'
        }`} />

        <div className="relative p-6">
          <div className="flex items-center gap-3 mb-2">
            <span className={`text-xs font-medium tracking-widest uppercase transition-colors duration-500 ${
              isDark ? 'text-cyan-400' : 'text-[#8B7355]'
            }`}>Report Types</span>
          </div>
          <p className={`text-sm font-light mb-6 transition-colors duration-500 ${
            isDark ? 'text-white/60' : 'text-[#5C4A2A]/60'
          }`}>
            Different report formats available for your analyses
          </p>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              { title: 'Cheat Sheet', desc: '2-page quick reference with key insights and talking points.' },
              { title: 'Full Report', desc: 'Comprehensive 15+ page analysis with all findings.' },
              { title: 'Competitor Brief', desc: 'Focused competitive analysis with market positioning.' },
              { title: 'Opportunity Deck', desc: 'Slide-ready presentation of top opportunities.' },
              { title: 'AI Readiness', desc: "Assessment of company's AI/automation potential." },
            ].map((item) => (
              <div key={item.title} className={`group rounded-2xl backdrop-blur-sm p-4 hover:shadow-lg transition-all duration-500 ${
                isDark ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white/50 border-white/50 hover:bg-white/70'
              }`}>
                <h4 className={`font-medium tracking-wide transition-colors duration-500 ${
                  isDark ? 'text-white group-hover:text-cyan-400' : 'text-[#3D3124] group-hover:text-[#5C4A2A]'
                }`}>{item.title}</h4>
                <p className={`mt-1 text-sm font-light transition-colors duration-500 ${
                  isDark ? 'text-white/70' : 'text-[#5C4A2A]/70'
                }`}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
