import { Stack } from "expo-router";
import React from "react";

export default function TakeTestLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "fade",
      }}
    />
  );
}
