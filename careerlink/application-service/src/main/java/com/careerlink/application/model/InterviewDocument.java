package com.careerlink.application.model;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document("interviews")
public class InterviewDocument {
    @Id
    private String id;
    @Indexed
    private String applicationId;
    @Indexed
    private String jobId;
    @Indexed
    private String candidateId;
    @Indexed
    private String recruiterId;

    private String interviewType; // e.g. TECHNICAL, HR, SYSTEM_DESIGN, BEHAVIORAL
    private Instant scheduledAt;
    @Builder.Default
    private int durationMinutes = 45;
    @Builder.Default
    private String mode = "REMOTE"; // REMOTE, ONSITE, PHONE
    private String meetingLink;
    private String location;
    @Builder.Default
    private InterviewStatus status = InterviewStatus.SCHEDULED;
    private String notes;
    private String feedback;

    @CreatedDate
    private Instant createdAt;
    @LastModifiedDate
    private Instant updatedAt;
}
