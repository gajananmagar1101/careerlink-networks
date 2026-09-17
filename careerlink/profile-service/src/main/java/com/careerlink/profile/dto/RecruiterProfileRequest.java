package com.careerlink.profile.dto;

import jakarta.validation.constraints.*;

public record RecruiterProfileRequest(
        @NotBlank @Size(max = 160) String companyName,
        @Size(max = 3000) String companyDescription,
        String website,
        @Size(max = 120) String industry,
        @Size(max = 120) String location
) {}
