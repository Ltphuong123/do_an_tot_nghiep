import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { View } from "react-native";
import { ChartLegend } from "./ChartLegend";
import { VocabStats } from "./types";

interface BarChartProps {
  data: VocabStats[];
  theme: string;
}

export const BarChart = ({ data, theme }: BarChartProps) => {
  const maxVal = Math.max(...data.map((item) => item.count), 10);

  return (
    <View
      style={{
        width: "100%",
        height: "100%",
        justifyContent: "space-between",
      }}
    >
      {/* 1. VISUAL CHART AREA */}
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "flex-end", // Căn đáy các cột
          justifyContent: "space-between",
          gap: 8,
          paddingHorizontal: 8,
          paddingBottom: 6, // Cách Legend một chút
          minHeight: 110,
        }}
      >
        {data.map((item, index) => {
          // Tính chiều cao cột (tối thiểu 10% để vẫn nhìn thấy được)
          const heightPct =
            item.count === 0 ? 4 : Math.max((item.count / maxVal) * 100, 4);

          return (
            <View
              key={index}
              style={{
                flex: 1,
                height: "100%",
                justifyContent: "flex-end", // Cột mọc từ dưới lên
                alignItems: "center",
              }}
            >
              {/* Cột Gradient */}
              <LinearGradient
                colors={item.gradient as any}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }} // Gradient dọc cho cột
                style={{
                  width: "100%",
                  height: `${heightPct}%`,
                  borderRadius: 6, // Bo góc cột
                  opacity: 0.9,
                  maxWidth: 60, // Giới hạn độ rộng cột cho đẹp
                }}
              />
            </View>
          );
        })}
      </View>

      {/* 2. LEGEND GRID (Tái sử dụng chung style với Donut) */}
      <ChartLegend data={data} theme={theme} />
    </View>
  );
};
