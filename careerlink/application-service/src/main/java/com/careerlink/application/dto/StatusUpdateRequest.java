package com.careerlink.application.dto;

import com.careerlink.application.model.ApplicationStatus;
import jakarta.validation.constraints.NotNull;

public record StatusUpdateRequest(@NotNull ApplicationStatus status) {}
