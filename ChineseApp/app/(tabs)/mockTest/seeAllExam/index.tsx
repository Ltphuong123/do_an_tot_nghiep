import { CardCustom } from "@/components/shared/cardCustom";
import ConfirmModal from "@/components/shared/confirmModal";
import { ContainerCustom } from "@/components/shared/containerCustom";
import { DownloadButton } from "@/components/shared/downloadButton";
import {
  DesignSystem,
  getBackgroundColor,
  getIconColor,
  getTextColor,
} from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { useThemeContext } from "@/contexts/themeContext";
import { useConfirmModal } from "@/hooks/useConfirmModal";
import { useExamLevels, useMockTests } from "@/hooks/useMockTest";
import { IExam, IExamLevel, IExamType } from "@/types/mockTest.type";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, View } from "react-native";
import { Icon, Text } from "react-native-paper";
import LevelTabs from "../components/levelTabs";

const SeeAllExamScreen = () => {
  const { theme } = useThemeContext();
  const { t } = useLanguageContext();
  const router = useRouter();
  const { modalState, showConfirm, hideConfirm, handleConfirm } =
    useConfirmModal();

  // Get exam type info from params
  const params = useLocalSearchParams();
  const examType: IExamType = params.examType
    ? JSON.parse(params.examType as string)
    : null;

  const [selectedLevel, setSelectedLevel] = useState<IExamLevel | undefined>();

  // Use React Query hooks
  const { data: examLevels } = useExamLevels(examType?.id || "");
  const { data: exams, isLoading: isLoadingExams } = useMockTests(
    examType?.id,
    selectedLevel?.id
  );

  // Set default selected level when examLevels load
  useEffect(() => {
    if (examLevels && examLevels.length > 0 && !selectedLevel) {
      setSelectedLevel(examLevels[0]);
    }
  }, [examLevels, selectedLevel]);

  const handleTestPress = (test: IExam) => {
    showConfirm({
      title: t("startTest"),
      message: t("confirmStartTest") + test.name + "?",
      confirmText: t("start"),
      cancelText: t("cancel"),
      icon: "play-circle",
      iconColor: "#4CAF50",
      onConfirm: () => {
        router.push({
          pathname: `/mockTest/takeTest/[id]`,
          params: { id: test.id, test: JSON.stringify(test) },
        });
      },
    });
  };

  const handleLevelSelect = (level: IExamLevel) => {
    setSelectedLevel(level);
  };

  const renderExamItem = ({ item }: { item: IExam }) => {
    return (
      <Pressable
        onPress={() => handleTestPress(item)}
        style={{ marginHorizontal: 16, marginBottom: 12 }}
      >
        {/* Title */}
        <CardCustom variant="card">
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <Icon
              source="file-document-outline"
              size={20}
              color={getIconColor(theme, "primary")}
            />
            <Text
              style={{
                fontSize: DesignSystem.typography.fontSize.lg,
                fontWeight: DesignSystem.typography.fontWeight.bold,
                color: getTextColor(theme, "primary"),
                marginLeft: 8,
                flex: 1,
              }}
              numberOfLines={2}
            >
              {item.name}
            </Text>

            {/* Download Button */}
            <DownloadButton
              exam={item}
              size={22}
              onDownloadStart={() => {}}
              onDownloadSuccess={() => {}}
              onDownloadError={() => {}}
            />
          </View>

          {/* Description */}
          {item.description?.html && (
            <Text
              style={{
                fontSize: DesignSystem.typography.fontSize.sm,
                color: getTextColor(theme, "secondary"),
                marginBottom: 12,
                lineHeight: 20,
              }}
              numberOfLines={3}
            >
              {item.description.html.replace(/<[^>]*>/g, "")}
            </Text>
          )}

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
                      {skill === "nghe"
                        ? t("listening")
                        : skill === "nói"
                        ? t("speaking")
                        : skill === "đọc"
                        ? t("reading")
                        : skill === "viết"
                        ? t("writing")
                        : skill}
                    </Text>
                  </View>
                );
              })}
            </View>
          )}

          {/* Info Row */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {/* Questions count */}
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Icon
                source="help-circle-outline"
                size={16}
                color={getIconColor(theme, "neutral")}
              />
              <Text
                style={{
                  color: getTextColor(theme, "primary"),
                  marginLeft: 4,
                  fontSize: DesignSystem.typography.fontSize.sm,
                }}
              >
                {item.total_questions} {t("questions")}
              </Text>
            </View>

            {/* Duration */}
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Icon
                source="clock-outline"
                size={16}
                color={getIconColor(theme, "neutral")}
              />
              <Text
                style={{
                  color: getTextColor(theme, "primary"),
                  marginLeft: 4,
                  fontSize: DesignSystem.typography.fontSize.sm,
                }}
              >
                {item.total_time_minutes} {t("minutes")}
              </Text>
            </View>

            {/* Level */}
            <View
              style={{
                backgroundColor: getBackgroundColor(theme, "elevated"),
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: DesignSystem.borderRadius.sm,
              }}
            >
              <Text
                style={{
                  color: getTextColor(theme, "primary"),
                  fontSize: DesignSystem.typography.fontSize.xs,
                  fontWeight: DesignSystem.typography.fontWeight.semibold,
                }}
              >
                {item.exam_level_name}
              </Text>
            </View>
          </View>
        </CardCustom>
      </Pressable>
    );
  };

  if (!examType) {
    return (
      <ContainerCustom variant="background">
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ color: getTextColor(theme, "primary") }}>
            {t("noExamTypeInfo")}
          </Text>
        </View>
      </ContainerCustom>
    );
  }

  return (
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
          onPress={() => router.back()}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: getBackgroundColor(theme, "secondary"),
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon
            source="arrow-left"
            size={24}
            color={getTextColor(theme, "primary")}
          />
        </Pressable>

        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: getBackgroundColor(theme, "elevated"),
              marginRight: 12,
            }}
          >
            <Icon
              source="certificate"
              size={18}
              color={getIconColor(theme, "primary")}
            />
          </View>
          <Text
            style={{
              flex: 1,
              fontSize: DesignSystem.typography.fontSize.xl,
              fontWeight: DesignSystem.typography.fontWeight.bold,
              color: getTextColor(theme, "primary"),
            }}
          >
            {examType.name}
          </Text>
        </View>
      </View>

      {/* Level Tabs */}
      {examLevels && examLevels.length > 0 && (
        <View>
          <LevelTabs
            levels={examLevels}
            selectedLevel={selectedLevel}
            onSelectLevel={handleLevelSelect}
          />
        </View>
      )}

      {/* Exams List */}
      <View style={{ flex: 1 }}>
        {isLoadingExams ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator size="large" />
            <Text
              style={{
                color: getTextColor(theme, "primary"),
                marginTop: 8,
                fontSize: DesignSystem.typography.fontSize.sm,
              }}
            >
              {t("loadingTests")}
            </Text>
          </View>
        ) : (
          <FlatList
            data={exams}
            keyExtractor={(item: IExam) => item.id}
            renderItem={renderExamItem}
            contentContainerStyle={{
              paddingBottom: 20,
              paddingTop: 12,
            }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={{ padding: 40, alignItems: "center" }}>
                <Icon
                  source="alert-circle-outline"
                  size={48}
                  color={getTextColor(theme, "secondary")}
                />
                <Text
                  style={{
                    color: getTextColor(theme, "secondary"),
                    marginTop: 12,
                    fontSize: DesignSystem.typography.fontSize.md,
                    textAlign: "center",
                  }}
                >
                  {t("noTestsForLevel")}
                </Text>
              </View>
            }
          />
        )}
      </View>

      {/* Confirm Modal */}
      <ConfirmModal
        visible={modalState.visible}
        onRequestClose={hideConfirm}
        onConfirm={handleConfirm}
        title={modalState.title}
        message={modalState.message}
        confirmText={modalState.confirmText}
        cancelText={modalState.cancelText}
        icon={modalState.icon}
        iconColor={modalState.iconColor}
        variant="confirm"
      />
    </ContainerCustom>
  );
};

export default SeeAllExamScreen;
