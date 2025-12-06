/**
 * Test Header Component
 * Hiển thị nút thoát, timer, và nút mở navigation
 */

import React from "react";
import { Pressable, View } from "react-native";
import { Icon } from "react-native-paper";
import TestTimer from "./TestTimer";

interface TestHeaderProps {
  textColor: string;
  timeRemaining: number;
  onTimeUp: () => void;
  isPaused: boolean;
  onExit: () => void;
  onOpenNavigation: () => void;
  sectionName?: string;
  sectionIndex?: number;
  totalSections?: number;
}

const TestHeader = React.memo(
  ({
    textColor,
    timeRemaining,
    onTimeUp,
    isPaused,
    onExit,
    onOpenNavigation,
    sectionName,
    sectionIndex,
    totalSections,
  }: TestHeaderProps) => {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingTop: 15,
          paddingBottom: 12,
        }}
      >
        <Pressable onPress={onExit} style={{ padding: 8 }}>
          <Icon source="close" size={24} color={textColor} />
        </Pressable>

        <TestTimer
          timeRemaining={timeRemaining}
          onTimeUp={onTimeUp}
          isPaused={isPaused}
          textColor={textColor}
          sectionName={sectionName}
          sectionIndex={sectionIndex}
          totalSections={totalSections}
        />

        <Pressable onPress={onOpenNavigation} style={{ padding: 8 }}>
          <Icon source="grid" size={24} color={textColor} />
        </Pressable>
      </View>
    );
  }
);

TestHeader.displayName = "TestHeader";

export default TestHeader;
