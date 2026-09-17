import { Link } from 'react-router-dom';
import { Logo } from './ui/Logo';

export function Footer() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.6fr_1fr_1fr_1fr] lg:px-8">
        <div>
          <div className="flex items-center">
            <Logo height={32} />
          </div>
          <p className="mt-3 max-w-md text-sm leading-6 text-muted">
            Enterprise talent acquisition and application tracking for candidates and recruiting teams.
          </p>
        </div>
        <div>
          <p className="font-bold">Explore</p>
          <div className="mt-3 space-y-2 text-sm text-muted">
            <Link className="block hover:text-ink hover:underline" to="/jobs">Jobs</Link>
            <Link className="block hover:text-ink hover:underline" to="/companies">Companies</Link>
            <Link className="block hover:text-ink hover:underline" to="/about">About</Link>
          </div>
        </div>
        <div>
          <p className="font-bold">Candidates</p>
          <div className="mt-3 space-y-2 text-sm text-muted">
            <Link className="block hover:text-ink hover:underline" to="/register?role=CANDIDATE">Create profile</Link>
            <Link className="block hover:text-ink hover:underline" to="/jobs">Find jobs</Link>
            <Link className="block hover:text-ink hover:underline" to="/login">Track applications</Link>
          </div>
        </div>
        <div>
          <p className="font-bold">Recruiters</p>
          <div className="mt-3 space-y-2 text-sm text-muted">
            <Link className="block hover:text-ink hover:underline" to="/register?role=RECRUITER">Hire talent</Link>
            <Link className="block hover:text-ink hover:underline" to="/login">Review applicants</Link>
            <Link className="block hover:text-ink hover:underline" to="/about">How hiring works</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-line">
        <p className="mx-auto max-w-7xl px-4 py-4 text-xs text-muted sm:px-6 lg:px-8">© {new Date().getFullYear()} CareerLink Networks. All rights reserved.</p>
      </div>
    </footer>
  );
}
