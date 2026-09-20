package com.careerlink.application.model;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.time.LocalDate;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document("offers")
public class OfferDocument {
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

    private Double salary;
    @Builder.Default
    private String currency = "USD";
    private LocalDate joiningDate;
    @Builder.Default
    private String employmentType = "FULL_TIME";
    private String message;
    @Builder.Default
    private OfferStatus status = OfferStatus.SENT;

    @CreatedDate
    private Instant createdAt;
    @LastModifiedDate
    private Instant updatedAt;
}
