package com.careerlink.application.repository;

import com.careerlink.application.model.OfferDocument;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface OfferRepository extends MongoRepository<OfferDocument, String> {
    List<OfferDocument> findByCandidateIdOrderByCreatedAtDesc(String candidateId);
    List<OfferDocument> findByRecruiterIdOrderByCreatedAtDesc(String recruiterId);
    List<OfferDocument> findByJobIdOrderByCreatedAtDesc(String jobId);
    Optional<OfferDocument> findByApplicationId(String applicationId);
}
