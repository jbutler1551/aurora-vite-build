import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building2, ArrowRight, Loader2, Plus } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface Company {
  id: string;
  name: string;
  domain: string;
  url: string;
  industry?: string;
  createdAt: string;
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCompanies() {
      try {
        const res = await fetch(`${API_URL}/api/company`, {
          credentials: 'include',
        });
        if (res.ok) {
          const data = await res.json();
          setCompanies(data.items || []);
        }
      } catch (err) {
        console.error('Failed to fetch companies:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchCompanies();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Companies</h1>
          <p className="text-muted-foreground mt-1">
            All companies you've analyzed
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

      <div className="bg-card border border-border rounded-xl">
        {loading ? (
          <div className="p-8 text-center">
            <Loader2 className="animate-spin mx-auto text-muted-foreground" size={24} />
          </div>
        ) : companies.length === 0 ? (
          <div className="p-8 text-center">
            <Building2 className="mx-auto text-muted-foreground mb-3" size={40} />
            <p className="text-muted-foreground">No companies yet</p>
            <Link
              to="/dashboard/new"
              className="inline-flex items-center gap-2 mt-4 text-primary hover:underline"
            >
              <Plus size={16} />
              Analyze your first company
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {companies.map((company) => (
              <Link
                key={company.id}
                to={`/dashboard/companies/${company.id}`}
                className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <span className="text-lg font-bold text-primary">
                      {company.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{company.name}</p>
                    <p className="text-sm text-muted-foreground">{company.domain}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {company.industry && (
                    <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
                      {company.industry}
                    </span>
                  )}
                  <ArrowRight size={16} className="text-muted-foreground" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
