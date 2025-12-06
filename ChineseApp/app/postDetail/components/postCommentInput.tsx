import React, { memo, useEffect, useMemo, useRef } from "react";
import { Pressable, TextInput, View } from "react-native";

import { DesignSystem, getTextColor } from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { Icon, Text } from "react-native-paper";

type Props = {
  theme: "light" | "dark";
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  replyTo?: { id: string; name: string } | null;
  onCancelReply?: () => void;
};

const PostCommentInput: React.FC<Props> = ({
  theme,
  value,
  onChangeText,
  onSend,
  replyTo,
  onCancelReply,
}) => {
  const { t } = useLanguageContext();
  const inputRef = useRef<TextInput>(null);
  const isDisabled = useMemo(() => !value.trim(), [value]);

  const textColor = useMemo(() => getTextColor(theme, "primary"), [theme]);
  const secondaryTextColor = useMemo(
    () => getTextColor(theme, "secondary"),
    [theme]
  );

  const backgroundColor = useMemo(
    () =>
      theme === "light"
        ? "rgba(255, 255, 255, 0.98)"
        : "rgba(30, 30, 30, 0.98)",
    [theme]
  );

  const inputBackgroundColor = useMemo(
    () =>
      theme === "light" ? "rgba(0, 0, 0, 0.05)" : "rgba(255, 255, 255, 0.1)",
    [theme]
  );

  const borderColor = useMemo(
    () =>
      theme === "light" ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.1)",
    [theme]
  );

  // Auto focus when replying
  useEffect(() => {
    if (replyTo) {
      inputRef.current?.focus();
    }
  }, [replyTo]);

  return (
    <View>
      {replyTo && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: DesignSystem.spacing.md,
            paddingVertical: DesignSystem.spacing.xs,
            backgroundColor:
              theme === "light"
                ? "rgba(74, 144, 226, 0.1)"
                : "rgba(74, 144, 226, 0.2)",
            borderTopWidth: 1,
            borderTopColor: borderColor,
          }}
        >
          <Text
            style={{
              flex: 1,
              fontSize: 13,
              color: "#4A90E2",
            }}
          >
            {t("replyingTo")} @{replyTo.name}
          </Text>
          <Pressable onPress={onCancelReply}>
            <Icon source="close" size={20} color={secondaryTextColor} />
          </Pressable>
        </View>
      )}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: DesignSystem.spacing.sm,
          gap: DesignSystem.spacing.sm,
          borderTopWidth: replyTo ? 0 : 1,
          backgroundColor,
          borderTopColor: borderColor,
        }}
      >
        {/* <AvatarCustom size={36} avatar={} /> */}
        <TextInput
          ref={inputRef}
          style={{
            flex: 1,
            borderRadius: 20,
            paddingHorizontal: DesignSystem.spacing.md,
            paddingVertical: 10,
            fontSize: DesignSystem.typography.fontSize.md,
            maxHeight: 100,
            backgroundColor: inputBackgroundColor,
            color: textColor,
          }}
          placeholder={
            replyTo
              ? `${t("replyingTo")} @${replyTo.name}...`
              : t("writeComment")
          }
          placeholderTextColor={secondaryTextColor}
          value={value}
          onChangeText={onChangeText}
          multiline
          maxLength={500}
          returnKeyType="default"
          blurOnSubmit={false}
        />
        <Pressable
          disabled={isDisabled}
          onPress={onSend}
          style={{
            width: 40,
            height: 40,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Icon
            source="send"
            size={24}
            color={isDisabled ? secondaryTextColor : "#4A90E2"}
          />
        </Pressable>
      </View>
    </View>
  );
};

export default memo(PostCommentInput);
