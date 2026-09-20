package com.careerlink.gateway.security;

import io.jsonwebtoken.Claims;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.Set;

@Component
public class JwtAuthenticationFilter implements GlobalFilter, Ordered {

    /** POST endpoints that are always public (no token required). */
    private static final Set<String> PUBLIC_POSTS = Set.of(
            "/api/auth/register",
            "/api/auth/login",
            "/api/auth/google"
    );

    /**
     * GET path prefixes that are publicly accessible without a JWT.
     * These are read-only browsing endpoints safe for unauthenticated users.
     * Note: recruiter-scoped GET routes (e.g. /api/jobs/recruiter/{id}) are
     * protected because they require X-User-Id — the controller will reject
     * them with 400 if no header is present.
     */
    private static final Set<String> PUBLIC_GET_PREFIXES = Set.of(
            "/api/jobs"
    );

    private final JwtService jwtService;

    public JwtAuthenticationFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String path = exchange.getRequest().getURI().getPath();
        String method = exchange.getRequest().getMethod().name();

        // Always strip client-supplied trust headers to prevent header injection.
        ServerHttpRequest sanitized = exchange.getRequest().mutate()
                .headers(headers -> {
                    headers.remove("X-User-Id");
                    headers.remove("X-User-Email");
                    headers.remove("X-User-Role");
                })
                .build();
        exchange = exchange.mutate().request(sanitized).build();

        String auth = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        boolean hasValidToken = false;

        // If Authorization header is provided, validate and attach user context headers
        if (auth != null && auth.startsWith("Bearer ")) {
            try {
                Claims claims = jwtService.parse(auth.substring(7));
                ServerHttpRequest authenticated = exchange.getRequest().mutate()
                        .header("X-User-Id", claims.get("userId", String.class))
                        .header("X-User-Email", claims.getSubject())
                        .header("X-User-Role", claims.get("role", String.class))
                        .build();
                exchange = exchange.mutate().request(authenticated).build();
                hasValidToken = true;
            } catch (Exception ex) {
                exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                return exchange.getResponse().setComplete();
            }
        }

        // Allow public POST endpoints (register, login, google auth).
        if ("POST".equals(method) && PUBLIC_POSTS.contains(path)) {
            return chain.filter(exchange);
        }

        // Allow public GET endpoints (job browsing, job details, job search).
        if ("GET".equals(method) && isPublicGet(path)) {
            return chain.filter(exchange);
        }

        // All other requests require a valid Bearer token.
        if (!hasValidToken) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        return chain.filter(exchange);
    }

    /**
     * Returns true if the request path starts with any of the public GET prefixes,
     * unless it is a protected sub-resource (e.g. saved jobs, match score).
     */
    private boolean isPublicGet(String path) {
        if (path.startsWith("/api/jobs/saved") || path.endsWith("/match") || path.startsWith("/api/jobs/recruiter")) {
            return false;
        }
        for (String prefix : PUBLIC_GET_PREFIXES) {
            if (path.equals(prefix) || path.startsWith(prefix + "/") || path.startsWith(prefix + "?")) {
                return true;
            }
        }
        return false;
    }

    @Override
    public int getOrder() {
        return -1;
    }
}
