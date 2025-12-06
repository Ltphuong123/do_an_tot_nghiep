import { clearTokens } from "@/services";
import { getAppealsByViolation, getviolations } from "@/services/report";
import { useUserStore } from "@/store/useUserStore";
import { initializeUserFromStorage } from "@/utils/user-storage";
import { Redirect, useFocusEffect } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const [route, setRoute] = useState<string | null>(null);
  const { setBannedStatus, clearUser } = useUserStore();

  useFocusEffect(() => {
    console.log("Index screen focused");
  });

  const checkBanStatus = useCallback(async (): Promise<string> => {
    try {
      const violationsRes = await getviolations();
      const violations = violationsRes.data;

      // Find the most recent user ban violation
      const latestUserBan = violations
        .filter(
          (v) => v.target_type === "user" && v.resolution === "Cấm tài khoản"
        )
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )[0];

      if (!latestUserBan) {
        return "/(tabs)/home";
      }

      // Check appeals for the ban
      const appealsRes = await getAppealsByViolation(latestUserBan.id);
      const appeals = appealsRes.data.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      if (appeals.length === 0) {
        setBannedStatus(true, "none", latestUserBan.id);
        return "/home/profile";
      }

      const latestAppeal = appeals[0];

      switch (latestAppeal.status) {
        case "accepted":
          return "/(tabs)/home";
        case "pending":
          setBannedStatus(true, "pending", latestUserBan.id);
          return "/home/profile";
        case "rejected":
          await clearTokens();
          await clearUser();
          return "/auth/login";
        default:
          return "/(tabs)/home";
      }
    } catch (error) {
      console.error("Error checking ban status:", error);
      return "/(tabs)/home";
    }
  }, [setBannedStatus, clearUser]);

  useEffect(() => {
    const checkRoute = async () => {
      try {
        // Kiểm tra access token trực tiếp từ SecureStore
        const accessToken = await SecureStore.getItemAsync("accessToken");
        const hasEverLoggedIn = await SecureStore.getItemAsync(
          "hasEverLoggedIn"
        );
        console.log("Access Token:");

        if (accessToken) {
          // Có token -> load user data và kiểm tra ban status
          await initializeUserFromStorage();
          const banRoute = await checkBanStatus();
          setRoute(banRoute);
        } else if (hasEverLoggedIn === "true") {
          setRoute("/auth/login");
        } else {
          setRoute("/intro");
        }
      } catch (error) {
        console.error("Error checking route:", error);
        setRoute("/intro");
      }
    };

    checkRoute();
  }, [checkBanStatus]);

  if (!route) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Redirect href={route as any} />;
}
