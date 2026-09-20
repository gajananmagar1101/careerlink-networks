import { clsx } from 'clsx';
import type { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
type Size = 'sm' | 'md' | 'lg';

const variants: Record<Variant, string> = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700 border-brand-600',
  secondary: 'bg-white dark:bg-slate-800 text-ink dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 border-line dark:border-slate-600',
  outline: 'bg-transparent text-ink dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-300 dark:border-slate-600',
  ghost: 'border-transparent text-ink dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800',
  danger: 'bg-red-600 text-white hover:bg-red-700 border-red-600'
};

const sizes: Record<Size, string> = {
  sm: 'min-h-8 px-2.5 py-1 text-xs',
  md: 'min-h-10 px-4 py-2 text-sm',
  lg: 'min-h-12 px-6 py-3 text-base'
};

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  return (
    <button
      {...props}
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-md border font-semibold transition disabled:cursor-not-allowed disabled:opacity-55',
        variants[variant],
        sizes[size],
        className
      )}
    />
  );
}
