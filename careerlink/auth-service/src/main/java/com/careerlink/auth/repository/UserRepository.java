package com.careerlink.auth.repository;

import com.careerlink.auth.model.UserDocument;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserRepository extends MongoRepository<UserDocument, String> {
    Optional<UserDocument> findByEmail(String email);
    Optional<UserDocument> findByGoogleSub(String googleSub);
    boolean existsByEmail(String email);
}
