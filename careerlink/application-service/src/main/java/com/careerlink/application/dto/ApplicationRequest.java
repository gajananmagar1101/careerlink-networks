package com.careerlink.application.dto;

import jakarta.validation.constraints.*;

public record ApplicationRequest(
        @NotBlank String jobId,
        String resumeUrl,
        @Size(max = 5000) String coverLetter
) {}
