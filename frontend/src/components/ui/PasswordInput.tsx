import { clsx } from 'clsx';
import { forwardRef, useState } from 'react';
import type { InputHTMLAttributes } from 'react';
import { Eye, EyeOff } from 'lucide-react';

type PasswordInputProps = InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string; helper?: string };

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, error, helper, className, ...props }, ref) => {
    const [visible, setVisible] = useState(false);
    return (
      <label className="block">
        <span className="field-label">{label}</span>
        <span className="relative mt-2 block">
          <input
            ref={ref}
            type={visible ? 'text' : 'password'}
            {...props}
            className={clsx(
              'w-full rounded-md border border-line dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2.5 pr-11 text-sm text-ink dark:text-slate-100 transition placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-brand-500 dark:focus:border-brand-400 focus:outline-none',
              className
            )}
          />
          <button
            type="button"
            onClick={() => setVisible((value) => !value)}
            aria-label={visible ? 'Hide password' : 'Show password'}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-muted dark:text-slate-400 transition hover:bg-canvas dark:hover:bg-slate-700"
          >
            {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </span>
        {error ? <span className="field-error">{error}</span> : helper ? <span className="mt-1 block text-xs text-muted">{helper}</span> : null}
      </label>
    );
  }
);
PasswordInput.displayName = 'PasswordInput';