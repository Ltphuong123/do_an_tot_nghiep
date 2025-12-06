import { Colors } from "@/constants/theme";
import { useThemeContext } from "@/contexts/themeContext";
import { Stack } from "expo-router";

export default function CommunityLayout() {
  const { theme } = useThemeContext();
  return (
    <Stack
      screenOptions={{
        contentStyle: {
          backgroundColor: Colors[theme].background,
        },
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Cộng đồng",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="leaderboard"
        options={{
          title: "Bảng xếp hạng",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="myProfileScreen"
        options={{
          title: "Quản lý bài đăng",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="createPost"
        options={{
          title: "Tạo bài viết",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
