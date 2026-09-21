import { Link } from 'react-router-dom';
import { useJobs } from '../../hooks/useJobs';
import { EmptyState, ErrorState, LoadingSkeleton } from '../../components/ui/Feedback';
import { Card } from '../../components/ui/Card';
import type { ApiError } from '../../types/domain';

export function CompaniesPage() {
  const query = useJobs({ size: 30 });
  const authRequired = ((query.error as ApiError | null)?.status ?? 0) === 401;
  const companies = [...new Map((query.data?.content ?? []).map((job) => [job.companyName, job])).values()];

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-sm font-bold text-brand-700">Companies</p>
      <h1 className="mt-2 text-3xl font-extrabold">Teams hiring on HireLink</h1>
      <p className="mt-2 max-w-2xl text-muted">Company names come from live job postings. There is no separate company directory API.</p>
      <div className="mt-8">
        {query.isLoading ? (
          <LoadingSkeleton />
        ) : query.isError ? (
          authRequired ? (
            <EmptyState
              title="Sign in to see hiring companies"
              description="Job listings — and therefore company names — require an authenticated session."
              action={<Link to="/login" className="inline-flex rounded-md bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white">Sign In</Link>}
            />
          ) : (
            <ErrorState message="We couldn't load company listings." onRetry={() => void query.refetch()} />
          )
        ) : companies.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {companies.map((job) => (
              <Card key={job.companyName}>
                <h2 className="text-lg font-extrabold">{job.companyName}</h2>
                <p className="mt-2 text-sm text-muted">{job.location} • {job.category}</p>
                <Link to={`/jobs?keyword=${encodeURIComponent(job.companyName)}`} className="mt-4 inline-block text-sm font-bold text-brand-700 hover:underline">
                  View jobs
                </Link>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState title="No companies posting yet" description="When recruiters publish jobs, their company names will appear here." />
        )}
      </div>
    </main>
  );
}
