package com.careerlink.profile.repository;

import com.careerlink.profile.model.CandidateProfile;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface CandidateProfileRepository extends MongoRepository<CandidateProfile, String> {
    Optional<CandidateProfile> findByUserId(String userId);
}
