import type { ApplicationStatus } from '../types/domain';

/** Happy-path stage order used to render application timelines. */
export const statusOrder: readonly ApplicationStatus[] = ['APPLIED', 'UNDER_REVIEW', 'SHORTLISTED', 'INTERVIEW', 'HIRED'];

export const applicationStatuses: readonly ApplicationStatus[] = [
  'APPLIED',
  'UNDER_REVIEW',
  'SHORTLISTED',
  'INTERVIEW',
  'REJECTED',
  'HIRED',
  'WITHDRAWN'
];