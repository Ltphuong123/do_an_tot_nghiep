import { ButtonCustom } from "@/components/shared/buttonCustom";
import { CardCustom } from "@/components/shared/cardCustom";
import { InputCustom } from "@/components/shared/inputCustom";
import SubscriptionUpgradeModal from "@/components/shared/subscriptionUpgradeModal";
import {
  DesignSystem,
  getColorAtived,
  getTextColor,
} from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { useThemeContext } from "@/contexts/themeContext";
import { createLessonAi } from "@/services/createLessonAi";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { Icon, Text } from "react-native-paper";

const AILessonCreator = ({
  isLoading,
  startLoading,
  stopLoading,
  showSnackbar,
}: {
  isLoading: boolean;
  startLoading: (message: string) => void;
  stopLoading: () => void;
  showSnackbar: (message: string, type: "success" | "error" | "info") => void;
}) => {
  const { theme } = useThemeContext();
  const { t } = useLanguageContext();
  const router = useRouter();
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [lessonTheme, setLessonTheme] = useState<string>("");
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const levels = [
    { id: "Cơ bản", label: t("basic"), icon: "star-outline", color: "#4CAF50" },
    {
      id: "Trung cấp",
      label: t("intermediate"),
      icon: "medal-outline",
      color: "#FF9800",
    },
    { id: "Cao cấp", label: t("advanced"), icon: "crown", color: "#F44336" },
  ];

  const suggestedThemes = [
    { icon: "airplane", label: t("travel") },
    { icon: "shopping", label: t("shopping") },
    { icon: "briefcase", label: t("commerce") },
    { icon: "food", label: t("cuisine") },
    { icon: "hospital-box", label: t("health") },
    { icon: "school", label: t("education") },
  ];

  const handleCreateLesson = async () => {
    if (!selectedLevel) {
      // Alert.alert(t("notification"), t("selectLevelRequired"));
      showSnackbar(t("selectLevelRequired"), "error");
      return;
    }

    if (!lessonTheme.trim()) {
      // Alert.alert(t("notification"), t("enterThemeRequired"));
      showSnackbar(t("enterThemeRequired"), "error");
      return;
    }

    startLoading(t("creatingAILesson"));

    try {
      const res = await createLessonAi(lessonTheme.trim(), selectedLevel);

      if (res.success) {
        showSnackbar(res.message || t("aiLessonCreatedSuccess"), "success");

        // Navigate to result page with data
        router.push({
          pathname: "/(tabs)/noteOrAi/aiLessonResult",
          params: { data: JSON.stringify(res.data) },
        });

        // Reset form
        setSelectedLevel("");
        setLessonTheme("");
      } else {
        showSnackbar(res.message || t("aiLessonCreatedFailed"), "error");
      }
    } catch (error: any) {
      if (
        error?.message?.includes(
          "Bạn đã đạt giới hạn tạo bài học AI trong ngày"
        )
      ) {
        setShowUpgradeModal(true);
      } else {
        showSnackbar(
          error?.message || t("aiLessonCreationFailedRetry"),
          "error"
        );
      }
    } finally {
      stopLoading();
    }
  };

  const handleUpgrade = () => {
    setShowUpgradeModal(false);
    router.push("/(tabs)/home/subscriptions");
  };

  const textColor = getTextColor(theme, "primary");
  const secondaryTextColor = getTextColor(theme, "secondary");

  return (
    <View style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={{
            padding: DesignSystem.spacing.md,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <CardCustom
            variant="card"
            padding="lg"
            borderRadius="xl"
            shadow="md"
            style={{
              alignItems: "center",
              marginBottom: DesignSystem.spacing.xl,
              marginTop: DesignSystem.spacing.md,
            }}
          >
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor:
                  theme === "light"
                    ? "rgba(156, 39, 176, 0.1)"
                    : "rgba(156, 39, 176, 0.2)",
                marginBottom: DesignSystem.spacing.md,
              }}
            >
              <Icon source="robot" size={32} color="#9C27B0" />
            </View>
            <Text
              style={{
                fontSize: DesignSystem.typography.fontSize.xxl,
                fontWeight: DesignSystem.typography.fontWeight.bold,
                color: textColor,
                marginBottom: DesignSystem.spacing.sm,
              }}
            >
              {t("aiLessonTitle")}
            </Text>
            <Text
              style={{
                fontSize: DesignSystem.typography.fontSize.sm,
                color: secondaryTextColor,
                textAlign: "center",
                paddingHorizontal: DesignSystem.spacing.lg,
                lineHeight:
                  DesignSystem.typography.lineHeight.normal *
                  DesignSystem.typography.fontSize.sm,
              }}
            >
              {t("aiDescription")}
            </Text>
          </CardCustom>

          {/* Level Selection */}
          <View style={{ marginBottom: DesignSystem.spacing.xl }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: DesignSystem.spacing.sm,
                marginBottom: DesignSystem.spacing.sm,
              }}
            >
              <Icon source="signal" size={16} color="#4A90E2" />
              <Text
                style={{
                  fontSize: DesignSystem.typography.fontSize.md,
                  fontWeight: DesignSystem.typography.fontWeight.semibold,
                  color: textColor,
                }}
              >
                {t("selectLevel")}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                gap: DesignSystem.spacing.md,
              }}
            >
              {levels.map((level) => {
                const isSelected = selectedLevel === level.id;
                return (
                  <Pressable
                    key={level.id}
                    style={{ flex: 1 }}
                    onPress={() => setSelectedLevel(level.id)}
                  >
                    <CardCustom
                      variant={isSelected ? "primary" : "card"}
                      padding="md"
                      style={{
                        borderRadius: DesignSystem.borderRadius.lg,
                        alignItems: "center",
                        gap: DesignSystem.spacing.md,
                      }}
                    >
                      <View
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: 24,
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: isSelected
                            ? "rgba(255, 255, 255, 0.3)"
                            : `${level.color}20`,
                        }}
                      >
                        <Icon
                          source={level.icon as any}
                          size={24}
                          color={isSelected ? "#FFFFFF" : level.color}
                        />
                      </View>
                      <Text
                        style={{
                          fontSize: DesignSystem.typography.fontSize.xs,
                          color: isSelected ? "#FFFFFF" : textColor,
                          fontWeight: isSelected
                            ? DesignSystem.typography.fontWeight.semibold
                            : DesignSystem.typography.fontWeight.medium,
                        }}
                      >
                        {level.label}{" "}
                      </Text>
                    </CardCustom>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Theme Input */}
          <View style={{ marginBottom: DesignSystem.spacing.xl }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: DesignSystem.spacing.sm,
                marginBottom: DesignSystem.spacing.sm,
              }}
            >
              <Icon source="lightbulb" size={16} color="#FFC107" />
              <Text
                style={{
                  fontSize: DesignSystem.typography.fontSize.md,
                  fontWeight: DesignSystem.typography.fontWeight.semibold,
                  color: textColor,
                }}
              >
                {t("enterTheme")}
              </Text>
            </View>

            <InputCustom
              value={lessonTheme}
              onChangeText={setLessonTheme}
              placeholder={t("themePlaceholder")}
              multiline
              numberOfLines={3}
              leftIcon={
                <Icon source="text" size={20} color={secondaryTextColor} />
              }
            />

            {/* Suggested Themes */}
            <View style={{ marginTop: DesignSystem.spacing.md }}>
              <Text
                style={{
                  fontSize: DesignSystem.typography.fontSize.sm,
                  color: secondaryTextColor,
                  marginBottom: DesignSystem.spacing.xs,
                }}
              >
                {t("suggestions")}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: DesignSystem.spacing.sm,
                }}
              >
                {suggestedThemes.map((suggestedTheme, index) => (
                  <Pressable
                    key={index}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: DesignSystem.spacing.xs,
                      paddingHorizontal: DesignSystem.spacing.sm,
                      paddingVertical: DesignSystem.spacing.xs,
                      borderRadius: DesignSystem.spacing.md,
                      backgroundColor:
                        theme === "light"
                          ? "rgba(74, 144, 226, 0.1)"
                          : "rgba(74, 144, 226, 0.2)",
                    }}
                    onPress={() => setLessonTheme(suggestedTheme.label)}
                  >
                    <Icon
                      source={suggestedTheme.icon as any}
                      size={14}
                      color="#4A90E2"
                    />
                    <Text
                      style={{
                        fontSize: DesignSystem.typography.fontSize.xs,
                        color: "#4A90E2",
                      }}
                    >
                      {suggestedTheme.label}{" "}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>

          {/* Create Button */}
          <ButtonCustom
            title={isLoading ? t("creatingLesson") : t("createAILessonButton")}
            onPress={handleCreateLesson}
            disabled={!selectedLevel || !lessonTheme.trim() || isLoading}
            loading={isLoading}
            startColors={getColorAtived(theme)}
            endColors={getColorAtived(theme)}
            size="lg"
            icon={<Icon source="brain" size={20} color="#FFFFFF" />}
            fullWidth
            style={{ marginTop: DesignSystem.spacing.xl }}
            textStyle={{ color: "#fff" }}
          />
        </ScrollView>
      </KeyboardAvoidingView>
      <SubscriptionUpgradeModal
        visible={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onUpgrade={handleUpgrade}
      />
    </View>
  );
};

export default AILessonCreator;
