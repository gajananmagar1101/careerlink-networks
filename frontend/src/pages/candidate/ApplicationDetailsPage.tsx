import { useParams } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { ErrorState, LoadingSkeleton } from '../../components/ui/Feedback';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Timeline } from '../../components/ui/Timeline';
import { useApplication } from '../../hooks/useApplications';
import { formatDate } from '../../utils/format';

export function ApplicationDetailsPage() {
  const { id } = useParams();
  const query = useApplication(id);

  if (query.isLoading) {
    return <LoadingSkeleton rows={2} />;
  }

  if (query.isError || !query.data) {
    return <ErrorState message="We couldn't load this application. It may have been withdrawn or the link is out of date." onRetry={() => void query.refetch()} />;
  }

  const application = query.data;
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <section className="space-y-5">
        {query.isLoading ? <LoadingSkeleton rows={1} /> : null}
        {query.isError ? <ErrorState message="Showing demo application details until MongoDB is available." /> : null}
        <Card>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-brand-700">{application.job?.companyName ?? 'Hiring team'}</p>
              <h1 className="mt-1 text-3xl font-extrabold">{application.job?.title ?? application.jobId}</h1>
            </div>
            <StatusBadge status={application.status} />
          </div>
          <dl className="mt-6 grid gap-4 sm:grid-cols-3">
            <div><dt className="text-sm text-muted">Applied</dt><dd className="font-bold">{formatDate(application.createdAt)}</dd></div>
            <div><dt className="text-sm text-muted">Last updated</dt><dd className="font-bold">{formatDate(application.updatedAt)}</dd></div>
            <div><dt className="text-sm text-muted">Resume</dt><dd className="font-bold">{application.resumeUrl ? 'Attached' : 'Not provided'}</dd></div>
          </dl>
        </Card>
        <Card>
          <h2 className="text-xl font-extrabold">Cover letter</h2>
          <p className="mt-3 leading-7 text-muted">{application.coverLetter ?? 'No cover letter was provided for this application.'}</p>
        </Card>
      </section>
      <aside className="lg:sticky lg:top-24 lg:h-fit">
        <Card>
          <h2 className="text-xl font-extrabold">Timeline</h2>
          <div className="mt-5"><Timeline status={application.status} /></div>
        </Card>
      </aside>
    </div>
  );
}
