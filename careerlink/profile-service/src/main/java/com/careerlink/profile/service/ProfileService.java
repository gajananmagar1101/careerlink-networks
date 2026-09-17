package com.careerlink.profile.service;

import com.careerlink.profile.dto.*;
import com.careerlink.profile.exception.*;
import com.careerlink.profile.model.*;
import com.careerlink.profile.repository.*;
import org.springframework.stereotype.Service;

@Service
public class ProfileService {
    private final CandidateProfileRepository candidates;
    private final RecruiterProfileRepository recruiters;
    private final com.careerlink.profile.repository.UserRepository users;

    @org.springframework.beans.factory.annotation.Autowired
    public ProfileService(CandidateProfileRepository candidates, RecruiterProfileRepository recruiters, com.careerlink.profile.repository.UserRepository users) {
        this.candidates = candidates;
        this.recruiters = recruiters;
        this.users = users;
    }

    public ProfileService(CandidateProfileRepository candidates, RecruiterProfileRepository recruiters) {
        this(candidates, recruiters, null);
    }

    public CandidateProfile saveCandidate(String authUserId, String role, String userId, CandidateProfileRequest request) {
        requireOwner(authUserId, role, userId, "CANDIDATE");
        CandidateProfile profile = candidates.findByUserId(userId).orElseGet(CandidateProfile::new);
        profile.setUserId(userId);
        profile.setFullName(request.fullName());
        profile.setEmail(request.email());
        profile.setPhone(request.phone());
        profile.setLocation(request.location());
        profile.setHeadline(request.headline());
        profile.setSummary(request.summary());
        profile.setSkills(request.skills());
        profile.setEducation(request.education());
        profile.setExperience(request.experience());
        profile.setResumeUrl(request.resumeUrl());
        return candidates.save(profile);
    }

    public CandidateProfile getCandidate(String authUserId, String role, String userId) {
        if ("CANDIDATE".equals(role)) requireOwner(authUserId, role, userId, "CANDIDATE");
        return candidates.findByUserId(userId)
                .or(() -> {
                    if (users == null) return java.util.Optional.empty();
                    return users.findById(userId).map(user -> {
                        CandidateProfile profile = CandidateProfile.builder()
                                .userId(user.getId())
                                .fullName(user.getName())
                                .email(user.getEmail())
                                .headline("Job Seeker")
                                .summary("")
                                .skills(java.util.List.of())
                                .build();
                        return candidates.save(profile);
                    });
                })
                .orElseThrow(() -> new ResourceNotFoundException("Candidate profile not found"));
    }

    public RecruiterProfile saveRecruiter(String authUserId, String role, String userId, RecruiterProfileRequest request) {
        requireOwner(authUserId, role, userId, "RECRUITER");
        RecruiterProfile profile = recruiters.findByUserId(userId).orElseGet(RecruiterProfile::new);
        profile.setUserId(userId);
        profile.setCompanyName(request.companyName());
        profile.setCompanyDescription(request.companyDescription());
        profile.setWebsite(request.website());
        profile.setIndustry(request.industry());
        profile.setLocation(request.location());
        return recruiters.save(profile);
    }

    public RecruiterProfile getRecruiter(String authUserId, String role, String userId) {
        if ("RECRUITER".equals(role)) requireOwner(authUserId, role, userId, "RECRUITER");
        return recruiters.findByUserId(userId).orElseThrow(() -> new ResourceNotFoundException("Recruiter profile not found"));
    }

    private void requireOwner(String authUserId, String role, String requestedUserId, String expectedRole) {
        if (!expectedRole.equals(role) && !"ADMIN".equals(role)) throw new UnauthorizedException("Role is not allowed");
        if (!"ADMIN".equals(role) && !requestedUserId.equals(authUserId)) throw new UnauthorizedException("Cannot modify another user's profile");
    }
}
