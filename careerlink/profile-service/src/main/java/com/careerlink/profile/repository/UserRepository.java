package com.careerlink.profile.repository;

import com.careerlink.profile.model.UserDocument;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<UserDocument, String> {
}
