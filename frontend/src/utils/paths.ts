import type { Role } from '../types/domain';

export function jobDetailPath(jobId: string, role?: Role | null) {
  if (role === 'CANDIDATE') return `/candidate/jobs/${jobId}`;
  if (role === 'RECRUITER') return `/recruiter/jobs/${jobId}`;
  return `/jobs/${jobId}`;
}

export function jobsListPath(role?: Role | null) {
  if (role === 'CANDIDATE') return '/candidate/jobs';
  if (role === 'RECRUITER') return '/recruiter/jobs';
  return '/jobs';
}
