import { getQuestionNumberAudio } from "@/assets/audio/question-numbers";
import AudioButton from "@/components/shared/audioButton";
import HtmlRenderer from "@/components/shared/htmlRenderer";
import { AutoImage } from "@/components/shared/imageCustomer";
import { useLanguageContext } from "@/contexts/languageContext";
import { useThemeContext } from "@/contexts/themeContext";
import { IPrompt, IQuestion } from "@/types/mockTest.type";
import {
  pauseAudio,
  playRemoteAudio,
  playSequentialAudios,
  stopAudio,
} from "@/utils/play_audio";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Animated, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";
import PromptDisplay from "./PromptDisplay";
import MultipleChoiceQuestion from "./question-types/MultipleChoiceQuestion";
import OrderingQuestion from "./question-types/OrderingQuestion";
import SpeakingQuestion from "./question-types/SpeakingQuestion";
import TextInputQuestion from "./question-types/TextInputQuestion";

interface QuestionDisplayProps {
  question: IQuestion;
  questionNumber: number; // Pass question number from parent
  selectedAnswer?: string | string[];
  onAnswerSelect: (questionId: string, answer: string | string[]) => void;
  prompt?: IPrompt; // Associated prompt if any
  onAutoNext?: () => void; // optional: advance to next question after answer
  sectionName?: string;
  subsectionIndex?: number; // Add subsection index to track subsection changes
}

const isLocalAsset = (v: any) => typeof v === "number";

const useColors = () => {
  const { theme } = useThemeContext();
  const isDark = theme === "dark";
  return useMemo(
    () => ({
      // Updated palettes for better contrast and modern look
      background: isDark ? "#071025" : "#FFFFFF",
      card: isDark ? "#081226" : "#FFFFFF",
      text: isDark ? "#E6F0FA" : "#0F1724",
      primary: isDark ? "#4F8CF7" : "#1565D8",
      primaryDark: isDark ? "#2B67D9" : "#0D47A1",
      // softer borders in light mode, stronger in dark
      border: isDark ? "#123147" : "#D1E8FF",
      // option backgrounds that read as cards vs selected state
      optionBg: isDark ? "#071B2B" : "#f4f5f5ff",
      labelBg: isDark ? "#123A5A" : "#CFE6FF",
      onPrimary: "#FFFFFF",
      theme: theme,
    }),
    [theme]
  );
};

const QuestionDisplay: React.FC<QuestionDisplayProps> = React.memo(
  ({
    question,
    questionNumber,
    selectedAnswer: propSelectedAnswer,
    onAnswerSelect,
    prompt,
    onAutoNext,
    sectionName,
    subsectionIndex,
  }) => {
    const colors = useColors();
    const { t } = useLanguageContext();
    const [isPlayingAudio, setIsPlayingAudio] = useState(false);
    const [durationMs, setDurationMs] = useState<number>(0);
    const [positionMs, setPositionMs] = useState<number>(0);
    const animatedProgress = useRef(new Animated.Value(0)).current;
    const autoNextTimer = React.useRef<ReturnType<typeof setTimeout> | null>(
      null
    );
    const playedPrompts = useRef<Set<string>>(new Set());

    // Add state for prompt audio status
    const [promptAudioStatus, setPromptAudioStatus] = useState({
      isPlaying: false,
      durationMs: 0,
      positionMs: 0,
    });
    const promptAnimatedProgress = useRef(new Animated.Value(0)).current;
    const isAutoPlaying = useRef(false);

    // Remove localSelectedAnswer - use prop directly
    const selectedAnswer = propSelectedAnswer;

    // Remove unused initialOrder

    console.log("Rendering QuestionDisplay for question:", question);

    useEffect(() => {
      // Khi câu hỏi thay đổi, dừng audio hiện tại nếu có và reset progress state
      let isMounted = true;

      const cleanup = async () => {
        try {
          // Force stop any playing audio
          await stopAudio();

          // Clear any pending auto-next timer
          if (autoNextTimer.current) {
            clearTimeout(autoNextTimer.current);
            autoNextTimer.current = null;
          }

          if (!isMounted) return;

          // Reset all audio states
          setIsPlayingAudio(false);
          setDurationMs(0);
          setPositionMs(0);
          animatedProgress.setValue(0);
          animatedProgress.stopAnimation();

          // Reset prompt audio status
          setPromptAudioStatus({
            isPlaying: false,
            durationMs: 0,
            positionMs: 0,
          });
          promptAnimatedProgress.setValue(0);
          promptAnimatedProgress.stopAnimation();

          // Reset auto-play flag
          isAutoPlaying.current = false;
        } catch (error) {
          console.error("Error cleaning up audio:", error);
        }
      };

      cleanup();

      return () => {
        isMounted = false;
        // Clear timer on unmount
        if (autoNextTimer.current) {
          clearTimeout(autoNextTimer.current);
          autoNextTimer.current = null;
        }
      };
    }, [question.id, animatedProgress, promptAnimatedProgress]);

    // Reset played prompts when subsection changes
    useEffect(() => {
      playedPrompts.current.clear();
    }, [subsectionIndex]);

    const playAudio = useCallback(
      async (src?: string | number) => {
        if (!src) return;
        try {
          // Stop any currently loaded sound to ensure fresh start
          await stopAudio();

          // Reset progress state
          setDurationMs(0);
          setPositionMs(0);
          animatedProgress.setValue(0);

          // Prepare audio sources for sequential playback
          const audioSources: (number | string)[] = [];

          // Add question number audio if available
          const questionNumberAudio = getQuestionNumberAudio(questionNumber);
          if (questionNumberAudio) {
            audioSources.push(questionNumberAudio);
          }

          // Add main question audio
          audioSources.push(typeof src === "string" ? src : Number(src));

          // Always set playing state first
          setIsPlayingAudio(true);

          // Play sequentially if we have multiple sources
          if (audioSources.length > 1) {
            // Play question number first, then main audio with progress tracking
            await playSequentialAudios([audioSources[0]]);

            // Now play the main audio with progress tracking
            await playRemoteAudio(
              String(audioSources[1]),
              () => {
                setIsPlayingAudio(false);
                animatedProgress.setValue(1);
                animatedProgress.stopAnimation();
              },
              (status) => {
                if (status && (status as any).isLoaded) {
                  const s = status as any;
                  const dur = s.durationMillis || 0;
                  const pos = s.positionMillis || 0;
                  setDurationMs(dur);
                  setPositionMs(pos);
                  setIsPlayingAudio(!!s.isPlaying);

                  // sync animated progress to playback position
                  if (dur > 0) {
                    const ratio = Math.min(1, pos / dur);
                    animatedProgress.setValue(ratio);
                  }
                }
              }
            );
          } else {
            // Single audio with progress tracking
            await playRemoteAudio(
              String(src),
              () => {
                setIsPlayingAudio(false);
                animatedProgress.setValue(1);
                animatedProgress.stopAnimation();
              },
              (status) => {
                if (status && (status as any).isLoaded) {
                  const s = status as any;
                  const dur = s.durationMillis || 0;
                  const pos = s.positionMillis || 0;
                  setDurationMs(dur);
                  setPositionMs(pos);
                  setIsPlayingAudio(!!s.isPlaying);

                  // sync animated progress to playback position
                  if (dur > 0) {
                    const ratio = Math.min(1, pos / dur);
                    animatedProgress.setValue(ratio);
                  }
                }
              }
            );
          }
        } catch (err) {
          console.error("Error playing audio:", err);
          setIsPlayingAudio(false);
          animatedProgress.setValue(0);
        }
      },
      [questionNumber, animatedProgress]
    );

    const handleMainAudio = async () => {
      if (isPlayingAudio) {
        await pauseAudio();
        setIsPlayingAudio(false);
        animatedProgress.stopAnimation();
        return;
      }

      if (!question.audio_url) return;

      // Dừng hoàn toàn âm thanh cũ trước khi phát mới
      await stopAudio();

      // Reset progress state
      setDurationMs(0);
      setPositionMs(0);
      animatedProgress.setValue(0);

      // Set playing state immediately
      setIsPlayingAudio(true);

      // Start playing and subscribe to status updates
      await playRemoteAudio(
        String(question.audio_url),
        () => {
          setIsPlayingAudio(false);
          animatedProgress.setValue(1);
          animatedProgress.stopAnimation();
        },
        (status) => {
          if (status && (status as any).isLoaded) {
            const s = status as any;
            const dur = s.durationMillis || 0;
            const pos = s.positionMillis || 0;
            setDurationMs(dur);
            setPositionMs(pos);
            setIsPlayingAudio(!!s.isPlaying);

            // sync animated progress to playback position
            if (dur > 0) {
              const ratio = Math.min(1, pos / dur);
              animatedProgress.setValue(ratio);
            }
          }
        }
      );
    };

    // Auto-play audio when entering a new question
    useEffect(() => {
      // Prevent multiple auto-plays for same question
      if (isAutoPlaying.current) return;

      let isMounted = true;
      isAutoPlaying.current = true;

      const playAudios = async () => {
        try {
          // Ensure previous audio is fully stopped before starting new one
          await stopAudio();

          // Small delay to ensure audio system is ready
          await new Promise((resolve) => setTimeout(resolve, 100));

          if (!isMounted) {
            isAutoPlaying.current = false;
            return;
          }

          // Check if prompt audio should be played
          if (
            prompt &&
            prompt.audio_url &&
            !playedPrompts.current.has(prompt.id)
          ) {
            // Play prompt audio first
            playedPrompts.current.add(prompt.id);

            if (!isMounted) {
              isAutoPlaying.current = false;
              return;
            }

            setPromptAudioStatus({
              isPlaying: true,
              durationMs: 0,
              positionMs: 0,
            });
            promptAnimatedProgress.setValue(0);

            await playRemoteAudio(
              String(prompt.audio_url),
              () => {
                if (!isMounted) return;

                setPromptAudioStatus({
                  isPlaying: false,
                  durationMs: 0,
                  positionMs: 0,
                });
                promptAnimatedProgress.setValue(1);
                promptAnimatedProgress.stopAnimation();

                // After prompt finishes, play question audio if available
                if (question.audio_url && isMounted) {
                  playAudio(String(question.audio_url)).finally(() => {
                    isAutoPlaying.current = false;
                  });
                } else {
                  isAutoPlaying.current = false;
                }
              },
              (status: any) => {
                if (!isMounted) return;

                if (status && status.isLoaded) {
                  const dur = status.durationMillis || 0;
                  const pos = status.positionMillis || 0;
                  setPromptAudioStatus({
                    isPlaying: !!status.isPlaying,
                    durationMs: dur,
                    positionMs: pos,
                  });
                  if (dur > 0) {
                    const ratio = Math.min(1, pos / dur);
                    promptAnimatedProgress.setValue(ratio);
                  }
                }
              }
            );
          } else if (question.audio_url) {
            // Play question audio directly
            if (!isMounted) {
              isAutoPlaying.current = false;
              return;
            }

            await playAudio(String(question.audio_url));
            isAutoPlaying.current = false;
          } else {
            isAutoPlaying.current = false;
          }
        } catch (error) {
          console.error("Error in auto-play:", error);
          if (isMounted) {
            setPromptAudioStatus({
              isPlaying: false,
              durationMs: 0,
              positionMs: 0,
            });
          }
          isAutoPlaying.current = false;
        }
      };

      playAudios();

      return () => {
        isMounted = false;
      };
    }, [
      question.id,
      question.audio_url,
      prompt?.id,
      prompt?.audio_url,
      prompt,
      playAudio,
      promptAnimatedProgress,
    ]); // Include all dependencies
    // Advance to next question after a delay if onAutoNext is provided
    // and the answered question is not empty
    const wrappedOnAnswerSelect = React.useCallback(
      (answer: string | string[]) => {
        // notify parent
        onAnswerSelect(question.id, answer);

        // auto-advance if provided and answer is non-empty
        // Skip auto-advance for speaking questions (section "Nói") and text input questions
        if (
          onAutoNext &&
          sectionName !== "Nói" &&
          question.options &&
          question.options.length > 0
        ) {
          const isEmpty =
            answer === "" ||
            (Array.isArray(answer) && (answer as any[]).length === 0);
          if (!isEmpty) {
            if (autoNextTimer.current) {
              clearTimeout(autoNextTimer.current);
            }
            autoNextTimer.current = setTimeout(() => {
              onAutoNext();
              autoNextTimer.current = null;
            }, 1000);
          }
        }
      },
      [onAnswerSelect, onAutoNext, question.id, question.options, sectionName]
    );

    React.useEffect(() => {
      // clear pending auto-next when question changes/unmount
      return () => {
        if (autoNextTimer.current) {
          clearTimeout(autoNextTimer.current);
          autoNextTimer.current = null;
        }
      };
    }, [question.id]);

    // Determine question type and render appropriate component
    const renderQuestionContent = () => {
      // Check if it's a speaking section
      if (sectionName === "Nói") {
        return (
          <SpeakingQuestion
            selectedAnswer={selectedAnswer}
            onAnswerSelect={(answer) => wrappedOnAnswerSelect(answer)}
            colors={colors}
          />
        );
      }

      // If question has no options, it's a text input question
      if (!question.options || question.options.length === 0) {
        return (
          <TextInputQuestion
            selectedAnswer={selectedAnswer}
            onAnswerSelect={(answer) => wrappedOnAnswerSelect(answer)}
            colors={colors}
          />
        );
      }

      // Check if options have meaningful content or images
      const hasOptionContent = question.options.some(
        (opt) => (opt.content && opt.content.trim() !== "") || opt.image_url
      );

      // If options only have labels but no content AND no images, render compact label-only layout
      if (!hasOptionContent) {
        return (
          <View style={{ marginTop: 16 }}>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "flex-start",
                gap: 12,
              }}
            >
              {question.options.map((option) => {
                const isSelected = selectedAnswer === option.id;
                return (
                  <TouchableOpacity
                    key={option.id}
                    onPress={() => wrappedOnAnswerSelect(option.id)}
                    style={{
                      backgroundColor: isSelected
                        ? colors.primary
                        : colors.optionBg,
                      borderColor: isSelected ? colors.primary : colors.border,
                      borderWidth: 1.5,
                      borderRadius: 12,
                      paddingHorizontal: 20,
                      paddingVertical: 12,
                      minWidth: 60,
                      alignItems: "center",
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 4,
                      elevation: 2,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "600",
                        color: isSelected ? colors.onPrimary : colors.text,
                      }}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        );
      }

      // Check if it's an ordering question (options have null/empty labels)
      // This is for word ordering questions like "sắp xếp từ theo thứ tự đúng"
      const isOrderingQuestion = question.options.every(
        (opt) => opt.label === null || opt.label === ""
      );

      if (isOrderingQuestion) {
        return (
          <OrderingQuestion
            options={question.options}
            selectedAnswer={selectedAnswer}
            onAnswerSelect={(answer) => wrappedOnAnswerSelect(answer)}
            colors={colors}
          />
        );
      }

      // Check if it's a sentence ordering question
      // This has labels (A, B, C, D) but empty content in question
      // and options like "câu 1", "câu 2", "câu 3", "câu 4"
      const isSentenceOrdering =
        !question.content &&
        question.options.length > 0 &&
        question.options.every(
          (opt) => opt.label !== null && opt.label !== ""
        ) &&
        question.options.some((opt) => opt.content?.includes("câu"));

      if (isSentenceOrdering) {
        return (
          <OrderingQuestion
            options={question.options}
            selectedAnswer={selectedAnswer}
            onAnswerSelect={(answer) => wrappedOnAnswerSelect(answer)}
            colors={colors}
          />
        );
      }

      // Default to multiple choice (includes True/False, 3-option, 4-option, 5-option)
      return (
        <MultipleChoiceQuestion
          options={question.options}
          selectedAnswer={selectedAnswer}
          onAnswerSelect={(options) => wrappedOnAnswerSelect(options)}
          colors={colors}
        />
      );
    };

    console.log("QuestionDisplay: prompt prop:", prompt);

    return (
      <View style={{ width: "100%" }}>
        {prompt && (
          <PromptDisplay
            prompt={prompt}
            colors={colors}
            autoPlayStatus={promptAudioStatus}
            autoPlayProgress={promptAnimatedProgress}
          />
        )}

        <View
          style={{
            borderRadius: 14,
            padding: 16,
            marginHorizontal: 16,
            marginVertical: 10,
            width: "90%",
            alignSelf: "center",
          }}
        >
          <Text style={{ fontSize: 17, fontWeight: "600", marginBottom: 12 }}>
            {t("questionWithPoints")} {questionNumber}: ({question.points}{" "}
            {t("points")})
          </Text>

          {question.audio_url && (
            <AudioButton
              onPress={handleMainAudio}
              isPlaying={isPlayingAudio}
              durationMs={durationMs}
              positionMs={positionMs}
              size={56}
              showDuration={true}
              strokeDashoffset={animatedProgress.interpolate({
                inputRange: [0, 1],
                outputRange: [2 * Math.PI * 28, 0],
              })}
              colors={{
                border: colors.border,
                primary: colors.primary,
                optionBg: colors.optionBg,
                onPrimary: colors.onPrimary,
                text: colors.text,
              }}
            />
          )}

          {question.content !== "" && question.image_url ? (
            <View
              style={{
                display: "flex",
                justifyContent: "flex-start",
                gap: 8,
                marginBottom: 20,
              }}
            >
              <HtmlRenderer
                htmlContent={question.content}
                theme={colors.theme}
              />
              <AutoImage
                source={{ uri: question.image_url as string }}
                maxWidthPercent={0.8}
              />
            </View>
          ) : question.image_url === null && question.content !== "" ? (
            <HtmlRenderer htmlContent={question.content} theme={colors.theme} />
          ) : (
            question.image_url && (
              <View style={{ alignItems: "center", marginBottom: 20 }}>
                <AutoImage
                  source={
                    isLocalAsset(question.image_url)
                      ? (question.image_url as any)
                      : { uri: question.image_url as string }
                  }
                  maxWidthPercent={0.8}
                />
              </View>
            )
          )}

          {renderQuestionContent()}
        </View>
      </View>
    );
  }
);

QuestionDisplay.displayName = "QuestionDisplay";

export default QuestionDisplay;
