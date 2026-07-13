import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, Shield, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { signIn } from '@/services/auth.service';
import { cn } from '@/utils/cn';

// ─── Schemas ──────────────────────────────────────────────────────────────────

const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

const forgotSchema = z.object({
  email: z.string().email('Enter a valid email address'),
});

type ForgotForm = z.infer<typeof forgotSchema>;

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminLogin() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const {
    register: regForgot,
    handleSubmit: handleForgot,
    formState: { errors: forgotErrors, isSubmitting: forgotSubmitting },
    reset: resetForgot,
  } = useForm<ForgotForm>({ resolver: zodResolver(forgotSchema) });

  const onSubmit = async (values: LoginForm) => {
    const result = await signIn(values.email, values.password);
    if (result.status === 'error') {
      toast.error(result.error ?? 'Sign in failed');
      return;
    }
    toast.success('Welcome back!');
    navigate('/admin/dashboard');
  };

  const onForgot = async (_values: ForgotForm) => {
    // In a real app, call supabase.auth.resetPasswordForEmail
    await new Promise((r) => setTimeout(r, 800));
    setForgotSent(true);
    toast.success('Reset link sent! Check your email.');
  };

  const closeForgot = () => {
    setForgotOpen(false);
    setForgotSent(false);
    resetForgot();
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* ── Left panel (gradient) ── */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-gradient-to-br from-[#0056A6] to-[#003d7a] relative overflow-hidden">
        {/* decorative circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5" />
        <div className="absolute -bottom-32 -left-16 w-80 h-80 rounded-full bg-white/5" />
        <div className="absolute top-1/3 right-12 w-48 h-48 rounded-full bg-[#D72638]/20" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-white font-bold text-xl tracking-wide">DENCAST GLOBAL</span>
          </div>

          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Content Management
            <br />
            <span className="text-[#D72638]">Admin Portal</span>
          </h1>
          <p className="text-blue-200 text-lg leading-relaxed max-w-sm">
            Manage your website content, portfolio, blog posts, and more from one powerful dashboard.
          </p>
        </div>

        <div className="relative z-10 space-y-3">
          {[
            'Real-time content updates',
            'Media library management',
            'Analytics & insights',
          ].map((feat) => (
            <div key={feat} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-[#D72638] flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-blue-100 text-sm">{feat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right panel (form) ── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-[#0056A6] flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-[#0056A6] font-bold text-lg tracking-wide">DENCAST GLOBAL</span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Sign in</h2>
            <p className="text-gray-500 mt-1">Admin Portal — authorized personnel only</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 pointer-events-none" style={{ width: 18, height: 18 }} />
                <input
                  type="email"
                  autoComplete="email"
                  placeholder="admin@dencastglobal.com"
                  {...register('email')}
                  className={cn(
                    'w-full pl-10 pr-4 py-3 rounded-xl border bg-gray-50 text-gray-900 placeholder-gray-400 text-sm transition-colors outline-none',
                    'focus:ring-2 focus:ring-[#0056A6]/30 focus:border-[#0056A6] focus:bg-white',
                    errors.email ? 'border-red-400 bg-red-50' : 'border-gray-200'
                  )}
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" style={{ width: 18, height: 18 }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  {...register('password')}
                  className={cn(
                    'w-full pl-10 pr-11 py-3 rounded-xl border bg-gray-50 text-gray-900 placeholder-gray-400 text-sm transition-colors outline-none',
                    'focus:ring-2 focus:ring-[#0056A6]/30 focus:border-[#0056A6] focus:bg-white',
                    errors.password ? 'border-red-400 bg-red-50' : 'border-gray-200'
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff style={{ width: 18, height: 18 }} /> : <Eye style={{ width: 18, height: 18 }} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-600">{errors.password.message}</p>
              )}
            </div>

            {/* Forgot password */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setForgotOpen(true)}
                className="text-sm text-[#0056A6] hover:text-[#003d7a] font-medium transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                'w-full py-3 rounded-xl text-white font-semibold text-sm transition-all',
                'bg-[#0056A6] hover:bg-[#004a8f] active:scale-[0.98]',
                'focus:outline-none focus:ring-2 focus:ring-[#0056A6]/40 focus:ring-offset-2',
                isSubmitting && 'opacity-70 cursor-not-allowed'
              )}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Signing in…
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-gray-400">
            © {new Date().getFullYear()} Dencast Global · All rights reserved
          </p>
        </div>
      </div>

      {/* ── Forgot Password Modal ── */}
      {forgotOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
            <button
              onClick={closeForgot}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {forgotSent ? (
              <div className="text-center py-4">
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Check your email</h3>
                <p className="text-gray-500 text-sm">
                  We've sent a password reset link to your email address.
                </p>
                <button
                  onClick={closeForgot}
                  className="mt-6 w-full py-2.5 rounded-xl bg-[#0056A6] text-white text-sm font-semibold hover:bg-[#004a8f] transition-colors"
                >
                  Back to Sign In
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold text-gray-900 mb-1">Reset password</h3>
                <p className="text-gray-500 text-sm mb-5">
                  Enter your email and we'll send you a reset link.
                </p>

                <form onSubmit={handleForgot(onForgot)} noValidate className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Email address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" style={{ width: 18, height: 18 }} />
                      <input
                        type="email"
                        {...regForgot('email')}
                        placeholder="admin@dencastglobal.com"
                        className={cn(
                          'w-full pl-10 pr-4 py-3 rounded-xl border bg-gray-50 text-sm outline-none transition-colors',
                          'focus:ring-2 focus:ring-[#0056A6]/30 focus:border-[#0056A6]',
                          forgotErrors.email ? 'border-red-400' : 'border-gray-200'
                        )}
                      />
                    </div>
                    {forgotErrors.email && (
                      <p className="mt-1.5 text-xs text-red-600">{forgotErrors.email.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={forgotSubmitting}
                    className="w-full py-3 rounded-xl bg-[#0056A6] text-white text-sm font-semibold hover:bg-[#004a8f] transition-colors disabled:opacity-70"
                  >
                    {forgotSubmitting ? 'Sending…' : 'Send reset link'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
