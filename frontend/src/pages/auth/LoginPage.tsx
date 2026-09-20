import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, BriefcaseBusiness, Building2, Loader2, Mail } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Button } from '../../components/ui/Button';
import { GoogleIcon } from '../../components/ui/GoogleIcon';
import { Input } from '../../components/ui/Fields';
import { Modal } from '../../components/ui/Modal';
import { PasswordInput } from '../../components/ui/PasswordInput';
import { roleDashboard, useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { AuthLayout } from './AuthLayout';
import type { ApiError, Role } from '../../types/domain';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
          }) => void;
          prompt: (notification?: (notification: {
            isNotDisplayed: () => boolean;
            isSkippedMoment: () => boolean;
            isDismissedMoment: () => boolean;
            getNotDisplayedReason: () => string;
            getSkippedReason: () => string;
            getDismissedReason: () => string;
          }) => void) => void;
          renderButton: (
            parent: HTMLElement,
            options: {
              type?: string;
              theme?: string;
              size?: string;
              text?: string;
              shape?: string;
              width?: string | number;
            }
          ) => void;
        };
      };
    };
  }
}

const schema = z.object({
  email: z.string().email('Please enter a valid email.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
  remember: z.boolean().optional()
});

type FormValues = z.infer<typeof schema>;

const DEFAULT_GOOGLE_CLIENT_ID = '554655172126-g4lnhap8nf22289ikh6g8dqp0nqfmcir.apps.googleusercontent.com';

export function LoginPage() {
  const googleClientId = (
    import.meta.env.VITE_GOOGLE_CLIENT_ID || DEFAULT_GOOGLE_CLIENT_ID
  ).trim();
  const { login, loginWithGoogle, user, dashboardPath } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');
  const [googleError, setGoogleError] = useState('');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [pendingGoogleToken, setPendingGoogleToken] = useState<string | null>(null);
  const [pendingGoogleUser, setPendingGoogleUser] = useState<{ name: string; email: string } | null>(null);
  const [isSubmittingRole, setIsSubmittingRole] = useState(false);
  const googleHiddenButtonRef = useRef<HTMLDivElement>(null);

  const { register, handleSubmit, formState } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { remember: true }
  });

  // Handle successful Google ID token response
  const handleGoogleCredential = async (idToken: string) => {
    setIsGoogleLoading(true);
    setGoogleError('');
    try {
      const auth = await loginWithGoogle(idToken);
      if (auth.roleRequired) {
        setPendingGoogleToken(idToken);
        setPendingGoogleUser({
          name: auth.name || 'User',
          email: auth.email
        });
        setShowRoleModal(true);
      } else {
        notify('Signed in with Google successfully.', 'success');
        const from = (location.state as { from?: { pathname: string; search?: string } } | null)?.from;
        navigate(from ? `${from.pathname}${from.search ?? ''}` : roleDashboard(auth.role!), { replace: true });
      }
    } catch (err) {
      setGoogleError((err as ApiError).message || 'Failed to authenticate with Google. Please try again.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleGoogleCredentialRef = useRef(handleGoogleCredential);
  handleGoogleCredentialRef.current = handleGoogleCredential;

  // Initialize Google Identity Services
  useEffect(() => {
    if (!googleClientId || googleClientId.includes('your-google-oauth-client-id')) {
      return;
    }

    const initGsi = () => {
      if (!window.google?.accounts?.id) return;

      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: (res: { credential: string }) => {
          handleGoogleCredentialRef.current(res.credential);
        }
      });

      if (googleHiddenButtonRef.current) {
        googleHiddenButtonRef.current.innerHTML = '';
        window.google.accounts.id.renderButton(googleHiddenButtonRef.current, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          width: 280
        });
      }
    };

    if (window.google?.accounts?.id) {
      initGsi();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = initGsi;
    document.head.appendChild(script);
  }, [googleClientId]);

  // Trigger Google Sign-In on custom button click
  const handleGoogleSignInClick = () => {
    setGoogleError('');

    if (!googleClientId || googleClientId.includes('your-google-oauth-client-id')) {
      setGoogleError('Google Sign-In is not configured yet. Please set VITE_GOOGLE_CLIENT_ID in the .env file.');
      return;
    }

    if (!window.google?.accounts?.id) {
      setGoogleError('Google Sign-In service is loading. Please try again in a moment.');
      return;
    }

    setIsGoogleLoading(true);

    const hiddenBtn = googleHiddenButtonRef.current?.querySelector('div[role="button"]') as HTMLElement | null;
    if (hiddenBtn) {
      hiddenBtn.click();
      setTimeout(() => setIsGoogleLoading(false), 2000);
    } else {
      window.google.accounts.id.prompt((notification) => {
        setIsGoogleLoading(false);
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          setGoogleError('Google Sign-In prompt could not be opened. Please verify popup settings or try again.');
        }
      });
    }
  };

  // Complete registration with selected role for new Google users
  const handleRoleSelection = async (selectedRole: Role) => {
    if (!pendingGoogleToken) return;
    setIsSubmittingRole(true);
    setGoogleError('');
    try {
      const auth = await loginWithGoogle(pendingGoogleToken, selectedRole);
      notify('Account created with Google successfully.', 'success');
      setShowRoleModal(false);
      const from = (location.state as { from?: { pathname: string; search?: string } } | null)?.from;
      navigate(from ? `${from.pathname}${from.search ?? ''}` : roleDashboard(auth.role || selectedRole), {
        replace: true
      });
    } catch (err) {
      setGoogleError((err as ApiError).message || 'Failed to complete registration. Please try again.');
    } finally {
      setIsSubmittingRole(false);
    }
  };

  async function onSubmit(values: FormValues) {
    setError('');
    try {
      const auth = await login({ email: values.email, password: values.password }, values.remember !== false);
      notify('Signed in successfully.', 'success');
      const from = (location.state as { from?: { pathname: string; search?: string } } | null)?.from;
      navigate(from ? `${from.pathname}${from.search ?? ''}` : roleDashboard(auth.role), { replace: true });
    } catch (err) {
      setError((err as ApiError).message);
    }
  }

  if (user) {
    return <Navigate to={dashboardPath} replace />;
  }

  return (
    <AuthLayout>
      <h1 className="text-3xl font-extrabold text-ink dark:text-white">Welcome back</h1>
      <p className="mt-2 text-sm text-muted dark:text-slate-400">Sign in to continue to CareerLink.</p>

      {error ? (
        <p className="mt-4 rounded-md bg-red-50 dark:bg-red-950/40 p-3 text-sm font-medium text-red-700 dark:text-red-300" role="alert">
          {error}
        </p>
      ) : null}

      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          icon={Mail}
          required
          error={formState.errors.email?.message}
          {...register('email')}
        />
        <PasswordInput
          label="Password"
          autoComplete="current-password"
          error={formState.errors.password?.message}
          {...register('password')}
        />
        <div className="flex items-center justify-between gap-3 text-sm">
          <label className="inline-flex items-center gap-2 text-muted">
            <input type="checkbox" className="rounded border-line" defaultChecked {...register('remember')} />
            Remember me
          </label>
          <span className="font-semibold text-muted" title="Password reset is not available on the current auth API.">
            Forgot password is not available
          </span>
        </div>
        <Button className="w-full" disabled={formState.isSubmitting}>
          {formState.isSubmitting ? 'Signing in…' : 'Sign In'}
        </Button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-line" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-canvas dark:bg-slate-900 px-3 font-semibold tracking-wider text-muted dark:text-slate-400">OR</span>
        </div>
      </div>

      {googleError ? (
        <div className="mb-4 flex items-start gap-2 rounded-md bg-red-50 dark:bg-red-950/40 p-3 text-sm text-red-700 dark:text-red-300" role="alert">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600 dark:text-red-400" />
          <span>{googleError}</span>
        </div>
      ) : null}

      <div className="relative w-full">
        <button
          type="button"
          id="google-signin-btn"
          onClick={handleGoogleSignInClick}
          disabled={isGoogleLoading || formState.isSubmitting}
          className="flex w-full items-center justify-center gap-3 rounded-md border border-line dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm font-semibold text-ink dark:text-slate-100 shadow-sm transition hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-brand-300 dark:hover:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isGoogleLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted" />
          ) : (
            <GoogleIcon size={18} />
          )}
          <span>{isGoogleLoading ? 'Connecting to Google…' : 'Continue with Google'}</span>
        </button>

        {/* Seamless interactive overlay for Google Identity Services */}
        <div
          ref={googleHiddenButtonRef}
          className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden opacity-[0.0001]"
          style={{ width: '100%', height: '100%', cursor: 'pointer' }}
          aria-hidden="true"
        />
      </div>

      <p className="mt-5 text-center text-sm text-muted">
        Don&apos;t have an account?{' '}
        <Link className="font-bold text-brand-700" to="/register">
          Create account
        </Link>
      </p>

      {/* Role Selection Modal for new Google users */}
      <Modal
        open={showRoleModal}
        title="Complete Your Registration"
        onClose={() => {
          if (!isSubmittingRole) {
            setShowRoleModal(false);
          }
        }}
      >
        <div className="space-y-4">
          <p className="text-sm text-muted dark:text-slate-400">
            Welcome <strong className="text-ink dark:text-white">{pendingGoogleUser?.name}</strong>! Choose how you want to use
            CareerLink with <span className="font-semibold text-ink dark:text-slate-200">{pendingGoogleUser?.email}</span>.
          </p>

          <div className="grid gap-3 pt-1">
            <button
              type="button"
              disabled={isSubmittingRole}
              onClick={() => handleRoleSelection('CANDIDATE')}
              className="flex items-start gap-4 rounded-lg border border-line dark:border-slate-600 bg-white dark:bg-slate-800 p-4 text-left transition hover:border-brand-500 dark:hover:border-brand-400 hover:shadow-soft focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:opacity-60"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-brand-50 text-brand-700">
                <BriefcaseBusiness className="h-5 w-5" />
              </span>
              <div>
                <span className="block font-bold text-ink dark:text-white">Job Seeker</span>
                <span className="mt-0.5 block text-xs text-muted dark:text-slate-400">Find jobs, apply, and grow your career.</span>
              </div>
            </button>

            <button
              type="button"
              disabled={isSubmittingRole}
              onClick={() => handleRoleSelection('RECRUITER')}
              className="flex items-start gap-4 rounded-lg border border-line dark:border-slate-600 bg-white dark:bg-slate-800 p-4 text-left transition hover:border-brand-500 dark:hover:border-brand-400 hover:shadow-soft focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:opacity-60"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-brand-50 text-brand-700">
                <Building2 className="h-5 w-5" />
              </span>
              <div>
                <span className="block font-bold text-ink dark:text-white">Recruiter</span>
                <span className="mt-0.5 block text-xs text-muted dark:text-slate-400">Hire talent and build your team.</span>
              </div>
            </button>
          </div>

          {isSubmittingRole ? (
            <p className="flex items-center justify-center gap-2 pt-2 text-xs font-semibold text-brand-700">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Setting up your CareerLink account…
            </p>
          ) : null}
        </div>
      </Modal>
    </AuthLayout>
  );
}
