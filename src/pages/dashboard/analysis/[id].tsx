import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Download,
  MessageSquare,
  RefreshCw,
  Building2,
  Users,
  Target,
  Lightbulb,
  CheckCircle,
  Clock,
  XCircle,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { useTheme } from '../../../lib/theme-context';
import LiveActivityFeed from '../../../components/LiveActivityFeed';

const API_URL = import.meta.env.VITE_API_URL || '';

// Interfaces matching Claude's actual synthesized output structure
interface CheatSheetOpportunity {
  title: string;
  category: string;
  impact?: string;
  evidence?: string[];
  whyCustom?: string;
  whatWeBuild?: string;
  problemSummary?: string;
  hook?: {
    opener: string;
    credibilityDetail?: string;
  } | string;
  keyEvidence?: string;
  competitorPressure?: {
    competitors: string[];
    whatTheyHave: string;
  };
}

interface CheatSheet {
  // Claude's actual structure
  companySnapshot?: {
    name: string;
    size: string;
    industry: string;
    oneLiner: string;
    headquarters: string;
    techMaturity: string;
    techMaturityNote?: string;
    parentCompany?: string;
  };
  // Key context from research
  keyContext?: Array<{
    topic: string;
    explanation: string;
    source: string;
    whyItMatters?: string;
  }>;
  topOpportunity?: CheatSheetOpportunity;
  backupOpportunity1?: CheatSheetOpportunity;
  backupOpportunity2?: CheatSheetOpportunity;
  objectionHandlers?: Array<{
    objection: string;
    response: string;
    specificEvidence?: string;
  }>;
  differentiationPitch?: {
    whyUs: string;
    threeOptions: string;
  };
  statsForConversation?: Array<{
    stat: string;
    source: string;
    context: string;
  }>;
  // Industry terms glossary
  industryTermsGlossary?: Array<{
    term: string;
    definition: string;
    relevance?: string;
  }>;
  // Do Not Mention with reasons
  doNotMention?: Array<{
    topic: string;
    reason: string;
  }> | string[];
  // Legacy structure (from mock data)
  summary?: string;
  keyOpportunities?: string[];
  talkingPoints?: string[];
}

interface CompetitorMatrix {
  competitorName: string;
  marketPosition: string;
  strengths: string[];
  weaknesses: string[];
  techAdvantages: string[];
}

interface CompetitiveAnalysis {
  overview?: string;
  matrix?: CompetitorMatrix[];
  swot?: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  competitiveGaps?: string[];
  recommendations?: string[];
}

interface ConversationHook {
  openingQuestion?: string;
  followUp?: string;
  expectedResponse?: string;
  credibilityDetail?: string;
}

interface Opportunity {
  rank: number;
  title: string;
  category: string;
  problem?: { description: string };
  evidenceStrength?: { score: number };
  conversationHook?: string | ConversationHook;
  proposedSolution?: string;
  expectedOutcome?: string;
  evidence?: string[];
}

interface CompanyProfile {
  // Claude's actual structure
  executiveSummary?: string;
  overview?: {
    officialName?: string;
    foundingYear?: string;
    headquarters?: string;
    industry?: string;
    description?: string;
  };
  // Legacy structure (from mock data)
  basics?: {
    name?: string;
    domain?: string;
    industry?: string;
    employeeRange?: string;
    headquarters?: string;
    description?: string;
  };
  // Parent company information
  parentCompany?: {
    name?: string;
    relationship?: string;
    implications?: string;
  } | null;
  technologySignals?: {
    techMaturity?: string;
    techMaturityEvidence?: string;
    currentTechStack?: string[];
  };
  painPointIndicators?: Array<{
    signal: string;
    source: string;
    confidence: string;
  }>;
  // New enhanced data fields
  socialMediaPresence?: {
    platforms?: string[];
    linkedInFollowers?: string;
    twitterFollowers?: string;
    recentActivity?: string;
  };
  recentPress?: Array<{
    headline: string;
    source: string;
    date?: string;
    relevance?: string;
  }>;
  hiringSignals?: {
    openRoles?: string[];
    growthAreas?: string[];
    techFocus?: string;
  };
  customerSignals?: {
    reviewSentiment?: string;
    commonPraise?: string[];
    commonComplaints?: string[];
    sources?: string[];
  };
  dataQuality?: {
    overallConfidence?: string;
    strongDataAreas?: string[];
    weakDataAreas?: string[];
    recommendedFollowUp?: string[];
  };
}

interface Analysis {
  id: string;
  status: string;
  mode: string;
  progress: number;
  currentStep?: string;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  errorLog?: { message?: string };
  companyProfile?: CompanyProfile;
  cheatSheet?: CheatSheet;
  opportunities?: {
    opportunities?: Opportunity[];
  };
  competitiveAnalysis?: CompetitiveAnalysis;
  // Legacy competitors field
  competitors?: Array<{
    id: string;
    competitorType: string;
    relevanceScore?: number;
    competitor: { name: string; domain: string };
  }>;
  company: {
    id: string;
    name: string;
    domain: string;
    url: string;
  };
}

type TabType = 'cheatsheet' | 'company' | 'competitors' | 'opportunities';

const analysisPhases = [
  { key: 'EXTRACTING_WEBSITE', phase: 1, name: 'Company Deep Dive', step: 'Extracting website data' },
  { key: 'RESEARCHING_COMPANY', phase: 1, name: 'Company Deep Dive', step: 'Researching company' },
  { key: 'SYNTHESIZING_PROFILE', phase: 1, name: 'Company Deep Dive', step: 'Synthesizing profile' },
  { key: 'DISCOVERING_COMPETITORS', phase: 2, name: 'Competitive Landscape', step: 'Discovering competitors' },
  { key: 'ANALYZING_COMPETITION', phase: 2, name: 'Competitive Landscape', step: 'Analyzing competition' },
  { key: 'MAPPING_OPPORTUNITIES', phase: 3, name: 'Opportunity Mapping', step: 'Mapping opportunities' },
  { key: 'GENERATING_OUTPUTS', phase: 4, name: 'Generating Outputs', step: 'Creating cheat sheet and reports' },
];

function getPhaseInfo(status: string) {
  const phase = analysisPhases.find((p) => p.key === status);
  return phase || { phase: 1, name: 'Processing', step: status };
}

export default function AnalysisPage() {
  const { id } = useParams<{ id: string }>();
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('cheatsheet');
  const [exportingPdf, setExportingPdf] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const fetchAnalysis = async () => {
    try {
      const res = await fetch(`${API_URL}/api/analysis/${id}`, {
        credentials: 'include',
      });
      if (!res.ok) {
        throw new Error('Failed to fetch analysis');
      }
      const data = await res.json();
      setAnalysis(data);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleExportPdf = async () => {
    if (!id || exportingPdf) return;

    setExportingPdf(true);
    try {
      const response = await fetch(`${API_URL}/api/analysis/${id}/export-pdf`, {
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to export PDF');
      }

      // Get filename from Content-Disposition header or use default
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = `Aurora-Report-${analysis?.company?.name || 'Analysis'}.pdf`;
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/);
        if (match) filename = match[1];
      }

      // Download the PDF
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Export PDF error:', err);
      alert(err instanceof Error ? err.message : 'Failed to export PDF');
    } finally {
      setExportingPdf(false);
    }
  };

  useEffect(() => {
    fetchAnalysis();

    // Poll for updates if not completed
    const interval = setInterval(async () => {
      if (analysis && ['COMPLETED', 'FAILED', 'CANCELLED'].includes(analysis.status)) {
        clearInterval(interval);
        return;
      }
      try {
        const res = await fetch(`${API_URL}/api/analysis/${id}`, {
          credentials: 'include',
        });
        if (res.ok) {
          const data = await res.json();
          setAnalysis(data);
        }
      } catch {
        // Ignore polling errors
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [id, analysis?.status]);

  if (loading) {
    return <AnalysisDetailSkeleton isDark={isDark} />;
  }

  if (error || !analysis) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <XCircle className={`w-12 h-12 mb-4 ${isDark ? 'text-red-400' : 'text-red-500'}`} />
        <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-[#3D3124]'}`}>
          {error || 'Analysis not found'}
        </h2>
        <p className={`mt-2 ${isDark ? 'text-white/60' : 'text-[#5C4A2A]/60'}`}>
          The analysis you're looking for doesn't exist or you don't have access.
        </p>
        <Link to="/dashboard">
          <button className={`mt-4 px-6 py-2 rounded-xl transition-all duration-300 hover:scale-[1.02] ${
            isDark
              ? 'bg-white/10 text-white border border-white/20 hover:bg-white/15 hover:border-cyan-500/40 hover:shadow-lg hover:shadow-cyan-500/20 backdrop-blur-sm'
              : 'bg-gradient-to-r from-[#5C4A2A] to-[#8B7355] text-white'
          }`}>
            Back to Dashboard
          </button>
        </Link>
      </div>
    );
  }

  const phaseInfo = getPhaseInfo(analysis.status);
  const isInProgress = !['COMPLETED', 'FAILED', 'CANCELLED'].includes(analysis.status);
  const isComplete = analysis.status === 'COMPLETED';
  const isFailed = ['FAILED', 'CANCELLED'].includes(analysis.status);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/dashboard">
            <button className={`p-2 rounded-xl transition-all ${
              isDark
                ? 'text-white/70 hover:bg-white/10 hover:text-cyan-400'
                : 'text-[#5C4A2A]/70 hover:bg-white/50 hover:text-[#5C4A2A]'
            }`}>
              <ArrowLeft className="h-5 w-5" />
            </button>
          </Link>
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              isDark ? 'bg-white/10' : 'bg-[#5C4A2A]/10'
            }`}>
              <Building2 className={`h-6 w-6 ${isDark ? 'text-cyan-400' : 'text-[#5C4A2A]'}`} />
            </div>
            <div>
              <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-[#3D3124]'}`}>
                {analysis.company.name}
              </h1>
              <a
                href={analysis.company.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-sm flex items-center gap-1 hover:underline ${
                  isDark ? 'text-white/60 hover:text-cyan-400' : 'text-[#5C4A2A]/60 hover:text-[#5C4A2A]'
                }`}
              >
                {analysis.company.domain}
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isComplete && (
            <>
              <button
                onClick={handleExportPdf}
                disabled={exportingPdf}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                  isDark
                    ? 'border-white/20 text-white/70 hover:bg-white/10 hover:text-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed'
                    : 'border-[#5C4A2A]/20 text-[#5C4A2A] hover:bg-[#5C4A2A]/5 disabled:opacity-50 disabled:cursor-not-allowed'
                }`}>
                {exportingPdf ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                {exportingPdf ? 'Generating...' : 'Export PDF'}
              </button>
              <button className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                isDark
                  ? 'border-white/20 text-white/70 hover:bg-white/10 hover:text-cyan-400'
                  : 'border-[#5C4A2A]/20 text-[#5C4A2A] hover:bg-[#5C4A2A]/5'
              }`}>
                <MessageSquare className="h-4 w-4" />
                Chat
              </button>
            </>
          )}
          {isFailed && (
            <button
              onClick={fetchAnalysis}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                isDark
                  ? 'border-white/20 text-white/70 hover:bg-white/10 hover:text-cyan-400'
                  : 'border-[#5C4A2A]/20 text-[#5C4A2A] hover:bg-[#5C4A2A]/5'
              }`}
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </button>
          )}
        </div>
      </div>

      {/* Progress Section (for in-progress analyses) */}
      {isInProgress && (
        <div className={`rounded-2xl backdrop-blur-xl p-6 ${
          isDark ? 'bg-cyan-500/10 border border-cyan-500/20' : 'border border-violet-200 bg-violet-50/50'
        }`}>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                isDark ? 'bg-cyan-500/20' : 'bg-violet-100'
              }`}>
                <Clock className={`h-5 w-5 animate-pulse ${isDark ? 'text-cyan-400' : 'text-violet-600'}`} />
              </div>
              <div>
                <p className={`font-medium ${isDark ? 'text-white' : 'text-[#3D3124]'}`}>
                  Phase {phaseInfo.phase}: {phaseInfo.name}
                </p>
                <p className={`text-sm ${isDark ? 'text-white/60' : 'text-[#5C4A2A]/60'}`}>{phaseInfo.step}</p>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
              isDark ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-violet-100 text-violet-700'
            }`}>
              {analysis.progress}%
            </span>
          </div>
          <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-white/10' : 'bg-violet-200'}`}>
            <div
              className={`h-full transition-all duration-500 ${isDark ? 'bg-cyan-500' : 'bg-violet-600'}`}
              style={{ width: `${analysis.progress}%` }}
            />
          </div>
          <div className={`mt-4 flex justify-between text-sm ${isDark ? 'text-white/50' : 'text-[#5C4A2A]/50'}`}>
            <span>Started {analysis.startedAt ? new Date(analysis.startedAt).toLocaleString() : 'just now'}</span>
            <span>Estimated: 1-2 hours (deep web research)</span>
          </div>
          <p className={`mt-2 text-xs ${isDark ? 'text-white/40' : 'text-[#5C4A2A]/40'}`}>
            Aurora performs comprehensive web research across multiple sources. Each phase involves real-time data gathering which takes 10-30 minutes per step. You can safely close this page and check back later.
          </p>
        </div>
      )}

      {/* Failed State */}
      {isFailed && (
        <div className={`rounded-2xl backdrop-blur-xl p-6 flex items-center gap-4 ${
          isDark ? 'bg-red-500/10 border border-red-500/20' : 'border border-red-200 bg-red-50/50'
        }`}>
          <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
            isDark ? 'bg-red-500/20' : 'bg-red-100'
          }`}>
            <XCircle className={`h-5 w-5 ${isDark ? 'text-red-400' : 'text-red-600'}`} />
          </div>
          <div className="flex-1">
            <p className={`font-medium ${isDark ? 'text-white' : 'text-[#3D3124]'}`}>Analysis Failed</p>
            <p className={`text-sm ${isDark ? 'text-white/60' : 'text-[#5C4A2A]/60'}`}>
              {analysis.errorLog?.message || 'An error occurred during analysis.'}
            </p>
          </div>
          <button
            onClick={fetchAnalysis}
            className={`px-4 py-2 rounded-xl border transition-all ${
              isDark ? 'border-white/20 text-white/70 hover:bg-white/10' : 'border-[#5C4A2A]/20 text-[#5C4A2A]'
            }`}
          >
            Try Again
          </button>
        </div>
      )}

      {/* Completed State - Tab Navigation */}
      {isComplete && (
        <>
          <div className={`relative overflow-hidden rounded-2xl backdrop-blur-2xl border shadow-lg p-2 ${
            isDark ? 'bg-white/5 border-white/10' : 'bg-white/60 border-white/40'
          }`}>
            <div className="grid grid-cols-4 gap-2">
              {(['cheatsheet', 'company', 'competitors', 'opportunities'] as TabType[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    'rounded-xl px-4 py-3 capitalize transition-all font-medium',
                    activeTab === tab
                      ? isDark
                        ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/10 text-cyan-400 shadow-sm'
                        : 'bg-gradient-to-r from-[#5C4A2A]/15 to-[#8B7355]/10 text-[#5C4A2A] shadow-sm'
                      : isDark
                        ? 'text-white/60 hover:bg-white/5'
                        : 'text-[#5C4A2A]/60 hover:bg-white/50'
                  )}
                >
                  {tab === 'cheatsheet' ? 'Cheat Sheet' : tab === 'company' ? 'Company Profile' : tab}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'cheatsheet' && (
            <CheatSheetSection cheatSheet={analysis.cheatSheet} isDark={isDark} />
          )}
          {activeTab === 'company' && (
            <CompanyProfileSection profile={analysis.companyProfile} isDark={isDark} />
          )}
          {activeTab === 'competitors' && (
            <CompetitorsSection
              competitiveAnalysis={analysis.competitiveAnalysis}
              legacyCompetitors={analysis.competitors || []}
              isDark={isDark}
            />
          )}
          {activeTab === 'opportunities' && (
            <OpportunitiesSection opportunities={analysis.opportunities} isDark={isDark} />
          )}
        </>
      )}

      {/* In Progress - Phase Overview */}
      {isInProgress && (
        <>
          <div className="grid gap-4 md:grid-cols-4">
            <PhaseCard
              phase={1}
              title="Company Deep Dive"
              description="Extracting and researching company information"
              icon={Building2}
              currentPhase={phaseInfo.phase}
              isDark={isDark}
            />
            <PhaseCard
              phase={2}
              title="Competitive Landscape"
              description="Discovering and analyzing competitors"
              icon={Users}
              currentPhase={phaseInfo.phase}
              isDark={isDark}
            />
            <PhaseCard
              phase={3}
              title="Opportunity Mapping"
              description="Identifying opportunities and scoring readiness"
              icon={Target}
              currentPhase={phaseInfo.phase}
              isDark={isDark}
            />
            <PhaseCard
              phase={4}
              title="Generating Outputs"
              description="Creating cheat sheet and reports"
              icon={Lightbulb}
              currentPhase={phaseInfo.phase}
              isDark={isDark}
            />
          </div>

          {/* Live Activity Feed */}
          <LiveActivityFeed analysisId={analysis.id} isActive={isInProgress} />
        </>
      )}
    </div>
  );
}

function PhaseCard({
  phase,
  title,
  description,
  icon: Icon,
  currentPhase,
  isDark,
}: {
  phase: number;
  title: string;
  description: string;
  icon: React.ElementType;
  currentPhase: number;
  isDark: boolean;
}) {
  const isComplete = phase < currentPhase;
  const isActive = phase === currentPhase;

  return (
    <div
      className={cn(
        'rounded-2xl backdrop-blur-xl p-4 border transition-all',
        isActive
          ? isDark
            ? 'bg-cyan-500/10 border-cyan-500/20'
            : 'border-violet-200 bg-violet-50'
          : isComplete
            ? isDark
              ? 'bg-emerald-500/10 border-emerald-500/20'
              : 'border-green-200 bg-green-50'
            : isDark
              ? 'bg-white/5 border-white/10'
              : 'bg-white/50 border-white/30'
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-full',
            isActive
              ? isDark
                ? 'bg-cyan-500/20'
                : 'bg-violet-100'
              : isComplete
                ? isDark
                  ? 'bg-emerald-500/20'
                  : 'bg-green-100'
                : isDark
                  ? 'bg-white/10'
                  : 'bg-slate-100'
          )}
        >
          {isComplete ? (
            <CheckCircle className={`h-5 w-5 ${isDark ? 'text-emerald-400' : 'text-green-600'}`} />
          ) : (
            <Icon
              className={cn(
                'h-5 w-5',
                isActive
                  ? isDark
                    ? 'animate-pulse text-cyan-400'
                    : 'animate-pulse text-violet-600'
                  : isDark
                    ? 'text-white/40'
                    : 'text-slate-400'
              )}
            />
          )}
        </div>
        <div>
          <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-[#3D3124]'}`}>{title}</p>
          <p className={`text-xs ${isDark ? 'text-white/60' : 'text-[#5C4A2A]/60'}`}>{description}</p>
        </div>
      </div>
    </div>
  );
}

function CheatSheetSection({ cheatSheet, isDark }: { cheatSheet?: CheatSheet; isDark: boolean }) {
  if (!cheatSheet) {
    return (
      <div className={`rounded-2xl backdrop-blur-xl border p-12 text-center ${
        isDark ? 'bg-white/5 border-white/10' : 'bg-white/60 border-white/40'
      }`}>
        <p className={isDark ? 'text-white/50' : 'text-[#5C4A2A]/50'}>Cheat sheet not generated yet.</p>
      </div>
    );
  }

  // Helper function to get hook opener from various hook formats
  const getHookOpener = (hook: CheatSheetOpportunity['hook']) => {
    if (!hook) return null;
    if (typeof hook === 'string') return hook;
    return hook.opener;
  };

  return (
    <div className="space-y-6">
      {/* Company Snapshot */}
      {cheatSheet.companySnapshot && (
        <div className={`rounded-2xl backdrop-blur-xl border p-6 ${
          isDark ? 'bg-gradient-to-br from-cyan-500/10 to-purple-500/5 border-cyan-500/20' : 'bg-gradient-to-br from-violet-50 to-white border-violet-200'
        }`}>
          <h3 className={`text-lg font-semibold mb-3 flex items-center gap-2 ${isDark ? 'text-white' : 'text-[#3D3124]'}`}>
            <Building2 className={`h-5 w-5 ${isDark ? 'text-cyan-400' : 'text-violet-600'}`} />
            Company Snapshot
          </h3>
          {cheatSheet.companySnapshot.parentCompany && (
            <div className={`mb-4 px-3 py-2 rounded-lg ${isDark ? 'bg-purple-500/20 border border-purple-500/30' : 'bg-purple-100'}`}>
              <p className={`text-sm font-medium ${isDark ? 'text-purple-300' : 'text-purple-700'}`}>
                Subsidiary of {cheatSheet.companySnapshot.parentCompany}
              </p>
            </div>
          )}
          <p className={`text-xl mb-4 ${isDark ? 'text-white/90' : 'text-[#3D3124]'}`}>
            {cheatSheet.companySnapshot.oneLiner}
          </p>
          <div className="grid gap-3 md:grid-cols-3">
            <div>
              <p className={`text-xs uppercase tracking-wide ${isDark ? 'text-white/50' : 'text-[#5C4A2A]/50'}`}>Industry</p>
              <p className={`font-medium ${isDark ? 'text-white' : 'text-[#3D3124]'}`}>{cheatSheet.companySnapshot.industry}</p>
            </div>
            <div>
              <p className={`text-xs uppercase tracking-wide ${isDark ? 'text-white/50' : 'text-[#5C4A2A]/50'}`}>Headquarters</p>
              <p className={`font-medium ${isDark ? 'text-white' : 'text-[#3D3124]'}`}>{cheatSheet.companySnapshot.headquarters}</p>
            </div>
            <div>
              <p className={`text-xs uppercase tracking-wide ${isDark ? 'text-white/50' : 'text-[#5C4A2A]/50'}`}>Tech Maturity</p>
              <span className={`inline-block px-3 py-1 rounded-lg text-sm font-medium ${
                cheatSheet.companySnapshot.techMaturity === 'high'
                  ? isDark ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-emerald-100 text-emerald-700'
                  : isDark ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-amber-100 text-amber-700'
              }`}>
                {cheatSheet.companySnapshot.techMaturity}
              </span>
            </div>
          </div>
          {cheatSheet.companySnapshot.techMaturityNote && (
            <p className={`mt-3 text-sm ${isDark ? 'text-white/60' : 'text-[#5C4A2A]/60'}`}>
              {cheatSheet.companySnapshot.techMaturityNote}
            </p>
          )}
        </div>
      )}

      {/* Key Context - Important background for the conversation */}
      {cheatSheet.keyContext && cheatSheet.keyContext.length > 0 && (
        <div className={`rounded-2xl backdrop-blur-xl border p-6 ${
          isDark ? 'bg-white/5 border-white/10' : 'bg-white/60 border-white/40'
        }`}>
          <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-[#3D3124]'}`}>
            <Lightbulb className={`h-5 w-5 ${isDark ? 'text-cyan-400' : 'text-violet-600'}`} />
            Key Context for Your Conversation
          </h3>
          <p className={`text-sm mb-4 ${isDark ? 'text-white/60' : 'text-[#5C4A2A]/60'}`}>
            Important background information to understand before calling
          </p>
          <div className="space-y-4">
            {cheatSheet.keyContext.map((ctx, i) => (
              <div key={i} className={`p-4 rounded-xl ${isDark ? 'bg-white/5 border border-white/10' : 'bg-slate-50 border border-slate-200'}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className={`font-semibold mb-1 ${isDark ? 'text-cyan-400' : 'text-violet-700'}`}>
                      {ctx.topic}
                    </p>
                    <p className={`text-sm mb-2 ${isDark ? 'text-white/80' : 'text-[#5C4A2A]'}`}>
                      {ctx.explanation}
                    </p>
                    {ctx.whyItMatters && (
                      <p className={`text-xs ${isDark ? 'text-amber-400/80' : 'text-amber-600'}`}>
                        Why it matters: {ctx.whyItMatters}
                      </p>
                    )}
                  </div>
                </div>
                <p className={`text-xs mt-2 ${isDark ? 'text-white/40' : 'text-[#5C4A2A]/40'}`}>
                  Source: {ctx.source}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Industry Terms Glossary */}
      {cheatSheet.industryTermsGlossary && cheatSheet.industryTermsGlossary.length > 0 && (
        <div className={`rounded-2xl backdrop-blur-xl border p-6 ${
          isDark ? 'bg-white/5 border-white/10' : 'bg-white/60 border-white/40'
        }`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-[#3D3124]'}`}>
            Industry Terms to Know
          </h3>
          <p className={`text-sm mb-4 ${isDark ? 'text-white/60' : 'text-[#5C4A2A]/60'}`}>
            Common terms they may use - understand these before the call
          </p>
          <div className="grid gap-3 md:grid-cols-2">
            {cheatSheet.industryTermsGlossary.map((item, i) => (
              <div key={i} className={`p-3 rounded-lg ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}>
                <p className={`font-medium mb-1 ${isDark ? 'text-white' : 'text-[#3D3124]'}`}>
                  {item.term}
                </p>
                <p className={`text-sm ${isDark ? 'text-white/70' : 'text-[#5C4A2A]/80'}`}>
                  {item.definition}
                </p>
                {item.relevance && (
                  <p className={`text-xs mt-1 ${isDark ? 'text-cyan-400/70' : 'text-violet-600'}`}>
                    {item.relevance}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Opportunity - Hero Card */}
      {cheatSheet.topOpportunity && (
        <div className={`rounded-2xl backdrop-blur-xl border p-6 ${
          isDark ? 'bg-gradient-to-br from-emerald-500/10 to-cyan-500/5 border-emerald-500/20' : 'bg-gradient-to-br from-emerald-50 to-white border-emerald-200'
        }`}>
          <div className="flex items-center gap-2 mb-4">
            <span className={`px-3 py-1 rounded-lg text-sm font-bold ${
              isDark ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-emerald-100 text-emerald-700'
            }`}>
              #1 OPPORTUNITY
            </span>
            <span className={`px-2 py-1 rounded text-xs ${isDark ? 'border-white/20 text-white/70 border' : 'border-[#5C4A2A]/20 text-[#5C4A2A]/70 border'}`}>
              {cheatSheet.topOpportunity.category}
            </span>
          </div>
          <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-[#3D3124]'}`}>
            {cheatSheet.topOpportunity.title}
          </h3>

          {/* Opening Hook */}
          {cheatSheet.topOpportunity.hook && (
            <div className={`p-4 rounded-xl mb-4 ${isDark ? 'bg-white/5 border border-white/10' : 'bg-white/70 border border-emerald-200'}`}>
              <p className={`text-xs uppercase tracking-wide mb-2 ${isDark ? 'text-cyan-400' : 'text-emerald-600'}`}>
                Conversation Opener
              </p>
              <p className={`italic ${isDark ? 'text-white/90' : 'text-[#3D3124]'}`}>
                "{getHookOpener(cheatSheet.topOpportunity.hook)}"
              </p>
            </div>
          )}

          {/* Problem Summary */}
          {cheatSheet.topOpportunity.problemSummary && (
            <div className="mb-4">
              <p className={`text-xs uppercase tracking-wide mb-1 ${isDark ? 'text-white/50' : 'text-[#5C4A2A]/50'}`}>
                The Problem
              </p>
              <p className={isDark ? 'text-white/80' : 'text-[#5C4A2A]'}>{cheatSheet.topOpportunity.problemSummary}</p>
            </div>
          )}

          {/* What We Build */}
          {cheatSheet.topOpportunity.whatWeBuild && (
            <div className="mb-4">
              <p className={`text-xs uppercase tracking-wide mb-1 ${isDark ? 'text-white/50' : 'text-[#5C4A2A]/50'}`}>
                Proposed Solution
              </p>
              <p className={isDark ? 'text-white/80' : 'text-[#5C4A2A]'}>{cheatSheet.topOpportunity.whatWeBuild}</p>
            </div>
          )}

          {/* Impact */}
          {cheatSheet.topOpportunity.impact && (
            <div className={`p-3 rounded-lg ${isDark ? 'bg-emerald-500/10' : 'bg-emerald-50'}`}>
              <p className={`text-xs uppercase tracking-wide mb-1 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                Expected Impact
              </p>
              <p className={`font-medium ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>
                {cheatSheet.topOpportunity.impact}
              </p>
            </div>
          )}

          {/* Evidence */}
          {cheatSheet.topOpportunity.evidence && cheatSheet.topOpportunity.evidence.length > 0 && (
            <div className="mt-4">
              <p className={`text-xs uppercase tracking-wide mb-2 ${isDark ? 'text-white/50' : 'text-[#5C4A2A]/50'}`}>
                Supporting Evidence
              </p>
              <ul className="space-y-1">
                {cheatSheet.topOpportunity.evidence.map((e, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className={`h-4 w-4 mt-0.5 flex-shrink-0 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
                    <span className={`text-sm ${isDark ? 'text-white/70' : 'text-[#5C4A2A]/80'}`}>{e}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Backup Opportunities */}
      {(cheatSheet.backupOpportunity1 || cheatSheet.backupOpportunity2) && (
        <div className="grid gap-4 md:grid-cols-2">
          {cheatSheet.backupOpportunity1 && (
            <div className={`rounded-2xl backdrop-blur-xl border p-5 ${
              isDark ? 'bg-white/5 border-white/10' : 'bg-white/60 border-white/40'
            }`}>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                isDark ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-violet-100 text-violet-700'
              }`}>
                BACKUP #1
              </span>
              <h4 className={`text-lg font-semibold mt-3 mb-2 ${isDark ? 'text-white' : 'text-[#3D3124]'}`}>
                {cheatSheet.backupOpportunity1.title}
              </h4>
              {typeof cheatSheet.backupOpportunity1.hook === 'string' && (
                <p className={`text-sm italic mb-2 ${isDark ? 'text-white/70' : 'text-[#5C4A2A]/70'}`}>
                  "{cheatSheet.backupOpportunity1.hook}"
                </p>
              )}
              {cheatSheet.backupOpportunity1.keyEvidence && (
                <p className={`text-sm ${isDark ? 'text-white/60' : 'text-[#5C4A2A]/60'}`}>
                  Evidence: {cheatSheet.backupOpportunity1.keyEvidence}
                </p>
              )}
            </div>
          )}
          {cheatSheet.backupOpportunity2 && (
            <div className={`rounded-2xl backdrop-blur-xl border p-5 ${
              isDark ? 'bg-white/5 border-white/10' : 'bg-white/60 border-white/40'
            }`}>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                isDark ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-amber-100 text-amber-700'
              }`}>
                BACKUP #2
              </span>
              <h4 className={`text-lg font-semibold mt-3 mb-2 ${isDark ? 'text-white' : 'text-[#3D3124]'}`}>
                {cheatSheet.backupOpportunity2.title}
              </h4>
              {typeof cheatSheet.backupOpportunity2.hook === 'string' && (
                <p className={`text-sm italic mb-2 ${isDark ? 'text-white/70' : 'text-[#5C4A2A]/70'}`}>
                  "{cheatSheet.backupOpportunity2.hook}"
                </p>
              )}
              {cheatSheet.backupOpportunity2.keyEvidence && (
                <p className={`text-sm ${isDark ? 'text-white/60' : 'text-[#5C4A2A]/60'}`}>
                  Evidence: {cheatSheet.backupOpportunity2.keyEvidence}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Differentiation Pitch */}
      {cheatSheet.differentiationPitch && (
        <div className={`rounded-2xl backdrop-blur-xl border p-6 ${
          isDark ? 'bg-white/5 border-white/10' : 'bg-white/60 border-white/40'
        }`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-[#3D3124]'}`}>
            Why Us
          </h3>
          <p className={`mb-4 ${isDark ? 'text-white/80' : 'text-[#5C4A2A]'}`}>
            {cheatSheet.differentiationPitch.whyUs}
          </p>
          <div className={`p-4 rounded-xl ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}>
            <p className={`text-xs uppercase tracking-wide mb-2 ${isDark ? 'text-white/50' : 'text-[#5C4A2A]/50'}`}>
              The Three Options Framework
            </p>
            <p className={`text-sm ${isDark ? 'text-white/70' : 'text-[#5C4A2A]/80'}`}>
              {cheatSheet.differentiationPitch.threeOptions}
            </p>
          </div>
        </div>
      )}

      {/* Stats for Conversation */}
      {cheatSheet.statsForConversation && cheatSheet.statsForConversation.length > 0 && (
        <div className={`rounded-2xl backdrop-blur-xl border p-6 ${
          isDark ? 'bg-white/5 border-white/10' : 'bg-white/60 border-white/40'
        }`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-[#3D3124]'}`}>
            Stats to Drop in Conversation
          </h3>
          <div className="space-y-4">
            {cheatSheet.statsForConversation.map((stat, i) => (
              <div key={i} className={`p-4 rounded-xl ${isDark ? 'bg-white/5' : 'bg-white/50'}`}>
                <p className={`text-xl font-bold mb-1 ${isDark ? 'text-cyan-400' : 'text-violet-600'}`}>
                  {stat.stat}
                </p>
                <p className={`text-sm ${isDark ? 'text-white/60' : 'text-[#5C4A2A]/60'}`}>
                  Source: {stat.source}
                </p>
                <p className={`text-xs mt-1 ${isDark ? 'text-white/40' : 'text-[#5C4A2A]/40'}`}>
                  {stat.context}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Objection Handlers */}
      {cheatSheet.objectionHandlers && cheatSheet.objectionHandlers.length > 0 && (
        <div className={`rounded-2xl backdrop-blur-xl border p-6 ${
          isDark ? 'bg-white/5 border-white/10' : 'bg-white/60 border-white/40'
        }`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-[#3D3124]'}`}>
            Objection Handlers
          </h3>
          <div className="space-y-4">
            {cheatSheet.objectionHandlers.map((handler, i) => (
              <div key={i} className={`p-4 rounded-xl ${isDark ? 'bg-white/5' : 'bg-white/50'}`}>
                <p className={`font-medium mb-2 ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                  "{handler.objection}"
                </p>
                <p className={isDark ? 'text-white/80' : 'text-[#5C4A2A]'}>{handler.response}</p>
                {handler.specificEvidence && (
                  <p className={`mt-2 text-xs ${isDark ? 'text-cyan-400/70' : 'text-violet-600'}`}>
                    Supporting evidence: {handler.specificEvidence}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Do Not Mention */}
      {cheatSheet.doNotMention && cheatSheet.doNotMention.length > 0 && (
        <div className={`rounded-2xl backdrop-blur-xl border p-6 ${
          isDark ? 'bg-red-500/5 border-red-500/20' : 'bg-red-50/50 border-red-200'
        }`}>
          <h3 className={`text-lg font-semibold mb-3 flex items-center gap-2 ${isDark ? 'text-red-400' : 'text-red-600'}`}>
            <XCircle className="h-5 w-5" />
            Do Not Mention
          </h3>
          <p className={`text-sm mb-4 ${isDark ? 'text-white/60' : 'text-[#5C4A2A]/60'}`}>
            Topics to avoid in your conversation - each has a specific reason
          </p>
          <div className="space-y-3">
            {cheatSheet.doNotMention.map((item, i) => {
              // Handle both new format (object) and legacy format (string)
              const isNewFormat = typeof item === 'object' && item !== null && 'topic' in item;
              const topic = isNewFormat ? (item as { topic: string; reason: string }).topic : item as string;
              const reason = isNewFormat ? (item as { topic: string; reason: string }).reason : null;

              return (
                <div key={i} className={`p-3 rounded-lg ${isDark ? 'bg-red-500/10' : 'bg-red-100/50'}`}>
                  <div className="flex items-start gap-2">
                    <XCircle className={`h-4 w-4 mt-0.5 flex-shrink-0 ${isDark ? 'text-red-400' : 'text-red-600'}`} />
                    <div>
                      <p className={`font-medium ${isDark ? 'text-red-300' : 'text-red-700'}`}>
                        {topic}
                      </p>
                      {reason && (
                        <p className={`text-sm mt-1 ${isDark ? 'text-white/60' : 'text-[#5C4A2A]/70'}`}>
                          Why: {reason}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Legacy fallback for mock data */}
      {cheatSheet.summary && !cheatSheet.companySnapshot && (
        <div className={`rounded-2xl backdrop-blur-xl border p-6 ${
          isDark ? 'bg-white/5 border-white/10' : 'bg-white/60 border-white/40'
        }`}>
          <h3 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-[#3D3124]'}`}>
            Executive Summary
          </h3>
          <p className={isDark ? 'text-white/80' : 'text-[#5C4A2A]'}>{cheatSheet.summary}</p>
        </div>
      )}

      {cheatSheet.keyOpportunities && cheatSheet.keyOpportunities.length > 0 && !cheatSheet.topOpportunity && (
        <div className={`rounded-2xl backdrop-blur-xl border p-6 ${
          isDark ? 'bg-white/5 border-white/10' : 'bg-white/60 border-white/40'
        }`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-[#3D3124]'}`}>
            Key Opportunities
          </h3>
          <ul className="space-y-3">
            {cheatSheet.keyOpportunities.map((opp, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className={`flex h-6 w-6 items-center justify-center rounded-full flex-shrink-0 ${
                  isDark ? 'bg-cyan-500/20' : 'bg-[#5C4A2A]/10'
                }`}>
                  <CheckCircle className={`h-4 w-4 ${isDark ? 'text-cyan-400' : 'text-[#5C4A2A]'}`} />
                </div>
                <span className={isDark ? 'text-white/80' : 'text-[#5C4A2A]'}>{opp}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {cheatSheet.talkingPoints && cheatSheet.talkingPoints.length > 0 && !cheatSheet.statsForConversation && (
        <div className={`rounded-2xl backdrop-blur-xl border p-6 ${
          isDark ? 'bg-white/5 border-white/10' : 'bg-white/60 border-white/40'
        }`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-[#3D3124]'}`}>
            Talking Points
          </h3>
          <ul className="space-y-3">
            {cheatSheet.talkingPoints.map((point, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className={`flex h-6 w-6 items-center justify-center rounded-full text-sm font-medium flex-shrink-0 ${
                  isDark ? 'bg-purple-500/20 text-purple-400' : 'bg-[#8B7355]/10 text-[#8B7355]'
                }`}>
                  {i + 1}
                </span>
                <span className={isDark ? 'text-white/80' : 'text-[#5C4A2A]'}>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function CompanyProfileSection({ profile, isDark }: { profile?: Analysis['companyProfile']; isDark: boolean }) {
  if (!profile) {
    return (
      <div className={`rounded-2xl backdrop-blur-xl border p-12 text-center ${
        isDark ? 'bg-white/5 border-white/10' : 'bg-white/60 border-white/40'
      }`}>
        <p className={isDark ? 'text-white/50' : 'text-[#5C4A2A]/50'}>Company profile not available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Parent Company Alert - Show prominently if exists */}
      {profile.parentCompany?.name && (
        <div className={`rounded-2xl backdrop-blur-xl border p-6 ${
          isDark ? 'bg-purple-500/10 border-purple-500/20' : 'bg-purple-50 border-purple-200'
        }`}>
          <div className="flex items-start gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-full flex-shrink-0 ${
              isDark ? 'bg-purple-500/20' : 'bg-purple-100'
            }`}>
              <Building2 className={`h-5 w-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
            </div>
            <div>
              <h3 className={`text-lg font-semibold mb-1 ${isDark ? 'text-purple-300' : 'text-purple-800'}`}>
                Subsidiary of {profile.parentCompany.name}
              </h3>
              {profile.parentCompany.relationship && (
                <p className={`text-sm mb-2 ${isDark ? 'text-white/70' : 'text-purple-700'}`}>
                  {profile.parentCompany.relationship}
                </p>
              )}
              {profile.parentCompany.implications && (
                <p className={`text-sm ${isDark ? 'text-white/60' : 'text-purple-600'}`}>
                  <span className="font-medium">Sales Implications:</span> {profile.parentCompany.implications}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Company Overview */}
      <div className={`rounded-2xl backdrop-blur-xl border p-6 ${
        isDark ? 'bg-white/5 border-white/10' : 'bg-white/60 border-white/40'
      }`}>
        <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-[#3D3124]'}`}>
          Company Overview
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className={`text-sm ${isDark ? 'text-white/60' : 'text-[#5C4A2A]/60'}`}>Industry</p>
            <p className={`font-medium ${isDark ? 'text-white' : 'text-[#3D3124]'}`}>
              {profile.basics?.industry || 'N/A'}
            </p>
          </div>
          <div>
            <p className={`text-sm ${isDark ? 'text-white/60' : 'text-[#5C4A2A]/60'}`}>Size</p>
            <p className={`font-medium ${isDark ? 'text-white' : 'text-[#3D3124]'}`}>
              {profile.basics?.employeeRange || 'N/A'}
            </p>
          </div>
          <div>
            <p className={`text-sm ${isDark ? 'text-white/60' : 'text-[#5C4A2A]/60'}`}>Headquarters</p>
            <p className={`font-medium ${isDark ? 'text-white' : 'text-[#3D3124]'}`}>
              {profile.basics?.headquarters || 'N/A'}
            </p>
          </div>
          <div>
            <p className={`text-sm ${isDark ? 'text-white/60' : 'text-[#5C4A2A]/60'}`}>Tech Maturity</p>
            <span className={`inline-block px-3 py-1 rounded-lg text-sm ${
              isDark ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-[#5C4A2A]/10 text-[#5C4A2A]'
            }`}>
              {profile.technologySignals?.techMaturity || 'Unknown'}
            </span>
            {profile.technologySignals?.techMaturityEvidence && (
              <p className={`text-xs mt-1 ${isDark ? 'text-white/50' : 'text-[#5C4A2A]/50'}`}>
                {profile.technologySignals.techMaturityEvidence}
              </p>
            )}
          </div>
        </div>
        {profile.basics?.description && (
          <div className={`pt-4 mt-4 border-t ${isDark ? 'border-white/10' : 'border-[#5C4A2A]/10'}`}>
            <p className={`text-sm mb-2 ${isDark ? 'text-white/60' : 'text-[#5C4A2A]/60'}`}>Description</p>
            <p className={isDark ? 'text-white/80' : 'text-[#5C4A2A]'}>{profile.basics.description}</p>
          </div>
        )}
      </div>

      {/* Recent Press & News */}
      {profile.recentPress && profile.recentPress.length > 0 && (
        <div className={`rounded-2xl backdrop-blur-xl border p-6 ${
          isDark ? 'bg-white/5 border-white/10' : 'bg-white/60 border-white/40'
        }`}>
          <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-[#3D3124]'}`}>
            <ExternalLink className={`h-5 w-5 ${isDark ? 'text-cyan-400' : 'text-[#5C4A2A]'}`} />
            Recent Press & News
          </h3>
          <div className="space-y-4">
            {profile.recentPress.map((item, i) => (
              <div key={i} className={`pb-4 border-b last:border-0 last:pb-0 ${isDark ? 'border-white/10' : 'border-[#5C4A2A]/10'}`}>
                <p className={`font-medium ${isDark ? 'text-white' : 'text-[#3D3124]'}`}>{item.headline}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-sm ${isDark ? 'text-white/60' : 'text-[#5C4A2A]/60'}`}>{item.source}</span>
                  {item.date && (
                    <>
                      <span className={isDark ? 'text-white/30' : 'text-[#5C4A2A]/30'}>•</span>
                      <span className={`text-sm ${isDark ? 'text-white/50' : 'text-[#5C4A2A]/50'}`}>{item.date}</span>
                    </>
                  )}
                </div>
                {item.relevance && (
                  <p className={`text-xs mt-2 ${isDark ? 'text-cyan-400/70' : 'text-violet-600'}`}>
                    Why it matters: {item.relevance}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hiring Signals */}
      {profile.hiringSignals && (profile.hiringSignals.openRoles?.length || profile.hiringSignals.growthAreas?.length) && (
        <div className={`rounded-2xl backdrop-blur-xl border p-6 ${
          isDark ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-emerald-50/50 border-emerald-200'
        }`}>
          <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
            <Users className={`h-5 w-5`} />
            Hiring Signals
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {profile.hiringSignals.openRoles && profile.hiringSignals.openRoles.length > 0 && (
              <div>
                <p className={`text-xs uppercase tracking-wide mb-2 ${isDark ? 'text-white/50' : 'text-[#5C4A2A]/50'}`}>Open Roles</p>
                <div className="flex flex-wrap gap-2">
                  {profile.hiringSignals.openRoles.map((role, i) => (
                    <span key={i} className={`px-2 py-1 rounded text-xs ${
                      isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {profile.hiringSignals.growthAreas && profile.hiringSignals.growthAreas.length > 0 && (
              <div>
                <p className={`text-xs uppercase tracking-wide mb-2 ${isDark ? 'text-white/50' : 'text-[#5C4A2A]/50'}`}>Growth Areas</p>
                <div className="flex flex-wrap gap-2">
                  {profile.hiringSignals.growthAreas.map((area, i) => (
                    <span key={i} className={`px-2 py-1 rounded text-xs ${
                      isDark ? 'bg-cyan-500/20 text-cyan-400' : 'bg-cyan-100 text-cyan-700'
                    }`}>
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          {profile.hiringSignals.techFocus && (
            <p className={`mt-3 text-sm ${isDark ? 'text-white/70' : 'text-[#5C4A2A]'}`}>
              <span className="font-medium">Tech Focus:</span> {profile.hiringSignals.techFocus}
            </p>
          )}
        </div>
      )}

      {/* Social Media Presence */}
      {profile.socialMediaPresence && profile.socialMediaPresence.platforms?.length && (
        <div className={`rounded-2xl backdrop-blur-xl border p-6 ${
          isDark ? 'bg-white/5 border-white/10' : 'bg-white/60 border-white/40'
        }`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-[#3D3124]'}`}>
            Social Media Presence
          </h3>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className={`text-xs uppercase tracking-wide mb-2 ${isDark ? 'text-white/50' : 'text-[#5C4A2A]/50'}`}>Platforms</p>
              <div className="flex flex-wrap gap-2">
                {profile.socialMediaPresence.platforms.map((platform, i) => (
                  <span key={i} className={`px-2 py-1 rounded text-xs ${
                    isDark ? 'bg-white/10 text-white/80' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {platform}
                  </span>
                ))}
              </div>
            </div>
            {profile.socialMediaPresence.linkedInFollowers && (
              <div>
                <p className={`text-xs uppercase tracking-wide mb-2 ${isDark ? 'text-white/50' : 'text-[#5C4A2A]/50'}`}>LinkedIn</p>
                <p className={`font-medium ${isDark ? 'text-white' : 'text-[#3D3124]'}`}>
                  {profile.socialMediaPresence.linkedInFollowers} followers
                </p>
              </div>
            )}
            {profile.socialMediaPresence.twitterFollowers && (
              <div>
                <p className={`text-xs uppercase tracking-wide mb-2 ${isDark ? 'text-white/50' : 'text-[#5C4A2A]/50'}`}>Twitter/X</p>
                <p className={`font-medium ${isDark ? 'text-white' : 'text-[#3D3124]'}`}>
                  {profile.socialMediaPresence.twitterFollowers} followers
                </p>
              </div>
            )}
          </div>
          {profile.socialMediaPresence.recentActivity && (
            <p className={`mt-3 text-sm ${isDark ? 'text-white/60' : 'text-[#5C4A2A]/60'}`}>
              {profile.socialMediaPresence.recentActivity}
            </p>
          )}
        </div>
      )}

      {/* Customer Signals */}
      {profile.customerSignals && (profile.customerSignals.commonPraise?.length || profile.customerSignals.commonComplaints?.length) && (
        <div className={`rounded-2xl backdrop-blur-xl border p-6 ${
          isDark ? 'bg-white/5 border-white/10' : 'bg-white/60 border-white/40'
        }`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-[#3D3124]'}`}>
            Customer Signals
          </h3>
          {profile.customerSignals.reviewSentiment && (
            <p className={`mb-4 ${isDark ? 'text-white/80' : 'text-[#5C4A2A]'}`}>
              <span className="font-medium">Overall Sentiment:</span> {profile.customerSignals.reviewSentiment}
            </p>
          )}
          <div className="grid gap-4 md:grid-cols-2">
            {profile.customerSignals.commonPraise && profile.customerSignals.commonPraise.length > 0 && (
              <div className={`p-4 rounded-xl ${isDark ? 'bg-emerald-500/10' : 'bg-emerald-50'}`}>
                <p className={`text-xs uppercase tracking-wide mb-2 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                  What Customers Love
                </p>
                <ul className="space-y-1">
                  {profile.customerSignals.commonPraise.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className={`h-4 w-4 mt-0.5 flex-shrink-0 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
                      <span className={`text-sm ${isDark ? 'text-white/80' : 'text-[#5C4A2A]'}`}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {profile.customerSignals.commonComplaints && profile.customerSignals.commonComplaints.length > 0 && (
              <div className={`p-4 rounded-xl ${isDark ? 'bg-amber-500/10' : 'bg-amber-50'}`}>
                <p className={`text-xs uppercase tracking-wide mb-2 ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
                  Common Pain Points
                </p>
                <ul className="space-y-1">
                  {profile.customerSignals.commonComplaints.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Target className={`h-4 w-4 mt-0.5 flex-shrink-0 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
                      <span className={`text-sm ${isDark ? 'text-white/80' : 'text-[#5C4A2A]'}`}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          {profile.customerSignals.sources && profile.customerSignals.sources.length > 0 && (
            <p className={`mt-3 text-xs ${isDark ? 'text-white/40' : 'text-[#5C4A2A]/40'}`}>
              Sources: {profile.customerSignals.sources.join(', ')}
            </p>
          )}
        </div>
      )}

      {/* Pain Point Indicators */}
      {profile.painPointIndicators && profile.painPointIndicators.length > 0 && (
        <div className={`rounded-2xl backdrop-blur-xl border p-6 ${
          isDark ? 'bg-white/5 border-white/10' : 'bg-white/60 border-white/40'
        }`}>
          <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-[#3D3124]'}`}>
            Pain Point Indicators
          </h3>
          <p className={`text-sm mb-4 ${isDark ? 'text-white/60' : 'text-[#5C4A2A]/60'}`}>
            Signals that suggest potential problems
          </p>
          <div className="space-y-4">
            {profile.painPointIndicators.map((indicator, i) => (
              <div key={i} className={`pb-4 border-b last:border-0 last:pb-0 ${isDark ? 'border-white/10' : 'border-[#5C4A2A]/10'}`}>
                <p className={`font-medium ${isDark ? 'text-white' : 'text-[#3D3124]'}`}>{indicator.signal}</p>
                <p className={`text-sm mt-1 ${isDark ? 'text-white/60' : 'text-[#5C4A2A]/60'}`}>
                  Source: {indicator.source}
                </p>
                <span className={`inline-block mt-2 px-2 py-1 rounded text-xs border ${
                  indicator.confidence === 'high'
                    ? isDark ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' : 'bg-emerald-100 border-emerald-200 text-emerald-700'
                    : indicator.confidence === 'medium'
                      ? isDark ? 'bg-amber-500/20 border-amber-500/30 text-amber-400' : 'bg-amber-100 border-amber-200 text-amber-700'
                      : isDark ? 'border-white/20 text-white/70' : 'border-[#5C4A2A]/20 text-[#5C4A2A]/70'
                }`}>
                  {indicator.confidence} confidence
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Data Quality Indicator */}
      {profile.dataQuality && (
        <div className={`rounded-2xl backdrop-blur-xl border p-6 ${
          isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
        }`}>
          <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-[#3D3124]'}`}>
            <Lightbulb className={`h-5 w-5 ${isDark ? 'text-cyan-400' : 'text-[#5C4A2A]'}`} />
            Data Quality Assessment
          </h3>
          {profile.dataQuality.overallConfidence && (
            <div className="mb-4">
              <span className={`inline-block px-3 py-1 rounded-lg text-sm font-medium ${
                profile.dataQuality.overallConfidence === 'high'
                  ? isDark ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-emerald-100 text-emerald-700'
                  : profile.dataQuality.overallConfidence === 'medium'
                    ? isDark ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-amber-100 text-amber-700'
                    : isDark ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-red-100 text-red-700'
              }`}>
                {profile.dataQuality.overallConfidence.charAt(0).toUpperCase() + profile.dataQuality.overallConfidence.slice(1)} Confidence
              </span>
            </div>
          )}
          <div className="grid gap-4 md:grid-cols-2">
            {profile.dataQuality.strongDataAreas && profile.dataQuality.strongDataAreas.length > 0 && (
              <div>
                <p className={`text-xs uppercase tracking-wide mb-2 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                  Strong Data Areas
                </p>
                <ul className="space-y-1">
                  {profile.dataQuality.strongDataAreas.map((area, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle className={`h-3 w-3 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
                      <span className={`text-sm ${isDark ? 'text-white/70' : 'text-[#5C4A2A]/80'}`}>{area}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {profile.dataQuality.weakDataAreas && profile.dataQuality.weakDataAreas.length > 0 && (
              <div>
                <p className={`text-xs uppercase tracking-wide mb-2 ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
                  Limited Data Areas
                </p>
                <ul className="space-y-1">
                  {profile.dataQuality.weakDataAreas.map((area, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <XCircle className={`h-3 w-3 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
                      <span className={`text-sm ${isDark ? 'text-white/70' : 'text-[#5C4A2A]/80'}`}>{area}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          {profile.dataQuality.recommendedFollowUp && profile.dataQuality.recommendedFollowUp.length > 0 && (
            <div className={`mt-4 pt-4 border-t ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
              <p className={`text-xs uppercase tracking-wide mb-2 ${isDark ? 'text-white/50' : 'text-[#5C4A2A]/50'}`}>
                Recommended Follow-up Research
              </p>
              <ul className="space-y-1">
                {profile.dataQuality.recommendedFollowUp.map((item, i) => (
                  <li key={i} className={`text-sm ${isDark ? 'text-white/60' : 'text-[#5C4A2A]/60'}`}>
                    • {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CompetitorsSection({
  competitiveAnalysis,
  legacyCompetitors,
  isDark,
}: {
  competitiveAnalysis?: CompetitiveAnalysis;
  legacyCompetitors: Analysis['competitors'];
  isDark: boolean;
}) {
  const hasNewData = competitiveAnalysis && (competitiveAnalysis.matrix?.length || competitiveAnalysis.swot);
  const hasLegacyData = legacyCompetitors && legacyCompetitors.length > 0;

  if (!hasNewData && !hasLegacyData) {
    return (
      <div className={`rounded-2xl backdrop-blur-xl border p-12 text-center ${
        isDark ? 'bg-white/5 border-white/10' : 'bg-white/60 border-white/40'
      }`}>
        <p className={isDark ? 'text-white/50' : 'text-[#5C4A2A]/50'}>No competitors identified yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview */}
      {competitiveAnalysis?.overview && (
        <div className={`rounded-2xl backdrop-blur-xl border p-6 ${
          isDark ? 'bg-white/5 border-white/10' : 'bg-white/60 border-white/40'
        }`}>
          <h3 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-[#3D3124]'}`}>
            Competitive Overview
          </h3>
          <p className={isDark ? 'text-white/80' : 'text-[#5C4A2A]'}>{competitiveAnalysis.overview}</p>
        </div>
      )}

      {/* SWOT Analysis */}
      {competitiveAnalysis?.swot && (
        <div className={`rounded-2xl backdrop-blur-xl border p-6 ${
          isDark ? 'bg-white/5 border-white/10' : 'bg-white/60 border-white/40'
        }`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-[#3D3124]'}`}>
            SWOT Analysis
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {/* Strengths */}
            <div className={`p-4 rounded-xl ${isDark ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-emerald-50 border border-emerald-200'}`}>
              <h4 className={`font-semibold mb-3 ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>Strengths</h4>
              <ul className="space-y-2">
                {competitiveAnalysis.swot.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className={`h-4 w-4 mt-0.5 flex-shrink-0 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
                    <span className={`text-sm ${isDark ? 'text-white/80' : 'text-[#5C4A2A]'}`}>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* Weaknesses */}
            <div className={`p-4 rounded-xl ${isDark ? 'bg-red-500/10 border border-red-500/20' : 'bg-red-50 border border-red-200'}`}>
              <h4 className={`font-semibold mb-3 ${isDark ? 'text-red-400' : 'text-red-700'}`}>Weaknesses</h4>
              <ul className="space-y-2">
                {competitiveAnalysis.swot.weaknesses.map((w, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <XCircle className={`h-4 w-4 mt-0.5 flex-shrink-0 ${isDark ? 'text-red-400' : 'text-red-600'}`} />
                    <span className={`text-sm ${isDark ? 'text-white/80' : 'text-[#5C4A2A]'}`}>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* Opportunities */}
            <div className={`p-4 rounded-xl ${isDark ? 'bg-cyan-500/10 border border-cyan-500/20' : 'bg-cyan-50 border border-cyan-200'}`}>
              <h4 className={`font-semibold mb-3 ${isDark ? 'text-cyan-400' : 'text-cyan-700'}`}>Opportunities</h4>
              <ul className="space-y-2">
                {competitiveAnalysis.swot.opportunities.map((o, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Lightbulb className={`h-4 w-4 mt-0.5 flex-shrink-0 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
                    <span className={`text-sm ${isDark ? 'text-white/80' : 'text-[#5C4A2A]'}`}>{o}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* Threats */}
            <div className={`p-4 rounded-xl ${isDark ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-amber-50 border border-amber-200'}`}>
              <h4 className={`font-semibold mb-3 ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>Threats</h4>
              <ul className="space-y-2">
                {competitiveAnalysis.swot.threats.map((t, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Target className={`h-4 w-4 mt-0.5 flex-shrink-0 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
                    <span className={`text-sm ${isDark ? 'text-white/80' : 'text-[#5C4A2A]'}`}>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Competitor Matrix */}
      {competitiveAnalysis?.matrix && competitiveAnalysis.matrix.length > 0 && (
        <div className={`rounded-2xl backdrop-blur-xl border p-6 ${
          isDark ? 'bg-white/5 border-white/10' : 'bg-white/60 border-white/40'
        }`}>
          <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-[#3D3124]'}`}>
            Competitor Analysis ({competitiveAnalysis.matrix.length})
          </h3>
          <p className={`text-sm mb-4 ${isDark ? 'text-white/60' : 'text-[#5C4A2A]/60'}`}>
            Detailed competitive landscape analysis
          </p>
          <div className="space-y-4">
            {competitiveAnalysis.matrix.map((comp, i) => (
              <div
                key={i}
                className={`rounded-xl border p-4 ${isDark ? 'border-white/10 bg-white/5' : 'border-[#5C4A2A]/10 bg-white/50'}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                      isDark ? 'bg-white/10' : 'bg-slate-100'
                    }`}>
                      <span className={`font-bold ${isDark ? 'text-white/70' : 'text-slate-600'}`}>
                        {comp.competitorName[0]}
                      </span>
                    </div>
                    <div>
                      <p className={`font-medium ${isDark ? 'text-white' : 'text-[#3D3124]'}`}>{comp.competitorName}</p>
                    </div>
                  </div>
                </div>
                <p className={`text-sm mb-3 ${isDark ? 'text-white/70' : 'text-[#5C4A2A]/80'}`}>
                  {comp.marketPosition}
                </p>
                <div className="grid gap-3 md:grid-cols-3">
                  <div>
                    <p className={`text-xs uppercase tracking-wide mb-2 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                      Strengths
                    </p>
                    <ul className="space-y-1">
                      {comp.strengths.slice(0, 3).map((s, j) => (
                        <li key={j} className={`text-xs ${isDark ? 'text-white/60' : 'text-[#5C4A2A]/70'}`}>
                          • {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className={`text-xs uppercase tracking-wide mb-2 ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                      Weaknesses
                    </p>
                    <ul className="space-y-1">
                      {comp.weaknesses.slice(0, 3).map((w, j) => (
                        <li key={j} className={`text-xs ${isDark ? 'text-white/60' : 'text-[#5C4A2A]/70'}`}>
                          • {w}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className={`text-xs uppercase tracking-wide mb-2 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                      Tech Advantages
                    </p>
                    <ul className="space-y-1">
                      {comp.techAdvantages.slice(0, 3).map((t, j) => (
                        <li key={j} className={`text-xs ${isDark ? 'text-white/60' : 'text-[#5C4A2A]/70'}`}>
                          • {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Competitive Gaps */}
      {competitiveAnalysis?.competitiveGaps && competitiveAnalysis.competitiveGaps.length > 0 && (
        <div className={`rounded-2xl backdrop-blur-xl border p-6 ${
          isDark ? 'bg-white/5 border-white/10' : 'bg-white/60 border-white/40'
        }`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-[#3D3124]'}`}>
            Competitive Gaps
          </h3>
          <ul className="space-y-2">
            {competitiveAnalysis.competitiveGaps.map((gap, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className={`flex h-6 w-6 items-center justify-center rounded-full text-sm font-medium flex-shrink-0 ${
                  isDark ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-700'
                }`}>
                  {i + 1}
                </span>
                <span className={isDark ? 'text-white/80' : 'text-[#5C4A2A]'}>{gap}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Strategic Recommendations */}
      {competitiveAnalysis?.recommendations && competitiveAnalysis.recommendations.length > 0 && (
        <div className={`rounded-2xl backdrop-blur-xl border p-6 ${
          isDark ? 'bg-gradient-to-br from-cyan-500/10 to-purple-500/5 border-cyan-500/20' : 'bg-gradient-to-br from-violet-50 to-white border-violet-200'
        }`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-[#3D3124]'}`}>
            Strategic Recommendations
          </h3>
          <ul className="space-y-3">
            {competitiveAnalysis.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className={`flex h-6 w-6 items-center justify-center rounded-full flex-shrink-0 ${
                  isDark ? 'bg-cyan-500/20' : 'bg-violet-100'
                }`}>
                  <Lightbulb className={`h-4 w-4 ${isDark ? 'text-cyan-400' : 'text-violet-600'}`} />
                </div>
                <span className={isDark ? 'text-white/80' : 'text-[#5C4A2A]'}>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Legacy Competitors Display (fallback for old data) */}
      {!hasNewData && hasLegacyData && (
        <div className={`rounded-2xl backdrop-blur-xl border p-6 ${
          isDark ? 'bg-white/5 border-white/10' : 'bg-white/60 border-white/40'
        }`}>
          <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-[#3D3124]'}`}>
            Competitors ({legacyCompetitors!.length})
          </h3>
          <p className={`text-sm mb-4 ${isDark ? 'text-white/60' : 'text-[#5C4A2A]/60'}`}>
            Regional and global competitors discovered
          </p>
          <div className="space-y-3">
            {legacyCompetitors!.map((rel) => (
              <div
                key={rel.id}
                className={`flex items-center justify-between rounded-lg border p-4 ${
                  isDark ? 'border-white/10 bg-white/5' : 'border-[#5C4A2A]/10 bg-white/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                    isDark ? 'bg-white/10' : 'bg-slate-100'
                  }`}>
                    <span className={`font-bold ${isDark ? 'text-white/70' : 'text-slate-600'}`}>
                      {rel.competitor.name[0]}
                    </span>
                  </div>
                  <div>
                    <p className={`font-medium ${isDark ? 'text-white' : 'text-[#3D3124]'}`}>{rel.competitor.name}</p>
                    <p className={`text-sm ${isDark ? 'text-white/60' : 'text-[#5C4A2A]/60'}`}>{rel.competitor.domain}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-lg text-sm ${
                    isDark ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-[#5C4A2A]/10 text-[#5C4A2A]'
                  }`}>
                    {rel.competitorType.replace('_', ' ').toLowerCase()}
                  </span>
                  {rel.relevanceScore && (
                    <span className={`text-sm ${isDark ? 'text-white/60' : 'text-[#5C4A2A]/60'}`}>
                      {Math.round(rel.relevanceScore * 100)}% match
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function OpportunitiesSection({ opportunities, isDark }: { opportunities?: Analysis['opportunities']; isDark: boolean }) {
  if (!opportunities?.opportunities || opportunities.opportunities.length === 0) {
    return (
      <div className={`rounded-2xl backdrop-blur-xl border p-12 text-center ${
        isDark ? 'bg-white/5 border-white/10' : 'bg-white/60 border-white/40'
      }`}>
        <p className={isDark ? 'text-white/50' : 'text-[#5C4A2A]/50'}>No opportunities identified yet.</p>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 4) return isDark ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-emerald-100 text-emerald-700';
    if (score >= 3) return isDark ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' : 'bg-cyan-100 text-cyan-700';
    return isDark ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-amber-100 text-amber-700';
  };

  return (
    <div className="space-y-4">
      {opportunities.opportunities.map((opp) => (
        <div key={opp.rank} className={`rounded-2xl backdrop-blur-xl border p-6 ${
          opp.rank === 1
            ? isDark ? 'bg-gradient-to-br from-emerald-500/10 to-cyan-500/5 border-emerald-500/20' : 'bg-gradient-to-br from-emerald-50 to-white border-emerald-200'
            : isDark ? 'bg-white/5 border-white/10' : 'bg-white/60 border-white/40'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-lg text-sm font-bold border ${
                opp.rank === 1
                  ? isDark ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-emerald-100 text-emerald-700'
                  : isDark ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' : 'bg-violet-100 text-violet-700'
              }`}>
                #{opp.rank}
              </span>
              <h4 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-[#3D3124]'}`}>{opp.title}</h4>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded text-xs border ${
                isDark ? 'border-white/20 text-white/70' : 'border-[#5C4A2A]/20 text-[#5C4A2A]/70'
              }`}>
                {opp.category}
              </span>
              {opp.evidenceStrength?.score && (
                <span className={`px-2 py-1 rounded text-xs font-medium border ${getScoreColor(opp.evidenceStrength.score)}`}>
                  {opp.evidenceStrength.score}/5 evidence
                </span>
              )}
            </div>
          </div>

          {/* Problem Description */}
          {opp.problem?.description && (
            <p className={`mb-4 ${isDark ? 'text-white/80' : 'text-[#5C4A2A]'}`}>{opp.problem.description}</p>
          )}

          {/* Conversation Hook */}
          {opp.conversationHook && (
            <div className={`p-3 rounded-xl mb-4 ${isDark ? 'bg-white/5 border border-white/10' : 'bg-white/70 border border-[#5C4A2A]/10'}`}>
              <p className={`text-xs uppercase tracking-wide mb-2 ${isDark ? 'text-cyan-400' : 'text-violet-600'}`}>
                Conversation Hook
              </p>
              {typeof opp.conversationHook === 'string' ? (
                <p className={`italic text-sm ${isDark ? 'text-white/80' : 'text-[#5C4A2A]'}`}>
                  "{opp.conversationHook}"
                </p>
              ) : (
                <div className="space-y-3">
                  {opp.conversationHook.openingQuestion && (
                    <div>
                      <p className={`text-xs font-medium mb-1 ${isDark ? 'text-white/50' : 'text-[#5C4A2A]/50'}`}>Opening Question</p>
                      <p className={`italic text-sm ${isDark ? 'text-white/80' : 'text-[#5C4A2A]'}`}>
                        "{opp.conversationHook.openingQuestion}"
                      </p>
                    </div>
                  )}
                  {opp.conversationHook.followUp && (
                    <div>
                      <p className={`text-xs font-medium mb-1 ${isDark ? 'text-white/50' : 'text-[#5C4A2A]/50'}`}>Follow-up</p>
                      <p className={`italic text-sm ${isDark ? 'text-white/80' : 'text-[#5C4A2A]'}`}>
                        "{opp.conversationHook.followUp}"
                      </p>
                    </div>
                  )}
                  {opp.conversationHook.expectedResponse && (
                    <div>
                      <p className={`text-xs font-medium mb-1 ${isDark ? 'text-white/50' : 'text-[#5C4A2A]/50'}`}>Expected Response</p>
                      <p className={`text-sm ${isDark ? 'text-white/70' : 'text-[#5C4A2A]/80'}`}>
                        {opp.conversationHook.expectedResponse}
                      </p>
                    </div>
                  )}
                  {opp.conversationHook.credibilityDetail && (
                    <div>
                      <p className={`text-xs font-medium mb-1 ${isDark ? 'text-white/50' : 'text-[#5C4A2A]/50'}`}>Credibility Detail</p>
                      <p className={`text-sm ${isDark ? 'text-white/70' : 'text-[#5C4A2A]/80'}`}>
                        {opp.conversationHook.credibilityDetail}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Proposed Solution */}
          {opp.proposedSolution && (
            <div className="mb-4">
              <p className={`text-xs uppercase tracking-wide mb-1 ${isDark ? 'text-white/50' : 'text-[#5C4A2A]/50'}`}>
                Proposed Solution
              </p>
              <p className={`text-sm ${isDark ? 'text-white/70' : 'text-[#5C4A2A]/80'}`}>{opp.proposedSolution}</p>
            </div>
          )}

          {/* Expected Outcome */}
          {opp.expectedOutcome && (
            <div className={`p-3 rounded-lg ${isDark ? 'bg-emerald-500/10' : 'bg-emerald-50'}`}>
              <p className={`text-xs uppercase tracking-wide mb-1 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                Expected Outcome
              </p>
              <p className={`text-sm font-medium ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>
                {opp.expectedOutcome}
              </p>
            </div>
          )}

          {/* Evidence */}
          {opp.evidence && opp.evidence.length > 0 && (
            <div className="mt-4">
              <p className={`text-xs uppercase tracking-wide mb-2 ${isDark ? 'text-white/50' : 'text-[#5C4A2A]/50'}`}>
                Supporting Evidence
              </p>
              <ul className="space-y-1">
                {opp.evidence.map((e, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className={`h-4 w-4 mt-0.5 flex-shrink-0 ${isDark ? 'text-cyan-400' : 'text-violet-600'}`} />
                    <span className={`text-sm ${isDark ? 'text-white/70' : 'text-[#5C4A2A]/80'}`}>{e}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function AnalysisDetailSkeleton({ isDark }: { isDark: boolean }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className={`h-10 w-10 rounded-xl animate-pulse ${isDark ? 'bg-white/10' : 'bg-slate-200'}`} />
        <div>
          <div className={`h-7 w-48 rounded animate-pulse ${isDark ? 'bg-white/10' : 'bg-slate-200'}`} />
          <div className={`mt-2 h-5 w-32 rounded animate-pulse ${isDark ? 'bg-white/10' : 'bg-slate-200'}`} />
        </div>
      </div>
      <div className={`h-32 w-full rounded-2xl animate-pulse ${isDark ? 'bg-white/10' : 'bg-slate-200'}`} />
      <div className="grid gap-4 md:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`h-24 rounded-2xl animate-pulse ${isDark ? 'bg-white/10' : 'bg-slate-200'}`} />
        ))}
      </div>
    </div>
  );
}
