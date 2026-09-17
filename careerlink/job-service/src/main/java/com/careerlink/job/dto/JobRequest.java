package com.careerlink.job.dto;

import com.careerlink.job.model.*;
import jakarta.validation.constraints.*;

import java.time.LocalDate;
import java.util.List;

public record JobRequest(
        @NotBlank @Size(max = 160) String title,
        @NotBlank @Size(min = 20, max = 10000) String description,
        @NotBlank @Size(max = 120) String location,
        @NotNull EmploymentType employmentType,
        @Min(0) int experienceRequired,
        @Positive Integer salaryMin,
        @Positive Integer salaryMax,
        @NotEmpty List<@NotBlank String> skills,
        @NotBlank String category,
        JobStatus status,
        @Future LocalDate applicationDeadline,
        @NotBlank String companyName
) {}
