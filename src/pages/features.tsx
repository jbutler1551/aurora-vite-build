import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SiteNav } from '@/components/ui/site-nav';
import { useTheme } from '@/lib/theme-context';
import {
  Search,
  BarChart3,
  Shield,
  Target,
  Brain,
  FileText,
  MessageSquare,
  Bell,
  Building2,
  Users,
  TrendingUp,
  Clock,
  CheckCircle2,
  ArrowRight,
  Layers,
  Sparkles,
  BookOpen,
  Award,
  GraduationCap,
  Crosshair
} from 'lucide-react';

export default function FeaturesPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-500 ${isDark ? 'bg-[#0a0a0a]' : 'bg-[#ebe3d3]'}`}>
      {/* Aurora Borealis Background - Dark mode */}
      {isDark && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          {/* Primary aurora curtains - top of screen */}
          <div
            className="absolute inset-0 opacity-60"
            style={{
              background: `
                radial-gradient(ellipse 120% 60% at 10% -20%, rgba(34, 211, 238, 0.25) 0%, transparent 50%),
                radial-gradient(ellipse 100% 50% at 50% -10%, rgba(52, 211, 153, 0.2) 0%, transparent 45%),
                radial-gradient(ellipse 110% 55% at 90% -15%, rgba(168, 85, 247, 0.22) 0%, transparent 50%)
              `,
            }}
          />

          {/* Secondary flowing aurora bands */}
          <div
            className="absolute inset-0 opacity-50 animate-aurora-shift"
            style={{
              background: `
                radial-gradient(ellipse 80% 40% at 20% 15%, rgba(34, 211, 238, 0.18) 0%, transparent 55%),
                radial-gradient(ellipse 70% 35% at 75% 10%, rgba(52, 211, 153, 0.15) 0%, transparent 50%),
                radial-gradient(ellipse 90% 45% at 45% 20%, rgba(168, 85, 247, 0.12) 0%, transparent 55%)
              `,
            }}
          />

          {/* Tertiary aurora waves with pink */}
          <div
            className="absolute inset-0 opacity-40 animate-aurora-shift-reverse"
            style={{
              background: `
                radial-gradient(ellipse 60% 30% at 5% 25%, rgba(236, 72, 153, 0.15) 0%, transparent 50%),
                radial-gradient(ellipse 70% 35% at 95% 20%, rgba(236, 72, 153, 0.12) 0%, transparent 50%),
                radial-gradient(ellipse 50% 25% at 50% 30%, rgba(34, 211, 238, 0.1) 0%, transparent 45%)
              `,
            }}
          />

          {/* Bright aurora glow spots */}
          <div className="absolute top-[5%] left-[10%] w-[600px] h-[400px] bg-cyan-500/20 rounded-full blur-[150px] animate-float-slow" />
          <div className="absolute top-[0%] right-[20%] w-[500px] h-[350px] bg-emerald-500/18 rounded-full blur-[130px] animate-float-slower" />
          <div className="absolute top-[10%] left-[40%] w-[550px] h-[380px] bg-purple-500/15 rounded-full blur-[140px] animate-float-slow" />
          <div className="absolute top-[15%] right-[5%] w-[400px] h-[300px] bg-pink-500/12 rounded-full blur-[120px] animate-float-slower" />

          {/* Lower aurora reflections */}
          <div className="absolute bottom-[20%] left-[15%] w-[450px] h-[250px] bg-cyan-500/10 rounded-full blur-[100px] animate-float-slower" />
          <div className="absolute bottom-[30%] right-[25%] w-[400px] h-[200px] bg-emerald-500/8 rounded-full blur-[90px] animate-float-slow" />

          {/* Subtle noise texture for depth */}
          <div
            className="absolute inset-0 opacity-[0.02] mix-blend-screen"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />
        </div>
      )}

      {/* Light mode background orbs */}
      {!isDark && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gradient-radial from-[#d4c4a8]/50 via-[#c9b896]/30 to-transparent rounded-full blur-3xl animate-float-slow" />
          <div className="absolute top-1/2 -left-32 w-[500px] h-[500px] bg-gradient-radial from-[#c9b896]/40 via-[#bfae8c]/25 to-transparent rounded-full blur-3xl animate-float-slower" />
          <div className="absolute -bottom-32 right-1/4 w-[550px] h-[550px] bg-gradient-radial from-[#bfae8c]/45 via-[#d4c4a8]/25 to-transparent rounded-full blur-3xl animate-float-slow" />
        </div>
      )}

      {/* Grid overlay */}
      <div
        className={`pointer-events-none fixed inset-0 transition-opacity duration-500 ${isDark ? 'opacity-[0.02]' : 'opacity-[0.03]'}`}
        style={{
          backgroundImage: `
            linear-gradient(to right, ${isDark ? '#00ffff' : '#5C4A2A'} 1px, transparent 1px),
            linear-gradient(to bottom, ${isDark ? '#00ffff' : '#5C4A2A'} 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      <SiteNav currentPage="features" />

      <main className="relative z-10">
        {/* Hero */}
        <section className="relative py-24 px-4 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-4xl mx-auto">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm mb-8 transition-colors duration-500 ${
                isDark
                  ? 'bg-white/5 border border-cyan-500/30'
                  : 'bg-[#5C4A2A]/10 border border-[#5C4A2A]/20'
              }`}>
                <Sparkles className={`h-4 w-4 ${isDark ? 'text-cyan-400' : 'text-[#8B7355]'}`} />
                <span className={`text-sm tracking-wide ${isDark ? 'text-cyan-400' : 'text-[#5C4A2A]'}`}>Intelligence Platform</span>
              </div>

              <h1 className={`text-5xl md:text-6xl font-light leading-tight mb-6 ${isDark ? 'text-white' : 'text-[#3D3124]'}`}>
                Everything You Need to
                <span className={`block font-normal bg-clip-text text-transparent ${
                  isDark
                    ? 'bg-gradient-to-r from-cyan-400 via-emerald-400 to-purple-400'
                    : 'bg-gradient-to-r from-[#5C4A2A] via-[#8B7355] to-[#5C4A2A]'
                }`}>
                  Win More Deals
                </span>
              </h1>

              <p className={`text-xl font-light max-w-2xl mx-auto ${isDark ? 'text-white/60' : 'text-[#5C4A2A]/70'}`}>
                From deep research to deal-ready insights, Aurora transforms how sales teams prepare for every conversation.
              </p>
            </div>
          </div>
        </section>

        {/* Core Capabilities - Large Feature Blocks */}
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            {/* Feature 1 - 99% Accuracy */}
            <div className="grid md:grid-cols-2 gap-0 rounded-3xl overflow-hidden shadow-2xl mb-8">
              <div className={`p-10 md:p-14 flex flex-col justify-center transition-colors duration-500 ${
                isDark
                  ? 'bg-gradient-to-br from-[#111] via-[#0a0a0a] to-[#111]'
                  : 'bg-gradient-to-br from-[#3D3124] to-[#5C4A2A]'
              }`}>
                <div className="flex items-center gap-3 mb-6">
                  <Shield className={`h-8 w-8 ${isDark ? 'text-cyan-400' : 'text-[#d4c4a8]'}`} />
                  <span className={`text-sm font-medium tracking-widest uppercase ${isDark ? 'text-cyan-400' : 'text-[#d4c4a8]'}`}>Core Technology</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-light text-[#F5EFE4] mb-4">
                  99% Accuracy Engine
                </h2>
                <p className={`font-light text-lg mb-6 ${isDark ? 'text-white/60' : 'text-[#d4c4a8]/80'}`}>
                  While other AI tools achieve 30-57% accuracy on open-web tasks, Aurora's multi-layer verification framework delivers decision-grade intelligence you can actually trust.
                </p>
                <ul className="space-y-3">
                  {['Multi-source verification', 'Cross-referenced citations', 'Real-time fact checking', 'Traceable insights'].map((item, i) => (
                    <li key={i} className={`flex items-center gap-3 ${isDark ? 'text-white/70' : 'text-[#F5EFE4]/80'}`}>
                      <CheckCircle2 className={`h-4 w-4 flex-shrink-0 ${isDark ? 'text-emerald-400' : 'text-[#d4c4a8]'}`} />
                      <span className="font-light">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className={`backdrop-blur-xl p-10 md:p-14 flex items-center justify-center transition-colors duration-500 ${
                isDark
                  ? 'bg-gradient-to-br from-cyan-500/10 via-emerald-500/5 to-purple-500/10'
                  : 'bg-gradient-to-br from-white/80 to-white/60'
              }`}>
                <div className="text-center">
                  <span className={`text-[100px] md:text-[140px] font-extralight leading-none ${
                    isDark
                      ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400'
                      : 'text-[#3D3124]'
                  }`}>99%</span>
                  <p className={`text-xl font-light -mt-2 ${isDark ? 'text-white/60' : 'text-[#5C4A2A]/70'}`}>Verified Accuracy</p>
                  <p className={`text-sm font-light mt-4 ${isDark ? 'text-white/40' : 'text-[#5C4A2A]/50'}`}>vs. 30-57% industry average</p>
                </div>
              </div>
            </div>

            {/* Feature 2 - Revenue Intelligence */}
            <div className="grid md:grid-cols-2 gap-0 rounded-3xl overflow-hidden shadow-2xl mb-8">
              <div className={`p-10 md:p-14 flex items-center justify-center order-2 md:order-1 transition-colors duration-500 ${
                isDark
                  ? 'bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-cyan-500/10'
                  : 'bg-gradient-to-br from-[#F5EFE4] to-white'
              }`}>
                <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                  {[
                    { icon: Target, label: 'Opportunity Maps', color: 'cyan' },
                    { icon: Crosshair, label: 'Win Angles', color: 'purple' },
                    { icon: TrendingUp, label: 'Risk Analysis', color: 'emerald' },
                    { icon: ArrowRight, label: 'Next Moves', color: 'pink' },
                  ].map((item, i) => (
                    <div key={i} className={`p-4 rounded-2xl text-center transition-colors duration-500 ${
                      isDark
                        ? 'bg-white/5 border border-white/10 shadow-lg'
                        : 'bg-white shadow-lg border border-[#5C4A2A]/10'
                    }`}>
                      <item.icon className={`h-6 w-6 mx-auto mb-2 ${
                        isDark
                          ? item.color === 'cyan' ? 'text-cyan-400' : item.color === 'purple' ? 'text-purple-400' : item.color === 'emerald' ? 'text-emerald-400' : 'text-pink-400'
                          : 'text-[#5C4A2A]'
                      }`} />
                      <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-[#3D3124]'}`}>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className={`p-10 md:p-14 flex flex-col justify-center order-1 md:order-2 transition-colors duration-500 ${
                isDark
                  ? 'bg-gradient-to-br from-[#111] via-[#0a0a0a] to-[#111]'
                  : 'bg-gradient-to-br from-[#5C4A2A] to-[#3D3124]'
              }`}>
                <div className="flex items-center gap-3 mb-6">
                  <BarChart3 className={`h-8 w-8 ${isDark ? 'text-purple-400' : 'text-[#d4c4a8]'}`} />
                  <span className={`text-sm font-medium tracking-widest uppercase ${isDark ? 'text-purple-400' : 'text-[#d4c4a8]'}`}>Revenue Impact</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-light text-white mb-4">
                  Revenue Intelligence
                </h2>
                <p className={`font-light text-lg mb-6 ${isDark ? 'text-white/60' : 'text-[#d4c4a8]/80'}`}>
                  Not just research summaries — actionable intelligence designed to identify where the money is and how to win it.
                </p>
                <ul className="space-y-3">
                  {['Opportunity scoring', 'Competitive positioning', 'Deal probability analysis', 'Revenue forecasting signals'].map((item, i) => (
                    <li key={i} className={`flex items-center gap-3 ${isDark ? 'text-white/70' : 'text-white/80'}`}>
                      <CheckCircle2 className={`h-4 w-4 flex-shrink-0 ${isDark ? 'text-emerald-400' : 'text-[#d4c4a8]'}`} />
                      <span className="font-light">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Feature 3 - Sales Playbooks */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className={`md:col-span-2 relative overflow-hidden rounded-3xl backdrop-blur-xl shadow-xl p-10 transition-colors duration-500 ${
                isDark
                  ? 'bg-white/5 border border-white/10'
                  : 'bg-gradient-to-br from-white/70 to-white/40 border border-white/50'
              }`}>
                <div className={`absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl ${
                  isDark ? 'bg-gradient-to-br from-emerald-500/20 to-transparent' : 'bg-gradient-to-br from-[#d4c4a8]/30 to-transparent'
                }`} />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-6">
                    <MessageSquare className={`h-8 w-8 ${isDark ? 'text-emerald-400' : 'text-[#5C4A2A]'}`} />
                    <span className={`text-sm font-medium tracking-widest uppercase ${isDark ? 'text-emerald-400' : 'text-[#8B7355]'}`}>Sales Enablement</span>
                  </div>
                  <h2 className={`text-3xl font-light mb-4 ${isDark ? 'text-white' : 'text-[#3D3124]'}`}>
                    Deal-Ready Playbooks
                  </h2>
                  <p className={`font-light text-lg mb-8 max-w-xl ${isDark ? 'text-white/60' : 'text-[#5C4A2A]/70'}`}>
                    Walk into every meeting prepared with talk tracks, objection handlers, and conversation starters tailored to each specific prospect.
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      'Personalized talk tracks',
                      'Objection handling scripts',
                      'Competitive battle cards',
                      'Discovery questions',
                      'Value propositions',
                      'Follow-up templates',
                    ].map((item, i) => (
                      <div key={i} className={`flex items-center gap-3 p-3 rounded-xl transition-colors duration-500 ${
                        isDark
                          ? 'bg-white/5 border border-white/10'
                          : 'bg-white/60 border border-white/80'
                      }`}>
                        <CheckCircle2 className={`h-4 w-4 flex-shrink-0 ${isDark ? 'text-emerald-400' : 'text-[#5C4A2A]'}`} />
                        <span className={`text-sm ${isDark ? 'text-white' : 'text-[#3D3124]'}`}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className={`relative overflow-hidden rounded-3xl p-8 flex flex-col justify-between transition-colors duration-500 ${
                isDark ? 'bg-gradient-to-br from-[#111] to-[#0a0a0a]' : 'bg-[#3D3124]'
              }`}>
                <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl ${
                  isDark ? 'bg-gradient-radial from-pink-500/30 to-transparent' : 'bg-gradient-radial from-[#8B7355]/30 to-transparent'
                }`} />
                <div className="relative">
                  <Clock className={`h-8 w-8 mb-6 ${isDark ? 'text-pink-400' : 'text-[#d4c4a8]'}`} />
                  <h3 className="text-2xl font-light text-[#F5EFE4] mb-3">Hours, Not Months</h3>
                  <p className={`font-light ${isDark ? 'text-white/50' : 'text-[#d4c4a8]/70'}`}>
                    What analysts and consultants take weeks to deliver, Aurora produces in hours.
                  </p>
                </div>
                <div className={`relative mt-8 p-4 rounded-xl transition-colors duration-500 ${
                  isDark ? 'bg-pink-500/10 border border-pink-500/20' : 'bg-white/10'
                }`}>
                  <p className={`text-sm font-light ${isDark ? 'text-pink-400/60' : 'text-[#d4c4a8]/60'}`}>Average delivery time</p>
                  <p className={`text-3xl font-light ${isDark ? 'text-pink-400' : 'text-[#F5EFE4]'}`}>&lt; 24 hours</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Platform Features Grid */}
        <section className={`py-24 px-4 transition-colors duration-500 ${
          isDark ? 'bg-gradient-to-b from-transparent via-white/5 to-transparent' : 'bg-gradient-to-b from-transparent via-white/30 to-transparent'
        }`}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className={`text-sm font-medium tracking-[0.3em] uppercase ${isDark ? 'text-cyan-400' : 'text-[#8B7355]'}`}>Platform Capabilities</span>
              <h2 className={`text-4xl font-light mt-4 ${isDark ? 'text-white' : 'text-[#3D3124]'}`}>
                Your Sales Command Center
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: Search,
                  title: 'Deep Company Research',
                  desc: 'Comprehensive analysis of any company from their website, news, financials, and market position.',
                  color: 'cyan',
                },
                {
                  icon: Users,
                  title: 'Competitor Intelligence',
                  desc: 'Identify and analyze competitors, understand their positioning, and find your competitive edge.',
                  color: 'purple',
                },
                {
                  icon: Bell,
                  title: 'Real-Time Monitors',
                  desc: 'Set up alerts for company news, leadership changes, funding rounds, and market movements.',
                  color: 'emerald',
                },
                {
                  icon: FileText,
                  title: 'Exportable Reports',
                  desc: 'Generate professional reports for internal teams or client presentations in multiple formats.',
                  color: 'pink',
                },
                {
                  icon: Brain,
                  title: 'AI Chat Assistant',
                  desc: 'Ask follow-up questions about any analysis and get instant, contextual answers.',
                  color: 'cyan',
                },
                {
                  icon: Building2,
                  title: 'Company Database',
                  desc: 'Build your own database of researched companies with all insights saved and searchable.',
                  color: 'purple',
                },
              ].map((feature, i) => (
                <div key={i} className={`group relative overflow-hidden rounded-3xl backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 ${
                  isDark
                    ? 'bg-white/5 border border-white/10 hover:border-white/20'
                    : 'bg-white/60 border border-white/50'
                }`}>
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                    isDark
                      ? feature.color === 'cyan' ? 'bg-gradient-to-br from-cyan-500/10 to-transparent'
                        : feature.color === 'purple' ? 'bg-gradient-to-br from-purple-500/10 to-transparent'
                        : feature.color === 'emerald' ? 'bg-gradient-to-br from-emerald-500/10 to-transparent'
                        : 'bg-gradient-to-br from-pink-500/10 to-transparent'
                      : 'bg-gradient-to-br from-[#5C4A2A]/5 to-transparent'
                  }`} />
                  <div className="relative">
                    <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl transition-colors duration-500 ${
                      isDark
                        ? feature.color === 'cyan' ? 'bg-cyan-500/20 border border-cyan-500/30'
                          : feature.color === 'purple' ? 'bg-purple-500/20 border border-purple-500/30'
                          : feature.color === 'emerald' ? 'bg-emerald-500/20 border border-emerald-500/30'
                          : 'bg-pink-500/20 border border-pink-500/30'
                        : 'bg-gradient-to-br from-[#5C4A2A]/15 to-[#8B7355]/10 border border-[#5C4A2A]/10'
                    }`}>
                      <feature.icon className={`h-7 w-7 ${
                        isDark
                          ? feature.color === 'cyan' ? 'text-cyan-400'
                            : feature.color === 'purple' ? 'text-purple-400'
                            : feature.color === 'emerald' ? 'text-emerald-400'
                            : 'text-pink-400'
                          : 'text-[#5C4A2A]'
                      }`} />
                    </div>
                    <h3 className={`text-xl font-medium mb-3 ${isDark ? 'text-white' : 'text-[#3D3124]'}`}>{feature.title}</h3>
                    <p className={`font-light ${isDark ? 'text-white/50' : 'text-[#5C4A2A]/70'}`}>{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AI Academy Section */}
        <section className="py-24 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-0 rounded-3xl overflow-hidden shadow-2xl">
              <div className={`p-10 md:p-14 transition-colors duration-500 ${
                isDark
                  ? 'bg-gradient-to-br from-[#111] via-[#0a0a0a] to-[#111]'
                  : 'bg-gradient-to-br from-[#5C4A2A] to-[#3D3124]'
              }`}>
                <div className="flex items-center gap-3 mb-6">
                  <GraduationCap className={`h-8 w-8 ${isDark ? 'text-purple-400' : 'text-[#d4c4a8]'}`} />
                  <span className={`text-sm font-medium tracking-widest uppercase ${isDark ? 'text-purple-400' : 'text-[#d4c4a8]'}`}>Coming Soon</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-light text-[#F5EFE4] mb-4">
                  AI Academy
                </h2>
                <p className={`font-light text-lg mb-8 ${isDark ? 'text-white/60' : 'text-[#d4c4a8]/80'}`}>
                  Comprehensive training to transform your team into AI-powered sales experts. Master the tools that are reshaping the industry.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: Brain, label: 'AI Ecosystems', color: 'cyan' },
                    { icon: BookOpen, label: 'Skill Courses', color: 'emerald' },
                    { icon: Award, label: 'Certifications', color: 'purple' },
                    { icon: Layers, label: 'Learning Paths', color: 'pink' },
                  ].map((item, i) => (
                    <div key={i} className={`flex items-center gap-3 p-3 rounded-xl transition-colors duration-500 ${
                      isDark ? 'bg-white/5 border border-white/10' : 'bg-white/10'
                    }`}>
                      <item.icon className={`h-5 w-5 ${
                        isDark
                          ? item.color === 'cyan' ? 'text-cyan-400' : item.color === 'emerald' ? 'text-emerald-400' : item.color === 'purple' ? 'text-purple-400' : 'text-pink-400'
                          : 'text-[#d4c4a8]'
                      }`} />
                      <span className={`text-sm ${isDark ? 'text-white/70' : 'text-[#F5EFE4]/80'}`}>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className={`backdrop-blur-xl p-10 md:p-14 flex flex-col justify-center transition-colors duration-500 ${
                isDark
                  ? 'bg-gradient-to-br from-purple-500/10 via-cyan-500/5 to-emerald-500/10'
                  : 'bg-gradient-to-br from-white/80 to-white/60'
              }`}>
                <h3 className={`text-2xl font-light mb-6 ${isDark ? 'text-white' : 'text-[#3D3124]'}`}>What You'll Learn</h3>
                <ul className="space-y-4">
                  {[
                    'Master prompting techniques for sales research',
                    'Understand AI capabilities and limitations',
                    'Build AI-augmented sales workflows',
                    'Stay ahead of AI trends in B2B sales',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className={`h-5 w-5 flex-shrink-0 mt-0.5 ${isDark ? 'text-emerald-400' : 'text-[#5C4A2A]'}`} />
                      <span className={`font-light ${isDark ? 'text-white/70' : 'text-[#5C4A2A]/80'}`}>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/dashboard/academy" className="mt-8">
                  <Button variant="outline" className={`rounded-xl transition-colors duration-500 ${
                    isDark
                      ? 'border-purple-500/30 text-purple-400 hover:bg-purple-500/10'
                      : 'border-[#5C4A2A]/20 text-[#5C4A2A] hover:bg-[#5C4A2A]/5'
                  }`}>
                    Explore Academy
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative py-32 px-4 overflow-hidden">
          <div className={`absolute inset-0 transition-colors duration-500 ${
            isDark
              ? 'bg-gradient-to-br from-[#0a0a0a] via-[#111] to-[#0a0a0a]'
              : 'bg-gradient-to-br from-[#3D3124] via-[#5C4A2A] to-[#3D3124]'
          }`} />
          <div className={`absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full blur-3xl ${
            isDark ? 'bg-gradient-radial from-cyan-500/20 to-transparent' : 'bg-gradient-radial from-[#8B7355]/30 to-transparent'
          }`} />
          <div className={`absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full blur-3xl ${
            isDark ? 'bg-gradient-radial from-purple-500/15 to-transparent' : ''
          }`} />

          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-light text-[#F5EFE4] mb-6">
              Ready to Transform Your Sales Process?
            </h2>
            <p className={`text-xl font-light mb-12 max-w-2xl mx-auto ${isDark ? 'text-white/60' : 'text-[#d4c4a8]/80'}`}>
              Join the teams already using Aurora to win more deals with verified intelligence.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/dashboard/new">
                <Button size="lg" className={`px-10 py-7 text-lg rounded-2xl shadow-2xl transition-all duration-300 ${
                  isDark
                    ? 'bg-white/10 text-white border border-white/20 hover:bg-white/15 hover:border-cyan-500/40 hover:shadow-lg hover:shadow-cyan-500/20 backdrop-blur-sm'
                    : 'bg-[#F5EFE4] text-[#3D3124] hover:bg-white'
                }`}>
                  Start Your First Analysis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/pricing">
                <Button size="lg" variant="outline" className={`px-10 py-7 text-lg rounded-2xl transition-colors duration-500 ${
                  isDark
                    ? 'bg-white/10 text-white border border-white/20 hover:bg-white/15 hover:border-cyan-500/40 hover:shadow-lg hover:shadow-cyan-500/20 backdrop-blur-sm'
                    : 'border-[#F5EFE4]/30 text-[#F5EFE4] hover:bg-white/10'
                }`}>
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className={`relative z-10 border-t backdrop-blur-xl transition-colors duration-500 ${
        isDark
          ? 'border-white/10 bg-black/20'
          : 'border-[#5C4A2A]/10 bg-white/20'
      }`}>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <img
              src={isDark ? "/Aurora_logo_dark_v2.png" : "/Aurora_logo_v3.png"}
              alt="Aurora"
              className="h-8 w-auto opacity-60"
            />
            <p className={`text-sm font-light ${isDark ? 'text-white/30' : 'text-[#5C4A2A]/50'}`}>
              © 2025 Aurora. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
