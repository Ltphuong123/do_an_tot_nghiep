import {
  DesignSystem,
  getBackgroundColor,
  getBorderColor,
  getColorConfirm,
  getTextColor,
} from "@/constants/designSystem";
import React, { useEffect, useState } from "react";
import { Animated, Modal, Pressable, ScrollView, View } from "react-native";
import { Icon, Text } from "react-native-paper";

export interface MenuItem {
  key: string | number;
  title: string;
  leadingIcon?: string;
  leadingEmoji?: string;
  onPress: () => void;
  selected?: boolean;
}

interface CustomMenuProps {
  visible: boolean;
  onDismiss: () => void;
  items: MenuItem[];
  title: string;
  icon: string;
  iconColor: string;
  theme: "light" | "dark";
  anchor: React.ReactNode;
}

const CustomMenu: React.FC<CustomMenuProps> = ({
  visible,
  onDismiss,
  items,
  title,
  icon,
  iconColor,
  theme,
  anchor,
}) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.9));

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 10,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const textColor = getTextColor(theme, "primary");
  const backgroundColor = getBackgroundColor(theme, "secondary");
  const borderColor = getBorderColor(theme, "medium");

  return (
    <>
      {anchor}
      <Modal
        transparent
        visible={visible}
        onRequestClose={onDismiss}
        animationType="none"
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
            padding: DesignSystem.spacing.lg,
          }}
          onPress={onDismiss}
        >
          <Animated.View
            style={{
              backgroundColor,
              width: "100%",
              maxWidth: 400,
              borderRadius: DesignSystem.borderRadius.xl,
              overflow: "hidden",
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            }}
          >
            <Pressable>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: DesignSystem.spacing.md,
                  padding: DesignSystem.spacing.lg,
                  borderBottomWidth: 1,
                  borderBottomColor: borderColor,
                }}
              >
                <Icon source={icon as any} size={24} color={iconColor} />
                <Text
                  style={{
                    fontSize: DesignSystem.typography.fontSize.lg,
                    fontWeight: DesignSystem.typography.fontWeight.bold,
                    color: textColor,
                  }}
                >
                  {title}
                </Text>
              </View>

              <ScrollView
                style={{ maxHeight: 400 }}
                showsVerticalScrollIndicator={false}
              >
                {items.map((item, index) => (
                  <Pressable
                    key={item.key}
                    onPress={item.onPress}
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingVertical: DesignSystem.spacing.lg,
                      paddingHorizontal: DesignSystem.spacing.lg,
                      backgroundColor: item.selected
                        ? theme === "light"
                          ? `${iconColor}15`
                          : `${iconColor}20`
                        : "transparent",
                      borderBottomWidth: index < items.length - 1 ? 1 : 0,
                      borderBottomColor: borderColor,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: DesignSystem.spacing.lg,
                      }}
                    >
                      {item.leadingEmoji ? (
                        <View
                          style={{
                            width: 44,
                            height: 44,
                            borderRadius: DesignSystem.borderRadius.md,
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: item.selected
                              ? iconColor
                              : theme === "light"
                              ? "rgba(0,0,0,0.05)"
                              : "rgba(255,255,255,0.1)",
                          }}
                        >
                          <Text style={{ fontSize: 24 }}>
                            {item.leadingEmoji}
                          </Text>
                        </View>
                      ) : item.leadingIcon ? (
                        <View
                          style={{
                            width: 44,
                            height: 44,
                            borderRadius: DesignSystem.borderRadius.md,
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: item.selected
                              ? iconColor
                              : theme === "light"
                              ? "rgba(0,0,0,0.05)"
                              : "rgba(255,255,255,0.1)",
                          }}
                        >
                          <Icon
                            source={item.leadingIcon as any}
                            size={20}
                            color={item.selected ? "#fff" : textColor}
                          />
                        </View>
                      ) : null}
                      <Text
                        style={{
                          fontSize: DesignSystem.typography.fontSize.md,
                          fontWeight: item.selected
                            ? DesignSystem.typography.fontWeight.bold
                            : DesignSystem.typography.fontWeight.medium,
                          color: textColor,
                        }}
                      >
                        {item.title}
                      </Text>
                    </View>
                    {item.selected && (
                      <Icon source="check-circle" size={24} color={iconColor} />
                    )}
                  </Pressable>
                ))}
              </ScrollView>

              <Pressable
                style={{
                  padding: DesignSystem.spacing.lg,
                  margin: DesignSystem.spacing.lg,
                  borderRadius: DesignSystem.borderRadius.md,
                  alignItems: "center",
                  backgroundColor: getColorConfirm(theme),
                }}
                onPress={onDismiss}
              >
                <Text
                  style={{
                    fontSize: DesignSystem.typography.fontSize.md,
                    fontWeight: DesignSystem.typography.fontWeight.semibold,
                    color: "#fff",
                  }}
                >
                  Đóng
                </Text>
              </Pressable>
            </Pressable>
          </Animated.View>
        </Pressable>
      </Modal>
    </>
  );
};

export default CustomMenu;
