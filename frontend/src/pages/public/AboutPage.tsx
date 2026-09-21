import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';

export function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-sm font-bold text-brand-700">About HireLink</p>
      <h1 className="mt-2 text-4xl font-extrabold text-ink">A hiring network with a clear paper trail.</h1>
      <p className="mt-4 text-lg leading-8 text-muted">
        HireLink is an enterprise talent acquisition portal. Candidates search jobs, maintain a professional profile, apply, and track status. Recruiters post roles, review applicants, and move applications through a defined pipeline.
      </p>
      <div className="mt-10 space-y-8 text-sm leading-7 text-muted">
        <section>
          <h2 className="text-xl font-extrabold text-ink">What we do not pretend to be</h2>
          <p className="mt-2">Password reset, social sign-in, and saved jobs are not part of the current backend. Those controls are omitted or labeled rather than simulated.</p>
        </section>
        <section>
          <h2 className="text-xl font-extrabold text-ink">How data moves</h2>
          <p className="mt-2">The frontend talks only to the API Gateway. Authentication uses JWT. Profiles, jobs, and applications live in dedicated services behind that gateway.</p>
        </section>
      </div>
      <div className="mt-10 flex gap-3">
        <Link to="/register"><Button>Get Started</Button></Link>
        <Link to="/jobs"><Button variant="secondary">Browse jobs</Button></Link>
      </div>
    </main>
  );
}
