import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notificationApi } from '../api/notificationApi';
import type { NotificationItem } from '../types/domain';

export function useNotifications(enabled = true) {
  return useQuery<NotificationItem[]>({
    queryKey: ['notifications'],
    queryFn: () => notificationApi.list(),
    enabled,
    refetchInterval: 30000 // Poll every 30s
  });
}

export function useUnreadNotificationCount(enabled = true) {
  return useQuery<number>({
    queryKey: ['unread-notifications-count'],
    queryFn: async () => {
      const res = await notificationApi.unreadCount();
      return res.unreadCount;
    },
    enabled,
    refetchInterval: 15000 // Poll every 15s
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  const markOne = useMutation({
    mutationFn: (id: string) => notificationApi.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unread-notifications-count'] });
    }
  });

  const markAll = useMutation({
    mutationFn: () => notificationApi.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unread-notifications-count'] });
    }
  });

  return {
    markAsRead: markOne.mutateAsync,
    markAllAsRead: markAll.mutateAsync,
    isPending: markOne.isPending || markAll.isPending
  };
}
