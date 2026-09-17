import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { jobApi } from '../api/jobApi';
import type { JobRequest, JobSearchParams } from '../types/domain';

export function useJobs(params?: JobSearchParams) {
  return useQuery({ queryKey: ['jobs', params], queryFn: () => jobApi.list(params) });
}

export function useJob(jobId?: string) {
  return useQuery({ queryKey: ['job', jobId], queryFn: () => jobApi.get(jobId!), enabled: Boolean(jobId) });
}

export function useRecruiterJobs(recruiterId?: string, params?: { page?: number; size?: number }) {
  return useQuery({
    queryKey: ['recruiter-jobs', recruiterId, params],
    queryFn: () => jobApi.byRecruiter(recruiterId!, params ?? { page: 0, size: 50 }),
    enabled: Boolean(recruiterId)
  });
}

export function useCreateJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: JobRequest) => jobApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recruiter-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    }
  });
}

export function useUpdateJob(jobId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: JobRequest) => jobApi.update(jobId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job', jobId] });
      queryClient.invalidateQueries({ queryKey: ['recruiter-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    }
  });
}

export function useDeleteJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (jobId: string) => jobApi.remove(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recruiter-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    }
  });
}
