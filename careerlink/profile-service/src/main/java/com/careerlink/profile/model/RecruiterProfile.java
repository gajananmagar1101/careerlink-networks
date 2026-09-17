package com.careerlink.profile.model;

import lombok.*;
import org.springframework.data.annotation.*;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
@Document("recruiter_profiles")
public class RecruiterProfile {
    @Id private String id;
    @Indexed(unique = true) private String userId;
    private String companyName;
    private String companyDescription;
    private String website;
    private String industry;
    private String location;
    @CreatedDate private Instant createdAt;
    @LastModifiedDate private Instant updatedAt;
}
