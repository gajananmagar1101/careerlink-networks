import { apiClient, unwrap } from './apiClient';
import type { CandidateProfile, RecruiterProfile } from '../types/domain';

export const profileApi = {
  getCandidate: (userId: string) => unwrap<CandidateProfile>(apiClient.get(`/api/profiles/candidate/${userId}`)),
  saveCandidate: (payload: CandidateProfile) => unwrap<CandidateProfile>(apiClient.post('/api/profiles/candidate', payload)),
  updateCandidate: (userId: string, payload: CandidateProfile) =>
    unwrap<CandidateProfile>(apiClient.put(`/api/profiles/candidate/${userId}`, payload)),
  getRecruiter: (userId: string) => unwrap<RecruiterProfile>(apiClient.get(`/api/profiles/recruiter/${userId}`)),
  saveRecruiter: (payload: RecruiterProfile) => unwrap<RecruiterProfile>(apiClient.post('/api/profiles/recruiter', payload)),
  updateRecruiter: (userId: string, payload: RecruiterProfile) =>
    unwrap<RecruiterProfile>(apiClient.put(`/api/profiles/recruiter/${userId}`, payload))
};
