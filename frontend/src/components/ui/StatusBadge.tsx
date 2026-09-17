import { clsx } from 'clsx';
import type { ApplicationStatus, JobStatus } from '../../types/domain';
import { statusLabel } from '../../utils/applications';

const statusClass: Record<string, string> = {
  APPLIED: 'bg-slate-100 text-slate-700 border-slate-200',
  UNDER_REVIEW: 'bg-blue-50 text-blue-700 border-blue-200',
  SHORTLISTED: 'bg-brand-50 text-brand-700 border-brand-100',
  INTERVIEW: 'bg-amber-50 text-amber-700 border-amber-200',
  REJECTED: 'bg-red-50 text-red-700 border-red-200',
  HIRED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  WITHDRAWN: 'bg-zinc-100 text-zinc-700 border-zinc-200',
  OPEN: 'bg-brand-50 text-brand-700 border-brand-100',
  CLOSED: 'bg-zinc-100 text-zinc-700 border-zinc-200',
  DRAFT: 'bg-amber-50 text-amber-700 border-amber-200'
};

export function StatusBadge({ status }: { status: ApplicationStatus | JobStatus }) {
  const label = status.includes('_') ? statusLabel(status as ApplicationStatus) : status;
  return (
    <span className={clsx('inline-flex rounded-full border px-2.5 py-1 text-xs font-bold', statusClass[status])}>
      {label}
    </span>
  );
}
