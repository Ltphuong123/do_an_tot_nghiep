/**
 * Section Overview Screen - Màn hình thống kê từng phần thi
 * Hiển thị trước khi bắt đầu mỗi phần
 */

import { ButtonCustom } from "@/components/shared/buttonCustom";
import { ContainerCustom } from "@/components/shared/containerCustom";
import HtmlRenderer from "@/components/shared/htmlRenderer";
import { getColorAtived, getTextColor } from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { ISection } from "@/types/mockTest.type";
import { pauseAudio, playRemoteAudio, stopAudio } from "@/utils/play_audio";
import { Ionicons } from "@expo/vector-icons";
// Removed expo vector icons usage: using Icon from react-native-paper instead
import React, { useEffect, useRef, useState } from "react";
import { Animated, ScrollView, TouchableOpacity, View } from "react-native";
import { Icon, Text } from "react-native-paper";
import Svg, { Circle } from "react-native-svg";

const AnimatedCircle = Animated.createAnimatedComponent(Circle as any);

interface SectionOverviewProps {
  section: ISection;
  sectionIndex: number;
  totalSections: number;
  onStart: () => void;
  onSkip?: () => void;
  theme: "light" | "dark";
}

const SectionOverview = ({
  section,
  sectionIndex,
  totalSections,
  onStart,
  onSkip,
  theme,
}: SectionOverviewProps) => {
  const { t } = useLanguageContext();
  const textColor = getTextColor(theme, "primary");
  const secondaryTextColor = getTextColor(theme, "secondary");
  const cardBg = theme === "dark" ? "#1a1a2e" : "#ffffff";
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [durationMs, setDurationMs] = useState<number>(0);
  const [positionMs, setPositionMs] = useState<number>(0);
  const animatedProgress = useRef(new Animated.Value(0)).current;

  const handleAudio = async () => {
    if (isPlayingAudio) {
      await pauseAudio();
      setIsPlayingAudio(false);
      animatedProgress.stopAnimation();
      return;
    }

    if (!section.audio_url) return;

    // Start playing and subscribe to status updates
    await playRemoteAudio(
      String(section.audio_url),
      () => {
        setIsPlayingAudio(false);
        setPositionMs(durationMs);
        animatedProgress.setValue(1);
        animatedProgress.stopAnimation();
      },
      (status: any) => {
        if (status && status.isLoaded) {
          const dur = status.durationMillis || 0;
          const pos = status.positionMillis || 0;
          setDurationMs(dur);
          setPositionMs(pos);
          setIsPlayingAudio(!!status.isPlaying);

          // sync animated progress to playback position
          if (dur > 0) {
            const ratio = Math.min(1, pos / dur);
            animatedProgress.setValue(ratio);
          }
        }
      }
    );

    // start a timing animation to smoothly progress to the end
    if (durationMs > 0) {
      const startRatio =
        durationMs > 0 ? Math.min(1, positionMs / durationMs) : 0;
      const remaining = Math.max(0, durationMs - positionMs);
      animatedProgress.setValue(startRatio);
      if (remaining > 40) {
        Animated.timing(animatedProgress, {
          toValue: 1,
          duration: remaining,
          useNativeDriver: false,
        }).start();
      }
    }

    setIsPlayingAudio(true);
  };

  useEffect(() => {
    return () => {
      // cleanup: stop audio when component unmounts
      stopAudio().catch(() => {});
    };
  }, []);

  // Stop any playing audio when component mounts
  useEffect(() => {
    stopAudio().catch(() => {});
  }, []);

  // Auto-play section audio when component mounts
  useEffect(() => {
    if (section.audio_url) {
      handleAudio();
    }
  }, []); // Empty dependency to run only on mount

  const formatTime = (ms: number) => {
    if (!ms || ms <= 0) return "0:00";
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // SVG circle parameters
  const RADIUS = 28; // radius of the progress ring
  const STROKE_WIDTH = 4;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

  // Interpolated strokeDashoffset value
  const strokeDashoffset = animatedProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [CIRCUMFERENCE, 0],
  }) as unknown as number;

  console.log(section);

  const getSectionColor = () => {
    const colors = [
      { light: "#4facfe", dark: "#667eea" },
      { light: "#11998e", dark: "#56ab2f" },
      { light: "#f093fb", dark: "#f2994a" },
      { light: "#f5576c", dark: "#eb3349" },
    ];
    const colorIndex = sectionIndex % colors.length;
    return theme === "dark"
      ? colors[colorIndex].dark
      : colors[colorIndex].light;
  };

  const sectionColor = getSectionColor();

  return (
    <ContainerCustom variant="background" scrollable={false}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 30,
          paddingHorizontal: 16,
          paddingBottom: 32,
        }}
      >
        {/* Section Badge */}
        <View style={{ alignItems: "center", marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: secondaryTextColor,
              marginBottom: 8,
            }}
          >
            {t("part")} {sectionIndex + 1} / {totalSections}
          </Text>
          <Text
            style={{
              fontSize: 28,
              fontWeight: "700",
              color: textColor,
              textAlign: "center",
            }}
          >
            {section.name}
          </Text>
        </View>

        {/* Description */}
        {section.description && (
          <View style={{ paddingHorizontal: 16 }}>
            <HtmlRenderer
              htmlContent={section.description.html}
              theme={theme}
            />
          </View>
        )}

        {/* Stats Grid */}
        <View
          style={{
            flexDirection: "row",
            gap: 12,
            marginBottom: 16,
          }}
        >
          {/* Questions */}
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              flex: 1,
              paddingVertical: 16,
            }}
          >
            <Icon source="clock" size={28} color={sectionColor} />
            <Text style={{ color: getTextColor(theme, "primary") }}>
              {t("testTime")}: {section.time_minutes} {t("minutes")}
            </Text>
          </View>
        </View>

        {/* Subsections Info */}
        {section.subsections && section.subsections.length > 0 && (
          <View
            style={{
              backgroundColor: cardBg,
              borderRadius: 16,
              padding: 20,
              marginBottom: 16,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                marginBottom: 12,
              }}
            >
              <Icon
                source="format-list-bulleted"
                size={24}
                color={sectionColor}
              />
              <Text
                style={{ fontSize: 16, fontWeight: "700", color: textColor }}
              >
                {t("sectionStructure")}
              </Text>
            </View>
            {section.subsections.map((subsection, index) => (
              <View
                key={subsection.id}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12,
                  paddingVertical: 8,
                  borderBottomWidth:
                    index < section.subsections.length - 1 ? 1 : 0,
                  borderBottomColor: `${sectionColor}20`,
                }}
              >
                <View
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    backgroundColor: `${sectionColor}20`,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "600",
                      color: sectionColor,
                    }}
                  >
                    {index + 1}
                  </Text>
                </View>
                <Text
                  style={{
                    flex: 1,
                    fontSize: 14,
                    color: textColor,
                    fontWeight: "500",
                  }}
                >
                  {subsection.name}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: secondaryTextColor,
                  }}
                >
                  {subsection.questions.length +
                    (subsection.prompts || []).reduce(
                      (acc, prompt) =>
                        acc + (prompt.questions ? prompt.questions.length : 0),
                      0
                    )}{" "}
                  {t("questions")}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Section Audio */}
        {section.audio_url && (
          <View style={{ alignItems: "center", marginBottom: 16 }}>
            <TouchableOpacity
              accessible
              accessibilityRole="button"
              accessibilityLabel={
                isPlayingAudio ? t("stopAudioGuide") : t("listenAudioGuide")
              }
              onPress={handleAudio}
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1.5,
                borderColor: sectionColor,
                backgroundColor: isPlayingAudio ? sectionColor : cardBg,
                position: "relative",
              }}
            >
              <Ionicons
                name={isPlayingAudio ? "pause" : "volume-high"}
                size={22}
                color={isPlayingAudio ? "#FFFFFF" : sectionColor}
              />

              {/* progress ring positioned above the button (center) */}
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
                    stroke={isPlayingAudio ? "#FFD54F" : "rgba(0,0,0,0.06)"}
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
                    stroke={sectionColor}
                    strokeWidth={STROKE_WIDTH}
                    strokeLinecap="round"
                    fill="none"
                    strokeDasharray={`${CIRCUMFERENCE}`}
                    strokeDashoffset={strokeDashoffset as any}
                  />
                </Svg>
              </View>
            </TouchableOpacity>

            {/* Duration display */}
            {(durationMs > 0 || positionMs > 0) && (
              <Text
                style={{
                  fontSize: 12,
                  color: textColor,
                  marginTop: 8,
                  opacity: 0.7,
                }}
              >
                {formatTime(positionMs)} / {formatTime(durationMs)}
              </Text>
            )}
          </View>
        )}
      </ScrollView>

      {/* Bottom Actions */}
      <View
        style={{
          padding: 16,
          backgroundColor: cardBg,
          borderTopWidth: 1,
          borderTopColor: "rgba(0, 0, 0, 0.05)",
          gap: 12,
        }}
      >
        <ButtonCustom
          startColors={getColorAtived(theme)}
          endColors={getColorAtived(theme)}
          title={t("startThisSection")}
          onPress={() => {
            stopAudio();
            onStart();
          }}
          textStyle={{ color: "#fff" }}
        />

        {onSkip && (
          <ButtonCustom
            startColors={getColorAtived(theme)}
            endColors={getColorAtived(theme)}
            title={t("skipThisSection")}
            onPress={onSkip}
            textStyle={{ color: "#fff" }}
          />
        )}
      </View>
    </ContainerCustom>
  );
};

export default SectionOverview;
