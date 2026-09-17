package com.careerlink.gateway.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.Test;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import static org.assertj.core.api.Assertions.assertThat;

class JwtServiceTest {
    @Test
    void parsesValidToken() {
        String secret = "01234567890123456789012345678901";
        String token = Jwts.builder()
                .subject("a@example.com")
                .claim("userId", "u1")
                .claim("role", "CANDIDATE")
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 60000))
                .signWith(Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8)))
                .compact();

        assertThat(new JwtService(secret).parse(token).get("role", String.class)).isEqualTo("CANDIDATE");
    }
}
