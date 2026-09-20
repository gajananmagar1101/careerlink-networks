import { Briefcase, CalendarCheck, Search, Bookmark, Gift, Video, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
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
import { useSavedJobIds } from '../../hooks/useSavedJobs';
import { useCandidateInterviews } from '../../hooks/useInterviews';
import { useCandidateOffers } from '../../hooks/useOffers';
import { appliedDate } from '../../utils/applications';
import { formatDate } from '../../utils/format';

export function CandidateDashboard() {
  const { user } = useAuth();
  const applicationsQuery = useCandidateApplications(user?.id);
  const jobsQuery = useJobs({ size: 4 });
  const profileQuery = useCandidateProfile(user?.id);
  const { data: savedIds = [] } = useSavedJobIds();
  const { data: interviews = [] } = useCandidateInterviews(Boolean(user?.id));
  const { data: offers = [] } = useCandidateOffers(Boolean(user?.id));

  const applications = applicationsQuery.data ?? [];
  const jobs = jobsQuery.data?.content ?? [];
  const profile = profileQuery.data;

  const pendingOffers = offers.filter(o => o.status === 'SENT');
  const upcomingInterviews = interviews.filter(i => i.status === 'SCHEDULED' || i.status === 'RESCHEDULED');

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
  const completion = Math.round((completionFields.filter(Boolean).length / completionFields.length) * 100);

  const missingItems = [
    !profile?.headline && 'Add a headline',
    !profile?.summary && 'Add a summary',
    !profile?.skills?.length && 'Add skills',
    !profile?.education?.length && 'Add education',
    !profile?.experience?.length && 'Add experience',
    !profile?.resumeUrl && 'Add resume URL'
  ].filter(Boolean) as string[];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-bold text-brand-700 uppercase tracking-wider">Candidate Workspace</p>
          <h1 className="mt-1 text-3xl font-extrabold text-ink">Welcome back, {user?.name ?? 'there'} 👋</h1>
          <p className="mt-1 text-muted">Search, apply, track interviews, and accept job offers with confidence.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/candidate/saved-jobs">
            <Button variant="outline" className="gap-2">
              <Bookmark className="h-4 w-4" /> Saved ({savedIds.length})
            </Button>
          </Link>
          <Link to="/candidate/jobs">
            <Button className="gap-2">
              <Search className="h-4 w-4" /> Quick search
            </Button>
          </Link>
        </div>
      </div>

      {/* Urgent Offer Banner */}
      {pendingOffers.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 p-5 text-white shadow-xl">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md">
              <Gift className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-black">Official Job Offer Received!</h3>
              <p className="text-xs text-emerald-100">
                You have {pendingOffers.length} pending {pendingOffers.length === 1 ? 'offer' : 'offers'} waiting for your review.
              </p>
            </div>
          </div>
          <Link to="/candidate/offers">
            <Button className="bg-white text-emerald-800 hover:bg-emerald-50 font-bold border-none shadow-md">
              Review Offer Details <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      )}

      {/* Upcoming Interview Alert */}
      {upcomingInterviews.length > 0 && pendingOffers.length === 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-700 p-5 text-white shadow-xl">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md">
              <Video className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-black">Upcoming Interview Scheduled</h3>
              <p className="text-xs text-purple-100">
                Next round: {upcomingInterviews[0].interviewType.replace('_', ' ')} • {formatDate(upcomingInterviews[0].scheduledAt)}
              </p>
            </div>
          </div>
          <Link to="/candidate/interviews">
            <Button className="bg-white text-purple-800 hover:bg-purple-50 font-bold border-none shadow-md">
              View Schedule & Link <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      )}

      {/* Core Stats Overview */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        <StatCard label="Applications" value={applications.length} icon={Briefcase} />
        <Link to="/candidate/saved-jobs" className="block transition hover:scale-[1.02]">
          <StatCard label="Saved Jobs" value={savedIds.length} icon={Bookmark} />
        </Link>
        <Link to="/candidate/interviews" className="block transition hover:scale-[1.02]">
          <StatCard label="Interviews" value={interviews.length} icon={CalendarCheck} />
        </Link>
        <Link to="/candidate/offers" className="block transition hover:scale-[1.02]">
          <StatCard label="Offers" value={offers.length} icon={Gift} />
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-ink">Recommended for You</h2>
            <Link className="text-sm font-bold text-brand-700 hover:underline" to="/candidate/jobs">
              View all open roles →
            </Link>
          </div>
          {jobsQuery.isLoading ? <LoadingSkeleton /> : null}
          {jobsQuery.isError ? (
            <ErrorState message="We couldn't load open roles. Please try again shortly." onRetry={() => void jobsQuery.refetch()} />
          ) : null}
          {!jobsQuery.isLoading && !jobsQuery.isError ? (
            jobs.length ? (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} to={`/candidate/jobs/${job.id}`} />
                ))}
              </div>
            ) : (
              <EmptyState title="No open roles right now" description="New opportunities appear here as recruiters post them." />
            )
          ) : null}
        </section>

        <aside className="space-y-4">
          <Card>
            <div className="flex items-center justify-between">
              <h2 className="font-extrabold text-ink">Profile Strength</h2>
              <span className="text-2xl font-extrabold text-brand-700">{profileQuery.isLoading ? '…' : `${completion}%`}</span>
            </div>
            <div className="mt-4"><ProgressBar value={completion} /></div>
            <div className="mt-4 flex flex-col items-start space-y-2 text-sm text-muted">
              {missingItems.map((item, i) => (
                <Link key={i} to="/candidate/profile" className="hover:text-brand-600 hover:underline">
                  • {item}
                </Link>
              ))}
            </div>
            <Link to="/candidate/profile">
              <Button variant="secondary" className="mt-5 w-full">
                {completion === 100 ? 'View Profile' : 'Improve Profile'}
              </Button>
            </Link>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <h2 className="font-extrabold text-ink">Recent Applications</h2>
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
                    className="rounded-xl border border-line dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 p-3.5 transition hover:bg-slate-100/70 dark:hover:bg-slate-700/60"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-bold uppercase tracking-wider text-brand-700 dark:text-brand-400">
                          {item.job?.companyName ?? 'Company'}
                        </p>
                        <h3 className="mt-0.5 truncate text-sm font-bold text-ink dark:text-white">
                          {item.job?.title ?? 'Role'}
                        </h3>
                      </div>
                      <StatusBadge status={item.status} />
                    </div>
                    <div className="mt-2.5 flex items-center justify-between border-t border-line/60 dark:border-slate-700 pt-2 text-xs text-muted dark:text-slate-400">
                      <span>Applied {formatDate(appliedDate(item))}</span>
                      <Link
                        to={`/candidate/applications/${item.id}`}
                        className="font-bold text-brand-700 dark:text-brand-400 hover:underline"
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
