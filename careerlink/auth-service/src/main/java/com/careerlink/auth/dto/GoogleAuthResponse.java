package com.careerlink.auth.dto;

import com.careerlink.auth.model.Role;

public record GoogleAuthResponse(
    String token,
    String userId,
    String email,
    String name,
    Role role,
    long expiresInMs,
    boolean roleRequired
) {}
