package com.careerlink.application.model;

import lombok.*;
import org.springframework.data.annotation.*;
import org.springframework.data.mongodb.core.index.*;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
@Document("applications")
@CompoundIndex(name = "uk_job_candidate", def = "{'jobId': 1, 'candidateId': 1}", unique = true)
public class ApplicationDocument {
    @Id private String id;
    @Indexed private String jobId;
    @Indexed private String candidateId;
    private String resumeUrl;
    private String coverLetter;
    @Indexed private ApplicationStatus status;
    @CreatedDate private Instant appliedAt;
    @LastModifiedDate private Instant updatedAt;
}
