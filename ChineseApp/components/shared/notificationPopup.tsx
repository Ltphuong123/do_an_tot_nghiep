/* eslint-disable react-hooks/exhaustive-deps */
import { DesignSystem, getTextColor } from "@/constants/designSystem";
import { useThemeContext } from "@/contexts/themeContext";
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Icon } from "react-native-paper";
import HtmlRenderer from "./htmlRenderer";

interface NotificationPopupProps {
  visible: boolean;
  title: string;
  body?: string | { html: string };
  icon?: string;
  onPress?: () => void;
  onDismiss?: () => void;
  duration?: number;
}

export const NotificationPopup: React.FC<NotificationPopupProps> = ({
  visible,
  title,
  body,
  icon = "bell",
  onPress,
  onDismiss,
  duration = 6000,
}) => {
  const { theme } = useThemeContext();
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();

  const textColor = getTextColor(theme, "primary");
  const secondaryTextColor = getTextColor(theme, "secondary");

  // Xử lý body có thể là string, object {html: string}, hoặc đã được stringify
  const getBodyContent = (): string => {
    if (!body) return "";

    // Nếu body là object có thuộc tính html
    if (typeof body === "object" && "html" in body) {
      return body.html;
    }

    // Nếu body là string nhưng là JSON stringify của object
    if (typeof body === "string") {
      try {
        const parsed = JSON.parse(body);
        if (parsed && typeof parsed === "object" && parsed.html) {
          return parsed.html;
        }
      } catch {
        // Không phải JSON, trả về string gốc
      }
      return body;
    }

    return String(body);
  };

  const bodyContent = getBodyContent();
  console.log("NotificationPopup bodyContent:", bodyContent);

  useEffect(() => {
    if (visible) {
      // Slide down and fade in
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 50,
          friction: 8,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto dismiss after duration
      const timer = setTimeout(() => {
        handleDismiss();
      }, duration);

      return () => clearTimeout(timer);
    } else {
      // Reset animations
      slideAnim.setValue(-100);
      opacityAnim.setValue(0);
    }
  }, [visible, duration]);

  const handleDismiss = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -150,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss?.();
    });
  };

  const handlePress = () => {
    router.push("/notification");
    handleDismiss();
    console.log("Navigating to /notification");
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <Pressable
        onPress={handlePress}
        style={[
          styles.popup,
          {
            backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
            borderColor: theme === "dark" ? "#374151" : "#e5e7eb",
          },
        ]}
      >
        {/* Icon */}
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor:
                theme === "dark" ? "rgba(59, 130, 246, 0.1)" : "#dbeafe",
            },
          ]}
        >
          <Icon
            source={icon}
            size={24}
            color={theme === "dark" ? "#60a5fa" : "#3b82f6"}
          />
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text
            style={[
              styles.title,
              {
                color: textColor,
              },
            ]}
            numberOfLines={2}
          >
            {title}
          </Text>
          {bodyContent && (
            <View style={{ marginTop: 4 }}>
              {(() => {
                const isHtml =
                  (bodyContent.includes("<") && bodyContent.includes(">")) ||
                  bodyContent.trim().startsWith("<");

                if (isHtml) {
                  return (
                    <HtmlRenderer
                      theme={theme}
                      htmlContent={bodyContent}
                      fontSize={13}
                      textAlign="left"
                      forceThemeColors={true}
                    />
                  );
                }
                return (
                  <Text
                    style={[
                      styles.body,
                      {
                        color: secondaryTextColor,
                      },
                    ]}
                    numberOfLines={6}
                  >
                    {bodyContent}
                  </Text>
                );
              })()}
            </View>
          )}
        </View>

        {/* Close button */}
        <Pressable onPress={handleDismiss} style={styles.closeButton}>
          <Icon source="close" size={20} color={secondaryTextColor} />
        </Pressable>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: Platform.OS === "ios" ? 60 : 30,
    right: DesignSystem.spacing.md,
    left: DesignSystem.spacing.md,
    zIndex: 9999,
    elevation: 10,
  },
  popup: {
    flexDirection: "row",
    alignItems: "flex-start", // Changed from center to flex-start for better alignment with long content
    padding: DesignSystem.spacing.md,
    borderRadius: DesignSystem.borderRadius.lg,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    maxHeight: 240, // Tăng chiều cao tối đa để hiển thị nhiều nội dung hơn
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: DesignSystem.spacing.md,
    marginTop: 2, // Add slight margin top for better alignment with content
  },
  content: {
    flex: 1,
    marginRight: DesignSystem.spacing.sm,
    maxHeight: 180, // Tăng chiều cao tối đa cho nội dung dài
    overflow: "hidden", // Hide overflow content
  },
  title: {
    fontSize: DesignSystem.typography.fontSize.base,
    fontWeight: DesignSystem.typography.fontWeight.semibold,
    marginBottom: 2,
  },
  body: {
    fontSize: DesignSystem.typography.fontSize.sm,
    marginTop: 2,
  },
  closeButton: {
    padding: DesignSystem.spacing.xs,
    alignSelf: "flex-start", // Align close button to top
    marginTop: 2, // Add slight margin for better alignment
  },
});
