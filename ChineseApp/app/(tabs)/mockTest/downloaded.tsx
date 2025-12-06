import { ButtonCustom } from "@/components/shared/buttonCustom";
import { CardCustom } from "@/components/shared/cardCustom";
import ConfirmModal from "@/components/shared/confirmModal";
import { ContainerCustom } from "@/components/shared/containerCustom";
import {
  DesignSystem,
  getBackgroundColor,
  getColorAtived,
  getTextColor,
} from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { useSnackbar } from "@/contexts/snackbarContext";
import { useThemeContext } from "@/contexts/themeContext";
import { useConfirmModal } from "@/hooks/useConfirmModal";
import {
  getDownloadedMockTests,
  removeDownloadedExam,
} from "@/services/mockTest";
import { IExam } from "@/types/mockTest.type";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { FlatList, Pressable, RefreshControl, View } from "react-native";
import { Icon, Text } from "react-native-paper";

export default function DownloadedTestsScreen() {
  const { theme } = useThemeContext();
  const { showSnackbar } = useSnackbar();
  const { t } = useLanguageContext();
  const [tests, setTests] = useState<IExam[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Confirm modals for different actions
  const startTestModal = useConfirmModal();
  const deleteTestModal = useConfirmModal();

  const handleFetchDownloadedTests = useCallback(
    async (isRefresh = false) => {
      try {
        if (isRefresh) {
          setIsRefreshing(true);
        }

        const res = await getDownloadedMockTests();
        if (res.status === "success") {
          setTests(res.data);
        }
      } catch (error) {
        showSnackbar(t("errorFetchingDownloadedTests"), "error");
      } finally {
        setIsRefreshing(false);
      }
    },
    [showSnackbar, t]
  );

  useEffect(() => {
    handleFetchDownloadedTests();
  }, [handleFetchDownloadedTests]);

  // Reload when screen focuses (user returns from other screens)
  useFocusEffect(
    useCallback(() => {
      handleFetchDownloadedTests();
    }, [handleFetchDownloadedTests])
  );

  const handleRefresh = () => {
    handleFetchDownloadedTests(true);
  };

  const handleDeleteTest = (testId: string, testName: string) => {
    deleteTestModal.showConfirm({
      title: t("deleteTest"),
      message: `${t("confirmDeleteTest")} "${testName}" ${t("fromDevice")}`,
      confirmText: t("deleteTest"),
      cancelText: t("cancelButton"),
      icon: "delete",
      iconColor: "#F44336",
      onConfirm: async () => {
        try {
          await removeDownloadedExam(testId);
          setTests((prevTests) =>
            prevTests.filter((test) => test.id !== testId)
          );
          showSnackbar(t("deletedTestSuccess"), "success");
        } catch (error: any) {
          showSnackbar(error.message || t("errorDeletingTest"), "error");
        }
      },
    });
  };

  const handleTestPress = (test: IExam) => {
    startTestModal.showConfirm({
      title: t("startTestTitle"),
      message: `${t("confirmStartTestMessage")}${test.name}?`,
      confirmText: t("startTestButton"),
      cancelText: t("cancelButton"),
      icon: "play-circle",
      iconColor: "#4CAF50",
      onConfirm: () => {
        router.push({
          pathname: `/mockTest/takeTest/[id]`,
          params: {
            id: test.id,
            test: JSON.stringify(test),
            offline: "true",
          },
        });
      },
    });
  };

  const renderTestCard = ({ item }: { item: IExam }) => {
    const textColor = getTextColor(theme, "primary");
    const secondaryTextColor = getTextColor(theme, "secondary");

    return (
      <CardCustom variant="card" padding="md" borderRadius="lg" shadow="sm">
        <View style={{ gap: DesignSystem.spacing.sm }}>
          {/* Header with type badge and delete button */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: DesignSystem.spacing.xs,
                paddingHorizontal: DesignSystem.spacing.sm,
                paddingVertical: DesignSystem.spacing.xs,
                borderRadius: DesignSystem.borderRadius.md,
                backgroundColor:
                  theme === "light"
                    ? "rgba(74, 144, 226, 0.1)"
                    : "rgba(74, 144, 226, 0.2)",
              }}
            >
              <Icon source="certificate" size={14} color="#4A90E2" />
              <Text
                style={{
                  fontSize: DesignSystem.typography.fontSize.xs,
                  fontWeight: DesignSystem.typography.fontWeight.semibold,
                  color: "#4A90E2",
                }}
              >
                {item.exam_type_name} {item.exam_level_name}
              </Text>
            </View>

            <Pressable
              style={{
                width: 36,
                height: 36,
                borderRadius: DesignSystem.borderRadius.full,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor:
                  theme === "light"
                    ? "rgba(244, 67, 54, 0.1)"
                    : "rgba(244, 67, 54, 0.2)",
              }}
              onPress={() => handleDeleteTest(item.id, item.name)}
            >
              <Icon source="delete" size={18} color="#F44336" />
            </Pressable>
          </View>

          {/* Title */}
          <Pressable onPress={() => handleTestPress(item)}>
            <Text
              style={{
                fontSize: DesignSystem.typography.fontSize.md,
                fontWeight: DesignSystem.typography.fontWeight.semibold,
                color: textColor,
                lineHeight:
                  DesignSystem.typography.fontSize.md *
                  DesignSystem.typography.lineHeight.normal,
              }}
            >
              {item.name}
            </Text>
          </Pressable>

          {/* Skills */}
          {item?.skills && item.skills.length > 0 && (
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: DesignSystem.spacing.xs,
                marginTop: DesignSystem.spacing.xs,
                marginBottom: 12,
              }}
            >
              {item.skills.map((skill, index) => {
                const getSkillIcon = (skillName: string) => {
                  switch (skillName.toLowerCase()) {
                    case "nghe":
                      return "headphones";
                    case "nói":
                      return "account-voice";
                    case "đọc":
                      return "book-open-page-variant";
                    case "viết":
                      return "pencil";
                    default:
                      return "circle";
                  }
                };

                return (
                  <View
                    key={index}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 4,
                      marginRight: DesignSystem.spacing.xs,
                    }}
                  >
                    <Icon
                      source={getSkillIcon(skill)}
                      size={12}
                      color={getTextColor(theme, "primary")}
                    />
                    <Text
                      style={{
                        fontSize: DesignSystem.typography.fontSize.xs,
                        color: getTextColor(theme, "primary"),
                        fontWeight: DesignSystem.typography.fontWeight.medium,
                      }}
                    >
                      {skill}
                    </Text>
                  </View>
                );
              })}
            </View>
          )}

          {/* Test info */}
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: DesignSystem.spacing.sm,
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
                source="file-document-outline"
                size={14}
                color={secondaryTextColor}
              />
              <Text
                style={{
                  fontSize: DesignSystem.typography.fontSize.xs,
                  color: secondaryTextColor,
                }}
              >
                {item.total_questions} {t("questions")}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: DesignSystem.spacing.xs,
              }}
            >
              <Icon source="clock" size={14} color={secondaryTextColor} />
              <Text
                style={{
                  fontSize: DesignSystem.typography.fontSize.xs,
                  color: secondaryTextColor,
                }}
              >
                {item.total_time_minutes} {t("minutes")}
              </Text>
            </View>
          </View>

          {/* Action button */}
          <ButtonCustom
            title={t("startTestCardButton")}
            onPress={() => handleTestPress(item)}
            size="sm"
            startColors={getColorAtived(theme)}
            endColors={getColorAtived(theme)}
            textStyle={{ color: "#fff" }}
          />
        </View>
      </CardCustom>
    );
  };

  const renderEmptyState = () => {
    const textColor = getTextColor(theme, "primary");
    const secondaryTextColor = getTextColor(theme, "secondary");

    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingVertical: DesignSystem.spacing.xxxl * 2,
          gap: DesignSystem.spacing.lg,
        }}
      >
        <Icon source="download-off" size={64} color={secondaryTextColor} />
        <Text
          style={{
            fontSize: DesignSystem.typography.fontSize.lg,
            fontWeight: DesignSystem.typography.fontWeight.semibold,
            color: textColor,
          }}
        >
          {t("noDownloadedTests")}
        </Text>
        <Text
          style={{
            fontSize: DesignSystem.typography.fontSize.base,
            color: secondaryTextColor,
            textAlign: "center",
            paddingHorizontal: DesignSystem.spacing.xxxl,
          }}
        >
          {t("downloadTestsDescription")}
        </Text>
      </View>
    );
  };

  const textColor = getTextColor(theme, "primary");

  return (
    <>
      <ContainerCustom variant="background" scrollable={false}>
        {/* Header */}
        <View
          style={{
            padding: DesignSystem.spacing.md,
            flexDirection: "row",
            alignItems: "center",
            gap: DesignSystem.spacing.md,
            backgroundColor: getBackgroundColor(theme, "primary"),
            ...DesignSystem.shadows[theme].md,
          }}
        >
          <Pressable onPress={() => router.back()}>
            <Icon source="arrow-left" size={24} color={textColor} />
          </Pressable>
          <Text
            style={{
              flex: 1,
              fontSize: DesignSystem.typography.fontSize.xl,
              fontWeight: DesignSystem.typography.fontWeight.bold,
              color: textColor,
              marginRight: 40,
            }}
          >
            {t("downloadedTestsTitle")}
          </Text>
        </View>

        {/* Tests List */}
        <FlatList
          data={tests}
          renderItem={renderTestCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            padding: DesignSystem.spacing.md,
            gap: DesignSystem.spacing.sm,
          }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyState}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={textColor}
            />
          }
        />
      </ContainerCustom>

      {/* Start Test Confirm Modal */}
      <ConfirmModal
        visible={startTestModal.modalState.visible}
        onRequestClose={startTestModal.hideConfirm}
        onConfirm={startTestModal.handleConfirm}
        title={startTestModal.modalState.title}
        message={startTestModal.modalState.message}
        confirmText={startTestModal.modalState.confirmText}
        cancelText={startTestModal.modalState.cancelText}
        icon={startTestModal.modalState.icon}
        iconColor={startTestModal.modalState.iconColor}
        variant="confirm"
      />

      {/* Delete Test Confirm Modal */}
      <ConfirmModal
        visible={deleteTestModal.modalState.visible}
        onRequestClose={deleteTestModal.hideConfirm}
        onConfirm={deleteTestModal.handleConfirm}
        title={deleteTestModal.modalState.title}
        message={deleteTestModal.modalState.message}
        confirmText={deleteTestModal.modalState.confirmText}
        cancelText={deleteTestModal.modalState.cancelText}
        icon={deleteTestModal.modalState.icon}
        iconColor={deleteTestModal.modalState.iconColor}
        variant="confirm"
      />
    </>
  );
}
