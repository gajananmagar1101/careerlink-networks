import { clsx } from 'clsx';
import type { HTMLAttributes } from 'react';

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return <span {...props} className={clsx('inline-flex items-center rounded-full border border-line bg-slate-50 px-2.5 py-1 text-xs font-semibold text-ink', className)} />;
}
