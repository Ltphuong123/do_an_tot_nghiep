import React, { useEffect, useRef, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";

import { CardCustom } from "@/components/shared/cardCustom";
import { DesignSystem } from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { TLevelTip } from "@/types/tips.type";
import { Icon, Text } from "react-native-paper";

interface LevelSelectorProps {
  selectedLevel: TLevelTip;
  onSelect: (level: TLevelTip) => void;
  levelType: TLevelTip[];
}

const LevelSelector: React.FC<LevelSelectorProps> = ({
  selectedLevel,
  onSelect,
  levelType,
}) => {
  const { t } = useLanguageContext();
  const scrollRef = useRef<ScrollView | null>(null);
  const [itemLayouts, setItemLayouts] = useState<
    Record<string, { x: number; width: number }>
  >({});
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [contentWidth, setContentWidth] = useState<number>(0);

  useEffect(() => {
    const layout = itemLayouts[selectedLevel];
    if (!layout || !scrollRef.current) return;

    const { x, width } = layout;
    const targetCenter = x + width / 2;
    const desiredOffset = Math.max(0, targetCenter - containerWidth / 2);
    const maxOffset = Math.max(0, contentWidth - containerWidth);
    const finalOffset = Math.min(desiredOffset, maxOffset);

    try {
      scrollRef.current.scrollTo({ x: finalOffset, animated: true });
    } catch {}
  }, [selectedLevel, itemLayouts, containerWidth, contentWidth]);

  return (
    <View
      style={{
        padding: DesignSystem.spacing.md,
      }}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 4 }}
        ref={scrollRef}
        onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
        onContentSizeChange={(w, h) => setContentWidth(w)}
      >
        <View
          style={{
            flexDirection: "row",
            gap: DesignSystem.spacing.sm,
          }}
        >
          {levelType.map((level) => {
            const isSelected = selectedLevel === level;
            const levelKey =
              level === t("basicLevel")
                ? "basicLevel"
                : level === t("intermediateLevel")
                ? "intermediateLevel"
                : "advancedLevel";

            return (
              <Pressable
                key={level}
                onPress={() => onSelect(level)}
                onLayout={(e) => {
                  const { x, width } = e.nativeEvent.layout;
                  setItemLayouts((prev) => {
                    const prevItem = prev[level];
                    if (
                      prevItem &&
                      prevItem.x === x &&
                      prevItem.width === width
                    )
                      return prev;
                    return { ...prev, [level]: { x, width } };
                  });
                }}
                style={{ padding: 2 }}
              >
                <CardCustom
                  variant={isSelected ? "primary" : "card"}
                  padding="sm"
                  style={{
                    paddingHorizontal: 22,
                    paddingVertical: 12,
                    borderRadius: 28,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: DesignSystem.spacing.xs,
                    }}
                  >
                    <Icon
                      source={
                        levelKey === "basicLevel"
                          ? "speedometer-slow"
                          : levelKey === "intermediateLevel"
                          ? "speedometer-medium"
                          : "speedometer"
                      }
                      size={16}
                      color={isSelected ? "#FFFFFF" : "#4A90E2"}
                    />
                    <Text
                      style={{
                        fontSize: DesignSystem.typography.fontSize.md,
                        color: isSelected ? "#FFFFFF" : "#4A90E2",
                        fontWeight: isSelected
                          ? DesignSystem.typography.fontWeight.bold
                          : DesignSystem.typography.fontWeight.semibold,
                      }}
                    >
                      {level}
                    </Text>
                  </View>
                </CardCustom>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

export default LevelSelector;
