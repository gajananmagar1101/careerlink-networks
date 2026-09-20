import { clsx } from 'clsx';
import type { HTMLAttributes } from 'react';

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={clsx(
        // Light mode via .surface class (bg-white, border-line, shadow-soft)
        'surface rounded-lg p-5',
        // Dark mode via explicit Tailwind utilities (@layer utilities — highest priority)
        // These override .surface's bg-white which is only in @layer components
        'dark:bg-slate-900 dark:border-slate-800 dark:text-slate-100',
        className
      )}
    />
  );
}
