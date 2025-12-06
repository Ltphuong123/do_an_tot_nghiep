import {
  DesignSystem,
  getBackgroundColor,
  getTextColor,
} from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { useThemeContext } from "@/contexts/themeContext";
import { IExamLevel, IExamType } from "@/types/mockTest.type";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { Icon, Text } from "react-native-paper";

interface ExamSelectorProps {
  examTypes: IExamType[];
  selectedExamType: IExamType | null;
  onSelectExamType: (examType: IExamType) => void;

  examLevels: IExamLevel[];
  selectedExamLevel: IExamLevel | null;
  onSelectExamLevel: (level: IExamLevel) => void;

  showExamTypeMenu: boolean;
  setShowExamTypeMenu: (show: boolean) => void;

  isLoadingLevels: boolean;
}

export default function ExamSelector({
  examTypes,
  selectedExamType,
  onSelectExamType,
  examLevels,
  selectedExamLevel,
  onSelectExamLevel,
  showExamTypeMenu,
  setShowExamTypeMenu,
  isLoadingLevels,
}: ExamSelectorProps) {
  const { theme } = useThemeContext();
  const { t } = useLanguageContext();
  // Refs and layout storage to enable centering selected item
  const levelScrollRef = useRef<ScrollView | null>(null);

  const levelLayouts = useRef<Record<string, { x: number; width: number }>>({});

  const [levelContainerWidth, setLevelContainerWidth] = useState(0);

  const centerItemInScroll = (
    ref: React.RefObject<ScrollView | null>,
    layoutsRef: React.MutableRefObject<
      Record<string, { x: number; width: number }>
    >,
    id: string | number,
    containerWidth: number
  ) => {
    if (!ref.current || containerWidth <= 0) return;
    const key = String(id);
    const layout = layoutsRef.current[key];
    if (!layout) return;
    const targetX = Math.max(
      0,
      layout.x + layout.width / 2 - containerWidth / 2
    );
    // scrollTo expects numbers for x/y
    ref.current.scrollTo({ x: targetX, y: 0, animated: true } as any);
  };

  // Auto-center when selection changes (useful when initial selection is set programmatically)
  useEffect(() => {
    if (selectedExamLevel) {
      centerItemInScroll(
        levelScrollRef,
        levelLayouts,
        selectedExamLevel.id,
        levelContainerWidth
      );
    }
  }, [selectedExamLevel, levelContainerWidth]);

  return (
    <View style={{ marginBottom: DesignSystem.spacing.lg }}>
      {/* Exam Type Selector */}
      <View style={{ marginBottom: DesignSystem.spacing.md }}>
        <Text
          style={{
            color: getTextColor(theme, "primary"),
            fontWeight: DesignSystem.typography.fontWeight.extrabold,
            fontSize: DesignSystem.typography.fontSize.sm,
            marginBottom: DesignSystem.spacing.sm,
            letterSpacing: 0.2,
          }}
        >
          {t("examType")}
        </Text>

        <Pressable
          onPress={() => setShowExamTypeMenu(true)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: getBackgroundColor(theme, "secondary"),
            paddingHorizontal: DesignSystem.spacing.md,
            paddingVertical: DesignSystem.spacing.md,
            borderRadius: DesignSystem.borderRadius.lg,
            gap: DesignSystem.spacing.sm,
          }}
        >
          <Icon source="certificate" size={20} color="#4A90E2" />
          <Text
            style={{
              color: getTextColor(theme, "primary"),
              fontWeight: DesignSystem.typography.fontWeight.semibold,
              fontSize: DesignSystem.typography.fontSize.md,
              flex: 1,
            }}
          >
            {selectedExamType?.name || t("selectExamType")}
          </Text>
          <Icon
            source="chevron-down"
            size={18}
            color={getTextColor(theme, "secondary")}
          />
        </Pressable>
      </View>

      {/* Exam Level Selector */}
      {selectedExamType && (
        <View style={{ marginBottom: DesignSystem.spacing.md }}>
          <Text
            style={{
              color: getTextColor(theme, "primary"),
              fontWeight: DesignSystem.typography.fontWeight.extrabold,
              fontSize: DesignSystem.typography.fontSize.sm,
              marginBottom: DesignSystem.spacing.sm,
              letterSpacing: 0.2,
            }}
          >
            {t("level")}
          </Text>

          {isLoadingLevels ? (
            <View
              style={{
                alignItems: "center",
                paddingVertical: DesignSystem.spacing.lg,
              }}
            >
              <ActivityIndicator size="small" color="#4A90E2" />
              <Text
                style={{
                  color: getTextColor(theme, "secondary"),
                  fontSize: DesignSystem.typography.fontSize.xs,
                  marginTop: DesignSystem.spacing.xs,
                }}
              >
                {t("loadingLevels")}
              </Text>
            </View>
          ) : (
            <View
              onLayout={(e) =>
                setLevelContainerWidth(e.nativeEvent.layout.width)
              }
            >
              <ScrollView
                ref={levelScrollRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  gap: DesignSystem.spacing.sm,
                  paddingLeft: 4,
                  paddingRight: 4,
                }}
              >
                {examLevels.map((level) => {
                  const isSelected = selectedExamLevel?.id === level.id;
                  return (
                    <Pressable
                      key={level.id}
                      onLayout={(e) => {
                        levelLayouts.current[String(level.id)] = {
                          x: e.nativeEvent.layout.x,
                          width: e.nativeEvent.layout.width,
                        };
                      }}
                      onPress={() => {
                        onSelectExamLevel(level);
                        centerItemInScroll(
                          levelScrollRef,
                          levelLayouts,
                          level.id,
                          levelContainerWidth
                        );
                      }}
                      style={{
                        paddingHorizontal: DesignSystem.spacing.md,
                        paddingVertical: DesignSystem.spacing.sm,
                        borderRadius: DesignSystem.borderRadius.full,
                        backgroundColor: isSelected
                          ? "#4A90E2"
                          : getBackgroundColor(theme, "secondary"),
                        borderWidth: isSelected ? 0 : 1,
                        borderColor: isSelected
                          ? "transparent"
                          : getTextColor(theme, "secondary"),
                      }}
                    >
                      <Text
                        style={{
                          color: isSelected
                            ? "#ffffff"
                            : getTextColor(theme, "primary"),
                          fontWeight: isSelected
                            ? DesignSystem.typography.fontWeight.bold
                            : DesignSystem.typography.fontWeight.medium,
                          fontSize: DesignSystem.typography.fontSize.sm,
                        }}
                      >
                        {level.name}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>
          )}
        </View>
      )}

      {/* Exam Type Modal */}
      <Modal
        visible={showExamTypeMenu}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowExamTypeMenu(false)}
      >
        <Pressable
          onPress={() => setShowExamTypeMenu(false)}
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: getBackgroundColor(theme, "elevated"),
              borderRadius: DesignSystem.borderRadius.lg,
              padding: DesignSystem.spacing.sm,
              minWidth: 200,
              gap: DesignSystem.spacing.xs,
              margin: DesignSystem.spacing.md,
            }}
          >
            <Text
              style={{
                fontSize: DesignSystem.typography.fontSize.lg,
                fontWeight: DesignSystem.typography.fontWeight.bold,
                color: getTextColor(theme, "primary"),
                textAlign: "center",
                marginBottom: DesignSystem.spacing.sm,
              }}
            >
              {t("selectExamType")}
            </Text>
            {examTypes.map((type) => (
              <Pressable
                key={type.id}
                onPress={() => {
                  onSelectExamType(type);
                  setShowExamTypeMenu(false);
                }}
                style={{
                  paddingVertical: DesignSystem.spacing.md,
                  paddingHorizontal: DesignSystem.spacing.md,
                  borderRadius: DesignSystem.borderRadius.md,
                  backgroundColor:
                    selectedExamType?.id === type.id
                      ? "rgba(74, 144, 226, 0.1)"
                      : "transparent",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: DesignSystem.spacing.sm,
                }}
              >
                <Icon source="certificate" size={16} color="#4A90E2" />
                <Text
                  style={{
                    fontWeight:
                      selectedExamType?.id === type.id
                        ? DesignSystem.typography.fontWeight.bold
                        : DesignSystem.typography.fontWeight.medium,
                    color: getTextColor(theme, "primary"),
                    flex: 1,
                  }}
                >
                  {type.name}
                </Text>
                {selectedExamType?.id === type.id && (
                  <Icon source="check" size={16} color="#4A90E2" />
                )}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
