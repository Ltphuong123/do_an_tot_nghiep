import { DesignSystem, getTextColor } from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import {
  RichEditor,
  RichToolbar,
  actions,
} from "react-native-pell-rich-editor";

type Props = {
  theme: "light" | "dark";
  content: string;
  setContent: (c: string) => void;
  richText: React.RefObject<any>;
  onCursorPosition: (y: number) => void;
};

const RichEditorSection: React.FC<Props> = ({
  theme,
  content,
  setContent,
  richText,
  onCursorPosition,
}) => {
  const textColor = getTextColor(theme, "primary");
  const subTextColor = getTextColor(theme, "secondary");
  const { t } = useLanguageContext();

  return (
    <View
      style={{
        gap: DesignSystem.spacing.xs,
        minHeight: 300,
        flexDirection: "column",
      }}
    >
      <Text
        style={{
          fontSize: DesignSystem.typography.fontSize.lg,
          fontWeight: DesignSystem.typography.fontWeight.semibold,
          color: textColor,
        }}
      >
        {t("contentLabel")} <Text style={{ color: "#F44336" }}>*</Text>
      </Text>

      <RichToolbar
        editor={richText}
        actions={[
          actions.keyboard,
          actions.undo,
          actions.redo,
          actions.setBold,
          actions.setItalic,
          actions.heading1,
          actions.alignCenter,
          actions.alignLeft,
          actions.alignRight,
          actions.alignFull,
          actions.insertBulletsList,
          actions.insertOrderedList,
          actions.insertLink,
          actions.setStrikethrough,
          actions.setUnderline,
          actions.removeFormat,
          actions.checkboxList,
          actions.blockquote,
          actions.code,
        ]}
        iconTint={textColor}
        selectedIconTint="#4A90E2"
        style={{
          borderWidth: 1,
          borderColor: theme === "light" ? "#ddd" : "#444",
          borderRadius: 8,
          marginBottom: 8,
          backgroundColor: theme === "light" ? "#fff" : "#1e1e1e",
        }}
      />

      <RichEditor
        ref={richText}
        useContainer={true}
        initialContentHTML={content}
        onChange={setContent}
        onCursorPosition={onCursorPosition}
        placeholder={t("contentPlaceholder")}
        editorStyle={{
          backgroundColor: theme === "light" ? "#fff" : "#121212",
          color: textColor,
          placeholderColor: subTextColor,
        }}
        style={{
          height: "100%",
          borderWidth: 1,
          borderColor: theme === "light" ? "#ddd" : "#444",
          borderRadius: 30,
          overflow: "hidden",
          flex: 1,
        }}
      />

      <Text
        style={{
          fontSize: DesignSystem.typography.fontSize.xs,
          textAlign: "right",
          color: subTextColor,
        }}
      >
        {content.length} {t("characters")}
      </Text>
    </View>
  );
};

export default RichEditorSection;
