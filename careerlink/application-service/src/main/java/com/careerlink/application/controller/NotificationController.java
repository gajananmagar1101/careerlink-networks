package com.careerlink.application.controller;

import com.careerlink.application.dto.ApiResponse;
import com.careerlink.application.model.NotificationDocument;
import com.careerlink.application.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {
    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<NotificationDocument>>> getNotifications(
            @RequestHeader(name = "X-User-Id") String userId) {
        return ResponseEntity.ok(ApiResponse.success(notificationService.getUserNotifications(userId)));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getUnreadCount(
            @RequestHeader(name = "X-User-Id") String userId) {
        return ResponseEntity.ok(ApiResponse.success(Map.of("unreadCount", notificationService.getUnreadCount(userId))));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<ApiResponse<NotificationDocument>> markRead(
            @PathVariable String id,
            @RequestHeader(name = "X-User-Id") String userId) {
        return ResponseEntity.ok(ApiResponse.success(notificationService.markAsRead(id, userId)));
    }

    @PutMapping("/read-all")
    public ResponseEntity<ApiResponse<Void>> markAllRead(
            @RequestHeader(name = "X-User-Id") String userId) {
        notificationService.markAllAsRead(userId);
        return ResponseEntity.ok(ApiResponse.success(null));
    }
}
