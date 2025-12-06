import { useScaleAnimation } from "@/components/aniamtion-scale";
import { CardCustom } from "@/components/shared/cardCustom";
import { DesignSystem, getTextColor } from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { useThemeContext } from "@/contexts/themeContext";
import { useAchievements } from "@/hooks/useHome";
import { IAchievements } from "@/types/home.type";
import { useEffect, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { Icon, Text } from "react-native-paper";
import AchievementModal from "./achievementModal";
export default function AchievementsSection({
  startLoading,
  stopLoading,
  showSnackbar,
}: {
  startLoading: () => void;
  stopLoading: () => void;
  showSnackbar: (message: string, type: "info" | "error" | "success") => void;
}) {
  const { theme } = useThemeContext();
  const { t } = useLanguageContext();
  const textColor = getTextColor(theme, "primary");
  const secondaryTextColor = getTextColor(theme, "secondary");

  const screenWidth = Dimensions.get("window").width;
  const [visible, setVisible] = useState<boolean>(false);
  const [selectedAchievement, setSelectedAchievement] =
    useState<IAchievements | null>(null);
  const [achievements, setAchievements] = useState<IAchievements[]>([]);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  // Use React Query hook
  const { data: achievementsData } = useAchievements();

  useEffect(() => {
    if (achievementsData) {
      setAchievements(achievementsData);
    }
  }, [achievementsData]);

  const { scaleValues, handlePressIn, handlePressOut } = useScaleAnimation(
    achievements.length
  );

  const handleExpandPress = () => {
    // Navigate to full Achievements listing page
    console.log(t("navigateToAchievements"));
  };

  const handleChoseAchievement = (achievement: IAchievements) => {
    const current = achievement.progress?.current ?? 0;
    const goal =
      (achievement as any).criteria?.value ??
      (achievement as any).criteria?.min_streak ??
      0;
    const completed =
      goal > 0 ? current >= goal : !!(achievement as any).is_completed;

    if (!completed) {
      showSnackbar(t("achievementLocked"), "info");
    } else {
      setSelectedAchievement(achievement);
      showModal();
    }
  };

  return (
    <>
      <View
        style={{
          width: "100%",
          gap: DesignSystem.spacing.md,
          marginTop: DesignSystem.spacing.md,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: DesignSystem.typography.fontSize.lg,
              fontWeight: DesignSystem.typography.fontWeight.bold,
              color: textColor,
            }}
          >
            {t("achievementsTitle")}
          </Text>
          <Pressable onPress={handleExpandPress} style={{ padding: 4 }}>
            <Icon source="chevron-right" size={20} color={textColor} />
          </Pressable>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 8 }}
          style={{
            width: "100%",
            paddingBottom: 5,
          }}
          snapToInterval={screenWidth * 0.85 + 12}
          decelerationRate="fast"
        >
          <View style={{ flexDirection: "row", gap: DesignSystem.spacing.md }}>
            {achievements.map((achievement, index) => {
              const current = achievement.progress?.current ?? 0;
              const goal =
                (achievement as any).criteria?.value ??
                (achievement as any).criteria?.min_streak ??
                0;
              const percent =
                goal > 0
                  ? Math.min(100, Math.round((current / goal) * 100))
                  : 0;
              const completed = percent >= 100;

              return (
                <Pressable
                  key={index}
                  onPressIn={() => handlePressIn(index)}
                  onPressOut={() => handlePressOut(index)}
                  onPress={() => handleChoseAchievement(achievement)}
                  style={{ width: screenWidth * 0.85 }}
                >
                  <Animated.View
                    style={{
                      transform: [
                        {
                          scale: scaleValues[index] || new Animated.Value(1),
                        },
                      ],
                    }}
                  >
                    <CardCustom
                      variant="card"
                      padding="lg"
                      style={{
                        borderRadius: DesignSystem.borderRadius.xl,
                        opacity: completed ? 1 : 0.6,
                        minHeight: 100,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: DesignSystem.spacing.md,
                        }}
                      >
                        <Image
                          source={{ uri: achievement.icon }}
                          style={{ width: 40, height: 40 }}
                          resizeMode="contain"
                        />

                        {/* Lock badge if not completed */}
                        {!completed && (
                          <View
                            style={{
                              position: "absolute",
                              top: -6,
                              right: -6,
                              width: 24,
                              height: 24,
                              borderRadius: 12,
                              backgroundColor:
                                theme === "light" ? "#FFFFFF" : "#1E1E1E",
                              justifyContent: "center",
                              alignItems: "center",
                              ...DesignSystem.shadows[theme].md,
                            }}
                          >
                            <Icon
                              source="lock-outline"
                              size={16}
                              color={secondaryTextColor}
                            />
                          </View>
                        )}

                        <View
                          style={{
                            flex: 1,
                            justifyContent: "center",
                          }}
                        >
                          <Text
                            style={{
                              fontSize: DesignSystem.typography.fontSize.md,
                              fontWeight:
                                DesignSystem.typography.fontWeight.bold,
                              color: textColor,
                              marginBottom: DesignSystem.spacing.xs,
                            }}
                            numberOfLines={1}
                          >
                            {achievement.name}
                          </Text>
                        </View>
                      </View>

                      <Text
                        style={{
                          fontSize: DesignSystem.typography.fontSize.sm,
                          color: secondaryTextColor,
                          lineHeight:
                            DesignSystem.typography.fontSize.sm *
                            DesignSystem.typography.lineHeight.relaxed,
                          marginTop: DesignSystem.spacing.sm,
                        }}
                        numberOfLines={3}
                      >
                        {achievement.description}
                      </Text>

                      {/* Progress bar at bottom */}
                      <View style={{ marginTop: DesignSystem.spacing.md }}>
                        <View
                          style={{
                            height: 8,
                            backgroundColor:
                              theme === "light"
                                ? "#E5E7EB"
                                : "rgba(255,255,255,0.06)",
                            borderRadius: 6,
                            overflow: "hidden",
                          }}
                        >
                          <View
                            style={{
                              width: `${percent}%`,
                              height: "100%",
                              backgroundColor: completed
                                ? "#4A90E2"
                                : "#F59E0B",
                            }}
                          />
                        </View>
                        <Text
                          style={{
                            marginTop: 6,
                            fontSize: DesignSystem.typography.fontSize.xs,
                            color: secondaryTextColor,
                          }}
                        >
                          {current}/{goal}
                        </Text>
                      </View>
                    </CardCustom>
                  </Animated.View>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      </View>

      <AchievementModal
        visible={visible}
        achievement={selectedAchievement}
        onDismiss={hideModal}
      />
    </>
  );
}
