import {
  DesignSystem,
  getTextColor,
  VocabStatusColors,
} from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { useThemeContext } from "@/contexts/themeContext";
import { getNotebookStatus } from "@/services/notebook";
import { useQueries } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";
import { Pressable, View } from "react-native";
import { Icon, Text } from "react-native-paper";
import { AchievementBanner } from "./vocabStats/AchievementBanner";
import { BarChart } from "./vocabStats/BarChart";
import { Names, statusGradients, VocabStats } from "./vocabStats/types";

const colors = VocabStatusColors as unknown as Record<Names, string>;

const VocabStatsCard = () => {
  const { theme } = useThemeContext();
  const { t } = useLanguageContext();
  const [isExpanded, setIsExpanded] = useState(false);

  const statuses = useMemo(
    () => ["Yêu thích", "Đã thuộc", "Chưa thuộc", "Không chắc"],
    []
  );

  const memoizedQueries = useMemo(
    () =>
      statuses.map((status) => {
        let apiStatus = status;
        switch (status) {
          case "Yêu thích":
            apiStatus = "yêu thích";
            break;
          case "Đã thuộc":
            apiStatus = "đã thuộc";
            break;
          case "Chưa thuộc":
            apiStatus = "chưa thuộc";
            break;
          case "Không chắc":
            apiStatus = "không chắc";
            break;
          default:
            apiStatus = status.toLowerCase();
        }
        return {
          queryKey: ["notebooks", "status", apiStatus],
          queryFn: async () => {
            const response = await getNotebookStatus(apiStatus);
            return response.data;
          },
        };
      }),
    [statuses]
  );

  const queries = useQueries({ queries: memoizedQueries });

  const aggregated = useMemo(() => {
    const map: Record<Names, number> = {
      "Yêu thích": 0,
      "Đã thuộc": 0,
      "Chưa thuộc": 0,
      "Không chắc": 0,
    };

    queries.forEach((query, index) => {
      const status = statuses[index];
      if (query.data) {
        map[status as Names] = query.data.total || 0;
      }
    });

    return Object.keys(map).map((k) => {
      const key = k as Names;
      return {
        name: key,
        count: map[key],
        color: colors[key] || colors["Không chắc"],
        gradient: statusGradients[key],
      } as VocabStats;
    });
  }, [queries, statuses]);

  const total = aggregated.reduce((s, it) => s + it.count, 0);
  const memorizedCount =
    aggregated.find((item) => item.name === "Đã thuộc")?.count || 0;

  const secondaryTextColor = getTextColor(
    theme as "dark" | "light",
    "secondary"
  );

  return (
    <View
      style={{
        marginHorizontal: DesignSystem.spacing.md,
        marginVertical: DesignSystem.spacing.sm,
        borderRadius: 24,
        backgroundColor: theme === "dark" ? "#18181b" : "#ffffff",
        borderWidth: 1,
        borderColor:
          theme === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 4,
        height: isExpanded ? 380 : 68, // Chiều cao thay đổi
        maxWidth: 440,
        overflow: "hidden", // Ẩn phần tràn
      }}
    >
      {/* Header */}
      <Pressable
        onPress={() => setIsExpanded(!isExpanded)}
        style={{
          paddingHorizontal: 20,
          paddingTop: 16,
          paddingBottom: 8,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "700",
              color: theme === "dark" ? "#E4E4E7" : "#18181B",
            }}
          >
            Tổng quan tiến độ
          </Text>
        </View>

        {!isExpanded ? (
          // Collapsed: Hiển thị "Nhấn để xem" với icon
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 12,
              backgroundColor:
                theme === "dark" ? "rgba(255,255,255,0.1)" : "#F4F4F5",
            }}
          >
            <Icon
              source="chart-bar"
              size={16}
              color={theme === "dark" ? "#A1A1AA" : "#71717A"}
            />
            <Text
              style={{
                fontSize: 12,
                fontWeight: "600",
                color: theme === "dark" ? "#A1A1AA" : "#71717A",
              }}
            >
              Nhấn để xem
            </Text>
          </View>
        ) : null}
      </Pressable>

      {/* Body Container */}
      {isExpanded && (
        <View
          style={{
            flex: 1,
            paddingHorizontal: 12,
            paddingVertical: 4,
            // Đảm bảo nội dung nằm giữa Header và Footer
            justifyContent: "space-between",
          }}
        >
          {total === 0 ? (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon source="folder-open" size={32} color={secondaryTextColor} />
              <Text
                style={{
                  marginTop: 8,
                  fontSize: 13,
                  color: secondaryTextColor,
                }}
              >
                {t("noVocabToStats")}
              </Text>
            </View>
          ) : (
            <View style={{ flex: 1 }}>
              <BarChart data={aggregated} theme={theme} />
            </View>
          )}
        </View>
      )}

      {/* Footer Banner */}
      {isExpanded && (
        <AchievementBanner
          memorizedCount={memorizedCount}
          theme={theme as "dark" | "light"}
        />
      )}
    </View>
  );
};

export default VocabStatsCard;
