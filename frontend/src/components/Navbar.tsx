import { LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Logo } from './ui/Logo';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Avatar } from './ui/Avatar';
import { Button } from './ui/Button';

const publicLinks = [
  { to: '/jobs', label: 'Jobs' },
  { to: '/companies', label: 'Companies' },
  { to: '/#recruiters', label: 'For Recruiters', hash: true },
  { to: '/about', label: 'About' }
];

const candidateLinks = [
  { to: '/candidate/dashboard', label: 'Dashboard' },
  { to: '/candidate/jobs', label: 'Find Jobs' },
  { to: '/candidate/applications', label: 'Applications' },
  { to: '/candidate/profile', label: 'Profile' }
];

const recruiterLinks = [
  { to: '/recruiter/dashboard', label: 'Dashboard' },
  { to: '/recruiter/jobs', label: 'Jobs' },
  { to: '/recruiter/applications', label: 'Applications' },
  { to: '/recruiter/profile', label: 'Profile' }
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, isAuthenticated, dashboardPath, logout } = useAuth();
  const { notify } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  const roleLinks = user?.role === 'RECRUITER' ? recruiterLinks : candidateLinks;
  const links = isAuthenticated ? roleLinks : publicLinks;

  function goHash(hash: string) {
    setOpen(false);
    if (location.pathname === '/') {
      document.getElementById(hash.replace('#', ''))?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    navigate(`/${hash}`);
  }

  function handleLogout() {
    logout();
    notify('You have been signed out.', 'info');
  }

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-white/95 backdrop-blur">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-md focus:bg-white focus:px-3 focus:py-2">
        Skip to content
      </a>
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <Link to={isAuthenticated ? dashboardPath : '/'} className="flex items-center transition hover:opacity-90" aria-label="CareerLink">
          <Logo height={32} />
        </Link>
        <div className="hidden items-center gap-7 md:flex">
          {links.map((link) =>
            'hash' in link && link.hash ? (
              <button key={link.to} type="button" className="text-sm font-semibold text-muted transition hover:text-ink" onClick={() => goHash('#recruiters')}>
                {link.label}
              </button>
            ) : (
              <NavLink key={link.to} to={link.to} className={({ isActive }) => `text-sm font-semibold transition hover:text-ink ${isActive ? 'text-ink' : 'text-muted'}`}>
                {link.label}
              </NavLink>
            )
          )}
        </div>
        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated && user ? (
            <>
              <Link to={dashboardPath} className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-ink hover:bg-slate-100">
                <Avatar name={user.name} />
                <span className="max-w-[140px] truncate">{user.name}</span>
              </Link>
              <Button variant="ghost" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-semibold text-ink">
                Sign In
              </Link>
              <Link to="/register">
                <Button>Get Started</Button>
              </Link>
            </>
          )}
        </div>
        <button className="rounded-md p-2 hover:bg-slate-100 md:hidden" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label="Toggle navigation">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>
      {open ? (
        <div className="border-t border-line bg-white p-4 md:hidden">
          <div className="flex flex-col gap-4">
            {links.map((link) =>
              'hash' in link && link.hash ? (
                <button key={link.to} type="button" className="text-left text-sm font-semibold" onClick={() => goHash('#recruiters')}>
                  {link.label}
                </button>
              ) : (
                <NavLink key={link.to} to={link.to} onClick={() => setOpen(false)} className="text-sm font-semibold">
                  {link.label}
                </NavLink>
              )
            )}
          </div>
          <div className="mt-4 flex flex-col gap-3">
            {isAuthenticated ? (
              <Button variant="secondary" onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)} className="text-sm font-semibold">
                  Sign In
                </Link>
                <Link to="/register" onClick={() => setOpen(false)}>
                  <Button className="w-full">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}
