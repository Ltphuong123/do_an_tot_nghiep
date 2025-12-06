import { useUserStore } from "@/store/useUserStore";
import axios, { InternalAxiosRequestConfig } from "axios";
import Constants from "expo-constants";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";

declare module "axios" {
  export interface AxiosRequestConfig {
    requireAuth?: boolean;
    _retry?: boolean;
  }
  export interface InternalAxiosRequestConfig {
    requireAuth?: boolean;
    _retry?: boolean;
  }
}

// Lưu refreshToken trong SecureStore
export const setAccessToken = async (token: string | null) => {
  if (token) {
    await SecureStore.setItemAsync("accessToken", token);
  } else {
    await SecureStore.deleteItemAsync("accessToken");
  }
};

// Lấy accessToken từ SecureStore
const getAccessToken = async () => {
  return await SecureStore.getItemAsync("accessToken");
};

// Lưu refreshToken trong SecureStore
export const setRefreshToken = async (token: string | null) => {
  if (token) {
    await SecureStore.setItemAsync("refreshToken", token);
  } else {
    await SecureStore.deleteItemAsync("refreshToken");
  }
};

// Lấy refreshToken từ biến toàn cục
export const getRefreshToken = async () => {
  return await SecureStore.getItemAsync("refreshToken");
};

// Xoá cả 2 token khi logout
export const clearTokens = async () => {
  await SecureStore.deleteItemAsync("accessToken");
  await SecureStore.deleteItemAsync("refreshToken");
};

// Helper function để handle logout và redirect
let isLoggingOut = false;
const handleLogoutAndRedirect = async () => {
  if (isLoggingOut) return; // Prevent multiple logout calls
  isLoggingOut = true;

  try {
    // Cố gắng gọi API logout nếu còn refresh token
    const refreshToken = await getRefreshToken();
    if (refreshToken) {
      try {
        // Import logout function để gọi API
        const { logout } = await import("./auth");
        await logout(refreshToken);
      } catch {}
    }

    // Unregister device token for push notification
    try {
      const { unregisterDeviceToken } = await import(
        "@/utils/notificationHelper"
      );
      await unregisterDeviceToken();
    } catch {}

    // Clear tokens
    await clearTokens();

    // Clear user store
    const { clearUser } = useUserStore.getState();
    await clearUser();

    // Điều hướng về màn hình đăng nhập
    router.replace({ pathname: "/auth/login" });
  } catch {
    router.replace({ pathname: "/auth/login" });
  }
};

// Global function để check và handle token invalid
export const checkAndHandleTokenError = async (error: any) => {
  const message = error?.response?.data?.message || error?.message || "";
  const isTokenInvalid =
    message.includes("Token không hợp lệ") ||
    message.includes("Token invalid") ||
    message.includes("Unauthorized") ||
    message.includes("jwt expired") ||
    message.includes("jwt malformed");

  if (isTokenInvalid) {
    console.log("Detected token invalid error, logging out...");
    await handleLogoutAndRedirect();
    return true;
  }
  return false;
};

const baseURL =
  Constants.expoConfig?.extra?.API_URL ||
  "https://echinese-server-1.onrender.com/api";

const api = axios.create({
  baseURL: baseURL,
  // baseURL: "http://192.168.0.101:5000/api", //tạm thời lấy IP cục bộ
  timeout: 0,
});

// Refresh token handler now uses the same `api` instance so the baseURL is consistent
const refreshAccessToken = async () => {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) {
    // Nếu không có refresh token, clear user và chuyển về login
    await handleLogoutAndRedirect();
    return null;
  }

  try {
    // Use the api instance to ensure baseURL and other defaults are applied
    const res = await api.post(
      "/auth/refresh-token",
      { refreshToken },
      { requireAuth: false }
    );
    const newAccessToken = res.data.accessToken;

    // Cập nhật lại accessToken
    await setAccessToken(newAccessToken);

    return newAccessToken;
  } catch (error) {
    console.log("Refresh token failed", error);
    // Gọi logout và clear user khi refresh thất bại
    await handleLogoutAndRedirect();
    return null;
  }
};

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const accessToken = await getAccessToken();
    if (config.requireAuth && accessToken) {
      config.headers = config.headers || {};
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const backendMessage = error.response?.data?.message;
    const status = error.response?.status;

    console.log("API Error:", {
      status,
      message: backendMessage,
      url: originalRequest?.url,
      requireAuth: originalRequest?.requireAuth,
      retry: originalRequest?._retry,
    });

    // Kiểm tra các trường hợp token không hợp lệ
    const isTokenInvalid =
      status === 401 ||
      (backendMessage &&
        (backendMessage.includes("Token không hợp lệ") ||
          backendMessage.includes("Token invalid") ||
          backendMessage.includes("Unauthorized") ||
          backendMessage.includes("jwt expired") ||
          backendMessage.includes("jwt malformed")));

    if (
      isTokenInvalid &&
      !originalRequest._retry &&
      originalRequest.requireAuth
    ) {
      console.log("Attempting token refresh...");
      originalRequest._retry = true;
      const newAccessToken = await refreshAccessToken();
      if (newAccessToken) {
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } else {
        // Nếu refresh trả về null (thất bại), đã được handle trong refreshAccessToken
        return Promise.reject(error);
      }
    }

    // Nếu là token invalid nhưng không có requireAuth hoặc đã retry, vẫn logout
    if (isTokenInvalid && originalRequest._retry) {
      console.log("Token invalid after retry, logging out...");
      await handleLogoutAndRedirect();
      return Promise.reject(error);
    }

    let message = backendMessage || "Đã xảy ra lỗi!!. Vui lòng thử lại.";

    // Nếu BE không trả message, fallback
    if (!backendMessage) {
      if (status === 401) message = "Phiên đăng nhập đã hết hạn.";
      else if (status === 403) message = "Bạn không có quyền truy cập.";
      else if (status === 404) message = "Không tìm thấy tài nguyên.";
      else if (status === 500) message = "Lỗi máy chủ. Vui lòng thử lại sau.";
    }

    // Gắn message vào error để UI có thể hiển thị trực tiếp
    error.message = message;

    return Promise.reject(error);
  }
);

export default api;
