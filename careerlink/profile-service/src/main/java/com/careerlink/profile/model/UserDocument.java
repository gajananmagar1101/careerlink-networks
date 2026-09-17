package com.careerlink.profile.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

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
    private String email;
    private String role;
}
