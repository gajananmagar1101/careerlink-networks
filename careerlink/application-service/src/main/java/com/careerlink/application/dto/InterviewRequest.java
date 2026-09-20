package com.careerlink.application.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;

public record InterviewRequest(
        @NotBlank(message = "applicationId is required") String applicationId,
        @NotBlank(message = "interviewType is required") String interviewType,
        @NotNull(message = "scheduledAt is required") Instant scheduledAt,
        int durationMinutes,
        String mode,
        String meetingLink,
        String location,
        String notes
) {}
