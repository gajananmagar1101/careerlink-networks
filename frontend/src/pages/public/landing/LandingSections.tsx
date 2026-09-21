import { Check, CheckCircle2, ClipboardList, Search, Send, ShieldCheck, UserRound, UsersRound } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { JobCard } from '../../../components/JobCard';
import { EmptyState, ErrorState, LoadingSkeleton } from '../../../components/ui/Feedback';
import { TrackingPreview } from '../../../components/TrackingPreview';
import type { Job } from '../../../types/domain';

const TRACKING_STAGES = ['Applied', 'Under review', 'Shortlisted', 'Interview', 'Hired or closed'];

const STEPS = [
  { icon: UserRound, title: 'Create your account', text: 'Join as a candidate or recruiter. Your workspace stays focused on the work you need to do.' },
  { icon: ClipboardList, title: 'Complete a professional profile', text: 'Candidates add skills and experience. Recruiters introduce the company behind each role.' },
  { icon: Search, title: 'Discover or publish roles', text: 'Search live openings, or post a job with the details candidates actually need.' },
  { icon: Send, title: 'Apply, review, and decide', text: 'Candidates track status. Recruiters move applications through review, interview, and hire.' }
];

interface AudienceSection {
  label: string;
  title: string;
  description: string;
  items: string[];
  cta: string;
  href: string;
  tint: string;
  icon: LucideIcon;
}

const AUDIENCES: AudienceSection[] = [
  {
    label: 'For candidates',
    title: 'Discover jobs. Apply once. Stay informed.',
    description: 'Keep one professional profile, apply to open roles, and follow every status change without chasing email threads.',
    items: ['Discover relevant openings', 'Build a complete profile', 'Apply with resume and cover letter', 'Track applications in a timeline', 'Move from applied to hired with clarity'],
    cta: 'Find Jobs',
    href: '/jobs',
    tint: 'bg-canvas',
    icon: UsersRound
  },
  {
    label: 'For recruiters',
    title: 'Post roles and hire with a visible pipeline.',
    description: 'Publish jobs, review candidates, and update application status as your process moves forward.',
    items: ['Post and manage jobs', 'Review candidate profiles', 'Read cover letters and resumes', 'Update application status', 'Hire without losing context'],
    cta: 'Start hiring',
    href: '/register?role=RECRUITER',
    tint: 'bg-[#eef2ec]',
    icon: Send
  }
];

export function LandingSections({ featured }: { featured: { isLoading: boolean; isError: boolean; authRequired?: boolean; refetch: () => void; data?: { content: Job[]; totalElements?: number } | undefined } }) {
  const liveCount = featured.data?.totalElements;
  const companies = [...new Set((featured.data?.content ?? []).map((job) => job.companyName))].slice(0, 8);

  return (
    <>
      <div className="relative">
        {/* Lower section canvas background coming halfway up behind the stats card */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-canvas border-t border-line pointer-events-none" aria-hidden="true" />

        <section aria-label="Platform measures" className="relative z-20 mx-4 sm:mx-6 lg:mx-auto max-w-5xl py-2 sm:py-3">
          <div className="rounded-2xl sm:rounded-3xl border border-line bg-white shadow-soft py-8 px-6 sm:py-10 sm:px-10">
            <div className="grid gap-6 sm:grid-cols-4 sm:gap-8">
              {[
                { value: liveCount != null && !featured.authRequired ? String(liveCount) : 'Live', label: 'Open jobs in the network' },
                { value: companies.length && !featured.authRequired ? String(companies.length) : 'Teams', label: 'Hiring companies posting here' },
                { value: '2', label: 'Focused workspaces: candidate and recruiter' },
                { value: '7', label: 'Application statuses from applied to hired' }
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-3xl font-extrabold text-ink">{item.value}</p>
                  <p className="mt-2 text-sm text-muted">{item.label}</p>
                </div>
              ))}
            </div>
            {featured.authRequired ? (
              <p className="mt-4 border-t border-line/60 pt-3 text-xs text-muted">
                Live job counts appear after you sign in. The API Gateway currently protects job listings.
              </p>
            ) : null}
          </div>
        </section>
      </div>

      <div className="bg-canvas">
        <section id="companies" className="scroll-mt-20 border-b border-line pt-6 pb-10 sm:pt-8 sm:pb-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-bold text-brand-700">Hiring across industries</p>
          <h2 className="mt-2 text-center text-2xl font-extrabold text-ink">Companies posting on HireLink</h2>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-lg font-semibold text-ink/80">
            {(companies.length ? companies : ['Technology', 'Healthcare', 'Finance', 'Education', 'Manufacturing']).map((name) => (
              <span key={name}>{name}</span>
            ))}
          </div>
          <p className="mt-5 text-center text-xs text-muted">
            {companies.length ? 'Names come from current job postings, not paid partnerships.' : 'Industry labels describe the kinds of teams HireLink is built for. Company names appear from live postings after you sign in.'}
          </p>
        </div>
      </section>

      <section id="about" className="scroll-mt-20 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-bold text-brand-700">Why HireLink</p>
          <h2 className="mt-2 text-3xl font-extrabold text-ink">Hiring should feel organized, not noisy.</h2>
          <p className="mt-3 text-muted">HireLink is a talent acquisition portal: one place to publish roles, apply with a complete profile, and keep application status visible for both sides of the table.</p>
        </div>
        <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Search, title: 'Clear discovery', text: 'Search by keyword, location, and employment type against live job records.' },
            { icon: UserRound, title: 'One professional profile', text: 'Candidates keep skills, education, experience, and a resume URL in one place.' },
            { icon: ClipboardList, title: 'Visible tracking', text: 'Every application follows a defined status path from applied to hired or closed.' },
            { icon: ShieldCheck, title: 'Role-aware access', text: 'Candidate and recruiter workspaces stay separate. The API Gateway enforces authentication.' }
          ].map(({ icon: Icon, title, text }) => (
            <div key={title}>
              <Icon className="h-6 w-6 text-brand-700" />
              <h3 className="mt-4 font-bold text-ink">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="recruiters" className="scroll-mt-20 mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-2">
          {AUDIENCES.map(({ label, title, description, items, cta, href, tint, icon: Icon }) => (
            <div key={label} className={`rounded-lg border border-line p-7 sm:p-9 ${tint}`}>
              <Icon className="h-7 w-7 text-brand-700" />
              <p className="mt-5 text-sm font-bold text-brand-700">{label}</p>
              <h2 className="mt-2 text-2xl font-extrabold text-ink">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
              <ul className="mt-5 space-y-3 text-sm text-ink">
                {items.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to={href} className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-brand-700 transition hover:text-brand-600">
                {cta}
                <Send className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-canvas py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-brand-700">Featured jobs</p>
              <h2 className="mt-2 text-3xl font-extrabold text-ink">Roles hiring now</h2>
            </div>
            <Link to="/jobs" className="text-sm font-bold text-brand-700 hover:underline">Browse all jobs</Link>
          </div>
          <div className="mt-8">
            {featured.isLoading ? (
              <LoadingSkeleton />
            ) : featured.isError ? (
              featured.authRequired ? (
                <EmptyState
                  title="Sign in to browse live job openings"
                  description="The API Gateway requires authentication to read jobs. Create an account or sign in to explore openings."
                  action={
                    <div className="flex flex-wrap justify-center gap-3">
                      <Link to="/login" className="inline-flex items-center justify-center rounded-md bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700">Sign In</Link>
                      <Link to="/register" className="inline-flex items-center justify-center rounded-md border border-line bg-white px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-canvas">Create account</Link>
                    </div>
                  }
                />
              ) : (
                <ErrorState message="We couldn't load opportunities. Please try again shortly." onRetry={() => void featured.refetch()} />
              )
            ) : featured.data?.content.length ? (
              <div className="grid gap-4 xl:grid-cols-3">
                {featured.data.content.map((job) => (
                  <JobCard key={job.id} job={job} to={`/jobs/${job.id}`} />
                ))}
              </div>
            ) : (
              <EmptyState title="New opportunities are on their way" description="There are no open jobs right now. Check back soon." />
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-sm font-bold text-brand-700">How HireLink works</p>
        <h2 className="mt-2 text-3xl font-extrabold text-ink">A straightforward hiring path</h2>
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(({ icon: Icon, title, text }, index) => (
            <div key={title}>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">Step {index + 1}</p>
              <Icon className="mt-3 h-6 w-6 text-brand-700" />
              <h3 className="mt-4 font-bold text-ink">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-line bg-white py-16">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-sm font-bold text-brand-700">Application tracking</p>
            <h2 className="mt-2 text-3xl font-extrabold text-ink">See where every application stands</h2>
            <p className="mt-3 max-w-lg leading-7 text-muted">
              Status is recorded by the application service. Candidates see completed, current, and upcoming stages. Recruiters update status as they review, shortlist, interview, hire, or reject.
            </p>
            <ol className="mt-6 space-y-3">
              {TRACKING_STAGES.map((stage, index) => (
                <li key={stage} className="flex items-center gap-3 text-sm">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-brand-700 text-xs font-bold text-white">{index + 1}</span>
                  <span className="font-medium text-ink">{stage}</span>
                </li>
              ))}
            </ol>
          </div>
          <TrackingPreview />
        </div>
      </section>

      <section className="border-t border-line bg-canvas py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <CheckCircle2 className="mx-auto h-8 w-8 text-brand-700" />
          <h2 className="mt-4 text-3xl font-extrabold text-ink">Built for serious hiring conversations</h2>
          <p className="mt-3 text-muted">HireLink is a working product over real auth, profile, job, and application services — not a decorative dashboard template.</p>
        </div>
      </section>

      <section className="border-t border-line bg-white py-16 text-center">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="text-3xl font-extrabold text-ink">Ready to take the next step?</h2>
          <p className="mt-3 text-muted">Create a HireLink account and start as a candidate or a recruiter.</p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link to="/register" className="inline-flex items-center justify-center rounded-md bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700">Get Started</Link>
            <Link to="/jobs" className="inline-flex items-center justify-center rounded-md border border-line bg-white px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-canvas">Explore Jobs</Link>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}
