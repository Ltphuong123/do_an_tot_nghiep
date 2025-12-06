import { ButtonCustom } from "@/components/shared/buttonCustom";
import { CardCustom } from "@/components/shared/cardCustom";
import ConfirmModal from "@/components/shared/confirmModal";
import { ContainerCustom } from "@/components/shared/containerCustom";
import {
  DesignSystem,
  getColorAtived,
  getTextColor,
} from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { useSnackbar } from "@/contexts/snackbarContext";
import { useThemeContext } from "@/contexts/themeContext";
import { useCreateAppeal, useViolations } from "@/hooks/useReport";
import { IViolationsResponse } from "@/types/report.type";
import { router } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { Icon, Text } from "react-native-paper";

export default function ViolationsHistoryScreen() {
  const { theme } = useThemeContext();
  const { t } = useLanguageContext();
  const { showSnackbar } = useSnackbar();

  const { data: violations, isLoading, error, refetch } = useViolations();
  const createAppealMutation = useCreateAppeal();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedViolationId, setSelectedViolationId] = useState<string | null>(
    null
  );
  const [appealReason, setAppealReason] = useState("");
  const [appealError, setAppealError] = useState("");

  const textColor = getTextColor(theme, "primary");
  const secondaryTextColor = getTextColor(theme, "secondary");

  const handleAppeal = (violationId: string) => {
    setSelectedViolationId(violationId);
    setAppealReason("");
    setAppealError("");
    setModalVisible(true);
  };

  const handleConfirmAppeal = async () => {
    if (!appealReason.trim()) {
      setAppealError(t("appealReasonRequired"));
      return;
    }

    if (!selectedViolationId) return;

    try {
      await createAppealMutation.mutateAsync({
        violationId: selectedViolationId,
        reason: appealReason.trim(),
      });

      setModalVisible(false);
      showSnackbar(t("appeal") + " " + t("success"), "success");
    } catch (error: any) {
      showSnackbar(error.message || t("error"), "error");
    }
  };

  const renderViolationItem = (violation: IViolationsResponse) => {
    const severityColors = {
      low: "#4CAF50",
      medium: "#FF9800",
      high: "#F44336",
    };

    return (
      <CardCustom
        key={violation.id}
        variant="card"
        borderRadius="md"
        shadow="sm"
        style={{ marginBottom: DesignSystem.spacing.md, padding: 0 }}
      >
        <View style={{ padding: DesignSystem.spacing.md }}>
          {/* Header */}
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
                fontWeight: DesignSystem.typography.fontWeight.medium,
                color:
                  severityColors[
                    violation.severity as keyof typeof severityColors
                  ] || textColor,
              }}
            >
              {violation.severity.toUpperCase()}
            </Text>
            <Text
              style={{
                fontSize: DesignSystem.typography.fontSize.xs,
                color: secondaryTextColor,
              }}
            >
              {new Date(violation.created_at).toLocaleString("vi-VN", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </View>

          {/* Rules */}
          <View style={{ marginBottom: DesignSystem.spacing.sm }}>
            <Text
              style={{
                fontSize: DesignSystem.typography.fontSize.sm,
                fontWeight: DesignSystem.typography.fontWeight.medium,
                color: textColor,
                marginBottom: DesignSystem.spacing.xs,
              }}
            >
              {t("rules")}:
            </Text>
            {violation.rules.map((rule, index) => (
              <Text
                key={index}
                style={{
                  fontSize: DesignSystem.typography.fontSize.sm,
                  color: secondaryTextColor,
                  marginLeft: DesignSystem.spacing.sm,
                }}
              >
                • {rule}
              </Text>
            ))}
          </View>

          {/* Status */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
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
                source={violation.handled ? "check-circle" : "clock-outline"}
                size={16}
                color={violation.handled ? "#4CAF50" : "#FF9800"}
              />
              <Text
                style={{
                  fontSize: DesignSystem.typography.fontSize.sm,
                  color: violation.handled ? "#4CAF50" : "#FF9800",
                }}
              >
                {violation.handled ? t("handled") : t("pending")}
              </Text>
            </View>
          </View>

          {/* Resolution */}
          {violation.resolution && (
            <View style={{ marginBottom: DesignSystem.spacing.sm }}>
              <Text
                style={{
                  fontSize: DesignSystem.typography.fontSize.sm,
                  fontWeight: DesignSystem.typography.fontWeight.medium,
                  color: textColor,
                  marginBottom: DesignSystem.spacing.xs,
                }}
              >
                {t("resolution")}: {violation.resolution}
              </Text>
            </View>
          )}

          {/* Appeal Button */}
          {violation.handled && (
            <ButtonCustom
              title={t("appeal")}
              onPress={() => handleAppeal(violation.id)}
              startColors={getColorAtived(theme)}
              endColors={getColorAtived(theme)}
              size="sm"
              fullWidth
              textStyle={{ color: "#fff" }}
            />
          )}
        </View>
      </CardCustom>
    );
  };

  if (isLoading) {
    return (
      <ContainerCustom variant="background" scrollable={false}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ color: textColor }}>{t("loading")}</Text>
        </View>
      </ContainerCustom>
    );
  }

  if (error) {
    return (
      <ContainerCustom variant="background" scrollable={false}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ color: "#F44336" }}>{t("error")}</Text>
        </View>
      </ContainerCustom>
    );
  }

  return (
    <ContainerCustom variant="background" scrollable={false}>
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
          <Pressable onPress={() => router.back()}>
            <Icon source="arrow-left" size={24} color={textColor} />
          </Pressable>
          <Text
            style={{
              fontSize: DesignSystem.typography.fontSize.xl,
              fontWeight: DesignSystem.typography.fontWeight.bold,
              color: textColor,
            }}
          >
            {t("violations")}
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
          <Pressable
            onPress={() => router.push("/home/profile/appealsHistory")}
          >
            <Icon source="history" size={24} color={textColor} />
          </Pressable>
          <Pressable onPress={() => refetch()}>
            <Icon source="refresh" size={24} color={textColor} />
          </Pressable>
        </View>
      </View>
      <ScrollView
        contentContainerStyle={{
          padding: DesignSystem.spacing.md,
          paddingBottom: DesignSystem.spacing.xl,
        }}
      >
        {/* Violations List */}
        {violations && violations.length > 0 ? (
          violations.map(renderViolationItem)
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingTop: DesignSystem.spacing.xl,
            }}
          >
            <Text style={{ color: secondaryTextColor, textAlign: "center" }}>
              {t("noData")}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Appeal Modal */}
      <ConfirmModal
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        onConfirm={handleConfirmAppeal}
        title={t("appeal")}
        message={t("enterAppealReason")}
        variant="form"
        inputValue={appealReason}
        onInputChange={setAppealReason}
        inputPlaceholder={t("appealReason")}
        inputError={appealError}
        inputMaxLength={500}
        inputMultiline={true}
        inputNumberOfLines={4}
        isLoading={createAppealMutation.isPending}
        confirmText={t("send")}
        cancelText={t("cancel")}
        icon="flag"
      />
    </ContainerCustom>
  );
}
