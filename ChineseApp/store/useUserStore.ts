import { getMe } from "@/services/profile";
import { IUser } from "@/types/user.type";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

interface UserState {
  user: IUser;
  banned: boolean;
  appealStatus: "none" | "pending" | "accepted" | "rejected";
  violationId: string | null;
  isLoading: boolean;
  setUser: (user: UserState["user"]) => Promise<void>;
  setBannedStatus: (
    banned: boolean,
    appealStatus: UserState["appealStatus"],
    violationId: string | null
  ) => Promise<void>;
  clearUser: () => Promise<void>;
  loadUserFromStorage: () => Promise<void>;
  fetchUser: () => Promise<void>;
}

const USER_STORAGE_KEY = "@user_data";

const defaultUser: IUser = {
  id: "",
  username: "",
  name: "",
  avatar_url: "",
  email: "",
  provider: "local",
  role: "user",
  level: "0",
  badge_level: 0,
  badge: {
    level: 0,
    name: "",
    icon: "",
    min_points: 0,
  },
  subscription: {
    id: null,
    name: null,
    description: null,
    start_date: null,
    expiry_date: null,
    auto_renew: null,
    daily_quota_ai_lesson: null,
    daily_quota_translate: null,
  },
  isVerify: false,
  is_active: false,
  created_at: "",
  language: "",
  last_login: null,
  community_points: 0,
  achievements: [],
  updated_at: "",
};

export const useUserStore = create<UserState>((set, get) => ({
  user: defaultUser,
  banned: false,
  appealStatus: "none",
  violationId: null,
  isLoading: false,

  setUser: async (user: UserState["user"]) => {
    try {
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      set({ user });
    } catch (error) {
      console.error("Error saving user to storage:", error);
      // Still update the store even if storage fails
      set({ user });
    }
  },

  setBannedStatus: async (
    banned: boolean,
    appealStatus: UserState["appealStatus"],
    violationId: string | null
  ) => {
    try {
      const data = { banned, appealStatus, violationId };
      await AsyncStorage.setItem("@banned_status", JSON.stringify(data));
      set({ banned, appealStatus, violationId });
    } catch (error) {
      console.error("Error saving banned status:", error);
      set({ banned, appealStatus, violationId });
    }
  },

  clearUser: async () => {
    try {
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
      await AsyncStorage.removeItem("@banned_status");
      set({
        user: defaultUser,
        banned: false,
        appealStatus: "none",
        violationId: null,
      });
    } catch (error) {
      console.error("Error clearing user from storage:", error);
      // Still clear the store even if storage fails
      set({
        user: defaultUser,
        banned: false,
        appealStatus: "none",
        violationId: null,
      });
    }
  },

  loadUserFromStorage: async () => {
    try {
      const userData = await AsyncStorage.getItem(USER_STORAGE_KEY);
      if (userData) {
        const parsedUser = JSON.parse(userData);
        set({ user: parsedUser });
      }
      const bannedData = await AsyncStorage.getItem("@banned_status");
      if (bannedData) {
        const parsedBanned = JSON.parse(bannedData);
        set({
          banned: parsedBanned.banned,
          appealStatus: parsedBanned.appealStatus,
          violationId: parsedBanned.violationId,
        });
      }
    } catch (error) {
      console.error("Error loading user from storage:", error);
      // Keep default user if loading fails
    }
  },

  fetchUser: async () => {
    try {
      set({ isLoading: true });
      // Import getMe dynamically to avoid circular dependencies
      const response = await getMe();
      if (response.data) {
        await get().setUser(response.data);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      // If fetch fails, try to load from storage as fallback
      await get().loadUserFromStorage();
    } finally {
      set({ isLoading: false });
    }
  },
}));
