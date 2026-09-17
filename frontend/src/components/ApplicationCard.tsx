import { Link } from 'react-router-dom';
import type { Application } from '../types/domain';
import { appliedDate } from '../utils/applications';
import { formatDate } from '../utils/format';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { StatusBadge } from './ui/StatusBadge';

export function ApplicationCard({ application }: { application: Application }) {
  const jobTitle = application.job?.title ?? 'View application';
  return (
    <Card>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-700">{application.job?.companyName ?? 'Hiring team'}</p>
          <h3 className="mt-1 text-lg font-bold text-ink">{jobTitle}</h3>
          <p className="mt-1 text-sm text-muted">
            Applied {formatDate(appliedDate(application))}
            {application.updatedAt ? ` • Updated ${formatDate(application.updatedAt)}` : ''}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5 sm:shrink-0">
          <StatusBadge status={application.status} />
          <Link to={`/candidate/applications/${application.id}`}>
            <Button variant="secondary" className="px-3 py-1.5 text-xs font-semibold">Track</Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
