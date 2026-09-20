import { useState } from 'react';
import { Calendar, Video, MapPin, Clock, ExternalLink } from 'lucide-react';
import { useRecruiterInterviews, useCancelInterview, useCompleteInterview } from '../../hooks/useInterviews';
import { formatDate } from '../../utils/format';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';

export function RecruiterInterviewsPage() {
  const { notify } = useToast();
  const { data: interviews = [], isLoading } = useRecruiterInterviews();
  const cancelMutation = useCancelInterview();
  const completeMutation = useCompleteInterview();

  const [feedbackPromptId, setFeedbackPromptId] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState('');

  const handleComplete = async (id: string) => {
    try {
      await completeMutation.mutateAsync({ id, feedback: feedbackText || undefined });
      notify('Interview marked as completed!', 'success');
      setFeedbackPromptId(null);
      setFeedbackText('');
    } catch {
      notify('Failed to update interview', 'error');
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this interview?')) return;
    try {
      await cancelMutation.mutateAsync({ id, reason: 'Recruiter schedule conflict' });
      notify('Interview cancelled', 'info');
    } catch {
      notify('Failed to cancel interview', 'error');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="border-b border-line pb-6">
        <div className="flex items-center gap-2">
          <Calendar className="h-6 w-6 text-purple-600" />
          <h1 className="text-3xl font-extrabold text-ink">Scheduled Interviews</h1>
        </div>
        <p className="mt-1 text-sm text-muted">
          Manage evaluation calls, track candidate progress, and record interview feedback
        </p>
      </div>

      <div className="mt-8">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-40 rounded-2xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        ) : interviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-line bg-white dark:bg-slate-900 dark:border-slate-700 p-12 text-center shadow-sm">
            <Calendar className="h-12 w-12 text-purple-300 stroke-1" />
            <h3 className="mt-3 text-lg font-bold text-ink">No interviews scheduled yet</h3>
            <p className="mt-1 text-sm text-muted">
              Use the Hiring Pipeline or Candidate Applications page to schedule interviews with candidates.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {interviews.map((item) => (
              <Card key={item.id} className="transition hover:border-purple-200">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="rounded-md bg-purple-100 px-2.5 py-1 text-xs font-extrabold text-purple-800 uppercase tracking-wide">
                        {item.interviewType.replace('_', ' ')}
                      </span>
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        item.status === 'COMPLETED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.status === 'CANCELLED'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-brand-100 text-brand-800'
                      }`}>
                        {item.status}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-ink">
                      {item.job?.title || 'Job Interview'}
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-muted">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 text-purple-500" />
                        <span>{formatDate(item.scheduledAt)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4 text-purple-500" />
                        <span>{item.durationMinutes} minutes</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {item.mode === 'REMOTE' ? (
                          <>
                            <Video className="h-4 w-4 text-purple-500" />
                            <span>Remote Video Call</span>
                          </>
                        ) : (
                          <>
                            <MapPin className="h-4 w-4 text-purple-500" />
                            <span>{item.location || 'Onsite'}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {item.feedback && (
                      <p className="text-xs text-emerald-800 bg-emerald-50 rounded-lg p-2.5 border border-emerald-200 max-w-xl">
                        <span className="font-bold">Feedback:</span> {item.feedback}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    {item.meetingLink && item.status !== 'CANCELLED' && (
                      <a
                        href={item.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-purple-600 px-3.5 py-2 text-xs font-bold text-white shadow hover:bg-purple-700 transition"
                      >
                        <Video className="h-4 w-4" />
                        <span>Join</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}

                    {item.status === 'SCHEDULED' && (
                      <>
                        <button
                          type="button"
                          onClick={() => setFeedbackPromptId(item.id)}
                          className="rounded-xl border border-emerald-300 bg-emerald-50 px-3.5 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition"
                        >
                          Mark Complete
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCancel(item.id)}
                          className="rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-bold text-slate-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {feedbackPromptId === item.id && (
                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                    <label className="block text-xs font-bold text-slate-700">Interview Evaluation & Notes</label>
                    <textarea
                      rows={2}
                      placeholder="Candidate demonstrated strong skills in algorithms, recommended for offer..."
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 p-2 text-xs focus:border-brand-500 focus:outline-none"
                    />
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={() => setFeedbackPromptId(null)}>
                        Dismiss
                      </Button>
                      <Button size="sm" onClick={() => handleComplete(item.id)}>
                        Submit & Complete
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
