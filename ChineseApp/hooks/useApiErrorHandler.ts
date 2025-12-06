import { checkAndHandleTokenError } from "@/services/index";
import { useCallback } from "react";

/**
 * Hook để handle API errors với automatic token invalid detection
 */
export const useApiErrorHandler = () => {
  const handleError = useCallback(async (error: any) => {
    // Thử handle token error trước
    const wasTokenError = await checkAndHandleTokenError(error);

    if (!wasTokenError) {
      // Nếu không phải token error, log error để debug
      console.error("API Error:", {
        message: error?.response?.data?.message || error?.message,
        status: error?.response?.status,
        url: error?.config?.url,
      });

      // Có thể thêm logic khác như show toast, snackbar, etc.
      // Ví dụ: showSnackbar(error.message);
    }

    return wasTokenError;
  }, []);

  return { handleError };
};
