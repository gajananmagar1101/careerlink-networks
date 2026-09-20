import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { ErrorState, LoadingSkeleton } from '../../components/ui/Feedback';
import { Input, Select, Textarea } from '../../components/ui/Fields';
import { useToast } from '../../context/ToastContext';
import { useCreateJob, useJob, useUpdateJob } from '../../hooks/useJobs';
import type { ApiError, EmploymentType, JobStatus } from '../../types/domain';
import { splitTags } from '../../utils/format';

const schema = z.object({
  title: z.string().min(3, 'Enter a clear job title.'),
  companyName: z.string().min(2, 'Company name is required.'),
  description: z.string().min(20, 'Description must be at least 20 characters.').max(10000),
  location: z.string().min(2, 'Location is required.'),
  employmentType: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'REMOTE']),
  experienceRequired: z.coerce.number().min(0),
  salaryMin: z.coerce.number().optional(),
  salaryMax: z.coerce.number().optional(),
  skills: z.string().min(2, 'Add at least one skill.'),
  category: z.string().min(2, 'Category is required.'),
  applicationDeadline: z.string().min(1, 'Application deadline is required.'),
  status: z.enum(['OPEN', 'CLOSED', 'DRAFT'])
});
type FormValues = z.infer<typeof schema>;

export function RecruiterJobFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const query = useJob(id);
  const job = query.data;
  const createJob = useCreateJob();
  const updateJob = useUpdateJob(id ?? '');
  const { notify } = useToast();
  const navigate = useNavigate();
  const { register, handleSubmit, formState, watch, setValue } = useForm<FormValues>({
    resolver: zodResolver(schema),
    values: {
      title: job?.title ?? '',
      companyName: job?.companyName ?? '',
      description: job?.description ?? '',
      location: job?.location ?? '',
      employmentType: job?.employmentType ?? 'FULL_TIME',
      experienceRequired: job?.experienceRequired ?? 0,
      salaryMin: job?.salaryMin,
      salaryMax: job?.salaryMax,
      skills: job?.skills.join(', ') ?? '',
      category: job?.category ?? '',
      applicationDeadline: job?.applicationDeadline ?? '',
      status: job?.status ?? 'OPEN'
    }
  });
  const description = watch('description') ?? '';

  if (isEdit && query.isLoading) {
    return <LoadingSkeleton rows={3} />;
  }

  if (isEdit && (query.isError || !query.data)) {
    return <ErrorState message="We couldn't load this job for editing. Please try again shortly." onRetry={() => void query.refetch()} />;
  }

  async function onSubmit(values: FormValues) {
    try {
      const payload = {
        ...values,
        employmentType: values.employmentType as EmploymentType,
        status: values.status as JobStatus,
        skills: splitTags(values.skills),
        salaryMin: values.salaryMin || undefined,
        salaryMax: values.salaryMax || undefined
      };
      const saved = isEdit ? await updateJob.mutateAsync(payload) : await createJob.mutateAsync(payload);
      notify(isEdit ? 'Job updated successfully.' : 'Job published successfully.', 'success');
      if (!isEdit && saved?.id) navigate(`/recruiter/jobs/${saved.id}/applications`); else navigate('/recruiter/jobs');
    } catch (err) {
      notify((err as ApiError).message, 'error');
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <p className="text-sm font-bold text-brand-700">{isEdit ? 'Edit role' : 'New role'}</p>
        <h1 className="mt-1 text-3xl font-extrabold">{isEdit ? 'Edit job' : 'Post a job'}</h1>
      </div>
      <Card>
        <h2 className="text-xl font-extrabold">Basic Information</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Input label="Job Title" error={formState.errors.title?.message} {...register('title')} />
          <Input label="Company Name" error={formState.errors.companyName?.message} {...register('companyName')} />
          <Input label="Location" error={formState.errors.location?.message} {...register('location')} />
          <Input label="Category" error={formState.errors.category?.message} {...register('category')} />
        </div>
      </Card>
      <Card>
        <h2 className="text-xl font-extrabold">Job Details</h2>
        <div className="mt-4 space-y-4">
          <Textarea label="Description" maxLength={10000} value={description} error={formState.errors.description?.message} {...register('description')} />
          <div className="grid gap-4 sm:grid-cols-3">
            <Select label="Employment Type" {...register('employmentType')}>
              <option value="FULL_TIME">Full time</option>
              <option value="PART_TIME">Part time</option>
              <option value="CONTRACT">Contract</option>
              <option value="INTERNSHIP">Internship</option>
              <option value="REMOTE">Remote</option>
            </Select>
            <Input label="Experience Required" type="number" error={formState.errors.experienceRequired?.message} {...register('experienceRequired')} />
            <Select label="Status" {...register('status')}>
              <option value="OPEN">Open</option>
              <option value="DRAFT">Draft</option>
              <option value="CLOSED">Closed</option>
            </Select>
          </div>
        </div>
      </Card>
      <Card>
        <h2 className="text-xl font-extrabold">Compensation, Skills, Application Settings</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Input label="Salary Min" type="number" {...register('salaryMin')} />
          <Input label="Salary Max" type="number" {...register('salaryMax')} />
          <Input label="Skills" helper="Separate with commas" error={formState.errors.skills?.message} {...register('skills')} />
          <Input label="Application Deadline" type="date" error={formState.errors.applicationDeadline?.message} {...register('applicationDeadline')} />
        </div>
      </Card>
      <div className="flex gap-3">
        <Button disabled={createJob.isPending || updateJob.isPending}><Save className="h-4 w-4" /> {isEdit ? 'Save Changes' : 'Publish Job'}</Button>
        <Button
          type="button"
          variant="secondary"
          disabled={createJob.isPending || updateJob.isPending}
          onClick={() => {
            setValue('status', 'DRAFT');
            void handleSubmit(onSubmit)();
          }}
        >
          Save Draft
        </Button>
      </div>
    </form>
  );
}
