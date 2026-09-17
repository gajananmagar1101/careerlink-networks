package com.careerlink.job.service;

import com.careerlink.job.dto.*;
import com.careerlink.job.exception.*;
import com.careerlink.job.model.*;
import com.careerlink.job.repository.JobRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.*;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.*;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.regex.Pattern;

@Slf4j
@Service
public class JobService {
    private final JobRepository jobs;
    private final MongoTemplate mongoTemplate;

    public JobService(JobRepository jobs, MongoTemplate mongoTemplate) {
        this.jobs = jobs;
        this.mongoTemplate = mongoTemplate;
    }

    public JobSummary create(String recruiterId, String role, JobRequest request) {
        requireRecruiter(role);
        JobDocument saved = jobs.save(toDocument(new JobDocument(), recruiterId, request));
        log.info("Recruiter {} created job {}", recruiterId, saved.getId());
        return toSummary(saved);
    }

    public Page<JobSummary> list(Pageable pageable) {
        return jobs.findByStatus(JobStatus.OPEN, pageable).map(this::toSummary);
    }

    public JobSummary get(String id) {
        return toSummary(find(id));
    }

    public Page<JobSummary> byRecruiter(String authUserId, String role, String recruiterId, Pageable pageable) {
        requireRecruiter(role);
        if (!authUserId.equals(recruiterId) && !"ADMIN".equals(role)) throw new UnauthorizedException("Cannot view another recruiter's jobs");
        return jobs.findByRecruiterId(recruiterId, pageable).map(this::toSummary);
    }

    public JobSummary update(String authUserId, String role, String id, JobRequest request) {
        requireRecruiter(role);
        JobDocument job = find(id);
        requireOwner(authUserId, role, job);
        return toSummary(jobs.save(toDocument(job, job.getRecruiterId(), request)));
    }

    public void delete(String authUserId, String role, String id) {
        requireRecruiter(role);
        JobDocument job = find(id);
        requireOwner(authUserId, role, job);
        jobs.delete(job);
    }

    public Page<JobSummary> search(String keyword, String location, String category, EmploymentType employmentType, Pageable pageable) {
        List<Criteria> criteria = new ArrayList<>();
        criteria.add(Criteria.where("status").is(JobStatus.OPEN));
        if (keyword != null && !keyword.isBlank()) {
            Pattern pattern = Pattern.compile(Pattern.quote(keyword), Pattern.CASE_INSENSITIVE);
            criteria.add(new Criteria().orOperator(Criteria.where("title").regex(pattern), Criteria.where("description").regex(pattern), Criteria.where("skills").regex(pattern)));
        }
        if (location != null && !location.isBlank()) criteria.add(Criteria.where("location").regex(Pattern.compile(Pattern.quote(location), Pattern.CASE_INSENSITIVE)));
        if (category != null && !category.isBlank()) criteria.add(Criteria.where("category").is(category));
        if (employmentType != null) criteria.add(Criteria.where("employmentType").is(employmentType));
        Query query = new Query(new Criteria().andOperator(criteria.toArray(Criteria[]::new))).with(pageable);
        List<JobSummary> content = mongoTemplate.find(query, JobDocument.class).stream().map(this::toSummary).toList();
        long total = mongoTemplate.count(Query.of(query).limit(-1).skip(-1), JobDocument.class);
        return new PageImpl<>(content, pageable, total);
    }

    private JobDocument find(String id) {
        return jobs.findById(id).orElseThrow(() -> new ResourceNotFoundException("Job not found"));
    }

    private JobDocument toDocument(JobDocument job, String recruiterId, JobRequest request) {
        job.setRecruiterId(recruiterId);
        job.setCompanyName(request.companyName());
        job.setTitle(request.title());
        job.setDescription(request.description());
        job.setLocation(request.location());
        job.setEmploymentType(request.employmentType());
        job.setExperienceRequired(request.experienceRequired());
        job.setSalaryMin(request.salaryMin());
        job.setSalaryMax(request.salaryMax());
        job.setSkills(request.skills());
        job.setCategory(request.category());
        job.setStatus(request.status() == null ? JobStatus.OPEN : request.status());
        job.setApplicationDeadline(request.applicationDeadline());
        return job;
    }

    private JobSummary toSummary(JobDocument job) {
        return new JobSummary(job.getId(), job.getRecruiterId(), job.getCompanyName(), job.getTitle(), job.getDescription(), job.getLocation(),
                job.getEmploymentType(), job.getExperienceRequired(), job.getSalaryMin(), job.getSalaryMax(), job.getSkills(), job.getCategory(),
                job.getStatus(), job.getApplicationDeadline());
    }

    private void requireRecruiter(String role) {
        if (!"RECRUITER".equals(role) && !"ADMIN".equals(role)) throw new UnauthorizedException("Recruiter role required");
    }

    private void requireOwner(String authUserId, String role, JobDocument job) {
        if (!"ADMIN".equals(role) && !authUserId.equals(job.getRecruiterId())) throw new UnauthorizedException("Only the owning recruiter can change this job");
    }

    public boolean isOpen(JobSummary job) {
        return job.status() == JobStatus.OPEN && (job.applicationDeadline() == null || !job.applicationDeadline().isBefore(LocalDate.now()));
    }
}
