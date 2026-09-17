package com.careerlink.profile.dto;

import jakarta.validation.constraints.*;
import java.util.List;

public record CandidateProfileRequest(
        @NotBlank @Size(max = 120) String fullName,
        @NotBlank @Email String email,
        @Size(max = 30) String phone,
        @Size(max = 120) String location,
        @Size(max = 160) String headline,
        @Size(max = 3000) String summary,
        List<String> skills,
        List<String> education,
        List<String> experience,
        String resumeUrl
) {}
