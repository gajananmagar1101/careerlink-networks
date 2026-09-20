package com.careerlink.application.service;

import com.careerlink.application.client.*;
import com.careerlink.application.dto.ApplicationRequest;
import com.careerlink.application.exception.*;
import com.careerlink.application.model.ApplicationDocument;
import com.careerlink.application.repository.ApplicationRepository;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class ApplicationServiceTest {
    private final ApplicationRepository repo = mock(ApplicationRepository.class);
    private final JobClient jobs = mock(JobClient.class);
    private final ProfileClient profiles = mock(ProfileClient.class);
    private final NotificationService notifications = mock(NotificationService.class);
    private final ApplicationService service = new ApplicationService(repo, jobs, profiles, notifications);

    @Test
    void candidateCanApplyToOpenJobOnlyOnce() {
        when(jobs.getJob("j1")).thenReturn(new RemoteApiResponse<>(true, "ok", new JobDto("j1", "r1", "OPEN", LocalDate.now().plusDays(7), "SWE", "Acme")));
        when(repo.existsByJobIdAndCandidateId("j1", "c1")).thenReturn(false);
        when(repo.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        assertThat(service.apply("c1", "CANDIDATE", new ApplicationRequest("j1", "resume.pdf", "Interested")).getStatus().name()).isEqualTo("APPLIED");

        when(repo.existsByJobIdAndCandidateId("j1", "c1")).thenReturn(true);
        assertThatThrownBy(() -> service.apply("c1", "CANDIDATE", new ApplicationRequest("j1", null, null)))
                .isInstanceOf(DuplicateApplicationException.class);
    }

    @Test
    void candidateCannotApplyToClosedJob() {
        when(jobs.getJob("j1")).thenReturn(new RemoteApiResponse<>(true, "ok", new JobDto("j1", "r1", "CLOSED", LocalDate.now().plusDays(7), "SWE", "Acme")));
        assertThatThrownBy(() -> service.apply("c1", "CANDIDATE", new ApplicationRequest("j1", null, null))).isInstanceOf(JobClosedException.class);
    }

    @Test
    void candidateCannotViewAnotherCandidatesApplication() {
        ApplicationDocument app = ApplicationDocument.builder().id("a1").candidateId("c2").jobId("j1").build();
        when(repo.findById("a1")).thenReturn(Optional.of(app));
        assertThatThrownBy(() -> service.get("c1", "CANDIDATE", "a1")).isInstanceOf(UnauthorizedException.class);
    }

    @Test
    void recruiterCannotViewAnotherRecruitersJobApplications() {
        when(jobs.getJob("j1")).thenReturn(new RemoteApiResponse<>(true, "ok", new JobDto("j1", "r2", "OPEN", null, "SWE", "Acme")));
        assertThatThrownBy(() -> service.byJob("r1", "RECRUITER", "j1")).isInstanceOf(UnauthorizedException.class);
    }
}
