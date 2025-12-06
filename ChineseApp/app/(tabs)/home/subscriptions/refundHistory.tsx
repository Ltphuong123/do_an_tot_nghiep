import { CardCustom } from "@/components/shared/cardCustom";
import { ContainerCustom } from "@/components/shared/containerCustom";
import { DesignSystem, getTextColor } from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { useThemeContext } from "@/contexts/themeContext";
import { useRefundHistory } from "@/hooks/useSubscription";
import { router } from "expo-router";
import { InteractionManager, Pressable, ScrollView, View } from "react-native";
import { Icon, Text } from "react-native-paper";

const RefundHistoryScreen = () => {
  const { theme } = useThemeContext();
  const { data: refundData, isLoading } = useRefundHistory();

  const textColor = getTextColor(theme, "primary");
  const secondaryTextColor = getTextColor(theme, "secondary");
  const { t } = useLanguageContext();

  if (isLoading) {
    return (
      <ContainerCustom>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ color: textColor }}>{t("loading")}</Text>
        </View>
      </ContainerCustom>
    );
  }

  return (
    <ContainerCustom>
      {/* Header */}
      <View
        style={{
          padding: DesignSystem.spacing.md,
          flexDirection: "row",
          alignItems: "center",
          ...DesignSystem.shadows[theme].md,
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
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
            }}
          >
            {t("refundHistory")}
          </Text>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          padding: DesignSystem.spacing.md,
          paddingBottom: DesignSystem.spacing.xxxl,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ gap: DesignSystem.spacing.md }}>
          {refundData?.data?.map((item: any, index: number) => (
            <CardCustom
              key={index}
              variant="card"
              padding="md"
              style={{
                shadowColor: "#000",
                shadowOpacity: 0.05,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              <View>
                {/* Header */}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: DesignSystem.spacing.sm,
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: DesignSystem.typography.fontSize.lg,
                        fontWeight: DesignSystem.typography.fontWeight.bold,
                        color: textColor,
                        marginBottom: DesignSystem.spacing.xs,
                      }}
                    >
                      {t("refundRequest")}
                    </Text>
                    <Text
                      style={{
                        fontSize: DesignSystem.typography.fontSize.sm,
                        color: secondaryTextColor,
                      }}
                    >
                      {new Date(item.created_at).toLocaleDateString("vi-VN")}
                    </Text>
                  </View>
                  <View style={{ alignItems: "flex-end" }}>
                    <Text
                      style={{
                        fontSize: DesignSystem.typography.fontSize.lg,
                        fontWeight: DesignSystem.typography.fontWeight.bold,
                        color: textColor,
                      }}
                    >
                      {new Intl.NumberFormat("vi-VN").format(
                        parseFloat(item.refund_amount)
                      )}{" "}
                      {t("currency")}
                    </Text>
                    <Text
                      style={{
                        fontSize: DesignSystem.typography.fontSize.xs,
                        color: secondaryTextColor,
                        marginTop: DesignSystem.spacing.xs,
                      }}
                    >
                      {item.refund_method || t("bankTransfer")}
                    </Text>
                  </View>
                </View>

                {/* Reason */}
                <View style={{ marginBottom: DesignSystem.spacing.sm }}>
                  <Text
                    style={{
                      fontSize: DesignSystem.typography.fontSize.sm,
                      color: secondaryTextColor,
                      fontWeight: DesignSystem.typography.fontWeight.medium,
                    }}
                  >
                    {t("reason")}: {item.reason}
                  </Text>
                </View>

                {/* Status */}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: DesignSystem.spacing.xs,
                    }}
                  >
                    <Icon
                      source={
                        item.status === "approved"
                          ? "check-circle"
                          : item.status === "pending"
                          ? "clock-outline"
                          : "close-circle"
                      }
                      size={16}
                      color={
                        item.status === "approved"
                          ? "#4CAF50"
                          : item.status === "pending"
                          ? "#FF9800"
                          : "#F44336"
                      }
                    />
                    <Text
                      style={{
                        fontSize: DesignSystem.typography.fontSize.sm,
                        color:
                          item.status === "approved"
                            ? "#4CAF50"
                            : item.status === "pending"
                            ? "#FF9800"
                            : "#F44336",
                        fontWeight: DesignSystem.typography.fontWeight.medium,
                      }}
                    >
                      {item.status === "approved"
                        ? t("approved")
                        : item.status === "pending"
                        ? t("pending")
                        : t("rejected")}
                    </Text>
                  </View>
                </View>
              </View>
            </CardCustom>
          ))}
        </View>
      </ScrollView>
    </ContainerCustom>
  );
};

export default RefundHistoryScreen;
