import { ButtonCustom } from "@/components/shared/buttonCustom";
import { CardCustom } from "@/components/shared/cardCustom";
import ConfirmModal from "@/components/shared/confirmModal";
import { ContainerCustom } from "@/components/shared/containerCustom";
import { DesignSystem, getTextColor } from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { useSnackbar } from "@/contexts/snackbarContext";
import { useThemeContext } from "@/contexts/themeContext";
import {
  useRefundMutation,
  useSubscriptionHistory,
} from "@/hooks/useSubscription";
import { router } from "expo-router";
import { useState } from "react";
import { InteractionManager, Pressable, ScrollView, View } from "react-native";
import { Icon, Text } from "react-native-paper";

const PaymentHistory = () => {
  const { theme } = useThemeContext();
  const { showSnackbar } = useSnackbar();
  const { data: historyData, isLoading } = useSubscriptionHistory();
  const refundMutation = useRefundMutation();
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [refundReason, setRefundReason] = useState("");
  const [refundError, setRefundError] = useState("");

  const textColor = getTextColor(theme, "primary");
  const secondaryTextColor = getTextColor(theme, "secondary");
  const { t } = useLanguageContext();

  const handleRefund = (item: any) => {
    setSelectedItem(item);
    setRefundReason("");
    setRefundError("");
    setShowRefundModal(true);
  };

  const confirmRefund = () => {
    if (!refundReason.trim()) {
      setRefundError(t("refundReasonRequired"));
      return;
    }

    refundMutation.mutate(
      { paymentId: selectedItem.id, reason: refundReason.trim() },
      {
        onSuccess: (res) => {
          if (res.success) {
            showSnackbar(t("refundRequestSuccess"), "success");
            setShowRefundModal(false);
            setSelectedItem(null);
            setRefundReason("");
            setRefundError("");
          } else {
            showSnackbar(res.message || t("errorOccurred"), "error");
          }
        },
        onError: (error: any) => {
          showSnackbar(error?.message || t("refundError"), "error");
        },
      }
    );
  };

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
            {t("paymentHistory")}
          </Text>
        </View>
        <Pressable
          onPress={() =>
            router.replace("/(tabs)/home/subscriptions/refundHistory")
          }
        >
          <Icon source="cash-refund" size={24} color={textColor} />
        </Pressable>
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
          {historyData?.data?.map((item: any, index) => (
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
                      {item.subscription_name}
                    </Text>
                    <Text
                      style={{
                        fontSize: DesignSystem.typography.fontSize.sm,
                        color: secondaryTextColor,
                      }}
                    >
                      {new Date(item.transaction_date).toLocaleDateString(
                        "vi-VN"
                      )}
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
                        parseFloat(item.amount)
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
                      {item.payment_method === "bank_transfer"
                        ? t("bankTransfer")
                        : item.payment_method}
                    </Text>
                  </View>
                </View>

                {/* Status */}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: DesignSystem.spacing.sm,
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
                        item.status === "manual_confirmed"
                          ? "check-circle"
                          : item.status === "pending"
                          ? "clock-outline"
                          : "alert-circle"
                      }
                      size={16}
                      color={
                        item.status === "manual_confirmed"
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
                          item.status === "manual_confirmed"
                            ? "#4CAF50"
                            : item.status === "pending"
                            ? "#FF9800"
                            : "#F44336",
                        fontWeight: DesignSystem.typography.fontWeight.medium,
                      }}
                    >
                      {item.status === "manual_confirmed"
                        ? t("confirmed")
                        : item.status === "pending"
                        ? t("processing")
                        : t("failed")}
                    </Text>
                  </View>

                  {/* Refund Button */}
                  {item.status === "manual_confirmed" && (
                    <ButtonCustom
                      title={t("refund")}
                      onPress={() => handleRefund(item)}
                      size="sm"
                      startColors="#F44336"
                      endColors="#D32F2F"
                      textStyle={{ color: "#fff" }}
                    />
                  )}
                </View>
              </View>
            </CardCustom>
          ))}
        </View>
      </ScrollView>

      {/* Refund Modal */}
      <ConfirmModal
        visible={showRefundModal}
        onRequestClose={() => setShowRefundModal(false)}
        onConfirm={confirmRefund}
        title={t("refundRequest")}
        message={`${t("confirmRefundMessage")} "${
          selectedItem?.subscription_name
        }"?`}
        confirmText={t("sendRequest")}
        cancelText={t("cancel")}
        icon="cash-refund"
        iconColor="#F44336"
        variant="form"
        inputValue={refundReason}
        onInputChange={setRefundReason}
        inputPlaceholder={t("enterRefundReason")}
        inputError={refundError}
        inputMaxLength={200}
        isLoading={refundMutation.isPending}
        confirmDisabled={!refundReason.trim() || refundMutation.isPending}
      />
    </ContainerCustom>
  );
};

export default PaymentHistory;
