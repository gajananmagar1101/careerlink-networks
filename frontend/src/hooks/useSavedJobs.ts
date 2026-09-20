import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { jobApi } from '../api/jobApi';
import type { Job, Page } from '../types/domain';

export function useSavedJobs(params?: { page?: number; size?: number }) {
  return useQuery<Page<Job>>({
    queryKey: ['saved-jobs', params],
    queryFn: () => jobApi.getSavedJobs(params)
  });
}

export function useSavedJobIds() {
  return useQuery<string[]>({
    queryKey: ['saved-job-ids'],
    queryFn: () => jobApi.getSavedJobIds()
  });
}

export function useToggleSaveJob() {
  const queryClient = useQueryClient();

  const saveMutation = useMutation({
    mutationFn: (jobId: string) => jobApi.save(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-job-ids'] });
      queryClient.invalidateQueries({ queryKey: ['saved-jobs'] });
    }
  });

  const unsaveMutation = useMutation({
    mutationFn: (jobId: string) => jobApi.unsave(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-job-ids'] });
      queryClient.invalidateQueries({ queryKey: ['saved-jobs'] });
    }
  });

  return {
    saveJob: saveMutation.mutateAsync,
    unsaveJob: unsaveMutation.mutateAsync,
    isPending: saveMutation.isPending || unsaveMutation.isPending
  };
}
