import { CardCustom } from "@/components/shared/cardCustom";
import { DesignSystem, getTextColor } from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { editProfile } from "@/services/profile";
import { useUserStore } from "@/store/useUserStore";
import { IUser } from "@/types/user.type";
import formatTimeAgo from "@/utils/format_time_ago";
import React, { useState } from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import CustomMenu from "./customMenu";
import InfoRow from "./infoRow";

interface SettingsCardProps {
  profile: IUser;
  theme: "light" | "dark";
  onLanguageChange?: (langCode: string) => void;
  showSnackbar: (message: string, type: "error" | "success") => void;
  startLoading: () => void;
  stopLoading: () => void;
}

const SettingsCard: React.FC<SettingsCardProps> = ({
  profile,
  theme,
  onLanguageChange,
  showSnackbar,
  startLoading,
  stopLoading,
}) => {
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const { language: currentLanguage, setLanguage, t } = useLanguageContext();
  const { setUser } = useUserStore();

  const languages = [
    { code: "vi", name: "Tiếng Việt", flag: "🇻🇳" },
    { code: "en", name: "English", flag: "🇺🇸" },
  ];

  const providerIcons = {
    facebook: "facebook",
    google: "google",
    local: "account",
  };

  const getCurrentLanguage = () => {
    const lang = languages.find((l) => l.code === currentLanguage);
    return lang ? `${lang.flag} ${lang.name}` : "🇻🇳 Tiếng Việt";
  };

  const handleLanguageChange = async (langCode: string) => {
    setShowLanguageMenu(false);
    startLoading();

    try {
      // Get language name for API
      const languageName = langCode === "en" ? "Tiếng Anh" : "Tiếng Việt";

      // Call API to update language on server
      const res = await editProfile({ language: languageName });
      if (res.success) {
        // Update user data in store with the response first
        await setUser(res.data);

        // Force update language context to sync with new user data
        // The useEffect in LanguageContext should pick this up automatically
        // but we can also call setLanguage to be sure
        setTimeout(() => {
          setLanguage(langCode as "vi" | "en");
        }, 100);

        showSnackbar(t("languageUpdateSuccess"), "success");
        onLanguageChange?.(langCode);
      } else {
        showSnackbar(res.message || t("languageUpdateFailed"), "error");
      }
    } catch (error) {
      console.error("Failed to update language preference:", error);
      alert(t("languageUpdateFailed"));
    } finally {
      stopLoading();
    }
  };

  return (
    <CardCustom
      variant="card"
      padding="lg"
      style={{
        borderRadius: DesignSystem.borderRadius.xl,
        marginBottom: DesignSystem.spacing.lg,
      }}
    >
      <Text
        style={{
          fontSize: DesignSystem.typography.fontSize.lg,
          fontWeight: DesignSystem.typography.fontWeight.bold,
          color: getTextColor(theme, "primary"),
          marginBottom: DesignSystem.spacing.md,
        }}
      >
        {t("settings")}
      </Text>

      <View
        style={{
          height: 1,
          backgroundColor:
            theme === "light" ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)",
          marginVertical: DesignSystem.spacing.md,
        }}
      />

      <InfoRow
        icon={
          providerIcons[profile.provider as keyof typeof providerIcons] ??
          providerIcons.local
        }
        label={t("loginWith")}
        value={profile.provider || "Local"}
        iconColor="#3b5998"
        theme={theme}
      />

      <View
        style={{
          height: 1,
          backgroundColor:
            theme === "light" ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)",
          marginVertical: DesignSystem.spacing.md,
        }}
      />

      {/* Language */}
      <CustomMenu
        visible={showLanguageMenu}
        onDismiss={() => setShowLanguageMenu(false)}
        title={t("chooseLanguage")}
        icon="translate"
        iconColor="#FF5722"
        theme={theme}
        items={languages.map((lang) => ({
          key: lang.code,
          title: lang.name,
          leadingEmoji: lang.flag,
          selected: currentLanguage === lang.code,
          onPress: () => handleLanguageChange(lang.code),
        }))}
        anchor={
          <InfoRow
            icon="translate"
            label={t("language")}
            value={getCurrentLanguage()}
            iconColor="#FF5722"
            theme={theme}
            onPress={() => setShowLanguageMenu(true)}
            showChevron
          />
        }
      />

      <View
        style={{
          height: 1,
          backgroundColor:
            theme === "light" ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)",
          marginVertical: DesignSystem.spacing.md,
        }}
      />

      <InfoRow
        icon="calendar-clock"
        label={t("createdAt")}
        value={formatTimeAgo(profile.created_at, currentLanguage)}
        iconColor="#607D8B"
        theme={theme}
      />
    </CardCustom>
  );
};

export default SettingsCard;
