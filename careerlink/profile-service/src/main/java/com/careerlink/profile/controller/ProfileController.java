package com.careerlink.profile.controller;

import com.careerlink.profile.dto.*;
import com.careerlink.profile.model.*;
import com.careerlink.profile.service.ProfileService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profiles")
public class ProfileController {
    private final ProfileService profiles;

    public ProfileController(ProfileService profiles) {
        this.profiles = profiles;
    }

    @PostMapping("/candidate")
    ApiResponse<CandidateProfile> createCandidate(@RequestHeader("X-User-Id") String userId, @RequestHeader("X-User-Role") String role, @Valid @RequestBody CandidateProfileRequest request) {
        return ApiResponse.ok("Candidate profile saved", profiles.saveCandidate(userId, role, userId, request));
    }

    @GetMapping("/candidate/{userId}")
    ApiResponse<CandidateProfile> getCandidate(@RequestHeader("X-User-Id") String authUserId, @RequestHeader("X-User-Role") String role, @PathVariable String userId) {
        return ApiResponse.ok("Candidate profile", profiles.getCandidate(authUserId, role, userId));
    }

    @PutMapping("/candidate/{userId}")
    ApiResponse<CandidateProfile> updateCandidate(@RequestHeader("X-User-Id") String authUserId, @RequestHeader("X-User-Role") String role, @PathVariable String userId, @Valid @RequestBody CandidateProfileRequest request) {
        return ApiResponse.ok("Candidate profile updated", profiles.saveCandidate(authUserId, role, userId, request));
    }

    @PostMapping("/recruiter")
    ApiResponse<RecruiterProfile> createRecruiter(@RequestHeader("X-User-Id") String userId, @RequestHeader("X-User-Role") String role, @Valid @RequestBody RecruiterProfileRequest request) {
        return ApiResponse.ok("Recruiter profile saved", profiles.saveRecruiter(userId, role, userId, request));
    }

    @GetMapping("/recruiter/{userId}")
    ApiResponse<RecruiterProfile> getRecruiter(@RequestHeader("X-User-Id") String authUserId, @RequestHeader("X-User-Role") String role, @PathVariable String userId) {
        return ApiResponse.ok("Recruiter profile", profiles.getRecruiter(authUserId, role, userId));
    }

    @PutMapping("/recruiter/{userId}")
    ApiResponse<RecruiterProfile> updateRecruiter(@RequestHeader("X-User-Id") String authUserId, @RequestHeader("X-User-Role") String role, @PathVariable String userId, @Valid @RequestBody RecruiterProfileRequest request) {
        return ApiResponse.ok("Recruiter profile updated", profiles.saveRecruiter(authUserId, role, userId, request));
    }
}
