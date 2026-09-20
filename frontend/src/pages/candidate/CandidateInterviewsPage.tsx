import { Calendar, Video, MapPin, Clock, ExternalLink } from 'lucide-react';
import { useCandidateInterviews } from '../../hooks/useInterviews';
import { formatDate } from '../../utils/format';
import { Card } from '../../components/ui/Card';

export function CandidateInterviewsPage() {
  const { data: interviews = [], isLoading } = useCandidateInterviews();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700 border border-brand-200">Scheduled</span>;
      case 'RESCHEDULED':
        return <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 border border-amber-200">Rescheduled</span>;
      case 'COMPLETED':
        return <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">Completed</span>;
      case 'CANCELLED':
        return <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-rose-700 border border-rose-200">Cancelled</span>;
      default:
        return <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">{status}</span>;
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="border-b border-line pb-6">
        <div className="flex items-center gap-2">
          <Calendar className="h-6 w-6 text-purple-600" />
          <h1 className="text-3xl font-extrabold text-ink">My Interviews</h1>
        </div>
        <p className="mt-1 text-sm text-muted">
          View and prepare for your upcoming video screenings and technical evaluation rounds
        </p>
      </div>

      <div className="mt-8">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-36 rounded-2xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        ) : interviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-line bg-white dark:bg-slate-900 dark:border-slate-700 p-12 text-center shadow-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
              <Calendar className="h-8 w-8 stroke-1" />
            </div>
            <h3 className="mt-4 text-xl font-bold text-ink">No interviews scheduled yet</h3>
            <p className="mt-1 max-w-md text-sm text-muted">
              Once recruiters review your application and invite you for an interview, meeting details and links will appear right here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {interviews.map((item) => (
              <Card key={item.id} className="transition hover:border-purple-200">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="rounded-md bg-purple-100 px-2.5 py-1 text-xs font-extrabold text-purple-800 uppercase tracking-wide">
                        {item.interviewType.replace('_', ' ')}
                      </span>
                      {getStatusBadge(item.status)}
                    </div>

                    <h3 className="text-xl font-bold text-ink">
                      {item.job?.title || 'Job Interview'}
                    </h3>

                    {item.job?.companyName && (
                      <p className="text-sm font-semibold text-slate-600">
                        {item.job.companyName}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-muted pt-1">
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
                            <span>{item.location || 'Onsite Office'}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {item.notes && (
                      <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-600 border border-slate-100 max-w-xl">
                        <span className="font-bold text-slate-700">Instructions: </span>
                        {item.notes}
                      </div>
                    )}
                  </div>

                  {item.mode === 'REMOTE' && item.meetingLink && item.status !== 'CANCELLED' && (
                    <a
                      href={item.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-purple-700 transition self-start shrink-0"
                    >
                      <Video className="h-4 w-4" />
                      <span>Join Meeting</span>
                      <ExternalLink className="h-3 w-3 opacity-80" />
                    </a>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
