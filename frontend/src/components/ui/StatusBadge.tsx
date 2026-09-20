import { clsx } from 'clsx';
import type { ApplicationStatus, JobStatus } from '../../types/domain';
import { statusLabel } from '../../utils/applications';

const statusClass: Record<string, string> = {
  APPLIED: 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600',
  UNDER_REVIEW: 'bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700',
  SHORTLISTED: 'bg-brand-50 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 border-brand-100 dark:border-brand-700',
  INTERVIEW: 'bg-amber-50 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-700',
  INTERVIEW_SCHEDULED: 'bg-amber-50 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-700',
  INTERVIEW_COMPLETED: 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-700',
  OFFERED: 'bg-purple-50 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700',
  REJECTED: 'bg-red-50 dark:bg-red-900/40 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700',
  HIRED: 'bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700',
  WITHDRAWN: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-600',
  OPEN: 'bg-brand-50 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 border-brand-100 dark:border-brand-700',
  CLOSED: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-600',
  DRAFT: 'bg-amber-50 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-700'
};

export function StatusBadge({ status }: { status: ApplicationStatus | JobStatus }) {
  const label = status.includes('_') ? statusLabel(status as ApplicationStatus) : status;
  return (
    <span className={clsx('inline-flex rounded-full border px-2.5 py-1 text-xs font-bold', statusClass[status])}>
      {label}
    </span>
  );
}
