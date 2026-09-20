import { useState } from 'react';
import { Sparkles, CheckCircle, XCircle } from 'lucide-react';
import { useOptionalAuth } from '../../context/AuthContext';
import { useJobMatch } from '../../hooks/useJobMatch';

interface JobMatchBadgeProps {
  jobId: string;
}

export function JobMatchBadge({ jobId }: JobMatchBadgeProps) {
  const auth = useOptionalAuth();
  const user = auth?.user;
  const isCandidate = user?.role === 'CANDIDATE';

  if (!isCandidate) {
    return null;
  }

  return <JobMatchBadgeInner jobId={jobId} />;
}

function JobMatchBadgeInner({ jobId }: JobMatchBadgeProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const { data: match, isLoading } = useJobMatch(jobId, true);

  if (isLoading || !match) {
    return null;
  }

  const scoreColor =
    match.score >= 80
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : match.score >= 60
      ? 'bg-amber-50 text-amber-700 border-amber-200'
      : 'bg-slate-100 text-slate-700 border-slate-200';

  const dotColor =
    match.score >= 80
      ? 'bg-emerald-500'
      : match.score >= 60
      ? 'bg-amber-500'
      : 'bg-slate-400';

  return (
    <div className="relative inline-block" onMouseLeave={() => setShowTooltip(false)}>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setShowTooltip(!showTooltip);
        }}
        onMouseEnter={() => setShowTooltip(true)}
        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold shadow-sm transition hover:shadow ${scoreColor}`}
      >
        <Sparkles className="h-3.5 w-3.5 text-brand-600" />
        <span>{match.score}% Match</span>
        <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />
      </button>

      {showTooltip && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute right-0 top-full z-30 mt-2 w-72 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 shadow-xl text-left"
        >
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Match Analysis</span>
            <span className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${scoreColor}`}>
              {match.score}% Score
            </span>
          </div>

          <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 italic leading-relaxed">
            {match.explanation}
          </p>

          {match.matchedSkills.length > 0 && (
            <div className="mt-3">
              <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                <CheckCircle className="h-3.5 w-3.5" /> Matched Skills ({match.matchedSkills.length})
              </span>
              <div className="mt-1 flex flex-wrap gap-1">
                {match.matchedSkills.map(s => (
                  <span key={s} className="rounded bg-emerald-50 dark:bg-emerald-900/40 px-1.5 py-0.5 text-[10px] font-medium text-emerald-800 dark:text-emerald-300">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {match.missingSkills.length > 0 && (
            <div className="mt-3">
              <span className="flex items-center gap-1 text-[11px] font-semibold text-rose-700 dark:text-rose-400">
                <XCircle className="h-3.5 w-3.5" /> Skills to Develop ({match.missingSkills.length})
              </span>
              <div className="mt-1 flex flex-wrap gap-1">
                {match.missingSkills.map(s => (
                  <span key={s} className="rounded bg-rose-50 dark:bg-rose-900/40 px-1.5 py-0.5 text-[10px] font-medium text-rose-800 dark:text-rose-300">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
