package com.careerlink.application.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "profile-service")
public interface ProfileClient {
    @GetMapping("/api/profiles/candidate/{userId}")
    RemoteApiResponse<CandidateProfileDto> getCandidate(@RequestHeader("X-User-Id") String authUserId,
                                                        @RequestHeader("X-User-Role") String role,
                                                        @PathVariable("userId") String userId);
}
