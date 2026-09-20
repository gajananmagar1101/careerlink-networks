package com.careerlink.application.model;

import lombok.*;
import org.springframework.data.annotation.*;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
@Document("notifications")
public class NotificationDocument {
    @Id private String id;
    @Indexed private String userId;
    private NotificationType type;
    private String title;
    private String message;
    private String relatedEntityId;
    @Builder.Default private boolean read = false;
    @CreatedDate @Indexed private Instant createdAt;
}
