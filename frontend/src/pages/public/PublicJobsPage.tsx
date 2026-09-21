import { Link, useSearchParams } from 'react-router-dom';
import { JobCard } from '../../components/JobCard';
import { JobSearchForm } from '../../components/jobs/JobSearchForm';
import { useJobs } from '../../hooks/useJobs';
import { useDebounce } from '../../hooks/useDebounce';
import { EmptyState, ErrorState, LoadingSkeleton } from '../../components/ui/Feedback';
import { Pagination } from '../../components/ui/Pagination';
import { useAuth } from '../../context/AuthContext';
import { matchesJobExtras, sortJobs } from '../../utils/jobs';
import type { EmploymentType } from '../../types/domain';

export function PublicJobsPage() {
  const { isAuthenticated } = useAuth();
  const [params, setParams] = useSearchParams();
  const keyword = params.get('keyword') ?? '';
  const location = params.get('location') ?? '';
  const employmentType = (params.get('employmentType') ?? '') as EmploymentType | '';
  const currentPage = parseInt(params.get('page') ?? '0', 10);
  const category = params.get('category') ?? '';
  const minExperience = params.get('minExperience') ?? '';
  const minSalary = params.get('minSalary') ?? '';
  const sort = params.get('sort') ?? 'relevance';
  const debouncedKeyword = useDebounce(keyword);
  const debouncedLocation = useDebounce(location);
  const query = useJobs({ keyword: debouncedKeyword, location: debouncedLocation, category, employmentType, page: currentPage, size: 10 });

  function setFilter(key: string, value: string) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== 'page') next.delete('page');
    setParams(next);
  }

  const jobs = sortJobs(
    (query.data?.content ?? []).filter((job) =>
      matchesJobExtras(job, {
        minExperience: minExperience ? Number(minExperience) : undefined,
        minSalary: minSalary ? Number(minSalary) : undefined
      })
    ),
    sort
  );
  const total = query.data?.totalElements ?? 0;

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold">Find your next role</h1>
      <p className="mt-2 text-muted">Search live openings from HireLink hiring teams.</p>
      <div className="mt-6">
        <JobSearchForm
          values={{ keyword, location, employmentType, category, minExperience, minSalary, sort }}
          onChange={setFilter}
          onClear={() => setParams({})}
          showExtras
        />
      </div>
      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <p className="text-lg font-extrabold">
          {query.isLoading ? 'Searching jobs…' : `${total} ${total === 1 ? 'job' : 'jobs'} found`}
        </p>
      </div>
      <div className="mt-5 space-y-4">
        {query.isLoading ? <LoadingSkeleton rows={4} /> : query.isError ? (
          'status' in query.error && query.error.status === 401 ? (
            <EmptyState
              title="Sign in to browse live job openings"
              description="Sign in to explore available jobs. Your search filters will be preserved."
              action={<Link to="/login" state={{ from: { pathname: '/jobs', search: `?${params}` } }} className="inline-flex rounded-md bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">Sign In</Link>}
            />
          ) : <ErrorState message="We couldn't load jobs right now. Please try again shortly." onRetry={() => void query.refetch()} />
        ) : jobs.length ? (
          jobs.map((job) => <JobCard key={job.id} job={job} to={isAuthenticated ? `/candidate/jobs/${job.id}` : `/jobs/${job.id}`} />)
        ) : (
          <EmptyState title="No jobs match your search" description="Try different keywords, a broader location, or clearing filters." action={<button type="button" className="font-bold text-brand-700" onClick={() => setParams({})}>Clear filters</button>} />
        )}
      </div>
      <Pagination page={currentPage} totalPages={query.data?.totalPages ?? 1} onPageChange={(p) => setFilter('page', String(p))} />
    </main>
  );
}
