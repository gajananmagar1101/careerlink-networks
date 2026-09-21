package com.careerlink.auth.service;

import com.careerlink.auth.dto.*;
import com.careerlink.auth.exception.*;
import com.careerlink.auth.model.*;
import com.careerlink.auth.repository.UserRepository;
import com.careerlink.auth.security.JwtService;
import io.jsonwebtoken.Claims;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class AuthService {
    private final UserRepository users;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final com.careerlink.auth.security.GoogleTokenVerifierService googleTokenVerifier;

    @org.springframework.beans.factory.annotation.Autowired
    public AuthService(UserRepository users, PasswordEncoder passwordEncoder, JwtService jwtService, com.careerlink.auth.security.GoogleTokenVerifierService googleTokenVerifier) {
        this.users = users;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.googleTokenVerifier = googleTokenVerifier;
    }

    public AuthService(UserRepository users, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this(users, passwordEncoder, jwtService, null);
    }

    public UserResponse register(RegisterRequest request) {
        if (request.role() == Role.ADMIN) {
            throw new UnauthorizedException("ADMIN users cannot self-register");
        }
        if (users.existsByEmail(request.email())) {
            throw new DuplicateResourceException("Email already registered");
        }
        UserDocument user = UserDocument.builder()
                .name(request.name())
                .email(request.email().toLowerCase())
                .passwordHash(passwordEncoder.encode(request.password()))
                .role(request.role())
                .build();
        UserDocument saved = users.save(user);
        log.info("Registered user {} with role {}", saved.getEmail(), saved.getRole());
        return toResponse(saved);
    }

    public AuthResponse login(LoginRequest request) {
        UserDocument user = users.findByEmail(request.email().toLowerCase())
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));
        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new UnauthorizedException("Invalid email or password");
        }
        return new AuthResponse(jwtService.generate(user), user.getId(), user.getEmail(), user.getRole(), jwtService.expirationMs());
    }

    public GoogleAuthResponse googleLogin(GoogleAuthRequest request) {
        if (googleTokenVerifier == null) {
            throw new IllegalStateException("Google token verifier is not configured");
        }
        com.careerlink.auth.security.GoogleTokenVerifierService.GoogleUserInfo userInfo = googleTokenVerifier.verify(request.idToken());
        String email = userInfo.email().toLowerCase();
        String googleSub = userInfo.sub();

        UserDocument user = users.findByGoogleSub(googleSub)
                .or(() -> users.findByEmail(email))
                .orElse(null);

        if (user != null) {
            boolean changed = false;
            if (user.getGoogleSub() == null || !user.getGoogleSub().equals(googleSub)) {
                user.setGoogleSub(googleSub);
                changed = true;
            }
            if (userInfo.pictureUrl() != null && !userInfo.pictureUrl().equals(user.getPictureUrl())) {
                user.setPictureUrl(userInfo.pictureUrl());
                changed = true;
            }
            if (changed) {
                user = users.save(user);
            }
            String token = jwtService.generate(user);
            log.info("Google login successful for user {} with role {}", user.getEmail(), user.getRole());
            return new GoogleAuthResponse(
                    token,
                    user.getId(),
                    user.getEmail(),
                    user.getName(),
                    user.getRole(),
                    jwtService.expirationMs(),
                    false
            );
        }

        if (request.role() == null) {
            return new GoogleAuthResponse(
                    null,
                    null,
                    email,
                    userInfo.name(),
                    null,
                    0,
                    true
            );
        }

        if (request.role() == Role.ADMIN) {
            throw new UnauthorizedException("ADMIN users cannot self-register");
        }

        UserDocument newUser = UserDocument.builder()
                .name(userInfo.name())
                .email(email)
                .googleSub(googleSub)
                .pictureUrl(userInfo.pictureUrl())
                .role(request.role())
                .build();
        UserDocument saved = users.save(newUser);
        log.info("Registered new user via Google: {} with role {}", saved.getEmail(), saved.getRole());
        String token = jwtService.generate(saved);
        return new GoogleAuthResponse(
                token,
                saved.getId(),
                saved.getEmail(),
                saved.getName(),
                saved.getRole(),
                jwtService.expirationMs(),
                false
        );
    }

    public UserResponse me(String token) {
        Claims claims = jwtService.parse(token);
        return users.findById(claims.get("userId", String.class)).map(this::toResponse)
                .orElseThrow(() -> new UnauthorizedException("Token user no longer exists"));
    }

    public boolean validate(String token) {
        jwtService.parse(token);
        return true;
    }

    public UserResponse getUserById(String id) {
        return users.findById(id).map(this::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private UserResponse toResponse(UserDocument user) {
        return new UserResponse(user.getId(), user.getName(), user.getEmail(), user.getRole());
    }
}
