package com.careerlink.profile.repository;

import com.careerlink.profile.model.RecruiterProfile;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface RecruiterProfileRepository extends MongoRepository<RecruiterProfile, String> {
    Optional<RecruiterProfile> findByUserId(String userId);
}
