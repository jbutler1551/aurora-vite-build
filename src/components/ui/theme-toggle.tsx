'use client';

import { useTheme } from '@/lib/theme-context';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className="relative group"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {/* Outer carved container - the "carved into screen" effect */}
      <div className={`
        relative w-16 h-8 rounded-full
        transition-all duration-500 ease-out
        ${isDark
          ? 'bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a] shadow-[inset_0_4px_8px_rgba(0,0,0,0.8),inset_0_-2px_4px_rgba(255,255,255,0.05),0_0_20px_rgba(0,255,200,0.3)]'
          : 'bg-gradient-to-b from-[#c9b896] to-[#bfae8c] shadow-[inset_0_4px_8px_rgba(0,0,0,0.3),inset_0_-2px_4px_rgba(255,255,255,0.4),0_0_15px_rgba(92,74,42,0.2)]'
        }
      `}>
        {/* Inner track - deeper carved effect */}
        <div className={`
          absolute inset-[3px] rounded-full
          transition-all duration-500
          ${isDark
            ? 'bg-gradient-to-b from-[#050505] to-[#111] shadow-[inset_0_2px_6px_rgba(0,0,0,0.9)]'
            : 'bg-gradient-to-b from-[#a89878] to-[#b8a888] shadow-[inset_0_2px_6px_rgba(0,0,0,0.25)]'
          }
        `}>
          {/* Glow effect behind the knob when in dark mode */}
          {isDark && (
            <div className="absolute inset-0 rounded-full overflow-hidden">
              <div className={`
                absolute w-8 h-8 rounded-full
                transition-all duration-500 ease-out
                ${isDark ? 'left-[calc(100%-26px)]' : 'left-[2px]'}
                top-1/2 -translate-y-1/2
                bg-gradient-to-r from-cyan-400 via-emerald-400 to-purple-500
                blur-md opacity-60
                animate-pulse
              `} />
            </div>
          )}

          {/* The sliding knob */}
          <div className={`
            absolute w-[22px] h-[22px] rounded-full
            top-1/2 -translate-y-1/2
            transition-all duration-500 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)]
            flex items-center justify-center
            ${isDark
              ? 'left-[calc(100%-24px)] bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] shadow-[0_2px_8px_rgba(0,0,0,0.5),0_0_15px_rgba(0,255,200,0.4),inset_0_1px_2px_rgba(255,255,255,0.1)]'
              : 'left-[2px] bg-gradient-to-br from-[#F5EFE4] via-white to-[#F5EFE4] shadow-[0_2px_8px_rgba(0,0,0,0.2),inset_0_1px_2px_rgba(255,255,255,0.8)]'
            }
          `}>
            {/* Icon inside the knob */}
            <div className={`
              transition-all duration-500
              ${isDark ? 'rotate-0 scale-100' : 'rotate-180 scale-100'}
            `}>
              {isDark ? (
                <Moon className="w-3 h-3 text-cyan-400 drop-shadow-[0_0_4px_rgba(0,255,255,0.8)]" />
              ) : (
                <Sun className="w-3 h-3 text-[#8B7355]" />
              )}
            </div>

            {/* Subtle ring on knob */}
            <div className={`
              absolute inset-[2px] rounded-full border
              transition-all duration-500
              ${isDark
                ? 'border-cyan-500/30'
                : 'border-[#5C4A2A]/10'
              }
            `} />
          </div>
        </div>

        {/* Carved edge highlight */}
        <div className={`
          absolute inset-0 rounded-full
          transition-opacity duration-500
          ${isDark
            ? 'bg-gradient-to-b from-transparent via-transparent to-[rgba(0,255,200,0.05)]'
            : 'bg-gradient-to-b from-white/20 via-transparent to-transparent'
          }
          pointer-events-none
        `} />
      </div>

      {/* Hover glow effect */}
      <div className={`
        absolute -inset-2 rounded-full opacity-0 group-hover:opacity-100
        transition-opacity duration-300
        ${isDark
          ? 'bg-gradient-to-r from-cyan-500/10 via-emerald-500/10 to-purple-500/10 blur-lg'
          : 'bg-[#5C4A2A]/5 blur-lg'
        }
        pointer-events-none
      `} />
    </button>
  );
}
