import { useQuery } from '@tanstack/react-query';
import { applicationApi } from '../api/applicationApi';
import { jobApi } from '../api/jobApi';
import { profilesById } from './useApplications';
import type { Application, Job } from '../types/domain';

export interface PipelineRow {
  job: Job;
  applications: Application[];
}

export function useRecruiterPipeline(recruiterId?: string) {
  return useQuery({
    queryKey: ['recruiter-pipeline', recruiterId],
    queryFn: async () => {
      const jobsPage = await jobApi.byRecruiter(recruiterId!, { page: 0, size: 50 });
      const rows: PipelineRow[] = await Promise.all(
        jobsPage.content.map(async (job) => {
          try {
            const applications = await applicationApi.byJob(job.id);
            return { job, applications: applications.map((item) => ({ ...item, job })) };
          } catch {
            return { job, applications: [] };
          }
        })
      );
      const allCandidateIds = [...new Set(rows.flatMap((r) => r.applications.map((a) => a.candidateId)).filter(Boolean))];
      const profiles = await profilesById(allCandidateIds);
      return rows.map((row) => ({
        ...row,
        applications: row.applications.map((app) => ({
          ...app,
          candidateProfile: profiles[app.candidateId] ?? app.candidateProfile
        }))
      }));
    },
    enabled: Boolean(recruiterId)
  });
}
