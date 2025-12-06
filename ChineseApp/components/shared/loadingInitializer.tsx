import { useLoadingContext } from "@/contexts/loadingContext";
import { useOfflineExamStore } from "@/store/useOfflineExamStore";
import { LoadingManager } from "@/utils/loading-manager";
import { initializeUserFromStorage } from "@/utils/user-storage";
import React, { useEffect } from "react";

export const LoadingInitializer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { startLoading, stopLoading } = useLoadingContext();
  const { loadOfflineExamsFromStorage } = useOfflineExamStore();

  useEffect(() => {
    // Đăng ký các hàm loading vào LoadingManager để sử dụng globally
    LoadingManager.register(startLoading, stopLoading);

    // Initialize app data
    const initializeApp = async () => {
      try {
        // Initialize user data từ storage
        await initializeUserFromStorage();

        // Load offline exams from storage
        await loadOfflineExamsFromStorage();
      } catch (error) {
        console.error("Error initializing app:", error);
      }
    };

    initializeApp();
  }, [startLoading, stopLoading, loadOfflineExamsFromStorage]);

  return <>{children}</>;
};
