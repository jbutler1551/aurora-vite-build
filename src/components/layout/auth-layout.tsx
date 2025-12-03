import { Link } from 'react-router-dom';
import { useTheme } from '@/lib/theme-context';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Sparkles, TrendingUp, Shield, Zap, Star, Quote } from 'lucide-react';

const testimonials = [
  {
    quote: "Aurora cut our research time by 80%. We're closing deals faster than ever.",
    author: "Sarah Chen",
    role: "VP of Sales, TechCorp",
    avatar: "SC",
  },
  {
    quote: "The competitive intelligence is game-changing. We see opportunities our competitors miss.",
    author: "Michael Torres",
    role: "Sales Director, Innovate Inc",
    avatar: "MT",
  },
  {
    quote: "Finally, AI that actually understands B2B sales. Worth every penny.",
    author: "Emily Watson",
    role: "Head of Revenue, ScaleUp",
    avatar: "EW",
  },
];

const stats = [
  { value: "10,000+", label: "Companies analyzed" },
  { value: "85%", label: "Faster research" },
  { value: "3.2x", label: "More deals closed" },
];

const features = [
  { icon: Zap, text: "Instant company intelligence" },
  { icon: TrendingUp, text: "Real-time competitor tracking" },
  { icon: Shield, text: "Enterprise-grade security" },
];

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen flex transition-colors duration-500 ${
      isDark ? 'bg-[#0a0a0a]' : 'bg-[#ebe3d3]'
    }`}>
      {/* Left Panel - Value Proposition (Hidden on mobile) */}
      <div className={`hidden lg:flex lg:w-[55%] xl:w-[60%] relative overflow-hidden ${
        isDark
          ? 'bg-gradient-to-br from-[#0c1222] via-[#0a0f1a] to-[#0a0a12]'
          : 'bg-gradient-to-br from-[#d4c4a8] via-[#c9b896] to-[#bfae8c]'
      }`}>
        {/* Aurora Background Effects - Dark Mode */}
        {isDark && (
          <>
            {/* Primary aurora curtains */}
            <div
              className="absolute inset-0 opacity-70"
              style={{
                background: `
                  radial-gradient(ellipse 120% 60% at 10% -20%, rgba(34, 211, 238, 0.3) 0%, transparent 50%),
                  radial-gradient(ellipse 100% 50% at 50% -10%, rgba(52, 211, 153, 0.25) 0%, transparent 45%),
                  radial-gradient(ellipse 110% 55% at 90% -15%, rgba(168, 85, 247, 0.28) 0%, transparent 50%)
                `,
              }}
            />
            {/* Animated glow spots */}
            <div className="absolute top-[5%] left-[10%] w-[500px] h-[350px] bg-cyan-500/25 rounded-full blur-[120px] animate-float-slow" />
            <div className="absolute top-[0%] right-[10%] w-[400px] h-[300px] bg-purple-500/20 rounded-full blur-[100px] animate-float-slower" />
            <div className="absolute bottom-[20%] left-[30%] w-[450px] h-[320px] bg-emerald-500/15 rounded-full blur-[110px] animate-float-slow" />
          </>
        )}

        {/* Light mode gradient orbs */}
        {!isDark && (
          <>
            <div className="absolute -top-20 -left-20 w-[400px] h-[400px] bg-gradient-radial from-white/40 to-transparent rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-[350px] h-[350px] bg-gradient-radial from-[#ebe3d3]/50 to-transparent rounded-full blur-3xl" />
          </>
        )}

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: isDark
              ? `linear-gradient(to right, rgba(34,211,238,0.4) 1px, transparent 1px),
                 linear-gradient(to bottom, rgba(34,211,238,0.4) 1px, transparent 1px)`
              : `linear-gradient(to right, #5C4A2A 1px, transparent 1px),
                 linear-gradient(to bottom, #5C4A2A 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-8 xl:p-12 w-full">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src={isDark ? "/Aurora_logo_dark_v2.png" : "/Aurora_logo_v3.png"}
              alt="Aurora"
              className="h-10 w-auto"
            />
          </Link>

          {/* Main Content */}
          <div className="flex-1 flex flex-col justify-center max-w-xl py-12">
            {/* Badge */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8 w-fit ${
              isDark
                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                : 'bg-white/40 text-[#5C4A2A] border border-[#5C4A2A]/10'
            }`}>
              <Sparkles className="w-4 h-4" />
              AI-Powered Sales Intelligence
            </div>

            {/* Headline */}
            <h1 className={`text-4xl xl:text-5xl font-bold leading-tight mb-6 ${
              isDark ? 'text-white' : 'text-[#3D3124]'
            }`}>
              Turn any company URL into{' '}
              <span className={isDark
                ? 'bg-gradient-to-r from-cyan-400 via-emerald-400 to-purple-400 bg-clip-text text-transparent'
                : 'text-[#5C4A2A]'
              }>
                actionable intelligence
              </span>
            </h1>

            <p className={`text-lg xl:text-xl leading-relaxed mb-10 ${
              isDark ? 'text-white/70' : 'text-[#5C4A2A]/70'
            }`}>
              Join thousands of sales teams using Aurora to close more deals with less research.
              Get instant insights on any company in seconds.
            </p>

            {/* Feature List */}
            <div className="space-y-4 mb-12">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    isDark ? 'bg-cyan-500/10' : 'bg-white/40'
                  }`}>
                    <feature.icon className={`w-5 h-5 ${
                      isDark ? 'text-cyan-400' : 'text-[#5C4A2A]'
                    }`} />
                  </div>
                  <span className={`text-base ${
                    isDark ? 'text-white/80' : 'text-[#3D3124]'
                  }`}>
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className={`grid grid-cols-3 gap-6 p-6 rounded-2xl backdrop-blur-sm ${
              isDark
                ? 'bg-white/5 border border-white/10'
                : 'bg-white/30 border border-white/40'
            }`}>
              {stats.map((stat, idx) => (
                <div key={idx} className="text-center">
                  <div className={`text-2xl xl:text-3xl font-bold ${
                    isDark
                      ? 'bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent'
                      : 'text-[#3D3124]'
                  }`}>
                    {stat.value}
                  </div>
                  <div className={`text-sm mt-1 ${
                    isDark ? 'text-white/50' : 'text-[#5C4A2A]/60'
                  }`}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonial */}
          <div className={`p-6 rounded-2xl backdrop-blur-sm ${
            isDark
              ? 'bg-white/5 border border-white/10'
              : 'bg-white/30 border border-white/40'
          }`}>
            <Quote className={`w-8 h-8 mb-4 ${
              isDark ? 'text-cyan-400/50' : 'text-[#5C4A2A]/30'
            }`} />
            <p className={`text-lg mb-4 ${
              isDark ? 'text-white/90' : 'text-[#3D3124]'
            }`}>
              "{testimonials[0].quote}"
            </p>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                isDark
                  ? 'bg-gradient-to-br from-cyan-500 to-purple-500 text-black'
                  : 'bg-gradient-to-br from-[#8B7355] to-[#5C4A2A] text-white'
              }`}>
                {testimonials[0].avatar}
              </div>
              <div>
                <div className={`font-medium ${isDark ? 'text-white' : 'text-[#3D3124]'}`}>
                  {testimonials[0].author}
                </div>
                <div className={`text-sm ${isDark ? 'text-white/50' : 'text-[#5C4A2A]/60'}`}>
                  {testimonials[0].role}
                </div>
              </div>
              <div className="ml-auto flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 fill-current ${
                    isDark ? 'text-cyan-400' : 'text-[#8B7355]'
                  }`} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className={`w-full lg:w-[45%] xl:w-[40%] relative overflow-hidden ${
        isDark ? 'bg-[#0a0a0a]' : 'bg-[#ebe3d3]'
      }`}>
        {/* Subtle background effects for form panel */}
        {isDark && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[10%] right-[10%] w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-[20%] left-[10%] w-[250px] h-[250px] bg-purple-500/10 rounded-full blur-[80px]" />
          </div>
        )}
        {!isDark && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[10%] right-[10%] w-[300px] h-[300px] bg-gradient-radial from-[#d4c4a8]/30 to-transparent rounded-full blur-2xl" />
            <div className="absolute bottom-[20%] left-[10%] w-[250px] h-[250px] bg-gradient-radial from-[#c9b896]/25 to-transparent rounded-full blur-2xl" />
          </div>
        )}

        {/* Grid overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: isDark
              ? `linear-gradient(to right, rgba(0,255,255,0.3) 1px, transparent 1px),
                 linear-gradient(to bottom, rgba(0,255,255,0.3) 1px, transparent 1px)`
              : `linear-gradient(to right, #5C4A2A 1px, transparent 1px),
                 linear-gradient(to bottom, #5C4A2A 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Header - Mobile only logo, always shows theme toggle */}
        <header className="relative z-10 flex items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center lg:hidden">
            <img
              src={isDark ? "/Aurora_logo_dark_v2.png" : "/Aurora_logo_v3.png"}
              alt="Aurora"
              className="h-9 w-auto"
            />
          </Link>
          <div className="lg:ml-auto">
            <ThemeToggle />
          </div>
        </header>

        {/* Form Content */}
        <main className="relative z-10 flex min-h-[calc(100vh-80px)] items-center justify-center px-6 py-8">
          {children}
        </main>

        {/* Footer - Trust badges */}
        <footer className={`relative z-10 pb-6 px-6 text-center ${
          isDark ? 'text-white/40' : 'text-[#5C4A2A]/40'
        }`}>
          <div className="flex items-center justify-center gap-4 text-xs">
            <span className="flex items-center gap-1">
              <Shield className="w-3 h-3" />
              SOC 2 Compliant
            </span>
            <span>•</span>
            <span>256-bit SSL</span>
            <span>•</span>
            <span>GDPR Ready</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
