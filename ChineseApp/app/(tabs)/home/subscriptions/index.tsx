import {
  DesignSystem,
  getColorAtived,
  getGradient,
  getTextColor,
} from "@/constants/designSystem";

import { ButtonCustom } from "@/components/shared/buttonCustom";
import { CardCustom } from "@/components/shared/cardCustom";
import ConfirmModal from "@/components/shared/confirmModal";
import { ContainerCustom } from "@/components/shared/containerCustom";
import HtmlRenderer from "@/components/shared/htmlRenderer";
import ModalPayment from "@/components/shared/modalPayment";
import { useLanguageContext } from "@/contexts/languageContext";
import { useSnackbar } from "@/contexts/snackbarContext";
import { useThemeContext } from "@/contexts/themeContext";
import {
  useBuySubscription,
  useRequestPayment,
  useSubscriptionHistory,
  useSubscriptions,
} from "@/hooks/useSubscription";
import { getMe } from "@/services/profile";
import { useUserStore } from "@/store/useUserStore";
import { ISubscription, TransferInfo } from "@/types/subscription.type";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { InteractionManager, Pressable, ScrollView, View } from "react-native";
import { Icon, Text } from "react-native-paper";

export default function SubscriptionsScreen() {
  const { theme } = useThemeContext();
  const textColor = getTextColor(theme, "primary");
  const { data: subscriptionsData } = useSubscriptions();
  const { data: historyData } = useSubscriptionHistory();
  const { user } = useUserStore();
  const { setUser } = useUserStore();
  const buyMutation = useBuySubscription();
  const requestPaymentMutation = useRequestPayment();
  const plans = useMemo(
    () => subscriptionsData?.data || [],
    [subscriptionsData]
  );
  const [subsectionSelect, setSubsectionSelect] =
    useState<ISubscription | null>(null);
  const primaryColor = getGradient(theme, "primary")[0] || "#667eea";
  const { showSnackbar } = useSnackbar();
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [modalPaymentVisible, setModalPaymentVisible] = useState(false);
  const [transferInfo, setTransferInfo] = useState<TransferInfo | null>(null);
  const { t } = useLanguageContext();
  const queryClient = useQueryClient();

  // Set default selected plan when data loads
  useEffect(() => {
    if (plans.length > 0 && !subsectionSelect) {
      const firstAvailable = plans.find(
        (plan) =>
          plan.id !== user.subscription?.id &&
          !historyData?.data?.some(
            (item: any) =>
              item.subscription_id === plan.id && item.status === "pending"
          )
      );
      setSubsectionSelect(firstAvailable || plans[0]);
    }
  }, [plans, subsectionSelect, user.subscription?.id, historyData]);

  const priceLabel = useMemo(() => {
    const p = plans.find((x) => x.id === subsectionSelect?.id);
    if (!p) return "";
    const formatted = new Intl.NumberFormat("vi-VN").format(p.price);
    return `${formatted} đ`;
  }, [plans, subsectionSelect]);

  const handleConfirm = () => {
    if (!subsectionSelect) return;
    requestPaymentMutation.mutate(subsectionSelect.id, {
      onSuccess: (res) => {
        if (res.success) {
          setTransferInfo(res.data.transferInfo);
          setModalPaymentVisible(true);
        } else {
          showSnackbar(t("paymentRequestFailed"), "error");
        }
      },
      onError: (error) => {
        showSnackbar(t("paymentRequestError"), "error");
      },
    });
  };

  const handleConfirmPurchase = () => {
    if (!subsectionSelect) return;
    setConfirmModalVisible(false);
    setModalPaymentVisible(true);
  };

  const handleBuyWithProof = (manual_proof_url: string) => {
    if (!subsectionSelect) return;
    buyMutation.mutate(
      { subscription: subsectionSelect, manual_proof_url },
      {
        onSuccess: async (res) => {
          if (res.success) {
            showSnackbar(t("subscriptionPurchaseSuccess"), "success");
            // Invalidate history and user to refresh
            queryClient.invalidateQueries({
              queryKey: ["subscriptions", "history"],
            });
            queryClient.invalidateQueries({
              queryKey: ["user"],
            });
            // Update user store with new subscription
            try {
              const userRes = await getMe();
              if (userRes.success) {
                setUser(userRes.data);
              }
            } catch (error) {
              console.error("Failed to refresh user data:", error);
            }
            setModalPaymentVisible(false); // Đóng modal khi thành công
            setTransferInfo(null); // Reset transfer info
          }
        },
        onError: (error) => {
          showSnackbar(t("subscriptionPurchaseError"), "error");
          setModalPaymentVisible(true); // Mở lại modal nếu lỗi để thử lại
        },
      }
    );
  };

  return (
    <ContainerCustom>
      <View
        style={{
          padding: DesignSystem.spacing.md,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            flex: 1,
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
            Gói đăng ký
          </Text>
        </View>
        <Pressable
          onPress={() =>
            router.push("/(tabs)/home/subscriptions/subscriptonHistory")
          }
        >
          <Icon source="history" size={24} color={textColor} />
        </Pressable>
        <Pressable
          style={{ marginLeft: 16 }}
          onPress={() =>
            router.push("/(tabs)/home/subscriptions/paymentHistory")
          }
        >
          <Icon source="credit-card" size={24} color={textColor} />
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
          {plans.map((plan) => {
            const selected = plan.id === subsectionSelect?.id;
            const isCurrent = plan.id === user.subscription?.id;
            const hasPending = historyData?.data?.some(
              (item: any) =>
                item.subscription_id === plan.id && item.status === "pending"
            );
            return (
              <Pressable
                key={plan.id}
                onPress={() => setSubsectionSelect(plan)}
              >
                <CardCustom
                  variant={selected ? "primary" : "card"}
                  padding="md"
                  style={{
                    shadowColor: "#000",
                    shadowOpacity: selected ? 0.15 : 0.05,
                    shadowRadius: 12,
                    elevation: selected ? 8 : 2,
                  }}
                >
                  <View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginBottom: DesignSystem.spacing.md,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <Icon
                          source={
                            plan.name.includes("Lifetime")
                              ? "crown"
                              : plan.name.includes("Yearly")
                              ? "star"
                              : "diamond"
                          }
                          size={20}
                          color={selected ? "#fff" : primaryColor}
                        />
                        <Text
                          style={{
                            fontSize: DesignSystem.typography.fontSize.base,
                            fontWeight: DesignSystem.typography.fontWeight.bold,
                            color: selected ? "#fff" : textColor,
                          }}
                        >
                          {plan.name}
                        </Text>
                        {isCurrent && (
                          <Text
                            style={{
                              fontSize: DesignSystem.typography.fontSize.sm,
                              color: "#4CAF50",
                              fontWeight:
                                DesignSystem.typography.fontWeight.semibold,
                            }}
                          >
                            {`(${t("currentlyUsing")})`}
                          </Text>
                        )}
                        {hasPending && !isCurrent && (
                          <Text
                            style={{
                              fontSize: DesignSystem.typography.fontSize.sm,
                              color: "#FF9800",
                              fontWeight:
                                DesignSystem.typography.fontWeight.semibold,
                            }}
                          >
                            {`(${t("pendingProcessing")})`}
                          </Text>
                        )}
                      </View>
                      <Text
                        style={{
                          fontSize: DesignSystem.typography.fontSize.base,
                          fontWeight: DesignSystem.typography.fontWeight.bold,
                          color: selected ? "#fff" : textColor,
                        }}
                      >
                        {new Intl.NumberFormat("vi-VN").format(plan.price)} đ
                      </Text>
                    </View>

                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 6,
                        marginTop: 6,
                      }}
                    >
                      <Icon
                        source={plan.duration_months ? "calendar" : "infinity"}
                        size={14}
                        color={selected ? "#fff" : textColor}
                      />
                      <Text
                        style={{
                          color: selected ? "#fff" : textColor,
                          opacity: 0.9,
                          fontSize: DesignSystem.typography.fontSize.sm,
                        }}
                      >
                        {plan.duration_months
                          ? `Thời hạn ${plan.duration_months} tháng`
                          : "Vĩnh viễn "}
                      </Text>
                    </View>

                    {/* Description */}
                    {plan.description?.html && (
                      <View style={{ marginTop: 8 }}>
                        <HtmlRenderer
                          htmlContent={plan.description.html}
                          theme={theme}
                          fontSize={12}
                          textAlign="left"
                          key={`${plan.id}-${theme}`}
                        />
                      </View>
                    )}

                    <View
                      style={{
                        gap: 4,
                        marginTop: DesignSystem.spacing.sm,
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <Icon
                          source="translate"
                          size={16}
                          color={selected ? "#fff" : "#4CAF50"}
                        />
                        <Text
                          style={{
                            fontSize: DesignSystem.typography.fontSize.sm,
                            color: selected ? "#fff" : textColor,
                          }}
                        >
                          {plan.daily_quota_translate} lượt dịch/tháng{" "}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <Icon
                          source="brain"
                          size={16}
                          color={selected ? "#fff" : "#2196F3"}
                        />
                        <Text
                          style={{
                            fontSize: DesignSystem.typography.fontSize.sm,
                            color: selected ? "#fff" : textColor,
                          }}
                        >
                          {plan.daily_quota_ai_lesson} bài học AI/tháng{" "}
                        </Text>
                      </View>
                    </View>

                    {isCurrent && (
                      <View
                        style={{
                          marginTop: DesignSystem.spacing.sm,
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: DesignSystem.typography.fontSize.sm,
                            color: selected ? "#fff" : textColor,
                          }}
                        >
                          (Đang sử dụng)
                        </Text>
                      </View>
                    )}
                  </View>
                </CardCustom>
              </Pressable>
            );
          })}
        </View>

        <View
          style={{
            marginTop: DesignSystem.spacing.xl,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
            >
              <Icon source="tag" size={16} color={textColor} />
              <Text
                style={{
                  color: textColor,
                  fontSize: DesignSystem.typography.fontSize.sm,
                }}
              >
                Giá: {priceLabel}
              </Text>
            </View>
          </View>
          <ButtonCustom
            title="Mua ngay"
            onPress={handleConfirm}
            size="sm"
            icon={<Icon source="shopping" size={18} color="#fff" />}
            startColors={getColorAtived(theme)}
            endColors={getColorAtived(theme)}
            textStyle={{ color: "#fff" }}
            disabled={
              subsectionSelect?.id === user.subscription?.id ||
              historyData?.data?.some(
                (item: any) =>
                  item.subscription_id === subsectionSelect?.id &&
                  item.status === "pending"
              ) ||
              subsectionSelect?.name.includes("Free")
            }
          />
        </View>
      </ScrollView>

      <ConfirmModal
        visible={confirmModalVisible}
        onRequestClose={() => setConfirmModalVisible(false)}
        onConfirm={handleConfirmPurchase}
        title="Xác nhận mua gói"
        message={`Bạn có chắc muốn mua gói ${subsectionSelect?.name}?`}
        confirmText="Xác nhận"
        cancelText="Hủy"
        icon="shopping"
        iconColor="#4CAF50"
      />

      <ModalPayment
        visible={modalPaymentVisible}
        transferInfo={transferInfo}
        onClose={() => setModalPaymentVisible(false)}
        onConfirmTransfer={handleBuyWithProof}
        isLoading={buyMutation.isPending}
      />
    </ContainerCustom>
  );
}
