import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, Loader2, Building2, ExternalLink } from 'lucide-react';
import { cn } from '../../../lib/utils';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface Analysis {
  id: string;
  status: string;
  mode: string;
  progress: number;
  currentStep?: string;
  createdAt: string;
  completedAt?: string;
  companyProfile?: {
    basics?: {
      name?: string;
      domain?: string;
      industry?: string;
      description?: string;
    };
  };
  cheatSheet?: {
    summary?: string;
    keyOpportunities?: string[];
  };
  company: {
    id: string;
    name: string;
    domain: string;
    url: string;
  };
}

const analysisSteps = [
  { key: 'EXTRACTING_WEBSITE', label: 'Extracting Website' },
  { key: 'RESEARCHING_COMPANY', label: 'Researching Company' },
  { key: 'SYNTHESIZING_PROFILE', label: 'Synthesizing Profile' },
  { key: 'DISCOVERING_COMPETITORS', label: 'Discovering Competitors' },
  { key: 'ANALYZING_COMPETITION', label: 'Analyzing Competition' },
  { key: 'GENERATING_OUTPUTS', label: 'Generating Outputs' },
];

function getStepIndex(status: string) {
  const index = analysisSteps.findIndex((s) => s.key === status);
  return index >= 0 ? index : -1;
}

export default function AnalysisPage() {
  const { id } = useParams<{ id: string }>();
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchAnalysis() {
      try {
        const res = await fetch(`${API_URL}/api/analysis/${id}`, {
          credentials: 'include',
        });
        if (!res.ok) {
          throw new Error('Failed to fetch analysis');
        }
        const data = await res.json();
        setAnalysis(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

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
    }, 3000);

    return () => clearInterval(interval);
  }, [id, analysis?.status]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-muted-foreground" size={32} />
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="text-center py-12">
        <XCircle className="mx-auto text-destructive mb-4" size={48} />
        <h2 className="text-xl font-semibold text-foreground mb-2">Error</h2>
        <p className="text-muted-foreground">{error || 'Analysis not found'}</p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 mt-4 text-primary hover:underline"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const isInProgress = !['COMPLETED', 'FAILED', 'CANCELLED'].includes(analysis.status);
  const currentStepIndex = getStepIndex(analysis.status);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/dashboard"
          className="p-2 -ml-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={20} />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Building2 className="text-primary" size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">{analysis.company.name}</h1>
              <a
                href={analysis.company.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1"
              >
                {analysis.company.domain}
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Progress */}
      {isInProgress && (
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground">Analysis Progress</h2>
            <span className="text-sm text-muted-foreground">{analysis.progress}%</span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 bg-muted rounded-full mb-6">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${analysis.progress}%` }}
            />
          </div>

          {/* Steps */}
          <div className="space-y-3">
            {analysisSteps.map((step, index) => {
              const isComplete = index < currentStepIndex;
              const isCurrent = index === currentStepIndex;

              return (
                <div
                  key={step.key}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-lg',
                    isCurrent && 'bg-primary/5'
                  )}
                >
                  <div
                    className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center',
                      isComplete && 'bg-green-500 text-white',
                      isCurrent && 'bg-primary text-primary-foreground',
                      !isComplete && !isCurrent && 'bg-muted text-muted-foreground'
                    )}
                  >
                    {isComplete ? (
                      <CheckCircle size={14} />
                    ) : isCurrent ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <span className="text-xs">{index + 1}</span>
                    )}
                  </div>
                  <span
                    className={cn(
                      'font-medium',
                      isComplete && 'text-foreground',
                      isCurrent && 'text-primary',
                      !isComplete && !isCurrent && 'text-muted-foreground'
                    )}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Completed results */}
      {analysis.status === 'COMPLETED' && (
        <>
          {/* Success banner */}
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex items-center gap-3">
            <CheckCircle className="text-green-600" size={24} />
            <div>
              <p className="font-medium text-green-600">Analysis Complete</p>
              <p className="text-sm text-green-600/80">
                Completed on {new Date(analysis.completedAt!).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Company Profile */}
          {analysis.companyProfile?.basics && (
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="font-semibold text-foreground mb-4">Company Profile</h2>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm text-muted-foreground">Name</dt>
                  <dd className="font-medium text-foreground">
                    {analysis.companyProfile.basics.name}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Industry</dt>
                  <dd className="font-medium text-foreground">
                    {analysis.companyProfile.basics.industry || 'N/A'}
                  </dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-sm text-muted-foreground">Description</dt>
                  <dd className="font-medium text-foreground">
                    {analysis.companyProfile.basics.description || 'N/A'}
                  </dd>
                </div>
              </dl>
            </div>
          )}

          {/* Cheat Sheet */}
          {analysis.cheatSheet && (
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="font-semibold text-foreground mb-4">Sales Cheat Sheet</h2>

              {analysis.cheatSheet.summary && (
                <div className="mb-4">
                  <h3 className="text-sm text-muted-foreground mb-2">Summary</h3>
                  <p className="text-foreground">{analysis.cheatSheet.summary}</p>
                </div>
              )}

              {analysis.cheatSheet.keyOpportunities && (
                <div>
                  <h3 className="text-sm text-muted-foreground mb-2">Key Opportunities</h3>
                  <ul className="space-y-2">
                    {analysis.cheatSheet.keyOpportunities.map((opp, i) => (
                      <li key={i} className="flex items-start gap-2 text-foreground">
                        <CheckCircle className="text-green-600 mt-0.5 flex-shrink-0" size={16} />
                        {opp}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Failed state */}
      {analysis.status === 'FAILED' && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-6 text-center">
          <XCircle className="mx-auto text-destructive mb-3" size={40} />
          <h2 className="font-semibold text-destructive mb-2">Analysis Failed</h2>
          <p className="text-destructive/80">
            Something went wrong during the analysis. Please try again.
          </p>
          <Link
            to="/dashboard/new"
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90"
          >
            Start New Analysis
          </Link>
        </div>
      )}
    </div>
  );
}
