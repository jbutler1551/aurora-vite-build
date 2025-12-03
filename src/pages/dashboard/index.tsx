import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../lib/auth-context';
import { Plus, ArrowRight, Building2, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Analysis {
  id: string;
  status: string;
  mode: string;
  progress: number;
  createdAt: string;
  completedAt?: string;
  company: {
    id: string;
    name: string;
    domain: string;
  };
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function getStatusInfo(status: string) {
  switch (status) {
    case 'COMPLETED':
      return { label: 'Completed', icon: CheckCircle, color: 'text-green-600' };
    case 'FAILED':
    case 'CANCELLED':
      return { label: 'Failed', icon: XCircle, color: 'text-red-600' };
    default:
      return { label: 'In Progress', icon: Loader2, color: 'text-primary' };
  }
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalyses() {
      try {
        const res = await fetch(`${API_URL}/api/analysis?limit=10`, {
          credentials: 'include',
        });
        if (res.ok) {
          const data = await res.json();
          setAnalyses(data.items || []);
        }
      } catch (err) {
        console.error('Failed to fetch analyses:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalyses();
  }, []);

  const inProgressAnalyses = analyses.filter(
    (a) => !['COMPLETED', 'FAILED', 'CANCELLED'].includes(a.status)
  );
  const completedAnalyses = analyses.filter((a) => a.status === 'COMPLETED');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome back, {user?.name?.split(' ')[0]}
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's an overview of your competitive intelligence
          </p>
        </div>
        <Link
          to="/dashboard/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90"
        >
          <Plus size={20} />
          New Analysis
        </Link>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Clock className="text-primary" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{inProgressAnalyses.length}</p>
              <p className="text-sm text-muted-foreground">In Progress</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <CheckCircle className="text-green-600" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{completedAnalyses.length}</p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Building2 className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{analyses.length}</p>
              <p className="text-sm text-muted-foreground">Total Analyses</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent analyses */}
      <div className="bg-card border border-border rounded-xl">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Recent Analyses</h2>
          <Link
            to="/dashboard/companies"
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            View all
            <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <Loader2 className="animate-spin mx-auto text-muted-foreground" size={24} />
          </div>
        ) : analyses.length === 0 ? (
          <div className="p-8 text-center">
            <Building2 className="mx-auto text-muted-foreground mb-3" size={40} />
            <p className="text-muted-foreground">No analyses yet</p>
            <Link
              to="/dashboard/new"
              className="inline-flex items-center gap-2 mt-4 text-primary hover:underline"
            >
              <Plus size={16} />
              Start your first analysis
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {analyses.slice(0, 5).map((analysis) => {
              const statusInfo = getStatusInfo(analysis.status);
              return (
                <Link
                  key={analysis.id}
                  to={`/dashboard/analysis/${analysis.id}`}
                  className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">
                        {analysis.company.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{analysis.company.name}</p>
                      <p className="text-sm text-muted-foreground">{analysis.company.domain}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className={cn('flex items-center gap-1.5', statusInfo.color)}>
                      <statusInfo.icon
                        size={16}
                        className={
                          statusInfo.label === 'In Progress' ? 'animate-spin' : undefined
                        }
                      />
                      <span className="text-sm font-medium">{statusInfo.label}</span>
                    </div>
                    <ArrowRight size={16} className="text-muted-foreground" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
