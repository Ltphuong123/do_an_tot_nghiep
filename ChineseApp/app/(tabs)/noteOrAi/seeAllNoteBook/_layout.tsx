import { Colors } from "@/constants/theme";
import { useThemeContext } from "@/contexts/themeContext";
import { Stack } from "expo-router";

export default function SeeAllNoteBookLayout() {
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
          title: "Xem tất cả",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
