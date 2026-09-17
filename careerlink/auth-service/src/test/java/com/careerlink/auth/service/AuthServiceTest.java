package com.careerlink.auth.service;

import com.careerlink.auth.dto.*;
import com.careerlink.auth.exception.*;
import com.careerlink.auth.model.*;
import com.careerlink.auth.repository.UserRepository;
import com.careerlink.auth.security.JwtService;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class AuthServiceTest {
    private final UserRepository users = mock(UserRepository.class);
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
    private final JwtService jwt = new JwtService("01234567890123456789012345678901", 86400000);
    private final com.careerlink.auth.security.GoogleTokenVerifierService googleVerifier = mock(com.careerlink.auth.security.GoogleTokenVerifierService.class);
    private final AuthService service = new AuthService(users, encoder, jwt, googleVerifier);

    @Test
    void candidateRegistrationSucceedsAndHashesPassword() {
        when(users.existsByEmail("rahul@example.com")).thenReturn(false);
        when(users.save(any())).thenAnswer(invocation -> {
            UserDocument user = invocation.getArgument(0);
            user.setId("u1");
            return user;
        });

        UserResponse response = service.register(new RegisterRequest("Rahul", "rahul@example.com", "Password@123", Role.CANDIDATE));

        assertThat(response.id()).isEqualTo("u1");
        verify(users).save(argThat(user -> encoder.matches("Password@123", user.getPasswordHash())));
    }

    @Test
    void duplicateEmailRegistrationFails() {
        when(users.existsByEmail("rahul@example.com")).thenReturn(true);
        assertThatThrownBy(() -> service.register(new RegisterRequest("Rahul", "rahul@example.com", "Password@123", Role.CANDIDATE)))
                .isInstanceOf(DuplicateResourceException.class);
    }

    @Test
    void loginReturnsJwtAndInvalidPasswordFails() {
        UserDocument user = UserDocument.builder().id("u1").email("rahul@example.com").name("Rahul")
                .passwordHash(encoder.encode("Password@123")).role(Role.CANDIDATE).build();
        when(users.findByEmail("rahul@example.com")).thenReturn(Optional.of(user));

        assertThat(service.login(new LoginRequest("rahul@example.com", "Password@123")).token()).isNotBlank();
        assertThatThrownBy(() -> service.login(new LoginRequest("rahul@example.com", "bad-password")))
                .isInstanceOf(UnauthorizedException.class);
    }

    @Test
    void googleLoginExistingUserReturnsJwtAndPreservesRole() {
        UserDocument existingUser = UserDocument.builder()
                .id("u1")
                .email("googleuser@example.com")
                .name("Google User")
                .role(Role.RECRUITER)
                .googleSub("sub-12345")
                .build();
        when(googleVerifier.verify("valid-token")).thenReturn(
                new com.careerlink.auth.security.GoogleTokenVerifierService.GoogleUserInfo(
                        "sub-12345", "googleuser@example.com", true, "Google User", "http://pic.jpg"
                )
        );
        when(users.findByGoogleSub("sub-12345")).thenReturn(Optional.of(existingUser));
        when(users.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        GoogleAuthResponse response = service.googleLogin(new GoogleAuthRequest("valid-token", null));

        assertThat(response.roleRequired()).isFalse();
        assertThat(response.token()).isNotBlank();
        assertThat(response.role()).isEqualTo(Role.RECRUITER);
        assertThat(response.email()).isEqualTo("googleuser@example.com");
    }

    @Test
    void googleLoginExistingUserByEmailLinksGoogleSub() {
        UserDocument existingUser = UserDocument.builder()
                .id("u2")
                .email("existing@example.com")
                .name("Existing")
                .role(Role.CANDIDATE)
                .build();
        when(googleVerifier.verify("valid-token")).thenReturn(
                new com.careerlink.auth.security.GoogleTokenVerifierService.GoogleUserInfo(
                        "sub-999", "existing@example.com", true, "Existing", "http://pic.jpg"
                )
        );
        when(users.findByGoogleSub("sub-999")).thenReturn(Optional.empty());
        when(users.findByEmail("existing@example.com")).thenReturn(Optional.of(existingUser));
        when(users.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        GoogleAuthResponse response = service.googleLogin(new GoogleAuthRequest("valid-token", null));

        assertThat(response.roleRequired()).isFalse();
        assertThat(response.token()).isNotBlank();
        assertThat(response.role()).isEqualTo(Role.CANDIDATE);
        verify(users).save(argThat(u -> "sub-999".equals(u.getGoogleSub())));
    }

    @Test
    void googleLoginNewUserWithoutRoleReturnsRoleRequired() {
        when(googleVerifier.verify("valid-token")).thenReturn(
                new com.careerlink.auth.security.GoogleTokenVerifierService.GoogleUserInfo(
                        "new-sub", "newuser@example.com", true, "New User", null
                )
        );
        when(users.findByGoogleSub("new-sub")).thenReturn(Optional.empty());
        when(users.findByEmail("newuser@example.com")).thenReturn(Optional.empty());

        GoogleAuthResponse response = service.googleLogin(new GoogleAuthRequest("valid-token", null));

        assertThat(response.roleRequired()).isTrue();
        assertThat(response.token()).isNull();
        assertThat(response.email()).isEqualTo("newuser@example.com");
        assertThat(response.name()).isEqualTo("New User");
    }

    @Test
    void googleLoginNewUserWithRoleCreatesUserAndReturnsJwt() {
        when(googleVerifier.verify("valid-token")).thenReturn(
                new com.careerlink.auth.security.GoogleTokenVerifierService.GoogleUserInfo(
                        "new-sub", "newuser@example.com", true, "New User", "http://pic.jpg"
                )
        );
        when(users.findByGoogleSub("new-sub")).thenReturn(Optional.empty());
        when(users.findByEmail("newuser@example.com")).thenReturn(Optional.empty());
        when(users.save(any())).thenAnswer(invocation -> {
            UserDocument u = invocation.getArgument(0);
            u.setId("u-new");
            return u;
        });

        GoogleAuthResponse response = service.googleLogin(new GoogleAuthRequest("valid-token", Role.CANDIDATE));

        assertThat(response.roleRequired()).isFalse();
        assertThat(response.token()).isNotBlank();
        assertThat(response.role()).isEqualTo(Role.CANDIDATE);
        assertThat(response.userId()).isEqualTo("u-new");
        verify(users).save(argThat(u -> u.getRole() == Role.CANDIDATE && "new-sub".equals(u.getGoogleSub())));
    }

    @Test
    void googleLoginInvalidTokenThrowsUnauthorized() {
        when(googleVerifier.verify("invalid-token")).thenThrow(new UnauthorizedException("Invalid Google ID token"));

        assertThatThrownBy(() -> service.googleLogin(new GoogleAuthRequest("invalid-token", null)))
                .isInstanceOf(UnauthorizedException.class);
    }
}
