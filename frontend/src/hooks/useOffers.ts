import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { offerApi } from '../api/offerApi';
import { jobApi } from '../api/jobApi';
import type { Offer, OfferRequestPayload } from '../types/domain';

async function populateJobs(offers: Offer[]): Promise<Offer[]> {
  const uniqueJobIds = [...new Set(offers.map(o => o.jobId).filter(Boolean))];
  const jobMap = new Map();
  await Promise.all(
    uniqueJobIds.map(async id => {
      try {
        const j = await jobApi.get(id);
        jobMap.set(id, j);
      } catch {
        // ignore
      }
    })
  );
  return offers.map(o => ({ ...o, job: jobMap.get(o.jobId) }));
}

export function useCandidateOffers(enabled = true) {
  return useQuery<Offer[]>({
    queryKey: ['candidate-offers'],
    queryFn: async () => {
      const data = await offerApi.candidateOffers();
      return populateJobs(data);
    },
    enabled
  });
}

export function useRecruiterOffers(enabled = true) {
  return useQuery<Offer[]>({
    queryKey: ['recruiter-offers'],
    queryFn: async () => {
      const data = await offerApi.recruiterOffers();
      return populateJobs(data);
    },
    enabled
  });
}

export function useCreateOffer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: OfferRequestPayload) => offerApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recruiter-offers'] });
      queryClient.invalidateQueries({ queryKey: ['job-applications'] });
      queryClient.invalidateQueries({ queryKey: ['recruiter-pipeline'] });
    }
  });
}

export function useAcceptOffer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (offerId: string) => offerApi.accept(offerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidate-offers'] });
      queryClient.invalidateQueries({ queryKey: ['candidate-applications'] });
    }
  });
}

export function useDeclineOffer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (offerId: string) => offerApi.decline(offerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidate-offers'] });
      queryClient.invalidateQueries({ queryKey: ['candidate-applications'] });
    }
  });
}
