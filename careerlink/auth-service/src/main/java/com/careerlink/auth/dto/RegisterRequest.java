package com.careerlink.auth.dto;

import com.careerlink.auth.model.Role;
import jakarta.validation.constraints.*;

public record RegisterRequest(
        @NotBlank @Size(max = 120) String name,
        @NotBlank @Email String email,
        @NotBlank @Size(min = 8, max = 120) String password,
        @NotNull Role role
) {}
