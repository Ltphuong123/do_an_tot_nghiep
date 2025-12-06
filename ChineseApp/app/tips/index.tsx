import { useLanguageContext } from "@/contexts/languageContext";
import { useSnackbar } from "@/contexts/snackbarContext";
import { useThemeContext } from "@/contexts/themeContext";
import { getTipList } from "@/services/tips";
import { useTipsStore } from "@/store/useTipsStore";
import { router, useLocalSearchParams } from "expo-router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Pressable, ScrollView, StatusBar, View } from "react-native";
import { Text } from "react-native-paper";

import { ContainerCustom } from "@/components/shared/containerCustom";
import { DesignSystem, getTextColor } from "@/constants/designSystem";
import { ITip, TLevelTip, TTopicTip } from "@/types/tips.type";
import EmptyState from "./components/emptyState";
import LevelSelector from "./components/levelSelector";
import TipItem from "./components/tipItem";
import TipsHeader from "./components/tipsHeader";

function TipsDetail() {
  const { theme } = useThemeContext();
  const { t } = useLanguageContext();
  const { showSnackbar } = useSnackbar();
  const textColor = getTextColor(theme, "primary");
  const params = useLocalSearchParams();
  const scrollViewRef = useRef<ScrollView>(null);

  const [selectedLevel, setSelectedLevel] = useState<TLevelTip>("Sơ cấp");
  const [allTips, setAllTips] = useState<ITip[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());

  // Cache theo level
  const { levelCache, setLevelCache } = useTipsStore();

  const levelType: TLevelTip[] = ["Sơ cấp", "Trung cấp", "Cao cấp"];

  // Fetch tips theo level - chỉ fetch khi chưa có cache
  const fetchTipsByLevel = useCallback(
    async (level: TLevelTip) => {
      // Kiểm tra cache trước - hiển thị ngay lập tức
      if (levelCache[level] && levelCache[level].length > 0) {
        setAllTips(levelCache[level]);
        setLoading(false); // Tắt loading ngay
        return;
      }

      // Chỉ set loading khi thực sự cần fetch
      setLoading(true);
      try {
        const data = await getTipList();
        if (data.success) {
          const filteredByLevel = data.data.data.filter(
            (tip) => tip.level === level
          );
          // Lưu vào cache
          setLevelCache(level, filteredByLevel);
          setAllTips(filteredByLevel);
        } else {
          showSnackbar(data.message || t("errorLoadingTips"), "error");
        }
      } catch (error: any) {
        showSnackbar(error.message || t("errorLoadingTips"), "error");
      } finally {
        setLoading(false);
      }
    },
    [levelCache, setLevelCache, showSnackbar, t]
  );

  // Load tips khi chọn level
  useEffect(() => {
    fetchTipsByLevel(selectedLevel);
  }, [selectedLevel, fetchTipsByLevel]);

  // Group tips theo topic
  const groupedTips = useMemo(() => {
    const groups: Record<TTopicTip, ITip[]> = {} as any;
    allTips.forEach((tip) => {
      if (!groups[tip.topic]) {
        groups[tip.topic] = [];
      }
      groups[tip.topic].push(tip);
    });
    return groups;
  }, [allTips]);

  const handleLevelSelect = (level: TLevelTip) => {
    setSelectedLevel(level);
  };

  const toggleTopic = (topic: string) => {
    setExpandedTopics((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(topic)) {
        newSet.delete(topic);
      } else {
        newSet.add(topic);
      }
      return newSet;
    });
  };

  return (
    <ContainerCustom variant="background" scrollable={false}>
      <StatusBar
        barStyle={theme === "light" ? "dark-content" : "light-content"}
        backgroundColor="transparent"
        translucent
      />

      <TipsHeader theme={theme} onBack={() => router.back()} />

      <LevelSelector
        selectedLevel={
          selectedLevel !== undefined ? selectedLevel : levelType[0]
        }
        onSelect={handleLevelSelect}
        levelType={levelType}
      />

      <ScrollView
        ref={scrollViewRef}
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 30,
        }}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingTop: 60,
            }}
          >
            <View
              style={{
                backgroundColor: theme === "dark" ? "#1C1C1E" : "#FFFFFF",
                padding: 24,
                borderRadius: 16,
                ...DesignSystem.shadows[theme].lg,
              }}
            >
              <Text style={{ color: textColor, fontSize: 16 }}>
                Đang tải mẹo...
              </Text>
            </View>
          </View>
        ) : Object.keys(groupedTips).length > 0 ? (
          <>
            {Object.entries(groupedTips).map(([topic, tips]) => {
              const isExpanded = expandedTopics.has(topic);
              return (
                <View key={topic} style={{ marginBottom: 16 }}>
                  {/* Header có thể nhấn để expand/collapse */}
                  <Pressable
                    onPress={() => toggleTopic(topic)}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingVertical: 12,
                      paddingHorizontal: 8,
                      backgroundColor:
                        theme === "dark"
                          ? "rgba(255,255,255,0.05)"
                          : "rgba(0,0,0,0.03)",
                      borderRadius: 12,
                      marginBottom: 8,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "700",
                        color: textColor,
                      }}
                    >
                      {topic}
                    </Text>
                    <View
                      style={{
                        transform: [{ rotate: isExpanded ? "180deg" : "0deg" }],
                      }}
                    >
                      <Text style={{ fontSize: 20, color: textColor }}>▼</Text>
                    </View>
                  </Pressable>

                  {/* Nội dung tips - chỉ hiển khi expanded */}
                  {isExpanded && (
                    <View
                      style={{
                        backgroundColor:
                          theme === "dark" ? "#1C1C1E" : "#FFFFFF",
                        borderRadius: 16,
                        overflow: "hidden",
                        ...DesignSystem.shadows[theme].md,
                      }}
                    >
                      {tips.map((tip, index) => (
                        <View key={tip.id}>
                          <TipItem
                            tip={tip}
                            isExpanded={false}
                            onToggle={() => {}}
                            theme={theme}
                          />
                          {/* Đường kẻ ngăn cách */}
                          {index < tips.length - 1 && (
                            <View
                              style={{
                                height: 1,
                                backgroundColor:
                                  theme === "dark"
                                    ? "rgba(255,255,255,0.1)"
                                    : "rgba(0,0,0,0.05)",
                                marginHorizontal: 16,
                              }}
                            />
                          )}
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              );
            })}
          </>
        ) : (
          <EmptyState theme={theme} level={selectedLevel} />
        )}
      </ScrollView>
    </ContainerCustom>
  );
}

export default TipsDetail;
