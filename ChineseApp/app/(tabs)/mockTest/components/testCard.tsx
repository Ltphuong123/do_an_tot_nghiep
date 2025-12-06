import { ButtonCustom } from "@/components/shared/buttonCustom";
import { DownloadButton } from "@/components/shared/downloadButton";
import {
  DesignSystem,
  getColorAtived,
  getShadow,
  getSolidColor,
  getTextColor,
} from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { useThemeContext } from "@/contexts/themeContext";
import { IExam } from "@/types/mockTest.type";
import React, { useState } from "react";
import { Animated, Pressable, View } from "react-native";
import { Icon, Text } from "react-native-paper";

interface TestCardProps {
  title: string;
  questionCount: number;
  duration: number;
  exam?: IExam; // Add exam data for download functionality
  onPress: () => void;
}

export default function TestCard({
  title,
  questionCount,
  duration,
  exam,
  onPress,
}: TestCardProps) {
  const { theme } = useThemeContext();
  const { t } = useLanguageContext();
  const textColor = getTextColor(theme, "primary");
  const secondaryTextColor = getTextColor(theme, "secondary");
  const cardBackground = getSolidColor(theme, "card");
  const shadowStyle = getShadow(theme, "md");
  const [scaleAnim] = useState(new Animated.Value(1));

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        style={{
          width: 280,
          padding: DesignSystem.spacing.md,
          borderRadius: DesignSystem.borderRadius.xl,
          gap: DesignSystem.spacing.sm,
          backgroundColor: cardBackground,
          marginRight: DesignSystem.spacing.md,
          position: "relative",
          overflow: "hidden",
          ...shadowStyle,
        }}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {/* Header */}
        <View style={{ gap: DesignSystem.spacing.xs }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: DesignSystem.spacing.sm,
            }}
          >
            <Text
              style={{
                fontSize: DesignSystem.typography.fontSize.base,
                fontWeight: DesignSystem.typography.fontWeight.semibold,
                color: textColor,
                flex: 1,
                lineHeight: DesignSystem.typography.fontSize.base * 1.4,
              }}
              numberOfLines={1}
            >
              {title}
            </Text>

            {/* Download Button */}
            {exam && (
              <DownloadButton
                exam={exam}
                size={20}
                onDownloadStart={() => {}}
                onDownloadSuccess={() => {}}
                onDownloadError={() => {}}
              />
            )}
          </View>
        </View>

        {/* Skills */}
        {exam?.skills && exam.skills.length > 0 && (
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: DesignSystem.spacing.xs,
            }}
          >
            {exam.skills.map((skill, index) => {
              const getSkillIcon = (skillName: string) => {
                switch (skillName.toLowerCase()) {
                  case "nghe":
                    return "headphones";
                  case "nói":
                    return "account-voice";
                  case "đọc":
                    return "book-open-page-variant";
                  case "viết":
                    return "pencil";
                  default:
                    return "circle";
                }
              };

              return (
                <View
                  key={index}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 4,
                    marginRight: DesignSystem.spacing.xs,
                  }}
                >
                  <Icon
                    source={getSkillIcon(skill)}
                    size={12}
                    color={textColor}
                  />
                  <Text
                    style={{
                      fontSize: DesignSystem.typography.fontSize.xs,
                      color: textColor,
                      fontWeight: DesignSystem.typography.fontWeight.medium,
                    }}
                  >
                    {skill}
                  </Text>
                </View>
              );
            })}
          </View>
        )}

        {/* Info */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: DesignSystem.spacing.sm,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Icon source="file-document-outline" size={16} color="#4A90E2" />
            <Text
              style={{
                fontSize: DesignSystem.typography.fontSize.sm,
                color: secondaryTextColor,
              }}
            >
              {questionCount} {t("questions")} {""}
            </Text>
          </View>
          <View
            style={{
              width: 1,
              height: 12,
              backgroundColor: "rgba(0, 0, 0, 0.1)",
            }}
          />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Icon source="clock-outline" size={16} color="#FF9800" />
            <Text
              style={{
                fontSize: DesignSystem.typography.fontSize.sm,
                color: secondaryTextColor,
              }}
            >
              {duration} {t("minutes")} {""}
            </Text>
          </View>
        </View>

        <ButtonCustom
          title={t("start")}
          onPress={onPress}
          size="sm"
          startColors={getColorAtived(theme)}
          endColors={getColorAtived(theme)}
          textStyle={{ color: "#fff" }}
        />
      </Pressable>
    </Animated.View>
  );
}
