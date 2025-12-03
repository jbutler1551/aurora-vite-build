import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Building2, ExternalLink, Clock, CheckCircle, Loader2, XCircle } from 'lucide-react';
import { cn } from '../../../lib/utils';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface Analysis {
  id: string;
  status: string;
  mode: string;
  createdAt: string;
  completedAt?: string;
}

interface Company {
  id: string;
  name: string;
  domain: string;
  url: string;
  industry?: string;
  description?: string;
  employeeRange?: string;
  headquarters?: string;
  foundedYear?: number;
  analyses: Analysis[];
}

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

export default function CompanyPage() {
  const { id } = useParams<{ id: string }>();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchCompany() {
      try {
        const res = await fetch(`${API_URL}/api/company/${id}`, {
          credentials: 'include',
        });
        if (!res.ok) {
          throw new Error('Failed to fetch company');
        }
        const data = await res.json();
        setCompany(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }
    fetchCompany();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-muted-foreground" size={32} />
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="text-center py-12">
        <XCircle className="mx-auto text-destructive mb-4" size={48} />
        <h2 className="text-xl font-semibold text-foreground mb-2">Error</h2>
        <p className="text-muted-foreground">{error || 'Company not found'}</p>
        <Link
          to="/dashboard/companies"
          className="inline-flex items-center gap-2 mt-4 text-primary hover:underline"
        >
          <ArrowLeft size={16} />
          Back to Companies
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/dashboard/companies"
          className="p-2 -ml-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={20} />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Building2 className="text-primary" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">{company.name}</h1>
              <a
                href={company.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1"
              >
                {company.domain}
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Company details */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="font-semibold text-foreground mb-4">Company Details</h2>
        <dl className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <dt className="text-sm text-muted-foreground">Industry</dt>
            <dd className="font-medium text-foreground">{company.industry || 'N/A'}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Employees</dt>
            <dd className="font-medium text-foreground">{company.employeeRange || 'N/A'}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Headquarters</dt>
            <dd className="font-medium text-foreground">{company.headquarters || 'N/A'}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Founded</dt>
            <dd className="font-medium text-foreground">{company.foundedYear || 'N/A'}</dd>
          </div>
        </dl>
        {company.description && (
          <div className="mt-4 pt-4 border-t border-border">
            <dt className="text-sm text-muted-foreground mb-1">Description</dt>
            <dd className="text-foreground">{company.description}</dd>
          </div>
        )}
      </div>

      {/* Analyses */}
      <div className="bg-card border border-border rounded-xl">
        <div className="p-6 border-b border-border">
          <h2 className="font-semibold text-foreground">Analysis History</h2>
        </div>

        {company.analyses.length === 0 ? (
          <div className="p-8 text-center">
            <Clock className="mx-auto text-muted-foreground mb-3" size={40} />
            <p className="text-muted-foreground">No analyses yet</p>
            <Link
              to="/dashboard/new"
              className="inline-flex items-center gap-2 mt-4 text-primary hover:underline"
            >
              Start an analysis
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {company.analyses.map((analysis) => {
              const statusInfo = getStatusInfo(analysis.status);
              return (
                <Link
                  key={analysis.id}
                  to={`/dashboard/analysis/${analysis.id}`}
                  className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                      <Clock className="text-muted-foreground" size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {analysis.mode === 'FULL' ? 'Full Analysis' : 'Sales Analysis'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(analysis.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className={cn('flex items-center gap-1.5', statusInfo.color)}>
                    <statusInfo.icon
                      size={16}
                      className={statusInfo.label === 'In Progress' ? 'animate-spin' : undefined}
                    />
                    <span className="text-sm font-medium">{statusInfo.label}</span>
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
