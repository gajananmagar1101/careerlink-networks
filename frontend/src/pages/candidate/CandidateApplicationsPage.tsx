import { Link } from 'react-router-dom';
import { ApplicationCard } from '../../components/ApplicationCard';
import { Button } from '../../components/ui/Button';
import { EmptyState, ErrorState, LoadingSkeleton } from '../../components/ui/Feedback';
import { useAuth } from '../../context/AuthContext';
import { useCandidateApplications } from '../../hooks/useApplications';

export function CandidateApplicationsPage() {
  const { user } = useAuth();
  const query = useCandidateApplications(user?.id);
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-bold text-brand-700">Application tracking</p>
        <h1 className="mt-1 text-3xl font-extrabold">Your applications</h1>
        <p className="mt-2 text-muted">See job, company, status, and last update in one place.</p>
      </div>
      {query.isLoading ? <LoadingSkeleton /> : null}
      {query.isError ? (
        <ErrorState message="We couldn't load your applications. Please try again shortly." onRetry={() => void query.refetch()} />
      ) : null}
      {!query.isLoading && !query.isError ? (
        <div className="space-y-4">
          {query.data?.length ? (
            query.data.map((application) => <ApplicationCard key={application.id} application={application} />)
          ) : (
            <EmptyState title="You haven't applied to any jobs yet." description="Explore open roles and start building your pipeline." action={<Link to="/candidate/jobs"><Button>Explore Jobs</Button></Link>} />
          )}
        </div>
      ) : null}
    </div>
  );
}
