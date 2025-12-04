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

const API_URL = import.meta.env.VITE_API_URL || '';

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
  companyProfile?: {
    basics?: {
      name?: string;
      domain?: string;
      industry?: string;
      employeeRange?: string;
      headquarters?: string;
      description?: string;
    };
    technologySignals?: {
      techMaturity?: string;
      currentTechStack?: string[];
    };
    painPointIndicators?: Array<{
      signal: string;
      source: string;
      confidence: string;
    }>;
  };
  cheatSheet?: {
    summary?: string;
    keyOpportunities?: string[];
    talkingPoints?: string[];
    objectionHandlers?: Array<{
      objection: string;
      response: string;
    }>;
  };
  opportunities?: {
    opportunities?: Array<{
      rank: number;
      title: string;
      category: string;
      problem: { description: string };
      evidenceStrength: { score: number };
    }>;
  };
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
              <button className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                isDark
                  ? 'border-white/20 text-white/70 hover:bg-white/10 hover:text-cyan-400'
                  : 'border-[#5C4A2A]/20 text-[#5C4A2A] hover:bg-[#5C4A2A]/5'
              }`}>
                <Download className="h-4 w-4" />
                Export PDF
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
            <CompetitorsSection competitors={analysis.competitors || []} isDark={isDark} />
          )}
          {activeTab === 'opportunities' && (
            <OpportunitiesSection opportunities={analysis.opportunities} isDark={isDark} />
          )}
        </>
      )}

      {/* In Progress - Phase Overview */}
      {isInProgress && (
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

function CheatSheetSection({ cheatSheet, isDark }: { cheatSheet?: Analysis['cheatSheet']; isDark: boolean }) {
  if (!cheatSheet) {
    return (
      <div className={`rounded-2xl backdrop-blur-xl border p-12 text-center ${
        isDark ? 'bg-white/5 border-white/10' : 'bg-white/60 border-white/40'
      }`}>
        <p className={isDark ? 'text-white/50' : 'text-[#5C4A2A]/50'}>Cheat sheet not generated yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      {cheatSheet.summary && (
        <div className={`rounded-2xl backdrop-blur-xl border p-6 ${
          isDark ? 'bg-white/5 border-white/10' : 'bg-white/60 border-white/40'
        }`}>
          <h3 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-[#3D3124]'}`}>
            Executive Summary
          </h3>
          <p className={isDark ? 'text-white/80' : 'text-[#5C4A2A]'}>{cheatSheet.summary}</p>
        </div>
      )}

      {/* Key Opportunities */}
      {cheatSheet.keyOpportunities && cheatSheet.keyOpportunities.length > 0 && (
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

      {/* Talking Points */}
      {cheatSheet.talkingPoints && cheatSheet.talkingPoints.length > 0 && (
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
              </div>
            ))}
          </div>
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
          </div>
        </div>
        {profile.basics?.description && (
          <div className={`pt-4 mt-4 border-t ${isDark ? 'border-white/10' : 'border-[#5C4A2A]/10'}`}>
            <p className={`text-sm mb-2 ${isDark ? 'text-white/60' : 'text-[#5C4A2A]/60'}`}>Description</p>
            <p className={isDark ? 'text-white/80' : 'text-[#5C4A2A]'}>{profile.basics.description}</p>
          </div>
        )}
      </div>

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
                  isDark ? 'border-white/20 text-white/70' : 'border-[#5C4A2A]/20 text-[#5C4A2A]/70'
                }`}>
                  {indicator.confidence} confidence
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CompetitorsSection({
  competitors,
  isDark,
}: {
  competitors: Analysis['competitors'];
  isDark: boolean;
}) {
  if (!competitors || competitors.length === 0) {
    return (
      <div className={`rounded-2xl backdrop-blur-xl border p-12 text-center ${
        isDark ? 'bg-white/5 border-white/10' : 'bg-white/60 border-white/40'
      }`}>
        <p className={isDark ? 'text-white/50' : 'text-[#5C4A2A]/50'}>No competitors identified yet.</p>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl backdrop-blur-xl border p-6 ${
      isDark ? 'bg-white/5 border-white/10' : 'bg-white/60 border-white/40'
    }`}>
      <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-[#3D3124]'}`}>
        Competitors ({competitors.length})
      </h3>
      <p className={`text-sm mb-4 ${isDark ? 'text-white/60' : 'text-[#5C4A2A]/60'}`}>
        Regional and global competitors discovered
      </p>
      <div className="space-y-3">
        {competitors.map((rel) => (
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

  return (
    <div className="space-y-4">
      {opportunities.opportunities.map((opp) => (
        <div key={opp.rank} className={`rounded-2xl backdrop-blur-xl border p-6 ${
          isDark ? 'bg-white/5 border-white/10' : 'bg-white/60 border-white/40'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
                isDark ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-violet-100 text-violet-700'
              }`}>
                #{opp.rank}
              </span>
              <h4 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-[#3D3124]'}`}>{opp.title}</h4>
            </div>
            <span className={`px-2 py-1 rounded text-xs border ${
              isDark ? 'border-white/20 text-white/70' : 'border-[#5C4A2A]/20 text-[#5C4A2A]/70'
            }`}>
              {opp.category}
            </span>
          </div>
          <p className={isDark ? 'text-white/80' : 'text-[#5C4A2A]'}>{opp.problem.description}</p>
          <div className="mt-4 flex items-center gap-4">
            <span className={`text-sm ${isDark ? 'text-white/60' : 'text-[#5C4A2A]/60'}`}>
              Evidence strength: {opp.evidenceStrength.score}/5
            </span>
          </div>
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
