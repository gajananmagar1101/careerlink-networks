package com.careerlink.auth.dto;

import com.careerlink.auth.model.Role;
import jakarta.validation.constraints.NotBlank;

public record GoogleAuthRequest(
    @NotBlank String idToken,
    Role role
) {}
