import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTheme } from '@/lib/theme-context';
import { useAuth } from '@/lib/auth-context';
import { AuthLayout } from '@/components/layout/auth-layout';
import { Mail, Lock, User, ArrowRight, Loader2, Check, Eye, EyeOff } from 'lucide-react';

export default function SignupPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const passwordRequirements = [
    { text: '8+ characters', met: password.length >= 8 },
    { text: 'Number', met: /\d/.test(password) },
    { text: 'Uppercase', met: /[A-Z]/.test(password) },
  ];

  const allRequirementsMet = passwordRequirements.every(req => req.met);
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!allRequirementsMet) {
      setError('Password does not meet requirements');
      return;
    }

    if (!passwordsMatch) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      await signup(name, email, password);
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
            Create your account
          </h1>
          <p className={`text-base ${
            isDark ? 'text-white/60' : 'text-[#5C4A2A]/60'
          }`}>
            Get started with Aurora today
          </p>
        </div>

        {/* Auth Card */}
        <div className={`relative overflow-hidden rounded-2xl p-6 backdrop-blur-xl border shadow-xl transition-all duration-500 ${
          isDark
            ? 'bg-white/[0.03] border-white/10 shadow-black/20'
            : 'bg-white/50 border-white/60 shadow-[#5C4A2A]/5'
        }`}>
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className={`text-sm font-medium ${isDark ? 'text-white/80' : 'text-[#3D3124]'}`}>
                Full name
              </Label>
              <div className="relative">
                <User className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 ${
                  isDark ? 'text-white/40' : 'text-[#5C4A2A]/40'
                }`} />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Smith"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className={`pl-10 h-12 rounded-xl transition-all ${
                    isDark
                      ? 'bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:bg-white/[0.07] focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20'
                      : 'bg-white/70 border-[#5C4A2A]/10 text-[#3D3124] placeholder:text-[#5C4A2A]/40 focus:bg-white focus:border-[#5C4A2A]/30 focus:ring-1 focus:ring-[#5C4A2A]/10'
                  }`}
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className={`text-sm font-medium ${isDark ? 'text-white/80' : 'text-[#3D3124]'}`}>
                Work email
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
              <Label htmlFor="password" className={`text-sm font-medium ${isDark ? 'text-white/80' : 'text-[#3D3124]'}`}>
                Password
              </Label>
              <div className="relative">
                <Lock className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 ${
                  isDark ? 'text-white/40' : 'text-[#5C4A2A]/40'
                }`} />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
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
              {/* Password requirements - inline */}
              {password && (
                <div className="flex items-center gap-3 pt-1">
                  {passwordRequirements.map((req, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${
                        req.met
                          ? isDark ? 'bg-cyan-500/20 text-cyan-400' : 'bg-emerald-100 text-emerald-600'
                          : isDark ? 'bg-white/5 text-white/30' : 'bg-gray-100 text-gray-400'
                      }`}>
                        <Check className="w-2.5 h-2.5" />
                      </div>
                      <span className={`text-xs ${
                        req.met
                          ? isDark ? 'text-cyan-400' : 'text-emerald-600'
                          : isDark ? 'text-white/40' : 'text-gray-400'
                      }`}>
                        {req.text}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className={`text-sm font-medium ${isDark ? 'text-white/80' : 'text-[#3D3124]'}`}>
                Confirm password
              </Label>
              <div className="relative">
                <Lock className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 ${
                  isDark ? 'text-white/40' : 'text-[#5C4A2A]/40'
                }`} />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className={`pl-10 pr-10 h-12 rounded-xl transition-all ${
                    isDark
                      ? 'bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:bg-white/[0.07] focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20'
                      : 'bg-white/70 border-[#5C4A2A]/10 text-[#3D3124] placeholder:text-[#5C4A2A]/40 focus:bg-white focus:border-[#5C4A2A]/30 focus:ring-1 focus:ring-[#5C4A2A]/10'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={`absolute right-3.5 top-1/2 -translate-y-1/2 ${
                    isDark ? 'text-white/40 hover:text-white/60' : 'text-[#5C4A2A]/40 hover:text-[#5C4A2A]/60'
                  }`}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {/* Password match indicator */}
              {confirmPassword && (
                <div className="flex items-center gap-1.5 pt-1">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${
                    passwordsMatch
                      ? isDark ? 'bg-cyan-500/20 text-cyan-400' : 'bg-emerald-100 text-emerald-600'
                      : isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-500'
                  }`}>
                    <Check className="w-2.5 h-2.5" />
                  </div>
                  <span className={`text-xs ${
                    passwordsMatch
                      ? isDark ? 'text-cyan-400' : 'text-emerald-600'
                      : isDark ? 'text-red-400' : 'text-red-500'
                  }`}>
                    {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
                  </span>
                </div>
              )}
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
                  Create account
                  <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>

            {/* Terms */}
            <p className={`text-xs text-center leading-relaxed ${
              isDark ? 'text-white/40' : 'text-[#5C4A2A]/40'
            }`}>
              By signing up, you agree to our{' '}
              <Link to="/terms" className={`underline hover:no-underline ${isDark ? 'text-white/60' : 'text-[#5C4A2A]/60'}`}>
                Terms
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className={`underline hover:no-underline ${isDark ? 'text-white/60' : 'text-[#5C4A2A]/60'}`}>
                Privacy Policy
              </Link>
            </p>
          </form>
        </div>

        {/* Sign in link */}
        <p className={`text-center mt-6 text-sm ${
          isDark ? 'text-white/60' : 'text-[#5C4A2A]/60'
        }`}>
          Already have an account?{' '}
          <Link
            to="/login"
            className={`font-semibold hover:underline transition-colors ${
              isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-[#5C4A2A] hover:text-[#3D3124]'
            }`}
          >
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
