import { normalizeApplication } from '../utils/applications';
import type { Application, ApplicationRequest, ApplicationStatus } from '../types/domain';
import { apiClient, unwrap } from './apiClient';

async function unwrapApplication(request: Promise<{ data: { data: Application } }>) {
  return normalizeApplication(await unwrap<Application>(request));
}

async function unwrapApplications(request: Promise<{ data: { data: Application[] } }>) {
  const applications = await unwrap<Application[]>(request);
  return applications.map(normalizeApplication);
}

export const applicationApi = {
  apply: (payload: ApplicationRequest) => unwrapApplication(apiClient.post('/api/applications', payload)),
  get: (applicationId: string) => unwrapApplication(apiClient.get(`/api/applications/${applicationId}`)),
  byCandidate: (candidateId: string) => unwrapApplications(apiClient.get(`/api/applications/candidate/${candidateId}`)),
  byJob: (jobId: string) => unwrapApplications(apiClient.get(`/api/applications/job/${jobId}`)),
  updateStatus: (applicationId: string, status: ApplicationStatus) =>
    unwrapApplication(apiClient.put(`/api/applications/${applicationId}/status`, { status })),
  withdraw: (applicationId: string) => unwrap<void>(apiClient.delete(`/api/applications/${applicationId}`))
};
