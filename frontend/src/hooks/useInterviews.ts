import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { interviewApi } from '../api/interviewApi';
import { jobApi } from '../api/jobApi';
import type { Interview, InterviewRequestPayload } from '../types/domain';

async function populateJobs(interviews: Interview[]): Promise<Interview[]> {
  const uniqueJobIds = [...new Set(interviews.map(i => i.jobId).filter(Boolean))];
  const jobMap = new Map();
  await Promise.all(
    uniqueJobIds.map(async id => {
      try {
        const j = await jobApi.get(id);
        jobMap.set(id, j);
      } catch {
        // ignore
      }
    })
  );
  return interviews.map(i => ({ ...i, job: jobMap.get(i.jobId) }));
}

export function useCandidateInterviews(enabled = true) {
  return useQuery<Interview[]>({
    queryKey: ['candidate-interviews'],
    queryFn: async () => {
      const data = await interviewApi.candidateInterviews();
      return populateJobs(data);
    },
    enabled
  });
}

export function useRecruiterInterviews(enabled = true) {
  return useQuery<Interview[]>({
    queryKey: ['recruiter-interviews'],
    queryFn: async () => {
      const data = await interviewApi.recruiterInterviews();
      return populateJobs(data);
    },
    enabled
  });
}

export function useApplicationInterviews(applicationId?: string) {
  return useQuery<Interview[]>({
    queryKey: ['application-interviews', applicationId],
    queryFn: () => interviewApi.byApplication(applicationId!),
    enabled: Boolean(applicationId)
  });
}

export function useScheduleInterview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: InterviewRequestPayload) => interviewApi.schedule(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recruiter-interviews'] });
      queryClient.invalidateQueries({ queryKey: ['application-interviews'] });
      queryClient.invalidateQueries({ queryKey: ['job-applications'] });
      queryClient.invalidateQueries({ queryKey: ['recruiter-pipeline'] });
    }
  });
}

export function useRescheduleInterview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, scheduledAt, meetingLink }: { id: string; scheduledAt: string; meetingLink?: string }) =>
      interviewApi.reschedule(id, scheduledAt, meetingLink),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recruiter-interviews'] });
      queryClient.invalidateQueries({ queryKey: ['candidate-interviews'] });
      queryClient.invalidateQueries({ queryKey: ['application-interviews'] });
    }
  });
}

export function useCancelInterview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      interviewApi.cancel(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recruiter-interviews'] });
      queryClient.invalidateQueries({ queryKey: ['candidate-interviews'] });
      queryClient.invalidateQueries({ queryKey: ['application-interviews'] });
    }
  });
}

export function useCompleteInterview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, feedback }: { id: string; feedback?: string }) =>
      interviewApi.complete(id, feedback),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recruiter-interviews'] });
      queryClient.invalidateQueries({ queryKey: ['application-interviews'] });
      queryClient.invalidateQueries({ queryKey: ['job-applications'] });
      queryClient.invalidateQueries({ queryKey: ['recruiter-pipeline'] });
    }
  });
}
