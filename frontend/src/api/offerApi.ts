import { apiClient, unwrap } from './apiClient';
import type { Offer, OfferRequestPayload } from '../types/domain';

export const offerApi = {
  create: (payload: OfferRequestPayload) =>
    unwrap<Offer>(apiClient.post('/api/offers', payload)),
  candidateOffers: () =>
    unwrap<Offer[]>(apiClient.get('/api/offers/candidate')),
  recruiterOffers: () =>
    unwrap<Offer[]>(apiClient.get('/api/offers/recruiter')),
  accept: (id: string) =>
    unwrap<Offer>(apiClient.put(`/api/offers/${id}/accept`)),
  decline: (id: string) =>
    unwrap<Offer>(apiClient.put(`/api/offers/${id}/decline`))
};
