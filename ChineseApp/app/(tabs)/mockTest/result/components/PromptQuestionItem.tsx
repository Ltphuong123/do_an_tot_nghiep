import { CardCustom } from "@/components/shared/cardCustom";
import { DesignSystem } from "@/constants/designSystem";
import React from "react";
import { ScrollView, View } from "react-native";
import PromptDisplay from "../../takeTest/components/PromptDisplay";
import QuestionContent from "./QuestionContent";

interface PromptQuestionItemProps {
  item: any;
  colors: any;
  promptAudioStatus: any;
  promptAnimatedProgress: any;
  screenWidth: number;
  screenHeight: number;
  theme: string;
  onToggleAudio: (audioUrl?: string | null) => void;
  isPlaying: boolean;
  durationMs: number;
  positionMs: number;
  animatedProgress: any;
}

export default function PromptQuestionItem({
  item,
  colors,
  promptAudioStatus,
  promptAnimatedProgress,
  screenWidth,
  screenHeight,
  theme,
  onToggleAudio,
  isPlaying,
  durationMs,
  positionMs,
  animatedProgress,
}: PromptQuestionItemProps) {
  return (
    <ScrollView
      style={{
        width: screenWidth,
        height: screenHeight - 100,
        padding: DesignSystem.spacing.md,
      }}
    >
      {/* Prompt Display */}
      <View style={{ marginBottom: DesignSystem.spacing.lg }}>
        <PromptDisplay
          prompt={item.prompt}
          colors={colors}
          autoPlayStatus={promptAudioStatus}
          autoPlayProgress={promptAnimatedProgress}
        />
      </View>

      {/* Question */}
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
