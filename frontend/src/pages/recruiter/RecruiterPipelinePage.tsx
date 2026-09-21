import { useState } from 'react';
import { Kanban, Filter, Calendar, Gift, CheckCircle2, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useRecruiterJobs } from '../../hooks/useJobs';
import { useJobApplications, useUpdateApplicationStatus } from '../../hooks/useApplications';
import { InterviewSchedulerModal } from '../../components/interviews/InterviewSchedulerModal';
import { OfferModal } from '../../components/offers/OfferModal';
import { ConfirmDialog } from '../../components/ui/Modal';
import { formatDate } from '../../utils/format';
import { statusLabel } from '../../utils/applications';
import type { ApiError, Application, ApplicationStatus } from '../../types/domain';

const PIPELINE_COLUMNS: {
  id: ApplicationStatus;
  title: string;
  color: string;
  badgeBg: string;
}[] = [
  { id: 'APPLIED',            title: 'New Applied',         color: 'border-slate-300 dark:border-slate-600',   badgeBg: 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200' },
  { id: 'UNDER_REVIEW',       title: 'Under Review',        color: 'border-blue-400 dark:border-blue-600',     badgeBg: 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200' },
  { id: 'SHORTLISTED',        title: 'Shortlisted',         color: 'border-indigo-400 dark:border-indigo-600', badgeBg: 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200' },
  { id: 'INTERVIEW_SCHEDULED',title: 'Interviewing',        color: 'border-purple-400 dark:border-purple-600', badgeBg: 'bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200' },
  { id: 'OFFERED',            title: 'Offered',             color: 'border-amber-400 dark:border-amber-600',   badgeBg: 'bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200' },
  { id: 'HIRED',              title: 'Hired',               color: 'border-emerald-500 dark:border-emerald-600',badgeBg: 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200' },
  { id: 'REJECTED',           title: 'Archived / Rejected', color: 'border-rose-300 dark:border-rose-700',     badgeBg: 'bg-rose-100 dark:bg-rose-900/50 text-rose-800 dark:text-rose-200' }
];

export function RecruiterPipelinePage() {
  const { user } = useAuth();
  const { data: pagedJobs, isLoading: jobsLoading } = useRecruiterJobs(user?.id);
  const jobs = pagedJobs?.content || [];

  const [selectedJobId, setSelectedJobId] = useState<string>('');
  const activeJobId = selectedJobId || (jobs.length > 0 ? jobs[0].id : '');

  const { data: applications = [], isLoading: appsLoading } = useJobApplications(activeJobId);
  const updateStatusMutation = useUpdateApplicationStatus();

  const [interviewModal, setInterviewModal] = useState<{ isOpen: boolean; app: Application | null }>({
    isOpen: false,
    app: null
  });
  const [offerModal, setOfferModal] = useState<{ isOpen: boolean; app: Application | null }>({
    isOpen: false,
    app: null
  });

  const { notify } = useToast();
  const [confirmModal, setConfirmModal] = useState<{
    app: Application;
    targetStatus: ApplicationStatus;
    title: string;
    description: string;
    confirmLabel: string;
    tone: 'danger' | 'primary';
  } | null>(null);

  const handleConfirmAction = async () => {
    if (!confirmModal) return;
    try {
      await updateStatusMutation.mutateAsync({
        applicationId: confirmModal.app.id,
        status: confirmModal.targetStatus
      });
      notify(`Candidate moved to ${statusLabel(confirmModal.targetStatus)}.`, 'success');
      setConfirmModal(null);
    } catch (err: unknown) {
      notify((err as ApiError)?.message || 'Failed to update candidate status', 'error');
    }
  };

  const activeJob = jobs.find(j => j.id === activeJobId);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-line dark:border-slate-700 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Kanban className="h-6 w-6 text-brand-600 dark:text-brand-400" />
            <h1 className="text-3xl font-extrabold text-ink dark:text-white">Recruiter Hiring Pipeline</h1>
          </div>
          <p className="mt-1 text-sm text-muted dark:text-slate-400">
            Kanban candidate board with automated interview scheduling, offer management, and status transitions
          </p>
        </div>

        {jobs.length > 0 && (
          <div className="flex items-center gap-3">
            <Filter className="h-4 w-4 text-slate-400 dark:text-slate-500" />
            <select
              value={activeJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm font-semibold text-ink dark:text-slate-100 shadow-sm focus:border-brand-500 dark:focus:border-brand-400 focus:outline-none"
            >
              {jobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.title} ({j.companyName})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Loading skeleton */}
      {jobsLoading || appsLoading ? (
        <div className="mt-8 flex gap-4 overflow-x-auto pb-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-96 w-72 shrink-0 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>

      /* Empty state — no jobs */
      ) : jobs.length === 0 ? (
        <div className="mt-12 flex flex-col items-center justify-center rounded-3xl border border-dashed border-line dark:border-slate-700 bg-white dark:bg-slate-900 p-12 text-center shadow-sm">
          <Kanban className="h-12 w-12 text-slate-300 dark:text-slate-600 stroke-1" />
          <h3 className="mt-3 text-lg font-bold text-ink dark:text-white">No active jobs</h3>
          <p className="mt-1 text-sm text-muted dark:text-slate-400">Post a job first to start managing applicant pipelines.</p>
        </div>

      ) : (
        <div className="mt-8">
          <div className="flex items-center justify-between pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Applicants: {applications.length}
            </span>
          </div>

          {/* Kanban columns */}
          <div className="flex gap-4 overflow-x-auto pb-6">
            {PIPELINE_COLUMNS.map((col) => {
              const colApps = applications.filter((app) => {
                if (col.id === 'INTERVIEW_SCHEDULED') {
                  return app.status === 'INTERVIEW_SCHEDULED' || app.status === 'INTERVIEW_COMPLETED';
                }
                return app.status === col.id;
              });

              return (
                <div
                  key={col.id}
                  className="flex w-80 shrink-0 flex-col rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 p-3 shadow-sm"
                >
                  {/* Column header */}
                  <div className={`flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700 border-l-4 pl-2 ${col.color}`}>
                    <span className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200">
                      {col.title}
                    </span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-black ${col.badgeBg}`}>
                      {colApps.length}
                    </span>
                  </div>

                  {/* Cards */}
                  <div className="mt-3 flex flex-1 flex-col gap-3 min-h-[450px]">
                    {colApps.length === 0 ? (
                      <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-slate-200 dark:border-slate-700 p-4 text-center">
                        <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">Empty Stage</span>
                      </div>
                    ) : (
                      colApps.map((app) => {
                        const candidateName = app.candidateProfile?.fullName || 'Candidate';
                        const headline = app.candidateProfile?.headline || 'Applicant';
                        const skills = app.candidateProfile?.skills || [];

                        return (
                          <div
                            key={app.id}
                            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3.5 shadow-sm transition hover:shadow-md dark:hover:border-slate-600 space-y-2.5"
                          >
                            <div className="flex items-start justify-between gap-1">
                              <div>
                                <h4 className="font-bold text-sm text-ink dark:text-slate-100 truncate">{candidateName}</h4>
                                <p className="text-xs text-muted dark:text-slate-400 truncate">{headline}</p>
                              </div>
                              <span className="text-[10px] text-muted dark:text-slate-500 shrink-0">
                                {formatDate(app.appliedAt || app.createdAt)}
                              </span>
                            </div>

                            {skills.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {skills.slice(0, 3).map((s) => (
                                  <span key={s} className="rounded bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 text-[10px] font-semibold text-slate-700 dark:text-slate-200">
                                    {s}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Quick Action Buttons */}
                            <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-700">
                              {col.id === 'APPLIED' && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setConfirmModal({
                                      app,
                                      targetStatus: 'UNDER_REVIEW',
                                      title: 'Move to Under Review?',
                                      description: `Are you sure you want to move ${candidateName}'s application to Under Review for "${activeJob?.title || 'this position'}"?`,
                                      confirmLabel: 'Move to Under Review',
                                      tone: 'primary'
                                    })
                                  }
                                  className="inline-flex items-center gap-1 rounded-lg bg-blue-50 dark:bg-blue-900/40 px-2 py-1 text-[11px] font-bold text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/70 transition"
                                >
                                  Under Review <ChevronRight className="h-3 w-3" />
                                </button>
                              )}

                              {col.id === 'UNDER_REVIEW' && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setConfirmModal({
                                      app,
                                      targetStatus: 'SHORTLISTED',
                                      title: 'Shortlist Candidate?',
                                      description: `Are you sure you want to shortlist ${candidateName} for "${activeJob?.title || 'this position'}"? This will advance the candidate to the Shortlisted stage.`,
                                      confirmLabel: 'Yes, Shortlist',
                                      tone: 'primary'
                                    })
                                  }
                                  className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 dark:bg-indigo-900/40 px-2 py-1 text-[11px] font-bold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/70 transition"
                                >
                                  Shortlist <ChevronRight className="h-3 w-3" />
                                </button>
                              )}

                              {(col.id === 'SHORTLISTED' || col.id === 'UNDER_REVIEW') && (
                                <button
                                  type="button"
                                  onClick={() => setInterviewModal({ isOpen: true, app })}
                                  className="inline-flex items-center gap-1 rounded-lg bg-purple-50 dark:bg-purple-900/40 px-2 py-1 text-[11px] font-bold text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/70 transition"
                                >
                                  <Calendar className="h-3 w-3" /> Interview
                                </button>
                              )}

                              {col.id === 'INTERVIEW_SCHEDULED' && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => setOfferModal({ isOpen: true, app })}
                                    className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 dark:bg-emerald-900/40 px-2 py-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/70 transition"
                                  >
                                    <Gift className="h-3 w-3" /> Extend Offer
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setInterviewModal({ isOpen: true, app })}
                                    className="inline-flex items-center gap-1 rounded-lg bg-purple-50 dark:bg-purple-900/40 px-2 py-1 text-[11px] font-bold text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/70 transition"
                                  >
                                    <Calendar className="h-3 w-3" /> Next Round
                                  </button>
                                </>
                              )}

                              {col.id === 'OFFERED' && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setConfirmModal({
                                      app,
                                      targetStatus: 'HIRED',
                                      title: 'Confirm Candidate Hire?',
                                      description: `Are you sure you want to confirm hiring ${candidateName} for "${activeJob?.title || 'this position'}"?`,
                                      confirmLabel: 'Confirm Hire',
                                      tone: 'primary'
                                    })
                                  }
                                  className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 dark:bg-emerald-900/40 px-2 py-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/70 transition"
                                >
                                  <CheckCircle2 className="h-3 w-3" /> Confirm Hire
                                </button>
                              )}

                              {col.id !== 'REJECTED' && col.id !== 'HIRED' && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setConfirmModal({
                                      app,
                                      targetStatus: 'REJECTED',
                                      title: 'Reject Application?',
                                      description: `Are you sure you want to reject ${candidateName}'s application for "${activeJob?.title || 'this position'}"?`,
                                      confirmLabel: 'Yes, Reject',
                                      tone: 'danger'
                                    })
                                  }
                                  className="ml-auto text-[11px] text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 transition"
                                >
                                  Reject
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modals */}
      {interviewModal.isOpen && interviewModal.app && (
        <InterviewSchedulerModal
          isOpen={interviewModal.isOpen}
          applicationId={interviewModal.app.id}
          candidateName={interviewModal.app.candidateProfile?.fullName || 'Candidate'}
          jobTitle={activeJob?.title || 'Job'}
          onClose={() => setInterviewModal({ isOpen: false, app: null })}
        />
      )}

      {offerModal.isOpen && offerModal.app && (
        <OfferModal
          isOpen={offerModal.isOpen}
          applicationId={offerModal.app.id}
          candidateName={offerModal.app.candidateProfile?.fullName || 'Candidate'}
          jobTitle={activeJob?.title || 'Job'}
          onClose={() => setOfferModal({ isOpen: false, app: null })}
        />
      )}

      {/* Confirmation Dialog */}
      <ConfirmDialog
        open={Boolean(confirmModal)}
        title={confirmModal?.title || ''}
        description={confirmModal?.description || ''}
        confirmLabel={confirmModal?.confirmLabel || 'Confirm'}
        tone={confirmModal?.tone || 'primary'}
        onCancel={() => setConfirmModal(null)}
        onConfirm={() => void handleConfirmAction()}
      />
    </div>
  );
}
