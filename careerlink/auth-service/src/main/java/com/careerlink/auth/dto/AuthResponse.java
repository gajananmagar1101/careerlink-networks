package com.careerlink.auth.dto;

import com.careerlink.auth.model.Role;

public record AuthResponse(String token, String userId, String email, Role role, long expiresInMs) {}
