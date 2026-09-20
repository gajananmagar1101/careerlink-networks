import { Briefcase, CalendarCheck, FileText, UsersRound, Kanban, Gift, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { EmptyState, ErrorState, LoadingSkeleton } from '../../components/ui/Feedback';
import { StatCard } from '../../components/ui/StatCard';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import { useRecruiterPipeline } from '../../hooks/useRecruiterPipeline';
import { useRecruiterInterviews } from '../../hooks/useInterviews';
import { useRecruiterOffers } from '../../hooks/useOffers';
import { appliedDate } from '../../utils/applications';
import { formatDate } from '../../utils/format';

export function RecruiterDashboard() {
  const { user } = useAuth();
  const pipeline = useRecruiterPipeline(user?.id);
  const { data: interviews = [] } = useRecruiterInterviews(Boolean(user?.id));
  const { data: offers = [] } = useRecruiterOffers(Boolean(user?.id));

  const rows = pipeline.data ?? [];
  const jobs = rows.map((row) => row.job);
  const applications = rows.flatMap((row) => row.applications);
  const activeJobs = jobs.filter((job) => job.status === 'OPEN').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-bold text-brand-700 uppercase tracking-wider">Recruiter Workspace</p>
          <h1 className="mt-1 text-3xl font-extrabold text-ink">Talent Acquisition Hub</h1>
          <p className="mt-1 text-muted">Manage jobs, coordinate applicant pipelines, schedule interviews, and extend offers.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link to="/recruiter/pipeline">
            <Button variant="outline" className="gap-2">
              <Kanban className="h-4 w-4 text-brand-600" /> Pipeline Board
            </Button>
          </Link>
          <Link to="/recruiter/interviews">
            <Button variant="outline" className="gap-2">
              <CalendarCheck className="h-4 w-4 text-purple-600" /> Interviews ({interviews.length})
            </Button>
          </Link>
          <Link to="/recruiter/jobs/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Post a Job
            </Button>
          </Link>
        </div>
      </div>

      {pipeline.isLoading ? <LoadingSkeleton rows={2} /> : null}
      {pipeline.isError ? (
        <ErrorState message="We couldn't load your hiring data. Please try again shortly." onRetry={() => void pipeline.refetch()} />
      ) : null}

      {!pipeline.isLoading && !pipeline.isError ? (
        jobs.length ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-5">
              <StatCard label="Active Postings" value={activeJobs} icon={Briefcase} />
              <StatCard label="Total Applicants" value={applications.length} icon={FileText} />
              <Link to="/recruiter/pipeline" className="block transition hover:scale-[1.02]">
                <StatCard label="Shortlisted" value={applications.filter((item) => item.status === 'SHORTLISTED').length} icon={UsersRound} />
              </Link>
              <Link to="/recruiter/interviews" className="block transition hover:scale-[1.02]">
                <StatCard label="Interviews" value={interviews.length} icon={CalendarCheck} />
              </Link>
              <Link to="/recruiter/offers" className="block transition hover:scale-[1.02]">
                <StatCard label="Offers Sent" value={offers.length} icon={Gift} />
              </Link>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
              <Card>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-extrabold text-ink">Recent Applications</h2>
                  <div className="flex items-center gap-3">
                    <Link className="text-xs font-bold text-brand-700 hover:underline" to="/recruiter/pipeline">
                      Open Kanban →
                    </Link>
                    <Link className="text-xs font-bold text-slate-500 hover:underline" to="/recruiter/applications">
                      View all
                    </Link>
                  </div>
                </div>
                <div className="mt-4 space-y-4">
                  {applications.slice(0, 5).length ? applications.slice(0, 5).map((application) => (
                    <div key={application.id} className="flex items-center justify-between gap-3 border-b border-line pb-4 last:border-0 last:pb-0">
                      <div>
                        <p className="font-bold text-ink">{application.candidateProfile?.fullName ?? 'Candidate'}</p>
                        <p className="mt-0.5 text-xs text-muted">{application.job?.title ?? 'Role'} • {formatDate(appliedDate(application))}</p>
                      </div>
                      <StatusBadge status={application.status} />
                    </div>
                  )) : (
                    <p className="text-sm text-muted">No applications yet. Share your open roles to start receiving candidates.</p>
                  )}
                </div>
              </Card>

              <Card>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-extrabold text-ink">Active Postings</h2>
                  <Link className="text-xs font-bold text-brand-700 hover:underline" to="/recruiter/jobs">Manage jobs</Link>
                </div>
                <div className="mt-4 space-y-4">
                  {jobs.slice(0, 4).map((job) => (
                    <div key={job.id} className="flex items-center justify-between gap-3 border-b border-line pb-4 last:border-0 last:pb-0">
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-ink truncate">{job.title}</p>
                        <p className="mt-0.5 text-xs text-muted truncate">{job.location} • {job.employmentType}</p>
                      </div>
                      <Link to={`/recruiter/jobs/${job.id}/applications`} className="text-xs font-semibold text-brand-700 hover:underline shrink-0">
                        View Pipeline
                      </Link>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </>
        ) : (
          <EmptyState title="No jobs posted yet" description="Publish your first role to start receiving applications and see hiring analytics here." action={<Link to="/recruiter/jobs/new"><Button>Post a Job</Button></Link>} />
        )
      ) : null}
    </div>
  );
}
