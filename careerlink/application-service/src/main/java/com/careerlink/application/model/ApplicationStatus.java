package com.careerlink.application.model;

import java.util.*;

public enum ApplicationStatus {
    APPLIED,
    UNDER_REVIEW,
    SHORTLISTED,
    INTERVIEW_SCHEDULED,
    INTERVIEW_COMPLETED,
    OFFERED,
    HIRED,
    REJECTED,
    WITHDRAWN;

    /** Allowed transitions map: each status → set of statuses it can move to. */
    private static final Map<ApplicationStatus, Set<ApplicationStatus>> ALLOWED = new EnumMap<>(ApplicationStatus.class);

    static {
        ALLOWED.put(APPLIED,              EnumSet.of(UNDER_REVIEW, REJECTED, WITHDRAWN));
        ALLOWED.put(UNDER_REVIEW,         EnumSet.of(SHORTLISTED, REJECTED, WITHDRAWN));
        ALLOWED.put(SHORTLISTED,          EnumSet.of(INTERVIEW_SCHEDULED, REJECTED, WITHDRAWN));
        ALLOWED.put(INTERVIEW_SCHEDULED,  EnumSet.of(INTERVIEW_COMPLETED, REJECTED, WITHDRAWN));
        ALLOWED.put(INTERVIEW_COMPLETED,  EnumSet.of(OFFERED, REJECTED, WITHDRAWN));
        ALLOWED.put(OFFERED,              EnumSet.of(HIRED, REJECTED, WITHDRAWN));
        ALLOWED.put(HIRED,                EnumSet.noneOf(ApplicationStatus.class));
        ALLOWED.put(REJECTED,             EnumSet.noneOf(ApplicationStatus.class));
        ALLOWED.put(WITHDRAWN,            EnumSet.noneOf(ApplicationStatus.class));
    }

    public boolean canTransitionTo(ApplicationStatus target) {
        return ALLOWED.getOrDefault(this, EnumSet.noneOf(ApplicationStatus.class)).contains(target);
    }

    /** Statuses that only the candidate can set. */
    public static boolean isCandidateOnlyStatus(ApplicationStatus s) {
        return s == WITHDRAWN;
    }

    /** Statuses that only the recruiter can set (not candidate). */
    public static boolean isRecruiterStatus(ApplicationStatus s) {
        return s != WITHDRAWN;
    }
}
