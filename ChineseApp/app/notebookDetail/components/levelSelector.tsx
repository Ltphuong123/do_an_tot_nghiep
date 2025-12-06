import { CardCustom } from "@/components/shared/cardCustom";
import { DesignSystem, getTextColor } from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { useThemeContext } from "@/contexts/themeContext";
import { LevelHSK } from "@/types/common.type";
import React from "react";
import { Pressable, ScrollView, View } from "react-native";
import { Text } from "react-native-paper";

interface LevelSelectorProps {
  selectedLevels: LevelHSK[];
  onLevelsChange: (levels: LevelHSK[]) => void;
}

const HSK_LEVELS: LevelHSK[] = [
  "HSK1",
  "HSK2",
  "HSK3",
  "HSK4",
  "HSK5",
  "HSK6",
  "HSK7-9",
];

function LevelSelector({ selectedLevels, onLevelsChange }: LevelSelectorProps) {
  const { t } = useLanguageContext();
  const { theme } = useThemeContext();
  const textColor = getTextColor(theme, "primary");

  const handleLevelToggle = (level: LevelHSK) => {
    if (selectedLevels.includes(level)) {
      onLevelsChange(selectedLevels.filter((l) => l !== level));
    } else {
      onLevelsChange([...selectedLevels, level]);
    }
  };

  const getLevelColor = (level: LevelHSK) => {
    const colors = {
      HSK1: "#4CAF50",
      HSK2: "#8BC34A",
      HSK3: "#FFC107",
      HSK4: "#FF9800",
      HSK5: "#F44336",
      HSK6: "#9C27B0",
      "HSK7-9": "#3F51B5",
    };
    return colors[level];
  };

  return (
    <View style={{ marginBottom: DesignSystem.spacing.md }}>
      <Text
        style={{
          fontSize: DesignSystem.typography.fontSize.md,
          fontWeight: DesignSystem.typography.fontWeight.semibold,
          color: textColor,
          marginBottom: DesignSystem.spacing.sm,
        }}
      >
        {t("hskLevelLabel")}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingRight: DesignSystem.spacing.md,
          paddingVertical: 8,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: DesignSystem.spacing.sm,
          }}
        >
          {HSK_LEVELS.map((level) => {
            const isSelected = selectedLevels.includes(level);
            return (
              <Pressable key={level} onPress={() => handleLevelToggle(level)}>
                <CardCustom
                  variant={isSelected ? "primary" : "card"}
                  padding="sm"
                  style={{
                    borderRadius: DesignSystem.borderRadius.lg,
                    paddingHorizontal: DesignSystem.spacing.md,
                    paddingVertical: DesignSystem.spacing.sm,
                    backgroundColor: isSelected
                      ? getLevelColor(level)
                      : undefined,
                  }}
                >
                  <Text
                    style={{
                      fontSize: DesignSystem.typography.fontSize.sm,
                      fontWeight: isSelected
                        ? DesignSystem.typography.fontWeight.semibold
                        : DesignSystem.typography.fontWeight.medium,
                      color: isSelected ? "#FFFFFF" : textColor,
                    }}
                  >
                    {level}
                  </Text>
                </CardCustom>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
      {selectedLevels.length === 0 && (
        <Text
          style={{
            marginTop: 4,
            fontSize: DesignSystem.typography.fontSize.xs,
            color: "#ff5252",
          }}
        >
          {t("selectAtLeastOneLevel")}
        </Text>
      )}
    </View>
  );
}

export default LevelSelector;
