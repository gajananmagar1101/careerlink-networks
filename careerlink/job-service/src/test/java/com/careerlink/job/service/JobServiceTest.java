package com.careerlink.job.service;

import com.careerlink.job.dto.JobRequest;
import com.careerlink.job.exception.UnauthorizedException;
import com.careerlink.job.model.*;
import com.careerlink.job.repository.JobRepository;
import org.junit.jupiter.api.Test;
import org.springframework.data.mongodb.core.MongoTemplate;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class JobServiceTest {
    private final JobRepository repo = mock(JobRepository.class);
    private final com.careerlink.job.repository.SavedJobRepository savedJobs = mock(com.careerlink.job.repository.SavedJobRepository.class);
    private final com.careerlink.job.client.ProfileClient profileClient = mock(com.careerlink.job.client.ProfileClient.class);
    private final JobService service = new JobService(repo, savedJobs, profileClient, mock(MongoTemplate.class));
    private final JobRequest request = new JobRequest("Java Backend Developer", "Looking for an experienced Spring Boot developer",
            "Pune", EmploymentType.FULL_TIME, 2, 500000, 900000, List.of("Java", "Spring Boot"), "Software", JobStatus.OPEN, LocalDate.now().plusDays(30), "CareerLink");

    @Test
    void candidateCannotCreateJobAndRecruiterCan() {
        assertThatThrownBy(() -> service.create("c1", "CANDIDATE", request)).isInstanceOf(UnauthorizedException.class);
        when(repo.save(any())).thenAnswer(invocation -> {
            JobDocument job = invocation.getArgument(0);
            job.setId("j1");
            return job;
        });
        assertThat(service.create("r1", "RECRUITER", request).id()).isEqualTo("j1");
    }

    @Test
    void recruiterCannotUpdateAnotherRecruitersJob() {
        JobDocument job = JobDocument.builder().id("j1").recruiterId("r2").build();
        when(repo.findById("j1")).thenReturn(Optional.of(job));
        assertThatThrownBy(() -> service.update("r1", "RECRUITER", "j1", request)).isInstanceOf(UnauthorizedException.class);
    }
}
