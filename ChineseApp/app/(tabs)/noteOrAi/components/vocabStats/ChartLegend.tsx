import { getTextColor } from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { router } from "expo-router";
import React from "react";
import { Pressable, View } from "react-native";
import { Icon, Text } from "react-native-paper";
import { VocabStats } from "./types";

interface ChartLegendProps {
  data: VocabStats[];
  theme: string;
}

export const ChartLegend = ({ data, theme }: ChartLegendProps) => {
  const { t } = useLanguageContext();
  const primaryColor = getTextColor(theme as "dark" | "light", "primary");
  const secondaryColor = getTextColor(theme as "dark" | "light", "secondary");

  const handleItemPress = (itemName: string) => {
    let status = "";
    switch (itemName) {
      case "Yêu thích":
        status = "yêu thích";
        break;
      case "Đã thuộc":
        status = "đã thuộc";
        break;
      case "Chưa thuộc":
        status = "chưa thuộc";
        break;
      case "Không chắc":
        status = "không chắc";
        break;
    }

    if (status) {
      router.push({
        pathname: "/notebookDetail/status" as any,
        params: {
          id: status,
          returnTo: "/noteOrAi",
          key: Date.now().toString(),
        },
      });
    }
  };

  return (
    <View
      style={{
        width: "100%",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        paddingHorizontal: 4,
        marginTop: 10,
      }}
    >
      {data.map((item) => (
        <Pressable
          key={item.name}
          onPress={() => handleItemPress(item.name)}
          style={{
            width: "48%",
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 10,
            backgroundColor:
              theme === "dark" ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)",
            paddingVertical: 8,
            paddingHorizontal: 10,
            borderRadius: 10,
          }}
        >
          {/* Thanh màu chỉ thị (Gradient Indicator) */}
          <View
            style={{
              width: 6,
              height: 28,
              borderRadius: 4,
              backgroundColor: item.gradient[0], // Fallback
              marginRight: 10,
              overflow: "hidden",
            }}
          >
            {/* Giả lập gradient bằng view con */}
            <View
              style={{
                flex: 1,
                backgroundColor: item.gradient[1],
                opacity: 0.6,
                marginTop: 14, // Nửa dưới đậm hơn/nhạt hơn
              }}
            />
          </View>

          {/* Thông tin Text */}
          <View style={{ flex: 1, justifyContent: "center" }}>
            <Text
              numberOfLines={1}
              style={{
                fontSize: 11,
                color: secondaryColor,
                marginBottom: 2,
                fontWeight: "500",
              }}
            >
              {t(item.name)}
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "700",
                color: primaryColor,
                lineHeight: 18,
              }}
            >
              {item.count}{" "}
              <Text style={{ fontSize: 9, fontWeight: "400", opacity: 0.8 }}>
                {t("words")}
              </Text>
            </Text>
          </View>

          {/* Icon chevron-right */}
          <Icon source="chevron-right" size={20} color={secondaryColor} />
        </Pressable>
      ))}
    </View>
  );
};
