import { clsx } from 'clsx';
import type { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

const variants: Record<Variant, string> = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700 border-brand-600',
  secondary: 'bg-white text-ink hover:bg-slate-50 border-line',
  ghost: 'border-transparent text-ink hover:bg-slate-100',
  danger: 'bg-red-600 text-white hover:bg-red-700 border-red-600'
};

export function Button({ className, variant = 'primary', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      {...props}
      className={clsx(
        'inline-flex min-h-10 items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-55',
        variants[variant],
        className
      )}
    />
  );
}
