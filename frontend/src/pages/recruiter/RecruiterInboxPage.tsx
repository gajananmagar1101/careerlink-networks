import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { EmptyState, ErrorState, LoadingSkeleton } from '../../components/ui/Feedback';
import { Input, Select } from '../../components/ui/Fields';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { applicationStatuses } from '../../constants/applicationStatus';
import { useAuth } from '../../context/AuthContext';
import { useRecruiterPipeline } from '../../hooks/useRecruiterPipeline';
import type { ApplicationStatus } from '../../types/domain';
import { appliedDate, statusLabel } from '../../utils/applications';
import { formatDate } from '../../utils/format';

export function RecruiterInboxPage() {
  const { user } = useAuth();
  const query = useRecruiterPipeline(user?.id);
  const [status, setStatus] = useState<ApplicationStatus | ''>('');
  const [search, setSearch] = useState('');

  const applications = useMemo(() => {
    const rows = query.data?.flatMap((row) => row.applications) ?? [];
    const needle = search.trim().toLowerCase();
    return rows.filter((application) => {
      if (status && application.status !== status) return false;
      if (!needle) return true;
      const haystack = [
        application.candidateProfile?.fullName,
        application.candidateProfile?.email,
        application.job?.title,
        application.job?.companyName
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(needle);
    });
  }, [query.data, search, status]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-bold text-brand-700">Hiring inbox</p>
        <h1 className="mt-1 text-3xl font-extrabold">Applications</h1>
        <p className="mt-2 text-muted">Review candidates across your open and closed roles.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-[1fr_220px]">
        <Input label="Search candidates or jobs" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Name, email, or job title" />
        <Select label="Status" value={status} onChange={(event) => setStatus(event.target.value as ApplicationStatus | '')}>
          <option value="">All statuses</option>
          {applicationStatuses.map((item) => (
            <option key={item} value={item}>{statusLabel(item)}</option>
          ))}
        </Select>
      </div>
      {query.isLoading ? <LoadingSkeleton /> : null}
      {query.isError ? (
        <ErrorState message="We couldn't load applications across your jobs. Please try again shortly." onRetry={() => void query.refetch()} />
      ) : null}
      {!query.isLoading && !query.isError ? (
        applications.length ? (
          <div className="space-y-4">
            {applications.map((application) => (
              <Card key={application.id}>
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-700">{application.job?.title ?? 'Role'}</p>
                    <h2 className="mt-1 text-lg font-extrabold">{application.candidateProfile?.fullName ?? 'Candidate'}</h2>
                    <p className="mt-1 text-sm text-muted">Applied {formatDate(appliedDate(application))}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <StatusBadge status={application.status} />
                    {application.jobId ? (
                      <Link to={`/recruiter/jobs/${application.jobId}/applications`}>
                        <Button variant="secondary">Review</Button>
                      </Link>
                    ) : null}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            title={query.data?.length ? 'No applications match these filters.' : 'No applications yet'}
            description={query.data?.length ? 'Try another status or search term.' : 'When candidates apply to your jobs, they will appear here.'}
            action={<Link to="/recruiter/jobs/new"><Button>Post a job</Button></Link>}
          />
        )
      ) : null}
    </div>
  );
}
