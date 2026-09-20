package com.careerlink.application.repository;

import com.careerlink.application.model.ApplicationDocument;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface ApplicationRepository extends MongoRepository<ApplicationDocument, String> {
    boolean existsByJobIdAndCandidateId(String jobId, String candidateId);
    List<ApplicationDocument> findByCandidateId(String candidateId);
    List<ApplicationDocument> findByCandidateIdOrderByAppliedAtDesc(String candidateId);
    List<ApplicationDocument> findByJobId(String jobId);
    Optional<ApplicationDocument> findByIdAndCandidateId(String id, String candidateId);
}
