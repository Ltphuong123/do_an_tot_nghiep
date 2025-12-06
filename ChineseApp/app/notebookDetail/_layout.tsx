import { Colors } from "@/constants/theme";
import { useThemeContext } from "@/contexts/themeContext";
import { Stack } from "expo-router";

export default function NoteBookDetailLayout() {
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
        name="[id]"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="vocab"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="createVocab"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="revision"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="wordFill"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="flashcard"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="pronunciation"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="status"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
