import {
  DesignSystem,
  getBackgroundColor,
  getTextColor,
} from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { useThemeContext } from "@/contexts/themeContext";
import React, { useState } from "react";
import { Modal, Pressable, ScrollView, View } from "react-native";
import { Icon, Text } from "react-native-paper";

interface FilterTopicModalProps {
  visible: boolean;
  onClose: () => void;
  selectedTopics: string[];
  onApply: (topics: string[]) => void;
}

// Danh sách chủ đề (sync với createPost - đầy đủ 16 chủ đề)
const TOPICS = [
  { key: "Cơ khí", labelKey: "topic_mechanics" },
  { key: "CNTT", labelKey: "topic_it" },
  { key: "Dịch", labelKey: "topic_translation" },
  { key: "Du học", labelKey: "topic_study_abroad" },
  { key: "Du lịch", labelKey: "topic_travel" },
  { key: "Góc chia sẻ", labelKey: "topic_sharing" },
  { key: "Tìm bạn học chung", labelKey: "topic_find_study_buddy" },
  { key: "Học tiếng Trung", labelKey: "topic_study_chinese" },
  { key: "Tìm gia sư", labelKey: "topic_find_tutor" },
  { key: "Việc làm", labelKey: "topic_jobs" },
  { key: "Văn hóa", labelKey: "topic_culture" },
  { key: "Thể thao", labelKey: "topic_sports" },
  { key: "Xây dựng", labelKey: "topic_construction" },
  { key: "Y tế", labelKey: "topic_health" },
  { key: "Tâm sự", labelKey: "topic_confessions" },
  { key: "Khác", labelKey: "topic_other" },
];

const FilterTopicModal: React.FC<FilterTopicModalProps> = ({
  visible,
  onClose,
  selectedTopics,
  onApply,
}) => {
  const { theme } = useThemeContext();
  const { t } = useLanguageContext();
  const [localSelected, setLocalSelected] = useState<string[]>(selectedTopics);
  const textColor = getTextColor(theme, "primary");
  const bgColor = getBackgroundColor(theme, "primary");

  const toggleTopic = (topicKey: string) => {
    setLocalSelected((prev) =>
      prev.includes(topicKey)
        ? prev.filter((t) => t !== topicKey)
        : [...prev, topicKey]
    );
  };

  const handleApply = () => {
    onApply(localSelected);
    onClose();
  };

  const handleClear = () => {
    setLocalSelected([]);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable
        style={{
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          justifyContent: "flex-end",
        }}
        onPress={onClose}
      >
        <Pressable
          style={{
            backgroundColor: bgColor,
            borderTopLeftRadius: DesignSystem.borderRadius.xl,
            borderTopRightRadius: DesignSystem.borderRadius.xl,
            paddingTop: DesignSystem.spacing.lg,
            paddingHorizontal: DesignSystem.spacing.md,
            paddingBottom: DesignSystem.spacing.xl,
            maxHeight: "70%",
          }}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: DesignSystem.spacing.lg,
            }}
          >
            <Text
              style={{
                fontSize: DesignSystem.typography.fontSize.xl,
                fontWeight: DesignSystem.typography.fontWeight.bold,
                color: textColor,
              }}
            >
              Chọn chủ đề bạn quan tâm
            </Text>
            <Pressable onPress={handleClear}>
              <Text
                style={{
                  fontSize: DesignSystem.typography.fontSize.sm,
                  color: "#3b82f6",
                  fontWeight: DesignSystem.typography.fontWeight.semibold,
                }}
              >
                Xóa tất cả
              </Text>
            </Pressable>
          </View>

          {/* Topics Grid - 2 columns */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ marginBottom: DesignSystem.spacing.lg }}
          >
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: DesignSystem.spacing.sm,
              }}
            >
              {TOPICS.map((topic) => {
                const isSelected = localSelected.includes(topic.key);
                return (
                  <Pressable
                    key={topic.key}
                    onPress={() => toggleTopic(topic.key)}
                    style={{
                      width: "48%",
                      paddingVertical: DesignSystem.spacing.sm,
                      paddingHorizontal: DesignSystem.spacing.md,
                      borderRadius: 20,
                      backgroundColor: isSelected
                        ? "#3b82f6"
                        : theme === "dark"
                        ? "rgba(255, 255, 255, 0.1)"
                        : "rgba(0, 0, 0, 0.05)",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                    }}
                  >
                    {isSelected && (
                      <Icon source="check" size={16} color="white" />
                    )}
                    <Text
                      style={{
                        color: isSelected ? "white" : textColor,
                        fontSize: 12,
                        fontWeight: isSelected
                          ? DesignSystem.typography.fontWeight.semibold
                          : DesignSystem.typography.fontWeight.medium,
                      }}
                    >
                      {t(topic.labelKey)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>

          {/* Apply Button - Viên thuốc dẹp */}
          <Pressable
            onPress={handleApply}
            style={{
              backgroundColor: "#3b82f6",
              paddingVertical: DesignSystem.spacing.sm + 2,
              borderRadius: 20,
              alignItems: "center",
              width: "100%",
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: DesignSystem.typography.fontSize.base,
                fontWeight: DesignSystem.typography.fontWeight.semibold,
              }}
            >
              Xong
            </Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default FilterTopicModal;
