package com.careerlink.profile.service;

import com.careerlink.profile.dto.CandidateProfileRequest;
import com.careerlink.profile.exception.UnauthorizedException;
import com.careerlink.profile.repository.*;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

class ProfileServiceTest {
    private final CandidateProfileRepository candidates = mock(CandidateProfileRepository.class);
    private final RecruiterProfileRepository recruiters = mock(RecruiterProfileRepository.class);
    private final ProfileService service = new ProfileService(candidates, recruiters);

    @Test
    void candidateCannotModifyAnotherProfile() {
        CandidateProfileRequest request = new CandidateProfileRequest("A", "a@example.com", null, null, null, null, List.of("Java"), null, null, null);
        assertThatThrownBy(() -> service.saveCandidate("u1", "CANDIDATE", "u2", request))
                .isInstanceOf(UnauthorizedException.class);
    }

    @Test
    void recruiterCanReadCandidateProfile() {
        when(candidates.findByUserId("candidate1")).thenReturn(Optional.of(new com.careerlink.profile.model.CandidateProfile()));
        assertThat(service.getCandidate("rec1", "RECRUITER", "candidate1")).isNotNull();
    }

    @Test
    void recruiterCanReadCandidateProfileAutoCreatedFromUser() {
        com.careerlink.profile.repository.UserRepository usersMock = mock(com.careerlink.profile.repository.UserRepository.class);
        ProfileService serviceWithUsers = new ProfileService(candidates, recruiters, usersMock);
        when(candidates.findByUserId("c2")).thenReturn(Optional.empty());
        when(usersMock.findById("c2")).thenReturn(Optional.of(new com.careerlink.profile.model.UserDocument("c2", "Rahul Sharma", "rahul@example.com", "CANDIDATE")));
        when(candidates.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        com.careerlink.profile.model.CandidateProfile profile = serviceWithUsers.getCandidate("rec1", "RECRUITER", "c2");
        assertThat(profile.getFullName()).isEqualTo("Rahul Sharma");
        assertThat(profile.getEmail()).isEqualTo("rahul@example.com");
    }
}
