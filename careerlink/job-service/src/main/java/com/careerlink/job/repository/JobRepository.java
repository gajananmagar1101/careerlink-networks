package com.careerlink.job.repository;

import com.careerlink.job.model.*;
import org.springframework.data.domain.*;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface JobRepository extends MongoRepository<JobDocument, String> {
    Page<JobDocument> findByStatus(JobStatus status, Pageable pageable);
    Page<JobDocument> findByRecruiterId(String recruiterId, Pageable pageable);
}
