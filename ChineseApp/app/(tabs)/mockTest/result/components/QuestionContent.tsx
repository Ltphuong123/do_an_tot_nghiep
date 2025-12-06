import AudioButton from "@/components/shared/audioButton";
import HtmlRenderer from "@/components/shared/htmlRenderer";
import { AutoImage } from "@/components/shared/imageCustomer";
import { DesignSystem, getTextColor } from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import React from "react";
import { ScrollView, View } from "react-native";
import { Text } from "react-native-paper";
import QuestionOptions from "./QuestionOptions";

interface QuestionContentProps {
  question: any;
  theme: string;
  onToggleAudio: (audioUrl?: string | null) => void;
  isPlaying: boolean;
  durationMs: number;
  positionMs: number;
  animatedProgress: any;
}

export default function QuestionContent({
  question,
  theme,
  onToggleAudio,
  isPlaying,
  durationMs,
  positionMs,
  animatedProgress,
}: QuestionContentProps) {
  const { t } = useLanguageContext();
  const isLocalAsset = (v: any) => typeof v === "number";

  return (
    <ScrollView>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: DesignSystem.spacing.md,
        }}
      >
        <Text
          style={{
            fontSize: DesignSystem.typography.fontSize.lg,
            fontWeight: DesignSystem.typography.fontWeight.bold,
            color: getTextColor(theme as "light" | "dark", "primary"),
          }}
        >
          {t("question")} {question.order + 1}
        </Text>
        <Text
          style={{
            fontSize: DesignSystem.typography.fontSize.sm,
            color: getTextColor(theme as "light" | "dark", "secondary"),
          }}
        >
          {question.points} {t("points")}
        </Text>
      </View>

      {question.audio_url && (
        <View style={{ marginBottom: DesignSystem.spacing.md }}>
          <AudioButton
            onPress={() => onToggleAudio(question.audio_url)}
            isPlaying={isPlaying}
            durationMs={durationMs}
            positionMs={positionMs}
            size={48}
            showDuration={true}
            strokeDashoffset={animatedProgress.interpolate({
              inputRange: [0, 1],
              outputRange: [2 * Math.PI * 28, 0],
            })}
            colors={{
              border: theme === "light" ? "#E5E7EB" : "#374151",
              primary: "#3B82F6",
              optionBg: theme === "light" ? "#F9FAFB" : "#1F2937",
              onPrimary: "#FFFFFF",
              text: getTextColor(theme as "light" | "dark", "primary"),
            }}
          />
        </View>
      )}

      {question.content && question.content.trim() && (
        <View
          style={{
            marginBottom: question.image_url
              ? DesignSystem.spacing.sm
              : DesignSystem.spacing.md,
          }}
        >
          <HtmlRenderer
            htmlContent={question.content}
            theme={theme as "light" | "dark"}
            fontSize={DesignSystem.typography.fontSize.md}
          />
        </View>
      )}

      {question.image_url && (
        <View
          style={{
            alignItems: "center",
            marginBottom: DesignSystem.spacing.md,
          }}
        >
          <AutoImage
            source={
              isLocalAsset(question.image_url)
                ? (question.image_url as any)
                : { uri: question.image_url as string }
            }
            maxWidthPercent={0.8}
          />
        </View>
      )}

      <QuestionOptions question={question} theme={theme} />

      {!question.options && (
        <View style={{ marginTop: DesignSystem.spacing.md }}>
          <Text
            style={{
              fontSize: DesignSystem.typography.fontSize.md,
              fontWeight: DesignSystem.typography.fontWeight.bold,
              color: getTextColor(theme as "light" | "dark", "primary"),
              marginBottom: DesignSystem.spacing.sm,
            }}
          >
            {t("yourAnswer")}
          </Text>
          <Text
            style={{
              fontSize: DesignSystem.typography.fontSize.md,
              color: getTextColor(theme as "light" | "dark", "primary"),
            }}
          >
            {question.user_response || ""}
          </Text>
        </View>
      )}

      {question.explanation && (
        <View style={{ marginTop: DesignSystem.spacing.md }}>
          <Text
            style={{
              fontSize: DesignSystem.typography.fontSize.md,
              fontWeight: DesignSystem.typography.fontWeight.bold,
              color: getTextColor(theme as "light" | "dark", "primary"),
              marginBottom: DesignSystem.spacing.sm,
            }}
          >
            {t("explanation")}
          </Text>
          <HtmlRenderer
            htmlContent={question.explanation.content}
            theme={theme as "light" | "dark"}
          />
        </View>
      )}
    </ScrollView>
  );
}
