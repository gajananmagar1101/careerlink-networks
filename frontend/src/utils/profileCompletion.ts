import type { CandidateProfile } from '../types/domain';

const CANDIDATE_FIELDS: Array<keyof CandidateProfile> = [
  'fullName',
  'email',
  'phone',
  'location',
  'headline',
  'summary',
  'skills',
  'education',
  'experience',
  'resumeUrl'
];

export function candidateCompletion(profile?: Partial<CandidateProfile> | null) {
  const filled = CANDIDATE_FIELDS.filter((field) => {
    const value = profile?.[field];
    if (Array.isArray(value)) return value.length > 0;
    return Boolean(typeof value === 'string' ? value.trim() : value);
  }).length;
  return Math.round((filled / CANDIDATE_FIELDS.length) * 100);
}

export function missingCandidateFields(profile?: Partial<CandidateProfile> | null) {
  const labels: Record<string, string> = {
    headline: 'Add a professional headline',
    summary: 'Write a short summary',
    skills: 'Add your skills',
    education: 'Add education',
    experience: 'Add experience',
    resumeUrl: 'Add a resume URL',
    phone: 'Add a phone number',
    location: 'Add your location'
  };
  return (Object.keys(labels) as Array<keyof typeof labels>).filter((key) => {
    const value = profile?.[key as keyof CandidateProfile];
    if (Array.isArray(value)) return value.length === 0;
    return !value;
  }).map((key) => labels[key]);
}
