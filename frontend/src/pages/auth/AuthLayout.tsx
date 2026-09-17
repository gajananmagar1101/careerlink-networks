import { CheckCircle2 } from 'lucide-react';
import { Logo } from '../../components/ui/Logo';

const highlights = [
  'One professional profile for every application',
  'Track each application from applied to decision',
  'A focused workspace for recruiters'
];

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-[1.05fr_1fr]">
      <section className="relative hidden flex-col justify-between bg-ink p-10 text-white lg:flex" aria-hidden="true">
        <div className="flex items-center">
          <Logo variant="light" height={36} />
        </div>
        <div className="py-12">
          <h2 className="max-w-md text-4xl font-extrabold leading-tight">Your next opportunity starts here.</h2>
          <p className="mt-4 max-w-md text-sm leading-7 text-slate-300">
            CareerLink keeps your job search — or your hiring pipeline — organized, visible, and moving forward.
          </p>
          <ul className="mt-8 space-y-3">
            {highlights.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-slate-200">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-100" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-xs text-slate-400">© {new Date().getFullYear()} CareerLink Networks</p>
      </section>
      <section className="flex items-center justify-center bg-canvas px-4 py-12 sm:px-6">
        <div className="w-full max-w-md">{children}</div>
      </section>
    </main>
  );
}