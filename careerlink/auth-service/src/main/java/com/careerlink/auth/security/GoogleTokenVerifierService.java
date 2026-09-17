package com.careerlink.auth.security;

import com.careerlink.auth.exception.UnauthorizedException;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class GoogleTokenVerifierService {
    private static final Logger log = LoggerFactory.getLogger(GoogleTokenVerifierService.class);

    private final GoogleIdTokenVerifier verifier;
    private final String clientId;

    public record GoogleUserInfo(
        String sub,
        String email,
        boolean emailVerified,
        String name,
        String pictureUrl
    ) {}

    public GoogleTokenVerifierService(@Value("${app.google.client-id:}") String clientId) {
        this.clientId = clientId != null ? clientId.trim() : "";
        GoogleIdTokenVerifier.Builder builder = new GoogleIdTokenVerifier.Builder(
                new NetHttpTransport(),
                GsonFactory.getDefaultInstance()
        );
        if (!this.clientId.isEmpty()) {
            builder.setAudience(Collections.singletonList(this.clientId));
        }
        this.verifier = builder.build();
    }

    public GoogleUserInfo verify(String idTokenString) {
        if (idTokenString == null || idTokenString.isBlank()) {
            throw new UnauthorizedException("Google ID token is required");
        }

        try {
            GoogleIdToken idToken = verifier.verify(idTokenString);
            if (idToken == null) {
                throw new UnauthorizedException("Invalid Google ID token");
            }

            GoogleIdToken.Payload payload = idToken.getPayload();

            Boolean emailVerified = payload.getEmailVerified();
            if (emailVerified == null || !emailVerified) {
                throw new UnauthorizedException("Google email is not verified");
            }

            String email = payload.getEmail();
            String sub = payload.getSubject();
            String name = (String) payload.get("name");
            String pictureUrl = (String) payload.get("picture");

            if (email == null || email.isBlank() || sub == null || sub.isBlank()) {
                throw new UnauthorizedException("Incomplete Google profile information");
            }

            return new GoogleUserInfo(sub, email, emailVerified, name != null ? name : email, pictureUrl);
        } catch (UnauthorizedException e) {
            throw e;
        } catch (Exception e) {
            log.error("Failed to verify Google ID token: {}", e.getMessage());
            throw new UnauthorizedException("Failed to verify Google token: " + e.getMessage());
        }
    }
}
