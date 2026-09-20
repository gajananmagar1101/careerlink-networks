import { Link } from 'react-router-dom';
import { Logo } from './ui/Logo';

export function Footer() {
  return (
    <footer className="relative z-20 border-t border-line dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.6fr_1fr_1fr_1fr] lg:px-8">
        <div>
          <div className="flex items-center">
            <Logo height={32} />
          </div>
          <p className="mt-3 max-w-md text-sm leading-6 text-muted dark:text-slate-400">
            Enterprise talent acquisition and application tracking for candidates and recruiting teams.
          </p>
        </div>
        <div>
          <p className="font-bold text-slate-900 dark:text-slate-100">Explore</p>
          <div className="mt-3 space-y-2 text-sm text-muted dark:text-slate-400">
            <Link className="block hover:text-ink dark:hover:text-white hover:underline" to="/jobs">Jobs</Link>
            <Link className="block hover:text-ink dark:hover:text-white hover:underline" to="/companies">Companies</Link>
            <Link className="block hover:text-ink dark:hover:text-white hover:underline" to="/about">About</Link>
          </div>
        </div>
        <div>
          <p className="font-bold text-slate-900 dark:text-slate-100">Candidates</p>
          <div className="mt-3 space-y-2 text-sm text-muted dark:text-slate-400">
            <Link className="block hover:text-ink dark:hover:text-white hover:underline" to="/register?role=CANDIDATE">Create profile</Link>
            <Link className="block hover:text-ink dark:hover:text-white hover:underline" to="/jobs">Find jobs</Link>
            <Link className="block hover:text-ink dark:hover:text-white hover:underline" to="/login">Track applications</Link>
          </div>
        </div>
        <div>
          <p className="font-bold text-slate-900 dark:text-slate-100">Recruiters</p>
          <div className="mt-3 space-y-2 text-sm text-muted dark:text-slate-400">
            <Link className="block hover:text-ink dark:hover:text-white hover:underline" to="/register?role=RECRUITER">Hire talent</Link>
            <Link className="block hover:text-ink dark:hover:text-white hover:underline" to="/login">Review applicants</Link>
            <Link className="block hover:text-ink dark:hover:text-white hover:underline" to="/about">How hiring works</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-line dark:border-slate-800">
        <p className="mx-auto max-w-7xl px-4 py-4 text-xs text-muted dark:text-slate-400 sm:px-6 lg:px-8">© {new Date().getFullYear()} CareerLink Networks. All rights reserved.</p>
      </div>
    </footer>
  );
}
