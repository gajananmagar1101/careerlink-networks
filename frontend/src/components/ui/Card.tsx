import { clsx } from 'clsx';
import type { HTMLAttributes } from 'react';

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={clsx('surface rounded-lg p-5', className)} />;
}
