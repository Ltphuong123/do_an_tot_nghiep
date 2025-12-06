import { useUserStore } from "@/store/useUserStore";

/**
 * Initialize user data by loading from storage
 * Call this function when app starts up
 */
export const initializeUserFromStorage = async () => {
  const { loadUserFromStorage } = useUserStore.getState();
  await loadUserFromStorage();
};

/**
 * Get current user state
 */
export const getCurrentUser = () => {
  const { user } = useUserStore.getState();
  return user;
};

/**
 * Check if user is logged in
 */
export const isUserLoggedIn = () => {
  const user = getCurrentUser();
  return user.id !== "";
};
