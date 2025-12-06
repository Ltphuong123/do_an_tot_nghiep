import { DesignSystem, getTextColor } from "@/constants/designSystem";
import React, { useState } from "react";
import { Pressable, View } from "react-native";
import { Icon, Text } from "react-native-paper";

interface InfoRowProps {
  icon: string;
  label: string;
  value: string;
  iconColor: string;
  theme: "light" | "dark";
  onPress?: () => void;
  editable?: boolean;
  showChevron?: boolean;
}

const InfoRow: React.FC<InfoRowProps> = ({
  icon,
  label,
  value,
  iconColor,
  theme,
  onPress,
  editable = false,
  showChevron = false,
}) => {
  const [pressed, setPressed] = useState(false);

  const textColor = getTextColor(theme, "primary");
  const secondaryTextColor = getTextColor(theme, "secondary");

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      disabled={!onPress}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingVertical: DesignSystem.spacing.sm,
          paddingHorizontal: DesignSystem.spacing.xs,
          borderRadius: DesignSystem.borderRadius.md,
          backgroundColor: pressed
            ? theme === "light"
              ? "rgba(0,0,0,0.03)"
              : "rgba(255,255,255,0.05)"
            : "transparent",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: DesignSystem.spacing.md,
            flex: 1,
          }}
        >
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: DesignSystem.borderRadius.lg,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor:
                theme === "light" ? `${iconColor}15` : `${iconColor}25`,
            }}
          >
            <Icon source={icon as any} size={20} color={iconColor} />
          </View>
          <Text
            style={{
              fontSize: DesignSystem.typography.fontSize.sm,
              fontWeight: DesignSystem.typography.fontWeight.medium,
              color: secondaryTextColor,
            }}
          >
            {label}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: DesignSystem.spacing.sm,
            maxWidth: "50%",
          }}
        >
          <Text
            style={{
              fontSize: DesignSystem.typography.fontSize.sm,
              fontWeight: DesignSystem.typography.fontWeight.semibold,
              color: textColor,
            }}
            numberOfLines={1}
          >
            {value}
          </Text>
          {(editable || showChevron) && (
            <Icon
              source={editable ? "pencil" : "chevron-right"}
              size={18}
              color={secondaryTextColor}
            />
          )}
        </View>
      </View>
    </Pressable>
  );
};

export default InfoRow;
