import { Bookmark, Briefcase, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSavedJobs } from '../../hooks/useSavedJobs';
import { JobCard } from '../../components/JobCard';
import { Button } from '../../components/ui/Button';

export function CandidateSavedJobsPage() {
  const { data: pagedJobs, isLoading } = useSavedJobs();
  const jobs = pagedJobs?.content || [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-line pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Bookmark className="h-6 w-6 text-brand-600 fill-brand-600" />
            <h1 className="text-3xl font-extrabold text-ink">Saved Jobs</h1>
          </div>
          <p className="mt-1 text-sm text-muted">
            Track and manage positions you have bookmarked for later application
          </p>
        </div>
        <Link to="/candidate/jobs">
          <Button variant="outline" className="gap-2">
            <Briefcase className="h-4 w-4" />
            Explore More Jobs
          </Button>
        </Link>
      </div>

      <div className="mt-8">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-44 rounded-2xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-line bg-white dark:bg-slate-900 dark:border-slate-700 p-12 text-center shadow-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
              <Bookmark className="h-8 w-8 stroke-1" />
            </div>
            <h3 className="mt-4 text-xl font-bold text-ink">No saved jobs yet</h3>
            <p className="mt-1 max-w-md text-sm text-muted">
              When exploring opportunities, click the bookmark icon on any job card to save it here for easy review and application.
            </p>
            <Link to="/candidate/jobs" className="mt-6">
              <Button className="gap-2">
                Browse Open Positions <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm font-semibold text-muted">
              Showing {jobs.length} saved {jobs.length === 1 ? 'position' : 'positions'}
            </p>
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} to={`/candidate/jobs/${job.id}`} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
