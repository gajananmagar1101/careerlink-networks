import { useQuery } from '@tanstack/react-query';
import { jobApi } from '../api/jobApi';
import type { JobMatch } from '../types/domain';

export function useJobMatch(jobId?: string, enabled = true) {
  return useQuery<JobMatch>({
    queryKey: ['job-match', jobId],
    queryFn: () => jobApi.getMatch(jobId!),
    enabled: Boolean(jobId) && enabled,
    staleTime: 60 * 1000
  });
}
