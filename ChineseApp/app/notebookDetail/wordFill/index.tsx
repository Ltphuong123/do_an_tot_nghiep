import AudioButton from "@/components/shared/audioButton";
import { ButtonCustom } from "@/components/shared/buttonCustom";
import { ContainerCustom } from "@/components/shared/containerCustom";
import { InputCustom } from "@/components/shared/inputCustom";
import {
  DesignSystem,
  getBackgroundColor,
  getColorAtived,
  getSolidColor,
  getTextColor,
} from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { useThemeContext } from "@/contexts/themeContext";
import { useVocabReview } from "@/hooks/useNoteBook";
import { useVocabStatusUpdate } from "@/hooks/useVocabStatusUpdate";
import { INoteBookVocabItem } from "@/types/notebook.type";
import shuffle from "@/utils/shuffle";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Speech from "expo-speech";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { Button, Icon, Text } from "react-native-paper";
import Done from "../components/shared/done";

const getWordText = (it: INoteBookVocabItem | null) => it?.hanzi;
const getPinyin = (it: INoteBookVocabItem | null) => it?.pinyin;
const getMeaning = (it: INoteBookVocabItem | null) => it?.meaning;

const normalize = (s?: string) =>
  (s || "").normalize("NFKD").replace(/\s+/g, " ").trim().toLowerCase();

const WordFillScreen = () => {
  const { notebookId, isFromAdmin, newNoteId } = useLocalSearchParams();
  const router = useRouter();
  const { theme } = useThemeContext();
  const { t } = useLanguageContext();

  const id = isFromAdmin === "true" ? newNoteId : notebookId;
  const { data: vocabData, isLoading } = useVocabReview(id as string);

  const { updateVocabStatus, statuses } = useVocabStatusUpdate({
    notebookId: id as string,
    isFromAdmin: isFromAdmin === "true",
    originalNotebookId: notebookId as string,
  });

  const [vocabList, setVocabList] = useState<INoteBookVocabItem[] | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [current, setCurrent] = useState<INoteBookVocabItem | null>(null);
  const [input, setInput] = useState<string>("");
  const [checked, setChecked] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [speakingNormal, setSpeakingNormal] = useState(false);
  const [speakingSlow, setSpeakingSlow] = useState(false);
  const audioProgress = useRef(new Animated.Value(0)).current;
  const audioProgressSlow = useRef(new Animated.Value(0)).current;
  const hasAutoPlayedRef = useRef<boolean>(false);
  const isInitializedRef = useRef<boolean>(false);
  console.log("Word Fill Data:", vocabData);

  useEffect(() => {
    if (vocabData && !isInitializedRef.current) {
      const vocabularies = vocabData as any[];
      if (vocabularies.length > 0) {
        console.log("Word Fill vocabularies:", vocabularies);
        isInitializedRef.current = true;
        setVocabList(vocabularies);
        setCurrentIndex(0);
        setScore(0);
        setDone(false);
        setChecked(null);
        setInput("");
      }
    }
  }, [vocabData]);

  const playAudio = useCallback(
    (item?: INoteBookVocabItem | null, listenMode: string = "normal") => {
      const it = item || current;
      if (!it) return;
      const text = getWordText(it) || getMeaning(it) || getPinyin(it);
      if (!text) return;

      const rate = listenMode === "slow" ? 0.2 : 1;
      const progress =
        listenMode === "slow" ? audioProgressSlow : audioProgress;
      const setIsPlaying =
        listenMode === "slow" ? setSpeakingSlow : setSpeakingNormal;

      // Dừng audio đang phát
      Speech.stop();

      // Reset progress
      progress.setValue(0);
      setIsPlaying(true);

      // Estimate duration (varies by rate)
      const estimatedDuration =
        listenMode === "slow" ? text.length * 1000 : text.length * 500;

      // Start progress animation
      Animated.timing(progress, {
        toValue: 1,
        duration: estimatedDuration,
        useNativeDriver: false,
      }).start();

      Speech.speak(text, {
        language: "zh-CN",
        rate,
        onDone: () => {
          setIsPlaying(false);
          progress.setValue(0);
        },
        onError: () => {
          setIsPlaying(false);
          progress.setValue(0);
        },
      });
    },
    [
      audioProgress,
      audioProgressSlow,
      setSpeakingNormal,
      setSpeakingSlow,
      current,
    ]
  );

  // update current when currentIndex or vocabList changes
  useEffect(() => {
    if (!vocabList) return;
    if (currentIndex >= vocabList.length) {
      setDone(true);
      setCurrent(null);
      return;
    }
    const newCurrent = vocabList[currentIndex];
    setCurrent(newCurrent);
    setInput("");
    setChecked(null);
  }, [currentIndex, vocabList]);

  // Auto-play audio for first question only, after current is set
  useEffect(() => {
    if (
      currentIndex === 0 &&
      current &&
      !hasAutoPlayedRef.current &&
      isInitializedRef.current
    ) {
      hasAutoPlayedRef.current = true;
      setTimeout(() => playAudio(current, "normal"), 300);
    }
  }, [currentIndex, current, playAudio]);

  const goNext = () => {
    if (!vocabList) return;
    setCurrentIndex((i) => i + 1);
  };

  const goBack = () => {
    if (!vocabList) return;
    setCurrentIndex((i) => (i > 0 ? i - 1 : 0));
  };

  const onSubmit = () => {
    if (!current) return;
    const user = normalize(input);
    const answers = [
      normalize(getWordText(current)),
      normalize(getPinyin(current)),
      normalize(getMeaning(current)),
    ].filter(Boolean);
    const ok = answers.some((a) => a && a === user);
    setChecked(ok);
    if (ok) {
      setScore((s) => s + 1);
    }

    // Update status based on result
    const vocabId = (current as any).vocab_id || current.id;
    if (vocabId) {
      const oldStatus =
        statuses[vocabId] || (current as any).status || "chưa thuộc";
      if (ok) {
        // Correct answer -> "đã thuộc"
        updateVocabStatus(vocabId, "đã thuộc", oldStatus);
      } else {
        // Wrong answer -> "chưa thuộc"
        updateVocabStatus(vocabId, "chưa thuộc", oldStatus);
      }
    }
  };

  const restart = () => {
    if (!vocabList) return;
    const reshuffled = shuffle(vocabList);
    hasAutoPlayedRef.current = false;
    setVocabList(reshuffled);
    setCurrentIndex(0);
    setScore(0);
    setDone(false);
    setChecked(null);
    setInput("");
    if (reshuffled.length > 0) setCurrent(reshuffled[0]);
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
              {t("wordFill")}
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

  if (done) {
    return (
      <Done
        theme={theme}
        score={score}
        length={vocabList?.length || 0}
        restart={restart}
      />
    );
  }

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
            {t("wordFill")}
          </Text>
        </View>
      </View>

      <View style={{ paddingLeft: 16, paddingTop: 20 }}>
        <Text
          style={{
            color: getTextColor(theme, "secondary"),
            marginTop: 4,
            fontSize: 22,
            fontWeight: "bold",
          }}
        >
          {t("questionNum")} {currentIndex + 1}/{vocabList?.length || 0}
        </Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingVertical: 20,
            alignItems: "center",
            flexGrow: 1,
            justifyContent: "center",
          }}
          keyboardShouldPersistTaps="handled"
        >
          {current && (current as any).image_url ? (
            <View
              style={{
                borderRadius: 12,
                overflow: "hidden",
                width: 300,
                height: 230,
              }}
            >
              <Image
                source={{ uri: current.image_url }}
                style={{
                  width: "100%",
                  height: "100%",
                  resizeMode: "cover",
                }}
              />
            </View>
          ) : (
            <View
              style={{
                width: 220,
                height: 220,
                borderRadius: 12,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: getBackgroundColor(theme, "tertiary"),
              }}
            >
              <Icon
                source="image-off"
                size={48}
                color={getTextColor(theme, "secondary")}
              />
              <Text
                style={{
                  marginTop: 8,
                  color: getTextColor(theme, "secondary"),
                }}
              >
                {t("noImageAvailable")}
              </Text>
            </View>
          )}

          <View
            style={{
              width: "100%",
              marginTop: 16,
              gap: 8,
              flexDirection: "column",
            }}
          >
            <InputCustom
              value={input}
              onChangeText={setInput}
              placeholder={t("enterAnswer")}
              style={{ marginBottom: 4 }}
            />
            <Button
              mode="contained"
              onPress={onSubmit}
              disabled={input.trim().length === 0}
              icon="send"
            >
              {t("checkBtn")}
            </Button>
          </View>

          {checked !== null && (
            <View
              style={{ width: "100%", marginTop: 12, alignItems: "center" }}
            >
              <Text
                style={{
                  color: checked
                    ? getSolidColor(theme, "success")
                    : getSolidColor(theme, "error"),
                  fontWeight: "700",
                }}
              >
                {checked
                  ? t("correctMsg")
                  : `${t("wrongMsg")} ${
                      getWordText(current) || getMeaning(current)
                    }`}
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
                      fontSize: 24,
                      fontWeight: "700",
                      color: getTextColor(theme),
                      textAlign: "center",
                    }}
                  >
                    {getWordText(current)}
                  </Text>
                  {getPinyin(current) ? (
                    <Text
                      style={{
                        color: getTextColor(theme, "secondary"),
                        textAlign: "center",
                        marginTop: 6,
                      }}
                    >
                      {getPinyin(current)}
                    </Text>
                  ) : null}
                  {getMeaning(current) ? (
                    <Text
                      style={{
                        color: getTextColor(theme, "secondary"),
                        textAlign: "center",
                        marginTop: 8,
                      }}
                    >
                      {getMeaning(current)}
                    </Text>
                  ) : null}
                  {(current as any).notes ? (
                    <Text
                      style={{
                        color: getTextColor(theme, "secondary"),
                        textAlign: "center",
                        marginTop: 8,
                      }}
                    >
                      {(current as any).notes}
                    </Text>
                  ) : null}
                  {(current as any).level &&
                  (current as any).level.length > 0 ? (
                    <Text
                      style={{
                        color: getTextColor(theme, "secondary"),
                        textAlign: "center",
                        marginTop: 8,
                      }}
                    >
                      {(current as any).level.join(", ")}
                    </Text>
                  ) : null}
                </View>
              )}
            </View>
          )}
          <View
            style={{
              flexDirection: "row",
              marginTop: 24,
              width: "100%",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <ButtonCustom
              title={t("backBtn")}
              onPress={goBack}
              size="md"
              startColors={getColorAtived(theme)}
              endColors={getColorAtived(theme)}
              textStyle={{ color: "#fff" }}
            />

            <View style={{ flexDirection: "row", gap: 12 }}>
              <AudioButton
                onPress={() => playAudio(current, "slow")}
                isPlaying={speakingSlow}
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
              <AudioButton
                onPress={() => playAudio(current, "normal")}
                isPlaying={speakingNormal}
                size={48}
                showDuration={false}
                iconName="volume-high"
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
            </View>

            <ButtonCustom
              title={t("goNextButton")}
              onPress={goNext}
              size="md"
              startColors={getColorAtived(theme)}
              endColors={getColorAtived(theme)}
              textStyle={{ color: "#fff" }}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ContainerCustom>
  );
};

export default WordFillScreen;
