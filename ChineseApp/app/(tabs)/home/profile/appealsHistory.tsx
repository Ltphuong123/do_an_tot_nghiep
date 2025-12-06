import { CardCustom } from "@/components/shared/cardCustom";
import { ContainerCustom } from "@/components/shared/containerCustom";
import { DesignSystem, getTextColor } from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { useThemeContext } from "@/contexts/themeContext";
import { useAppeals } from "@/hooks/useReport";
import { UserViolation } from "@/types/report.type";
import { router } from "expo-router";
import React from "react";
import { Pressable, ScrollView, View } from "react-native";
import { Icon, Text } from "react-native-paper";

const AppealsHistory = () => {
  const { theme } = useThemeContext();
  const { t } = useLanguageContext();

  const { data: appeals, isLoading, error } = useAppeals();
  console.log("Appeals data:", appeals);

  const textColor = getTextColor(theme, "primary");
  const secondaryTextColor = getTextColor(theme, "secondary");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "#FF9800";
      case "resolved":
        return "#4CAF50";
      case "rejected":
        return "#F44336";
      default:
        return secondaryTextColor;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return t("statusPending");
      case "resolved":
        return t("statusResolved");
      case "rejected":
        return t("statusRejected");
      default:
        return status;
    }
  };

  const renderAppealItem = (appeal: UserViolation) => {
    const snapshot = appeal.violation_snapshot;

    return (
      <CardCustom
        key={appeal.id}
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
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: DesignSystem.spacing.sm,
              }}
            >
              <View
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: getStatusColor(appeal.status),
                }}
              />
              <Text
                style={{
                  fontSize: DesignSystem.typography.fontSize.sm,
                  fontWeight: DesignSystem.typography.fontWeight.medium,
                  color: getStatusColor(appeal.status),
                }}
              >
                {getStatusText(appeal.status)}
              </Text>
            </View>
            <Text
              style={{
                fontSize: DesignSystem.typography.fontSize.xs,
                color: secondaryTextColor,
              }}
            >
              {new Date(appeal.created_at).toLocaleString("vi-VN", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </View>

          {/* Reason */}
          <View style={{ marginBottom: DesignSystem.spacing.sm }}>
            <Text
              style={{
                fontSize: DesignSystem.typography.fontSize.sm,
                fontWeight: DesignSystem.typography.fontWeight.medium,
                color: textColor,
                marginBottom: DesignSystem.spacing.xs,
              }}
            >
              {t("reason")}:
            </Text>
            <Text
              style={{
                fontSize: DesignSystem.typography.fontSize.sm,
                color: secondaryTextColor,
              }}
            >
              {appeal.reason}
            </Text>
          </View>

          {/* Violation Details */}
          <View style={{ marginBottom: DesignSystem.spacing.sm }}>
            <Text
              style={{
                fontSize: DesignSystem.typography.fontSize.sm,
                fontWeight: DesignSystem.typography.fontWeight.medium,
                color: textColor,
                marginBottom: DesignSystem.spacing.xs,
              }}
            >
              {t("violationDetails")}:
            </Text>
            <View style={{ gap: DesignSystem.spacing.xs }}>
              <Text
                style={{
                  fontSize: DesignSystem.typography.fontSize.sm,
                  color: secondaryTextColor,
                }}
              >
                • {t("severity")}: {snapshot.severity}
              </Text>
              <Text
                style={{
                  fontSize: DesignSystem.typography.fontSize.sm,
                  color: secondaryTextColor,
                }}
              >
                • {t("targetType")}: {snapshot.target_type}
              </Text>
              {snapshot.resolution && (
                <Text
                  style={{
                    fontSize: DesignSystem.typography.fontSize.sm,
                    color: secondaryTextColor,
                  }}
                >
                  • {t("resolution")}: {snapshot.resolution}
                </Text>
              )}
            </View>
          </View>

          {/* Resolved Info */}
          {appeal.resolved_at && (
            <View style={{ marginTop: DesignSystem.spacing.sm }}>
              <Text
                style={{
                  fontSize: DesignSystem.typography.fontSize.xs,
                  color: secondaryTextColor,
                }}
              >
                {t("resolvedAt")}:{" "}
                {new Date(appeal.resolved_at).toLocaleString("vi-VN", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
              {appeal.notes && (
                <Text
                  style={{
                    fontSize: DesignSystem.typography.fontSize.xs,
                    color: secondaryTextColor,
                    marginTop: DesignSystem.spacing.xs,
                  }}
                >
                  {t("notes")}: {appeal.notes}
                </Text>
              )}
            </View>
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
            {t("appeals")}
          </Text>
        </View>
      </View>
      <ScrollView
        contentContainerStyle={{
          padding: DesignSystem.spacing.md,
          paddingBottom: DesignSystem.spacing.xl,
        }}
      >
        {/* Appeals List */}
        {appeals && appeals.length > 0 ? (
          appeals.map(renderAppealItem)
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
    </ContainerCustom>
  );
};

export default AppealsHistory;
