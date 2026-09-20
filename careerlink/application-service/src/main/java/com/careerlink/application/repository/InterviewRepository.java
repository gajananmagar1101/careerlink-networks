package com.careerlink.application.repository;

import com.careerlink.application.model.InterviewDocument;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface InterviewRepository extends MongoRepository<InterviewDocument, String> {
    List<InterviewDocument> findByCandidateIdOrderByScheduledAtDesc(String candidateId);
    List<InterviewDocument> findByRecruiterIdOrderByScheduledAtDesc(String recruiterId);
    List<InterviewDocument> findByApplicationIdOrderByScheduledAtDesc(String applicationId);
    List<InterviewDocument> findByJobIdOrderByScheduledAtDesc(String jobId);
}
