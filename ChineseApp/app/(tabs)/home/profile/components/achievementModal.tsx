import { ButtonCustom } from "@/components/shared/buttonCustom";
import { DesignSystem, getTextColor } from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { useThemeContext } from "@/contexts/themeContext";
import { IAchievements } from "@/types/home.type";
import React from "react";
import { Image, Modal, Pressable, ScrollView, View } from "react-native";
import { Icon, Text } from "react-native-paper";

export default function AchievementModal({
  visible,
  achievement,
  onDismiss,
}: {
  visible: boolean;
  achievement: IAchievements | null;
  onDismiss: () => void;
}) {
  const { theme } = useThemeContext();
  const { t } = useLanguageContext();
  const textColor = getTextColor(theme, "primary");
  const secondaryTextColor = getTextColor(theme, "secondary");

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          justifyContent: "center",
          alignItems: "center",
          padding: DesignSystem.spacing.sm,
        }}
      >
        <View
          style={{
            backgroundColor: theme === "light" ? "#FFFFFF" : "#1E1E1E",
            padding: DesignSystem.spacing.xl,
            margin: DesignSystem.spacing.lg,
            borderRadius: DesignSystem.borderRadius.xl,
            maxHeight: "80%",
            width: "100%",
            maxWidth: 500,
          }}
        >
          <Pressable
            onPress={onDismiss}
            style={{
              position: "absolute",
              top: 5,
              right: 5,
              zIndex: 10,
              padding: 8,
            }}
          >
            <Icon
              source="close"
              size={24}
              color={theme === "light" ? "#000" : "#fff"}
            />
          </Pressable>

          {achievement && (
            <View style={{ gap: DesignSystem.spacing.lg }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View style={{ marginRight: DesignSystem.spacing.lg }}>
                  <Image
                    source={{ uri: achievement.icon }}
                    style={{ width: 40, height: 40 }}
                    resizeMode="contain"
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: DesignSystem.typography.fontSize.xl,
                      fontWeight: DesignSystem.typography.fontWeight.bold,
                      color: textColor,
                      marginBottom: DesignSystem.spacing.sm,
                    }}
                  >
                    {achievement.name}
                  </Text>

                  <ScrollView>
                    <Text
                      style={{
                        fontSize: DesignSystem.typography.fontSize.md,
                        lineHeight:
                          DesignSystem.typography.lineHeight.relaxed *
                          DesignSystem.typography.fontSize.md,
                        color: secondaryTextColor,
                      }}
                    >
                      {achievement.description}
                    </Text>
                  </ScrollView>
                </View>
              </View>

              <View
                style={{ flexDirection: "row", gap: DesignSystem.spacing.md }}
              >
                <View style={{ flex: 1 }}>
                  <ButtonCustom
                    size="sm"
                    title={t("choose")}
                    onPress={() => {
                      console.log("Chọn:", achievement.name);
                      onDismiss();
                    }}
                    startColors="#FFFFFF"
                    endColors="#FFFFFF"
                    textStyle={{ color: "#000000" }}
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <ButtonCustom
                    size="sm"
                    title={t("share")}
                    onPress={() => {
                      console.log("Chia sẻ:", achievement.name);
                    }}
                    startColors="#FFFFFF"
                    endColors="#FFFFFF"
                    textStyle={{ color: "#000000" }}
                  />
                </View>
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}
