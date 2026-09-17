package com.careerlink.auth.dto;

import com.careerlink.auth.model.Role;

public record UserResponse(String id, String name, String email, Role role) {}
