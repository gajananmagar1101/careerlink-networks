import { ChevronDown, LayoutDashboard, LogOut, Menu, User as UserIcon, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
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
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { user, isAuthenticated, dashboardPath, logout } = useAuth();
  const { notify } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  const roleLinks = user?.role === 'RECRUITER' ? recruiterLinks : candidateLinks;
  const links = isAuthenticated ? roleLinks : publicLinks;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userMenuOpen]);

  function goHash(hash: string) {
    setOpen(false);
    if (location.pathname === '/') {
      document.getElementById(hash.replace('#', ''))?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    navigate(`/${hash}`);
  }

  function handleLogout() {
    setUserMenuOpen(false);
    setOpen(false);
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
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setUserMenuOpen((prev) => !prev)}
                className="inline-flex items-center gap-2 rounded-lg p-1.5 pr-2.5 text-sm font-semibold text-ink hover:bg-slate-100 transition focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                aria-expanded={userMenuOpen}
                aria-haspopup="true"
                aria-label="User menu"
              >
                <Avatar name={user.name} />
                <span className="max-w-[140px] truncate text-slate-800 font-bold">{user.name}</span>
                <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${userMenuOpen ? 'rotate-180 text-brand-600' : ''}`} />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-line bg-white p-2 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center gap-3 px-3 py-2.5 bg-slate-50 rounded-lg border border-slate-100">
                    <Avatar name={user.name} />
                    <div className="min-w-0 flex-1">
                      <p className="font-extrabold text-sm text-slate-900 truncate">{user.name}</p>
                      <p className="text-xs text-muted truncate">{user.email}</p>
                      <span className="mt-1 inline-block text-[11px] font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full">
                        {user.role === 'RECRUITER' ? 'Recruiter' : 'Job Seeker'}
                      </span>
                    </div>
                  </div>

                  <div className="my-2 border-t border-line/60" />

                  <div className="space-y-0.5">
                    <Link
                      to={dashboardPath}
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition"
                    >
                      <LayoutDashboard className="h-4 w-4 text-slate-400" />
                      Dashboard
                    </Link>

                    <Link
                      to={user.role === 'RECRUITER' ? '/recruiter/profile' : '/candidate/profile'}
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition"
                    >
                      <UserIcon className="h-4 w-4 text-slate-400" />
                      My Profile
                    </Link>
                  </div>

                  <div className="my-2 border-t border-line/60" />

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-2.5 w-full rounded-lg px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 transition text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
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
            {isAuthenticated && user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <Avatar name={user.name} />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-sm truncate">{user.name}</p>
                    <p className="text-xs text-muted truncate">{user.email}</p>
                  </div>
                </div>
                <Button variant="danger" className="w-full" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" /> Sign out
                </Button>
              </div>
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
