import React, { useCallback } from "react";
import { Animated, Dimensions, Image, Pressable, View } from "react-native";
import {
  ScrollView,
  State,
  TapGestureHandler,
} from "react-native-gesture-handler";
import { Icon, Text } from "react-native-paper";

import AudioButton from "@/components/shared/audioButton";
import {
  DesignSystem,
  getBackgroundColor,
  getTextColor,
  getVocabStatusColor,
} from "@/constants/designSystem";
import { NotebookVocabItemStatus } from "@/types/common.type";
import { IVocabularyReview } from "@/types/notebook.type";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = Math.min(360, SCREEN_WIDTH - 48);
const CARD_HEIGHT = Math.round(Dimensions.get("window").height * 0.72);
const H_GAP = 32;

interface FlashcardItemProps {
  item: IVocabularyReview;
  index: number;
  theme: "light" | "dark";
  cardFlips: Record<number, boolean>;
  rotateYs: Animated.Value[];
  scrollX: Animated.Value;
  playAudio: (index: number) => void;
  toggleStatus: (vocabId: string, newStatus: NotebookVocabItemStatus) => void;
  isProcessing: boolean;
  statuses: Record<string, NotebookVocabItemStatus>;
  audioProgress: Animated.Value;
  speaking: boolean;
  handleCardFlip: (index: number) => void;
}

const FlashcardItem: React.FC<FlashcardItemProps> = ({
  item,
  index,
  theme,
  cardFlips,
  rotateYs,
  scrollX,
  playAudio,
  toggleStatus,
  isProcessing,
  statuses,
  audioProgress,
  speaking,
  handleCardFlip,
}) => {
  const inputRange = [
    (index - 1) * (CARD_WIDTH + H_GAP),
    index * (CARD_WIDTH + H_GAP),
    (index + 1) * (CARD_WIDTH + H_GAP),
  ];
  const scale = scrollX.interpolate({
    inputRange,
    outputRange: [0.96, 1, 0.96],
    extrapolate: "clamp",
  });
  const translateY = scrollX.interpolate({
    inputRange,
    outputRange: [8, 0, 8],
    extrapolate: "clamp",
  });

  const isFlipped = cardFlips[index] || false;

  const getCurrentStatus = useCallback(
    (vocabId: string) =>
      statuses[vocabId] || (item as any).status || "chưa thuộc",
    [statuses, item]
  );

  return (
    <Animated.View
      style={{
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        marginHorizontal: H_GAP / 2,
        alignItems: "center",
        transform: [{ scale }, { translateY }],
      }}
    >
      <View
        style={{
          width: "100%",
          height: "100%",
          borderRadius: DesignSystem.borderRadius.lg,
          padding: 18,
          backgroundColor: getBackgroundColor(theme, "primary"),
          ...DesignSystem.shadows[theme].lg,
          overflow: "hidden",
          justifyContent: "space-between",
        }}
      >
        <AudioButton
          onPress={() => playAudio(index)}
          isPlaying={speaking}
          size={48}
          showDuration={false}
          strokeDashoffset={audioProgress.interpolate({
            inputRange: [0, 1],
            outputRange: [2 * Math.PI * 28, 0],
          })}
          colors={{
            border:
              theme === "light"
                ? "rgba(74, 144, 226, 0.3)"
                : "rgba(74, 144, 226, 0.5)",
            primary: "#4CAF50",
            optionBg:
              theme === "light"
                ? "rgba(74, 144, 226, 0.1)"
                : "rgba(74, 144, 226, 0.2)",
            onPrimary: "#FFFFFF",
            text: "#4A90E2",
          }}
        />

        {/* main content */}
        <TapGestureHandler
          onHandlerStateChange={({ nativeEvent }) => {
            if (nativeEvent.state === State.END) {
              handleCardFlip(index);
            }
          }}
          maxDist={10}
        >
          <Animated.View style={{ flex: 1 }}>
            <View
              style={{
                flex: 1,
                position: "relative",
                width: "100%",
                height: "100%",
              }}
            >
              {/* Front Side */}
              <Animated.View
                pointerEvents={isFlipped ? "none" : "auto"}
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  backfaceVisibility: "hidden",
                  transform: [
                    {
                      rotateY: (
                        rotateYs[index] || new Animated.Value(0)
                      ).interpolate({
                        inputRange: [0, 180],
                        outputRange: ["0deg", "180deg"],
                      }),
                    },
                  ],
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 48,
                    fontWeight: "800",
                    color: getTextColor(theme),
                  }}
                >
                  {(item as any).hanzi || (item as any).word}
                </Text>
              </Animated.View>

              {/* Back Side */}
              <Animated.View
                pointerEvents={isFlipped ? "auto" : "none"}
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  backfaceVisibility: "hidden",
                  transform: [
                    {
                      rotateY: (
                        rotateYs[index] || new Animated.Value(0)
                      ).interpolate({
                        inputRange: [0, 180],
                        outputRange: ["180deg", "360deg"],
                      }),
                    },
                  ],
                }}
              >
                <ScrollView
                  style={{ flex: 1 }}
                  contentContainerStyle={{
                    alignItems: "center",
                    paddingVertical: 10,
                  }}
                  showsVerticalScrollIndicator={false}
                  nestedScrollEnabled={true}
                  scrollEnabled={isFlipped}
                >
                  <View style={{ width: "100%", alignItems: "center" }}>
                    {(item as any).image_url ? (
                      <Image
                        source={{ uri: (item as any).image_url }}
                        style={{
                          width: "100%",
                          height: CARD_HEIGHT * 0.42,
                          borderRadius: 10,
                          marginBottom: 12,
                        }}
                        resizeMode="cover"
                      />
                    ) : null}

                    <View style={{ alignItems: "center", marginBottom: 8 }}>
                      <Text
                        style={{
                          fontSize: 48,
                          fontWeight: "800",
                          color: getTextColor(theme),
                        }}
                      >
                        {(item as any).hanzi || (item as any).word}
                      </Text>
                      {(item as any).pinyin ? (
                        <Text
                          style={{
                            marginTop: 6,
                            color: getTextColor(theme, "secondary"),
                          }}
                        >
                          {(item as any).pinyin}
                        </Text>
                      ) : null}
                    </View>

                    <Text
                      style={{
                        color: getTextColor(theme, "secondary"),
                        textAlign: "center",
                        paddingHorizontal: 6,
                      }}
                    >
                      {(item as any).meaning}
                    </Text>
                    {(item as any).notes ? (
                      <Text
                        style={{
                          color: getTextColor(theme, "secondary"),
                          textAlign: "center",
                          marginTop: 8,
                        }}
                      >
                        {(item as any).notes}
                      </Text>
                    ) : null}
                    {(item as any).level && (item as any).level.length > 0 ? (
                      <Text
                        style={{
                          color: getTextColor(theme, "secondary"),
                          textAlign: "center",
                          marginTop: 8,
                        }}
                      >
                        {(item as any).level.join(", ")}
                      </Text>
                    ) : null}
                  </View>
                </ScrollView>
              </Animated.View>
            </View>
          </Animated.View>
        </TapGestureHandler>

        {/* actions row */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
            marginTop: 8,
          }}
        >
          <Pressable
            onPress={() => toggleStatus(item.vocab_id, "yêu thích")}
            style={{
              alignItems: "center",
              flex: 1,
              opacity: isProcessing ? 0.5 : 1,
              padding: 8,
            }}
            disabled={isProcessing}
          >
            <Icon
              source={
                getCurrentStatus(item.vocab_id) === "yêu thích"
                  ? "heart"
                  : "heart-outline"
              }
              size={28}
              color={
                getCurrentStatus(item.vocab_id) === "yêu thích"
                  ? getVocabStatusColor("yêu thích")
                  : getTextColor(theme)
              }
            />
          </Pressable>

          <Pressable
            onPress={() => toggleStatus(item.vocab_id, "đã thuộc")}
            style={{
              alignItems: "center",
              flex: 1,
              opacity: isProcessing ? 0.5 : 1,
              padding: 8,
            }}
            disabled={isProcessing}
          >
            <Icon
              source={
                getCurrentStatus(item.vocab_id) === "đã thuộc"
                  ? "check-circle"
                  : "check-circle-outline"
              }
              size={28}
              color={
                getCurrentStatus(item.vocab_id) === "đã thuộc"
                  ? getVocabStatusColor("đã thuộc")
                  : getTextColor(theme)
              }
            />
          </Pressable>

          <Pressable
            onPress={() => toggleStatus(item.vocab_id, "không chắc")}
            style={{
              alignItems: "center",
              flex: 1,
              opacity: isProcessing ? 0.5 : 1,
              padding: 8,
            }}
            disabled={isProcessing}
          >
            <Icon
              source={
                getCurrentStatus(item.vocab_id) === "không chắc"
                  ? "help-circle"
                  : "help-circle-outline"
              }
              size={28}
              color={
                getCurrentStatus(item.vocab_id) === "không chắc"
                  ? getVocabStatusColor("không chắc")
                  : getTextColor(theme)
              }
            />
          </Pressable>

          <Pressable
            onPress={() => toggleStatus(item.vocab_id, "chưa thuộc")}
            style={{
              alignItems: "center",
              flex: 1,
              opacity: isProcessing ? 0.5 : 1,
              padding: 8,
            }}
            disabled={isProcessing}
          >
            <Icon
              source={
                getCurrentStatus(item.vocab_id) === "chưa thuộc"
                  ? "close-circle"
                  : "close-circle-outline"
              }
              size={28}
              color={
                getCurrentStatus(item.vocab_id) === "chưa thuộc"
                  ? getVocabStatusColor("chưa thuộc")
                  : getTextColor(theme)
              }
            />
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
};

export default React.memo(FlashcardItem);
