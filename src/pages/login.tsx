import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTheme } from '@/lib/theme-context';
import { useAuth } from '@/lib/auth-context';
import { AuthLayout } from '@/components/layout/auth-layout';
import { Mail, Lock, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className={`text-3xl font-bold mb-3 ${
            isDark ? 'text-white' : 'text-[#3D3124]'
          }`}>
            Welcome back
          </h1>
          <p className={`text-base ${
            isDark ? 'text-white/60' : 'text-[#5C4A2A]/60'
          }`}>
            Sign in to continue to your dashboard
          </p>
        </div>

        {/* Auth Card */}
        <div className={`relative overflow-hidden rounded-2xl p-6 backdrop-blur-xl border shadow-xl transition-all duration-500 ${
          isDark
            ? 'bg-white/[0.03] border-white/10 shadow-black/20'
            : 'bg-white/50 border-white/60 shadow-[#5C4A2A]/5'
        }`}>
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className={`text-sm font-medium ${isDark ? 'text-white/80' : 'text-[#3D3124]'}`}>
                Email address
              </Label>
              <div className="relative">
                <Mail className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 ${
                  isDark ? 'text-white/40' : 'text-[#5C4A2A]/40'
                }`} />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={`pl-10 h-12 rounded-xl transition-all ${
                    isDark
                      ? 'bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:bg-white/[0.07] focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20'
                      : 'bg-white/70 border-[#5C4A2A]/10 text-[#3D3124] placeholder:text-[#5C4A2A]/40 focus:bg-white focus:border-[#5C4A2A]/30 focus:ring-1 focus:ring-[#5C4A2A]/10'
                  }`}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className={`text-sm font-medium ${isDark ? 'text-white/80' : 'text-[#3D3124]'}`}>
                  Password
                </Label>
                <Link
                  to="/forgot-password"
                  className={`text-sm font-medium hover:underline transition-colors ${
                    isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-[#5C4A2A] hover:text-[#3D3124]'
                  }`}
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 ${
                  isDark ? 'text-white/40' : 'text-[#5C4A2A]/40'
                }`} />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={`pl-10 pr-10 h-12 rounded-xl transition-all ${
                    isDark
                      ? 'bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:bg-white/[0.07] focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20'
                      : 'bg-white/70 border-[#5C4A2A]/10 text-[#3D3124] placeholder:text-[#5C4A2A]/40 focus:bg-white focus:border-[#5C4A2A]/30 focus:ring-1 focus:ring-[#5C4A2A]/10'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3.5 top-1/2 -translate-y-1/2 ${
                    isDark ? 'text-white/40 hover:text-white/60' : 'text-[#5C4A2A]/40 hover:text-[#5C4A2A]/60'
                  }`}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className={`text-sm p-3 rounded-xl ${
                isDark
                  ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                  : 'bg-red-50 text-red-600 border border-red-200'
              }`}>
                {error}
              </div>
            )}

            {/* Submit button */}
            <Button
              type="submit"
              disabled={isLoading}
              className={`w-full h-12 rounded-xl font-semibold text-base transition-all duration-300 ${
                isDark
                  ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-black shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40'
                  : 'bg-gradient-to-r from-[#5C4A2A] to-[#8B7355] hover:from-[#4A3A22] hover:to-[#7A6248] text-white shadow-lg shadow-[#5C4A2A]/20'
              }`}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Sign in
                  <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </form>
        </div>

        {/* Sign up link */}
        <p className={`text-center mt-6 text-sm ${
          isDark ? 'text-white/60' : 'text-[#5C4A2A]/60'
        }`}>
          Don't have an account?{' '}
          <Link
            to="/signup"
            className={`font-semibold hover:underline transition-colors ${
              isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-[#5C4A2A] hover:text-[#3D3124]'
            }`}
          >
            Sign up
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
