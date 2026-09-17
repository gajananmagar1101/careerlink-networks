package com.careerlink.job.model;

import lombok.*;
import org.springframework.data.annotation.*;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.*;
import java.util.List;

@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
@Document("jobs")
public class JobDocument {
    @Id private String id;
    @Indexed private String recruiterId;
    private String companyName;
    @Indexed private String title;
    private String description;
    @Indexed private String location;
    private EmploymentType employmentType;
    private int experienceRequired;
    private Integer salaryMin;
    private Integer salaryMax;
    @Indexed private List<String> skills;
    @Indexed private String category;
    @Indexed private JobStatus status;
    @CreatedDate @Indexed private Instant createdAt;
    @LastModifiedDate private Instant updatedAt;
    private LocalDate applicationDeadline;
}
