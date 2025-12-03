import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SiteNav } from '@/components/ui/site-nav';
import { useTheme } from '@/lib/theme-context';
import {
  CheckCircle2,
  XCircle,
  Target,
  Shield,
  Clock,
  DollarSign,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  FileText,
  MessageSquare,
  Crosshair,
  Brain,
  Eye
} from 'lucide-react';

export default function WhyAuroraPage() {
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

      <SiteNav currentPage="why-aurora" />

      <main className="relative z-10">
        {/* Hero - Full width dramatic statement */}
        <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
          <div className={`absolute inset-0 transition-colors duration-500 ${
            isDark
              ? 'bg-gradient-to-b from-[#0a0a0a] via-[#111] to-[#0a0a0a]'
              : 'bg-gradient-to-b from-[#3D3124] via-[#5C4A2A] to-[#ebe3d3]'
          }`} />
          <div className={`absolute top-0 right-0 w-[800px] h-[800px] rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 transition-colors duration-500 ${
            isDark
              ? 'bg-gradient-radial from-cyan-500/20 to-transparent'
              : 'bg-gradient-radial from-[#8B7355]/30 to-transparent'
          }`} />
          <div className={`absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 transition-colors duration-500 ${
            isDark
              ? 'bg-gradient-radial from-purple-500/15 to-transparent'
              : 'bg-gradient-radial from-[#d4c4a8]/20 to-transparent'
          }`} />

          <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm mb-8 transition-colors duration-500 ${
              isDark
                ? 'bg-white/5 border border-cyan-500/30'
                : 'bg-white/10 border border-white/20'
            }`}>
              <div className={`h-2 w-2 rounded-full animate-pulse ${isDark ? 'bg-cyan-400' : 'bg-[#d4c4a8]'}`} />
              <span className={`text-sm tracking-wide ${isDark ? 'text-cyan-400/80' : 'text-[#F5EFE4]/80'}`}>The Accuracy Crisis in AI</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-light text-[#F5EFE4] leading-tight mb-6">
              ChatGPT Guesses.
              <span className={`block font-normal bg-clip-text text-transparent ${
                isDark
                  ? 'bg-gradient-to-r from-cyan-400 via-emerald-400 to-purple-400'
                  : 'bg-gradient-to-r from-[#d4c4a8] via-[#F5EFE4] to-[#d4c4a8]'
              }`}>
                Aurora Knows.
              </span>
            </h1>

            <p className={`text-xl md:text-2xl font-light max-w-2xl mx-auto mb-10 ${
              isDark ? 'text-white/60' : 'text-[#d4c4a8]/80'
            }`}>
              And what Aurora knows helps you win more deals, faster.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-24">
              <Link to="/dashboard/new">
                <Button size="lg" className={`px-8 py-6 text-lg rounded-2xl shadow-2xl transition-all duration-300 ${
                  isDark
                    ? 'bg-white/10 text-white border border-white/20 hover:bg-white/15 hover:border-cyan-500/40 hover:shadow-lg hover:shadow-cyan-500/20 backdrop-blur-sm hover:scale-105'
                    : 'bg-[#F5EFE4] text-[#3D3124] hover:bg-white'
                }`}>
                  Start Your First Analysis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <a href="#the-problem" className={`transition-colors flex items-center gap-2 ${
                isDark ? 'text-cyan-400/70 hover:text-cyan-400' : 'text-[#d4c4a8] hover:text-[#F5EFE4]'
              }`}>
                Learn why this matters
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
            <span className={`text-xs tracking-widest uppercase ${isDark ? 'text-cyan-400/40' : 'text-[#d4c4a8]/60'}`}>Scroll</span>
            <div className={`w-px h-8 bg-gradient-to-b ${isDark ? 'from-cyan-400/40' : 'from-[#d4c4a8]/60'} to-transparent`} />
          </div>
        </section>

        {/* The Problem - Large stat with context */}
        <section id="the-problem" className="py-24 px-4 scroll-mt-20">
          <div className="max-w-7xl mx-auto">
            {/* Giant stat */}
            <div className="text-center mb-16">
              <div className="inline-block">
                <span className={`text-[120px] md:text-[180px] font-extralight leading-none transition-colors duration-500 ${
                  isDark
                    ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-400 to-purple-400'
                    : 'text-[#3D3124]'
                }`}>
                  30-57%
                </span>
                <p className={`text-xl md:text-2xl font-light -mt-4 ${isDark ? 'text-white/50' : 'text-[#5C4A2A]/70'}`}>
                  AI accuracy on open-web tasks
                </p>
              </div>
            </div>

            {/* Context cards - asymmetric layout */}
            <div className="grid md:grid-cols-12 gap-6">
              {/* Main explanation - spans 7 columns */}
              <div className={`md:col-span-7 relative overflow-hidden rounded-3xl backdrop-blur-xl shadow-xl p-8 md:p-10 transition-colors duration-500 ${
                isDark
                  ? 'bg-white/5 border border-white/10'
                  : 'bg-gradient-to-br from-white/70 to-white/40 border border-white/50'
              }`}>
                <div className={`absolute -top-20 -right-20 w-48 h-48 rounded-full blur-2xl ${
                  isDark ? 'bg-gradient-to-br from-cyan-500/20 to-transparent' : 'bg-gradient-to-br from-[#5C4A2A]/10 to-transparent'
                }`} />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`h-3 w-3 rounded-full ${isDark ? 'bg-cyan-400' : 'bg-[#5C4A2A]'}`} />
                    <span className={`text-sm font-medium tracking-widest uppercase ${isDark ? 'text-cyan-400' : 'text-[#5C4A2A]'}`}>Research Finding</span>
                  </div>
                  <p className={`text-lg md:text-xl leading-relaxed font-light ${isDark ? 'text-white/80' : 'text-[#3D3124]'}`}>
                    According to a <span className="font-medium">Tow Center & Columbia University study</span>, eight major AI search engines — including ChatGPT Search, Perplexity, Gemini, Grok-2/3, and Copilot — failed to retrieve correct information in <span className={`font-medium ${isDark ? 'text-cyan-400' : 'text-[#5C4A2A]'}`}>over 60% of tests</span>.
                  </p>
                </div>
              </div>

              {/* Failure modes - spans 5 columns, stacked */}
              <div className="md:col-span-5 flex flex-col gap-4">
                {[
                  { icon: Brain, title: 'Hallucinations', desc: 'AI confidently invents facts that don\'t exist', color: 'cyan' },
                  { icon: FileText, title: 'Wrong Citations', desc: 'Sources that say something entirely different', color: 'purple' },
                  { icon: Eye, title: 'Fabricated URLs', desc: 'Links to pages that were never real', color: 'emerald' },
                ].map((item, i) => (
                  <div key={i} className={`flex items-start gap-4 p-5 rounded-2xl backdrop-blur-sm transition-colors duration-500 ${
                    isDark
                      ? 'bg-white/5 border border-white/10'
                      : 'bg-[#5C4A2A]/5 border border-[#5C4A2A]/10'
                  }`}>
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl flex-shrink-0 transition-colors duration-500 ${
                      isDark
                        ? item.color === 'cyan' ? 'bg-cyan-500/20' : item.color === 'purple' ? 'bg-purple-500/20' : 'bg-emerald-500/20'
                        : 'bg-[#5C4A2A]/10'
                    }`}>
                      <item.icon className={`h-5 w-5 ${
                        isDark
                          ? item.color === 'cyan' ? 'text-cyan-400' : item.color === 'purple' ? 'text-purple-400' : 'text-emerald-400'
                          : 'text-[#5C4A2A]'
                      }`} />
                    </div>
                    <div>
                      <h3 className={`font-medium ${isDark ? 'text-white' : 'text-[#3D3124]'}`}>{item.title}</h3>
                      <p className={`text-sm font-light ${isDark ? 'text-white/50' : 'text-[#5C4A2A]/70'}`}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom line statement */}
            <div className="mt-12 text-center">
              <div className={`inline-block px-8 py-5 rounded-2xl transition-colors duration-500 ${
                isDark
                  ? 'bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-emerald-500/20 border border-white/10'
                  : 'bg-[#3D3124]'
              }`}>
                <p className={`text-lg md:text-xl font-light ${isDark ? 'text-white' : 'text-[#F5EFE4]'}`}>
                  AI is <span className={`font-medium ${isDark ? 'text-cyan-400' : 'text-[#d4c4a8]'}`}>confidently wrong</span> more often than it is right.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* The Solution - Split screen */}
        <section className={`py-24 px-4 transition-colors duration-500 ${
          isDark ? 'bg-gradient-to-b from-transparent via-white/5 to-transparent' : 'bg-gradient-to-b from-transparent via-white/30 to-transparent'
        }`}>
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-0 rounded-3xl overflow-hidden shadow-2xl">
              {/* Left - Dark side (failure) */}
              <div className={`p-10 md:p-14 flex flex-col justify-center transition-colors duration-500 ${
                isDark ? 'bg-[#111]' : 'bg-[#3D3124]'
              }`}>
                <div className="flex items-center gap-2 mb-6">
                  <XCircle className={`h-5 w-5 ${isDark ? 'text-red-400/60' : 'text-[#d4c4a8]/60'}`} />
                  <span className={`text-sm font-medium tracking-widest uppercase ${isDark ? 'text-red-400/60' : 'text-[#d4c4a8]/60'}`}>Other AI</span>
                </div>
                <h3 className="text-3xl md:text-4xl font-light text-[#F5EFE4] mb-6">
                  Guesses & Hopes
                </h3>
                <ul className="space-y-4">
                  {['Retrieves unverified data', 'Makes confident mistakes', 'No source validation', 'Unusable for real decisions'].map((item, i) => (
                    <li key={i} className={`flex items-center gap-3 ${isDark ? 'text-white/50' : 'text-[#d4c4a8]/80'}`}>
                      <div className={`h-1.5 w-1.5 rounded-full ${isDark ? 'bg-red-400/40' : 'bg-[#d4c4a8]/40'}`} />
                      <span className="font-light">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right - Light side (Aurora success) */}
              <div className={`p-10 md:p-14 flex flex-col justify-center transition-colors duration-500 ${
                isDark
                  ? 'bg-gradient-to-br from-cyan-500/10 via-emerald-500/10 to-purple-500/10'
                  : 'bg-gradient-to-br from-[#F5EFE4] to-white'
              }`}>
                <div className="flex items-center gap-2 mb-6">
                  <CheckCircle2 className={`h-5 w-5 ${isDark ? 'text-cyan-400' : 'text-[#5C4A2A]'}`} />
                  <span className={`text-sm font-medium tracking-widest uppercase ${isDark ? 'text-cyan-400' : 'text-[#5C4A2A]'}`}>Aurora</span>
                </div>
                <h3 className={`text-3xl md:text-4xl font-light mb-6 ${isDark ? 'text-white' : 'text-[#3D3124]'}`}>
                  Verifies & Knows
                </h3>
                <ul className="space-y-4">
                  {['Multi-layer verification framework', '~99% accuracy on web content', 'Every claim is traceable', 'Decision-grade intelligence'].map((item, i) => (
                    <li key={i} className={`flex items-center gap-3 ${isDark ? 'text-white/80' : 'text-[#5C4A2A]'}`}>
                      <CheckCircle2 className={`h-4 w-4 flex-shrink-0 ${isDark ? 'text-emerald-400' : 'text-[#8B7355]'}`} />
                      <span className="font-light">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Aurora badge */}
            <div className="flex justify-center -mt-6 relative z-10">
              <div className={`px-8 py-4 rounded-full shadow-xl transition-colors duration-500 ${
                isDark
                  ? 'bg-white/10 border border-white/20 backdrop-blur-sm shadow-cyan-500/20'
                  : 'bg-gradient-to-r from-[#5C4A2A] to-[#8B7355]'
              }`}>
                <span className={`text-lg font-medium ${isDark ? 'text-white' : 'text-white'}`}>~99% Verified Intelligence</span>
              </div>
            </div>
          </div>
        </section>

        {/* What You Get - Bento grid */}
        <section className="py-24 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className={`text-sm font-medium tracking-[0.3em] uppercase ${isDark ? 'text-cyan-400' : 'text-[#8B7355]'}`}>Monetizable Intelligence</span>
              <h2 className={`text-4xl md:text-5xl font-light mt-4 ${isDark ? 'text-white' : 'text-[#3D3124]'}`}>
                Not Just Insight.<br />
                <span className={`font-normal ${isDark ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400' : ''}`}>Revenue.</span>
              </h2>
            </div>

            {/* Bento grid */}
            <div className="grid md:grid-cols-3 gap-4">
              {/* Large feature card */}
              <div className={`md:col-span-2 md:row-span-2 relative overflow-hidden rounded-3xl p-8 md:p-12 flex flex-col justify-between min-h-[400px] transition-colors duration-500 ${
                isDark
                  ? 'bg-gradient-to-br from-[#111] via-[#0a0a0a] to-[#111] border border-white/10'
                  : 'bg-gradient-to-br from-[#5C4A2A] to-[#3D3124]'
              }`}>
                <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl ${
                  isDark ? 'bg-gradient-radial from-cyan-500/20 to-transparent' : 'bg-gradient-radial from-[#8B7355]/40 to-transparent'
                }`} />
                <div className="relative">
                  <Target className={`h-10 w-10 mb-6 ${isDark ? 'text-cyan-400' : 'text-[#d4c4a8]'}`} />
                  <h3 className="text-2xl md:text-3xl font-light text-[#F5EFE4] mb-4">Opportunity Maps</h3>
                  <p className={`font-light text-lg max-w-md ${isDark ? 'text-white/60' : 'text-[#d4c4a8]/80'}`}>
                    See exactly where to focus your energy. Identify the highest-value opportunities before your competition does.
                  </p>
                </div>
                <div className="relative mt-8 grid grid-cols-3 gap-4">
                  {['Attack Vectors', 'Risk Areas', 'Win Angles'].map((label, i) => (
                    <div key={i} className={`text-center p-4 rounded-xl backdrop-blur-sm transition-colors duration-500 ${
                      isDark ? 'bg-white/5 border border-white/10' : 'bg-white/10'
                    }`}>
                      <span className={`text-sm font-light ${isDark ? 'text-cyan-400/70' : 'text-[#d4c4a8]/70'}`}>{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Smaller cards */}
              <div className={`relative overflow-hidden rounded-3xl backdrop-blur-xl p-6 flex flex-col transition-colors duration-500 ${
                isDark
                  ? 'bg-white/5 border border-white/10'
                  : 'bg-gradient-to-br from-white/70 to-white/40 border border-white/50'
              }`}>
                <BarChart3 className={`h-8 w-8 mb-4 ${isDark ? 'text-purple-400' : 'text-[#5C4A2A]'}`} />
                <h3 className={`text-xl font-medium mb-2 ${isDark ? 'text-white' : 'text-[#3D3124]'}`}>Competitive Positioning</h3>
                <p className={`font-light text-sm flex-grow ${isDark ? 'text-white/50' : 'text-[#5C4A2A]/70'}`}>Know your advantages and how to leverage them against each competitor.</p>
              </div>

              <div className={`relative overflow-hidden rounded-3xl backdrop-blur-xl p-6 flex flex-col transition-colors duration-500 ${
                isDark
                  ? 'bg-white/5 border border-white/10'
                  : 'bg-gradient-to-br from-white/70 to-white/40 border border-white/50'
              }`}>
                <MessageSquare className={`h-8 w-8 mb-4 ${isDark ? 'text-emerald-400' : 'text-[#5C4A2A]'}`} />
                <h3 className={`text-xl font-medium mb-2 ${isDark ? 'text-white' : 'text-[#3D3124]'}`}>Prospect-Specific Hooks</h3>
                <p className={`font-light text-sm flex-grow ${isDark ? 'text-white/50' : 'text-[#5C4A2A]/70'}`}>Personalized openers based on real company signals, not generic templates.</p>
              </div>

              {/* Wide card at bottom */}
              <div className={`md:col-span-3 relative overflow-hidden rounded-3xl p-8 flex items-center gap-8 transition-colors duration-500 ${
                isDark
                  ? 'bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-emerald-500/10 border border-white/10'
                  : 'bg-gradient-to-r from-[#F5EFE4] via-white to-[#F5EFE4] border border-[#5C4A2A]/10'
              }`}>
                <div className={`flex h-16 w-16 items-center justify-center rounded-2xl flex-shrink-0 transition-colors duration-500 ${
                  isDark ? 'bg-pink-500/20' : 'bg-[#5C4A2A]/10'
                }`}>
                  <Shield className={`h-8 w-8 ${isDark ? 'text-pink-400' : 'text-[#5C4A2A]'}`} />
                </div>
                <div className="flex-grow">
                  <h3 className={`text-xl font-medium mb-1 ${isDark ? 'text-white' : 'text-[#3D3124]'}`}>Objection Handlers</h3>
                  <p className={`font-light ${isDark ? 'text-white/50' : 'text-[#5C4A2A]/70'}`}>Pre-built responses tied to real buyer signals — know what they'll ask before they ask it.</p>
                </div>
                <ArrowRight className={`h-6 w-6 flex-shrink-0 ${isDark ? 'text-cyan-400' : 'text-[#5C4A2A]'}`} />
              </div>
            </div>
          </div>
        </section>

        {/* For Sellers - Timeline/journey style */}
        <section className={`py-24 px-4 transition-colors duration-500 ${
          isDark ? 'bg-gradient-to-b from-transparent via-white/5 to-transparent' : 'bg-gradient-to-b from-transparent via-[#3D3124]/5 to-transparent'
        }`}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <span className={`text-sm font-medium tracking-[0.3em] uppercase ${isDark ? 'text-emerald-400' : 'text-[#8B7355]'}`}>Built for Sales Teams</span>
              <h2 className={`text-4xl md:text-5xl font-light mt-4 ${isDark ? 'text-white' : 'text-[#3D3124]'}`}>
                Your Exact Playbook.<br />
                <span className={`font-normal ${isDark ? 'text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400' : ''}`}>Every Prospect.</span>
              </h2>
            </div>

            {/* Journey steps */}
            <div className="relative">
              {/* Vertical line */}
              <div className={`absolute left-8 md:left-1/2 top-0 bottom-0 w-px transition-colors duration-500 ${
                isDark
                  ? 'bg-gradient-to-b from-cyan-500/20 via-emerald-500/40 to-purple-500/20'
                  : 'bg-gradient-to-b from-[#5C4A2A]/20 via-[#5C4A2A]/40 to-[#5C4A2A]/20'
              }`} />

              {[
                { icon: Crosshair, title: 'Where to Attack', desc: 'Pinpoint the exact entry points and leverage points for each prospect', side: 'left', color: 'cyan' },
                { icon: Clock, title: 'Where Not to Waste Time', desc: 'Identify dead-ends before you invest hours chasing them', side: 'right', color: 'purple' },
                { icon: Target, title: 'Your Win Angle', desc: 'The specific positioning that will resonate with this buyer', side: 'left', color: 'emerald' },
                { icon: AlertTriangle, title: 'Your Risk', desc: 'Know the objections and competitive threats before they surface', side: 'right', color: 'pink' },
                { icon: ArrowRight, title: 'Your Next Move', desc: 'Clear, actionable next steps to advance the deal', side: 'left', color: 'cyan' },
              ].map((item, i) => (
                <div key={i} className={`relative flex items-center gap-6 mb-12 ${item.side === 'right' ? 'md:flex-row-reverse' : ''}`}>
                  {/* Icon */}
                  <div className={`absolute left-8 md:left-1/2 -translate-x-1/2 flex h-12 w-12 items-center justify-center rounded-full shadow-lg z-10 transition-colors duration-500 ${
                    isDark
                      ? item.color === 'cyan' ? 'bg-gradient-to-br from-cyan-500 to-cyan-600 shadow-cyan-500/30'
                        : item.color === 'purple' ? 'bg-gradient-to-br from-purple-500 to-purple-600 shadow-purple-500/30'
                        : item.color === 'emerald' ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-emerald-500/30'
                        : 'bg-gradient-to-br from-pink-500 to-pink-600 shadow-pink-500/30'
                      : 'bg-gradient-to-br from-[#5C4A2A] to-[#8B7355]'
                  }`}>
                    <item.icon className={`h-5 w-5 ${isDark ? 'text-black' : 'text-white'}`} />
                  </div>

                  {/* Content */}
                  <div className={`ml-24 md:ml-0 md:w-5/12 ${item.side === 'right' ? 'md:mr-auto md:pr-16 md:text-right' : 'md:ml-auto md:pl-16'}`}>
                    <h3 className={`text-xl font-medium mb-2 ${isDark ? 'text-white' : 'text-[#3D3124]'}`}>{item.title}</h3>
                    <p className={`font-light ${isDark ? 'text-white/50' : 'text-[#5C4A2A]/70'}`}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison - Clean table */}
        <section className="py-24 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <span className={`text-sm font-medium tracking-[0.3em] uppercase ${isDark ? 'text-purple-400' : 'text-[#8B7355]'}`}>The Comparison</span>
              <h2 className={`text-4xl md:text-5xl font-light mt-4 ${isDark ? 'text-white' : 'text-[#3D3124]'}`}>
                Faster Than Consultants.<br />
                <span className={`font-normal ${isDark ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400' : ''}`}>More Accurate Than AI.</span>
              </h2>
            </div>

            <div className={`overflow-hidden rounded-3xl shadow-xl transition-colors duration-500 ${
              isDark ? 'border border-white/10' : 'border border-[#5C4A2A]/10'
            }`}>
              {[
                { problem: 'AI tools hallucinate and guess', solution: '99% verified intelligence', icon: Brain },
                { problem: 'Analysts are slow & generic', solution: 'Instant, deal-ready insights', icon: Clock },
                { problem: 'Consultants cost $50k–$500k', solution: 'Aurora delivers in hours', icon: DollarSign },
                { problem: 'ZoomInfo is stale & structured', solution: 'Aurora reads the live web', icon: Brain },
              ].map((row, i) => (
                <div key={i} className={`grid md:grid-cols-2 transition-colors duration-500 ${
                  i !== 3
                    ? isDark ? 'border-b border-white/10' : 'border-b border-[#5C4A2A]/10'
                    : ''
                }`}>
                  <div className={`p-6 md:p-8 flex items-center gap-4 transition-colors duration-500 ${
                    isDark
                      ? i % 2 === 0 ? 'bg-red-500/5' : 'bg-white/5'
                      : i % 2 === 0 ? 'bg-[#3D3124]/5' : 'bg-white/40'
                  }`}>
                    <XCircle className={`h-5 w-5 flex-shrink-0 ${isDark ? 'text-red-400/50' : 'text-[#5C4A2A]/40'}`} />
                    <span className={isDark ? 'text-white/50' : 'text-[#5C4A2A]/70'}>{row.problem}</span>
                  </div>
                  <div className={`p-6 md:p-8 flex items-center gap-4 transition-colors duration-500 ${
                    isDark
                      ? i % 2 === 0 ? 'bg-emerald-500/10' : 'bg-cyan-500/10'
                      : `bg-gradient-to-r ${i % 2 === 0 ? 'from-[#F5EFE4]/80 to-white' : 'from-white to-[#F5EFE4]/80'}`
                  }`}>
                    <CheckCircle2 className={`h-5 w-5 flex-shrink-0 ${isDark ? 'text-emerald-400' : 'text-[#5C4A2A]'}`} />
                    <span className={`font-medium ${isDark ? 'text-white' : 'text-[#3D3124]'}`}>{row.solution}</span>
                  </div>
                </div>
              ))}
            </div>

            <p className={`text-center text-lg font-light mt-10 ${isDark ? 'text-white/50' : 'text-[#5C4A2A]/70'}`}>
              Aurora is the <span className={`font-medium ${isDark ? 'text-cyan-400' : 'text-[#5C4A2A]'}`}>only system</span> combining accuracy, context, reasoning, and revenue outcomes.
            </p>
          </div>
        </section>

        {/* Final CTA - Full width impact */}
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
            isDark ? 'bg-gradient-radial from-purple-500/15 to-transparent' : 'bg-gradient-radial from-[#d4c4a8]/20 to-transparent'
          }`} />

          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-light text-[#F5EFE4] mb-6">
              The Bottom Line
            </h2>
            <p className={`text-2xl md:text-3xl font-light mb-4 ${isDark ? 'text-white/60' : 'text-[#d4c4a8]'}`}>
              ChatGPT guesses. <span className={`font-medium ${isDark ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400' : 'text-[#F5EFE4]'}`}>Aurora knows.</span>
            </p>
            <p className={`text-lg font-light mb-12 max-w-2xl mx-auto ${isDark ? 'text-white/40' : 'text-[#d4c4a8]/70'}`}>
              And what Aurora knows helps you win more deals, faster.
            </p>

            <Link to="/dashboard/new">
              <Button size="lg" className={`px-12 py-7 text-xl rounded-2xl shadow-2xl transition-all hover:scale-105 ${
                isDark
                  ? 'bg-white/10 text-white border border-white/20 hover:bg-white/15 hover:border-cyan-500/40 hover:shadow-lg hover:shadow-cyan-500/20 backdrop-blur-sm'
                  : 'bg-[#F5EFE4] text-[#3D3124] hover:bg-white'
              }`}>
                Start Your First Analysis
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
            </Link>
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
