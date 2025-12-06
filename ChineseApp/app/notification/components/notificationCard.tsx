import {
  DesignSystem,
  getBackgroundColor,
  getTextColor,
} from "@/constants/designSystem";
import { useThemeContext } from "@/contexts/themeContext";
import { useMarkNotificationAsRead } from "@/hooks/useNotification";
import { INotification } from "@/types/notification.type";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, View } from "react-native";
import { Icon, Text } from "react-native-paper";

interface NotificationCardProps {
  notification: INotification;
}

const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
}) => {
  const { theme } = useThemeContext();
  const router = useRouter();
  const markAsReadMutation = useMarkNotificationAsRead();

  const isRead = !!notification.read_at;
  const textColor = getTextColor(theme, "primary");
  const backgroundColor = getBackgroundColor(theme, "secondary");

  const handlePress = () => {
    if (!isRead) {
      markAsReadMutation.mutate(notification.id);
    }
    router.push({
      params: { notifi: JSON.stringify(notification) },
      pathname: "/notification/notificationDetail" as any,
    });
  };

  return (
    <Pressable
      onPress={handlePress}
      style={{
        backgroundColor,
        padding: DesignSystem.spacing.md,
        marginHorizontal: DesignSystem.spacing.md,
        marginVertical: DesignSystem.spacing.xs,
        borderRadius: DesignSystem.borderRadius.md,
        ...DesignSystem.shadows[theme].sm,
        flexDirection: "row",
        alignItems: "flex-start",
      }}
    >
      {!isRead && (
        <View
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: "#4A90E2",
            marginRight: DesignSystem.spacing.sm,
            marginTop: 6,
          }}
        />
      )}
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: DesignSystem.typography.fontSize.md,
            fontWeight: DesignSystem.typography.fontWeight.semibold,
            color: textColor,
            marginBottom: DesignSystem.spacing.xs,
          }}
        >
          {notification.title}
        </Text>
        <Text
          style={{
            fontSize: DesignSystem.typography.fontSize.xs,
            color: getTextColor(theme, "tertiary"),
          }}
        >
          {new Date(notification.created_at).toLocaleString()}
        </Text>
      </View>
      <Icon
        source="chevron-right"
        size={20}
        color={getTextColor(theme, "tertiary")}
      />
    </Pressable>
  );
};

export default NotificationCard;
