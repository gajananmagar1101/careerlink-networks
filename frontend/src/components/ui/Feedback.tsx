import { Briefcase, RefreshCcw } from 'lucide-react';
import { Button } from './Button';

export function LoadingSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="surface rounded-lg p-5">
          <div className="skeleton h-4 w-1/3 rounded" />
          <div className="skeleton mt-4 h-8 w-2/3 rounded" />
          <div className="skeleton mt-4 h-4 w-full rounded" />
        </div>
      ))}
    </div>
  );
}

export function EmptyState({ title, description, action }: { title: string; description: string; action?: React.ReactNode }) {
  return (
    <div className="surface rounded-lg px-6 py-10 text-center">
      <Briefcase className="mx-auto h-10 w-10 text-brand-600" />
      <h2 className="mt-4 text-lg font-bold text-ink">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 px-5 py-4">
      <p className="font-semibold text-red-800">Something went wrong.</p>
      <p className="mt-1 text-sm text-red-700">{message}</p>
      {onRetry ? (
        <Button type="button" variant="secondary" className="mt-4" onClick={onRetry}>
          <RefreshCcw className="h-4 w-4" />
          Retry
        </Button>
      ) : null}
    </div>
  );
}
