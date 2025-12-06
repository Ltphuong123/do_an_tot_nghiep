import { CardCustom } from "@/components/shared/cardCustom";
import { DesignSystem, getTextColor } from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import React from "react";
import { Pressable, View } from "react-native";
import { Text } from "react-native-paper";

type Props = {
  theme: "light" | "dark";
  topics: { key: string; label: string }[];
  selectedTopic: string;
  setSelectedTopic: (t: string) => void;
};

const TopicSelector: React.FC<Props> = ({
  theme,
  topics,
  selectedTopic,
  setSelectedTopic,
}) => {
  const textColor = getTextColor(theme, "primary");
  const { t } = useLanguageContext();

  return (
    <View style={{ gap: DesignSystem.spacing.xs }}>
      <Text
        style={{
          fontSize: DesignSystem.typography.fontSize.lg,
          fontWeight: DesignSystem.typography.fontWeight.semibold,
          color: textColor,
        }}
      >
        {t("topicLabel")}
      </Text>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: DesignSystem.spacing.xs,
        }}
      >
        {topics.map((topic) => {
          const isSelected = selectedTopic === topic.key;
          return (
            <Pressable
              key={topic.key}
              onPress={() => setSelectedTopic(isSelected ? "" : topic.key)}
            >
              <CardCustom
                variant={isSelected ? "primary" : "card"}
                padding="sm"
                style={{
                  paddingHorizontal: DesignSystem.spacing.md,
                  paddingVertical: DesignSystem.spacing.xs,
                  borderRadius: DesignSystem.borderRadius.xl,
                }}
              >
                <Text
                  style={{
                    fontSize: DesignSystem.typography.fontSize.sm,
                    fontWeight: DesignSystem.typography.fontWeight.semibold,
                    color: isSelected ? "#FFFFFF" : textColor,
                  }}
                >
                  {topic.label}
                </Text>
              </CardCustom>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

export default TopicSelector;
