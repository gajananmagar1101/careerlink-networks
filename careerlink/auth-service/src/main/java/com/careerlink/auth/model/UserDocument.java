package com.careerlink.auth.model;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document("users")
public class UserDocument {
    @Id
    private String id;
    private String name;
    @Indexed(unique = true)
    private String email;
    private String passwordHash;
    private Role role;
    @Indexed(sparse = true)
    private String googleSub;
    private String pictureUrl;
    @CreatedDate
    private Instant createdAt;
    @LastModifiedDate
    private Instant updatedAt;
}
