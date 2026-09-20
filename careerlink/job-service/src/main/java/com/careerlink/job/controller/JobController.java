package com.careerlink.job.controller;

import com.careerlink.job.dto.*;
import com.careerlink.job.model.EmploymentType;
import com.careerlink.job.service.JobService;
import jakarta.validation.Valid;
import org.springframework.data.domain.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
public class JobController {
    private final JobService jobs;

    public JobController(JobService jobs) {
        this.jobs = jobs;
    }

    @PostMapping
    public ApiResponse<JobSummary> create(@RequestHeader("X-User-Id") String userId, @RequestHeader("X-User-Role") String role, @Valid @RequestBody JobRequest request) {
        return ApiResponse.ok("Job created successfully", jobs.create(userId, role, request));
    }

    @GetMapping
    public ApiResponse<Page<JobSummary>> list(Pageable pageable) {
        return ApiResponse.ok("Open jobs", jobs.list(pageable));
    }

    @GetMapping("/{jobId}")
    public ApiResponse<JobSummary> get(@PathVariable String jobId) {
        return ApiResponse.ok("Job details", jobs.get(jobId));
    }

    @PutMapping("/{jobId}")
    public ApiResponse<JobSummary> update(@RequestHeader("X-User-Id") String userId, @RequestHeader("X-User-Role") String role, @PathVariable String jobId, @Valid @RequestBody JobRequest request) {
        return ApiResponse.ok("Job updated", jobs.update(userId, role, jobId, request));
    }

    @DeleteMapping("/{jobId}")
    public ApiResponse<Void> delete(@RequestHeader("X-User-Id") String userId, @RequestHeader("X-User-Role") String role, @PathVariable String jobId) {
        jobs.delete(userId, role, jobId);
        return ApiResponse.ok("Job deleted", null);
    }

    @GetMapping("/recruiter/{recruiterId}")
    public ApiResponse<Page<JobSummary>> recruiterJobs(@RequestHeader("X-User-Id") String userId, @RequestHeader("X-User-Role") String role, @PathVariable String recruiterId, Pageable pageable) {
        return ApiResponse.ok("Recruiter jobs", jobs.byRecruiter(userId, role, recruiterId, pageable));
    }

    @GetMapping("/search")
    public ApiResponse<Page<JobSummary>> search(@RequestParam(required = false) String keyword,
                                         @RequestParam(required = false) String location,
                                         @RequestParam(required = false) String category,
                                         @RequestParam(required = false) EmploymentType employmentType,
                                         Pageable pageable) {
        return ApiResponse.ok("Search results", jobs.search(keyword, location, category, employmentType, pageable));
    }

    // --- Saved Jobs Endpoints ---
    @PostMapping("/{jobId}/save")
    public ApiResponse<Void> saveJob(@RequestHeader("X-User-Id") String userId, @PathVariable String jobId) {
        jobs.saveJob(userId, jobId);
        return ApiResponse.ok("Job saved successfully", null);
    }

    @DeleteMapping("/{jobId}/save")
    public ApiResponse<Void> unsaveJob(@RequestHeader("X-User-Id") String userId, @PathVariable String jobId) {
        jobs.unsaveJob(userId, jobId);
        return ApiResponse.ok("Job unsaved successfully", null);
    }

    @GetMapping("/saved")
    public ApiResponse<Page<JobSummary>> getSavedJobs(@RequestHeader("X-User-Id") String userId, Pageable pageable) {
        return ApiResponse.ok("Saved jobs", jobs.getSavedJobs(userId, pageable));
    }

    @GetMapping("/saved/ids")
    public ApiResponse<List<String>> getSavedJobIds(@RequestHeader("X-User-Id") String userId) {
        return ApiResponse.ok("Saved job IDs", jobs.getSavedJobIds(userId));
    }

    // --- Job Match Score Endpoint ---
    @GetMapping("/{jobId}/match")
    public ApiResponse<JobMatchResponse> getJobMatch(@RequestHeader("X-User-Id") String userId, @PathVariable String jobId) {
        return ApiResponse.ok("Job match calculation", jobs.calculateMatchScore(userId, jobId));
    }
}
