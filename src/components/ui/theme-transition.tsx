'use client';

import { useTheme } from '@/lib/theme-context';
import { useEffect, useState } from 'react';

export function ThemeTransition() {
  const { theme, isTransitioning } = useTheme();
  const [showTransition, setShowTransition] = useState(false);
  const [transitionPhase, setTransitionPhase] = useState<'idle' | 'splash' | 'spread' | 'fade'>('idle');
  const [previousTheme, setPreviousTheme] = useState(theme);

  useEffect(() => {
    if (isTransitioning) {
      setPreviousTheme(theme === 'dark' ? 'light' : 'dark');
      setShowTransition(true);
      setTransitionPhase('splash');

      // Splash expands
      setTimeout(() => setTransitionPhase('spread'), 50);

      // Begin fade out
      setTimeout(() => setTransitionPhase('fade'), 800);

      // Complete
      setTimeout(() => {
        setShowTransition(false);
        setTransitionPhase('idle');
      }, 1200);
    }
  }, [isTransitioning, theme]);

  if (!showTransition) return null;

  const isDarkTransition = theme === 'dark'; // Transitioning TO dark

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {/* Main splash wave */}
      <div
        className={`
          absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
          rounded-full
          transition-all
          ${transitionPhase === 'splash' ? 'w-0 h-0 opacity-100' : ''}
          ${transitionPhase === 'spread' ? 'w-[300vmax] h-[300vmax] opacity-100' : ''}
          ${transitionPhase === 'fade' ? 'w-[300vmax] h-[300vmax] opacity-0' : ''}
          ${isDarkTransition
            ? 'bg-gradient-radial from-[#0a0a0a] via-[#111] to-[#0a0a0a]'
            : 'bg-gradient-radial from-[#F5EFE4] via-[#ebe3d3] to-[#F5EFE4]'
          }
        `}
        style={{
          transitionProperty: 'width, height, opacity',
          transitionDuration: transitionPhase === 'spread' ? '800ms' : '400ms',
          transitionTimingFunction: transitionPhase === 'spread'
            ? 'cubic-bezier(0.22, 1, 0.36, 1)'
            : 'ease-out',
        }}
      />

      {/* Aurora color streaks for dark mode transition */}
      {isDarkTransition && transitionPhase !== 'idle' && (
        <>
          {/* Cyan streak */}
          <div
            className={`
              absolute top-1/2 left-1/2
              w-[200vmax] h-[40vmax]
              -translate-x-1/2 -translate-y-1/2
              rotate-[25deg]
              transition-all
              ${transitionPhase === 'splash' ? 'scale-0 opacity-0' : ''}
              ${transitionPhase === 'spread' ? 'scale-100 opacity-60' : ''}
              ${transitionPhase === 'fade' ? 'scale-100 opacity-0' : ''}
            `}
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(0,255,255,0.3), rgba(0,200,255,0.2), transparent)',
              filter: 'blur(40px)',
              transitionDuration: transitionPhase === 'spread' ? '900ms' : '400ms',
              transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
              transitionDelay: '100ms',
            }}
          />

          {/* Emerald streak */}
          <div
            className={`
              absolute top-1/2 left-1/2
              w-[180vmax] h-[30vmax]
              -translate-x-1/2 -translate-y-1/2
              -rotate-[15deg]
              transition-all
              ${transitionPhase === 'splash' ? 'scale-0 opacity-0' : ''}
              ${transitionPhase === 'spread' ? 'scale-100 opacity-50' : ''}
              ${transitionPhase === 'fade' ? 'scale-100 opacity-0' : ''}
            `}
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(0,255,150,0.25), rgba(100,255,200,0.2), transparent)',
              filter: 'blur(50px)',
              transitionDuration: transitionPhase === 'spread' ? '850ms' : '400ms',
              transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
              transitionDelay: '150ms',
            }}
          />

          {/* Purple/magenta streak */}
          <div
            className={`
              absolute top-1/2 left-1/2
              w-[160vmax] h-[35vmax]
              -translate-x-1/2 -translate-y-1/2
              rotate-[45deg]
              transition-all
              ${transitionPhase === 'splash' ? 'scale-0 opacity-0' : ''}
              ${transitionPhase === 'spread' ? 'scale-100 opacity-40' : ''}
              ${transitionPhase === 'fade' ? 'scale-100 opacity-0' : ''}
            `}
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(180,100,255,0.3), rgba(255,100,200,0.2), transparent)',
              filter: 'blur(45px)',
              transitionDuration: transitionPhase === 'spread' ? '950ms' : '400ms',
              transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
              transitionDelay: '200ms',
            }}
          />
        </>
      )}

      {/* Warm light streaks for light mode transition */}
      {!isDarkTransition && transitionPhase !== 'idle' && (
        <>
          {/* Golden warm streak */}
          <div
            className={`
              absolute top-1/2 left-1/2
              w-[200vmax] h-[40vmax]
              -translate-x-1/2 -translate-y-1/2
              rotate-[20deg]
              transition-all
              ${transitionPhase === 'splash' ? 'scale-0 opacity-0' : ''}
              ${transitionPhase === 'spread' ? 'scale-100 opacity-50' : ''}
              ${transitionPhase === 'fade' ? 'scale-100 opacity-0' : ''}
            `}
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(212,196,168,0.5), rgba(201,184,150,0.4), transparent)',
              filter: 'blur(40px)',
              transitionDuration: transitionPhase === 'spread' ? '900ms' : '400ms',
              transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
              transitionDelay: '100ms',
            }}
          />

          {/* Cream highlight streak */}
          <div
            className={`
              absolute top-1/2 left-1/2
              w-[180vmax] h-[30vmax]
              -translate-x-1/2 -translate-y-1/2
              -rotate-[10deg]
              transition-all
              ${transitionPhase === 'splash' ? 'scale-0 opacity-0' : ''}
              ${transitionPhase === 'spread' ? 'scale-100 opacity-60' : ''}
              ${transitionPhase === 'fade' ? 'scale-100 opacity-0' : ''}
            `}
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), rgba(245,239,228,0.5), transparent)',
              filter: 'blur(50px)',
              transitionDuration: transitionPhase === 'spread' ? '850ms' : '400ms',
              transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
              transitionDelay: '150ms',
            }}
          />
        </>
      )}

      {/* Particle sparkles during transition */}
      {transitionPhase === 'spread' && (
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className={`
                absolute w-1 h-1 rounded-full
                animate-ping
                ${isDarkTransition
                  ? 'bg-cyan-400'
                  : 'bg-[#8B7355]'
                }
              `}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 500}ms`,
                animationDuration: '600ms',
                opacity: 0.6,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
