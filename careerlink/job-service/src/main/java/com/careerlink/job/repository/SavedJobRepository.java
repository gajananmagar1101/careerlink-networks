package com.careerlink.job.repository;

import com.careerlink.job.model.SavedJobDocument;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface SavedJobRepository extends MongoRepository<SavedJobDocument, String> {
    boolean existsByCandidateIdAndJobId(String candidateId, String jobId);
    void deleteByCandidateIdAndJobId(String candidateId, String jobId);
    Optional<SavedJobDocument> findByCandidateIdAndJobId(String candidateId, String jobId);
    List<SavedJobDocument> findByCandidateIdOrderBySavedAtDesc(String candidateId);
}
