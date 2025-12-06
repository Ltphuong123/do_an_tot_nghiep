import DesignSystem, { getSolidColor } from "@/constants/designSystem";
import { useThemeContext } from "@/contexts/themeContext";
import { ITip } from "@/types/tips.type";
import { useRef } from "react";
import { Animated, Pressable, View } from "react-native";
import { Icon, Text } from "react-native-paper";
import Svg, { Path } from "react-native-svg";
import HtmlRenderer from "./htmlRenderer";

// Icon trích dẫn - giống móc treo
const QuoteIcon = ({
  size = 40,
  color = "#60A5FA",
}: {
  size?: number;
  color?: string;
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
  </Svg>
);

const TipCard = ({
  tip,
  onPress,
  width,
  height,
}: {
  tip: ITip;
  onPress?: () => void;
  width?: number;
  height?: number;
}) => {
  const scale = useRef(new Animated.Value(1)).current;
  const { theme } = useThemeContext();

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 50,
      bounciness: 0,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 0,
    }).start();
  };

  const cardBg = theme === "dark" ? "#1C1C1E" : "#FFFFFF";
  const iconColor = "#EF4444"; // Màu đỏ giống "Lịch sử"
  const quoteColor = "#60A5FA"; // Xanh dương nhạt

  return (
    <Animated.View style={{ transform: [{ scale }], width: width || "100%" }}>
      {/* Icon trích dẫn - chìa ra ngoài như móc treo */}
      <View
        style={{
          position: "absolute",
          top: -8,
          left: 12,
          zIndex: 10,
        }}
      >
        <QuoteIcon size={40} color={quoteColor} />
      </View>

      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={{
          backgroundColor: getSolidColor(theme, "card"),
          padding: 14,

          marginBottom: DesignSystem.spacing.md,
          borderRadius: 20,
          marginTop: 16, // Tạo khoảng trống cho icon chìa ra
          overflow: "visible", // Cho phép icon chìa ra ngoài
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 4 },
          elevation: 4,
          position: "relative",
        }}
      >
        {/* Icon ghim nếu tip được pin */}
        {tip.is_pinned && (
          <View
            style={{
              position: "absolute",
              top: 12,
              right: 12,
            }}
          >
            <Icon source="pin" size={20} color={iconColor} />
          </View>
        )}

        {/* Tiêu đề và cấp độ */}
        <View
          style={{
            marginBottom: 12,
            marginTop: 8,
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            zIndex: 1,
          }}
        >
          <Text
            style={{
              fontSize: 17,
              fontWeight: "700",
              color: iconColor,
              flex: 1,
            }}
            numberOfLines={1}
          >
            {tip.topic}
          </Text>
          <View
            style={{
              backgroundColor:
                theme === "dark"
                  ? "rgba(239, 68, 68, 0.15)"
                  : "rgba(239, 68, 68, 0.1)",
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 12,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: "600",
                color: iconColor,
              }}
            >
              {tip.level}
            </Text>
          </View>
        </View>

        {/* Nội dung HTML */}
        <View
          style={{ height: height || "auto", overflow: "hidden", zIndex: 1 }}
        >
          <HtmlRenderer
            htmlContent={tip.content.html}
            theme={theme}
            fontSize={15}
          />
        </View>
      </Pressable>
    </Animated.View>
  );
};

export default TipCard;
