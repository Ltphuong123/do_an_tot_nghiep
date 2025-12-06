import {
  getAllNotifications,
  getUnreadNotificationCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "@/services/notification";
import { INotification } from "@/types/notification.type";
import React, { createContext, useCallback, useContext, useState } from "react";

interface NotificationContextType {
  notifications: INotification[];
  unreadCount: number;
  loading: boolean;
  refreshing: boolean;
  loadingMore: boolean;
  hasMore: boolean;

  fetchNotifications: (page?: number, limit?: number) => Promise<void>;

  fetchUnreadCount: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<any>;
  markAllAsRead: () => Promise<{ success: boolean; message: string }>;
  refresh: () => Promise<void>;
  loadMore: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchNotifications = useCallback(
    async (page: number = 1, limit: number = 15) => {
      try {
        if (page === 1) {
          setLoading(true);
        } else {
          setLoadingMore(true);
        }
        const response = await getAllNotifications(page, limit);
        if (response.success) {
          if (page === 1) {
            setNotifications(response.data);
          } else {
            setNotifications((prev) => [...prev, ...response.data]);
          }
          setHasMore(response.data.length === limit);
          if (page === 1) {
            const unreadCount = response.data.filter((n) => !n.read_at).length;
            setUnreadCount(unreadCount);
          }
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
        setRefreshing(false);
        setLoadingMore(false);
      }
    },
    []
  );

  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await getUnreadNotificationCount();
      if (response.success) {
        setUnreadCount(response.data.count);
      }
    } catch (error) {}
  }, []);

  const markAsRead = useCallback(
    async (notificationId: string) => {
      try {
        // Update local state immediately for better UX
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notificationId
              ? { ...n, read_at: new Date().toISOString() }
              : n
          )
        );

        // Update unread count
        setUnreadCount((prev) => Math.max(0, prev - 1));

        // Call API
        const res = await markNotificationAsRead(notificationId);
        console.log("Mark as read response:", res);
        return res;
      } catch (error) {
        console.error("Error marking notification as read:", error);
        // Revert the state if API call fails
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notificationId ? { ...n, read_at: null } : n
          )
        );
        // Revert unread count
        await fetchUnreadCount();
        throw error;
      }
    },
    [fetchUnreadCount]
  );

  const markAllAsRead = useCallback(async () => {
    try {
      const unreadNotifications = notifications.filter((n) => !n.read_at);
      if (unreadNotifications.length === 0) {
        return { success: false, message: "Tất cả thông báo đã được đọc" };
      }

      const now = new Date().toISOString();

      // Update local state immediately
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read_at: n.read_at || now }))
      );
      setUnreadCount(0);

      // Call API
      await markAllNotificationsAsRead();

      return {
        success: true,
        message: `Đã đánh dấu ${unreadNotifications.length} thông báo là đã đọc`,
      };
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      // Revert state on error
      await fetchNotifications();
      return {
        success: false,
        message: "Có lỗi xảy ra khi đánh dấu thông báo",
      };
    }
  }, [notifications, fetchNotifications]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    setCurrentPage(1);
    setHasMore(true);
    await fetchNotifications(1, 15);
  }, [fetchNotifications]);

  const loadMore = useCallback(async () => {
    if (hasMore && !loadingMore) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      await fetchNotifications(nextPage, 15);
    }
  }, [hasMore, loadingMore, currentPage, fetchNotifications]);

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    loading,
    refreshing,
    loadingMore,
    hasMore,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    refresh,
    loadMore,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};
