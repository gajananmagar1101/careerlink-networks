package com.careerlink.auth.controller;

import com.careerlink.auth.dto.*;
import com.careerlink.auth.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    ApiResponse<UserResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ApiResponse.ok("User registered successfully", authService.register(request));
    }

    @PostMapping("/login")
    ApiResponse<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ApiResponse.ok("Login successful", authService.login(request));
    }

    @PostMapping("/google")
    ApiResponse<GoogleAuthResponse> google(@Valid @RequestBody GoogleAuthRequest request) {
        return ApiResponse.ok("Google authentication successful", authService.googleLogin(request));
    }

    @GetMapping("/validate")
    ApiResponse<Boolean> validate(@RequestHeader(HttpHeaders.AUTHORIZATION) String authorization) {
        return ApiResponse.ok("Token is valid", authService.validate(bearer(authorization)));
    }

    @GetMapping("/me")
    ApiResponse<UserResponse> me(@RequestHeader(HttpHeaders.AUTHORIZATION) String authorization) {
        return ApiResponse.ok("Current user", authService.me(bearer(authorization)));
    }

    @GetMapping("/users/{id}")
    ApiResponse<UserResponse> getUser(@PathVariable String id) {
        return ApiResponse.ok("User details", authService.getUserById(id));
    }

    private String bearer(String authorization) {
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            throw new com.careerlink.auth.exception.UnauthorizedException("Missing bearer token");
        }
        return authorization.substring(7);
    }
}
