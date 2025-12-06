import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Animated, TouchableOpacity, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

// Use the same AnimatedCircle structure as in the original files
const AnimatedCircle = Animated.createAnimatedComponent(Circle as any);

interface AudioButtonProps {
  onPress: () => void;
  isPlaying?: boolean;
  durationMs?: number;
  positionMs?: number;
  size?: number;
  showDuration?: boolean;
  iconName?: string;
  colors?: {
    border?: string;
    primary?: string;
    optionBg?: string;
    onPrimary?: string;
    text?: string;
  };
  strokeDashoffset?: any; // Animated value
}

const AudioButton: React.FC<AudioButtonProps> = ({
  onPress,
  isPlaying = false,
  durationMs = 0,
  positionMs = 0,
  size = 56,
  showDuration = true,
  iconName = "volume-high",
  colors = {
    border: "rgba(0,0,0,0.1)",
    primary: "#2196F3",
    optionBg: "#f5f5f5",
    onPrimary: "#FFFFFF",
    text: "#333333",
  },
  strokeDashoffset,
}) => {
  const formatTime = (ms: number) => {
    if (!ms || ms <= 0) return "0:00";
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // SVG circle parameters
  const RADIUS = 28;
  const STROKE_WIDTH = 4;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

  return (
    <View style={{ alignItems: "center", marginTop: 8, marginBottom: 12 }}>
      <TouchableOpacity
        onPress={onPress}
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          alignItems: "center",
          justifyContent: "center",
          borderWidth: 1.5,
          borderColor: colors.border,
          backgroundColor: isPlaying ? colors.primary : colors.optionBg,
          position: "relative",
        }}
      >
        <Ionicons
          name={isPlaying ? "pause" : iconName}
          size={22}
          color={isPlaying ? colors.onPrimary : colors.text}
        />

        {/* Progress ring positioned above the button (center) */}
        {strokeDashoffset && (
          <View
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              marginTop: -(RADIUS * 2 + STROKE_WIDTH * 2) / 2,
              marginLeft: -(RADIUS * 2 + STROKE_WIDTH * 2) / 2,
              width: RADIUS * 2 + STROKE_WIDTH * 2,
              height: RADIUS * 2 + STROKE_WIDTH * 2,
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
            }}
          >
            <Svg
              width={RADIUS * 2 + STROKE_WIDTH * 2}
              height={RADIUS * 2 + STROKE_WIDTH * 2}
              style={{ transform: [{ rotate: "-90deg" }] }}
            >
              <Circle
                cx={(RADIUS * 2 + STROKE_WIDTH * 2) / 2}
                cy={(RADIUS * 2 + STROKE_WIDTH * 2) / 2}
                r={RADIUS}
                stroke={isPlaying ? "#FFD54F" : "rgba(0,0,0,0.06)"}
                strokeWidth={STROKE_WIDTH}
                strokeOpacity={0.9}
                fill="none"
                strokeDasharray={`${CIRCUMFERENCE}`}
                strokeDashoffset={CIRCUMFERENCE}
              />
              <AnimatedCircle
                cx={(RADIUS * 2 + STROKE_WIDTH * 2) / 2}
                cy={(RADIUS * 2 + STROKE_WIDTH * 2) / 2}
                r={RADIUS}
                stroke={isPlaying ? colors.primary : colors.primary}
                strokeWidth={STROKE_WIDTH}
                strokeLinecap="round"
                fill="none"
                strokeDasharray={`${CIRCUMFERENCE}`}
                strokeDashoffset={strokeDashoffset}
              />
            </Svg>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default AudioButton;
