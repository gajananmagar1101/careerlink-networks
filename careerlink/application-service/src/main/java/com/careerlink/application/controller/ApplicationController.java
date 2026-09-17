package com.careerlink.application.controller;

import com.careerlink.application.dto.*;
import com.careerlink.application.model.ApplicationDocument;
import com.careerlink.application.service.ApplicationService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {
    private final ApplicationService applications;

    public ApplicationController(ApplicationService applications) {
        this.applications = applications;
    }

    @PostMapping
    ApiResponse<ApplicationDocument> apply(@RequestHeader("X-User-Id") String userId, @RequestHeader("X-User-Role") String role, @Valid @RequestBody ApplicationRequest request) {
        return ApiResponse.ok("Application submitted", applications.apply(userId, role, request));
    }

    @GetMapping("/{applicationId}")
    ApiResponse<ApplicationDocument> get(@RequestHeader("X-User-Id") String userId, @RequestHeader("X-User-Role") String role, @PathVariable String applicationId) {
        return ApiResponse.ok("Application details", applications.get(userId, role, applicationId));
    }

    @GetMapping("/candidate/{candidateId}")
    ApiResponse<List<ApplicationDocument>> byCandidate(@RequestHeader("X-User-Id") String userId, @RequestHeader("X-User-Role") String role, @PathVariable String candidateId) {
        return ApiResponse.ok("Candidate applications", applications.byCandidate(userId, role, candidateId));
    }

    @GetMapping("/job/{jobId}")
    ApiResponse<List<ApplicationDocument>> byJob(@RequestHeader("X-User-Id") String userId, @RequestHeader("X-User-Role") String role, @PathVariable String jobId) {
        return ApiResponse.ok("Job applications", applications.byJob(userId, role, jobId));
    }

    @PutMapping("/{applicationId}/status")
    ApiResponse<ApplicationDocument> updateStatus(@RequestHeader("X-User-Id") String userId, @RequestHeader("X-User-Role") String role, @PathVariable String applicationId, @Valid @RequestBody StatusUpdateRequest request) {
        return ApiResponse.ok("Application status updated", applications.updateStatus(userId, role, applicationId, request.status()));
    }

    @DeleteMapping("/{applicationId}")
    ApiResponse<Void> delete(@RequestHeader("X-User-Id") String userId, @RequestHeader("X-User-Role") String role, @PathVariable String applicationId) {
        applications.delete(userId, role, applicationId);
        return ApiResponse.ok("Application withdrawn", null);
    }
}
