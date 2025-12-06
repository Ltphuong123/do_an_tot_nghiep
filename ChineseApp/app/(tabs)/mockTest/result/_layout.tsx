import { AnimationConfig } from "@/constants/animation";
import { Colors } from "@/constants/theme";
import { useThemeContext } from "@/contexts/themeContext";
import { Stack } from "expo-router";

function ResultLayout() {
  const { theme } = useThemeContext();
  return (
    <Stack
      screenOptions={{
        ...AnimationConfig.stack.slideFromRight,
        contentStyle: {
          backgroundColor: Colors[theme].background,
        },
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}

export default ResultLayout;
