import { Colors } from "@/constants/theme";
import { useThemeContext } from "@/contexts/themeContext";

import { Stack } from "expo-router";

function HomeLayout() {
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
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="profile"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="setting"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="subscriptions/index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="subscriptions/subscriptonHistory"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="subscriptions/paymentHistory"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="subscriptions/refundHistory"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="profile/violationsHistory"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="profile/appealsHistory"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}

export default HomeLayout;
