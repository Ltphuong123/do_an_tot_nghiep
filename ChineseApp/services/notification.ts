import { DataSuccess, IMeta } from "@/types/common.type";
import { INotification } from "@/types/notification.type";
import axios from "./index";

export const getAllNotifications = async (
  page?: number,
  limit?: number
): Promise<{
  success: boolean;
  data: INotification[];
  meta: IMeta;
}> => {
  const res = await axios.get("/notifications", {
    requireAuth: true,
    params: {
      page,
      limit,
    },
  });
  console.log("Fetched notifications:", res.data);
  return res.data;
};

export const getUnreadNotificationCount = async (): Promise<{
  success: boolean;
  data: { count: number };
}> => {
  const res = await axios.get("/notifications/unread-count", {
    requireAuth: true,
  });
  return res.data;
};

export const markNotificationAsRead = async (
  notificationId: string | string[]
) => {
  const res = await axios.post(
    `/notifications/mark-read`,
    {
      ids: [notificationId],
      asRead: true,
    },
    {
      requireAuth: true,
    }
  );
  return res;
};

export const markAllNotificationsAsRead = async (): Promise<
  DataSuccess<null>
> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    status: "success",
    message: "All notifications marked as read successfully",
    code: 200,
    data: null,
  };
};
