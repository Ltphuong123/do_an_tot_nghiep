import Done from "@/app/notebookDetail/components/shared/done";
import AudioButton from "@/components/shared/audioButton";
import { ButtonCustom } from "@/components/shared/buttonCustom";
import { ContainerCustom } from "@/components/shared/containerCustom";
import DesignSystem, {
  getBackgroundColor,
  getBorderColor,
  getSolidColor,
  getTextColor,
} from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { useThemeContext } from "@/contexts/themeContext";
import {
  CreateLessonAiPayload,
  PhraseItem,
  VocabularyItem,
} from "@/types/createLessonAi.types";
import shuffle from "@/utils/shuffle";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Speech from "expo-speech";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Animated, FlatList, Pressable, View } from "react-native";
import { Icon, Text } from "react-native-paper";

type RevisionItem = {
  id: string;
  chinese: string;
  pinyin: string;
  meaning: string;
  type: "vocabulary" | "phrase";
};

export default function AILessonRevisionPage() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Parse lesson data from params
  const data: CreateLessonAiPayload = JSON.parse(params.data as string);

  const { theme } = useThemeContext();
  const { t } = useLanguageContext();
  const [revisionList, setRevisionList] = useState<RevisionItem[] | null>(null);
  const [index, setIndex] = useState(0);
  const [choices, setChoices] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const hasPlayedRef = useRef<number>(-1);
  const audioProgress = useRef(new Animated.Value(0)).current;
  const nextTimerRef = useRef<number | null>(null);
  const audioTimerRef = useRef<number | null>(null);
  const currentIndexRef = useRef<number>(-1);

  const buildChoices = (correct: RevisionItem, pool: RevisionItem[]) => {
    const others = pool.filter((p) => p.id !== correct.id);
    const shuffledOthers = shuffle(others);
    const distractors = shuffledOthers.slice(0, 3).map((d) => d.meaning || "");

    // Fill if not enough distractors
    while (distractors.length < 3) distractors.push("—");

    const options = shuffle([correct.meaning, ...distractors]);
    return options;
  };

  useEffect(() => {
    if (data && !revisionList) {
      // Combine vocabularies and phrases into revision items
      const vocabItems: RevisionItem[] = data.vocabularies.map(
        (item: VocabularyItem, idx: number) => ({
          id: `vocab-${idx}`,
          chinese: item.hanzi,
          pinyin: item.pinyin,
          meaning: item.meaning,
          type: "vocabulary",
        })
      );

      const phraseItems: RevisionItem[] = data.phrases.map(
        (item: PhraseItem, idx: number) => ({
          id: `phrase-${idx}`,
          chinese: item.text,
          pinyin: item.pinyin,
          meaning: item.meaning,
          type: "phrase",
        })
      );

      const allItems = [...vocabItems, ...phraseItems];
      const shuffled = shuffle(allItems);
      setRevisionList(shuffled);
      setIndex(0);
      setScore(0);
    }
  }, [data, revisionList]);

  // Build choices using useMemo to prevent unnecessary re-renders
  const currentChoices = useMemo(() => {
    if (!revisionList || index >= revisionList.length) return [];
    const currentItem = revisionList[index];
    return buildChoices(currentItem, revisionList);
  }, [revisionList, index]);

  useEffect(() => {
    setChoices(currentChoices);
  }, [currentChoices]);

  const playWord = useCallback(
    (item: RevisionItem) => {
      const text = item.chinese;
      if (!text || speaking) return; // Prevent multiple calls if already speaking

      // Reset progress
      audioProgress.setValue(0);
      setSpeaking(true);

      // Estimate duration (approximate: 0.5s per character for Chinese)
      const estimatedDuration = text.length * 150;

      // Start progress animation
      Animated.timing(audioProgress, {
        toValue: 1,
        duration: estimatedDuration,
        useNativeDriver: false,
      }).start();

      Speech.speak(text, {
        language: "zh-CN",
        rate: 0.8,
        onDone: () => {
          setSpeaking(false);
          audioProgress.setValue(0);
        },
        onError: () => {
          setSpeaking(false);
          audioProgress.setValue(0);
        },
        onStopped: () => {
          setSpeaking(false);
          audioProgress.setValue(0);
        },
      });
    },
    [speaking, audioProgress]
  );

  // Main effect to handle question setup when index changes
  useEffect(() => {
    if (!revisionList || revisionList.length === 0) return;

    // Prevent duplicate setup for same index
    if (currentIndexRef.current === index) return;

    // Check if we've completed all questions
    if (index >= revisionList.length) {
      setDone(true);
      return;
    }

    // Don't auto-play if transitioning
    if (isTransitioning) return;

    // Setup current question
    setSelected(null);
    setIsTransitioning(false);

    currentIndexRef.current = index;

    // Auto-play audio after a short delay, only if we haven't played this question yet
    if (hasPlayedRef.current !== index) {
      const currentItem = revisionList[index];
      audioTimerRef.current = setTimeout(() => {
        // Double check conditions before playing
        if (hasPlayedRef.current === index) return; // Already played
        if (!currentItem.chinese) return; // No text to speak
        if (isTransitioning) return; // Don't play if transitioning

        hasPlayedRef.current = index;
        audioProgress.setValue(0);
        setSpeaking(true);

        const estimatedDuration = currentItem.chinese.length * 500;
        Animated.timing(audioProgress, {
          toValue: 1,
          duration: estimatedDuration,
          useNativeDriver: false,
        }).start();

        Speech.speak(currentItem.chinese, {
          language: "zh-CN",
          rate: 0.8,
          onDone: () => {
            setSpeaking(false);
            audioProgress.setValue(0);
          },
          onError: () => {
            setSpeaking(false);
            audioProgress.setValue(0);
          },
          onStopped: () => {
            setSpeaking(false);
            audioProgress.setValue(0);
          },
        });
      }, 600);

      return () => {
        if (audioTimerRef.current) {
          clearTimeout(audioTimerRef.current);
          audioTimerRef.current = null;
        }
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revisionList, index, isTransitioning]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (nextTimerRef.current) {
        clearTimeout(nextTimerRef.current);
      }
      if (audioTimerRef.current) {
        clearTimeout(audioTimerRef.current);
      }
    };
  }, []);

  const onSelect = (opt: string) => {
    if (!revisionList) return;
    if (selected) return;
    setSelected(opt);
    const correct = revisionList[index].meaning;
    if (opt === correct) {
      setScore((s) => s + 1);
    }
  };

  const onNext = () => {
    if (!revisionList || selected === null) return;
    setSelected(null);
    // Prevent rapid clicking
    if (isTransitioning) return;

    setIsTransitioning(true);

    // Clear any existing timer
    if (nextTimerRef.current) {
      clearTimeout(nextTimerRef.current);
      nextTimerRef.current = null;
    }

    // Clear any pending audio timer
    if (audioTimerRef.current) {
      clearTimeout(audioTimerRef.current);
      audioTimerRef.current = null;
    }

    // Stop any current speech immediately
    Speech.stop();
    setSpeaking(false);

    // Move to next question after a brief delay
    nextTimerRef.current = setTimeout(() => {
      if (index + 1 >= revisionList.length) {
        setDone(true);
      } else {
        setIndex((prevIndex) => prevIndex + 1);
      }
      setIsTransitioning(false);
      nextTimerRef.current = null;
    }, 300);
  };

  const restart = () => {
    if (!revisionList) return;

    // Clear any pending timer
    if (nextTimerRef.current) {
      clearTimeout(nextTimerRef.current);
      nextTimerRef.current = null;
    }

    // Clear any pending audio timer
    if (audioTimerRef.current) {
      clearTimeout(audioTimerRef.current);
      audioTimerRef.current = null;
    }

    // Stop all speech and reset states
    Speech.stop();
    setSpeaking(false);
    setIsTransitioning(false);

    // Reset all game states
    const reshuffled = shuffle(revisionList);
    setRevisionList(reshuffled);
    setIndex(0);
    setScore(0);
    setDone(false);
    setSelected(null);
    hasPlayedRef.current = -1; // Reset played tracking
    currentIndexRef.current = -1; // Reset current index tracking
  };

  const handleBack = () => {
    router.back();
  };

  if (!revisionList) return null;

  // Show completion screen when done
  if (done) {
    return (
      <Done
        theme={theme}
        score={score}
        restart={restart}
        length={revisionList.length}
      />
    );
  }

  const cur = revisionList[index];
  const correctAnswer = cur.meaning;

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
        <Pressable
          onPress={handleBack}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor:
              theme === "light" ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.06)",
          }}
        >
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
            {t("aiLessonRevision")}
          </Text>
        </View>
      </View>

      {/* Progress */}
      <View style={{ paddingLeft: 16, paddingTop: 20 }}>
        <Text
          style={{
            color: getTextColor(theme, "secondary"),
            marginTop: 4,
            fontSize: 22,
            fontWeight: "bold",
          }}
        >
          {t("question")} {index + 1}/{revisionList.length}
        </Text>
        <Text
          style={{
            color: getTextColor(theme, "secondary"),
            fontSize: DesignSystem.typography.fontSize.sm,
            marginTop: 4,
          }}
        >
          {cur.type === "vocabulary" ? t("vocabulary") : t("phrase")}
        </Text>
      </View>

      {/* Audio Button */}
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

      {/* Chinese Text */}
      <View
        style={{
          paddingHorizontal: 16,
          paddingBottom: 20,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: cur.type === "vocabulary" ? 42 : 32,
            fontWeight: "800",
            color: getTextColor(theme),
            textAlign: "center",
            lineHeight: cur.type === "vocabulary" ? 50 : 40,
          }}
        >
          {cur.chinese}
        </Text>
        {cur.pinyin && (
          <Text
            style={{
              marginTop: 8,
              color: getTextColor(theme, "secondary"),
              fontSize: DesignSystem.typography.fontSize.md,
              textAlign: "center",
            }}
          >
            {cur.pinyin}
          </Text>
        )}
      </View>

      {/* Answer Choices */}
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
              {selected && isSelected && (
                <Icon
                  source={isCorrect ? "check" : "close"}
                  size={20}
                  color={isCorrect ? "#4CAF50" : "#F44336"}
                />
              )}
            </Pressable>
          );
        }}
      />

      {/* Next Button */}
      <View style={{ margin: 16 }}>
        <ButtonCustom
          title={
            index + 1 === revisionList.length
              ? t("complete")
              : isTransitioning
              ? t("switching")
              : t("nextQuestion")
          }
          onPress={onNext}
          disabled={speaking}
          startColors={getSolidColor(theme, "primary")}
          endColors={getSolidColor(theme, "primary")}
          textStyle={{ color: "#fff", marginRight: 8 }}
          icon="volume-high"
        />
      </View>
    </ContainerCustom>
  );
}
