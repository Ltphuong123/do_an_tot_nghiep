import { CardCustom } from "@/components/shared/cardCustom";
import ReportModal from "@/components/shared/reportModal";
import { DesignSystem, getTextColor } from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { useThemeContext } from "@/contexts/themeContext";
import { useCallback, useState } from "react";
import { Linking, Platform, Pressable, Share, View } from "react-native";
import { Icon, Text } from "react-native-paper";

const Support = () => {
  const { theme } = useThemeContext();
  const { t } = useLanguageContext();
  const textColor = getTextColor(theme, "primary");
  const [showReportModal, setShowReportModal] = useState(false);

  const handleShareApp = async () => {
    try {
      const result = await Share.share({
        message: t("shareAppMessage"),
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log("Đã chia sẻ qua:", result.activityType);
        } else {
          console.log("Đã chia sẻ thành công");
        }
      } else if (result.action === Share.dismissedAction) {
        console.log("Đóng menu chia sẻ");
      }
    } catch (error) {
      console.error("Lỗi khi chia sẻ:", error);
    }
  };

  const handleReportPress = useCallback(() => {
    setShowReportModal(true);
  }, []);
  const handleRateApp = () => {
    console.log("Đánh giá ứng dụng");
    const appStoreUrl =
      "itms-apps://itunes.apple.com/app/idYOUR_APP_ID?action=write-review";
    const playStoreUrl = "market://details?id=YOUR_PACKAGE_NAME";

    const url = Platform.OS === "ios" ? appStoreUrl : playStoreUrl;

    Linking.openURL(url).catch((err) =>
      console.error("Không thể mở store:", err)
    );
  };

  return (
    <View
      style={{
        width: "100%",
        gap: DesignSystem.spacing.md,
        marginTop: DesignSystem.spacing.xl,
      }}
    >
      <Text
        style={{
          fontSize: DesignSystem.typography.fontSize.lg,
          fontWeight: DesignSystem.typography.fontWeight.bold,
          color: textColor,
        }}
      >
        {t("supportAndRating")}
      </Text>
      <CardCustom
        variant="card"
        padding="lg"
        style={{
          borderRadius: DesignSystem.borderRadius.xl,
        }}
      >
        <Pressable
          onPress={handleShareApp}
          style={{
            marginBottom: DesignSystem.spacing.md,
            borderBottomWidth: 1,
            paddingBottom: DesignSystem.spacing.md,
            borderColor:
              theme === "light" ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)",
            flexDirection: "row",
            alignItems: "center",
            gap: DesignSystem.spacing.md,
          }}
        >
          <Icon source="share-variant" size={24} color={textColor} />
          <Text
            style={{
              fontSize: DesignSystem.typography.fontSize.base,
              color: textColor,
            }}
          >
            {t("shareWithFriends")}
          </Text>
        </Pressable>
        <Pressable
          onPress={handleReportPress}
          style={{
            marginBottom: DesignSystem.spacing.md,
            borderBottomWidth: 1,
            paddingBottom: DesignSystem.spacing.md,
            borderColor:
              theme === "light" ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)",
            flexDirection: "row",
            alignItems: "center",
            gap: DesignSystem.spacing.md,
          }}
        >
          <Icon source="flag-outline" size={24} color={textColor} />
          <Text
            style={{
              fontSize: DesignSystem.typography.fontSize.base,
              color: textColor,
            }}
          >
            {t("sendFeedback")}
          </Text>
        </Pressable>
        <Pressable
          onPress={handleRateApp}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: DesignSystem.spacing.md,
          }}
        >
          <Icon source="star" size={24} color={textColor} />
          <Text
            style={{
              fontSize: DesignSystem.typography.fontSize.base,
              color: textColor,
            }}
          >
            {t("rateApp")}
          </Text>
        </Pressable>
      </CardCustom>

      {/* Modal báo cáo */}
      <ReportModal
        visible={showReportModal}
        onClose={() => setShowReportModal(false)}
        targetId={null}
        targetType="other"
      />
    </View>
  );
};

export default Support;
