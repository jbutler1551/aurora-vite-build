import { Link, useLocation } from 'react-router-dom';
import { lazy, Suspense, useState } from 'react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/lib/theme-context';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import {
  LayoutDashboard,
  Search,
  Building2,
  Bell,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// Lazy load Three.js component to improve page load performance
const AetherSphere = lazy(() => import('@/components/ui/aether-sphere').then((mod) => ({ default: mod.AetherSphere })));

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'New Analysis',
    href: '/dashboard/new',
    icon: Search,
  },
  {
    name: 'Companies',
    href: '/dashboard/companies',
    icon: Building2,
  },
  {
    name: 'Monitors',
    href: '/dashboard/monitors',
    icon: Bell,
  },
  {
    name: 'Reports',
    href: '/dashboard/reports',
    icon: FileText,
  },
  {
    name: 'AI Academy',
    href: '/dashboard/academy',
    icon: GraduationCap,
  },
];

const bottomNavigation = [
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
];

export function Sidebar() {
  const location = useLocation();
  const pathname = location.pathname;
  const [collapsed, setCollapsed] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div
      className={cn(
        'relative flex h-screen flex-col transition-all duration-500 z-10',
        collapsed ? 'w-20' : 'w-72'
      )}
    >
      {/* Glassmorphism background layer - separate from content */}
      <div className={cn(
        'absolute inset-0 transition-colors duration-500 border-r',
        isDark
          ? 'bg-black/40 backdrop-blur-xl border-white/10'
          : 'bg-white/40 backdrop-blur-xl border-[#5C4A2A]/10'
      )} />

      {/* Logo - isolated from blur effect */}
      <div className={cn(
        'relative flex h-20 items-center justify-center px-5 border-b transition-colors duration-500',
        isDark ? 'border-white/10' : 'border-[#5C4A2A]/10'
      )}>
        {collapsed ? (
          <Suspense fallback={<div className="w-[50px] h-[50px]" />}>
            <AetherSphere size={50} />
          </Suspense>
        ) : (
          <img
            src={isDark ? "/Aurora_logo_dark_v2.png" : "/Aurora_logo_v3.png"}
            alt="Aurora"
            className="h-10 w-auto"
            style={{ imageRendering: 'crisp-edges' }}
          />
        )}
      </div>

      {/* Navigation */}
      <nav className="relative flex-1 space-y-2 px-3 py-6">
        {navigation.map((item) => {
          // Special case for Dashboard - only active on exact match
          const isActive = item.href === '/dashboard'
            ? pathname === '/dashboard'
            : pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-300',
                isActive
                  ? isDark
                    ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/10 text-cyan-400 shadow-sm backdrop-blur-sm border border-cyan-500/20'
                    : 'bg-gradient-to-r from-[#5C4A2A]/15 to-[#8B7355]/10 text-[#5C4A2A] shadow-sm backdrop-blur-sm border border-[#5C4A2A]/10'
                  : isDark
                    ? 'text-white/60 hover:bg-white/5 hover:text-cyan-400 hover:shadow-sm'
                    : 'text-[#5C4A2A]/60 hover:bg-white/50 hover:text-[#5C4A2A] hover:shadow-sm'
              )}
              title={collapsed ? item.name : undefined}
            >
              <item.icon className={cn(
                'h-5 w-5 shrink-0 transition-transform group-hover:scale-110',
                isActive
                  ? isDark ? 'text-cyan-400' : 'text-[#5C4A2A]'
                  : ''
              )} />
              {!collapsed && <span className="tracking-wide">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Theme Toggle & Bottom Navigation */}
      <div className={cn(
        'relative border-t px-3 py-4 space-y-2 transition-colors duration-500',
        isDark ? 'border-white/10' : 'border-[#5C4A2A]/10'
      )}>
        {/* Theme Toggle */}
        <div className={cn(
          'flex items-center gap-3 rounded-2xl py-3 transition-all duration-300',
          collapsed ? 'justify-center px-1' : 'px-4',
          isDark ? 'text-white/60' : 'text-[#5C4A2A]/60'
        )}>
          <ThemeToggle />
          {!collapsed && <span className="text-sm font-medium tracking-wide">Theme</span>}
        </div>

        {bottomNavigation.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-300',
                isActive
                  ? isDark
                    ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/10 text-cyan-400 shadow-sm backdrop-blur-sm border border-cyan-500/20'
                    : 'bg-gradient-to-r from-[#5C4A2A]/15 to-[#8B7355]/10 text-[#5C4A2A] shadow-sm backdrop-blur-sm border border-[#5C4A2A]/10'
                  : isDark
                    ? 'text-white/60 hover:bg-white/5 hover:text-cyan-400'
                    : 'text-[#5C4A2A]/60 hover:bg-white/50 hover:text-[#5C4A2A]'
              )}
              title={collapsed ? item.name : undefined}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span className="tracking-wide">{item.name}</span>}
            </Link>
          );
        })}
      </div>

      {/* Collapse Button */}
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          'absolute -right-4 top-24 h-8 w-8 rounded-full backdrop-blur-sm shadow-lg transition-all duration-300 z-20',
          isDark
            ? 'bg-white/10 border border-white/20 text-white/70 hover:bg-white/20 hover:text-cyan-400 hover:border-cyan-500/40 hover:shadow-cyan-500/20'
            : 'bg-white/80 border border-[#5C4A2A]/10 text-[#5C4A2A]/60 hover:bg-white hover:text-[#5C4A2A]'
        )}
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
