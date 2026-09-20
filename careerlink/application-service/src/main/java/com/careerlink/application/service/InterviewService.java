package com.careerlink.application.service;

import com.careerlink.application.client.JobClient;
import com.careerlink.application.client.JobDto;
import com.careerlink.application.dto.InterviewRequest;
import com.careerlink.application.exception.ResourceNotFoundException;
import com.careerlink.application.exception.UnauthorizedException;
import com.careerlink.application.model.ApplicationDocument;
import com.careerlink.application.model.ApplicationStatus;
import com.careerlink.application.model.InterviewDocument;
import com.careerlink.application.model.InterviewStatus;
import com.careerlink.application.model.NotificationType;
import com.careerlink.application.repository.ApplicationRepository;
import com.careerlink.application.repository.InterviewRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class InterviewService {
    private final InterviewRepository interviewRepository;
    private final ApplicationRepository applicationRepository;
    private final JobClient jobClient;
    private final NotificationService notificationService;

    public InterviewDocument scheduleInterview(String recruiterId, String role, InterviewRequest request) {
        if (!"RECRUITER".equals(role) && !"ADMIN".equals(role)) {
            throw new UnauthorizedException("Only recruiters can schedule interviews");
        }

        ApplicationDocument application = applicationRepository.findById(request.applicationId())
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));

        JobDto job = jobClient.getJob(application.getJobId()).data();
        if (job == null) {
            throw new ResourceNotFoundException("Associated job not found");
        }
        if (!recruiterId.equals(job.recruiterId()) && !"ADMIN".equals(role)) {
            throw new UnauthorizedException("Only the job recruiter can schedule interviews for this job");
        }

        InterviewDocument interview = InterviewDocument.builder()
                .applicationId(application.getId())
                .jobId(application.getJobId())
                .candidateId(application.getCandidateId())
                .recruiterId(recruiterId)
                .interviewType(request.interviewType())
                .scheduledAt(request.scheduledAt())
                .durationMinutes(request.durationMinutes() > 0 ? request.durationMinutes() : 45)
                .mode(request.mode() != null ? request.mode() : "REMOTE")
                .meetingLink(request.meetingLink())
                .location(request.location())
                .status(InterviewStatus.SCHEDULED)
                .notes(request.notes())
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        InterviewDocument saved = interviewRepository.save(interview);

        // Update application status to INTERVIEW_SCHEDULED if eligible
        if (application.getStatus().canTransitionTo(ApplicationStatus.INTERVIEW_SCHEDULED)) {
            application.setStatus(ApplicationStatus.INTERVIEW_SCHEDULED);
            applicationRepository.save(application);
        }

        // Notify candidate
        notificationService.createNotification(
                application.getCandidateId(),
                NotificationType.INTERVIEW_SCHEDULED,
                "Interview Scheduled: " + request.interviewType(),
                "Your " + request.interviewType() + " interview for " + job.title() + " has been scheduled.",
                saved.getId()
        );

        log.info("Recruiter {} scheduled interview {} for candidate {}", recruiterId, saved.getId(), application.getCandidateId());
        return saved;
    }

    public List<InterviewDocument> getCandidateInterviews(String candidateId) {
        return interviewRepository.findByCandidateIdOrderByScheduledAtDesc(candidateId);
    }

    public List<InterviewDocument> getRecruiterInterviews(String recruiterId) {
        return interviewRepository.findByRecruiterIdOrderByScheduledAtDesc(recruiterId);
    }

    public List<InterviewDocument> getApplicationInterviews(String applicationId) {
        return interviewRepository.findByApplicationIdOrderByScheduledAtDesc(applicationId);
    }

    public InterviewDocument rescheduleInterview(String userId, String role, String interviewId, Instant newTime, String newLink) {
        InterviewDocument interview = interviewRepository.findById(interviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Interview not found"));

        if (!userId.equals(interview.getRecruiterId()) && !"ADMIN".equals(role)) {
            throw new UnauthorizedException("Only recruiter can reschedule interview");
        }

        interview.setScheduledAt(newTime);
        if (newLink != null && !newLink.isBlank()) {
            interview.setMeetingLink(newLink);
        }
        interview.setStatus(InterviewStatus.RESCHEDULED);
        interview.setUpdatedAt(Instant.now());
        InterviewDocument saved = interviewRepository.save(interview);

        notificationService.createNotification(
                interview.getCandidateId(),
                NotificationType.INTERVIEW_RESCHEDULED,
                "Interview Rescheduled",
                "Your " + interview.getInterviewType() + " interview has been rescheduled.",
                saved.getId()
        );

        return saved;
    }

    public InterviewDocument cancelInterview(String userId, String role, String interviewId, String reason) {
        InterviewDocument interview = interviewRepository.findById(interviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Interview not found"));

        if (!userId.equals(interview.getRecruiterId()) && !"ADMIN".equals(role)) {
            throw new UnauthorizedException("Only recruiter can cancel interview");
        }

        interview.setStatus(InterviewStatus.CANCELLED);
        interview.setNotes((interview.getNotes() != null ? interview.getNotes() + " | " : "") + "Cancelled: " + reason);
        interview.setUpdatedAt(Instant.now());
        InterviewDocument saved = interviewRepository.save(interview);

        notificationService.createNotification(
                interview.getCandidateId(),
                NotificationType.INTERVIEW_CANCELLED,
                "Interview Cancelled",
                "Your " + interview.getInterviewType() + " interview has been cancelled.",
                saved.getId()
        );

        return saved;
    }

    public InterviewDocument completeInterview(String userId, String role, String interviewId, String feedback) {
        InterviewDocument interview = interviewRepository.findById(interviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Interview not found"));

        if (!userId.equals(interview.getRecruiterId()) && !"ADMIN".equals(role)) {
            throw new UnauthorizedException("Only recruiter can mark interview completed");
        }

        interview.setStatus(InterviewStatus.COMPLETED);
        if (feedback != null) {
            interview.setFeedback(feedback);
        }
        interview.setUpdatedAt(Instant.now());
        InterviewDocument saved = interviewRepository.save(interview);

        ApplicationDocument application = applicationRepository.findById(interview.getApplicationId()).orElse(null);
        if (application != null && application.getStatus().canTransitionTo(ApplicationStatus.INTERVIEW_COMPLETED)) {
            application.setStatus(ApplicationStatus.INTERVIEW_COMPLETED);
            applicationRepository.save(application);
        }

        return saved;
    }
}
