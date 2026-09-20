import { clsx } from 'clsx';
import { forwardRef } from 'react';
import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';
import type { LucideIcon } from 'lucide-react';

type FieldProps = { label: string; error?: string; helper?: string; icon?: LucideIcon };

const inputBase = 'w-full rounded-md border bg-white dark:bg-slate-800 px-3 py-2.5 text-sm text-ink dark:text-slate-100 transition placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-brand-500 dark:focus:border-brand-400 focus:outline-none';
const borderClass = (error?: string) => error ? 'border-red-300 dark:border-red-600' : 'border-line dark:border-slate-600';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & FieldProps>(
  ({ label, error, helper, icon: Icon, className, required, ...props }, ref) => (
    <label className="block">
      <span className="field-label dark:text-slate-200">
        {label}
        {required ? <span className="ml-1 text-red-600">*</span> : null}
      </span>
      <span className="relative mt-2 block">
        {Icon ? <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted dark:text-slate-500" /> : null}
        <input
          ref={ref}
          required={required}
          {...props}
          className={clsx(
            inputBase,
            borderClass(error),
            Icon && 'pl-9',
            className
          )}
        />
      </span>
      {error ? <span className="field-error">{error}</span> : helper ? <span className="mt-1 block text-xs text-muted dark:text-slate-400">{helper}</span> : null}
    </label>
  )
);
Input.displayName = 'Input';

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement> & { label: string; error?: string }>(
  ({ label, error, className, children, required, ...props }, ref) => (
    <label className="block">
      <span className="field-label dark:text-slate-200">
        {label}
        {required ? <span className="ml-1 text-red-600">*</span> : null}
      </span>
      <select
        ref={ref}
        required={required}
        {...props}
        className={clsx(
          'mt-2 w-full rounded-md border bg-white dark:bg-slate-800 px-3 py-2.5 text-sm text-ink dark:text-slate-100 focus:border-brand-500 dark:focus:border-brand-400 focus:outline-none',
          borderClass(error),
          className
        )}
      >
        {children}
      </select>
      {error ? <span className="field-error">{error}</span> : null}
    </label>
  )
);
Select.displayName = 'Select';

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; error?: string; helper?: string }>(
  ({ label, error, helper, className, required, ...props }, ref) => (
    <label className="block">
      <span className="field-label dark:text-slate-200">
        {label}
        {required ? <span className="ml-1 text-red-600">*</span> : null}
      </span>
      <textarea
        ref={ref}
        required={required}
        {...props}
        className={clsx(
          'mt-2 min-h-28 w-full rounded-md border bg-white dark:bg-slate-800 px-3 py-2.5 text-sm text-ink dark:text-slate-100 transition placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-brand-500 dark:focus:border-brand-400 focus:outline-none',
          borderClass(error),
          className
        )}
      />
      <span className="mt-1 flex justify-between text-xs text-muted dark:text-slate-400">
        <span>{error ? <span className="font-medium text-red-700 dark:text-red-400">{error}</span> : helper}</span>
        {props.maxLength ? <span>{String(props.value ?? '').length}/{props.maxLength}</span> : null}
      </span>
    </label>
  )
);
Textarea.displayName = 'Textarea';
