import { apiClient, unwrap } from './apiClient';
import type { Interview, InterviewRequestPayload } from '../types/domain';

export const interviewApi = {
  schedule: (payload: InterviewRequestPayload) =>
    unwrap<Interview>(apiClient.post('/api/interviews', payload)),
  candidateInterviews: () =>
    unwrap<Interview[]>(apiClient.get('/api/interviews/candidate')),
  recruiterInterviews: () =>
    unwrap<Interview[]>(apiClient.get('/api/interviews/recruiter')),
  byApplication: (applicationId: string) =>
    unwrap<Interview[]>(apiClient.get(`/api/interviews/application/${applicationId}`)),
  reschedule: (id: string, scheduledAt: string, meetingLink?: string) =>
    unwrap<Interview>(apiClient.put(`/api/interviews/${id}/reschedule`, { scheduledAt, meetingLink })),
  cancel: (id: string, reason?: string) =>
    unwrap<Interview>(apiClient.put(`/api/interviews/${id}/cancel`, { reason })),
  complete: (id: string, feedback?: string) =>
    unwrap<Interview>(apiClient.put(`/api/interviews/${id}/complete`, { feedback }))
};
