import { ArrowRight, MapPin, Search } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useJobs } from '../../hooks/useJobs';
import { Button } from '../../components/ui/Button';
import { TrackingPreview } from '../../components/TrackingPreview';
import { LandingSections } from './landing/LandingSections';
import type { ApiError } from '../../types/domain';

const POPULAR_SEARCHES = ['Java', 'Python', 'Frontend', 'Data Analyst', 'Product Manager', 'Remote'];

export function LandingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [keyword, setKeyword] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const featured = useJobs({ size: 3 });
  const authRequired = ((featured.error as ApiError | null)?.status ?? 0) === 401;

  useEffect(() => {
    if (location.hash) {
      document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location.hash]);

  function search(event: FormEvent) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (keyword.trim()) params.set('keyword', keyword.trim());
    if (locationQuery.trim()) params.set('location', locationQuery.trim());
    navigate(`/jobs?${params}`);
  }

  return (
    <main>
      <section className="border-b border-line bg-canvas">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.15fr_.85fr] lg:gap-16 lg:px-8 lg:py-20">
          <div>
            <p className="inline-flex rounded-full border border-brand-100 bg-brand-50 px-3 py-1 text-sm font-bold text-brand-700">
              CareerLink Networks
            </p>
            <h1 className="mt-6 max-w-3xl text-4xl font-extrabold leading-[1.08] tracking-tight text-ink sm:text-6xl">
              Find work that moves your career forward.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">
              Discover roles from hiring teams, apply with a complete profile, and follow every application from first submission to final decision.
            </p>
            <form onSubmit={search} className="mt-8 rounded-lg border border-line bg-white p-3 shadow-soft" aria-label="Search jobs">
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="flex items-center gap-3 rounded-md px-2 py-2 transition hover:bg-canvas">
                  <Search size={18} className="shrink-0 text-brand-700" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs font-semibold text-ink">Job title, skills, or keywords</span>
                    <input className="mt-1 w-full bg-transparent py-1 text-sm outline-none placeholder:text-slate-400" placeholder="Java, Product Designer" aria-label="Job title, skills, or keywords" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
                  </span>
                </label>
                <label className="flex items-center gap-3 rounded-md px-2 py-2 transition hover:bg-canvas sm:border-l sm:border-line">
                  <MapPin size={18} className="shrink-0 text-brand-700" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs font-semibold text-ink">Location</span>
                    <input className="mt-1 w-full bg-transparent py-1 text-sm outline-none placeholder:text-slate-400" placeholder="Pune, Remote" aria-label="Location" value={locationQuery} onChange={(e) => setLocationQuery(e.target.value)} />
                  </span>
                </label>
              </div>
              <Button className="mt-3 w-full">Search Jobs<ArrowRight className="h-4 w-4" /></Button>
            </form>
            <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs">
              <span className="text-muted">Popular searches:</span>
              {POPULAR_SEARCHES.map((term) => (
                <Link key={term} className="font-semibold text-brand-700 transition hover:text-brand-600 hover:underline" to={`/jobs?${term === 'Remote' ? 'employmentType=REMOTE' : `keyword=${encodeURIComponent(term)}`}`}>{term}</Link>
              ))}
            </div>
          </div>
          <TrackingPreview />
        </div>
      </section>
      <LandingSections featured={{ ...featured, authRequired }} />
    </main>
  );
}
