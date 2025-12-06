import { useCallback, useRef } from "react";

/**
 * Hook để xử lý double-tap trên tab icon để refresh
 * @param onRefresh - Callback khi double-tap được kích hoạt
 * @param timeout - Thời gian tối đa giữa 2 lần tap (ms)
 */
export const useTabRefresh = (onRefresh: () => void, timeout: number = 500) => {
  const lastTapRef = useRef<number>(0);
  const currentRouteRef = useRef<string>("");

  const handleTabPress = useCallback(
    (route: string) => {
      const now = Date.now();
      const timeSinceLastTap = now - lastTapRef.current;

      // Nếu đang ở cùng route và tap trong khoảng timeout
      if (currentRouteRef.current === route && timeSinceLastTap < timeout) {
        // Double tap detected - trigger refresh
        onRefresh();
        lastTapRef.current = 0; // Reset để tránh triple tap
      } else {
        // Single tap - update time
        lastTapRef.current = now;
      }

      currentRouteRef.current = route;
    },
    [onRefresh, timeout]
  );

  return handleTabPress;
};
