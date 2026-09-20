package com.careerlink.application.service;

import com.careerlink.application.model.NotificationDocument;
import com.careerlink.application.model.NotificationType;
import com.careerlink.application.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {
    private final NotificationRepository notificationRepository;

    public NotificationDocument createNotification(String userId, NotificationType type, String title, String message, String relatedEntityId) {
        NotificationDocument doc = NotificationDocument.builder()
                .userId(userId)
                .type(type)
                .title(title)
                .message(message)
                .relatedEntityId(relatedEntityId)
                .read(false)
                .createdAt(Instant.now())
                .build();
        NotificationDocument saved = notificationRepository.save(doc);
        log.info("Created notification for user {}: {}", userId, title);
        return saved;
    }

    public List<NotificationDocument> getUserNotifications(String userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public long getUnreadCount(String userId) {
        return notificationRepository.countByUserIdAndReadFalse(userId);
    }

    public NotificationDocument markAsRead(String id, String userId) {
        NotificationDocument doc = notificationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Notification not found"));
        if (!doc.getUserId().equals(userId)) {
            throw new IllegalArgumentException("Cannot update another user's notification");
        }
        doc.setRead(true);
        return notificationRepository.save(doc);
    }

    public void markAllAsRead(String userId) {
        List<NotificationDocument> unread = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        unread.stream()
                .filter(n -> !n.isRead())
                .forEach(n -> {
                    n.setRead(true);
                    notificationRepository.save(n);
                });
    }
}
