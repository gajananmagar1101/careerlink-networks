import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, BriefcaseBusiness, Building2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { z } from 'zod';
import { authApi } from '../../api/authApi';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Fields';
import { PasswordInput } from '../../components/ui/PasswordInput';
import { PasswordStrength } from '../../components/ui/PasswordStrength';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { AuthLayout } from './AuthLayout';
import type { ApiError, Role } from '../../types/domain';

const roleMeta = {
  CANDIDATE: {
    title: 'Job Seeker',
    description: 'Find jobs, apply, and grow your career.',
    icon: BriefcaseBusiness
  },
  RECRUITER: {
    title: 'Recruiter',
    description: 'Hire talent and build your team.',
    icon: Building2
  }
} as const;

const schema = z.object({
  name: z.string().min(2, 'Please enter your full name.'),
  email: z.string().email('Please enter a valid email.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
  confirmPassword: z.string(),
  terms: z.literal(true, { errorMap: () => ({ message: 'Please confirm you will use HireLink professionally.' }) })
}).refine((values) => values.password === values.confirmPassword, {
  message: 'Passwords do not match.',
  path: ['confirmPassword']
});

type FormValues = z.infer<typeof schema>;

export function RegisterPage() {
  const { user, dashboardPath } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const initialRole = params.get('role') === 'RECRUITER' ? 'RECRUITER' : params.get('role') === 'CANDIDATE' ? 'CANDIDATE' : null;
  const [role, setRole] = useState<Role | null>(initialRole);
  const [error, setError] = useState('');
  const { register, handleSubmit, formState, watch } = useForm<FormValues>({ resolver: zodResolver(schema) });
  const password = watch('password') ?? '';

  async function onSubmit(values: FormValues) {
    if (!role) return;
    setError('');
    try {
      await authApi.register({ name: values.name, email: values.email, password: values.password, role });
      notify('Account created. Please sign in.', 'success');
      navigate(`/login?role=${role}`);
    } catch (err) {
      setError((err as ApiError).message);
    }
  }

  if (user) {
    return <Navigate to={dashboardPath} replace />;
  }

  return (
    <AuthLayout>
      <h1 className="text-3xl font-extrabold text-ink dark:text-white">Create your HireLink account</h1>

      {!role ? (
        <>
          <p className="mt-2 text-sm text-muted">First, tell us how you plan to use HireLink.</p>
          <div className="mt-6 grid gap-4">
            {(Object.keys(roleMeta) as Role[]).map((key) => {
              const { title, description, icon: Icon } = roleMeta[key];
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setRole(key)}
                  className="flex items-start gap-4 rounded-lg border border-line dark:border-slate-600 bg-white dark:bg-slate-800 p-5 text-left transition hover:border-brand-500 dark:hover:border-brand-400 hover:shadow-soft"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-brand-50 text-brand-700">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block font-bold text-ink dark:text-white">{title}</span>
                    <span className="mt-1 block text-sm text-muted dark:text-slate-400">{description}</span>
                  </span>
                </button>
              );
            })}
          </div>
          <p className="mt-5 text-center text-sm text-muted">
            Already have an account? <Link className="font-bold text-brand-700" to="/login">Sign in</Link>
          </p>
        </>
      ) : (
        <>
          <p className="mt-2 text-sm text-muted">
            Joining as a {roleMeta[role].title.toLowerCase()}. {role === 'RECRUITER' ? 'You can add your company details after signing in.' : 'Build your profile and start discovering roles.'}
          </p>
          <button type="button" onClick={() => setRole(null)} className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:underline">
            <ArrowLeft className="h-4 w-4" /> Change role
          </button>
          {error ? (
            <p className="mt-4 rounded-md bg-red-50 dark:bg-red-950/40 p-3 text-sm font-medium text-red-700 dark:text-red-300" role="alert">{error}</p>
          ) : null}
          <form className="mt-5 grid gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Input label="Full name" autoComplete="name" required error={formState.errors.name?.message} {...register('name')} />
            <Input label="Email" type="email" autoComplete="email" required error={formState.errors.email?.message} {...register('email')} />
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <PasswordInput label="Password" autoComplete="new-password" error={formState.errors.password?.message} {...register('password')} />
                <PasswordStrength password={password} />
              </div>
              <PasswordInput label="Confirm password" autoComplete="new-password" error={formState.errors.confirmPassword?.message} {...register('confirmPassword')} />
            </div>
            <label className="flex items-start gap-2 text-sm text-muted">
              <input type="checkbox" className="mt-1 rounded border-line" {...register('terms')} />
              <span>I will use HireLink for professional hiring and job search.</span>
            </label>
            {formState.errors.terms ? <p className="field-error">{formState.errors.terms.message}</p> : null}
            <Button className="w-full" disabled={formState.isSubmitting}>
              {formState.isSubmitting ? 'Creating account…' : 'Create account'}
            </Button>
          </form>
          <p className="mt-5 text-center text-sm text-muted">
            Already have an account? <Link className="font-bold text-brand-700" to="/login">Sign in</Link>
          </p>
        </>
      )}
    </AuthLayout>
  );
}
