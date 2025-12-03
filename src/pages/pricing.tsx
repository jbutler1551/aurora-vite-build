import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SiteNav } from '@/components/ui/site-nav';
import { useTheme } from '@/lib/theme-context';
import {
  Check,
  X,
  Sparkles,
  ArrowRight,
  Building2,
  Users,
  Zap,
  Shield,
  MessageSquare,
  HelpCircle
} from 'lucide-react';

const plans = [
  {
    name: 'Starter',
    price: '$199',
    period: '/month',
    description: 'Perfect for individual sellers and small teams getting started with AI-powered intelligence.',
    analyses: '5 analyses/month',
    features: [
      { text: '5 company analyses per month', included: true },
      { text: 'Full research reports', included: true },
      { text: 'Competitive positioning', included: true },
      { text: 'Talk tracks & objection handlers', included: true },
      { text: 'Email support', included: true },
      { text: 'API access', included: false },
      { text: 'White-label reports', included: false },
      { text: 'Team collaboration', included: false },
    ],
    cta: 'Get Started',
    popular: false,
    color: 'white'
  },
  {
    name: 'Professional',
    price: '$499',
    period: '/month',
    description: 'For growing sales teams that need more capacity and advanced features.',
    analyses: '15 analyses/month',
    features: [
      { text: '15 company analyses per month', included: true },
      { text: 'Full research reports', included: true },
      { text: 'Competitive positioning', included: true },
      { text: 'Talk tracks & objection handlers', included: true },
      { text: 'Priority support', included: true },
      { text: 'API access', included: true },
      { text: 'White-label reports', included: false },
      { text: 'Team collaboration (up to 5)', included: true },
    ],
    cta: 'Get Started',
    popular: true,
    color: 'gradient'
  },
  {
    name: 'Agency',
    price: '$999',
    period: '/month',
    description: 'For agencies and large teams with white-label needs and high volume.',
    analyses: '40 analyses/month',
    features: [
      { text: '40 company analyses per month', included: true },
      { text: 'Full research reports', included: true },
      { text: 'Competitive positioning', included: true },
      { text: 'Talk tracks & objection handlers', included: true },
      { text: 'Dedicated support', included: true },
      { text: 'API access', included: true },
      { text: 'White-label reports', included: true },
      { text: 'Unlimited team members', included: true },
    ],
    cta: 'Get Started',
    popular: false,
    color: 'dark'
  },
];

const faqs = [
  {
    q: 'How long does an analysis take?',
    a: 'A full company analysis typically takes 1-4 hours depending on the complexity and amount of available data. You\'ll receive an email notification when your analysis is complete.'
  },
  {
    q: 'What counts as an "analysis"?',
    a: 'One analysis covers a single company and includes the full research report, competitive positioning, opportunity maps, talk tracks, and all related insights.'
  },
  {
    q: 'Can I upgrade or downgrade my plan?',
    a: 'Yes, you can change your plan at any time. Upgrades take effect immediately, and downgrades apply at the start of your next billing cycle.'
  },
  {
    q: 'Do unused analyses roll over?',
    a: 'Currently, unused analyses do not roll over to the next month. We recommend choosing a plan that matches your typical monthly usage.'
  },
  {
    q: 'Is there a free trial?',
    a: 'We offer a demo analysis so you can see the quality of our output before committing. Contact us to request a demo.'
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major credit cards through Stripe. For Enterprise plans, we also offer invoice billing.'
  },
];

export default function PricingPage() {
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

      <SiteNav currentPage="pricing" />

      <main className="relative z-10">
        {/* Hero */}
        <section className="relative py-20 px-4 overflow-hidden">
          <div className="max-w-7xl mx-auto text-center">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm mb-8 transition-colors duration-500 ${
              isDark
                ? 'bg-white/5 border border-cyan-500/30'
                : 'bg-[#5C4A2A]/10 border border-[#5C4A2A]/20'
            }`}>
              <Sparkles className={`h-4 w-4 ${isDark ? 'text-cyan-400' : 'text-[#8B7355]'}`} />
              <span className={`text-sm tracking-wide ${isDark ? 'text-cyan-400' : 'text-[#5C4A2A]'}`}>Simple, Transparent Pricing</span>
            </div>

            <h1 className={`text-5xl md:text-6xl font-light leading-tight mb-6 ${isDark ? 'text-white' : 'text-[#3D3124]'}`}>
              Invest in Intelligence
              <span className={`block font-normal bg-clip-text text-transparent ${
                isDark
                  ? 'bg-gradient-to-r from-cyan-400 via-emerald-400 to-purple-400'
                  : 'bg-gradient-to-r from-[#5C4A2A] via-[#8B7355] to-[#5C4A2A]'
              }`}>
                That Pays for Itself
              </span>
            </h1>

            <p className={`text-xl font-light max-w-2xl mx-auto ${isDark ? 'text-white/60' : 'text-[#5C4A2A]/70'}`}>
              One closed deal covers months of Aurora. Choose the plan that fits your team.
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6">
              {plans.map((plan, i) => (
                <div
                  key={i}
                  className={`relative rounded-3xl overflow-hidden shadow-xl transition-colors duration-500 ${
                    isDark
                      ? plan.color === 'gradient'
                        ? 'bg-gradient-to-br from-cyan-500/20 via-emerald-500/10 to-purple-500/20 border border-cyan-500/30 text-white'
                        : plan.color === 'dark'
                        ? 'bg-gradient-to-br from-[#111] to-[#0a0a0a] text-white border border-white/10'
                        : 'bg-white/5 backdrop-blur-xl border border-white/10'
                      : plan.color === 'gradient'
                      ? 'bg-gradient-to-br from-[#5C4A2A] to-[#3D3124] text-white'
                      : plan.color === 'dark'
                      ? 'bg-[#3D3124] text-white'
                      : 'bg-white/70 backdrop-blur-xl border border-white/50'
                  } ${plan.popular ? isDark ? 'ring-2 ring-cyan-500 scale-105 z-10' : 'ring-2 ring-[#8B7355] scale-105 z-10' : ''}`}
                >
                  {plan.popular && (
                    <div className={`absolute top-0 right-0 text-xs font-medium px-4 py-1.5 rounded-bl-xl ${
                      isDark ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-black' : 'bg-[#8B7355] text-white'
                    }`}>
                      Most Popular
                    </div>
                  )}

                  <div className="p-8">
                    <h3 className={`text-xl font-medium mb-2 ${
                      isDark
                        ? 'text-white'
                        : plan.color === 'white' ? 'text-[#3D3124]' : ''
                    }`}>
                      {plan.name}
                    </h3>
                    <div className="flex items-baseline gap-1 mb-2">
                      <span className={`text-5xl font-light ${
                        isDark
                          ? plan.color === 'gradient' ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400' : 'text-white'
                          : plan.color === 'white' ? 'text-[#3D3124]' : ''
                      }`}>
                        {plan.price}
                      </span>
                      <span className={`text-lg ${
                        isDark
                          ? 'text-white/50'
                          : plan.color === 'white' ? 'text-[#5C4A2A]/60' : 'text-white/60'
                      }`}>
                        {plan.period}
                      </span>
                    </div>
                    <p className={`text-sm font-light mb-6 ${
                      isDark
                        ? 'text-white/50'
                        : plan.color === 'white' ? 'text-[#5C4A2A]/70' : 'text-white/70'
                    }`}>
                      {plan.description}
                    </p>

                    <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium mb-6 ${
                      isDark
                        ? plan.color === 'gradient' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/10 text-white/80'
                        : plan.color === 'white'
                        ? 'bg-[#5C4A2A]/10 text-[#5C4A2A]'
                        : 'bg-white/20 text-white'
                    }`}>
                      {plan.analyses}
                    </div>

                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, j) => (
                        <li key={j} className="flex items-start gap-3">
                          {feature.included ? (
                            <Check className={`h-5 w-5 flex-shrink-0 ${
                              isDark
                                ? 'text-emerald-400'
                                : plan.color === 'white' ? 'text-[#5C4A2A]' : 'text-[#d4c4a8]'
                            }`} />
                          ) : (
                            <X className={`h-5 w-5 flex-shrink-0 ${
                              isDark
                                ? 'text-white/20'
                                : plan.color === 'white' ? 'text-[#5C4A2A]/30' : 'text-white/30'
                            }`} />
                          )}
                          <span className={`text-sm font-light ${
                            isDark
                              ? feature.included ? 'text-white/80' : 'text-white/30'
                              : feature.included
                              ? plan.color === 'white' ? 'text-[#3D3124]' : 'text-white'
                              : plan.color === 'white' ? 'text-[#5C4A2A]/40' : 'text-white/40'
                          }`}>
                            {feature.text}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <Link to="/dashboard" className="block">
                      <Button
                        className={`w-full py-6 rounded-xl text-base font-medium transition-all duration-300 ${
                          isDark
                            ? plan.color === 'gradient'
                              ? 'bg-white/10 text-white border border-white/20 hover:bg-white/15 hover:border-cyan-500/40 hover:shadow-lg hover:shadow-cyan-500/20 backdrop-blur-sm'
                              : plan.color === 'dark'
                              ? 'bg-white/10 text-white border border-white/20 hover:bg-white/15 hover:border-cyan-500/40 hover:shadow-lg hover:shadow-cyan-500/20 backdrop-blur-sm'
                              : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                            : plan.color === 'gradient'
                            ? 'bg-white text-[#3D3124] hover:bg-white/90'
                            : plan.color === 'dark'
                            ? 'bg-[#8B7355] text-white hover:bg-[#7a6348]'
                            : 'bg-gradient-to-r from-[#5C4A2A] to-[#8B7355] text-white hover:from-[#4a3a21] hover:to-[#7a6348]'
                        }`}
                      >
                        {plan.cta}
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Enterprise Section */}
        <section className="py-16 px-4">
          <div className="max-w-5xl mx-auto">
            <div className={`relative overflow-hidden rounded-3xl p-10 md:p-14 transition-colors duration-500 ${
              isDark
                ? 'bg-gradient-to-r from-[#0a0a0a] via-[#111] to-[#0a0a0a] border border-white/10'
                : 'bg-gradient-to-r from-[#3D3124] via-[#5C4A2A] to-[#3D3124]'
            }`}>
              <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl ${
                isDark ? 'bg-gradient-radial from-purple-500/20 to-transparent' : 'bg-gradient-radial from-[#8B7355]/30 to-transparent'
              }`} />
              <div className={`absolute bottom-0 left-0 w-48 h-48 rounded-full blur-2xl ${
                isDark ? 'bg-gradient-radial from-cyan-500/15 to-transparent' : 'bg-gradient-radial from-[#d4c4a8]/20 to-transparent'
              }`} />

              <div className="relative grid md:grid-cols-2 gap-10 items-center">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <Building2 className={`h-6 w-6 ${isDark ? 'text-purple-400' : 'text-[#d4c4a8]'}`} />
                    <span className={`text-sm font-medium tracking-widest uppercase ${isDark ? 'text-purple-400' : 'text-[#d4c4a8]'}`}>Enterprise</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-light text-[#F5EFE4] mb-4">
                    Need More?
                  </h2>
                  <p className={`font-light text-lg mb-6 ${isDark ? 'text-white/60' : 'text-[#d4c4a8]/80'}`}>
                    Custom plans for organizations with high-volume needs, advanced security requirements, or special integrations.
                  </p>
                  <ul className="space-y-3 mb-8">
                    {['Custom analysis volumes', 'SSO / SAML integration', 'Dedicated account manager', 'Custom API rate limits', 'SLA guarantees'].map((item, i) => (
                      <li key={i} className={`flex items-center gap-3 ${isDark ? 'text-white/70' : 'text-[#F5EFE4]/80'}`}>
                        <Check className={`h-4 w-4 flex-shrink-0 ${isDark ? 'text-emerald-400' : 'text-[#d4c4a8]'}`} />
                        <span className="font-light">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="text-center md:text-right">
                  <p className={`text-sm mb-2 ${isDark ? 'text-white/40' : 'text-[#d4c4a8]/60'}`}>Starting at</p>
                  <p className={`text-5xl font-light mb-6 ${
                    isDark ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400' : 'text-[#F5EFE4]'
                  }`}>Custom</p>
                  <Button size="lg" className={`px-8 py-6 text-lg rounded-xl transition-all duration-300 ${
                    isDark
                      ? 'bg-white/10 text-white border border-white/20 hover:bg-white/15 hover:border-cyan-500/40 hover:shadow-lg hover:shadow-cyan-500/20 backdrop-blur-sm'
                      : 'bg-[#F5EFE4] text-[#3D3124] hover:bg-white'
                  }`}>
                    Contact Sales
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Value Props */}
        <section className={`py-16 px-4 transition-colors duration-500 ${
          isDark ? 'bg-gradient-to-b from-transparent via-white/5 to-transparent' : 'bg-gradient-to-b from-transparent via-white/30 to-transparent'
        }`}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className={`text-3xl font-light ${isDark ? 'text-white' : 'text-[#3D3124]'}`}>
                Every Plan Includes
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Shield, title: '99% Accuracy', desc: 'Verified, decision-grade intelligence', color: 'cyan' },
                { icon: Zap, title: 'Fast Delivery', desc: 'Full reports in hours, not weeks', color: 'emerald' },
                { icon: MessageSquare, title: 'AI Chat', desc: 'Ask follow-up questions anytime', color: 'purple' },
                { icon: Users, title: 'Human Support', desc: 'Real people ready to help', color: 'pink' },
              ].map((item, i) => (
                <div key={i} className={`text-center p-6 rounded-2xl backdrop-blur-sm transition-colors duration-500 ${
                  isDark
                    ? 'bg-white/5 border border-white/10'
                    : 'bg-white/50 border border-white/60'
                }`}>
                  <div className="flex justify-center mb-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl transition-colors duration-500 ${
                      isDark
                        ? item.color === 'cyan' ? 'bg-cyan-500/20 border border-cyan-500/30'
                          : item.color === 'emerald' ? 'bg-emerald-500/20 border border-emerald-500/30'
                          : item.color === 'purple' ? 'bg-purple-500/20 border border-purple-500/30'
                          : 'bg-pink-500/20 border border-pink-500/30'
                        : 'bg-gradient-to-br from-[#5C4A2A]/10 to-[#8B7355]/10 border border-[#5C4A2A]/10'
                    }`}>
                      <item.icon className={`h-6 w-6 ${
                        isDark
                          ? item.color === 'cyan' ? 'text-cyan-400'
                            : item.color === 'emerald' ? 'text-emerald-400'
                            : item.color === 'purple' ? 'text-purple-400'
                            : 'text-pink-400'
                          : 'text-[#5C4A2A]'
                      }`} />
                    </div>
                  </div>
                  <h3 className={`font-medium mb-1 ${isDark ? 'text-white' : 'text-[#3D3124]'}`}>{item.title}</h3>
                  <p className={`text-sm font-light ${isDark ? 'text-white/50' : 'text-[#5C4A2A]/60'}`}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-24 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-2 mb-4">
                <HelpCircle className={`h-5 w-5 ${isDark ? 'text-cyan-400' : 'text-[#8B7355]'}`} />
                <span className={`text-sm font-medium tracking-[0.2em] uppercase ${isDark ? 'text-cyan-400' : 'text-[#8B7355]'}`}>FAQs</span>
              </div>
              <h2 className={`text-3xl font-light ${isDark ? 'text-white' : 'text-[#3D3124]'}`}>
                Common Questions
              </h2>
            </div>

            <div className="grid gap-4">
              {faqs.map((faq, i) => (
                <div key={i} className={`p-6 rounded-2xl backdrop-blur-xl transition-colors duration-500 ${
                  isDark
                    ? 'bg-white/5 border border-white/10'
                    : 'bg-white/60 border border-white/50'
                }`}>
                  <h3 className={`font-medium mb-2 ${isDark ? 'text-white' : 'text-[#3D3124]'}`}>{faq.q}</h3>
                  <p className={`font-light ${isDark ? 'text-white/60' : 'text-[#5C4A2A]/70'}`}>{faq.a}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <p className={`font-light mb-4 ${isDark ? 'text-white/40' : 'text-[#5C4A2A]/60'}`}>
                Have more questions?
              </p>
              <Button variant="outline" className={`rounded-xl transition-colors duration-500 ${
                isDark
                  ? 'border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10'
                  : 'border-[#5C4A2A]/20 text-[#5C4A2A] hover:bg-[#5C4A2A]/5'
              }`}>
                Contact Support
                <MessageSquare className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="relative py-24 px-4 overflow-hidden">
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
              Start Winning More Deals Today
            </h2>
            <p className={`text-xl font-light mb-10 max-w-2xl mx-auto ${isDark ? 'text-white/60' : 'text-[#d4c4a8]/80'}`}>
              Join the teams already using Aurora to close more business with verified intelligence.
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
