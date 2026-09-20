import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { ErrorState } from '../../components/ui/Feedback';
import { Input, Textarea } from '../../components/ui/Fields';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useCandidateProfile, useSaveCandidateProfile } from '../../hooks/useProfiles';
import type { ApiError } from '../../types/domain';
import { splitTags } from '../../utils/format';

const schema = z.object({
  fullName: z.string().min(2, 'Please enter your full name.'),
  email: z.string().email('Please enter a valid email.'),
  phone: z.string().optional(),
  location: z.string().optional(),
  headline: z.string().optional(),
  summary: z.string().max(3000).optional(),
  skills: z.string().optional(),
  education: z.string().optional(),
  experience: z.string().optional(),
  resumeUrl: z.string().url('Please enter a valid URL.').optional().or(z.literal(''))
});
type FormValues = z.infer<typeof schema>;

export function CandidateProfilePage() {
  const { user } = useAuth();
  const { notify } = useToast();
  const profileQuery = useCandidateProfile(user?.id);
  const saveProfile = useSaveCandidateProfile(user?.id ?? '');
  const { register, handleSubmit, formState, watch } = useForm<FormValues>({
    resolver: zodResolver(schema),
    values: {
      fullName: profileQuery.data?.fullName ?? user?.name ?? '',
      email: profileQuery.data?.email ?? user?.email ?? '',
      phone: profileQuery.data?.phone ?? '',
      location: profileQuery.data?.location ?? '',
      headline: profileQuery.data?.headline ?? '',
      summary: profileQuery.data?.summary ?? '',
      skills: profileQuery.data?.skills?.join(', ') ?? '',
      education: profileQuery.data?.education?.join(', ') ?? '',
      experience: profileQuery.data?.experience?.join(', ') ?? '',
      resumeUrl: profileQuery.data?.resumeUrl ?? ''
    }
  });
  const values = watch();
  const completion = Math.round((['fullName', 'email', 'headline', 'summary', 'skills', 'education', 'experience', 'resumeUrl'] as const).filter((key) => Boolean(values[key])).length / 8 * 100);
  const skills = splitTags(values.skills ?? '');

  async function onSubmit(values: FormValues) {
    try {
      await saveProfile.mutateAsync({
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        location: values.location,
        headline: values.headline,
        summary: values.summary,
        skills: splitTags(values.skills ?? ''),
        education: splitTags(values.education ?? ''),
        experience: splitTags(values.experience ?? ''),
        resumeUrl: values.resumeUrl || undefined
      });
      notify('Profile updated successfully.', 'success');
    } catch (err) {
      notify((err as ApiError).message, 'error');
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <p className="text-sm font-bold text-brand-700">Resume profile</p>
          <h1 className="mt-1 text-3xl font-extrabold">Candidate profile</h1>
        </div>
        {profileQuery.isError ? <ErrorState message="You can still edit and save once MongoDB is available." /> : null}
        <Card>
          <h2 className="text-xl font-extrabold">Basic Information</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Input label="Full name" error={formState.errors.fullName?.message} {...register('fullName')} />
            <Input label="Email" type="email" error={formState.errors.email?.message} {...register('email')} />
            <Input label="Phone" {...register('phone')} />
            <Input label="Location" {...register('location')} />
          </div>
        </Card>
        <Card>
          <h2 className="text-xl font-extrabold">Professional Summary</h2>
          <div className="mt-4 space-y-4">
            <Input label="Headline" placeholder="Java developer building reliable services" {...register('headline')} />
            <Textarea label="Summary" maxLength={3000} value={values.summary ?? ''} {...register('summary')} />
          </div>
        </Card>
        <Card>
          <h2 className="text-xl font-extrabold">Skills, Education, Experience</h2>
          <div className="mt-4 space-y-4">
            <Input label="Skills" helper="Separate with commas" {...register('skills')} />
            <Input label="Education" helper="Separate with commas" {...register('education')} />
            <Input label="Experience" helper="Separate with commas" {...register('experience')} />
            <Input label="Resume URL" error={formState.errors.resumeUrl?.message} {...register('resumeUrl')} />
          </div>
        </Card>
        <Button disabled={saveProfile.isPending}><Save className="h-4 w-4" /> Save Profile</Button>
      </form>
      <aside className="space-y-5 lg:sticky lg:top-24 lg:h-fit">
        <Card>
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold">Profile strength</h2>
            <span className="text-2xl font-extrabold text-brand-700">{completion}%</span>
          </div>
          <div className="mt-4"><ProgressBar value={completion} /></div>
        </Card>
        <Card>
          <h2 className="font-extrabold">Skills preview</h2>
          <div className="mt-4 flex flex-wrap gap-2">{skills.map((skill) => <Badge key={skill}>{skill}</Badge>)}</div>
        </Card>
      </aside>
    </div>
  );
}
