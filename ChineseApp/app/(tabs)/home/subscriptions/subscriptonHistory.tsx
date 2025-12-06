import { CardCustom } from "@/components/shared/cardCustom";
import { ContainerCustom } from "@/components/shared/containerCustom";
import { DesignSystem, getTextColor } from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { useSnackbar } from "@/contexts/snackbarContext";
import { useThemeContext } from "@/contexts/themeContext";
import {
  useToggleAutoRenew,
  useUserSubscription,
} from "@/hooks/useSubscription";
import { useUserStore } from "@/store/useUserStore";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useState } from "react";
import { InteractionManager, Pressable, Switch, View } from "react-native";
import { ActivityIndicator, Icon, Text } from "react-native-paper";

const SubscriptionHistory = () => {
  const { theme } = useThemeContext();
  const { showSnackbar } = useSnackbar();
  const { user } = useUserStore();
  const { data: userSubscriptionData } = useUserSubscription(user?.id || "");

  const toggleAutoRenewMutation = useToggleAutoRenew();
  const queryClient = useQueryClient();
  const [togglingIds, setTogglingIds] = useState<Set<number>>(new Set());

  const textColor = getTextColor(theme, "primary");
  const secondaryTextColor = getTextColor(theme, "secondary");
  const { t } = useLanguageContext();

  return (
    <ContainerCustom>
      {/* Header */}
      <View
        style={{
          padding: DesignSystem.spacing.md,
          flexDirection: "row",
          alignItems: "center",
          gap: DesignSystem.spacing.md,
          ...DesignSystem.shadows[theme].md,
        }}
      >
        <Pressable
          onPress={() => {
            InteractionManager.runAfterInteractions(() => {
              router.back();
            });
          }}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor:
              theme === "light"
                ? "rgba(0, 0, 0, 0.05)"
                : "rgba(255, 255, 255, 0.1)",
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
          {t("subscriptionHistory")}
        </Text>
      </View>

      {/* Current Subscription Section */}
      {userSubscriptionData?.data && userSubscriptionData.data.length > 0 && (
        <View style={{ padding: DesignSystem.spacing.md }}>
          <Text
            style={{
              fontSize: DesignSystem.typography.fontSize.lg,
              fontWeight: DesignSystem.typography.fontWeight.bold,
              color: textColor,
              marginBottom: DesignSystem.spacing.md,
            }}
          >
            {t("subscriptionList")}
          </Text>
          <View style={{ gap: DesignSystem.spacing.md }}>
            {userSubscriptionData.data.map(
              (subscription: any, index: number) => (
                <CardCustom
                  key={subscription.id || index}
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
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: DesignSystem.spacing.md,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: DesignSystem.typography.fontSize.base,
                          fontWeight: DesignSystem.typography.fontWeight.bold,
                          color: textColor,
                        }}
                      >
                        {subscription.subscriptionName}
                      </Text>
                      <Text
                        style={{
                          fontSize: DesignSystem.typography.fontSize.sm,
                          color: secondaryTextColor,
                        }}
                      >
                        {subscription.is_active ? t("active") : t("inactive")}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: DesignSystem.spacing.sm,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: DesignSystem.typography.fontSize.sm,
                          color: secondaryTextColor,
                        }}
                      >
                        {t("startDate")}{" "}
                        {new Date(subscription.start_date).toLocaleDateString(
                          "vi-VN"
                        )}
                      </Text>
                      <Text
                        style={{
                          fontSize: DesignSystem.typography.fontSize.sm,
                          color: secondaryTextColor,
                        }}
                      >
                        {t("expiryDate")}{" "}
                        {subscription.expiry_date
                          ? new Date(
                              subscription.expiry_date
                            ).toLocaleDateString("vi-VN")
                          : t("unlimited")}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: DesignSystem.typography.fontSize.sm,
                          color: textColor,
                        }}
                      >
                        {t("autoRenew")}
                      </Text>
                      <View style={{ position: "relative" }}>
                        <Switch
                          value={subscription.auto_renew}
                          onValueChange={(value) => {
                            setTogglingIds((prev) =>
                              new Set(prev).add(subscription.id)
                            );
                            toggleAutoRenewMutation.mutate(
                              {
                                userSubscriptionId: subscription.id,
                                autoRenew: value,
                              },
                              {
                                onSuccess: () => {
                                  showSnackbar(
                                    value
                                      ? t("autoRenewEnabled")
                                      : t("autoRenewDisabled"),
                                    "success"
                                  );
                                  queryClient.invalidateQueries({
                                    queryKey: ["userSubscription", user?.id],
                                  });
                                  setTogglingIds((prev) => {
                                    const newSet = new Set(prev);
                                    newSet.delete(subscription.id);
                                    return newSet;
                                  });
                                },
                                onError: () => {
                                  showSnackbar(
                                    t("autoRenewChangeFailed"),
                                    "error"
                                  );
                                  setTogglingIds((prev) => {
                                    const newSet = new Set(prev);
                                    newSet.delete(subscription.id);
                                    return newSet;
                                  });
                                },
                              }
                            );
                          }}
                          trackColor={{ false: "#767577", true: "#81b0ff" }}
                          thumbColor="#f4f3f4"
                          disabled={togglingIds.has(subscription.id)}
                        />
                        {togglingIds.has(subscription.id) && (
                          <View
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              justifyContent: "center",
                              alignItems: "center",
                              backgroundColor: "rgba(255, 255, 255, 0.7)",
                              borderRadius: 16,
                            }}
                          >
                            <ActivityIndicator size="small" color={textColor} />
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                </CardCustom>
              )
            )}
          </View>
        </View>
      )}
    </ContainerCustom>
  );
};

export default SubscriptionHistory;
