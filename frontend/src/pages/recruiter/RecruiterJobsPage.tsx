import { Edit3, Eye, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { EmptyState, ErrorState, LoadingSkeleton } from '../../components/ui/Feedback';
import { ConfirmDialog } from '../../components/ui/Modal';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useDeleteJob, useRecruiterJobs } from '../../hooks/useJobs';
import type { ApiError, Job } from '../../types/domain';
import { employmentLabel, formatDate } from '../../utils/format';

export function RecruiterJobsPage() {
  const { user } = useAuth();
  const { notify } = useToast();
  const query = useRecruiterJobs(user?.id);
  const remove = useDeleteJob();
  const [pendingDelete, setPendingDelete] = useState<Job | null>(null);
  const jobs = query.data?.content ?? [];

  async function confirmDelete() {
    if (!pendingDelete) return;
    try {
      await remove.mutateAsync(pendingDelete.id);
      notify('Job deleted successfully.', 'success');
      setPendingDelete(null);
    } catch (err) {
      notify((err as ApiError).message, 'error');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-bold text-brand-700">Job management</p>
          <h1 className="mt-1 text-3xl font-extrabold">My jobs</h1>
        </div>
        <Link to="/recruiter/jobs/new"><Button>Post a Job</Button></Link>
      </div>
      {query.isLoading ? <LoadingSkeleton /> : null}
      {query.isError ? (
        <ErrorState message="We couldn't load your job postings. Please try again shortly." onRetry={() => void query.refetch()} />
      ) : null}
      {!query.isLoading && !query.isError ? (
        jobs.length ? (
          <div className="space-y-4">
            {jobs.map((job) => (
              <Card key={job.id}>
                <div className="grid gap-4 lg:grid-cols-[1fr_130px_120px_220px] lg:items-center">
                  <div>
                    <h2 className="text-lg font-extrabold">{job.title}</h2>
                    <p className="mt-1 text-sm text-muted">{job.location} • {employmentLabel(job.employmentType)}</p>
                  </div>
                  <StatusBadge status={job.status} />
                  <p className="text-sm text-muted">Deadline {formatDate(job.applicationDeadline)}</p>
                  <div className="flex gap-2">
                    <Link to={`/recruiter/jobs/${job.id}/applications`}><Button variant="secondary">View Applications</Button></Link>
                    <Link to={`/recruiter/jobs/${job.id}`}><Button variant="secondary" aria-label="View job"><Eye className="h-4 w-4" /></Button></Link>
                    <Link to={`/recruiter/jobs/${job.id}/edit`}><Button variant="secondary" aria-label="Edit job"><Edit3 className="h-4 w-4" /></Button></Link>
                    <Button variant="danger" aria-label="Delete job" onClick={() => setPendingDelete(job)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState title="You haven't posted any jobs yet." description="Publish your first role and candidates can start applying right away." action={<Link to="/recruiter/jobs/new"><Button>Post a Job</Button></Link>} />
        )
      ) : null}
      <ConfirmDialog open={Boolean(pendingDelete)} title="Delete this job?" description="All associated information may become inaccessible." onCancel={() => setPendingDelete(null)} onConfirm={confirmDelete} />
    </div>
  );
}
