import { DesignSystem, getTextColor } from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { IResultExam } from "@/types/mockTest.type";
import { pauseAudio, playRemoteAudio, stopAudio } from "@/utils/play_audio";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Modal,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { Icon, Text } from "react-native-paper";
import PromptItem from "./PromptItem";
import PromptQuestionItem from "./PromptQuestionItem";
import QuestionItem from "./QuestionItem";

interface QuestionDetailModalProps {
  visible: boolean;
  onClose: () => void;
  result: IResultExam;
  initialQuestionId: string;
  theme: string;
}

export default function QuestionDetailModal({
  visible,
  onClose,
  result,
  initialQuestionId,
  theme,
}: QuestionDetailModalProps) {
  const { t } = useLanguageContext();
  const flatListRef = useRef<FlatList>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [durationMs, setDurationMs] = useState(0);
  const [positionMs, setPositionMs] = useState(0);
  // Prompt audio status (when an item has a prompt we play first)
  const [promptAudioStatus, setPromptAudioStatus] = useState({
    isPlaying: false,
    durationMs: 0,
    positionMs: 0,
  });
  const promptAnimatedProgress = useRef(new Animated.Value(0)).current;
  const isAutoPlayingRef = useRef(false);
  const autoPlayTimerRef = useRef<number | null>(null);
  const [currentAudioUrl, setCurrentAudioUrl] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const animatedProgress = useRef(new Animated.Value(0)).current;
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  const colors = useColorScheme();

  const handleClose = useCallback(() => {
    stopAudio().catch(() => {});
    onClose();
  }, [onClose]);

  // Play an audio URL (always stop any previous audio first)
  const playAudioUrl = useCallback(
    async (audioUrl?: string | null) => {
      if (!audioUrl) return;
      // mark that auto-play is happening (used by prompt flow to avoid races)
      isAutoPlayingRef.current = true;

      try {
        // stop any previously playing audio
        await stopAudio();
      } catch (err) {
        void err;
      }

      // Reset progress state
      setDurationMs(0);
      setPositionMs(0);
      animatedProgress.setValue(0);

      // mark current audio URL and playing state
      setCurrentAudioUrl(audioUrl);
      setIsPlayingAudio(true);

      await playRemoteAudio(
        String(audioUrl),
        () => {
          setIsPlayingAudio(false);
          animatedProgress.setValue(1);
          animatedProgress.stopAnimation();
          setCurrentAudioUrl(null);
          // clear auto-play flag when finished
          isAutoPlayingRef.current = false;
        },
        (status) => {
          if (status && (status as any).isLoaded) {
            const s = status as any;
            const dur = s.durationMillis || 0;
            const pos = s.positionMillis || 0;
            setDurationMs(dur);
            setPositionMs(pos);
            setIsPlayingAudio(!!s.isPlaying);

            if (dur > 0 && s.isPlaying) {
              const ratio = Math.min(1, pos / dur);
              animatedProgress.setValue(ratio);
            }
          }
        }
      );
    },
    [animatedProgress]
  );

  // Toggle audio: if same url -> pause/resume; otherwise play new url
  const toggleAudio = useCallback(
    async (audioUrl?: string | null) => {
      if (!audioUrl) return;

      // If currently playing the same url -> pause
      if (currentAudioUrl === audioUrl && isPlayingAudio) {
        await pauseAudio();
        setIsPlayingAudio(false);
        animatedProgress.stopAnimation();
        return;
      }

      // Play requested url (stops previous first)
      await playAudioUrl(audioUrl);
    },
    [currentAudioUrl, isPlayingAudio, playAudioUrl, animatedProgress]
  );

  // Group questions by their prompts (memoized so reference is stable)
  const allItems = React.useMemo(
    () =>
      result.sections.flatMap((section) =>
        section.subsections.flatMap((subsection) => {
          const items: any[] = [];

          // Group questions by prompt_id
          const questionsByPrompt: { [key: string]: any[] } = {};
          const questionsWithoutPrompt: any[] = [];

          subsection.questions.forEach((question) => {
            if (question.prompt_id) {
              if (!questionsByPrompt[question.prompt_id]) {
                questionsByPrompt[question.prompt_id] = [];
              }
              questionsByPrompt[question.prompt_id].push(question);
            } else {
              questionsWithoutPrompt.push(question);
            }
          });

          // Add prompts with their questions
          if (subsection.prompts && subsection.prompts.length > 0) {
            subsection.prompts.forEach((prompt) => {
              const promptQuestions = questionsByPrompt[prompt.id] || [];
              promptQuestions.forEach((question) => {
                items.push({
                  type: "prompt_question",
                  prompt,
                  question,
                  sectionName: section.name,
                  subsectionName: subsection.name,
                });
              });
            });
          }

          // Add questions without prompts
          questionsWithoutPrompt.forEach((question) => {
            items.push({
              type: "question",
              question,
              sectionName: section.name,
              subsectionName: subsection.name,
            });
          });

          return items;
        })
      ),
    [result]
  );

  // Calculate initial index
  const initialIndex = React.useMemo(() => {
    return allItems.findIndex(
      (item) => item.question?.id === initialQuestionId
    );
  }, [allItems, initialQuestionId]);

  // Set currentQuestionIndex when initialQuestionId changes
  useEffect(() => {
    if (initialIndex !== -1) {
      setCurrentQuestionIndex(initialIndex);
    }
  }, [initialIndex]);

  // Auto-play audio when modal opens or question changes
  useEffect(() => {
    let mounted = true;

    const tryAutoPlay = async () => {
      if (!mounted) return;
      if (visible && allItems.length > 0) {
        const currentItem =
          allItems[Math.min(currentQuestionIndex, allItems.length - 1)];

        // If initial question not found, don't auto-play
        if (initialIndex === -1 && currentQuestionIndex === 0) return;

        // Don't auto-play the first item if opening modal to a different question
        if (currentQuestionIndex === 0 && initialIndex !== 0) return;

        // reset UI states first
        setCurrentAudioUrl(null);
        setIsPlayingAudio(false);
        animatedProgress.setValue(0);
        setPromptAudioStatus({
          isPlaying: false,
          durationMs: 0,
          positionMs: 0,
        });
        promptAnimatedProgress.setValue(0);

        if (!currentItem) return;

        // If there is a prompt audio, play prompt first then question audio
        if (
          currentItem.type === "prompt_question" &&
          currentItem.prompt?.audio_url
        ) {
          // Avoid racing auto-plays
          if (isAutoPlayingRef.current) return;
          isAutoPlayingRef.current = true;

          try {
            setPromptAudioStatus({
              isPlaying: true,
              durationMs: 0,
              positionMs: 0,
            });
            promptAnimatedProgress.setValue(0);

            // Play prompt audio and when finished, play question audio (if any)
            await playRemoteAudio(
              String(currentItem.prompt.audio_url),
              async () => {
                setPromptAudioStatus({
                  isPlaying: false,
                  durationMs: 0,
                  positionMs: 0,
                });
                promptAnimatedProgress.setValue(1);
                promptAnimatedProgress.stopAnimation();
                isAutoPlayingRef.current = false;

                if (currentItem.question?.audio_url) {
                  // small delay to allow UI sync
                  // clear any existing scheduled timer first
                  if (autoPlayTimerRef.current) {
                    clearTimeout(autoPlayTimerRef.current as any);
                    autoPlayTimerRef.current = null;
                  }

                  const t = setTimeout(
                    () => playAudioUrl(currentItem.question.audio_url),
                    50
                  );
                  autoPlayTimerRef.current = t as unknown as number;
                }
              },
              (status: any) => {
                if (status && status.isLoaded) {
                  const dur = status.durationMillis || 0;
                  const pos = status.positionMillis || 0;
                  setPromptAudioStatus({
                    isPlaying: !!status.isPlaying,
                    durationMs: dur,
                    positionMs: pos,
                  });
                  if (dur > 0 && status.isPlaying) {
                    const ratio = Math.min(1, pos / dur);
                    promptAnimatedProgress.setValue(ratio);
                  }
                }
              }
            );
          } catch (err) {
            console.error("Auto-play prompt error:", err);
            isAutoPlayingRef.current = false;
            setPromptAudioStatus({
              isPlaying: false,
              durationMs: 0,
              positionMs: 0,
            });
          }
        } else if (currentItem.question?.audio_url) {
          // No prompt audio — just play question audio
          // clear any existing scheduled timer
          if (autoPlayTimerRef.current) {
            clearTimeout(autoPlayTimerRef.current as any);
            autoPlayTimerRef.current = null;
          }

          // Always stop previous and play new, even if auto-playing
          void playAudioUrl(currentItem.question.audio_url);
        } else {
          // nothing to play
          // stopAudio already called at the beginning
        }
      }
    };

    tryAutoPlay();

    return () => {
      mounted = false;
      if (autoPlayTimerRef.current) {
        clearTimeout(autoPlayTimerRef.current as any);
        autoPlayTimerRef.current = null;
      }
      // ensure any pending auto-play flag is cleared
      isAutoPlayingRef.current = false;
    };
  }, [
    visible,
    currentQuestionIndex,
    allItems,
    playAudioUrl,
    animatedProgress,
    promptAnimatedProgress,
    initialIndex,
  ]);
  // include promptAnimatedProgress in deps to satisfy hook linting

  useEffect(() => {
    if (!visible) {
      stopAudio().catch(() => {});
      setCurrentAudioUrl(null);
      setIsPlayingAudio(false);
      animatedProgress.setValue(0);
      // reset prompt audio UI as well
      setPromptAudioStatus({ isPlaying: false, durationMs: 0, positionMs: 0 });
      promptAnimatedProgress.setValue(0);
    }
  }, [visible, animatedProgress, promptAnimatedProgress]);

  // Update current question index when scrolling
  const handleScrollEnd = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / screenWidth);
    setCurrentQuestionIndex(index);
    // Stop any playing audio when scrolling to a new question
    stopAudio().catch(() => {});
  };

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    if (item.type === "prompt") {
      return (
        <PromptItem
          item={item}
          colors={colors}
          promptAudioStatus={promptAudioStatus}
          promptAnimatedProgress={promptAnimatedProgress}
          screenWidth={screenWidth}
          screenHeight={screenHeight}
        />
      );
    }

    if (item.type === "prompt_question") {
      return (
        <PromptQuestionItem
          item={item}
          colors={colors}
          promptAudioStatus={promptAudioStatus}
          promptAnimatedProgress={promptAnimatedProgress}
          screenWidth={screenWidth}
          screenHeight={screenHeight}
          theme={theme}
          onToggleAudio={toggleAudio}
          isPlaying={
            currentAudioUrl === item.question.audio_url && isPlayingAudio
          }
          durationMs={durationMs}
          positionMs={positionMs}
          animatedProgress={animatedProgress}
        />
      );
    }

    return (
      <QuestionItem
        item={item}
        screenWidth={screenWidth}
        screenHeight={screenHeight}
        theme={theme}
        onToggleAudio={toggleAudio}
        isPlaying={
          currentAudioUrl === item.question.audio_url && isPlayingAudio
        }
        durationMs={durationMs}
        positionMs={positionMs}
        animatedProgress={animatedProgress}
      />
    );
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={handleClose}>
      <View
        style={{
          flex: 1,
          backgroundColor: theme === "light" ? "#FFFFFF" : "#000000",
        }}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: DesignSystem.spacing.md,
            borderBottomWidth: 1,
            borderBottomColor: theme === "light" ? "#E5E7EB" : "#374151",
            marginTop: 40,
          }}
        >
          <TouchableOpacity onPress={handleClose}>
            <Icon
              source="close"
              size={24}
              color={getTextColor(theme as "light" | "dark", "primary")}
            />
          </TouchableOpacity>
          <Text
            style={{
              flex: 1,
              textAlign: "center",
              fontSize: DesignSystem.typography.fontSize.lg,
              fontWeight: DesignSystem.typography.fontWeight.bold,
              color: getTextColor(theme as "light" | "dark", "primary"),
            }}
          >
            {t("questionDetails")}
          </Text>
        </View>

        {/* Questions */}
        <FlatList
          ref={flatListRef}
          data={allItems}
          renderItem={renderItem}
          keyExtractor={(item, index) =>
            item.type === "prompt"
              ? `prompt-${item.prompt.id}-${index}`
              : `question-${item.question.id}-${index}`
          }
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          initialScrollIndex={initialIndex >= 0 ? initialIndex : 0}
          onMomentumScrollEnd={handleScrollEnd}
          getItemLayout={(data, index) => ({
            length: screenWidth,
            offset: screenWidth * index,
            index,
          })}
        />
      </View>
    </Modal>
  );
}
