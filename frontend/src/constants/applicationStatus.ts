import type { ApplicationStatus } from '../types/domain';

export const statusOrder: readonly ApplicationStatus[] = [
  'APPLIED',
  'UNDER_REVIEW',
  'SHORTLISTED',
  'INTERVIEW_SCHEDULED',
  'OFFERED',
  'HIRED'
];

export const applicationStatuses: readonly ApplicationStatus[] = [
  'APPLIED',
  'UNDER_REVIEW',
  'SHORTLISTED',
  'INTERVIEW_SCHEDULED',
  'INTERVIEW_COMPLETED',
  'OFFERED',
  'HIRED',
  'REJECTED',
  'WITHDRAWN'
];