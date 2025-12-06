import TipCard from "@/components/shared/tipCard";
import { DesignSystem, getTextColor } from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { useThemeContext } from "@/contexts/themeContext";
import { useTips } from "@/hooks/useMockTest";
import { useTipsStore } from "@/store/useTipsStore";
import { ITip } from "@/types/tips.type";
import { router } from "expo-router";
import React, { useEffect, useMemo } from "react";
import { Dimensions, Pressable, ScrollView, View } from "react-native";
import { Icon, Text } from "react-native-paper";

const TipsSection = React.memo(function TipsSection() {
  const { theme } = useThemeContext();
  const textColor = getTextColor(theme, "primary");
  const screenWidth = Dimensions.get("window").width;
  const { t } = useLanguageContext();

  const topic = useMemo(() => ["HSK", "HSKK", "TOCFL", "D4"], []);

  // Use React Query hook
  const { data: tipsData } = useTips();
  const { setTipsGeneralStore, tipsGeneralStore } = useTipsStore();

  // Filter tips based on general topics
  const filteredTips = useMemo(() => {
    if (!tipsData) return [];
    return tipsData.filter((item) => !topic.includes(item.topic));
  }, [tipsData, topic]);

  // Update tips store when data changes
  useEffect(() => {
    if (filteredTips.length > 0) {
      setTipsGeneralStore(filteredTips);
    }
  }, [filteredTips, setTipsGeneralStore]);

  const handleExpandPress = () => {
    if (tipsGeneralStore.length > 0) {
      router.push({
        pathname: "/tips" as any,
        params: {
          returnURL: "/home",
          type: "general",
          id: tipsGeneralStore[0].id,
          level: tipsGeneralStore[0].level,
          key: Date.now().toString(),
        },
      });
    }
  };

  const handleTipPress = (tip: ITip) => {
    router.push("/tips");
  };

  return (
    <View style={{ width: "100%", gap: DesignSystem.spacing.md }}>
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
          {t("tips")}
        </Text>
        <Pressable onPress={handleExpandPress} style={{ padding: 4 }}>
          <Icon source="chevron-right" size={20} color={textColor} />
        </Pressable>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{
          paddingBottom: 5,
        }}
        decelerationRate="fast"
      >
        <View
          style={{
            flexDirection: "row",
            gap: 12,
          }}
        >
          {tipsGeneralStore.map((tip) => (
            <TipCard
              key={tip.id}
              tip={tip}
              onPress={() => handleTipPress(tip)}
              width={screenWidth * 0.7}
              height={150}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
});

export default TipsSection;
