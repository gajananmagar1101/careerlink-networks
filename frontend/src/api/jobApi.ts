import { apiClient, unwrap } from './apiClient';
import type { Job, JobRequest, JobSearchParams, Page } from '../types/domain';

export const jobApi = {
  list: (params?: JobSearchParams) => unwrap<Page<Job>>(apiClient.get('/api/jobs/search', { params })),
  openJobs: (params?: JobSearchParams) => unwrap<Page<Job>>(apiClient.get('/api/jobs', { params })),
  get: (jobId: string) => unwrap<Job>(apiClient.get(`/api/jobs/${jobId}`)),
  byRecruiter: (recruiterId: string, params?: { page?: number; size?: number }) =>
    unwrap<Page<Job>>(apiClient.get(`/api/jobs/recruiter/${recruiterId}`, { params })),
  create: (payload: JobRequest) => unwrap<Job>(apiClient.post('/api/jobs', payload)),
  update: (jobId: string, payload: JobRequest) => unwrap<Job>(apiClient.put(`/api/jobs/${jobId}`, payload)),
  remove: (jobId: string) => unwrap<void>(apiClient.delete(`/api/jobs/${jobId}`))
};
