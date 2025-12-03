import { Bell, Search, LogOut, Settings, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useTheme } from '@/lib/theme-context';
import { useAuth } from '@/lib/auth-context';
import { cn } from '@/lib/utils';

interface HeaderProps {
  title?: string;
}

export function Header({ title }: HeaderProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { user, logout } = useAuth();

  // Get initials from user name or email
  const getInitials = () => {
    if (user?.name) {
      return user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  return (
    <header className="flex h-16 items-center justify-between px-6 relative z-10">
      {/* Glassmorphism header bar */}
      <div className={cn(
        'absolute inset-0 backdrop-blur-xl border-b transition-colors duration-500',
        isDark
          ? 'bg-black/30 border-white/10'
          : 'bg-white/30 border-[#5C4A2A]/10'
      )} />

      {/* Left side - Title or Search */}
      <div className="flex items-center gap-4 relative">
        {title ? (
          <h1 className={cn(
            'text-xl font-light tracking-wide transition-colors duration-500',
            isDark ? 'text-white' : 'text-[#5C4A2A]'
          )}>{title}</h1>
        ) : (
          <div className="relative w-80">
            <Search className={cn(
              'absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors duration-500',
              isDark ? 'text-white/40' : 'text-[#5C4A2A]/40'
            )} />
            <Input
              type="search"
              placeholder="Search companies, analyses..."
              className={cn(
                'pl-11 h-10 rounded-2xl backdrop-blur-sm transition-all duration-500',
                isDark
                  ? 'bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:bg-white/10 focus:border-cyan-500/30'
                  : 'bg-white/60 border-[#5C4A2A]/10 text-[#5C4A2A] placeholder:text-[#5C4A2A]/40 focus:bg-white/80 focus:border-[#5C4A2A]/20'
              )}
            />
          </div>
        )}
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center gap-3 relative">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                'relative rounded-2xl h-10 w-10 backdrop-blur-sm border transition-all duration-500',
                isDark
                  ? 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-cyan-400'
                  : 'bg-white/50 border-[#5C4A2A]/10 text-[#5C4A2A]/70 hover:bg-white/70 hover:text-[#5C4A2A]'
              )}
            >
              <Bell className="h-4 w-4" />
              <span className={cn(
                'absolute -right-1 -top-1 h-5 w-5 rounded-full text-[10px] font-medium flex items-center justify-center shadow-lg',
                isDark
                  ? 'bg-gradient-to-br from-cyan-500 to-purple-500 text-black'
                  : 'bg-gradient-to-br from-[#8B7355] to-[#5C4A2A] text-white'
              )}>
                3
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className={cn(
            'w-80 backdrop-blur-xl shadow-xl rounded-2xl',
            isDark
              ? 'bg-[#1a1a1a]/95 border-white/10'
              : 'bg-white/90 border-[#5C4A2A]/10'
          )}>
            <DropdownMenuLabel className={cn(
              'font-medium',
              isDark ? 'text-white' : 'text-[#5C4A2A]'
            )}>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator className={isDark ? 'bg-white/10' : 'bg-[#5C4A2A]/10'} />
            <DropdownMenuItem className={cn(
              'flex flex-col items-start gap-1 py-3 rounded-xl mx-1',
              isDark ? 'focus:bg-white/5' : 'focus:bg-[#ebe3d3]/50'
            )}>
              <span className={cn('font-medium', isDark ? 'text-white' : 'text-[#5C4A2A]')}>Analysis Complete</span>
              <span className={cn('text-sm', isDark ? 'text-white/60' : 'text-[#5C4A2A]/60')}>
                Midwest Industrial Supply analysis is ready
              </span>
              <span className={cn('text-xs', isDark ? 'text-white/40' : 'text-[#5C4A2A]/40')}>2 minutes ago</span>
            </DropdownMenuItem>
            <DropdownMenuItem className={cn(
              'flex flex-col items-start gap-1 py-3 rounded-xl mx-1',
              isDark ? 'focus:bg-white/5' : 'focus:bg-[#ebe3d3]/50'
            )}>
              <span className={cn('font-medium', isDark ? 'text-white' : 'text-[#5C4A2A]')}>Competitor Alert</span>
              <span className={cn('text-sm', isDark ? 'text-white/60' : 'text-[#5C4A2A]/60')}>
                Grainger announced new AI initiative
              </span>
              <span className={cn('text-xs', isDark ? 'text-white/40' : 'text-[#5C4A2A]/40')}>1 hour ago</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className={isDark ? 'bg-white/10' : 'bg-[#5C4A2A]/10'} />
            <DropdownMenuItem className={cn(
              'justify-center font-medium rounded-xl mx-1',
              isDark ? 'text-cyan-400 focus:bg-white/5' : 'text-[#8B7355] focus:bg-[#ebe3d3]/50'
            )}>
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                'rounded-2xl h-10 w-10 backdrop-blur-sm border transition-all duration-500',
                isDark
                  ? 'bg-white/5 border-white/10 hover:bg-white/10'
                  : 'bg-white/50 border-[#5C4A2A]/10 hover:bg-white/70'
              )}
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className={cn(
                  'text-sm',
                  isDark
                    ? 'bg-gradient-to-br from-cyan-500 to-purple-500 text-black'
                    : 'bg-gradient-to-br from-[#8B7355] to-[#5C4A2A] text-white'
                )}>
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className={cn(
            'backdrop-blur-xl shadow-xl rounded-2xl',
            isDark
              ? 'bg-[#1a1a1a]/95 border-white/10'
              : 'bg-white/90 border-[#5C4A2A]/10'
          )}>
            <DropdownMenuLabel className="py-2">
              <div className={cn('font-medium', isDark ? 'text-white' : 'text-[#5C4A2A]')}>
                {user?.name || 'User'}
              </div>
              <div className={cn('text-xs font-normal', isDark ? 'text-white/60' : 'text-[#5C4A2A]/60')}>
                {user?.email}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className={isDark ? 'bg-white/10' : 'bg-[#5C4A2A]/10'} />
            <DropdownMenuItem className={cn(
              'rounded-xl mx-1 gap-2',
              isDark ? 'text-white/70 focus:bg-white/5' : 'text-[#5C4A2A]/70 focus:bg-[#ebe3d3]/50'
            )}>
              <Settings className="h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem className={cn(
              'rounded-xl mx-1 gap-2',
              isDark ? 'text-white/70 focus:bg-white/5' : 'text-[#5C4A2A]/70 focus:bg-[#ebe3d3]/50'
            )}>
              <HelpCircle className="h-4 w-4" />
              Help
            </DropdownMenuItem>
            <DropdownMenuSeparator className={isDark ? 'bg-white/10' : 'bg-[#5C4A2A]/10'} />
            <DropdownMenuItem
              onClick={logout}
              className={cn(
                'rounded-xl mx-1 gap-2',
                isDark ? 'text-red-400 focus:bg-red-500/10' : 'text-red-600 focus:bg-red-50'
              )}
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
