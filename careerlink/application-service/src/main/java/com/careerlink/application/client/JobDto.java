package com.careerlink.application.client;

import java.time.LocalDate;

public record JobDto(String id, String recruiterId, String status, LocalDate applicationDeadline, String title, String companyName) {}
