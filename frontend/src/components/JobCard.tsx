import { MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Job } from '../types/domain';
import { isJobExpired } from '../utils/jobs';
import { employmentLabel, formatDate, formatSalary } from '../utils/format';
import { Avatar } from './ui/Avatar';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { StatusBadge } from './ui/StatusBadge';
import { SavedJobButton } from './jobs/SavedJobButton';
import { JobMatchBadge } from './jobs/JobMatchBadge';

export function JobCard({ job, to }: { job: Job; to: string }) {
  const expired = isJobExpired(job);
  return (
    <Card className="transition hover:border-brand-100 dark:hover:border-brand-700">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-4">
          <Avatar name={job.companyName} />
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-muted dark:text-slate-400">
              <span>{job.companyName}</span>
              {job.createdAt ? (
                <>
                  <span aria-hidden="true">•</span>
                  <span>Posted {formatDate(job.createdAt)}</span>
                </>
              ) : null}
            </div>
            <Link to={to} className="mt-1 block text-xl font-bold text-ink dark:text-white hover:text-brand-700 dark:hover:text-brand-400">
              {job.title}
            </Link>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted dark:text-slate-400">
              <MapPin className="h-4 w-4" />
              <span>{job.location}</span>
              <span aria-hidden="true">•</span>
              <span>{employmentLabel(job.employmentType)}</span>
              <span aria-hidden="true">•</span>
              <span>{job.experienceRequired}+ years</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <StatusBadge status={expired && job.status === 'OPEN' ? 'CLOSED' : job.status} />
          <JobMatchBadge jobId={job.id} />
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {job.skills.slice(0, 5).map((skill) => (
          <Badge key={skill}>{skill}</Badge>
        ))}
      </div>
      <div className="mt-5 flex flex-col gap-3 border-t border-line dark:border-slate-700 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-bold text-ink dark:text-white">{formatSalary(job.salaryMin, job.salaryMax)}</p>
          {job.applicationDeadline ? <p className="mt-1 text-xs text-muted dark:text-slate-400">Apply by {formatDate(job.applicationDeadline)}</p> : null}
        </div>
        <div className="flex items-center gap-2">
          <SavedJobButton jobId={job.id} showText={false} />
          <Link to={to}>
            <Button type="button">View details</Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
