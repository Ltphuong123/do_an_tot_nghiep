import { DesignSystem } from "@/constants/designSystem";
import React from "react";
import { ScrollView } from "react-native";
import PromptDisplay from "../../takeTest/components/PromptDisplay";

interface PromptItemProps {
  item: any;
  colors: any;
  promptAudioStatus: any;
  promptAnimatedProgress: any;
  screenWidth: number;
  screenHeight: number;
}

export default function PromptItem({
  item,
  colors,
  promptAudioStatus,
  promptAnimatedProgress,
  screenWidth,
  screenHeight,
}: PromptItemProps) {
  return (
    <ScrollView
      style={{
        width: screenWidth,
        height: screenHeight - 100,
        padding: DesignSystem.spacing.md,
      }}
    >
      <PromptDisplay
        prompt={item.prompt}
        colors={colors}
        autoPlayStatus={promptAudioStatus}
        autoPlayProgress={promptAnimatedProgress}
      />
    </ScrollView>
  );
}
