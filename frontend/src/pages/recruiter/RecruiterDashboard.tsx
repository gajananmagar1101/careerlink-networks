import { Briefcase, CalendarCheck, CheckCircle2, FileText, UsersRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { EmptyState, ErrorState, LoadingSkeleton } from '../../components/ui/Feedback';
import { StatCard } from '../../components/ui/StatCard';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import { useRecruiterPipeline } from '../../hooks/useRecruiterPipeline';
import { appliedDate } from '../../utils/applications';
import { formatDate } from '../../utils/format';

export function RecruiterDashboard() {
  const { user } = useAuth();
  const pipeline = useRecruiterPipeline(user?.id);
  const rows = pipeline.data ?? [];
  const jobs = rows.map((row) => row.job);
  const applications = rows.flatMap((row) => row.applications);
  const activeJobs = jobs.filter((job) => job.status === 'OPEN').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-bold text-brand-700">Recruiter workspace</p>
          <h1 className="mt-1 text-3xl font-extrabold">Hiring overview</h1>
          <p className="mt-2 text-muted">Monitor open roles, pipeline health, and candidate movement from live application data.</p>
        </div>
        <Link to="/recruiter/jobs/new"><Button>Post a Job</Button></Link>
      </div>

      {pipeline.isLoading ? <LoadingSkeleton rows={2} /> : null}
      {pipeline.isError ? (
        <ErrorState message="We couldn't load your hiring data. Please try again shortly." onRetry={() => void pipeline.refetch()} />
      ) : null}

      {!pipeline.isLoading && !pipeline.isError ? (
        jobs.length ? (
          <>
            <div className="grid gap-4 md:grid-cols-5">
              <StatCard label="Active Jobs" value={activeJobs} icon={Briefcase} />
              <StatCard label="Total Applications" value={applications.length} icon={FileText} />
              <StatCard label="Shortlisted" value={applications.filter((item) => item.status === 'SHORTLISTED').length} icon={UsersRound} />
              <StatCard label="Interviews" value={applications.filter((item) => item.status === 'INTERVIEW').length} icon={CalendarCheck} />
              <StatCard label="Hired" value={applications.filter((item) => item.status === 'HIRED').length} icon={CheckCircle2} />
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
              <Card>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-extrabold">Recent applications</h2>
                  <Link className="text-sm font-bold text-brand-700" to="/recruiter/applications">View inbox</Link>
                </div>
                <div className="mt-4 space-y-4">
                  {applications.slice(0, 5).length ? applications.slice(0, 5).map((application) => (
                    <div key={application.id} className="flex items-center justify-between gap-3 border-b border-line pb-4 last:border-0 last:pb-0">
                      <div>
                        <p className="font-bold">{application.candidateProfile?.fullName ?? 'Candidate'}</p>
                        <p className="mt-1 text-sm text-muted">{application.job?.title ?? 'Role'} • {formatDate(appliedDate(application))}</p>
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
                  <h2 className="text-xl font-extrabold">Your postings</h2>
                  <Link className="text-sm font-bold text-brand-700" to="/recruiter/jobs">Manage jobs</Link>
                </div>
                <div className="mt-4 space-y-4">
                  {jobs.slice(0, 4).map((job) => (
                    <div key={job.id} className="flex items-center justify-between gap-3 border-b border-line pb-4 last:border-0 last:pb-0">
                      <div>
                        <p className="font-bold">{job.title}</p>
                        <p className="mt-1 text-sm text-muted">{job.location} • {job.employmentType}</p>
                      </div>
                      <Link to={`/recruiter/jobs/${job.id}/applications`} className="text-sm font-semibold text-brand-700 hover:underline">Applications</Link>
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
