import AvatarCustom from "@/components/shared/avatarCustom";
import { CardCustom } from "@/components/shared/cardCustom";
import {
  DesignSystem,
  getColorAtived,
  getTextColor,
} from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { useThemeContext } from "@/contexts/themeContext";
import { useExamTypes, useLeaderboardByExamType } from "@/hooks/useMockTest";
import { IExamType } from "@/types/mockTest.type";

import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import { Text } from "react-native-paper";

export default function MockTestLeaderboard() {
  const [selectedExamType, setSelectedExamType] = useState<IExamType | null>(
    null
  );
  const { theme } = useThemeContext();
  const textColor = getTextColor(theme, "primary");
  const secondaryTextColor = getTextColor(theme, "secondary");
  const { t } = useLanguageContext();

  // Use React Query hooks
  const { data: examTypes } = useExamTypes();
  const { data: leaderboard } = useLeaderboardByExamType(
    selectedExamType?.id || ""
  );

  // Auto-select first exam type
  useEffect(() => {
    if (examTypes && examTypes.length > 0 && !selectedExamType) {
      setSelectedExamType(examTypes[0]);
    }
  }, [examTypes, selectedExamType]);

  const getRankColor = (index: number) => {
    if (index === 0) return "#FFD700"; // Gold
    if (index === 1) return "#C0C0C0"; // Silver
    if (index === 2) return "#CD7F32"; // Bronze
    return textColor;
  };

  function handleExamTypeChange(type: IExamType): void {
    setSelectedExamType(type);
  }

  return (
    <View style={{ width: "100%", gap: DesignSystem.spacing.md }}>
      <Text
        style={{
          fontSize: DesignSystem.typography.fontSize.lg,
          fontWeight: DesignSystem.typography.fontWeight.bold,
          color: textColor,
        }}
      >
        {t("Bảng xếp hạng thi thử")}
      </Text>

      <CardCustom
        variant="card"
        padding="md"
        style={{
          borderRadius: DesignSystem.borderRadius.lg,
          width: "100%",
        }}
      >
        {/* Simple Tabs */}
        <View
          style={{
            flexDirection: "row",
            // backgroundColor: ,
            borderRadius: DesignSystem.borderRadius.md,
            padding: 2,
            marginBottom: DesignSystem.spacing.md,
          }}
        >
          {examTypes &&
            examTypes.map((type) => (
              <Pressable
                key={type.id}
                onPress={() => handleExamTypeChange(type)}
                style={{
                  flex: 1,
                  paddingVertical: 8,
                  borderRadius: DesignSystem.borderRadius.sm,
                  backgroundColor:
                    selectedExamType?.id === type.id
                      ? getColorAtived(theme)
                      : "transparent",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: DesignSystem.typography.fontSize.sm,
                    fontWeight: DesignSystem.typography.fontWeight.bold,
                    color:
                      selectedExamType?.id === type.id
                        ? "#FFFFFF"
                        : secondaryTextColor,
                  }}
                >
                  {type.name}
                </Text>
              </Pressable>
            ))}
        </View>

        <View style={{ gap: DesignSystem.spacing.sm }}>
          {!leaderboard || leaderboard.length === 0 ? (
            <View
              style={{
                alignItems: "center",
                paddingVertical: 40,
              }}
            >
              <Text
                style={{
                  color: secondaryTextColor,
                  fontSize: DesignSystem.typography.fontSize.sm,
                }}
              >
                {selectedExamType ? t("noData") : t("selectExamType")}
              </Text>
            </View>
          ) : (
            leaderboard.map((user, index) => (
              <LinearGradient
                key={index}
                colors={
                  theme === "dark"
                    ? [
                        "rgba(147, 51, 234, 0.2)",
                        "rgba(59, 130, 246, 0.15)",
                        "rgba(16, 185, 129, 0.1)",
                      ]
                    : [
                        "rgba(236, 72, 153, 0.12)",
                        "rgba(59, 130, 246, 0.1)",
                        "rgba(245, 158, 11, 0.08)",
                      ]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: DesignSystem.spacing.md,
                  paddingHorizontal: DesignSystem.spacing.md,
                  borderRadius: DesignSystem.borderRadius.xxl,
                }}
              >
                {/* Rank Number */}
                <View
                  style={{
                    width: 32,
                    height: 32,
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: DesignSystem.spacing.md,
                    borderRadius: 16,
                    backgroundColor:
                      index <= 2
                        ? getRankColor(index)
                        : theme === "dark"
                        ? "rgba(255,255,255,0.1)"
                        : "rgba(0,0,0,0.1)",
                  }}
                >
                  <Text
                    style={{
                      fontSize: DesignSystem.typography.fontSize.sm,
                      fontWeight: DesignSystem.typography.fontWeight.bold,
                      color: index <= 2 ? "#fff" : textColor,
                    }}
                  >
                    {index + 1}
                  </Text>
                </View>

                {/* User Info */}
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      marginRight: DesignSystem.spacing.md,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      style={{
                        color: textColor,
                        fontSize: DesignSystem.typography.fontSize.sm,
                        fontWeight: DesignSystem.typography.fontWeight.bold,
                        marginBottom: 2,
                      }}
                    >
                      {user.user_name}
                    </Text>

                    <Text
                      style={{
                        fontSize: DesignSystem.typography.fontSize.xs,
                        fontWeight: DesignSystem.typography.fontWeight.medium,
                        color: "#F59E0B",
                      }}
                    >
                      {user.total_score}
                    </Text>
                  </View>

                  {/* Avatar */}
                  <AvatarCustom avatar={user.avatar_url} size={32} />
                </View>
              </LinearGradient>
            ))
          )}
        </View>
      </CardCustom>
    </View>
  );
}
