import { MapPin } from 'lucide-react';
import type { ReactNode } from 'react';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { StatusBadge } from '../ui/StatusBadge';
import type { Job } from '../../types/domain';
import { isJobExpired, isJobOpen, jobDescriptionSections } from '../../utils/jobs';
import { employmentLabel, formatDate, formatSalary } from '../../utils/format';

export function JobDetailContent({ job, sidebar }: { job: Job; sidebar: ReactNode }) {
  const expired = isJobExpired(job);
  const open = isJobOpen(job);
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <section className="space-y-5">
        <Card>
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={expired && job.status === 'OPEN' ? 'CLOSED' : job.status} />
            {job.applicationDeadline ? <span className="text-sm font-semibold text-muted">Deadline {formatDate(job.applicationDeadline)}</span> : null}
            {!open ? <span className="text-sm font-semibold text-red-700">{expired ? 'This job is past its deadline.' : 'This job is not open for applications.'}</span> : null}
          </div>
          <h1 className="mt-4 text-3xl font-extrabold sm:text-4xl">{job.title}</h1>
          <p className="mt-2 text-lg font-semibold text-muted">{job.companyName}</p>
          <p className="mt-3 flex flex-wrap items-center gap-2 text-muted">
            <MapPin className="h-4 w-4" /> {job.location} • {employmentLabel(job.employmentType)} • {job.experienceRequired}+ years • {job.category}
          </p>
          <p className="mt-4 text-xl font-bold">{formatSalary(job.salaryMin, job.salaryMax)}</p>
          <div className="mt-5 flex flex-wrap gap-2">{job.skills.map((skill) => <Badge key={skill}>{skill}</Badge>)}</div>
        </Card>
        {jobDescriptionSections(job.description).map((section, index) => (
          <Card key={`${section.title}-${index}`}>
            <h2 className="text-xl font-extrabold">{section.title}</h2>
            <p className="mt-3 whitespace-pre-wrap leading-7 text-muted">{section.body}</p>
          </Card>
        ))}
      </section>
      <aside className="lg:sticky lg:top-24 lg:h-fit">{sidebar}</aside>
    </div>
  );
}
