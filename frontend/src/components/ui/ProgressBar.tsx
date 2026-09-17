export function ProgressBar({ value }: { value: number }) {
  const safeValue = Math.max(0, Math.min(100, value));
  return (
    <div className="h-2 overflow-hidden rounded-full bg-slate-200" aria-label={`Progress ${safeValue}%`}>
      <div className="h-full rounded-full bg-brand-600 transition-all" style={{ width: `${safeValue}%` }} />
    </div>
  );
}
