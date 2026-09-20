package com.careerlink.job.dto;

import java.util.List;

public record JobMatchResponse(
        int score,
        List<String> matchedSkills,
        List<String> missingSkills,
        boolean experienceMatch,
        boolean locationMatch,
        String explanation
) {}
