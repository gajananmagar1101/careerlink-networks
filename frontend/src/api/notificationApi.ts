import { apiClient, unwrap } from './apiClient';
import type { NotificationItem } from '../types/domain';

export const notificationApi = {
  list: () => unwrap<NotificationItem[]>(apiClient.get('/api/notifications')),
  unreadCount: () => unwrap<{ unreadCount: number }>(apiClient.get('/api/notifications/unread-count')),
  markAsRead: (id: string) => unwrap<NotificationItem>(apiClient.put(`/api/notifications/${id}/read`)),
  markAllAsRead: () => unwrap<void>(apiClient.put('/api/notifications/read-all'))
};
