import { DesignSystem, getVocabStatusColor } from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import React, { useState } from "react";
import { Animated, Pressable, View } from "react-native";
import { Icon, Text } from "react-native-paper";

interface ActionButtonProps {
  icon: string;
  label: string;
  onPress: () => void;
  color: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  icon,
  label,
  onPress,
  color,
}) => {
  const [scaleAnim] = useState(new Animated.Value(1));

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
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
    <Animated.View style={{ flex: 1, transform: [{ scale: scaleAnim }] }}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          paddingVertical: 14,
          borderRadius: 16,
          backgroundColor: `${color}15`,
        }}
      >
        <Icon source={icon as any} size={24} color={color} />
        <Text style={{ fontSize: 14, fontWeight: "600", color }}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
};

interface ActionButtonsProps {
  onCopy: () => void;
  onBookmark: () => void;
  isBookmarked: boolean;
  bookmarkDisabled: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onCopy,
  onBookmark,
  isBookmarked,
  bookmarkDisabled,
}) => {
  const { t } = useLanguageContext();
  return (
    <View
      style={{
        flexDirection: "row",
        gap: 12,
        marginBottom: DesignSystem.spacing.md,
      }}
    >
      <ActionButton
        icon="content-copy"
        label={t("copy")}
        onPress={onCopy}
        color="#FF9800"
      />
      {bookmarkDisabled ? null : (
        <ActionButton
          icon="bookmark"
          label={t("favorite")}
          onPress={onBookmark}
          color={isBookmarked ? getVocabStatusColor("yêu thích") : "#757575"}
        />
      )}
    </View>
  );
};
