package com.careerlink.job.service;

import com.careerlink.job.client.ProfileClient;
import com.careerlink.job.dto.*;
import com.careerlink.job.exception.*;
import com.careerlink.job.model.*;
import com.careerlink.job.repository.JobRepository;
import com.careerlink.job.repository.SavedJobRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.*;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.*;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Slf4j
@Service
public class JobService {
    private final JobRepository jobs;
    private final SavedJobRepository savedJobs;
    private final ProfileClient profileClient;
    private final MongoTemplate mongoTemplate;

    public JobService(JobRepository jobs, SavedJobRepository savedJobs,
                      ProfileClient profileClient, MongoTemplate mongoTemplate) {
        this.jobs = jobs;
        this.savedJobs = savedJobs;
        this.profileClient = profileClient;
        this.mongoTemplate = mongoTemplate;
    }

    public JobSummary create(String recruiterId, String role, JobRequest request) {
        requireRecruiter(role);
        JobDocument saved = jobs.save(toDocument(new JobDocument(), recruiterId, request));
        log.info("Recruiter {} created job {}", recruiterId, saved.getId());
        return toSummary(saved);
    }

    public Page<JobSummary> list(Pageable pageable) {
        return search(null, null, null, null, pageable);
    }

    public JobSummary get(String id) {
        return toSummary(find(id));
    }

    public Page<JobSummary> byRecruiter(String authUserId, String role, String recruiterId, Pageable pageable) {
        requireRecruiter(role);
        if (!authUserId.equals(recruiterId) && !"ADMIN".equals(role)) {
            throw new UnauthorizedException("Cannot view another recruiter's jobs");
        }
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
        criteria.add(new Criteria().orOperator(
                Criteria.where("applicationDeadline").is(null),
                Criteria.where("applicationDeadline").gte(LocalDate.now())
        ));
        if (keyword != null && !keyword.isBlank()) {
            Pattern pattern = Pattern.compile(Pattern.quote(keyword), Pattern.CASE_INSENSITIVE);
            criteria.add(new Criteria().orOperator(Criteria.where("title").regex(pattern), Criteria.where("description").regex(pattern), Criteria.where("skills").regex(pattern)));
        }
        if (location != null && !location.isBlank()) {
            criteria.add(Criteria.where("location").regex(Pattern.compile(Pattern.quote(location), Pattern.CASE_INSENSITIVE)));
        }
        if (category != null && !category.isBlank()) {
            criteria.add(Criteria.where("category").is(category));
        }
        if (employmentType != null) {
            criteria.add(Criteria.where("employmentType").is(employmentType));
        }
        Query query = new Query(new Criteria().andOperator(criteria.toArray(Criteria[]::new))).with(pageable);
        List<JobSummary> content = mongoTemplate.find(query, JobDocument.class).stream().map(this::toSummary).toList();
        long total = mongoTemplate.count(Query.of(query).limit(-1).skip(-1), JobDocument.class);
        return new PageImpl<>(content, pageable, total);
    }

    // --- Saved Jobs ---
    public void saveJob(String candidateId, String jobId) {
        find(jobId); // Ensure job exists
        if (!savedJobs.existsByCandidateIdAndJobId(candidateId, jobId)) {
            SavedJobDocument doc = SavedJobDocument.builder()
                    .candidateId(candidateId)
                    .jobId(jobId)
                    .savedAt(Instant.now())
                    .build();
            savedJobs.save(doc);
            log.info("Candidate {} saved job {}", candidateId, jobId);
        }
    }

    public void unsaveJob(String candidateId, String jobId) {
        savedJobs.deleteByCandidateIdAndJobId(candidateId, jobId);
        log.info("Candidate {} unsaved job {}", candidateId, jobId);
    }

    public Page<JobSummary> getSavedJobs(String candidateId, Pageable pageable) {
        List<SavedJobDocument> allSaved = savedJobs.findByCandidateIdOrderBySavedAtDesc(candidateId);
        List<String> jobIds = allSaved.stream().map(SavedJobDocument::getJobId).toList();
        if (jobIds.isEmpty()) {
            return Page.empty(pageable);
        }

        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), jobIds.size());
        if (start > jobIds.size()) {
            return Page.empty(pageable);
        }

        List<String> pagedIds = jobIds.subList(start, end);
        List<JobSummary> jobSummaries = new ArrayList<>();
        for (String id : pagedIds) {
            jobs.findById(id).ifPresent(j -> jobSummaries.add(toSummary(j)));
        }
        return new PageImpl<>(jobSummaries, pageable, jobIds.size());
    }

    public List<String> getSavedJobIds(String candidateId) {
        return savedJobs.findByCandidateIdOrderBySavedAtDesc(candidateId)
                .stream()
                .map(SavedJobDocument::getJobId)
                .toList();
    }

    // --- Match Score Calculation ---
    public JobMatchResponse calculateMatchScore(String candidateId, String jobId) {
        JobDocument job = find(jobId);
        ProfileClient.CandidateData candidate = profileClient.getCandidate(candidateId);

        List<String> jobSkills = job.getSkills() != null ? job.getSkills() : List.of();
        List<String> candidateSkills = candidate.skills() != null ? candidate.skills() : List.of();

        Set<String> candidateSkillSet = candidateSkills.stream()
                .map(String::toLowerCase)
                .map(String::trim)
                .collect(Collectors.toSet());

        List<String> matched = new ArrayList<>();
        List<String> missing = new ArrayList<>();

        for (String skill : jobSkills) {
            if (candidateSkillSet.contains(skill.toLowerCase().trim())) {
                matched.add(skill);
            } else {
                missing.add(skill);
            }
        }

        int skillScore = 100;
        if (!jobSkills.isEmpty()) {
            skillScore = (int) Math.round(((double) matched.size() / jobSkills.size()) * 70.0);
        } else {
            skillScore = 70;
        }

        boolean expMatch = candidate.experienceCount() >= job.getExperienceRequired();
        int expScore = expMatch ? 20 : Math.max(0, 20 - (job.getExperienceRequired() - candidate.experienceCount()) * 5);

        boolean locMatch = false;
        if (job.getLocation() != null && candidate.location() != null) {
            locMatch = job.getLocation().equalsIgnoreCase("remote") ||
                       job.getLocation().toLowerCase().contains(candidate.location().toLowerCase()) ||
                       candidate.location().toLowerCase().contains(job.getLocation().toLowerCase());
        } else if ("remote".equalsIgnoreCase(job.getLocation())) {
            locMatch = true;
        }
        int locScore = locMatch ? 10 : 5;

        int totalScore = Math.min(100, Math.max(0, skillScore + expScore + locScore));

        String explanation;
        if (totalScore >= 80) {
            explanation = "Excellent Match! Your skills and background closely align with this role's requirements.";
        } else if (totalScore >= 60) {
            explanation = "Good Match! You have several key skills for this position.";
        } else {
            explanation = "Moderate Match. Consider tailoring your profile or highlighting relevant project experience.";
        }

        return new JobMatchResponse(totalScore, matched, missing, expMatch, locMatch, explanation);
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
                job.getStatus(), job.getApplicationDeadline(), job.getCreatedAt(), job.getUpdatedAt());
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
