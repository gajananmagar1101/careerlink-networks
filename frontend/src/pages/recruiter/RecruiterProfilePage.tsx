import { zodResolver } from '@hookform/resolvers/zod';
import { Building2, Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { ErrorState } from '../../components/ui/Feedback';
import { Input, Textarea } from '../../components/ui/Fields';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useRecruiterProfile, useSaveRecruiterProfile } from '../../hooks/useProfiles';
import type { ApiError } from '../../types/domain';

const schema = z.object({
  companyName: z.string().min(2, 'Company name is required.'),
  companyDescription: z.string().max(3000).optional(),
  website: z.string().url('Please enter a valid URL.').optional().or(z.literal('')),
  industry: z.string().optional(),
  location: z.string().optional()
});
type FormValues = z.infer<typeof schema>;

export function RecruiterProfilePage() {
  const { user } = useAuth();
  const { notify } = useToast();
  const profileQuery = useRecruiterProfile(user?.id);
  const saveProfile = useSaveRecruiterProfile(user?.id ?? '');
  const { register, handleSubmit, formState, watch } = useForm<FormValues>({
    resolver: zodResolver(schema),
    values: {
      companyName: profileQuery.data?.companyName ?? '',
      companyDescription: profileQuery.data?.companyDescription ?? '',
      website: profileQuery.data?.website ?? '',
      industry: profileQuery.data?.industry ?? '',
      location: profileQuery.data?.location ?? ''
    }
  });
  const description = watch('companyDescription') ?? '';

  async function onSubmit(values: FormValues) {
    try {
      await saveProfile.mutateAsync({ ...values, website: values.website || undefined });
      notify('Profile updated successfully.', 'success');
    } catch (err) {
      notify((err as ApiError).message, 'error');
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <p className="text-sm font-bold text-brand-700">Company profile</p>
          <h1 className="mt-1 text-3xl font-extrabold">Recruiter profile</h1>
        </div>
        {profileQuery.isError ? <ErrorState message="You can still prepare this form and save it once MongoDB is available." /> : null}
        <Card>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Company Name" error={formState.errors.companyName?.message} {...register('companyName')} />
            <Input label="Industry" {...register('industry')} />
            <Input label="Website" error={formState.errors.website?.message} {...register('website')} />
            <Input label="Location" {...register('location')} />
          </div>
          <div className="mt-4">
            <Textarea label="Company Description" maxLength={3000} value={description} error={formState.errors.companyDescription?.message} {...register('companyDescription')} />
          </div>
        </Card>
        <Button disabled={saveProfile.isPending}><Save className="h-4 w-4" /> Save Company Profile</Button>
      </form>
      <aside className="lg:sticky lg:top-24 lg:h-fit">
        <Card>
          <Building2 className="h-8 w-8 text-brand-700" />
          <h2 className="mt-4 text-xl font-extrabold">{watch('companyName') || 'Your company'}</h2>
          <p className="mt-2 text-sm leading-6 text-muted">{watch('companyDescription') || 'A strong company profile helps candidates understand the team behind the role.'}</p>
        </Card>
      </aside>
    </div>
  );
}
