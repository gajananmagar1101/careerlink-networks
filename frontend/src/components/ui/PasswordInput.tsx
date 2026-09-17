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
              'w-full rounded-md border border-line bg-white px-3 py-2.5 pr-11 text-sm text-ink transition placeholder:text-slate-400 focus:border-brand-500',
              className
            )}
          />
          <button
            type="button"
            onClick={() => setVisible((value) => !value)}
            aria-label={visible ? 'Hide password' : 'Show password'}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-muted transition hover:bg-canvas"
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