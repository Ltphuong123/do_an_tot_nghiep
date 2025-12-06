import { getSolidColor } from "@/constants/designSystem";
import { useThemeContext } from "@/contexts/themeContext";

import React, { ReactNode } from "react";
import { FlatList, ScrollView, View, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ContainerCustomProps {
  children: ReactNode;
  variant?: "background" | "primary" | "secondary";
  style?: ViewStyle;
  scrollable?: boolean;
}

export const ContainerCustom: React.FC<ContainerCustomProps> = ({
  children,
  variant = "background",
  style,
  scrollable = false,
}) => {
  const { theme } = useThemeContext();

  const backgroundColor = getSolidColor(theme, variant);

  // Check if children is a FlatList to avoid nesting ScrollView
  const isFlatList =
    React.isValidElement(children) && children.type === FlatList;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor, width: "100%" }}>
      <View style={[{ flex: 1, width: "100%" }, style]}>
        {scrollable && !isFlatList ? (
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
            }}
            showsVerticalScrollIndicator={false}
            style={{ flex: 1, width: "100%" }}
          >
            {children}
          </ScrollView>
        ) : (
          children
        )}
      </View>
    </SafeAreaView>
  );
};
