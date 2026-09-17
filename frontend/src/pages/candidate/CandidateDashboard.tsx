import { Briefcase, CalendarCheck, CheckCircle2, Clock3, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ApplicationCard } from '../../components/ApplicationCard';
import { JobCard } from '../../components/JobCard';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { EmptyState, ErrorState, LoadingSkeleton } from '../../components/ui/Feedback';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { StatCard } from '../../components/ui/StatCard';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import { useCandidateApplications } from '../../hooks/useApplications';
import { useJobs } from '../../hooks/useJobs';
import { useCandidateProfile } from '../../hooks/useProfiles';
import { appliedDate } from '../../utils/applications';
import { formatDate } from '../../utils/format';

export function CandidateDashboard() {
  const { user } = useAuth();
  const applicationsQuery = useCandidateApplications(user?.id);
  const jobsQuery = useJobs({ size: 3 });
  const profileQuery = useCandidateProfile(user?.id);
  const applications = applicationsQuery.data ?? [];
  const jobs = jobsQuery.data?.content ?? [];

  const profile = profileQuery.data;
  const completionFields = [
    profile?.fullName,
    profile?.email,
    profile?.headline,
    profile?.summary,
    profile?.skills?.length,
    profile?.education?.length,
    profile?.experience?.length,
    profile?.resumeUrl
  ];
  const completion = Math.round(completionFields.filter(Boolean).length / completionFields.length * 100);

  const missingItems = [
    !profile?.headline && 'Add a headline',
    !profile?.summary && 'Add a summary',
    !profile?.skills?.length && 'Add skills',
    !profile?.education?.length && 'Add education',
    !profile?.experience?.length && 'Add experience',
    !profile?.resumeUrl && 'Add resume URL'
  ].filter(Boolean) as string[];

  const counts = {
    applied: applications.length,
    review: applications.filter((item) => item.status === 'UNDER_REVIEW').length,
    shortlisted: applications.filter((item) => item.status === 'SHORTLISTED').length,
    interview: applications.filter((item) => item.status === 'INTERVIEW').length
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-bold text-brand-700">Candidate workspace</p>
          <h1 className="mt-1 text-3xl font-extrabold">Welcome back, {user?.name ?? 'there'}</h1>
          <p className="mt-2 text-muted">Search, apply, and keep your pipeline visible.</p>
        </div>
        <Link to="/candidate/jobs">
          <Button><Search className="h-4 w-4" /> Quick search</Button>
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Applied" value={counts.applied} icon={Briefcase} />
        <StatCard label="Under Review" value={counts.review} icon={Clock3} />
        <StatCard label="Shortlisted" value={counts.shortlisted} icon={CheckCircle2} />
        <StatCard label="Interview" value={counts.interview} icon={CalendarCheck} />
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-extrabold">Open roles</h2>
            <Link className="text-sm font-bold text-brand-700" to="/candidate/jobs">View all</Link>
          </div>
          {jobsQuery.isLoading ? <LoadingSkeleton /> : null}
          {jobsQuery.isError ? (
            <ErrorState message="We couldn't load open roles. Please try again shortly." onRetry={() => void jobsQuery.refetch()} />
          ) : null}
          {!jobsQuery.isLoading && !jobsQuery.isError ? (
            jobs.length ? (
              <div className="space-y-4">{jobs.map((job) => <JobCard key={job.id} job={job} to={`/candidate/jobs/${job.id}`} />)}</div>
            ) : (
              <EmptyState title="No open roles right now" description="New opportunities appear here as recruiters post them." />
            )
          ) : null}
        </section>
        <aside className="space-y-4">
          <Card>
            <div className="flex items-center justify-between">
              <h2 className="font-extrabold">Profile completion</h2>
              <span className="text-2xl font-extrabold text-brand-700">{profileQuery.isLoading ? '…' : `${completion}%`}</span>
            </div>
            <div className="mt-4"><ProgressBar value={completion} /></div>
            <div className="mt-4 flex flex-col items-start space-y-2 text-sm text-muted">
              {missingItems.map((item, i) => (
                <Link key={i} to="/candidate/profile" className="hover:text-brand-600 hover:underline">
                  {item}
                </Link>
              ))}
            </div>
            <Link to="/candidate/profile">
              <Button variant="secondary" className="mt-5 w-full">
                {completion === 100 ? 'View profile' : 'Improve profile'}
              </Button>
            </Link>
          </Card>
          <Card>
            <div className="flex items-center justify-between">
              <h2 className="font-extrabold">Recent applications</h2>
              <Link className="text-sm font-bold text-brand-700 hover:underline" to="/candidate/applications">
                View all
              </Link>
            </div>
            {applicationsQuery.isLoading ? (
              <LoadingSkeleton rows={2} />
            ) : applicationsQuery.isError ? (
              <ErrorState message="We couldn't load your applications." onRetry={() => void applicationsQuery.refetch()} />
            ) : applications.length ? (
              <div className="mt-4 space-y-3">
                {applications.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="rounded-lg border border-line bg-slate-50/50 p-3.5 transition hover:bg-slate-50"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-bold uppercase tracking-wider text-brand-700">
                          {item.job?.companyName ?? 'Hiring team'}
                        </p>
                        <h3 className="mt-0.5 truncate text-sm font-bold text-ink">
                          {item.job?.title ?? 'Role'}
                        </h3>
                      </div>
                      <StatusBadge status={item.status} />
                    </div>
                    <div className="mt-2.5 flex items-center justify-between border-t border-line/60 pt-2 text-xs text-muted">
                      <span>Applied {formatDate(appliedDate(item))}</span>
                      <Link
                        to={`/candidate/applications/${item.id}`}
                        className="font-bold text-brand-700 hover:underline"
                      >
                        Track →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState title="No applications yet" description="Apply to roles and track them here." action={<Link to="/candidate/jobs"><Button variant="secondary">Explore Jobs</Button></Link>} />
            )}
          </Card>
        </aside>
      </div>
    </div>
  );
}
