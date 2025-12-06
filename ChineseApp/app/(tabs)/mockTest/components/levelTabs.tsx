import { DesignSystem, getTextColor } from "@/constants/designSystem";
import { useThemeContext } from "@/contexts/themeContext";
import { IExamLevel } from "@/types/mockTest.type";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { Text } from "react-native-paper";

interface LevelTabsProps {
  levels: IExamLevel[];
  selectedLevel: IExamLevel | undefined;
  onSelectLevel: (level: IExamLevel) => void;
}

export default function LevelTabs({
  levels,
  selectedLevel,
  onSelectLevel,
}: LevelTabsProps) {
  const { theme } = useThemeContext();
  const textColor = getTextColor(theme, "primary");
  const scrollViewRef = useRef<ScrollView>(null);
  const itemRefs = useRef<{ [key: string]: { x: number; width: number } }>({});
  const [scrollViewWidth, setScrollViewWidth] = useState(0);

  const scrollToCenter = useCallback(
    (level: string) => {
      const item = itemRefs.current[level];
      if (item && scrollViewWidth > 0) {
        const centerX = item.x + item.width / 2 - scrollViewWidth / 2;
        scrollViewRef.current?.scrollTo({
          x: Math.max(0, centerX),
          animated: true,
        });
      }
    },
    [scrollViewWidth]
  );

  useEffect(() => {
    if (
      selectedLevel &&
      itemRefs.current[selectedLevel.id] &&
      scrollViewWidth > 0
    ) {
      // Delay to ensure layout is ready
      const timer = setTimeout(() => {
        scrollToCenter(selectedLevel.id);
      }, 150);

      return () => clearTimeout(timer);
    }
  }, [selectedLevel, scrollViewWidth, scrollToCenter]);

  if (levels.length === 0) return null;

  return (
    <ScrollView
      ref={scrollViewRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      onLayout={(event) => {
        setScrollViewWidth(event.nativeEvent.layout.width);
      }}
      contentContainerStyle={{
        paddingHorizontal: DesignSystem.spacing.md,
        paddingVertical: DesignSystem.spacing.sm,
        gap: DesignSystem.spacing.sm,
      }}
    >
      <View style={{ flexDirection: "row", gap: DesignSystem.spacing.sm }}>
        {levels.map((level, index) => {
          const isActive = selectedLevel?.id === level.id;
          return (
            <Pressable
              key={level.id}
              onLayout={(event) => {
                const { x, width } = event.nativeEvent.layout;
                itemRefs.current[level.id] = { x, width };
              }}
              style={{
                paddingVertical: DesignSystem.spacing.sm,
                paddingHorizontal: DesignSystem.spacing.lg,
                borderRadius: DesignSystem.borderRadius.full,
                backgroundColor: isActive
                  ? "#4A90E2"
                  : theme === "light"
                  ? "rgba(62, 55, 55, 0.07)"
                  : "rgba(255, 255, 255, 0.1)",
              }}
              onPress={() => onSelectLevel(level)}
            >
              <Text
                style={{
                  fontSize: DesignSystem.typography.fontSize.sm,
                  fontWeight: DesignSystem.typography.fontWeight.semibold,
                  color: isActive ? "#FFFFFF" : textColor,
                }}
              >
                {level.name}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}
