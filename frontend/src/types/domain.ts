export type Role = 'CANDIDATE' | 'RECRUITER';
export type EmploymentType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP' | 'REMOTE';
export type JobStatus = 'OPEN' | 'CLOSED' | 'DRAFT';
export type ApplicationStatus =
  | 'APPLIED'
  | 'UNDER_REVIEW'
  | 'SHORTLISTED'
  | 'INTERVIEW'
  | 'REJECTED'
  | 'HIRED'
  | 'WITHDRAWN';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ApiError {
  status: number;
  message: string;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface AuthResponse {
  token: string;
  userId: string;
  email: string;
  role: Role;
  expiresInMs: number;
}

export interface GoogleAuthResponse {
  token?: string;
  userId?: string;
  email: string;
  name: string;
  role?: Role;
  expiresInMs: number;
  roleRequired: boolean;
}

export interface GoogleAuthPayload {
  idToken: string;
  role?: Role;
}

export interface CandidateProfile {
  id?: string;
  userId?: string;
  fullName: string;
  email: string;
  phone?: string;
  location?: string;
  headline?: string;
  summary?: string;
  skills?: string[];
  education?: string[];
  experience?: string[];
  resumeUrl?: string;
}

export interface RecruiterProfile {
  id?: string;
  userId?: string;
  companyName: string;
  companyDescription?: string;
  website?: string;
  industry?: string;
  location?: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  employmentType: EmploymentType;
  experienceRequired: number;
  salaryMin?: number;
  salaryMax?: number;
  skills: string[];
  category: string;
  status: JobStatus;
  applicationDeadline?: string;
  companyName: string;
  recruiterId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface JobRequest {
  title: string;
  description: string;
  location: string;
  employmentType: EmploymentType;
  experienceRequired: number;
  salaryMin?: number;
  salaryMax?: number;
  skills: string[];
  category: string;
  status?: JobStatus;
  applicationDeadline: string;
  companyName: string;
}

export interface JobSearchParams {
  keyword?: string;
  location?: string;
  category?: string;
  employmentType?: EmploymentType | '';
  page?: number;
  size?: number;
}

export interface Application {
  id: string;
  jobId: string;
  candidateId: string;
  recruiterId?: string;
  resumeUrl?: string;
  coverLetter?: string;
  status: ApplicationStatus;
  /** Backend field; prefer this, with createdAt as a compatibility alias. */
  appliedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  job?: Job;
  candidateProfile?: CandidateProfile;
}

export interface ApplicationRequest {
  jobId: string;
  resumeUrl?: string;
  coverLetter?: string;
}
