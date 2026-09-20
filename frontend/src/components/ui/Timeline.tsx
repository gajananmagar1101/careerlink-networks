import { Check } from 'lucide-react';
import { statusOrder } from '../../constants/applicationStatus';
import type { ApplicationStatus } from '../../types/domain';
import { statusLabel } from '../../utils/applications';

export function Timeline({ status }: { status: ApplicationStatus }) {
  const terminal = status === 'REJECTED' || status === 'WITHDRAWN';
  const effectiveStatus = status === 'INTERVIEW_COMPLETED' ? 'INTERVIEW_SCHEDULED' : status;
  const currentIndex = terminal ? -1 : Math.max(0, statusOrder.indexOf(effectiveStatus as (typeof statusOrder)[number]));

  return (
    <ol className="space-y-4">
      {statusOrder.map((item, index) => {
        const complete = !terminal && index < currentIndex;
        const current = !terminal && index === currentIndex;
        return (
          <li key={item} className="flex gap-3">
            <span
              className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border ${
                complete || current
                  ? 'border-brand-600 bg-brand-600 text-white'
                  : 'border-line dark:border-slate-600 bg-white dark:bg-slate-800 text-muted dark:text-slate-400'
              }`}
            >
              {complete ? <Check className="h-4 w-4" /> : <span className="h-2 w-2 rounded-full bg-current" />}
            </span>
            <div>
              <p className="text-sm font-bold text-ink dark:text-white">{statusLabel(item)}</p>
              <p className="text-xs text-muted dark:text-slate-400">{current ? 'Current status' : complete ? 'Completed' : 'Upcoming'}</p>
            </div>
          </li>
        );
      })}
      {terminal ? (
        <li className="flex gap-3">
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-red-600 bg-red-600 text-white">
            <Check className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-bold text-ink dark:text-white">{statusLabel(status)}</p>
            <p className="text-xs text-muted dark:text-slate-400">Current status</p>
          </div>
        </li>
      ) : null}
    </ol>
  );
}
