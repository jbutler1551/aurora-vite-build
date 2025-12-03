import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Clock, CheckCircle, XCircle, ArrowRight, TrendingUp, Building2, Bell, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useTheme } from '@/lib/theme-context';
import { useAuth } from '@/lib/auth-context';

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

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const getStatusColors = (isDark: boolean) => ({
  PENDING: isDark
    ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
    : 'bg-[#8B7355]/20 text-[#8B7355] border-[#8B7355]/30',
  COMPLETED: isDark
    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
    : 'bg-[#5C4A2A]/10 text-[#5C4A2A] border-[#5C4A2A]/20',
  FAILED: isDark
    ? 'bg-red-500/20 text-red-400 border-red-500/30'
    : 'bg-red-100/80 text-red-700 border-red-200',
  CANCELLED: isDark
    ? 'bg-white/10 text-white/40 border-white/10'
    : 'bg-[#ebe3d3] text-[#5C4A2A]/60 border-[#5C4A2A]/10',
});

const statusIcons = {
  PENDING: Clock,
  COMPLETED: CheckCircle,
  FAILED: XCircle,
  CANCELLED: XCircle,
};

type StatusCategory = 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';

function getStatusCategory(status: string): StatusCategory {
  if (['COMPLETED'].includes(status)) return 'COMPLETED';
  if (['FAILED', 'CANCELLED'].includes(status)) return 'FAILED';
  return 'PENDING';
}

export default function DashboardPage() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const isDark = theme === 'dark';
  const statusColors = getStatusColors(isDark);

  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    monthlyUsed: 0,
    monthlyLimit: 5,
    companies: 0,
    monitors: 0,
    tier: 'Free'
  });

  useEffect(() => {
    async function fetchAnalyses() {
      try {
        const res = await fetch(`${API_URL}/api/analysis?limit=5`, {
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

  return (
    <div className="space-y-8">
      {/* Welcome Section with Glassmorphism */}
      <div className={`relative overflow-hidden rounded-3xl p-8 backdrop-blur-2xl border shadow-2xl transition-colors duration-500 ${
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

        <div className="relative flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className={`h-2 w-2 rounded-full animate-pulse ${
                isDark ? 'bg-gradient-to-r from-cyan-400 to-purple-400' : 'bg-gradient-to-r from-[#8B7355] to-[#5C4A2A]'
              }`} />
              <span className={`text-sm font-medium tracking-widest uppercase ${isDark ? 'text-cyan-400' : 'text-[#8B7355]'}`}>Dashboard</span>
            </div>
            <h1 className={`text-3xl font-light tracking-wide ${isDark ? 'text-white' : 'text-[#3D3124]'}`}>
              Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}
            </h1>
            <p className={`mt-1 font-light ${isDark ? 'text-white/60' : 'text-[#5C4A2A]/60'}`}>
              Start a new analysis or review your recent research.
            </p>
          </div>
          <Link to="/dashboard/new">
            <Button className={`gap-2 rounded-2xl px-6 py-5 shadow-lg transition-all hover:shadow-xl hover:scale-[1.02] ${
              isDark
                ? 'bg-white/10 text-white border border-white/20 hover:bg-white/15 hover:border-cyan-500/40 hover:shadow-lg hover:shadow-cyan-500/20 backdrop-blur-sm'
                : 'bg-gradient-to-r from-[#5C4A2A] to-[#8B7355] text-white hover:from-[#4a3a21] hover:to-[#7a6348] shadow-[#5C4A2A]/20 hover:shadow-[#5C4A2A]/30'
            }`}>
              <Plus className="h-4 w-4" />
              <span className="tracking-wide">New Analysis</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards with Liquid Glass Effect */}
      <div className="grid gap-5 md:grid-cols-4">
        {[
          { label: 'Monthly Analyses', value: stats.monthlyUsed, max: stats.monthlyLimit, icon: TrendingUp, gradient: isDark ? 'from-cyan-500/20 to-purple-500/10' : 'from-[#8B7355]/20 to-[#5C4A2A]/10' },
          { label: 'Companies', value: stats.companies, icon: Building2, gradient: isDark ? 'from-emerald-500/20 to-cyan-500/10' : 'from-[#5C4A2A]/15 to-[#8B7355]/10' },
          { label: 'Active Monitors', value: stats.monitors, icon: Bell, gradient: isDark ? 'from-purple-500/20 to-pink-500/10' : 'from-[#c9b896]/30 to-[#8B7355]/15' },
          { label: 'Subscription', value: stats.tier, icon: Sparkles, gradient: isDark ? 'from-pink-500/20 to-cyan-500/10' : 'from-[#d4c4a8]/30 to-[#c9b896]/20' },
        ].map((stat, i) => (
          <div
            key={i}
            className={`group relative overflow-hidden rounded-2xl p-5 backdrop-blur-2xl border shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.03] ${
              isDark
                ? 'bg-white/5 border-white/10 hover:bg-white/10'
                : 'bg-white/60 border-white/50 hover:bg-white/70'
            }`}
          >
            {/* Animated gradient background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs font-medium tracking-widest uppercase ${isDark ? 'text-white/50' : 'text-[#5C4A2A]/50'}`}>
                  {stat.label}
                </span>
                <stat.icon className={`h-4 w-4 ${isDark ? 'text-cyan-400/60' : 'text-[#8B7355]/60'}`} />
              </div>
              <div className="flex items-baseline gap-1">
                <span className={`text-3xl font-light tracking-tight ${isDark ? 'text-white' : 'text-[#3D3124]'}`}>
                  {typeof stat.value === 'string' ? stat.value : stat.value}
                </span>
                {stat.max && (
                  <span className={`text-lg font-light ${isDark ? 'text-white/40' : 'text-[#5C4A2A]/40'}`}>/{stat.max}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Start - Floating Glass Card */}
      <div className={`relative overflow-hidden rounded-3xl p-6 backdrop-blur-2xl border shadow-xl hover:shadow-2xl transition-all duration-500 ${
        isDark
          ? 'bg-gradient-to-r from-white/10 via-white/5 to-white/[0.02] border-white/10'
          : 'bg-gradient-to-r from-white/70 via-white/50 to-white/30 border-white/40'
      }`}>
        <div className={`absolute inset-0 bg-gradient-to-r ${
          isDark ? 'from-cyan-500/5 via-transparent to-purple-500/5' : 'from-[#d4c4a8]/10 via-transparent to-[#c9b896]/10'
        }`} />

        <div className="relative flex items-center gap-6">
          <div className={`flex h-14 w-14 items-center justify-center rounded-2xl border ${
            isDark
              ? 'bg-gradient-to-br from-cyan-500/20 to-purple-500/10 border-cyan-500/20'
              : 'bg-gradient-to-br from-[#5C4A2A]/10 to-[#8B7355]/10 border-[#5C4A2A]/10'
          }`}>
            <Search className={`h-6 w-6 ${isDark ? 'text-cyan-400' : 'text-[#5C4A2A]'}`} />
          </div>
          <div className="flex-1">
            <h3 className={`font-medium tracking-wide text-lg ${isDark ? 'text-white' : 'text-[#3D3124]'}`}>Start a new analysis</h3>
            <p className={`text-sm font-light mt-0.5 ${isDark ? 'text-white/60' : 'text-[#5C4A2A]/60'}`}>
              Enter a company URL to generate a comprehensive sales brief in minutes.
            </p>
          </div>
          <Link to="/dashboard/new">
            <Button
              variant="outline"
              className={`gap-2 rounded-2xl px-5 py-5 transition-all hover:scale-[1.02] ${
                isDark
                  ? 'border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-500/50'
                  : 'border-[#5C4A2A]/20 text-[#5C4A2A] hover:bg-[#5C4A2A]/5 hover:border-[#5C4A2A]/30'
              }`}
            >
              <span className="tracking-wide">Get Started</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Recent Analyses - Premium Glass Card */}
      <div className={`relative overflow-hidden rounded-3xl backdrop-blur-2xl border shadow-xl transition-colors duration-500 ${
        isDark ? 'bg-white/5 border-white/10' : 'bg-white/60 border-white/40'
      }`}>
        {/* Subtle decorative elements */}
        <div className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 ${
          isDark ? 'bg-gradient-to-bl from-cyan-500/10 to-transparent' : 'bg-gradient-to-bl from-[#d4c4a8]/20 to-transparent'
        }`} />

        <div className="relative">
          <div className={`flex items-center justify-between p-6 pb-4 border-b transition-colors duration-500 ${
            isDark ? 'border-white/5' : 'border-[#5C4A2A]/5'
          }`}>
            <div>
              <h2 className={`text-lg font-medium tracking-wide ${isDark ? 'text-white' : 'text-[#3D3124]'}`}>Recent Analyses</h2>
              <p className={`text-sm font-light ${isDark ? 'text-white/50' : 'text-[#5C4A2A]/50'}`}>Your most recent company research</p>
            </div>
            <Link to="/dashboard/companies">
              <Button
                variant="ghost"
                size="sm"
                className={`rounded-xl ${
                  isDark ? 'text-cyan-400 hover:text-cyan-300 hover:bg-white/5' : 'text-[#8B7355] hover:text-[#5C4A2A] hover:bg-[#5C4A2A]/5'
                }`}
              >
                View all
              </Button>
            </Link>
          </div>

          <div className="p-6 pt-2">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className={`flex items-center gap-4 py-4 px-4 rounded-2xl ${isDark ? 'bg-white/5' : 'bg-white/30'}`}>
                    <Skeleton className={`h-12 w-12 rounded-2xl ${isDark ? 'bg-white/10' : 'bg-[#5C4A2A]/10'}`} />
                    <div className="flex-1 space-y-2">
                      <Skeleton className={`h-4 w-48 rounded-lg ${isDark ? 'bg-white/10' : 'bg-[#5C4A2A]/10'}`} />
                      <Skeleton className={`h-3 w-32 rounded-lg ${isDark ? 'bg-white/10' : 'bg-[#5C4A2A]/10'}`} />
                    </div>
                    <Skeleton className={`h-7 w-24 rounded-xl ${isDark ? 'bg-white/10' : 'bg-[#5C4A2A]/10'}`} />
                  </div>
                ))}
              </div>
            ) : analyses.length === 0 ? (
              <div className="py-12 text-center">
                <div className={`flex h-16 w-16 items-center justify-center rounded-2xl mx-auto mb-4 ${
                  isDark ? 'bg-gradient-to-br from-cyan-500/20 to-purple-500/10' : 'bg-gradient-to-br from-[#5C4A2A]/10 to-[#8B7355]/10'
                }`}>
                  <Search className={`h-7 w-7 ${isDark ? 'text-cyan-400/40' : 'text-[#5C4A2A]/40'}`} />
                </div>
                <p className={`font-light ${isDark ? 'text-white/50' : 'text-[#5C4A2A]/50'}`}>No analyses yet. Start your first one!</p>
                <Link to="/dashboard/new">
                  <Button className={`mt-5 rounded-2xl px-6 shadow-lg ${
                    isDark
                      ? 'bg-white/10 text-white border border-white/20 hover:bg-white/15 hover:border-cyan-500/40 hover:shadow-lg hover:shadow-cyan-500/20 backdrop-blur-sm'
                      : 'bg-gradient-to-r from-[#5C4A2A] to-[#8B7355] text-white hover:from-[#4a3a21] hover:to-[#7a6348]'
                  }`}>
                    Create Analysis
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {analyses.map((analysis) => {
                  const statusCategory = getStatusCategory(analysis.status);
                  const StatusIcon = statusIcons[statusCategory];
                  return (
                    <Link
                      key={analysis.id}
                      to={`/dashboard/analysis/${analysis.id}`}
                      className={`group flex items-center gap-4 py-4 px-4 rounded-2xl transition-all duration-300 ${
                        isDark ? 'hover:bg-white/5 hover:shadow-lg' : 'hover:bg-white/60 hover:shadow-lg'
                      }`}
                    >
                      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border group-hover:scale-105 transition-transform ${
                        isDark
                          ? 'bg-gradient-to-br from-cyan-500/20 to-purple-500/10 border-cyan-500/20'
                          : 'bg-gradient-to-br from-[#5C4A2A]/10 to-[#8B7355]/10 border-[#5C4A2A]/10'
                      }`}>
                        <span className={`text-lg font-medium ${isDark ? 'text-cyan-400' : 'text-[#5C4A2A]'}`}>
                          {analysis.company.name[0]}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium truncate tracking-wide transition-colors ${
                          isDark ? 'text-white group-hover:text-cyan-400' : 'text-[#3D3124] group-hover:text-[#5C4A2A]'
                        }`}>
                          {analysis.company.name}
                        </p>
                        <p className={`text-sm truncate font-light ${isDark ? 'text-white/50' : 'text-[#5C4A2A]/50'}`}>
                          {analysis.company.domain}
                        </p>
                      </div>
                      <Badge className={`${statusColors[statusCategory]} rounded-xl px-3 py-1 font-medium border backdrop-blur-sm`}>
                        <StatusIcon className="mr-1.5 h-3 w-3" />
                        {statusCategory === 'PENDING' ? 'In Progress' : statusCategory}
                      </Badge>
                      <span className={`text-sm font-light ${isDark ? 'text-white/40' : 'text-[#5C4A2A]/40'}`}>
                        {new Date(analysis.createdAt).toLocaleDateString()}
                      </span>
                      <ArrowRight className={`h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all ${
                        isDark ? 'text-cyan-400/50' : 'text-[#5C4A2A]/30'
                      }`} />
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
