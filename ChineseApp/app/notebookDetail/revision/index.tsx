import AudioButton from "@/components/shared/audioButton";
import { ButtonCustom } from "@/components/shared/buttonCustom";
import { ContainerCustom } from "@/components/shared/containerCustom";
import {
  DesignSystem,
  getBackgroundColor,
  getBorderColor,
  getColorAtived,
  getSolidColor,
  getTextColor,
} from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { useThemeContext } from "@/contexts/themeContext";
import { useVocabReview } from "@/hooks/useNoteBook";
import { useVocabStatusUpdate } from "@/hooks/useVocabStatusUpdate";
import { NotebookVocabItemStatus } from "@/types/common.type";
import shuffle from "@/utils/shuffle";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Speech from "expo-speech";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Animated, FlatList, Pressable, View } from "react-native";
import { Icon, Text } from "react-native-paper";
import Done from "../components/shared/done";

const getWordText = (it: any) => it?.hanzi;
const getPinyin = (it: any) => it?.pinyin || it?.yinbiao || "";
const getMeaning = (it: any) => it?.meaning;

const RevisionScreen = () => {
  const { notebookId, isFromAdmin, newNoteId } = useLocalSearchParams();
  const router = useRouter();
  const [vocabList, setVocabList] = useState<any[] | null>(null);
  const [index, setIndex] = useState(0);
  const [choices, setChoices] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const isInitialized = React.useRef(false);
  const audioProgress = useRef(new Animated.Value(0)).current;
  const { theme } = useThemeContext();
  const id = isFromAdmin === "true" ? newNoteId : notebookId;
  const { data, isLoading } = useVocabReview(id as string);
  const { t } = useLanguageContext();

  const { updateVocabStatus, statuses, updatingStatus } = useVocabStatusUpdate({
    notebookId: id as string,
    isFromAdmin: isFromAdmin === "true",
    originalNotebookId: notebookId as string,
  });
  console.log("Revision Data123:", data);

  useEffect(() => {
    if (data) {
      const vocabularies = data as any[];
      if (vocabularies.length > 0 && !isInitialized.current) {
        const shuffled = shuffle(vocabularies);
        setVocabList(shuffled);
        setIndex(0);
        setScore(0);
        isInitialized.current = true;
      }
    }
  }, [data]);

  const buildChoices = (correct: any, pool: any[]) => {
    // Sử dụng vocab_id hoặc id tùy theo dữ liệu trả về
    const correctId = correct.vocab_id || correct.id;
    const others = pool.filter((p) => (p.vocab_id || p.id) !== correctId);
    const shuffledOthers = shuffle(others);
    const distractors = shuffledOthers
      .slice(0, 3)
      .map((d) => getMeaning(d) || "");
    // fill if not enough distractors
    while (distractors.length < 3) distractors.push("—");
    const options = shuffle([getMeaning(correct) || "", ...distractors]);
    return options;
  };

  const playWord = useCallback(
    (item: any) => {
      const text = getWordText(item) || getMeaning(item);
      if (!text) return;

      // Reset progress
      audioProgress.setValue(0);
      setSpeaking(true);

      // Estimate duration (approximate: 0.5s per character for Chinese)
      const estimatedDuration = text.length * 200;

      // Start progress animation
      Animated.timing(audioProgress, {
        toValue: 1,
        duration: estimatedDuration,
        useNativeDriver: false,
      }).start();

      Speech.speak(text, {
        language: "zh-CN",
        rate: 1,
        onDone: () => {
          setSpeaking(false);
          audioProgress.setValue(0);
        },
        onError: () => {
          setSpeaking(false);
          audioProgress.setValue(0);
        },
      });
    },
    [audioProgress, setSpeaking]
  );

  useEffect(() => {
    if (vocabList && vocabList.length > 0 && index < vocabList.length) {
      const cur = vocabList[index];
      const opts = buildChoices(cur, vocabList);
      setChoices(opts);
      setSelected(null);
      // Tự động phát âm khi chuyển câu
      playWord(cur);
    } else if (vocabList && index >= vocabList.length) {
      setDone(true);
    }
  }, [vocabList, index, playWord]);

  const toggleStatus = async (
    id: string,
    newStatus: NotebookVocabItemStatus
  ) => {
    // Prevent multiple concurrent status updates for the same item
    if (updatingStatus === id) return;

    // Tìm item hiện tại để lấy trạng thái cũ (hỗ trợ cả vocab_id và id)
    const currentItem = vocabList?.find(
      (item) => (item.vocab_id || item.id) === id
    );
    if (!currentItem) return;

    const oldStatus = statuses[id] || currentItem.status;

    // Use the hook's updateVocabStatus function
    await updateVocabStatus(id, newStatus, oldStatus);
  };

  const onSelect = async (opt: string) => {
    if (!vocabList) return;
    if (selected) return;
    setSelected(opt);
    const currentVocab = vocabList[index];
    const correct =
      getMeaning(vocabList[index]) || getWordText(vocabList[index]);

    // Lấy id từ vocab_id hoặc id
    const vocabId = currentVocab.vocab_id || currentVocab.id;

    if (opt === correct) {
      setScore((s) => s + 1);
      // Chọn đúng -> cập nhật vào sổ tay "đã thuộc"
      if (notebookId && vocabId) {
        toggleStatus(vocabId, "đã thuộc");
      }
    } else {
      // Chọn sai -> cập nhật vào sổ tay "chưa thuộc"
      if (notebookId && vocabId) {
        toggleStatus(vocabId, "chưa thuộc");
      }
    }
  };

  const onNext = () => {
    if (!vocabList) return;
    setSelected(null); // Reset selection before moving to next question
    if (index + 1 >= vocabList.length) {
      setIndex((i) => i + 1);
      setDone(true);
      return;
    }
    setIndex((i) => i + 1);
  };

  const restart = () => {
    if (!vocabList) return;
    const reshuffled = shuffle(vocabList);
    setVocabList(reshuffled);
    setIndex(0);
    setScore(0);
    setDone(false);
    isInitialized.current = true; // Đảm bảo không reset lại từ notebookDetail
    if (reshuffled.length > 0) {
      const opts = buildChoices(reshuffled[0], reshuffled);
      setChoices(opts);
    }
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
              {t("reviewVocab")}
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

  // show completion screen when done
  if (done) {
    return (
      <Done
        theme={theme}
        score={score}
        restart={restart}
        length={vocabList?.length || 0}
      />
    );
  }

  if (!vocabList) return null;

  const cur = vocabList[index];
  const correctAnswer = getMeaning(cur) || getWordText(cur);

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
            {t("reviewVocab")}
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
          {t("questionNum")} {index + 1}/{vocabList?.length || 0}
        </Text>
      </View>

      <AudioButton
        onPress={() => playWord(cur)}
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

      <View
        style={{
          paddingHorizontal: 16,
          paddingBottom: 20,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 42,
            fontWeight: "800",
            color: getTextColor(theme),
          }}
        >
          {getWordText(cur)}
        </Text>
        {getPinyin(cur) ? (
          <Text
            style={{ marginTop: 8, color: getTextColor(theme, "secondary") }}
          >
            {getPinyin(cur)}
          </Text>
        ) : null}
      </View>

      <FlatList
        data={choices}
        keyExtractor={(item, idx) => `${item}-${idx}`}
        style={{ paddingHorizontal: 16, flex: 1 }}
        renderItem={({ item, index: idx }) => {
          const isSelected = selected === item;
          const isCorrect = item === correctAnswer;
          const baseBg = getSolidColor(theme, "card");
          let bg = baseBg;
          let borderColor = getBorderColor(theme);
          if (selected) {
            if (isSelected) {
              bg = isCorrect
                ? getSolidColor(theme, "success")
                : getSolidColor(theme, "error");
              borderColor = isCorrect
                ? getSolidColor(theme, "success")
                : getSolidColor(theme, "error");
            } else if (isCorrect) {
              bg = getSolidColor(theme, "success");
              borderColor = getSolidColor(theme, "success");
            }
          }
          return (
            <Pressable
              onPress={() => onSelect(item)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: 14,
                borderRadius: DesignSystem.borderRadius.md,
                backgroundColor: bg,
                marginBottom: 12,
                borderWidth: 1,
                borderColor,
              }}
            >
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: getBackgroundColor(theme, "tertiary"),
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 12,
                }}
              >
                <Text style={{ color: getTextColor(theme), fontWeight: "700" }}>
                  {String.fromCharCode(65 + idx)}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: getTextColor(theme), fontSize: 16 }}>
                  {item}
                </Text>
              </View>
            </Pressable>
          );
        }}
      />
      <ButtonCustom
        title={t("nextQuestion")}
        onPress={onNext}
        size="md"
        fullWidth
        startColors={getColorAtived(theme)}
        endColors={getColorAtived(theme)}
        textStyle={{ color: "#fff" }}
        style={{ padding: 20 }}
      />
    </ContainerCustom>
  );
};

export default RevisionScreen;
