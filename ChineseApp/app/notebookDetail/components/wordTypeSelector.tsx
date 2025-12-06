import { CardCustom } from "@/components/shared/cardCustom";
import { DesignSystem, getTextColor } from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { useThemeContext } from "@/contexts/themeContext";
import { IWordType } from "@/types/notebook.type";
import React from "react";
import { Pressable, ScrollView, View } from "react-native";
import { Icon, Text } from "react-native-paper";

interface WordTypeSelectorProps {
  selectedTypes: string[];
  onTypesChange: (types: string[]) => void;
}

const WORD_TYPES: IWordType[] = [
  { code: "noun", name: "Danh từ" },
  { code: "pronoun", name: "Đại từ" },
  { code: "verb", name: "Động từ" },
  { code: "adjective", name: "Tính từ" },
  { code: "adverb", name: "Trạng từ" },
  { code: "preposition", name: "Giới từ" },
  { code: "conjunction", name: "Liên từ" },
  { code: "auxiliary", name: "Trợ từ" },
  { code: "interjection", name: "Thán từ" },
  { code: "numeral", name: "Số từ" },
  { code: "measure", name: "Lượng từ" },
  { code: "phrase", name: "Cụm từ" },
];

function WordTypeSelector({
  selectedTypes,
  onTypesChange,
}: WordTypeSelectorProps) {
  const { t } = useLanguageContext();
  const { theme } = useThemeContext();
  const textColor = getTextColor(theme, "primary");

  const handleTypeToggle = (typeCode: string) => {
    if (selectedTypes.includes(typeCode)) {
      onTypesChange(selectedTypes.filter((type) => type !== typeCode));
    } else {
      onTypesChange([...selectedTypes, typeCode]);
    }
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
        {t("wordTypeLabel")}
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
          {WORD_TYPES.map((wordType) => {
            const isSelected = selectedTypes.includes(wordType.code);
            return (
              <Pressable
                key={wordType.code}
                onPress={() => handleTypeToggle(wordType.code)}
              >
                <CardCustom
                  variant={isSelected ? "primary" : "card"}
                  padding="sm"
                  style={{
                    borderRadius: DesignSystem.borderRadius.lg,
                    paddingHorizontal: DesignSystem.spacing.md,
                    paddingVertical: DesignSystem.spacing.sm,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: DesignSystem.spacing.xs,
                  }}
                >
                  {isSelected && (
                    <Icon source="check" size={18} color="#FFFFFF" />
                  )}
                  <Text
                    style={{
                      fontSize: DesignSystem.typography.fontSize.sm,
                      fontWeight: isSelected
                        ? DesignSystem.typography.fontWeight.semibold
                        : DesignSystem.typography.fontWeight.medium,
                      color: isSelected ? "#FFFFFF" : textColor,
                    }}
                  >
                    {wordType.name}
                  </Text>
                </CardCustom>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
      {selectedTypes.length === 0 && (
        <Text
          style={{
            marginTop: 4,
            fontSize: DesignSystem.typography.fontSize.xs,
            color: "#ff5252",
          }}
        >
          {t("selectAtLeastOneType")}
        </Text>
      )}
    </View>
  );
}

export default WordTypeSelector;
