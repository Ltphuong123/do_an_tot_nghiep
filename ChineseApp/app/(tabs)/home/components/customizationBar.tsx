import { CardCustom } from "@/components/shared/cardCustom";
import { ThemeSelector } from "@/components/shared/themeSelector";
import {
  DesignSystem,
  getBorderColor,
  getTextColor,
} from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { useLoadingContext } from "@/contexts/loadingContext";
import { useSnackbar } from "@/contexts/snackbarContext";
import { useThemeContext } from "@/contexts/themeContext";
import { clearTokens, getRefreshToken } from "@/services";
import { logout } from "@/services/auth";
import { useUserStore } from "@/store/useUserStore";
import { unregisterDeviceToken } from "@/utils/notificationHelper";
import { router } from "expo-router";
import React from "react";
import { Pressable, View } from "react-native";
import { Icon, Text } from "react-native-paper";
import ModalLogout from "./shared/modalLogout";

const CustomizationBar = () => {
  const { theme } = useThemeContext();
  const { t } = useLanguageContext();
  const textColor = getTextColor(theme, "primary");
  const secondaryTextColor = getTextColor(theme, "secondary");
  const [visibleLogout, setVisibleLogout] = React.useState<boolean>(false);
  const { startLoading, stopLoading } = useLoadingContext();
  const { clearUser } = useUserStore();
  const { showSnackbar } = useSnackbar();

  const handleLogout = async () => {
    console.log("Đăng xuất khỏi tài khoản");
    const refreshToken = await getRefreshToken();
    if (!refreshToken) return;
    try {
      // Xóa tokens
      startLoading(t("loggingOut"));
      const res = await logout(refreshToken);
      if (res.success) {
        await unregisterDeviceToken();
        console.log("Device token unregistered");

        await clearTokens();
        clearUser();
        setVisibleLogout(false);
        showSnackbar(res.message, "success");
        router.replace("/auth/login" as any);
      }
    } catch (error: any) {
      showSnackbar(error.message || t("logoutFailed"), "error");
    } finally {
      stopLoading();
    }
  };

  return (
    <View
      style={{
        width: "100%",
        gap: DesignSystem.spacing.md,
        marginTop: DesignSystem.spacing.md,
      }}
    >
      <Text
        style={{
          fontSize: DesignSystem.typography.fontSize.lg,
          fontWeight: DesignSystem.typography.fontWeight.bold,
          color: textColor,
        }}
      >
        {t("customization")}
      </Text>
      <CardCustom
        variant="card"
        padding="sm"
        style={{
          borderRadius: DesignSystem.borderRadius.xl,
          width: "100%",
        }}
      >
        <ThemeSelector />

        <Pressable
          onPress={() => {
            router.push("/home/setting");
          }}
          style={{
            flexDirection: "row",
            alignItems: "center",
            borderBottomWidth: 1,
            paddingVertical: DesignSystem.spacing.md,
            borderBottomColor: getBorderColor(theme),
          }}
        >
          <Icon source="view-grid" size={24} color={textColor} />
          <View
            style={{
              flex: 1,
              marginLeft: DesignSystem.spacing.md,
            }}
          >
            <Text
              style={{
                fontSize: DesignSystem.typography.fontSize.base,
                fontWeight: DesignSystem.typography.fontWeight.semibold,
                color: textColor,
              }}
            >
              {t("changeLayout")}
            </Text>
            <Text
              style={{
                fontSize: DesignSystem.typography.fontSize.sm,
                color: secondaryTextColor,
              }}
            >
              {t("rearrangeModules")}
            </Text>
          </View>
          <Icon source="chevron-right" size={20} color={textColor} />
        </Pressable>
        <Pressable
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: DesignSystem.spacing.md,
            paddingVertical: DesignSystem.spacing.md,
          }}
          onPress={() => setVisibleLogout(true)}
        >
          <Icon source="logout" size={24} color="#F00" />
          <Text
            style={{
              fontSize: DesignSystem.typography.fontSize.md,
              color: textColor,
            }}
          >
            {t("logout")}
          </Text>
        </Pressable>
      </CardCustom>
      <ModalLogout
        visibleLogout={visibleLogout}
        setVisibleLogout={setVisibleLogout}
        handleLogout={handleLogout}
        t={t}
        theme={theme}
        textColor={textColor}
        secondaryTextColor={secondaryTextColor}
      />
    </View>
  );
};

export default CustomizationBar;
