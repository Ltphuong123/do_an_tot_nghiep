import React from "react";
import { View } from "react-native";

interface PageIndicatorProps {
  totalPages: number;
  currentPage: number;
  activeColor: string;
  inactiveColor: string;
}

export const PageIndicator: React.FC<PageIndicatorProps> = ({
  totalPages,
  currentPage,
  activeColor,
  inactiveColor,
}) => {
  return (
    <View
      pointerEvents="none"
      style={{
        position: "absolute",
        bottom: 40,
        left: 0,
        right: 0,
        zIndex: 100,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {Array.from({ length: totalPages }).map((_, index) => (
        <View
          key={index}
          style={{
            width: 30,
            height: 10,
            borderRadius: 10,
            marginHorizontal: 6,
            backgroundColor:
              index === currentPage ? activeColor : inactiveColor,
          }}
        />
      ))}
    </View>
  );
};
