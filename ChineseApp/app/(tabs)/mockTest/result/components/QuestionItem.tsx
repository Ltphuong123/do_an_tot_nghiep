import { CardCustom } from "@/components/shared/cardCustom";
import { DesignSystem } from "@/constants/designSystem";
import React from "react";
import { ScrollView } from "react-native";
import QuestionContent from "./QuestionContent";

interface QuestionItemProps {
  item: any;
  screenWidth: number;
  screenHeight: number;
  theme: string;
  onToggleAudio: (audioUrl?: string | null) => void;
  isPlaying: boolean;
  durationMs: number;
  positionMs: number;
  animatedProgress: any;
}

export default function QuestionItem({
  item,
  screenWidth,
  screenHeight,
  theme,
  onToggleAudio,
  isPlaying,
  durationMs,
  positionMs,
  animatedProgress,
}: QuestionItemProps) {
  return (
    <ScrollView
      style={{
        width: screenWidth,
        height: screenHeight - 100,
        padding: DesignSystem.spacing.md,
      }}
    >
      <CardCustom variant="card" padding="md">
        <QuestionContent
          question={item.question}
          theme={theme}
          onToggleAudio={onToggleAudio}
          isPlaying={isPlaying}
          durationMs={durationMs}
          positionMs={positionMs}
          animatedProgress={animatedProgress}
        />
      </CardCustom>
    </ScrollView>
  );
}
