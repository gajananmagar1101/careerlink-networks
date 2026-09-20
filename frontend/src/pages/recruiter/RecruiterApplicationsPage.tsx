import { useMemo, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { EmptyState, ErrorState, LoadingSkeleton } from '../../components/ui/Feedback';
import { ConfirmDialog, Drawer } from '../../components/ui/Modal';
import { Input, Select } from '../../components/ui/Fields';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { applicationStatuses } from '../../constants/applicationStatus';
import { useToast } from '../../context/ToastContext';
import { useJobApplications, useUpdateApplicationStatus } from '../../hooks/useApplications';
import type { ApiError, Application, ApplicationStatus } from '../../types/domain';
import { appliedDate, statusLabel } from '../../utils/applications';
import { formatDate } from '../../utils/format';

const quickActions: Array<{ status: ApplicationStatus; label: string; tone?: 'danger' | 'primary' }> = [
  { status: 'UNDER_REVIEW', label: 'Under Review' },
  { status: 'SHORTLISTED', label: 'Shortlist' },
  { status: 'INTERVIEW_SCHEDULED', label: 'Schedule Interview' },
  { status: 'HIRED', label: 'Hire' },
  { status: 'REJECTED', label: 'Reject', tone: 'danger' }
];

export function RecruiterApplicationsPage() {
  const { id } = useParams();
  const query = useJobApplications(id);
  const updateStatus = useUpdateApplicationStatus();
  const { notify } = useToast();
  const [selected, setSelected] = useState<Application | null>(null);
  const [pending, setPending] = useState<{ application: Application; status: ApplicationStatus } | null>(null);
  const [status, setStatus] = useState<ApplicationStatus | ''>('');
  const [search, setSearch] = useState('');
  const applications = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return (query.data ?? []).filter((application) => {
      if (status && application.status !== status) return false;
      if (!needle) return true;
      const haystack = [application.candidateProfile?.fullName, application.candidateProfile?.email, application.candidateProfile?.headline]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(needle);
    });
  }, [query.data, search, status]);

  async function confirmStatus() {
    if (!pending) return;
    try {
      await updateStatus.mutateAsync({ applicationId: pending.application.id, status: pending.status });
      notify(`Status updated to ${statusLabel(pending.status)}.`, 'success');
      setSelected((current) => (current?.id === pending.application.id ? { ...current, status: pending.status } : current));
      setPending(null);
    } catch (err) {
      notify((err as ApiError).message, 'error');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-bold text-brand-700">Application review</p>
          <h1 className="mt-1 text-3xl font-extrabold">Candidates for this role</h1>
          <p className="mt-2 text-muted">Evaluate profiles, resumes, cover letters, and pipeline status.</p>
        </div>
        <Link to={`/recruiter/jobs/${id}`} className="text-sm font-bold text-brand-700 hover:underline">View job</Link>
      </div>
      <div className="grid gap-4 md:grid-cols-[1fr_220px]">
        <Input label="Search candidates" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Name or headline" />
        <Select label="Status" value={status} onChange={(event) => setStatus(event.target.value as ApplicationStatus | '')}>
          <option value="">All statuses</option>
          {applicationStatuses.map((item) => (
            <option key={item} value={item}>{statusLabel(item)}</option>
          ))}
        </Select>
      </div>
      {query.isLoading ? <LoadingSkeleton /> : null}
      {query.isError ? (
        <ErrorState message="We couldn't load applications for this role. Please try again shortly." onRetry={() => void query.refetch()} />
      ) : null}
      {!query.isLoading && !query.isError ? (
        <div className="space-y-4">
          {applications.length ? applications.map((application) => (
            <Card key={application.id}>
              <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
                <div className="flex gap-3">
                  <Avatar name={application.candidateProfile?.fullName ?? 'Candidate'} />
                  <div>
                    <h2 className="font-extrabold text-ink dark:text-white">{application.candidateProfile?.fullName ?? 'Candidate profile'}</h2>
                    <div className="mt-0.5 flex flex-wrap items-center gap-x-2 text-sm text-muted">
                      <span>{application.candidateProfile?.headline ?? 'Job Seeker'}</span>
                      {application.candidateProfile?.email ? <span>• {application.candidateProfile.email}</span> : null}
                    </div>
                    <p className="mt-1 text-xs text-muted">Applied {formatDate(appliedDate(application))}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {(application.candidateProfile?.skills ?? []).slice(0, 4).map((skill) => <Badge key={skill}>{skill}</Badge>)}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={application.status} />
                  <Button variant="secondary" onClick={() => setSelected(application)}>Review</Button>
                </div>
              </div>
            </Card>
          )) : (
            <EmptyState title="No applications yet" description="Applications for this job will appear here as candidates apply." />
          )}
        </div>
      ) : null}
      <Drawer open={Boolean(selected)} title="Candidate review" onClose={() => setSelected(null)}>
        {selected ? (() => {
          const candidateResume = selected.resumeUrl || selected.candidateProfile?.resumeUrl;
          return (
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <Avatar name={selected.candidateProfile?.fullName ?? 'Candidate'} />
                <div>
                  <h2 className="text-2xl font-extrabold">{selected.candidateProfile?.fullName ?? 'Candidate profile'}</h2>
                  <p className="font-medium text-brand-700">{selected.candidateProfile?.headline ?? 'Job Seeker'}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-x-2 text-sm text-muted">
                    {selected.candidateProfile?.email ? <span>{selected.candidateProfile.email}</span> : null}
                    {selected.candidateProfile?.phone ? <span>• {selected.candidateProfile.phone}</span> : null}
                    {selected.candidateProfile?.location ? <span>• {selected.candidateProfile.location}</span> : null}
                  </div>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-muted">Current status</p>
                <div className="mt-2"><StatusBadge status={selected.status} /></div>
              </div>
              <div className="flex flex-wrap gap-2">
                {quickActions.filter((action) => action.status !== selected.status).map((action) => (
                  <Button key={action.status} variant={action.tone === 'danger' ? 'danger' : 'secondary'} onClick={() => setPending({ application: selected, status: action.status })}>
                    {action.label}
                  </Button>
                ))}
              </div>
              <Select
                label="Set status"
                value={selected.status}
                onChange={(event) => setPending({ application: selected, status: event.target.value as ApplicationStatus })}
              >
                {applicationStatuses.filter((item) => item !== 'WITHDRAWN').map((item) => (
                  <option key={item} value={item}>{statusLabel(item)}</option>
                ))}
              </Select>
              <Card className="shadow-none">
                <h3 className="font-bold">Cover letter</h3>
                <p className="mt-2 whitespace-pre-wrap leading-7 text-muted">{selected.coverLetter || 'No cover letter provided.'}</p>
              </Card>
              <Card className="shadow-none">
                <h3 className="font-bold">Profile summary</h3>
                <p className="mt-2 leading-7 text-muted">{selected.candidateProfile?.summary || 'Profile details will appear here once the candidate has completed their profile.'}</p>
              </Card>
              {selected.candidateProfile?.skills && selected.candidateProfile.skills.length > 0 ? (
                <div>
                  <h3 className="mb-2 text-sm font-semibold text-muted">Skills</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {selected.candidateProfile.skills.map((skill) => (
                      <Badge key={skill}>{skill}</Badge>
                    ))}
                  </div>
                </div>
              ) : null}
              {selected.candidateProfile?.experience && selected.candidateProfile.experience.length > 0 ? (
                <Card className="shadow-none">
                  <h3 className="font-bold">Experience</h3>
                  <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted">
                    {selected.candidateProfile.experience.map((exp, i) => (
                      <li key={i}>{exp}</li>
                    ))}
                  </ul>
                </Card>
              ) : null}
              {selected.candidateProfile?.education && selected.candidateProfile.education.length > 0 ? (
                <Card className="shadow-none">
                  <h3 className="font-bold">Education</h3>
                  <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted">
                    {selected.candidateProfile.education.map((edu, i) => (
                      <li key={i}>{edu}</li>
                    ))}
                  </ul>
                </Card>
              ) : null}
              {candidateResume ? (
                <div className="pt-2">
                  <a className="inline-flex items-center gap-2 font-bold text-brand-700 hover:underline" href={candidateResume} target="_blank" rel="noreferrer">
                    View / Download Resume <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              ) : (
                <p className="text-sm text-muted">No resume URL provided.</p>
              )}
            </div>
          );
        })() : null}
      </Drawer>
      <ConfirmDialog
        open={Boolean(pending)}
        title="Update application status?"
        description={pending ? `Move this candidate to ${statusLabel(pending.status)}. This change is saved to the application service.` : ''}
        confirmLabel="Update status"
        tone={pending?.status === 'REJECTED' ? 'danger' : 'primary'}
        onCancel={() => setPending(null)}
        onConfirm={() => void confirmStatus()}
      />
    </div>
  );
}
