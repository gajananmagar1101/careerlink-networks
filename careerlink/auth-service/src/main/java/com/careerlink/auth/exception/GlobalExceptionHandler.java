package com.careerlink.auth.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.*;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

@RestControllerAdvice
public class GlobalExceptionHandler {
    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);
    @ExceptionHandler(DuplicateResourceException.class)
    ResponseEntity<ErrorResponse> conflict(RuntimeException ex, HttpServletRequest request) {
        return error(HttpStatus.CONFLICT, ex.getMessage(), request);
    }

    @ExceptionHandler(UnauthorizedException.class)
    ResponseEntity<ErrorResponse> unauthorized(RuntimeException ex, HttpServletRequest request) {
        return error(HttpStatus.UNAUTHORIZED, ex.getMessage(), request);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    ResponseEntity<ErrorResponse> validation(MethodArgumentNotValidException ex, HttpServletRequest request) {
        String message = ex.getBindingResult().getFieldErrors().stream()
                .findFirst().map(f -> f.getField() + ": " + f.getDefaultMessage()).orElse("Validation failed");
        return error(HttpStatus.BAD_REQUEST, message, request);
    }

    @ExceptionHandler(Exception.class)
    ResponseEntity<ErrorResponse> unexpected(Exception ex, HttpServletRequest request) {
        log.error("Unexpected error on {}: {}", request.getRequestURI(), ex.getMessage(), ex);
        return error(HttpStatus.INTERNAL_SERVER_ERROR, "Unexpected server error", request);
    }

    private ResponseEntity<ErrorResponse> error(HttpStatus status, String message, HttpServletRequest request) {
        return ResponseEntity.status(status).body(new ErrorResponse(java.time.Instant.now(), status.value(), status.getReasonPhrase(), message, request.getRequestURI()));
    }
}
