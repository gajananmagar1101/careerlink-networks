import { Check } from 'lucide-react';
import { statusOrder } from '../../constants/applicationStatus';
import type { ApplicationStatus } from '../../types/domain';
import { statusLabel } from '../../utils/applications';

export function Timeline({ status }: { status: ApplicationStatus }) {
  const terminal = status === 'REJECTED' || status === 'WITHDRAWN';
  const currentIndex = terminal ? statusOrder.indexOf('INTERVIEW') : Math.max(0, statusOrder.indexOf(status as (typeof statusOrder)[number]));

  return (
    <ol className="space-y-4">
      {statusOrder.map((item, index) => {
        const complete = !terminal && index < currentIndex;
        const current = !terminal && index === currentIndex;
        return (
          <li key={item} className="flex gap-3">
            <span
              className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border ${
                complete || current ? 'border-brand-600 bg-brand-600 text-white' : 'border-line bg-white text-muted'
              }`}
            >
              {complete ? <Check className="h-4 w-4" /> : <span className="h-2 w-2 rounded-full bg-current" />}
            </span>
            <div>
              <p className="text-sm font-bold text-ink">{statusLabel(item)}</p>
              <p className="text-xs text-muted">{current ? 'Current status' : complete ? 'Completed' : 'Upcoming'}</p>
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
            <p className="text-sm font-bold text-ink">{statusLabel(status)}</p>
            <p className="text-xs text-muted">Current status</p>
          </div>
        </li>
      ) : null}
    </ol>
  );
}
