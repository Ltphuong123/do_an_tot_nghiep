import { CardCustom } from "@/components/shared/cardCustom";
import {
    DesignSystem,
    getBorderColor,
    getTextColor,
} from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { useThemeContext } from "@/contexts/themeContext";
import { useState } from "react";
import { Pressable, View } from "react-native";
import { Icon, Modal, Portal, Text } from "react-native-paper";

export function ThemeSelector() {
  const { theme, themeMode, setThemeMode } = useThemeContext();
  const { t } = useLanguageContext();
  const [visible, setVisible] = useState(false);

  const textColor = getTextColor(theme, "primary");
  const secondaryTextColor = getTextColor(theme, "secondary");
  const borderColor = getBorderColor(theme, "light");

  const options = [
    { value: "light" as const, label: t("lightDark").split(" / ")[0], icon: "white-balance-sunny" },
    { value: "dark" as const, label: t("lightDark").split(" / ")[1], icon: "weather-night" },
    { value: "system" as const, label: t("systemMode"), icon: "cellphone-cog" },
  ];

  const getCurrentLabel = () => {
    const option = options.find((opt) => opt.value === themeMode);
    return option?.label || t("systemMode");
  };

  const handleSelect = (value: "light" | "dark" | "system") => {
    // Đóng modal ngay lập tức để user thấy responsive
    setVisible(false);
    // Update theme sau 50ms để modal đóng mượt
    setTimeout(() => {
      setThemeMode(value);
    }, 50);
  };

  return (
    <>
      <Pressable
        onPress={() => setVisible(true)}
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingVertical: DesignSystem.spacing.md,
          borderBottomWidth: 1,
          borderBottomColor: borderColor,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
          <Icon source="theme-light-dark" size={24} color={textColor} />
          <View style={{ marginLeft: DesignSystem.spacing.md, flex: 1 }}>
            <Text
              style={{
                fontSize: DesignSystem.typography.fontSize.base,
                fontWeight: DesignSystem.typography.fontWeight.semibold,
                color: textColor,
              }}
            >
              {t("interfaceMode")}
            </Text>
            <Text
              style={{
                fontSize: DesignSystem.typography.fontSize.sm,
                color: secondaryTextColor,
              }}
            >
              {getCurrentLabel()}
            </Text>
          </View>
        </View>
        <Icon source="chevron-right" size={20} color={textColor} />
      </Pressable>

      <Portal>
        <Modal
          visible={visible}
          onDismiss={() => setVisible(false)}
          contentContainerStyle={{
            marginHorizontal: DesignSystem.spacing.xl,
          }}
        >
          <CardCustom
            variant="card"
            padding="md"
            style={{
              borderRadius: DesignSystem.borderRadius.xl,
            }}
          >
            <Text
              style={{
                fontSize: DesignSystem.typography.fontSize.lg,
                fontWeight: DesignSystem.typography.fontWeight.bold,
                color: textColor,
                marginBottom: DesignSystem.spacing.md,
              }}
            >
              {t("interfaceMode")}
            </Text>

            {options.map((option) => (
              <Pressable
                key={option.value}
                onPress={() => handleSelect(option.value)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: DesignSystem.spacing.md,
                  paddingHorizontal: DesignSystem.spacing.sm,
                  borderRadius: DesignSystem.borderRadius.lg,
                  backgroundColor:
                    themeMode === option.value
                      ? theme === "dark"
                        ? "#2C2C2E"
                        : "#F5F5F5"
                      : "transparent",
                }}
              >
                <Icon source={option.icon} size={24} color={textColor} />
                <Text
                  style={{
                    flex: 1,
                    marginLeft: DesignSystem.spacing.md,
                    fontSize: DesignSystem.typography.fontSize.base,
                    color: textColor,
                  }}
                >
                  {option.label}
                </Text>
                {themeMode === option.value && (
                  <Icon source="check" size={24} color="#2196F3" />
                )}
              </Pressable>
            ))}
          </CardCustom>
        </Modal>
      </Portal>
    </>
  );
}
