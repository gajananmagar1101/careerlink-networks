import { useSearchParams } from 'react-router-dom';
import { JobCard } from '../../components/JobCard';
import { JobSearchForm } from '../../components/jobs/JobSearchForm';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { EmptyState, ErrorState, LoadingSkeleton } from '../../components/ui/Feedback';
import { Pagination } from '../../components/ui/Pagination';
import { useDebounce } from '../../hooks/useDebounce';
import { useJobs } from '../../hooks/useJobs';
import { matchesJobExtras, sortJobs } from '../../utils/jobs';
import type { EmploymentType } from '../../types/domain';

export function CandidateJobsPage() {
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
  const debouncedCategory = useDebounce(category);
  const query = useJobs({ keyword: debouncedKeyword, location: debouncedLocation, category: debouncedCategory, employmentType, page: currentPage, size: 10 });
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

  function setFilter(key: string, value: string) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== 'page') next.delete('page');
    setParams(next);
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Dashboard', to: '/candidate/dashboard' }, { label: 'Find jobs' }]} />
      <div>
        <p className="text-sm font-bold text-brand-700">Job discovery</p>
        <h1 className="mt-1 text-3xl font-extrabold">Find your next role</h1>
      </div>
      <JobSearchForm
        values={{ keyword, location, employmentType, category, minExperience, minSalary, sort }}
        onChange={setFilter}
        onClear={() => setParams({})}
        showExtras
      />
      <section>
        <div className="mb-4 flex items-center justify-between">
          <p className="font-bold">{query.isLoading ? 'Searching…' : `${total} ${total === 1 ? 'job' : 'jobs'} found`}</p>
        </div>
        {query.isLoading ? <LoadingSkeleton /> : null}
        {query.isError ? (
          <ErrorState message="We couldn't load jobs right now. Please try again shortly." onRetry={() => void query.refetch()} />
        ) : null}
        {!query.isLoading && !query.isError ? (
          <div className="space-y-4">
            {jobs.length ? jobs.map((job) => <JobCard key={job.id} job={job} to={`/candidate/jobs/${job.id}`} />) : (
              <EmptyState title="No jobs match your search" description="Try widening your filters or searching for a broader skill." />
            )}
          </div>
        ) : null}
        <Pagination page={currentPage} totalPages={query.data?.totalPages ?? 1} onPageChange={(p) => setFilter('page', String(p))} />
      </section>
    </div>
  );
}
