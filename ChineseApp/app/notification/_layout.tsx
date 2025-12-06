import { Colors } from "@/constants/theme";
import { useThemeContext } from "@/contexts/themeContext";
import { Stack } from "expo-router";

export default function NotificationLayout() {
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
          title: "Thông báo",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="notificationDetail"
        options={{
          title: "Chi tiết thông báo",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
