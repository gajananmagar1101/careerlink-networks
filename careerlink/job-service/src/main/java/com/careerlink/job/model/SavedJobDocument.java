package com.careerlink.job.model;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document("saved_jobs")
@CompoundIndex(name = "candidate_job_idx", def = "{'candidateId': 1, 'jobId': 1}", unique = true)
public class SavedJobDocument {
    @Id
    private String id;
    @Indexed
    private String candidateId;
    @Indexed
    private String jobId;
    @CreatedDate
    private Instant savedAt;
}
