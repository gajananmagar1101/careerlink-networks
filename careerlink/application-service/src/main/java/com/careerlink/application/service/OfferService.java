package com.careerlink.application.service;

import com.careerlink.application.client.JobClient;
import com.careerlink.application.client.JobDto;
import com.careerlink.application.dto.OfferRequest;
import com.careerlink.application.exception.ResourceNotFoundException;
import com.careerlink.application.exception.UnauthorizedException;
import com.careerlink.application.model.ApplicationDocument;
import com.careerlink.application.model.ApplicationStatus;
import com.careerlink.application.model.NotificationType;
import com.careerlink.application.model.OfferDocument;
import com.careerlink.application.model.OfferStatus;
import com.careerlink.application.repository.ApplicationRepository;
import com.careerlink.application.repository.OfferRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class OfferService {
    private final OfferRepository offerRepository;
    private final ApplicationRepository applicationRepository;
    private final JobClient jobClient;
    private final NotificationService notificationService;

    public OfferDocument createOffer(String recruiterId, String role, OfferRequest request) {
        if (!"RECRUITER".equals(role) && !"ADMIN".equals(role)) {
            throw new UnauthorizedException("Only recruiters can extend offers");
        }

        ApplicationDocument application = applicationRepository.findById(request.applicationId())
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));

        JobDto job = jobClient.getJob(application.getJobId()).data();
        if (job == null) {
            throw new ResourceNotFoundException("Job not found");
        }
        if (!recruiterId.equals(job.recruiterId()) && !"ADMIN".equals(role)) {
            throw new UnauthorizedException("Only the owning recruiter can extend an offer");
        }

        OfferDocument offer = OfferDocument.builder()
                .applicationId(application.getId())
                .jobId(application.getJobId())
                .candidateId(application.getCandidateId())
                .recruiterId(recruiterId)
                .salary(request.salary())
                .currency(request.currency() != null ? request.currency() : "USD")
                .joiningDate(request.joiningDate())
                .employmentType(request.employmentType() != null ? request.employmentType() : "FULL_TIME")
                .message(request.message())
                .status(OfferStatus.SENT)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        OfferDocument saved = offerRepository.save(offer);

        if (application.getStatus().canTransitionTo(ApplicationStatus.OFFERED)) {
            application.setStatus(ApplicationStatus.OFFERED);
            applicationRepository.save(application);
        }

        notificationService.createNotification(
                application.getCandidateId(),
                NotificationType.OFFER_SENT,
                "Job Offer Received!",
                "You have received an offer for the position of " + job.title() + " at " + job.companyName() + "!",
                saved.getId()
        );

        log.info("Recruiter {} extended offer {} to candidate {}", recruiterId, saved.getId(), application.getCandidateId());
        return saved;
    }

    public List<OfferDocument> getCandidateOffers(String candidateId) {
        return offerRepository.findByCandidateIdOrderByCreatedAtDesc(candidateId);
    }

    public List<OfferDocument> getRecruiterOffers(String recruiterId) {
        return offerRepository.findByRecruiterIdOrderByCreatedAtDesc(recruiterId);
    }

    public OfferDocument acceptOffer(String candidateId, String offerId) {
        OfferDocument offer = offerRepository.findById(offerId)
                .orElseThrow(() -> new ResourceNotFoundException("Offer not found"));

        if (!candidateId.equals(offer.getCandidateId())) {
            throw new UnauthorizedException("Only the candidate can accept this offer");
        }
        if (offer.getStatus() != OfferStatus.SENT) {
            throw new IllegalStateException("Offer is not in SENT state");
        }

        offer.setStatus(OfferStatus.ACCEPTED);
        offer.setUpdatedAt(Instant.now());
        OfferDocument saved = offerRepository.save(offer);

        ApplicationDocument application = applicationRepository.findById(offer.getApplicationId()).orElse(null);
        if (application != null && application.getStatus().canTransitionTo(ApplicationStatus.HIRED)) {
            application.setStatus(ApplicationStatus.HIRED);
            applicationRepository.save(application);
        }

        notificationService.createNotification(
                offer.getRecruiterId(),
                NotificationType.OFFER_ACCEPTED,
                "Offer Accepted!",
                "Candidate accepted your offer for job " + offer.getJobId(),
                saved.getId()
        );

        return saved;
    }

    public OfferDocument declineOffer(String candidateId, String offerId) {
        OfferDocument offer = offerRepository.findById(offerId)
                .orElseThrow(() -> new ResourceNotFoundException("Offer not found"));

        if (!candidateId.equals(offer.getCandidateId())) {
            throw new UnauthorizedException("Only the candidate can decline this offer");
        }
        if (offer.getStatus() != OfferStatus.SENT) {
            throw new IllegalStateException("Offer is not in SENT state");
        }

        offer.setStatus(OfferStatus.DECLINED);
        offer.setUpdatedAt(Instant.now());
        OfferDocument saved = offerRepository.save(offer);

        notificationService.createNotification(
                offer.getRecruiterId(),
                NotificationType.OFFER_DECLINED,
                "Offer Declined",
                "Candidate declined the offer for job " + offer.getJobId(),
                saved.getId()
        );

        return saved;
    }
}
