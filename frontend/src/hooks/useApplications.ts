import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { applicationApi } from '../api/applicationApi';
import { jobApi } from '../api/jobApi';
import { profileApi } from '../api/profileApi';
import { authApi } from '../api/authApi';
import type { ApiError, Application, ApplicationRequest, ApplicationStatus, CandidateProfile, Job } from '../types/domain';

async function jobsById(ids: string[]) {
  const unique = [...new Set(ids.filter(Boolean))];
  const entries = await Promise.all(
    unique.map(async (id) => {
      try {
        return [id, await jobApi.get(id)] as const;
      } catch {
        return [id, undefined] as const;
      }
    })
  );
  return Object.fromEntries(entries) as Record<string, Job | undefined>;
}

export async function profilesById(ids: string[]) {
  const unique = [...new Set(ids.filter(Boolean))];
  const entries = await Promise.all(
    unique.map(async (id) => {
      try {
        const profile = await profileApi.getCandidate(id);
        return [id, profile] as const;
      } catch {
        try {
          const user = await authApi.getUser(id);
          if (user) {
            return [
              id,
              {
                userId: user.id,
                fullName: user.name,
                email: user.email,
                headline: 'Job Seeker'
              } as CandidateProfile
            ] as const;
          }
        } catch {
          // ignore
        }
        return [id, undefined] as const;
      }
    })
  );
  return Object.fromEntries(entries) as Record<string, CandidateProfile | undefined>;
}

export function useCandidateApplications(candidateId?: string) {
  return useQuery({
    queryKey: ['candidate-applications', candidateId],
    queryFn: async () => {
      const applications = await applicationApi.byCandidate(candidateId!);
      const jobs = await jobsById(applications.map((item) => item.jobId));
      return applications.map((item) => ({ ...item, job: jobs[item.jobId] ?? item.job }));
    },
    enabled: Boolean(candidateId)
  });
}

export function useApplication(applicationId?: string) {
  return useQuery({
    queryKey: ['application', applicationId],
    queryFn: async () => {
      const application = await applicationApi.get(applicationId!);
      const [job, candidateProfile] = await Promise.all([
        jobApi.get(application.jobId).catch(() => undefined),
        profileApi.getCandidate(application.candidateId).catch(() => undefined)
      ]);
      return { ...application, job, candidateProfile } satisfies Application;
    },
    enabled: Boolean(applicationId)
  });
}

export function useJobApplications(jobId?: string) {
  return useQuery({
    queryKey: ['job-applications', jobId],
    queryFn: async () => {
      const applications = await applicationApi.byJob(jobId!);
      const profiles = await profilesById(applications.map((item) => item.candidateId));
      const job = await jobApi.get(jobId!).catch(() => undefined);
      return applications.map((item) => ({
        ...item,
        job,
        candidateProfile: profiles[item.candidateId] ?? item.candidateProfile
      }));
    },
    enabled: Boolean(jobId)
  });
}

export function useApplyJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ApplicationRequest) => applicationApi.apply(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['candidate-applications'] })
  });
}

export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ applicationId, status }: { applicationId: string; status: ApplicationStatus }) =>
      applicationApi.updateStatus(applicationId, status),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['job-applications'] });
      queryClient.invalidateQueries({ queryKey: ['application', variables.applicationId] });
      queryClient.invalidateQueries({ queryKey: ['recruiter-pipeline'] });
    }
  });
}

export function useWithdrawApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (applicationId: string) => applicationApi.withdraw(applicationId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['candidate-applications'] })
  });
}
