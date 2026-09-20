package com.careerlink.job.client;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

@Component
public class ProfileClient {
    private static final Logger log = LoggerFactory.getLogger(ProfileClient.class);
    private final RestClient restClient;

    public ProfileClient(@Value("${profile.service.url:http://localhost:8082}") String profileUrl) {
        this.restClient = RestClient.builder().baseUrl(profileUrl).build();
    }

    public CandidateData getCandidate(String candidateId) {
        try {
            Map<?, ?> response = restClient.get()
                    .uri("/api/profiles/candidate/{id}", candidateId)
                    .header("X-User-Id", candidateId)
                    .header("X-User-Role", "CANDIDATE")
                    .retrieve()
                    .body(Map.class);

            if (response != null && response.get("data") instanceof Map<?, ?> data) {
                @SuppressWarnings("unchecked")
                List<String> skills = (List<String>) data.get("skills");
                String location = (String) data.get("location");
                int expCount = 0;
                if (data.get("experience") instanceof List<?> expList) {
                    expCount = expList.size(); // Approximate 1-2 years per role
                }
                return new CandidateData(skills != null ? skills : List.of(), location, expCount);
            }
        } catch (Exception e) {
            log.warn("Could not fetch candidate profile for {}: {}", candidateId, e.getMessage());
        }
        return new CandidateData(List.of(), null, 0);
    }

    public record CandidateData(List<String> skills, String location, int experienceCount) {}
}
