package com.careerlink.application.controller;

import com.careerlink.application.dto.ApiResponse;
import com.careerlink.application.dto.InterviewRequest;
import com.careerlink.application.model.InterviewDocument;
import com.careerlink.application.service.InterviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/interviews")
@RequiredArgsConstructor
public class InterviewController {
    private final InterviewService interviewService;

    @PostMapping
    public ResponseEntity<ApiResponse<InterviewDocument>> scheduleInterview(
            @RequestHeader(name = "X-User-Id") String userId,
            @RequestHeader(name = "X-User-Role") String role,
            @Valid @RequestBody InterviewRequest request) {
        InterviewDocument interview = interviewService.scheduleInterview(userId, role, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Interview scheduled successfully", interview));
    }

    @GetMapping("/candidate")
    public ResponseEntity<ApiResponse<List<InterviewDocument>>> getCandidateInterviews(
            @RequestHeader(name = "X-User-Id") String userId) {
        return ResponseEntity.ok(ApiResponse.ok(interviewService.getCandidateInterviews(userId)));
    }

    @GetMapping("/recruiter")
    public ResponseEntity<ApiResponse<List<InterviewDocument>>> getRecruiterInterviews(
            @RequestHeader(name = "X-User-Id") String userId) {
        return ResponseEntity.ok(ApiResponse.ok(interviewService.getRecruiterInterviews(userId)));
    }

    @GetMapping("/application/{applicationId}")
    public ResponseEntity<ApiResponse<List<InterviewDocument>>> getApplicationInterviews(
            @PathVariable String applicationId) {
        return ResponseEntity.ok(ApiResponse.ok(interviewService.getApplicationInterviews(applicationId)));
    }

    @PutMapping("/{id}/reschedule")
    public ResponseEntity<ApiResponse<InterviewDocument>> reschedule(
            @PathVariable String id,
            @RequestHeader(name = "X-User-Id") String userId,
            @RequestHeader(name = "X-User-Role") String role,
            @RequestBody Map<String, String> payload) {
        Instant newTime = Instant.parse(payload.get("scheduledAt"));
        String meetingLink = payload.get("meetingLink");
        return ResponseEntity.ok(ApiResponse.ok(interviewService.rescheduleInterview(userId, role, id, newTime, meetingLink)));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<InterviewDocument>> cancel(
            @PathVariable String id,
            @RequestHeader(name = "X-User-Id") String userId,
            @RequestHeader(name = "X-User-Role") String role,
            @RequestBody(required = false) Map<String, String> payload) {
        String reason = payload != null && payload.containsKey("reason") ? payload.get("reason") : "Recruiter cancelled";
        return ResponseEntity.ok(ApiResponse.ok(interviewService.cancelInterview(userId, role, id, reason)));
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<ApiResponse<InterviewDocument>> complete(
            @PathVariable String id,
            @RequestHeader(name = "X-User-Id") String userId,
            @RequestHeader(name = "X-User-Role") String role,
            @RequestBody(required = false) Map<String, String> payload) {
        String feedback = payload != null ? payload.get("feedback") : null;
        return ResponseEntity.ok(ApiResponse.ok(interviewService.completeInterview(userId, role, id, feedback)));
    }
}
