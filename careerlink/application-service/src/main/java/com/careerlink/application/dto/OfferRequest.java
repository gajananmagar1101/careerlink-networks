package com.careerlink.application.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.LocalDate;

public record OfferRequest(
        @NotBlank(message = "applicationId is required") String applicationId,
        @NotNull(message = "salary is required") @Positive(message = "salary must be positive") Double salary,
        String currency,
        LocalDate joiningDate,
        String employmentType,
        String message
) {}
