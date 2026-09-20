import { Bookmark } from 'lucide-react';
import { useOptionalAuth } from '../../context/AuthContext';
import { useSavedJobIds, useToggleSaveJob } from '../../hooks/useSavedJobs';

interface SavedJobButtonProps {
  jobId: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showText?: boolean;
}

export function SavedJobButton({ jobId, size = 'md', className = '', showText = false }: SavedJobButtonProps) {
  const auth = useOptionalAuth();
  const user = auth?.user;
  const isCandidate = user?.role === 'CANDIDATE';

  if (!isCandidate) {
    return null;
  }

  return <SavedJobButtonInner jobId={jobId} size={size} className={className} showText={showText} />;
}

function SavedJobButtonInner({ jobId, size = 'md', className = '', showText = false }: SavedJobButtonProps) {
  const { data: savedIds = [] } = useSavedJobIds();
  const { saveJob, unsaveJob, isPending } = useToggleSaveJob();

  const isSaved = savedIds.includes(jobId);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isPending) return;

    if (isSaved) {
      await unsaveJob(jobId);
    } else {
      await saveJob(jobId);
    }
  };

  const iconSizes = {
    sm: 'h-3.5 w-3.5',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isPending}
      title={isSaved ? 'Remove from saved jobs' : 'Save job'}
      aria-label={isSaved ? 'Remove from saved jobs' : 'Save job'}
      className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-all duration-200 ${
        isSaved
          ? 'border-brand-600 bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 shadow-sm hover:bg-brand-100 dark:hover:bg-brand-900/50'
          : 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-brand-300 dark:hover:border-brand-500 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-brand-600 dark:hover:text-brand-400'
      } ${className}`}
    >
      <Bookmark
        className={`${iconSizes[size]} transition-transform active:scale-125 ${
          isSaved ? 'fill-brand-600 text-brand-600' : 'text-slate-400'
        }`}
      />
      {showText ? (
        <span>{isSaved ? 'Saved' : 'Save'}</span>
      ) : null}
    </button>
  );
}
