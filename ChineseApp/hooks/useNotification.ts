import {
  getAllNotifications,
  getUnreadNotificationCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "@/services/notification";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const notificationKeys = {
  all: ["notifications"] as const,

  lists: () => [...notificationKeys.all, "list"] as const,
  list: (filters: { page?: number; limit?: number }) =>
    [...notificationKeys.lists(), filters] as const,

  unreadCount: () => [...notificationKeys.all, "unreadCount"] as const,

  details: () => [...notificationKeys.all, "detail"] as const,
  detail: (id: string) => [...notificationKeys.details(), id] as const,
};

export function useNotificationList(page: number = 1, limit: number = 20) {
  return useQuery({
    queryKey: notificationKeys.list({ page, limit }),
    queryFn: () => getAllNotifications(page, limit),
  });
}

export function useUnreadNotificationCount() {
  return useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: () => getUnreadNotificationCount(),
  });
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      await markNotificationAsRead(notificationId);
      return notificationId;
    },

    onMutate: async (id) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: notificationKeys.lists() }),
        queryClient.cancelQueries({
          queryKey: notificationKeys.unreadCount(),
        }),
      ]);

      // Snapshot unread count
      const prevUnread = queryClient.getQueryData<{
        success: boolean;
        data: { count: number };
      }>(notificationKeys.unreadCount());

      // Optimistic unread count --
      if (prevUnread?.data?.count !== undefined) {
        queryClient.setQueryData(notificationKeys.unreadCount(), {
          ...prevUnread,
          data: { count: Math.max(prevUnread.data.count - 1, 0) },
        });
      }

      return { prevUnread };
    },

    onSuccess: (id) => {
      // Update all lists (notifications list)
      const queries = queryClient.getQueriesData({
        queryKey: notificationKeys.lists(),
      });

      queries.forEach(([key, data]: any) => {
        if (!data?.data) return;

        const newList = data.data.map((item: any) =>
          item.id === id ? { ...item, isRead: true } : item
        );

        queryClient.setQueryData(key, { ...data, data: newList });
      });
    },

    onError: (_err, _id, ctx) => {
      // Rollback unread count
      if (ctx?.prevUnread) {
        queryClient.setQueryData(
          notificationKeys.unreadCount(),
          ctx.prevUnread
        );
      }
    },

    onSettled: () => {
      // Refetch đảm bảo sync server
      queryClient.invalidateQueries({
        queryKey: notificationKeys.unreadCount(),
      });
      queryClient.invalidateQueries({
        queryKey: notificationKeys.lists(),
      });
    },
  });
}

export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllNotificationsAsRead,

    onMutate: async () => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: notificationKeys.lists() }),
        queryClient.cancelQueries({
          queryKey: notificationKeys.unreadCount(),
        }),
      ]);

      // Optimistic unreadCount về 0
      const prevUnread = queryClient.getQueryData(
        notificationKeys.unreadCount()
      );
      queryClient.setQueryData(notificationKeys.unreadCount(), {
        success: true,
        data: { count: 0 },
      });

      return { prevUnread };
    },

    onSuccess: () => {
      // Update tất cả notifications trong list
      const queries = queryClient.getQueriesData({
        queryKey: notificationKeys.lists(),
      });

      queries.forEach(([key, data]: any) => {
        if (!data?.data) return;

        const newList = data.data.map((item: any) => ({
          ...item,
          isRead: true,
        }));

        queryClient.setQueryData(key, { ...data, data: newList });
      });
    },

    onError: (_err, _payload, ctx) => {
      if (ctx?.prevUnread) {
        queryClient.setQueryData(
          notificationKeys.unreadCount(),
          ctx.prevUnread
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: notificationKeys.unreadCount(),
      });
      queryClient.invalidateQueries({
        queryKey: notificationKeys.lists(),
      });
    },
  });
}
