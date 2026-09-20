package com.careerlink.application.service;

import com.careerlink.application.client.*;
import com.careerlink.application.dto.*;
import com.careerlink.application.exception.*;
import com.careerlink.application.model.*;
import com.careerlink.application.repository.ApplicationRepository;
import feign.FeignException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Slf4j
@Service
public class ApplicationService {
    private final ApplicationRepository applications;
    private final JobClient jobClient;
    private final ProfileClient profileClient;
    private final NotificationService notificationService;

    public ApplicationService(ApplicationRepository applications, JobClient jobClient,
                               ProfileClient profileClient, NotificationService notificationService) {
        this.applications = applications;
        this.jobClient = jobClient;
        this.profileClient = profileClient;
        this.notificationService = notificationService;
    }

    public ApplicationDocument apply(String candidateId, String role, ApplicationRequest request) {
        requireRole(role, "CANDIDATE");
        JobDto job = fetchJob(request.jobId());
        if (!"OPEN".equals(job.status()) || (job.applicationDeadline() != null && job.applicationDeadline().isBefore(LocalDate.now()))) {
            throw new JobClosedException("Candidate cannot apply to a closed or expired job");
        }
        if (applications.existsByJobIdAndCandidateId(request.jobId(), candidateId)) {
            throw new DuplicateApplicationException("Candidate has already applied to this job");
        }
        String resumeUrl = request.resumeUrl();
        if (resumeUrl == null || resumeUrl.isBlank()) {
            try {
                RemoteApiResponse<CandidateProfileDto> profile = profileClient.getCandidate(candidateId, "CANDIDATE", candidateId);
                if (profile != null && profile.data() != null) resumeUrl = profile.data().resumeUrl();
            } catch (FeignException.NotFound ignored) {
                log.info("Candidate {} has no profile resume metadata", candidateId);
            } catch (FeignException ex) {
                throw new ServiceUnavailableException("Profile service unavailable");
            }
        }
        ApplicationDocument document = ApplicationDocument.builder()
                .jobId(request.jobId())
                .candidateId(candidateId)
                .resumeUrl(resumeUrl)
                .coverLetter(request.coverLetter())
                .status(ApplicationStatus.APPLIED)
                .build();
        ApplicationDocument saved = applications.save(document);
        // Notify candidate of successful application
        notificationService.createNotification(
                candidateId,
                NotificationType.APPLICATION_SUBMITTED,
                "Application submitted",
                "Your application for \"" + job.title() + "\" at " + job.companyName() + " has been submitted.",
                saved.getId()
        );
        log.info("Candidate {} applied to job {}", candidateId, request.jobId());
        return saved;
    }

    public ApplicationDocument get(String userId, String role, String id) {
        ApplicationDocument app = applications.findById(id).orElseThrow(() -> new ResourceNotFoundException("Application not found"));
        authorizeApplicationRead(userId, role, app);
        return app;
    }

    public List<ApplicationDocument> byCandidate(String userId, String role, String candidateId) {
        requireRole(role, "CANDIDATE");
        if (!userId.equals(candidateId)) throw new UnauthorizedException("Candidates can view only their own applications");
        return applications.findByCandidateIdOrderByAppliedAtDesc(candidateId);
    }

    public List<ApplicationDocument> byJob(String userId, String role, String jobId) {
        requireRole(role, "RECRUITER");
        JobDto job = fetchJob(jobId);
        if (!userId.equals(job.recruiterId()) && !"ADMIN".equals(role)) throw new UnauthorizedException("Recruiter can view only their own job applications");
        return applications.findByJobId(jobId);
    }

    public ApplicationDocument updateStatus(String userId, String role, String id, ApplicationStatus status) {
        requireRole(role, "RECRUITER");
        if (ApplicationStatus.isCandidateOnlyStatus(status)) {
            throw new IllegalArgumentException("Recruiters cannot set status: " + status);
        }
        ApplicationDocument app = applications.findById(id).orElseThrow(() -> new ResourceNotFoundException("Application not found"));
        JobDto job = fetchJob(app.getJobId());
        if (!userId.equals(job.recruiterId()) && !"ADMIN".equals(role)) throw new UnauthorizedException("Only owning recruiter can update status");

        ApplicationStatus current = app.getStatus();
        if (!current.canTransitionTo(status)) {
            throw new InvalidStatusTransitionException("Cannot transition from " + current + " to " + status);
        }

        app.setStatus(status);
        ApplicationDocument saved = applications.save(app);

        // Notify candidate of status change
        notificationService.createNotification(
                app.getCandidateId(),
                NotificationType.APPLICATION_STATUS_CHANGED,
                "Application status updated",
                "Your application for \"" + job.title() + "\" has been moved to: " + status.name().replace("_", " "),
                saved.getId()
        );
        log.info("Recruiter {} updated application {} from {} to {}", userId, id, current, status);
        return saved;
    }

    public void delete(String userId, String role, String id) {
        requireRole(role, "CANDIDATE");
        ApplicationDocument app = applications.findByIdAndCandidateId(id, userId).orElseThrow(() -> new ResourceNotFoundException("Application not found"));
        if (!app.getStatus().canTransitionTo(ApplicationStatus.WITHDRAWN) &&
            app.getStatus() != ApplicationStatus.APPLIED) {
            throw new IllegalStateException("Application cannot be withdrawn at this stage");
        }
        app.setStatus(ApplicationStatus.WITHDRAWN);
        applications.save(app);
        log.info("Candidate {} withdrew application {}", userId, id);
    }

    public boolean hasApplied(String candidateId, String jobId) {
        return applications.existsByJobIdAndCandidateId(jobId, candidateId);
    }

    private void authorizeApplicationRead(String userId, String role, ApplicationDocument app) {
        if ("CANDIDATE".equals(role)) {
            if (!userId.equals(app.getCandidateId())) throw new UnauthorizedException("Cannot view another candidate's application");
            return;
        }
        if ("RECRUITER".equals(role) || "ADMIN".equals(role)) {
            JobDto job = fetchJob(app.getJobId());
            if (!"ADMIN".equals(role) && !userId.equals(job.recruiterId())) throw new UnauthorizedException("Cannot view applications for another recruiter's job");
            return;
        }
        throw new UnauthorizedException("Unsupported role");
    }

    private JobDto fetchJob(String jobId) {
        try {
            RemoteApiResponse<JobDto> response = jobClient.getJob(jobId);
            if (response == null || response.data() == null) throw new ResourceNotFoundException("Job not found");
            return response.data();
        } catch (FeignException.NotFound ex) {
            throw new ResourceNotFoundException("Job not found");
        } catch (FeignException ex) {
            throw new ServiceUnavailableException("Job service unavailable");
        }
    }

    private void requireRole(String actual, String required) {
        if (!required.equals(actual) && !"ADMIN".equals(actual)) throw new UnauthorizedException(required + " role required");
    }
}
