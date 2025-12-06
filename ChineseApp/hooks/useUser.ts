import { useUserStore } from "@/store/useUserStore";
import { useCallback } from "react";

/**
 * Custom hook để sử dụng user store với các utility functions
 */
export const useUser = () => {
  const {
    user,
    banned,
    appealStatus,
    violationId,
    isLoading,
    setUser,
    setBannedStatus,
    clearUser,
    loadUserFromStorage,
    fetchUser,
  } = useUserStore();

  const updateUser = useCallback(
    async (userData: typeof user) => {
      await setUser(userData);
    },
    [setUser]
  );

  const logout = useCallback(async () => {
    await clearUser();
  }, [clearUser]);

  const refreshUserFromStorage = useCallback(async () => {
    await loadUserFromStorage();
  }, [loadUserFromStorage]);

  const refreshUserFromAPI = useCallback(async () => {
    await fetchUser();
  }, [fetchUser]);

  const isLoggedIn = user.id !== "";
  const hasActiveSubscription = user.subscription.id !== null;
  const isVerified = user.isVerify;

  return {
    user,
    banned,
    appealStatus,
    violationId,
    isLoading,
    updateUser,
    logout,
    refreshUserFromStorage,
    refreshUserFromAPI,
    isLoggedIn,
    hasActiveSubscription,
    isVerified,
  };
};
