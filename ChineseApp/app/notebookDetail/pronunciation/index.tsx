import AudioButton from "@/components/shared/audioButton";
import { ButtonCustom } from "@/components/shared/buttonCustom";
import { ContainerCustom } from "@/components/shared/containerCustom";
import MicButton from "@/components/shared/micButton";
import {
  DesignSystem,
  getBackgroundColor,
  getColorAtived,
  getSolidColor,
  getTextColor,
} from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { useSnackbar } from "@/contexts/snackbarContext";
import { useThemeContext } from "@/contexts/themeContext";
import { useVocabReview } from "@/hooks/useNoteBook";
import { useVocabStatusUpdate } from "@/hooks/useVocabStatusUpdate";
import { INoteBookVocabItem } from "@/types/notebook.type";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Speech from "expo-speech";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Image, Pressable, View } from "react-native";
import { Icon, Text } from "react-native-paper";

const normalize = (s?: string) =>
  (s || "").normalize("NFKD").replace(/\s+/g, " ").trim().toLowerCase();

const Pronunciation = () => {
  const { notebookId, isFromAdmin, newNoteId } = useLocalSearchParams();
  const router = useRouter();
  const { theme } = useThemeContext();
  const { showSnackbar } = useSnackbar();
  const { t } = useLanguageContext();

  const id = isFromAdmin === "true" ? newNoteId : notebookId;
  const { data, isLoading } = useVocabReview(id as string);

  const { updateVocabStatus, statuses } = useVocabStatusUpdate({
    notebookId: id as string,
    isFromAdmin: isFromAdmin === "true",
    originalNotebookId: notebookId as string,
  });

  const [vocabList, setVocabList] = useState<INoteBookVocabItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [recognizedText, setRecognizedText] = useState<string>("");
  const [checked, setChecked] = useState<boolean | null>(null);
  const [speaking, setSpeaking] = useState(false);
  const audioProgressNormal = useRef(new Animated.Value(0)).current;
  const audioProgressSlow = useRef(new Animated.Value(0)).current;
  const isInitializedRef = useRef<boolean>(false);

  useEffect(() => {
    if (data && !isInitializedRef.current) {
      const vocabularies = data as any[];
      if (vocabularies.length > 0) {
        isInitializedRef.current = true;
        setVocabList(vocabularies);
      }
    }
  }, [data]);

  // Check pronunciation when recognizedText changes
  useEffect(() => {
    if (recognizedText.trim() && vocabList.length > 0) {
      const currentItem = vocabList[currentIndex];
      const user = normalize(recognizedText);
      const correct = normalize(currentItem.hanzi);
      const ok = Boolean(correct && user === correct);
      setChecked(ok);

      // Update status based on result
      if (currentItem.id) {
        const oldStatus =
          statuses[currentItem.id] ||
          (currentItem as any).status ||
          "chưa thuộc";
        if (ok) {
          // Correct pronunciation -> "đã thuộc"
          updateVocabStatus(currentItem.id, "đã thuộc", oldStatus);
        } else {
          // Wrong pronunciation -> "chưa thuộc"
          updateVocabStatus(currentItem.id, "chưa thuộc", oldStatus);
        }
      }
    } else {
      setChecked(null);
    }
  }, [recognizedText, vocabList, currentIndex, updateVocabStatus, statuses]);

  const playAudio = (item: INoteBookVocabItem, listenMode: string) => {
    const it = item || vocabList[currentIndex];
    if (!it) return;
    const text = it.hanzi || it.pinyin || it.meaning;
    if (!text) return;
    const rate = listenMode === "slow" ? 0.2 : 1;
    const progress =
      listenMode === "slow" ? audioProgressSlow : audioProgressNormal;

    // Reset progress
    progress.setValue(0);

    // Estimate duration (approximate: varies by rate)
    const estimatedDuration =
      listenMode === "slow" ? text.length * 500 : text.length * 200;

    Speech.speak(text, {
      language: "zh-CN",
      rate,
      onStart: () => {
        setSpeaking(true);
        // Start progress animation
        Animated.timing(progress, {
          toValue: 1,
          duration: estimatedDuration,
          useNativeDriver: false,
        }).start();
      },
      onDone: () => {
        setSpeaking(false);
        progress.setValue(0);
      },
      onError: () => {
        setSpeaking(false);
        progress.setValue(0);
      },
    });
  };

  const handleNext = () => {
    if (!vocabList || vocabList.length === 0) return;
    setRecognizedText("");
    setChecked(null);
    setCurrentIndex((i) => {
      const next = i + 1;
      return next >= vocabList.length ? 0 : next;
    });
  };

  if (isLoading) {
    return (
      <ContainerCustom variant="background" scrollable={false}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: getTextColor(theme) }}>{t("loading")}</Text>
        </View>
      </ContainerCustom>
    );
  }

  if ((!vocabList || vocabList.length === 0) && isLoading === false) {
    return (
      <ContainerCustom variant="background" scrollable={false}>
        <View
          style={{
            padding: DesignSystem.spacing.md,
            flexDirection: "row",
            alignItems: "center",
            gap: DesignSystem.spacing.md,
            backgroundColor: getBackgroundColor(theme, "primary"),
            ...DesignSystem.shadows[theme].md,
          }}
        >
          <Pressable onPress={() => router.back()}>
            <Icon
              source="arrow-left"
              size={24}
              color={theme === "light" ? "#000" : "#FFF"}
            />
          </Pressable>

          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: DesignSystem.typography.fontSize.xl,
                fontWeight: "700",
                color: getTextColor(theme),
              }}
            >
              {t("pronunciation")}
            </Text>
          </View>
        </View>

        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: DesignSystem.spacing.lg,
          }}
        >
          <Icon
            source="check-circle"
            size={80}
            color={getTextColor(theme, "secondary")}
          />
          <Text
            style={{
              fontSize: 24,
              fontWeight: "700",
              color: getTextColor(theme),
              marginTop: 16,
              textAlign: "center",
            }}
          >
            {t("noVocabToReview") || "Đã hết từ ôn tập"}
          </Text>
          <ButtonCustom
            title={t("goBack") || "Quay lại"}
            onPress={() => router.back()}
            size="md"
            startColors={getColorAtived(theme)}
            endColors={getColorAtived(theme)}
            textStyle={{ color: "#fff" }}
            style={{ marginTop: 24 }}
          />
        </View>
      </ContainerCustom>
    );
  }

  const item = vocabList[currentIndex];
  const cardBg = getBackgroundColor(theme, "primary");
  const textColor = getTextColor(theme, "primary");
  const secondaryText = getTextColor(theme, "secondary");

  return (
    <ContainerCustom variant="background" scrollable={false}>
      {/* Header */}
      <View
        style={{
          padding: DesignSystem.spacing.md,
          flexDirection: "row",
          alignItems: "center",
          gap: DesignSystem.spacing.md,
          backgroundColor: getBackgroundColor(theme, "primary"),
          ...DesignSystem.shadows[theme].md,
        }}
      >
        <Pressable onPress={() => router.back()}>
          <Icon
            source="arrow-left"
            size={24}
            color={theme === "light" ? "#000" : "#FFF"}
          />
        </Pressable>

        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: DesignSystem.typography.fontSize.xl,
              fontWeight: "700",
              color: getTextColor(theme),
            }}
          >
            {t("pronunciation")}
          </Text>
        </View>
      </View>

      <ContainerCustom
        variant="background"
        scrollable={true}
        style={{ flex: 1 }}
      >
        {/* Question Number */}
        <View style={{ paddingLeft: 16 }}>
          <Text
            style={{
              color: getTextColor(theme, "secondary"),
              marginTop: 4,
              fontSize: 22,
              fontWeight: "bold",
            }}
          >
            Câu {currentIndex + 1}/{vocabList.length}
          </Text>
        </View>

        {/* Content card */}
        <View
          style={{
            margin: DesignSystem.spacing.md,
            borderRadius: DesignSystem.borderRadius.lg,
            padding: 16,
            backgroundColor: cardBg,
            alignItems: "center",
          }}
        >
          {item.image_url ? (
            <View
              style={{
                borderRadius: 12,
                overflow: "hidden",
                width: 300,
                height: 230,
              }}
            >
              <Image
                source={{ uri: item.image_url }}
                style={{
                  width: "100%",
                  height: "100%",
                  resizeMode: "cover",
                }}
              />
            </View>
          ) : null}

          <Text
            style={{
              fontSize: 24,
              fontWeight: "700",
              color: textColor,
              textAlign: "center",
            }}
          >
            {item.hanzi}
          </Text>
          {item.pinyin ? (
            <Text
              style={{
                color: secondaryText,
                textAlign: "center",
                marginTop: 6,
              }}
            >
              {item.pinyin}
            </Text>
          ) : null}

          {/* Recognized text */}
          <View
            style={{
              marginTop: 16,
              padding: 12,
              borderRadius: 8,
              backgroundColor: getBackgroundColor(theme, "elevated"),
              width: "100%",
            }}
          >
            <Text style={{ color: secondaryText, marginBottom: 8 }}>
              {t("youSaid")}
            </Text>
            <Text style={{ color: textColor }}>
              {recognizedText || (
                <Text style={{ color: secondaryText }}>{t("noDataMsg")}</Text>
              )}
            </Text>
          </View>

          {checked !== null && (
            <View style={{ marginTop: 12, alignItems: "center" }}>
              <Text
                style={{
                  color: checked
                    ? getSolidColor(theme, "success")
                    : getSolidColor(theme, "error"),
                  fontWeight: "700",
                }}
              >
                {checked ? t("correctMsg") : t("wrongMsg")}
              </Text>
              {checked && (
                <View
                  style={{
                    marginTop: 12,
                    padding: 12,
                    borderRadius: 8,
                    backgroundColor: getBackgroundColor(theme, "elevated"),
                    width: "100%",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "700",
                      color: getTextColor(theme),
                      textAlign: "center",
                    }}
                  >
                    {item.meaning}
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
              )}
            </View>
          )}

          {/* Audio and Mic Controls */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: DesignSystem.spacing.md,
              marginTop: DesignSystem.spacing.md,
              width: "100%",
            }}
          >
            <AudioButton
              onPress={() => playAudio(item, "slow")}
              isPlaying={speaking}
              size={48}
              showDuration={false}
              iconName="volume-low"
              strokeDashoffset={audioProgressSlow.interpolate({
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

            <MicButton
              theme={theme}
              onChangeText={(text: string) => setRecognizedText(text)}
              showSnackbar={showSnackbar}
              language="zh-CN"
            />

            <AudioButton
              onPress={() => playAudio(item, "normal")}
              isPlaying={speaking}
              size={48}
              showDuration={false}
              iconName="volume-high"
              strokeDashoffset={audioProgressNormal.interpolate({
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
          </View>

          {/* Next Button - Smaller */}
          <View style={{ width: "100%", marginTop: DesignSystem.spacing.md }}>
            <ButtonCustom
              title={t("goNextButton")}
              onPress={handleNext}
              size="sm"
              fullWidth
              startColors={getColorAtived(theme)}
              endColors={getColorAtived(theme)}
              textStyle={{ color: "#fff" }}
            />
          </View>
        </View>
      </ContainerCustom>
    </ContainerCustom>
  );
};

export default Pronunciation;
