import { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, BarChart3, Zap, Building2, Bell, FileText, Sparkles, GraduationCap, Award, BookOpen, Brain } from 'lucide-react';
import { AuroraCoreDiagram } from '@/components/ui/aurora-core-diagram';
import { SiteNav } from '@/components/ui/site-nav';
import { useTheme } from '@/lib/theme-context';

// Lazy load Three.js component for faster initial page load
const AetherSphere = lazy(() =>
  import('@/components/ui/aether-sphere').then((mod) => ({ default: mod.AetherSphere }))
);

function AetherSphereLoader() {
  return (
    <div className="w-[380px] h-[380px] flex items-center justify-center">
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#5C4A2A]/20 to-[#8B7355]/10 animate-pulse" />
    </div>
  );
}

export default function HomePage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-500 ${
      isDark ? 'bg-[#0a0a0a]' : 'bg-[#ebe3d3]'
    }`}>
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
          <div className="absolute top-1/4 left-1/3 w-[400px] h-[400px] bg-gradient-radial from-[#d4c4a8]/30 via-transparent to-transparent rounded-full blur-3xl animate-float-slower" />
        </div>
      )}

      {/* Grid overlay */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage: isDark
            ? `linear-gradient(to right, rgba(0,255,255,0.3) 1px, transparent 1px),
               linear-gradient(to bottom, rgba(0,255,255,0.3) 1px, transparent 1px)`
            : `linear-gradient(to right, #5C4A2A 1px, transparent 1px),
               linear-gradient(to bottom, #5C4A2A 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Noise texture */}
      <div
        className={`pointer-events-none fixed inset-0 opacity-[0.025] ${isDark ? 'mix-blend-overlay' : 'mix-blend-multiply'}`}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Navigation */}
      <SiteNav currentPage="home" />

      {/* Hero Section */}
      <main className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Hero Card with Glassmorphism */}
          <div className={`relative overflow-hidden rounded-3xl p-12 pb-14 backdrop-blur-2xl border shadow-2xl mb-16 transition-all duration-500 ${
            isDark
              ? 'bg-gradient-to-br from-white/5 via-white/[0.02] to-transparent border-white/10 shadow-cyan-500/10'
              : 'bg-gradient-to-br from-white/70 via-white/50 to-white/30 border-white/40 holographic-border animate-glow-pulse'
          }`}>
            {/* Decorative gradient orbs */}
            <div className={`absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 ${
              isDark
                ? 'bg-gradient-to-br from-cyan-500/20 to-transparent'
                : 'bg-gradient-to-br from-[#d4c4a8]/40 to-transparent'
            }`} />
            <div className={`absolute bottom-0 left-1/4 w-64 h-64 rounded-full blur-2xl translate-y-1/2 ${
              isDark
                ? 'bg-gradient-to-tr from-purple-500/15 to-transparent'
                : 'bg-gradient-to-tr from-[#c9b896]/30 to-transparent'
            }`} />

            <div className="relative">
              {/* Tagline */}
              <div className="flex justify-center mb-4">
                <div className="flex items-center gap-3">
                  <div className={`h-2 w-2 rounded-full animate-pulse ${
                    isDark
                      ? 'bg-gradient-to-r from-cyan-400 to-emerald-400'
                      : 'bg-gradient-to-r from-[#8B7355] to-[#5C4A2A]'
                  }`} />
                  <span className={`text-sm font-medium tracking-[0.3em] uppercase ${
                    isDark ? 'text-cyan-400' : 'text-[#8B7355]'
                  }`}>
                    The Dawn of Sales Intelligence
                  </span>
                  <div className={`h-2 w-2 rounded-full animate-pulse ${
                    isDark
                      ? 'bg-gradient-to-r from-emerald-400 to-purple-400'
                      : 'bg-gradient-to-r from-[#5C4A2A] to-[#8B7355]'
                  }`} />
                </div>
              </div>

              {/* Aether Sphere - The Brain of Aurora (Centerpiece) */}
              <div className="flex justify-center">
                <Suspense fallback={<AetherSphereLoader />}>
                  <AetherSphere size={380} />
                </Suspense>
              </div>

              {/* Main Headline */}
              <h1 className={`text-4xl font-light tracking-tight sm:text-5xl lg:text-6xl leading-tight -mt-6 transition-colors duration-500 ${
                isDark ? 'text-white' : 'text-[#3D3124]'
              }`}>
                A New Day for
                <span className={`block font-normal bg-clip-text text-transparent mt-1 ${
                  isDark
                    ? 'bg-gradient-to-r from-cyan-400 via-emerald-400 to-purple-400'
                    : 'bg-gradient-to-r from-[#5C4A2A] via-[#8B7355] to-[#5C4A2A]'
                }`}>
                  Every Conversation
                </span>
              </h1>

              {/* Description */}
              <p className={`mx-auto mt-6 max-w-2xl text-base leading-relaxed font-light transition-colors duration-500 ${
                isDark ? 'text-white/60' : 'text-[#5C4A2A]/70'
              }`}>
                Like the first light of dawn reveals what was hidden in darkness, Aurora
                illuminates the intelligence you need to transform every sales conversation.
              </p>

              {/* CTA Buttons */}
              <div className="mt-8 flex items-center justify-center gap-4">
                <Link to="/dashboard/new">
                  <Button
                    size="lg"
                    className={`px-8 py-5 text-base tracking-wide font-medium shadow-lg transition-all hover:scale-[1.02] rounded-2xl ${
                      isDark
                        ? 'bg-white/10 text-white border border-white/20 hover:bg-white/15 hover:border-cyan-500/40 hover:shadow-lg hover:shadow-cyan-500/20 backdrop-blur-sm'
                        : 'bg-gradient-to-r from-[#5C4A2A] to-[#8B7355] text-white hover:from-[#4a3a21] hover:to-[#7a6348] shadow-[#5C4A2A]/20 hover:shadow-xl hover:shadow-[#5C4A2A]/30'
                    }`}
                  >
                    Begin Your First Dawn
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button
                    size="lg"
                    variant="outline"
                    className={`px-8 py-5 text-base tracking-wide font-medium rounded-2xl backdrop-blur-sm transition-colors duration-300 ${
                      isDark
                        ? 'border-white/20 text-white hover:bg-white/10 hover:border-white/30'
                        : 'border-[#5C4A2A]/20 text-[#5C4A2A] hover:bg-white/50 hover:border-[#5C4A2A]/30'
                    }`}
                  >
                    View Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Trust indicators */}
          <div className={`flex items-center justify-center gap-8 text-sm mb-24 flex-wrap ${
            isDark ? 'text-white/40' : 'text-[#5C4A2A]/60'
          }`}>
            {['Enterprise Grade', 'SOC 2 Compliant', 'GDPR Ready'].map((label) => (
              <div key={label} className={`flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm border transition-colors duration-300 ${
                isDark
                  ? 'bg-white/5 border-white/10'
                  : 'bg-white/40 border-white/50'
              }`}>
                <div className={`h-1.5 w-1.5 rounded-full ${
                  isDark
                    ? 'bg-gradient-to-r from-cyan-400 to-emerald-400'
                    : 'bg-gradient-to-r from-[#8B7355] to-[#5C4A2A]'
                }`} />
                <span className="tracking-wide font-light">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Brand Story Section */}
        <div className={`mb-24 relative overflow-hidden rounded-3xl backdrop-blur-2xl border shadow-xl p-12 transition-all duration-500 ${
          isDark
            ? 'bg-gradient-to-br from-white/5 via-white/[0.02] to-transparent border-white/10'
            : 'bg-gradient-to-br from-white/60 via-white/40 to-white/30 border-white/40 holographic-border'
        }`}>
          <div className={`absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl ${
            isDark ? 'bg-gradient-to-br from-cyan-500/15 to-transparent' : 'bg-gradient-to-br from-[#d4c4a8]/30 to-transparent'
          }`} />
          <div className={`absolute -bottom-20 -left-20 w-48 h-48 rounded-full blur-2xl ${
            isDark ? 'bg-gradient-to-tr from-purple-500/10 to-transparent' : 'bg-gradient-to-tr from-[#c9b896]/25 to-transparent'
          }`} />

          <div className="relative max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Sparkles className={`h-5 w-5 ${isDark ? 'text-cyan-400' : 'text-[#8B7355]'}`} />
              <span className={`text-sm font-medium tracking-[0.3em] uppercase ${
                isDark ? 'text-cyan-400' : 'text-[#8B7355]'
              }`}>
                Why Aurora
              </span>
              <Sparkles className={`h-5 w-5 ${isDark ? 'text-cyan-400' : 'text-[#8B7355]'}`} />
            </div>
            <h2 className={`text-3xl font-light tracking-wide mb-6 transition-colors duration-500 ${
              isDark ? 'text-white' : 'text-[#3D3124]'
            }`}>
              Named for the Dawn
            </h2>
            <p className={`text-lg leading-relaxed font-light mb-4 transition-colors duration-500 ${
              isDark ? 'text-white/60' : 'text-[#5C4A2A]/70'
            }`}>
              In ancient mythology, Aurora was the goddess who heralded each new day—bringing
              light where there was darkness, possibility where there was uncertainty.
            </p>
            <p className={`text-lg leading-relaxed font-light transition-colors duration-500 ${
              isDark ? 'text-white/60' : 'text-[#5C4A2A]/70'
            }`}>
              <span className={`font-medium ${isDark ? 'text-white' : 'text-[#5C4A2A]'}`}>Your Team Can't Afford Bad Conversations.</span> We use a proprietary multi-layer accuracy framework that allows our system to read and interpret web content at up to 99% reliability, dramatically higher than LLMs' typical 30–57% accuracy on open-web tasks.
            </p>
            <p className={`text-lg leading-relaxed font-light mt-4 transition-colors duration-500 ${
              isDark ? 'text-white/60' : 'text-[#5C4A2A]/70'
            }`}>
              For teams, that translates into faster qualification, smarter targeting, clearer competitive awareness, and real revenue lift. It's not just accurate intelligence. It's <span className={`font-medium ${isDark ? 'text-white' : 'text-[#5C4A2A]'}`}>"monetizable intelligence."</span>
            </p>
            <p className={`text-lg leading-relaxed font-light mt-4 transition-colors duration-500 ${
              isDark ? 'text-white/60' : 'text-[#5C4A2A]/70'
            }`}>
              This accuracy gap isn't just about cleaner summaries—it drives better decisions, faster execution, and ultimately revenue acceleration through sharper targeting and clearer competitive intelligence.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div id="features" className="scroll-mt-20">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className={`h-px w-12 bg-gradient-to-r from-transparent ${
                isDark ? 'to-cyan-400/40' : 'to-[#8B7355]/40'
              }`} />
              <span className={`text-sm font-medium tracking-[0.3em] uppercase ${
                isDark ? 'text-cyan-400' : 'text-[#8B7355]'
              }`}>
                Illuminate Your Path
              </span>
              <div className={`h-px w-12 bg-gradient-to-l from-transparent ${
                isDark ? 'to-cyan-400/40' : 'to-[#8B7355]/40'
              }`} />
            </div>
            <h2 className={`text-3xl font-light tracking-wide transition-colors duration-500 ${
              isDark ? 'text-white' : 'text-[#3D3124]'
            }`}>
              Intelligence That Reveals
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {[
              { icon: Search, title: 'Truth You Can Trust', desc: 'Our multi-layer verification system reaches 99% accuracy — far above LLMs\' 30–57% on open-web tasks. Every insight is sourced, cross-checked, and decision-ready.', accent: 'cyan' },
              { icon: BarChart3, title: 'Know Where the Money Is', desc: 'Get opportunity maps, win angles, risks, and the moves that actually generate revenue. Not just research. Revenue signals.', accent: 'emerald' },
              { icon: Zap, title: 'Outcomes, Not Just Research', desc: 'Talk tracks, objection handlers, competitive positioning, and recommended next steps — tailored to your exact prospect.', accent: 'purple' },
              { icon: Sparkles, title: 'Hours Instead of Months', desc: 'Aurora delivers what analysts, consultants, and research teams take weeks or months to produce. Run a full competitive breakdown and prospect analysis in under 1 day.', accent: 'pink' },
            ].map((item) => (
              <div key={item.title} className={`group relative overflow-hidden rounded-3xl backdrop-blur-2xl border shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] p-8 ${
                isDark
                  ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                  : 'bg-white/60 border-white/40 hover:bg-white/70 holographic-border'
              }`}>
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                  isDark
                    ? `bg-gradient-to-br from-${item.accent}-500/10 to-transparent`
                    : 'bg-gradient-to-br from-[#5C4A2A]/5 to-[#8B7355]/5'
                }`} />
                <div className="relative">
                  <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border group-hover:scale-110 transition-transform ${
                    isDark
                      ? `bg-gradient-to-br from-${item.accent}-500/20 to-${item.accent}-600/10 border-${item.accent}-500/30`
                      : 'bg-gradient-to-br from-[#5C4A2A]/15 to-[#8B7355]/10 border-[#5C4A2A]/10'
                  }`}>
                    <item.icon className={`h-7 w-7 ${
                      isDark
                        ? item.accent === 'cyan' ? 'text-cyan-400' :
                          item.accent === 'emerald' ? 'text-emerald-400' :
                          item.accent === 'purple' ? 'text-purple-400' : 'text-pink-400'
                        : 'text-[#5C4A2A]'
                    }`} />
                  </div>
                  <h3 className={`text-xl font-medium tracking-wide transition-colors ${
                    isDark
                      ? `text-white group-hover:text-${item.accent}-400`
                      : 'text-[#3D3124] group-hover:text-[#5C4A2A]'
                  }`}>{item.title}</h3>
                  <p className={`mt-3 leading-relaxed font-light transition-colors duration-500 ${
                    isDark ? 'text-white/60' : 'text-[#5C4A2A]/70'
                  }`}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className={`mt-24 relative overflow-hidden rounded-3xl backdrop-blur-2xl border shadow-xl p-12 transition-all duration-500 ${
          isDark
            ? 'bg-white/5 border-white/10'
            : 'bg-white/60 border-white/40 holographic-border'
        }`}>
          <div className={`absolute -top-20 -left-20 w-48 h-48 rounded-full blur-2xl ${
            isDark ? 'bg-gradient-to-br from-cyan-500/20 to-transparent' : 'bg-gradient-to-br from-[#d4c4a8]/30 to-transparent'
          }`} />
          <div className={`absolute -bottom-20 -right-20 w-48 h-48 rounded-full blur-2xl ${
            isDark ? 'bg-gradient-to-br from-purple-500/20 to-transparent' : 'bg-gradient-to-br from-[#c9b896]/30 to-transparent'
          }`} />

          <div className="relative grid grid-cols-3 gap-8">
            {[
              { value: '2.4M', label: 'Companies Illuminated' },
              { value: '47%', label: 'Higher Close Rate' },
              { value: '8 min', label: 'To First Light' },
            ].map((stat, i) => (
              <div key={stat.label} className={`text-center ${i === 1 ? (isDark ? 'border-x border-white/10' : 'border-x border-[#5C4A2A]/10') : ''}`}>
                <p className={`text-5xl font-light bg-clip-text text-transparent ${
                  isDark
                    ? 'bg-gradient-to-r from-cyan-400 via-emerald-400 to-purple-400'
                    : 'bg-gradient-to-r from-[#5C4A2A] to-[#8B7355]'
                }`}>{stat.value}</p>
                <p className={`mt-3 text-sm tracking-widest uppercase font-light ${
                  isDark ? 'text-white/40' : 'text-[#5C4A2A]/60'
                }`}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* AI Academy Section */}
        <div id="academy" className="mt-24 scroll-mt-20">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className={`h-px w-12 bg-gradient-to-r from-transparent ${
                isDark ? 'to-cyan-400/40' : 'to-[#8B7355]/40'
              }`} />
              <span className={`text-sm font-medium tracking-[0.3em] uppercase ${
                isDark ? 'text-cyan-400' : 'text-[#8B7355]'
              }`}>
                AI Academy
              </span>
              <div className={`h-px w-12 bg-gradient-to-l from-transparent ${
                isDark ? 'to-cyan-400/40' : 'to-[#8B7355]/40'
              }`} />
            </div>
            <h2 className={`text-3xl font-light tracking-wide transition-colors duration-500 ${
              isDark ? 'text-white' : 'text-[#3D3124]'
            }`}>
              Master the Future of Sales
            </h2>
            <p className={`mt-4 font-light max-w-2xl mx-auto transition-colors duration-500 ${
              isDark ? 'text-white/60' : 'text-[#5C4A2A]/70'
            }`}>
              Comprehensive AI training and certifications to transform your team into AI-powered sales experts
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Brain, title: 'AI Ecosystems', desc: 'Master Anthropic, OpenAI, Google AI & more', accent: 'cyan' },
              { icon: BookOpen, title: 'Skill Courses', desc: 'LLM fundamentals to advanced prompting', accent: 'emerald' },
              { icon: Award, title: 'Certifications', desc: 'Industry-recognized credentials', accent: 'purple' },
              { icon: GraduationCap, title: 'Learning Paths', desc: 'Structured progression tracks', accent: 'pink' },
            ].map((item) => (
              <div key={item.title} className={`group relative overflow-hidden rounded-2xl backdrop-blur-xl border shadow-lg hover:shadow-xl transition-all duration-300 p-6 ${
                isDark
                  ? 'bg-white/5 border-white/10 hover:bg-white/10'
                  : 'bg-white/50 border-white/40 hover:bg-white/60'
              }`}>
                <div className="flex items-center gap-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl border group-hover:scale-105 transition-transform ${
                    isDark
                      ? `bg-gradient-to-br from-${item.accent}-500/20 to-transparent border-${item.accent}-500/30`
                      : 'bg-gradient-to-br from-[#5C4A2A]/10 to-[#8B7355]/10 border-[#5C4A2A]/10'
                  }`}>
                    <item.icon className={`h-5 w-5 ${
                      isDark
                        ? item.accent === 'cyan' ? 'text-cyan-400' :
                          item.accent === 'emerald' ? 'text-emerald-400' :
                          item.accent === 'purple' ? 'text-purple-400' : 'text-pink-400'
                        : 'text-[#5C4A2A]'
                    }`} />
                  </div>
                  <div>
                    <h4 className={`font-medium tracking-wide transition-colors ${
                      isDark ? 'text-white group-hover:text-cyan-400' : 'text-[#3D3124] group-hover:text-[#5C4A2A]'
                    }`}>{item.title}</h4>
                    <p className={`text-sm font-light ${
                      isDark ? 'text-white/50' : 'text-[#5C4A2A]/60'
                    }`}>{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link to="/dashboard/academy">
              <Button
                variant="outline"
                className={`px-8 py-5 text-base tracking-wide font-medium rounded-2xl backdrop-blur-sm transition-colors duration-300 ${
                  isDark
                    ? 'border-white/20 text-white hover:bg-white/10 hover:border-white/30'
                    : 'border-[#5C4A2A]/20 text-[#5C4A2A] hover:bg-white/50 hover:border-[#5C4A2A]/30'
                }`}
              >
                Explore AI Academy
              </Button>
            </Link>
          </div>
        </div>

        {/* Dashboard Preview Section */}
        <div className="mt-24">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className={`h-px w-12 bg-gradient-to-r from-transparent ${
                isDark ? 'to-cyan-400/40' : 'to-[#8B7355]/40'
              }`} />
              <span className={`text-sm font-medium tracking-[0.3em] uppercase ${
                isDark ? 'text-cyan-400' : 'text-[#8B7355]'
              }`}>
                Your Command Center
              </span>
              <div className={`h-px w-12 bg-gradient-to-l from-transparent ${
                isDark ? 'to-cyan-400/40' : 'to-[#8B7355]/40'
              }`} />
            </div>
            <h2 className={`text-3xl font-light tracking-wide transition-colors duration-500 ${
              isDark ? 'text-white' : 'text-[#3D3124]'
            }`}>
              Everything You Need to Shine
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Search, title: 'New Analysis', desc: 'Dawn on any company', accent: 'cyan' },
              { icon: Building2, title: 'Companies', desc: 'Your prospect horizon', accent: 'emerald' },
              { icon: Bell, title: 'Monitors', desc: 'Real-time awakening alerts', accent: 'purple' },
              { icon: FileText, title: 'Reports', desc: 'Insights ready to share', accent: 'pink' },
            ].map((item) => (
              <div key={item.title} className={`group relative overflow-hidden rounded-2xl backdrop-blur-xl border shadow-lg hover:shadow-xl transition-all duration-300 p-6 ${
                isDark
                  ? 'bg-white/5 border-white/10 hover:bg-white/10'
                  : 'bg-white/50 border-white/40 hover:bg-white/60'
              }`}>
                <div className="flex items-center gap-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl border group-hover:scale-105 transition-transform ${
                    isDark
                      ? `bg-gradient-to-br from-${item.accent}-500/20 to-transparent border-${item.accent}-500/30`
                      : 'bg-gradient-to-br from-[#5C4A2A]/10 to-[#8B7355]/10 border-[#5C4A2A]/10'
                  }`}>
                    <item.icon className={`h-5 w-5 ${
                      isDark
                        ? item.accent === 'cyan' ? 'text-cyan-400' :
                          item.accent === 'emerald' ? 'text-emerald-400' :
                          item.accent === 'purple' ? 'text-purple-400' : 'text-pink-400'
                        : 'text-[#5C4A2A]'
                    }`} />
                  </div>
                  <div>
                    <h4 className={`font-medium tracking-wide transition-colors ${
                      isDark ? 'text-white group-hover:text-cyan-400' : 'text-[#3D3124] group-hover:text-[#5C4A2A]'
                    }`}>{item.title}</h4>
                    <p className={`text-sm font-light ${
                      isDark ? 'text-white/50' : 'text-[#5C4A2A]/60'
                    }`}>{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section with Aurora Core Diagram */}
        <div className={`mt-24 relative overflow-hidden rounded-3xl p-12 shadow-2xl transition-all duration-500 ${
          isDark
            ? 'bg-gradient-to-br from-[#0a0a0a] via-[#111] to-[#0a0a0a] border border-white/10'
            : 'bg-gradient-to-br from-[#3D3124] to-[#5C4A2A]'
        }`}>
          {/* Decorative elements */}
          <div className={`absolute top-0 left-0 w-80 h-80 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl ${
            isDark ? 'bg-cyan-500/10' : 'bg-[#F5EFE4]/5'
          }`} />
          <div className={`absolute bottom-0 right-0 w-96 h-96 rounded-full translate-x-1/3 translate-y-1/3 blur-2xl ${
            isDark ? 'bg-purple-500/10' : 'bg-[#F5EFE4]/5'
          }`} />
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-50 ${
            isDark
              ? 'bg-gradient-to-br from-emerald-500/5 to-transparent'
              : 'bg-gradient-to-br from-[#8B7355]/10 to-transparent'
          }`} />

          {/* Grid overlay on CTA */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: isDark
                ? `linear-gradient(to right, rgba(0,255,255,0.5) 1px, transparent 1px),
                   linear-gradient(to bottom, rgba(0,255,255,0.5) 1px, transparent 1px)`
                : `linear-gradient(to right, #F5EFE4 1px, transparent 1px),
                   linear-gradient(to bottom, #F5EFE4 1px, transparent 1px)`,
              backgroundSize: '40px 40px',
            }}
          />

          <div className="relative">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="flex items-center gap-3">
                  <div className={`h-2 w-2 rounded-full animate-pulse ${
                    isDark ? 'bg-cyan-400' : 'bg-[#F5EFE4]/40'
                  }`} />
                  <span className={`text-sm font-medium tracking-[0.3em] uppercase ${
                    isDark ? 'text-cyan-400/60' : 'text-[#F5EFE4]/60'
                  }`}>
                    A New Beginning Awaits
                  </span>
                  <div className={`h-2 w-2 rounded-full animate-pulse ${
                    isDark ? 'bg-purple-400' : 'bg-[#F5EFE4]/40'
                  }`} />
                </div>
              </div>
              <h2 className={`text-4xl font-light tracking-wide ${
                isDark ? 'text-white' : 'text-[#F5EFE4]'
              }`}>
                Ready for your dawn?
              </h2>
            </div>

            {/* Aurora Core Diagram */}
            <div className="relative mb-8">
              <AuroraCoreDiagram />
            </div>

            {/* CTA Button */}
            <div className="text-center">
              <Link to="/dashboard/new">
                <Button
                  size="lg"
                  className={`px-10 py-6 text-base tracking-wide font-medium shadow-xl rounded-2xl backdrop-blur-sm transition-all hover:scale-[1.02] ${
                    isDark
                      ? 'bg-white/10 text-white border border-white/20 hover:bg-white/15 hover:border-cyan-500/40 hover:shadow-lg hover:shadow-cyan-500/20'
                      : 'bg-white/95 text-[#3D3124] hover:bg-white'
                  }`}
                >
                  Start Your First Analysis
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={`relative z-10 border-t backdrop-blur-xl py-16 mt-20 transition-colors duration-500 ${
        isDark
          ? 'border-white/10 bg-black/20'
          : 'border-[#5C4A2A]/10 bg-white/20'
      }`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center">
            <img
              src={isDark ? "/Aurora_logo_dark_v2.png" : "/Aurora_logo_v3.png"}
              alt="Aurora"
              className="h-8 w-auto opacity-60 mb-4"
            />
            <p className={`text-sm font-light italic mb-6 ${
              isDark ? 'text-white/30' : 'text-[#5C4A2A]/50'
            }`}>
              &ldquo;Bringing light to every conversation&rdquo;
            </p>
            <div className={`flex gap-8 text-sm mb-8 ${
              isDark ? 'text-white/30' : 'text-[#5C4A2A]/50'
            }`}>
              <a href="#" className={`transition-colors tracking-wide ${
                isDark ? 'hover:text-cyan-400' : 'hover:text-[#5C4A2A]'
              }`}>Privacy</a>
              <a href="#" className={`transition-colors tracking-wide ${
                isDark ? 'hover:text-cyan-400' : 'hover:text-[#5C4A2A]'
              }`}>Terms</a>
              <a href="#" className={`transition-colors tracking-wide ${
                isDark ? 'hover:text-cyan-400' : 'hover:text-[#5C4A2A]'
              }`}>Contact</a>
            </div>
            <p className={`text-sm font-light ${
              isDark ? 'text-white/20' : 'text-[#5C4A2A]/40'
            }`}>
              &copy; 2025 Aurora. Built by Human in the Loop.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
