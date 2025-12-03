import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowRight, Loader2, Sparkles, Target, Globe } from 'lucide-react';
import { cn } from '../../lib/utils';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

type AnalysisMode = 'sales' | 'full';

export default function NewAnalysisPage() {
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  const [mode, setMode] = useState<AnalysisMode>('sales');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url) {
      toast.error('Please enter a company URL');
      return;
    }

    setLoading(true);

    try {
      // Normalize URL
      let normalizedUrl = url.trim();
      if (!normalizedUrl.startsWith('http')) {
        normalizedUrl = `https://${normalizedUrl}`;
      }

      const res = await fetch(`${API_URL}/api/analysis`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ url: normalizedUrl, mode }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to start analysis');
      }

      const data = await res.json();
      toast.success('Analysis started successfully');
      navigate(`/dashboard/analysis/${data.id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to start analysis');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">New Analysis</h1>
        <p className="text-muted-foreground mt-1">
          Enter a company URL to generate competitive intelligence
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* URL Input */}
        <div className="bg-card border border-border rounded-xl p-6">
          <label htmlFor="url" className="block text-sm font-medium text-foreground mb-3">
            Company Website
          </label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <input
              id="url"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
              placeholder="example.com"
              required
            />
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Enter the company's main website URL
          </p>
        </div>

        {/* Analysis Mode */}
        <div className="bg-card border border-border rounded-xl p-6">
          <label className="block text-sm font-medium text-foreground mb-4">
            Analysis Mode
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setMode('sales')}
              className={cn(
                'p-4 rounded-lg border-2 text-left transition-all',
                mode === 'sales'
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              )}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={cn(
                  'w-10 h-10 rounded-lg flex items-center justify-center',
                  mode === 'sales' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                )}>
                  <Target size={20} />
                </div>
                <span className="font-semibold text-foreground">Sales Mode</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Quick analysis focused on sales opportunities and key talking points
              </p>
            </button>

            <button
              type="button"
              onClick={() => setMode('full')}
              className={cn(
                'p-4 rounded-lg border-2 text-left transition-all',
                mode === 'full'
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              )}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={cn(
                  'w-10 h-10 rounded-lg flex items-center justify-center',
                  mode === 'full' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                )}>
                  <Sparkles size={20} />
                </div>
                <span className="font-semibold text-foreground">Full Analysis</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Comprehensive competitive intelligence with deep competitor research
              </p>
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || !url}
          className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Starting Analysis...
            </>
          ) : (
            <>
              Start Analysis
              <ArrowRight size={20} />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
