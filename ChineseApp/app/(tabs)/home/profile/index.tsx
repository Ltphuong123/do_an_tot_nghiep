import ModalBadges from "@/app/(tabs)/community/components/modalBadges";
import AvatarCustom from "@/components/shared/avatarCustom";
import { ButtonCustom } from "@/components/shared/buttonCustom";
import { CardCustom } from "@/components/shared/cardCustom";
import ConfirmModal from "@/components/shared/confirmModal";
import { ContainerCustom } from "@/components/shared/containerCustom";
import EmailVerificationModal from "@/components/shared/emailVerificationModal";
import {
  DesignSystem,
  getBackgroundColor,
  getTextColor,
} from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { useLoadingContext } from "@/contexts/loadingContext";
import { useSnackbar } from "@/contexts/snackbarContext";
import { useThemeContext } from "@/contexts/themeContext";
import { useCreateAppeal } from "@/hooks/useReport";
import { clearTokens, getRefreshToken } from "@/services";
import { logout } from "@/services/auth";
import { useUserStore } from "@/store/useUserStore";
import { IUser } from "@/types/user.type";
import { unregisterDeviceToken } from "@/utils/notificationHelper";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, View } from "react-native";
import { Icon, Text } from "react-native-paper";
import AchievementsSection from "./components/achievements";
import ChartSection from "./components/chart";
import NotebookNotes from "./components/notebookNotes";
import Orther from "./components/orther";
import Support from "./components/support";
import TranslationStatistics from "./components/translationStatistics";

const ProfileScreen = () => {
  const { theme } = useThemeContext();
  const { user, setUser, banned, appealStatus, violationId, setBannedStatus } =
    useUserStore();
  const router = useRouter();

  const textColor = getTextColor(theme, "primary");
  const { startLoading, stopLoading } = useLoadingContext();
  const { showSnackbar } = useSnackbar();
  const { t } = useLanguageContext();
  const { clearUser } = useUserStore();

  const [showAppealModal, setShowAppealModal] = useState(false);
  const [appealReason, setAppealReason] = useState("");
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [isEmailRequired, setIsEmailRequired] = useState(false);
  const [isAppealLoading, setIsAppealLoading] = useState(false);
  const [showBadgeModal, setShowBadgeModal] = useState(false);

  const createAppealMutation = useCreateAppeal();

  // Kiểm tra email khi component mount
  useEffect(() => {
    if (user.id && (!user.email || user.email.trim() === "")) {
      setIsEmailRequired(true);
      setShowEmailModal(true);
    }
  }, [user.id, user.email]);

  const handleEmailVerificationSuccess = (updatedUser: IUser) => {
    setUser(updatedUser);
    setShowEmailModal(false);
    setIsEmailRequired(false);
  };

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
        showSnackbar(res.message, "success");
        router.replace("/auth/login" as any);
      }
    } catch (error: any) {
      showSnackbar(error.message || t("logoutFailed"), "error");
    } finally {
      stopLoading();
    }
  };

  const handleAppealSubmit = async () => {
    if (!appealReason.trim()) {
      showSnackbar(t("appealReasonRequired"), "error");
      return;
    }
    if (!violationId) return;

    startLoading(t("processing"));
    setIsAppealLoading(true);
    try {
      await createAppealMutation.mutateAsync({
        violationId,
        reason: appealReason.trim(),
      });
      setBannedStatus(true, "pending", violationId);
      setShowAppealModal(false);
      setAppealReason("");
      showSnackbar(t("appealSent"), "success");
    } catch (error: any) {
      showSnackbar(error.message || t("genericError"), "error");
    } finally {
      stopLoading();
      setIsAppealLoading(false);
    }
  };

  return (
    <ContainerCustom variant="background" scrollable={false}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: DesignSystem.spacing.md,

          backgroundColor: getBackgroundColor(theme, "primary"),
          ...DesignSystem.shadows[theme].md,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            flex: 1,
            gap: DesignSystem.spacing.md,
          }}
        >
          <Pressable
            onPress={() => {
              if (!banned) {
                router.back();
              }
            }}
            disabled={banned}
            style={{ opacity: banned ? 0.5 : 1 }}
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
            {t("profile")}
          </Text>
        </View>
        <Pressable
          onPress={() => router.push("/home/profile/violationsHistory")}
          disabled={banned}
          style={{ opacity: banned ? 0.5 : 1 }}
        >
          <Icon source="alert-circle-outline" size={24} color={"#fb8c00"} />
        </Pressable>
      </View>
      <ScrollView
        contentContainerStyle={{
          paddingTop: DesignSystem.spacing.md,
          paddingHorizontal: DesignSystem.spacing.sm,
        }}
        showsVerticalScrollIndicator={false}
      >
        {banned ? (
          <View style={{ flex: 1 }}>
            <CardCustom>
              <View
                style={{
                  alignItems: "center",
                  padding: DesignSystem.spacing.md,
                }}
              >
                <Text
                  style={{
                    fontSize: DesignSystem.typography.fontSize.lg,
                    color: textColor,
                    textAlign: "center",
                    marginBottom: DesignSystem.spacing.md,
                  }}
                >
                  {t("accountBanned")}
                </Text>
                <Text
                  style={{
                    fontSize: DesignSystem.typography.fontSize.md,
                    color: getTextColor(theme, "secondary"),
                    textAlign: "center",
                    marginBottom: DesignSystem.spacing.lg,
                  }}
                >
                  {t("sevenDaysBan")}
                </Text>
                {appealStatus === "none" ? (
                  <View
                    style={{
                      flexDirection: "row",
                      gap: DesignSystem.spacing.md,
                      justifyContent: "center",
                    }}
                  >
                    <ButtonCustom
                      title={t("appeal")}
                      onPress={() => setShowAppealModal(true)}
                      startColors="#4A90E2"
                      endColors="#4A90E2"
                      size="md"
                      textStyle={{ color: "#fff" }}
                    />
                    <ButtonCustom
                      title={t("logout")}
                      onPress={handleLogout}
                      startColors="#FF0000"
                      endColors="#FF0000"
                      size="md"
                      textStyle={{ color: "#fff" }}
                    />
                  </View>
                ) : appealStatus === "pending" ? (
                  <View>
                    <Text
                      style={{
                        fontSize: DesignSystem.typography.fontSize.md,
                        color: getTextColor(theme, "secondary"),
                        textAlign: "center",
                        marginBottom: DesignSystem.spacing.md,
                      }}
                    >
                      {t("waitAppeal")}
                    </Text>
                    <ButtonCustom
                      title={t("logout")}
                      onPress={handleLogout}
                      startColors="#FF0000"
                      endColors="#FF0000"
                      size="md"
                      textStyle={{ color: "#fff" }}
                    />
                  </View>
                ) : (
                  <View>
                    <Text
                      style={{
                        fontSize: DesignSystem.typography.fontSize.md,
                        color: getTextColor(theme, "secondary"),
                        textAlign: "center",
                      }}
                    >
                      {t("appealSent")}
                    </Text>
                  </View>
                )}
              </View>
            </CardCustom>
          </View>
        ) : (
          <>
            {/* User Profile Card */}
            <CardCustom
              variant="card"
              padding="md"
              style={{ marginBottom: DesignSystem.spacing.md }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: DesignSystem.spacing.md,
                }}
              >
                {/* Avatar */}
                <View>
                  <AvatarCustom avatar={user.avatar_url} size={50} />
                </View>

                {/* User Info */}
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: DesignSystem.typography.fontSize.lg,
                      fontWeight: DesignSystem.typography.fontWeight.bold,
                      color: textColor,
                      marginBottom: DesignSystem.spacing.xs,
                    }}
                  >
                    {user?.name ? user.name : "Khách"}
                  </Text>

                  {user.id ? (
                    <View style={{ gap: DesignSystem.spacing.xs }}>
                      <View
                        style={{
                          flexDirection: "row",
                          gap: DesignSystem.spacing.sm,
                        }}
                      >
                        <Pressable
                          onPress={() => setShowBadgeModal(true)}
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: DesignSystem.spacing.xs - 2,
                            backgroundColor: "#F3F4F6",
                            borderRadius: DesignSystem.borderRadius.sm,
                            paddingHorizontal: 4,
                            paddingVertical: 2,
                          }}
                        >
                          <Image
                            source={{ uri: user.badge?.icon }}
                            style={{
                              width: 16,
                              height: 16,
                            }}
                          />
                          <Text
                            style={{
                              fontSize: DesignSystem.typography.fontSize.xs,
                              fontWeight:
                                DesignSystem.typography.fontWeight.medium,
                              color: "#374151",
                            }}
                          >
                            {user.badge?.name}
                          </Text>
                        </Pressable>
                      </View>
                      {(!user.email || user.email.trim() === "") && (
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 4,
                            backgroundColor:
                              theme === "light"
                                ? "rgba(239, 68, 68, 0.1)"
                                : "rgba(239, 68, 68, 0.2)",
                            paddingHorizontal: 6,
                            paddingVertical: 2,
                            borderRadius: DesignSystem.borderRadius.xs,
                          }}
                        >
                          <Icon
                            source="alert-circle"
                            size={12}
                            color="#EF4444"
                          />
                          <Text
                            style={{
                              fontSize: DesignSystem.typography.fontSize.xs,
                              color: "#EF4444",
                              fontWeight:
                                DesignSystem.typography.fontWeight.medium,
                            }}
                          >
                            {t("notVerified")}
                          </Text>
                        </View>
                      )}
                    </View>
                  ) : null}
                </View>

                {/* Edit Button */}
                {user.name && (
                  <Pressable
                    style={{
                      padding: DesignSystem.spacing.sm,
                      borderRadius: 20,
                      backgroundColor:
                        theme === "light"
                          ? "rgba(74, 144, 226, 0.1)"
                          : "rgba(74, 144, 226, 0.2)",
                    }}
                    onPress={() =>
                      router.push("/home/profile/editProfile" as any)
                    }
                  >
                    <Icon source="pencil" size={18} color="#4A90E2" />
                  </Pressable>
                )}
              </View>
            </CardCustom>

            {user.id ? (
              <AchievementsSection
                startLoading={startLoading}
                stopLoading={stopLoading}
                showSnackbar={showSnackbar}
              />
            ) : null}
            {user.id ? <ChartSection /> : null}
            {user.id ? <TranslationStatistics /> : null}
            {user.id ? (
              <NotebookNotes
                startLoading={startLoading}
                stopLoading={stopLoading}
                showSnackbar={showSnackbar}
              />
            ) : null}
            <Support />
            {user.id ? <Orther /> : null}
          </>
        )}
      </ScrollView>
      {/* Modal xác thực email */}
      <EmailVerificationModal
        visible={showEmailModal}
        onClose={isEmailRequired ? undefined : () => setShowEmailModal(false)}
        user={user}
        onSuccess={handleEmailVerificationSuccess}
        isRequired={isEmailRequired}
        startLoading={startLoading}
        stopLoading={stopLoading}
        showSnackbar={showSnackbar}
      />
      {/* Appeal Modal */}
      <ConfirmModal
        visible={showAppealModal}
        onRequestClose={() => setShowAppealModal(false)}
        onConfirm={handleAppealSubmit}
        title={t("appeal")}
        variant="form"
        inputValue={appealReason}
        onInputChange={setAppealReason}
        inputPlaceholder={t("appealReason")}
        confirmText={t("send")}
        cancelText={t("cancel")}
        isLoading={isAppealLoading}
        icon="gavel"
        inputMaxLength={500}
        inputMultiline={true}
        inputNumberOfLines={4}
      />
      {/* Badge Modal */}
      <ModalBadges
        visible={showBadgeModal}
        onClose={() => setShowBadgeModal(false)}
      />
    </ContainerCustom>
  );
};

export default ProfileScreen;
