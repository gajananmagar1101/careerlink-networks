package com.careerlink.job.dto;

import com.careerlink.job.model.*;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

public record JobSummary(String id, String recruiterId, String companyName, String title, String description,
                         String location, EmploymentType employmentType, int experienceRequired,
                         Integer salaryMin, Integer salaryMax, List<String> skills, String category,
                         JobStatus status, LocalDate applicationDeadline, Instant createdAt, Instant updatedAt) {}
