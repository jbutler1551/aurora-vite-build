import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Zap, Clock, FileText, ArrowRight, Loader2, Search } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useTheme } from '../../lib/theme-context';

const API_URL = import.meta.env.VITE_API_URL || '';

type AnalysisMode = 'sales' | 'full';

export default function NewAnalysisPage() {
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  const [mode, setMode] = useState<AnalysisMode>('sales');
  const [loading, setLoading] = useState(false);
  const [urlError, setUrlError] = useState('');
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const validateUrl = (value: string): boolean => {
    if (!value) {
      setUrlError('Please enter a company URL');
      return false;
    }
    try {
      let normalizedUrl = value.trim();
      if (!normalizedUrl.startsWith('http')) {
        normalizedUrl = `https://${normalizedUrl}`;
      }
      const parsed = new URL(normalizedUrl);
      if (!parsed.hostname || parsed.hostname.length === 0) {
        setUrlError('Please enter a valid company URL');
        return false;
      }
      setUrlError('');
      return true;
    } catch {
      setUrlError('Please enter a valid URL');
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateUrl(url)) {
      return;
    }

    setLoading(true);

    try {
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
      toast.success('Analysis started!', {
        description: `Analyzing ${data.company.name}...`,
      });
      navigate(`/dashboard/analysis/${data.id}`);
    } catch (err) {
      toast.error('Failed to start analysis', {
        description: err instanceof Error ? err.message : 'An error occurred',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Header with Glassmorphism */}
      <div className={`relative overflow-hidden rounded-3xl p-8 backdrop-blur-2xl border shadow-2xl holographic-border animate-glow-pulse transition-colors duration-500 ${
        isDark
          ? 'bg-gradient-to-br from-white/10 via-white/5 to-white/[0.02] border-white/10'
          : 'bg-gradient-to-br from-white/70 via-white/50 to-white/30 border-white/40'
      }`}>
        {/* Decorative gradient orbs */}
        {isDark ? (
          <>
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-cyan-500/20 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-gradient-to-tr from-purple-500/15 to-transparent rounded-full blur-2xl translate-y-1/2" />
          </>
        ) : (
          <>
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#d4c4a8]/40 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-gradient-to-tr from-[#c9b896]/30 to-transparent rounded-full blur-2xl translate-y-1/2" />
          </>
        )}

        <div className="relative">
          <div className="flex items-center gap-3 mb-2">
            <div className={`h-2 w-2 rounded-full animate-pulse ${
              isDark ? 'bg-gradient-to-r from-cyan-400 to-purple-400' : 'bg-gradient-to-r from-[#8B7355] to-[#5C4A2A]'
            }`} />
            <span className={`text-sm font-medium tracking-widest uppercase ${isDark ? 'text-cyan-400' : 'text-[#8B7355]'}`}>New Analysis</span>
          </div>
          <h1 className={`text-3xl font-light tracking-wide ${isDark ? 'text-white' : 'text-[#3D3124]'}`}>Start Research</h1>
          <p className={`mt-1 font-light ${isDark ? 'text-white/60' : 'text-[#5C4A2A]/60'}`}>
            Enter a company URL to generate comprehensive sales intelligence.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* URL Input Card */}
        <div className={`relative overflow-hidden rounded-3xl backdrop-blur-2xl border shadow-xl holographic-border transition-colors duration-500 ${
          isDark ? 'bg-white/5 border-white/10' : 'bg-white/60 border-white/40'
        }`}>
          {/* Decorative gradient orb */}
          <div className={`absolute -top-20 -right-20 w-40 h-40 rounded-full blur-2xl ${
            isDark ? 'bg-gradient-to-br from-cyan-500/20 to-transparent' : 'bg-gradient-to-br from-[#d4c4a8]/30 to-transparent'
          }`} />

          <div className="relative p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className={`flex h-10 w-10 items-center justify-center rounded-2xl border ${
                isDark
                  ? 'bg-gradient-to-br from-cyan-500/20 to-purple-500/10 border-cyan-500/20'
                  : 'bg-gradient-to-br from-[#5C4A2A]/10 to-[#8B7355]/10 border-[#5C4A2A]/10'
              }`}>
                <Search className={`h-5 w-5 ${isDark ? 'text-cyan-400' : 'text-[#5C4A2A]'}`} />
              </div>
              <div>
                <span className={`text-xs font-medium tracking-widest uppercase ${isDark ? 'text-cyan-400' : 'text-[#8B7355]'}`}>
                  Company URL
                </span>
              </div>
            </div>

            <input
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (urlError) validateUrl(e.target.value);
              }}
              placeholder="https://example.com"
              className={cn(
                "w-full text-lg py-4 px-4 backdrop-blur-sm rounded-2xl font-light tracking-wide transition-all border",
                isDark
                  ? "bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-cyan-500/40 focus:ring-2 focus:ring-cyan-500/20 focus:bg-white/10"
                  : "bg-white/70 border-[#5C4A2A]/15 text-[#3D3124] placeholder:text-[#5C4A2A]/30 focus:border-[#8B7355]/40 focus:ring-2 focus:ring-[#8B7355]/20 focus:bg-white/90",
                "outline-none"
              )}
            />
            <p className={`font-light text-sm mt-3 ${isDark ? 'text-white/50' : 'text-[#5C4A2A]/50'}`}>
              We'll extract the company name and research their web presence.
            </p>
            {urlError && (
              <p className="text-red-500 text-sm mt-2">{urlError}</p>
            )}
          </div>
        </div>

        {/* Mode Selection Card */}
        <div className={`relative overflow-hidden rounded-3xl backdrop-blur-2xl border shadow-xl holographic-border transition-colors duration-500 ${
          isDark ? 'bg-white/5 border-white/10' : 'bg-white/60 border-white/40'
        }`}>
          {/* Decorative gradient orbs */}
          {isDark ? (
            <>
              <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-gradient-to-tr from-purple-500/15 to-transparent rounded-full blur-2xl" />
              <div className="absolute top-10 right-10 w-32 h-32 bg-gradient-to-bl from-cyan-500/15 to-transparent rounded-full blur-xl" />
            </>
          ) : (
            <>
              <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-gradient-to-tr from-[#c9b896]/25 to-transparent rounded-full blur-2xl" />
              <div className="absolute top-10 right-10 w-32 h-32 bg-gradient-to-bl from-[#d4c4a8]/20 to-transparent rounded-full blur-xl" />
            </>
          )}

          <div className="relative p-6">
            <div className="flex items-center gap-3 mb-5">
              <span className={`text-xs font-medium tracking-widest uppercase ${isDark ? 'text-cyan-400' : 'text-[#8B7355]'}`}>
                Analysis Mode
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Quick Brief Option */}
              <button
                type="button"
                onClick={() => setMode('sales')}
                className={cn(
                  'group relative rounded-2xl p-5 text-left transition-all duration-300 overflow-hidden',
                  mode === 'sales'
                    ? isDark
                      ? 'bg-white/15 text-white border border-cyan-500/40 shadow-lg shadow-cyan-500/20 backdrop-blur-sm'
                      : 'bg-gradient-to-r from-[#5C4A2A] to-[#8B7355] text-white shadow-lg shadow-[#5C4A2A]/20'
                    : isDark
                      ? 'bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 hover:shadow-lg'
                      : 'bg-white/50 backdrop-blur-xl border border-white/50 hover:bg-white/70 hover:shadow-lg'
                )}
              >
                {/* Animated gradient background on hover for unselected */}
                {mode !== 'sales' && (
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                    isDark ? 'bg-gradient-to-br from-cyan-500/10 to-purple-500/5' : 'bg-gradient-to-br from-[#5C4A2A]/5 to-[#8B7355]/5'
                  }`} />
                )}

                <div className="relative flex items-center justify-between mb-3">
                  <div className={cn(
                    'flex h-11 w-11 items-center justify-center rounded-xl transition-all',
                    mode === 'sales'
                      ? 'bg-white/15'
                      : isDark
                        ? 'bg-gradient-to-br from-cyan-500/20 to-purple-500/10 border border-cyan-500/20'
                        : 'bg-gradient-to-br from-[#5C4A2A]/10 to-[#8B7355]/5 border border-[#5C4A2A]/10'
                  )}>
                    <Zap className={cn('h-5 w-5',
                      mode === 'sales'
                        ? isDark ? 'text-cyan-400' : 'text-white'
                        : isDark ? 'text-cyan-400' : 'text-[#5C4A2A]'
                    )} />
                  </div>
                  <div className={cn(
                    'flex items-center gap-1.5 text-sm',
                    mode === 'sales'
                      ? isDark ? 'text-white/70' : 'text-white/70'
                      : isDark ? 'text-white/50' : 'text-[#5C4A2A]/50'
                  )}>
                    <Clock className="h-4 w-4" />
                    <span className="font-light">&lt;1 hour</span>
                  </div>
                </div>

                <h3 className={cn(
                  'text-lg font-medium tracking-wide',
                  mode === 'sales'
                    ? isDark ? 'text-white' : 'text-white'
                    : isDark ? 'text-white' : 'text-[#3D3124]'
                )}>
                  Quick Brief
                </h3>
                <p className={cn(
                  'mt-1 text-sm font-light',
                  mode === 'sales'
                    ? isDark ? 'text-white/70' : 'text-white/70'
                    : isDark ? 'text-white/60' : 'text-[#5C4A2A]/70'
                )}>
                  Fast sales-focused analysis with key opportunities.
                </p>

                <ul className={cn(
                  'mt-4 space-y-2 text-sm',
                  mode === 'sales'
                    ? isDark ? 'text-white/80' : 'text-white/80'
                    : isDark ? 'text-white/60' : 'text-[#5C4A2A]/70'
                )}>
                  {['2-page Cheat Sheet', 'Top 3 opportunities', 'Objection handlers'].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className={cn(
                        'h-1.5 w-1.5 rounded-full',
                        mode === 'sales'
                          ? isDark ? 'bg-cyan-400' : 'bg-white/60'
                          : isDark ? 'bg-cyan-400' : 'bg-[#8B7355]'
                      )} />
                      <span className="font-light">{item}</span>
                    </li>
                  ))}
                </ul>
              </button>

              {/* Full Analysis Option */}
              <button
                type="button"
                onClick={() => setMode('full')}
                className={cn(
                  'group relative rounded-2xl p-5 text-left transition-all duration-300 overflow-hidden',
                  mode === 'full'
                    ? isDark
                      ? 'bg-white/15 text-white border border-cyan-500/40 shadow-lg shadow-cyan-500/20 backdrop-blur-sm'
                      : 'bg-gradient-to-r from-[#5C4A2A] to-[#8B7355] text-white shadow-lg shadow-[#5C4A2A]/20'
                    : isDark
                      ? 'bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 hover:shadow-lg'
                      : 'bg-white/50 backdrop-blur-xl border border-white/50 hover:bg-white/70 hover:shadow-lg'
                )}
              >
                {/* Animated gradient background on hover for unselected */}
                {mode !== 'full' && (
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                    isDark ? 'bg-gradient-to-br from-purple-500/10 to-cyan-500/5' : 'bg-gradient-to-br from-[#5C4A2A]/5 to-[#8B7355]/5'
                  }`} />
                )}

                <div className="relative flex items-center justify-between mb-3">
                  <div className={cn(
                    'flex h-11 w-11 items-center justify-center rounded-xl transition-all',
                    mode === 'full'
                      ? 'bg-white/15'
                      : isDark
                        ? 'bg-gradient-to-br from-purple-500/20 to-cyan-500/10 border border-purple-500/20'
                        : 'bg-gradient-to-br from-[#8B7355]/10 to-[#c9b896]/5 border border-[#5C4A2A]/10'
                  )}>
                    <FileText className={cn('h-5 w-5',
                      mode === 'full'
                        ? isDark ? 'text-purple-400' : 'text-white'
                        : isDark ? 'text-purple-400' : 'text-[#8B7355]'
                    )} />
                  </div>
                  <div className={cn(
                    'flex items-center gap-1.5 text-sm',
                    mode === 'full'
                      ? isDark ? 'text-white/70' : 'text-white/70'
                      : isDark ? 'text-white/50' : 'text-[#5C4A2A]/50'
                  )}>
                    <Clock className="h-4 w-4" />
                    <span className="font-light">2-4 hours</span>
                  </div>
                </div>

                <h3 className={cn(
                  'text-lg font-medium tracking-wide',
                  mode === 'full'
                    ? isDark ? 'text-white' : 'text-white'
                    : isDark ? 'text-white' : 'text-[#3D3124]'
                )}>
                  Full Analysis
                </h3>
                <p className={cn(
                  'mt-1 text-sm font-light',
                  mode === 'full'
                    ? isDark ? 'text-white/70' : 'text-white/70'
                    : isDark ? 'text-white/60' : 'text-[#5C4A2A]/70'
                )}>
                  Comprehensive consulting-grade research.
                </p>

                <ul className={cn(
                  'mt-4 space-y-2 text-sm',
                  mode === 'full'
                    ? isDark ? 'text-white/80' : 'text-white/80'
                    : isDark ? 'text-white/60' : 'text-[#5C4A2A]/70'
                )}>
                  {['Everything in Quick Brief', 'AI Readiness Scorecard', 'Full competitive matrix', 'Technology roadmap'].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className={cn(
                        'h-1.5 w-1.5 rounded-full',
                        mode === 'full'
                          ? isDark ? 'bg-purple-400' : 'bg-white/60'
                          : isDark ? 'bg-purple-400' : 'bg-[#8B7355]'
                      )} />
                      <span className="font-light">{item}</span>
                    </li>
                  ))}
                </ul>
              </button>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`flex items-center gap-2 rounded-2xl px-8 py-4 shadow-lg transition-all hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${
              isDark
                ? 'bg-white/10 text-white border border-white/20 hover:bg-white/15 hover:border-cyan-500/40 hover:shadow-lg hover:shadow-cyan-500/20 backdrop-blur-sm'
                : 'bg-gradient-to-r from-[#5C4A2A] to-[#8B7355] text-white hover:from-[#4a3a21] hover:to-[#7a6348] shadow-[#5C4A2A]/20 hover:shadow-[#5C4A2A]/30'
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="tracking-wide">Starting Analysis...</span>
              </>
            ) : (
              <>
                <span className="tracking-wide">Begin Analysis</span>
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
