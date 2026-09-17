import { useMemo, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { CheckCircle2, Pencil, Send, UsersRound } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { JobDetailContent } from '../../components/jobs/JobDetailContent';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { EmptyState, ErrorState, LoadingSkeleton } from '../../components/ui/Feedback';
import { Input, Textarea } from '../../components/ui/Fields';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { useApplyJob, useCandidateApplications } from '../../hooks/useApplications';
import { useJob } from '../../hooks/useJobs';
import { useCandidateProfile } from '../../hooks/useProfiles';
import { isJobOpen } from '../../utils/jobs';
import { jobsListPath } from '../../utils/paths';
import { profileApi } from '../../api/profileApi';
import type { ApiError } from '../../types/domain';

const applySchema = z.object({
  resumeUrl: z.string().url('Please enter a valid resume URL.').optional().or(z.literal('')),
  coverLetter: z.string().max(5000, 'Cover letter must be under 5000 characters.').optional()
});
type ApplyValues = z.infer<typeof applySchema>;

export function JobDetailsPage() {
  const { id } = useParams();
  const location = useLocation();
  const query = useJob(id);
  const { user, isAuthenticated } = useAuth();
  const applications = useCandidateApplications(user?.role === 'CANDIDATE' ? user.id : undefined);
  const profileQuery = useCandidateProfile(user?.role === 'CANDIDATE' ? user.id : undefined);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const { notify } = useToast();
  const apply = useApplyJob();
  const existing = useMemo(
    () => applications.data?.find((item) => item.jobId === id),
    [applications.data, id]
  );

  const { register, handleSubmit, formState, watch } = useForm<ApplyValues>({
    resolver: zodResolver(applySchema),
    values: { resumeUrl: profileQuery.data?.resumeUrl ?? '', coverLetter: '' }
  });
  const coverLetter = watch('coverLetter') ?? '';
  const isRecruiter = user?.role === 'RECRUITER';
  const isCandidate = user?.role === 'CANDIDATE';
  const listPath = jobsListPath(user?.role);
  const authRequired = ((query.error as ApiError | null)?.status ?? 0) === 401 && !isAuthenticated;

  async function submit(values: ApplyValues) {
    if (!query.data) return;
    try {
      if (user && (!profileQuery.data || !profileQuery.data.fullName)) {
        await profileApi.saveCandidate({
          fullName: user.name,
          email: user.email,
          headline: 'Job Seeker',
          resumeUrl: values.resumeUrl || undefined
        }).catch(() => undefined);
      }
      await apply.mutateAsync({ jobId: query.data.id, resumeUrl: values.resumeUrl || undefined, coverLetter: values.coverLetter });
      notify('Application submitted successfully.', 'success');
      setOpen(false);
      setStep(1);
    } catch (err) {
      notify((err as ApiError).message, 'error');
    }
  }

  if (query.isLoading) {
    return <LoadingSkeleton rows={3} />;
  }

  if (authRequired) {
    return (
      <EmptyState
        title="Sign in to view this role"
        description="Job details are served through the API Gateway and currently require an authenticated session."
        action={
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/login" state={{ from: location }} className="inline-flex rounded-md bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white">Sign In</Link>
            <Link to="/register" className="inline-flex rounded-md border border-line px-5 py-2.5 text-sm font-semibold">Create account</Link>
          </div>
        }
      />
    );
  }

  if (query.isError || !query.data) {
    return <ErrorState message="We couldn't load this job. It may have been closed or removed." onRetry={() => void query.refetch()} />;
  }

  const job = query.data;
  const canApply = isCandidate && isJobOpen(job) && !existing;
  const ownsJob = isRecruiter && job.recruiterId === user.id;

  return (
    <div className="space-y-4">
      <Breadcrumbs items={[{ label: 'Jobs', to: listPath }, { label: job.title }]} />
      <JobDetailContent
        job={job}
        sidebar={
          <Card>
            {isRecruiter ? (
              <>
                <h2 className="text-xl font-extrabold">Hiring actions</h2>
                <p className="mt-2 text-sm leading-6 text-muted">
                  {ownsJob ? 'Review applicants and keep this posting up to date.' : 'You can review this role. Application management is available for jobs you posted.'}
                </p>
                {ownsJob ? (
                  <div className="mt-6 space-y-3">
                    <Link to={`/recruiter/jobs/${job.id}/applications`} className="block">
                      <Button className="w-full"><UsersRound className="h-4 w-4" /> View applications</Button>
                    </Link>
                    <Link to={`/recruiter/jobs/${job.id}/edit`} className="block">
                      <Button variant="secondary" className="w-full"><Pencil className="h-4 w-4" /> Edit job</Button>
                    </Link>
                  </div>
                ) : (
                  <Link to="/recruiter/jobs" className="mt-6 inline-flex">
                    <Button variant="secondary">Back to my jobs</Button>
                  </Link>
                )}
              </>
            ) : existing ? (
              <>
                <h2 className="text-xl font-extrabold">Apply</h2>
                <div className="mt-4 rounded-md bg-brand-50 p-4 text-brand-700">
                  <CheckCircle2 className="h-6 w-6" />
                  <p className="mt-2 font-bold">Application submitted</p>
                  <p className="mt-1 text-sm">You have already applied to this role.</p>
                  <Link to={`/candidate/applications/${existing.id}`} className="mt-4 inline-flex">
                    <Button variant="secondary">View application</Button>
                  </Link>
                </div>
              </>
            ) : canApply ? (
              <>
                <h2 className="text-xl font-extrabold">Apply</h2>
                <p className="mt-2 text-sm leading-6 text-muted">Review your profile, add a cover letter if you wish, then submit. Duplicate applications are blocked.</p>
                <Button className="mt-6 w-full" onClick={() => setOpen(true)}><Send className="h-4 w-4" /> Apply Now</Button>
              </>
            ) : isAuthenticated ? (
              <>
                <h2 className="text-xl font-extrabold">Apply</h2>
                <p className="mt-3 text-sm text-muted">This role is not accepting new applications.</p>
              </>
            ) : (
              <>
                <h2 className="text-xl font-extrabold">Apply</h2>
                <p className="mt-2 text-sm leading-6 text-muted">Create a candidate account to apply and track this role.</p>
                <Link to="/login" state={{ from: location }} className="mt-6 block">
                  <Button className="w-full">Sign in to apply</Button>
                </Link>
              </>
            )}
          </Card>
        }
      />
      <Modal open={open} title="Apply for this role" onClose={() => { setOpen(false); setStep(1); }}>
        <form className="space-y-4" onSubmit={handleSubmit(submit)}>
          {step === 1 ? (
            <>
              <Card className="bg-canvas shadow-none">
                <p className="font-bold">Review your profile</p>
                <p className="mt-1 text-sm text-muted">{profileQuery.data?.fullName ?? user?.name} · {profileQuery.data?.headline ?? 'Add a headline on your profile for a stronger application.'}</p>
                <Link to="/candidate/profile" className="mt-3 inline-block text-sm font-bold text-brand-700 hover:underline">Edit profile</Link>
              </Card>
              <Button type="button" className="w-full" onClick={() => setStep(2)}>Continue</Button>
            </>
          ) : (
            <>
              <Input label="Resume URL" placeholder="https://..." helper="Optional if your profile already has a resume URL." error={formState.errors.resumeUrl?.message} {...register('resumeUrl')} />
              <Textarea label="Cover letter" maxLength={5000} value={coverLetter} error={formState.errors.coverLetter?.message} {...register('coverLetter')} />
              <div className="flex gap-3">
                <Button type="button" variant="secondary" onClick={() => setStep(1)}>Back</Button>
                <Button className="flex-1" disabled={apply.isPending}>{apply.isPending ? 'Submitting…' : 'Confirm and submit'}</Button>
              </div>
            </>
          )}
        </form>
      </Modal>
    </div>
  );
}
