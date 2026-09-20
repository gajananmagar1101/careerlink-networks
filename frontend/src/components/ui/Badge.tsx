import { clsx } from 'clsx';
import type { HTMLAttributes } from 'react';

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return <span {...props} className={clsx('inline-flex items-center rounded-full border border-line dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2.5 py-1 text-xs font-semibold text-ink dark:text-slate-200', className)} />;
}
