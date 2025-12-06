import { ContainerCustom } from "@/components/shared/containerCustom";
import {
  DesignSystem,
  getBackgroundColor,
  getTextColor,
} from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { useLoadingContext } from "@/contexts/loadingContext";
import { useSnackbar } from "@/contexts/snackbarContext";
import { useThemeContext } from "@/contexts/themeContext";
import { useUserStore } from "@/store/useUserStore";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Animated,
  InteractionManager,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { Icon, Text } from "react-native-paper";
import AvatarSection from "./components/avatarSection";
import BasicInfoCard from "./components/basicInfoCard";
import ChangePassword from "./components/changePassword";
import ContactInfoCard from "./components/contactInfoCard";
import SettingsCard from "./components/settingsCard";

const EditProfile = () => {
  const { theme } = useThemeContext();
  const { t } = useLanguageContext();
  const [scaleAnim] = useState(new Animated.Value(1));
  const [visible, setVisible] = useState<boolean>(false);
  // const [profile, setProfile] = useState<IUserProfile>();
  const { user, setUser } = useUserStore();
  const { startLoading, stopLoading } = useLoadingContext();
  const { showSnackbar } = useSnackbar();

  const textColor = getTextColor(theme, "primary");

  // const handleLanguageChange = (langCode: string) => {
  //   if (profile) {
  //     setProfile({
  //       ...profile,
  //       language: langCode,
  //     });
  //     // TODO: Update language on server and app settings
  //   }
  // };

  const onOpenModelChangePassWord = () => {
    if (user.provider !== "local") {
      showSnackbar(t("changePasswordNotAllowed"), "info");
      return;
    }
    setVisible(true);
  };

  return user ? (
    <ContainerCustom variant="background" scrollable={false}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: DesignSystem.spacing.md,
          gap: DesignSystem.spacing.md,
          backgroundColor: getBackgroundColor(theme, "primary"),
          ...DesignSystem.shadows[theme].md,
        }}
      >
        <Pressable
          onPress={() => {
            InteractionManager.runAfterInteractions(() => {
              router.back();
            });
          }}
        >
          <Icon source="arrow-left" size={24} color={textColor} />
        </Pressable>
        <Text
          style={{
            fontSize: DesignSystem.typography.fontSize.xl,
            fontWeight: DesignSystem.typography.fontWeight.bold,
            color: textColor,
            flex: 1,
          }}
        >
          {t("editProfile")}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{
          padding: DesignSystem.spacing.md,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Avatar Section */}
        <AvatarSection
          profile={user}
          scaleAnim={scaleAnim}
          theme={theme}
          startLoading={startLoading}
          stopLoading={stopLoading}
          showSnackbar={showSnackbar}
          setUser={setUser}
        />

        {/* Basic Info Card */}
        <BasicInfoCard
          profile={user}
          theme={theme}
          onOpenModelChangePassWord={onOpenModelChangePassWord}
          startLoading={startLoading}
          stopLoading={stopLoading}
          showSnackbar={showSnackbar}
          setUser={setUser}
        />

        {/* Contact & Version Card */}
        <ContactInfoCard profile={user} theme={theme} />

        {/* Settings Card */}
        <SettingsCard
          profile={user}
          theme={theme}
          showSnackbar={showSnackbar}
          startLoading={startLoading}
          stopLoading={stopLoading}
        />
      </ScrollView>
      <ChangePassword
        visible={visible}
        setVisible={setVisible}
        startLoading={startLoading}
        stopLoading={stopLoading}
        showSnackbar={showSnackbar}
      />
    </ContainerCustom>
  ) : null;
};

export default EditProfile;
