import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/dashboard/sidebar';
import { Header } from '@/components/dashboard/header';
import { useTheme } from '@/lib/theme-context';

interface DashboardLayoutProps {
  title?: string;
}

export default function DashboardLayout({ title }: DashboardLayoutProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`flex h-screen overflow-hidden transition-colors duration-500 ${
      isDark ? 'bg-[#0a0a0a]' : 'bg-[#ebe3d3]'
    }`}>
      {/* Aurora Borealis Background - BEHIND everything in dark mode */}
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
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-gradient-radial from-[#d4c4a8]/50 via-[#c9b896]/30 to-transparent rounded-full blur-3xl animate-float-slow" />
          <div className="absolute top-1/2 -left-32 w-[400px] h-[400px] bg-gradient-radial from-[#c9b896]/40 via-[#bfae8c]/25 to-transparent rounded-full blur-3xl animate-float-slower" />
          <div className="absolute -bottom-32 right-1/4 w-[450px] h-[450px] bg-gradient-radial from-[#bfae8c]/45 via-[#d4c4a8]/25 to-transparent rounded-full blur-3xl animate-float-slow" />
        </div>
      )}

      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden relative z-10">
        <Header title={title} />
        <main className={`flex-1 overflow-auto p-6 relative transition-colors duration-500 ${
          isDark ? 'bg-transparent' : 'bg-[#F8F7F4]'
        }`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
