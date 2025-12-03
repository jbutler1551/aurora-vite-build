import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useTheme } from '@/lib/theme-context';
import { Menu, X } from 'lucide-react';

interface SiteNavProps {
  currentPage?: 'home' | 'why-aurora' | 'features' | 'pricing';
}

export function SiteNav({ currentPage }: SiteNavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const navLinks = [
    { href: '/why-aurora', label: 'Why Aurora', key: 'why-aurora' },
    { href: '/features', label: 'Features', key: 'features' },
    { href: '/pricing', label: 'Pricing', key: 'pricing' },
  ];

  return (
    <nav className={`
      relative z-50 border-b backdrop-blur-xl transition-colors duration-500
      ${isDark
        ? 'border-white/10 bg-black/30'
        : 'border-[#5C4A2A]/10 bg-white/30'
      }
    `}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-20 items-center justify-between">
          <Link to="/">
            <img
              src={isDark ? "/Aurora_logo_dark_v2.png" : "/Aurora_logo_v3.png"}
              alt="Aurora"
              className="h-8 sm:h-10 w-auto transition-opacity duration-300"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.key}
                to={link.href}
                className={`text-sm font-medium tracking-wide transition-colors duration-300 ${
                  isDark
                    ? currentPage === link.key
                      ? 'text-cyan-400'
                      : 'text-white/70 hover:text-cyan-400'
                    : currentPage === link.key
                      ? 'text-[#5C4A2A]'
                      : 'text-[#5C4A2A]/70 hover:text-[#5C4A2A]'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Theme Toggle - between Pricing and Enter Dashboard */}
            <ThemeToggle />

            <Link to="/dashboard">
              <Button className={`
                tracking-wide font-medium px-6 rounded-2xl transition-all duration-300 backdrop-blur-sm border
                ${isDark
                  ? 'bg-white/10 text-white border-white/20 hover:bg-white/15 hover:border-cyan-500/40 hover:shadow-lg hover:shadow-cyan-500/20'
                  : 'bg-[#5C4A2A]/10 text-[#5C4A2A] border-[#5C4A2A]/20 hover:bg-[#5C4A2A]/15 hover:border-[#5C4A2A]/40 hover:shadow-lg hover:shadow-[#5C4A2A]/15'
                }
              `}>
                Enter Dashboard
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-3">
            <ThemeToggle />
            <button
              className={`p-2 rounded-xl transition-colors ${
                isDark
                  ? 'hover:bg-white/10'
                  : 'hover:bg-[#5C4A2A]/10'
              }`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className={`h-6 w-6 ${isDark ? 'text-white' : 'text-[#5C4A2A]'}`} />
              ) : (
                <Menu className={`h-6 w-6 ${isDark ? 'text-white' : 'text-[#5C4A2A]'}`} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className={`
          md:hidden absolute top-full left-0 right-0 backdrop-blur-xl border-b shadow-xl transition-colors duration-300
          ${isDark
            ? 'bg-black/95 border-white/10'
            : 'bg-white/95 border-[#5C4A2A]/10'
          }
        `}>
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.key}
                to={link.href}
                className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                  isDark
                    ? currentPage === link.key
                      ? 'bg-cyan-500/20 text-cyan-400'
                      : 'text-white/70 hover:bg-white/5 hover:text-cyan-400'
                    : currentPage === link.key
                      ? 'bg-[#5C4A2A]/10 text-[#5C4A2A]'
                      : 'text-[#5C4A2A]/70 hover:bg-[#5C4A2A]/5 hover:text-[#5C4A2A]'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2">
              <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                <Button className={`
                  w-full tracking-wide font-medium py-3 rounded-xl transition-all duration-300 backdrop-blur-sm border
                  ${isDark
                    ? 'bg-white/10 text-white border-white/20 hover:bg-white/15 hover:border-cyan-500/40'
                    : 'bg-[#5C4A2A]/10 text-[#5C4A2A] border-[#5C4A2A]/20 hover:bg-[#5C4A2A]/15 hover:border-[#5C4A2A]/40'
                  }
                `}>
                  Enter Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
