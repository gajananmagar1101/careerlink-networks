import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { profileApi } from '../api/profileApi';
import type { ApiError, CandidateProfile, RecruiterProfile } from '../types/domain';

function isMissing(error: unknown) {
  return (error as ApiError).status === 404;
}

export function useCandidateProfile(userId?: string) {
  return useQuery({
    queryKey: ['candidate-profile', userId],
    queryFn: async () => {
      try {
        return await profileApi.getCandidate(userId!);
      } catch (error) {
        if (isMissing(error)) return null;
        throw error;
      }
    },
    enabled: Boolean(userId)
  });
}

export function useSaveCandidateProfile(userId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CandidateProfile) =>
      profileApi.updateCandidate(userId, payload).catch((error: ApiError) => {
        if (error.status === 404) return profileApi.saveCandidate(payload);
        throw error;
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['candidate-profile', userId] })
  });
}

export function useRecruiterProfile(userId?: string) {
  return useQuery({
    queryKey: ['recruiter-profile', userId],
    queryFn: async () => {
      try {
        return await profileApi.getRecruiter(userId!);
      } catch (error) {
        if (isMissing(error)) return null;
        throw error;
      }
    },
    enabled: Boolean(userId)
  });
}

export function useSaveRecruiterProfile(userId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: RecruiterProfile) =>
      profileApi.updateRecruiter(userId, payload).catch((error: ApiError) => {
        if (error.status === 404) return profileApi.saveRecruiter(payload);
        throw error;
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['recruiter-profile', userId] })
  });
}
