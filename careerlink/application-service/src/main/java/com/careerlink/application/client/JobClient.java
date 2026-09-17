package com.careerlink.application.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "job-service")
public interface JobClient {
    @GetMapping("/api/jobs/{jobId}")
    RemoteApiResponse<JobDto> getJob(@PathVariable("jobId") String jobId);
}
