package com.careerlink.profile.model;

import lombok.*;
import org.springframework.data.annotation.*;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
@Document("candidate_profiles")
public class CandidateProfile {
    @Id private String id;
    @Indexed(unique = true) private String userId;
    private String fullName;
    @Indexed private String email;
    private String phone;
    private String location;
    private String headline;
    private String summary;
    private List<String> skills;
    private List<String> education;
    private List<String> experience;
    private String resumeUrl;
    @Builder.Default private List<String> recentlyViewedJobIds = new java.util.ArrayList<>();
    @CreatedDate private Instant createdAt;
    @LastModifiedDate private Instant updatedAt;
}
