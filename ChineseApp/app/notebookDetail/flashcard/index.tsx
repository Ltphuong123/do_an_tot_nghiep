import { ButtonCustom } from "@/components/shared/buttonCustom";
import { ContainerCustom } from "@/components/shared/containerCustom";
import {
  DesignSystem,
  getBackgroundColor,
  getColorAtived,
  getTextColor,
} from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { useThemeContext } from "@/contexts/themeContext";
import { useVocabReview } from "@/hooks/useNoteBook";
import { useVocabStatusUpdate } from "@/hooks/useVocabStatusUpdate";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Speech from "expo-speech";
import React, { useCallback, useEffect, useState } from "react";
import { Animated, Dimensions, Pressable, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Icon, Text } from "react-native-paper";

import { NotebookVocabItemStatus } from "@/types/common.type";
import { IVocabularyReview } from "@/types/notebook.type";
import FlashcardItem from "./components/FlashcardItem";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = Math.min(360, SCREEN_WIDTH - 48);
const H_GAP = 32; // gap between cards
const SIDE_PADDING = Math.max((SCREEN_WIDTH - CARD_WIDTH) / 2, 16);

const Flashcard = () => {
  const { notebookId, isFromAdmin, newNoteId } = useLocalSearchParams();
  const router = useRouter();
  const { theme } = useThemeContext();
  const { t } = useLanguageContext();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [speaking, setSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); // Single lock for all operations
  const audioProgress = React.useRef(new Animated.Value(0)).current;
  const rotateYs = React.useRef<Animated.Value[]>([]).current;
  const [cardFlips, setCardFlips] = useState<Record<number, boolean>>({});

  const scrollX = React.useRef(new Animated.Value(0)).current;
  const listRef = React.useRef<Animated.FlatList<IVocabularyReview> | null>(
    null
  );

  const hasPlayedInitialAudioRef = React.useRef(false);
  const navigationTimeoutRef = React.useRef<number | null>(null);
  const lastActionTimeRef = React.useRef<number>(0);
  const vocabListRef = React.useRef<IVocabularyReview[]>([]); // Store vocab list in ref
  const noteId = isFromAdmin === "true" ? newNoteId : notebookId;

  const { data, isLoading } = useVocabReview(noteId as string);
  const [vocabList, setVocabList] = useState<IVocabularyReview[]>([]);
  console.log("Vocab review data fetched:", data);

  const { updateVocabStatus, statuses } = useVocabStatusUpdate({
    notebookId: noteId as string,
    isFromAdmin: isFromAdmin === "true",
    originalNotebookId: notebookId as string,
    onSuccess: () => {
      // Unlock and move to next card after successful status update
      setIsProcessing(false);
      setTimeout(() => {
        moveToNextCard();
      }, 100);
    },
  });

  useEffect(() => {
    // Only set vocabList ONCE - don't re-shuffle on refetch
    if (data && vocabListRef.current.length === 0) {
      const vocabularies = data as any[];
      if (vocabularies.length > 0) {
        vocabListRef.current = vocabularies; // Store in ref
        setVocabList(vocabularies);
        console.log(
          "Vocab list initialized with",
          vocabularies.length,
          "items"
        );
      }
    }
  }, [data]);

  // snap offsets so each card centers on screen
  const snapOffsets = React.useMemo(() => {
    if (!vocabList) return [];
    return vocabList.map((_, i) => i * (CARD_WIDTH + H_GAP) + H_GAP / 2);
  }, [vocabList]);

  // Play audio function - simplified
  const playAudio = useCallback(
    (index: number) => {
      if (!vocabList || !vocabList[index]) return;

      const item = vocabList[index];
      const text =
        (item as any).hanzi ||
        (item as any).word ||
        (item as any).pinyin ||
        (item as any).meaning;
      if (!text) return;

      // Stop any currently playing speech
      Speech.stop();

      // Reset progress
      audioProgress.setValue(0);

      // Estimate duration (approximate: 200ms per character for Chinese)
      const estimatedDuration = text.length * 200;

      Speech.speak(text, {
        language: "zh-CN",
        rate: 1,
        onStart: () => {
          setSpeaking(true);
          // Start progress animation
          Animated.timing(audioProgress, {
            toValue: 1,
            duration: estimatedDuration,
            useNativeDriver: false,
          }).start();
        },
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
    [vocabList, audioProgress]
  );

  // Initial setup: scroll to first card and play audio ONCE
  useEffect(() => {
    if (vocabList.length > 0 && !hasPlayedInitialAudioRef.current) {
      hasPlayedInitialAudioRef.current = true;
      setTimeout(() => {
        const initialOffset = H_GAP / 2;
        listRef.current?.scrollToOffset({
          offset: initialOffset,
          animated: false,
        });
        setTimeout(() => {
          playAudio(0);
        }, 300);
      }, 50);
    }
  }, [vocabList, playAudio]);

  // Navigate to next card - WITH DEBOUNCE
  const moveToNextCard = useCallback(() => {
    // Use ref instead of state to avoid issues with refetch
    const listLength = vocabListRef.current.length;

    // Prevent if at end
    if (currentIndex >= listLength - 1) {
      console.log("Already at end");
      return;
    }

    // Debounce - prevent rapid calls
    const now = Date.now();
    if (now - lastActionTimeRef.current < 800) {
      console.log("Debounced - too fast");
      return;
    }

    // Check if already processing
    if (isProcessing) {
      console.log("Already processing");
      return;
    }

    lastActionTimeRef.current = now;
    const nextIndex = currentIndex + 1;

    console.log(`Moving from ${currentIndex} to ${nextIndex}`);

    // Clear any existing timeout
    if (navigationTimeoutRef.current) {
      clearTimeout(navigationTimeoutRef.current);
    }

    // Lock
    setIsProcessing(true);

    // Stop audio
    Speech.stop();

    // Update index
    setCurrentIndex(nextIndex);

    // Scroll
    const offset = snapOffsets[nextIndex];
    listRef.current?.scrollToOffset({ offset, animated: true });

    // Schedule audio and unlock
    navigationTimeoutRef.current = setTimeout(() => {
      playAudio(nextIndex);

      // Unlock after short delay
      navigationTimeoutRef.current = setTimeout(() => {
        console.log("Unlocking");
        setIsProcessing(false);
      }, 300);
    }, 400);
  }, [currentIndex, snapOffsets, playAudio, isProcessing]);

  const toggleStatus = useCallback(
    (vocabId: string, newStatus: NotebookVocabItemStatus) => {
      // Prevent if processing
      if (isProcessing) {
        console.log("Toggle blocked - processing");
        return;
      }

      const currentItem = vocabListRef.current.find(
        (item) => item.vocab_id === vocabId
      );
      if (!currentItem) return;

      const oldStatus =
        statuses[vocabId] || (currentItem as any).status || "chưa thuộc";

      console.log(`Toggling status for ${vocabId} to ${newStatus}`);

      // Lock
      setIsProcessing(true);

      // Optimistic update - update the item in vocabListRef
      vocabListRef.current = vocabListRef.current.map((item) =>
        item.vocab_id === vocabId
          ? ({ ...item, status: newStatus } as any)
          : item
      );

      // Use the hook's updateVocabStatus function
      updateVocabStatus(vocabId, newStatus, oldStatus).catch(() => {
        // Revert the change in vocabListRef on error
        vocabListRef.current = vocabListRef.current.map((item) =>
          item.vocab_id === vocabId
            ? ({ ...item, status: oldStatus } as any)
            : item
        );
        setIsProcessing(false);
      });
    },
    [isProcessing, updateVocabStatus, statuses]
  );

  const handleCardFlip = useCallback(
    (index: number) => {
      setCardFlips((prev) => {
        const newFlips = { ...prev, [index]: !prev[index] };
        const isFlipped = newFlips[index];
        if (!rotateYs[index]) {
          rotateYs[index] = new Animated.Value(0);
        }
        const rotateY = rotateYs[index];
        Animated.spring(rotateY, {
          toValue: isFlipped ? 180 : 0,
          useNativeDriver: true,
          speed: 14,
          bounciness: 6,
        }).start();
        return newFlips;
      });
    },
    [rotateYs]
  );

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
      <GestureHandlerRootView style={{ flex: 1 }}>
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
                Flashcard
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
      </GestureHandlerRootView>
    );
  }
  // Animated.FlatList exists already — no need to wrap again
  const AnimatedFlatList =
    Animated.FlatList as unknown as typeof Animated.FlatList;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
              {t("flashcard")}
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
            {currentIndex + 1}/{vocabList.length}
          </Text>
        </View>

        <AnimatedFlatList
          ref={(r) => {
            listRef.current = r;
          }}
          data={vocabList}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.vocab_id}
          renderItem={({ item, index }) => (
            <FlashcardItem
              item={item}
              index={index}
              theme={theme}
              cardFlips={cardFlips}
              rotateYs={rotateYs}
              scrollX={scrollX}
              playAudio={playAudio}
              toggleStatus={toggleStatus}
              isProcessing={isProcessing}
              statuses={statuses}
              audioProgress={audioProgress}
              speaking={speaking}
              handleCardFlip={handleCardFlip}
            />
          )}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
          onScrollBeginDrag={() => {
            // Stop audio when user manually starts scrolling
            if (!isProcessing) {
              Speech.stop();
            }
          }}
          onMomentumScrollEnd={(event) => {
            // Update current index when scroll ends
            const contentOffsetX = event.nativeEvent.contentOffset.x;
            const newIndex = Math.round(
              (contentOffsetX - H_GAP / 2) / (CARD_WIDTH + H_GAP)
            );
            if (
              newIndex !== currentIndex &&
              newIndex >= 0 &&
              newIndex < vocabList.length
            ) {
              setCurrentIndex(newIndex);
              // Play audio for the new card after a short delay
              setTimeout(() => {
                playAudio(newIndex);
              }, 300);
            }
          }}
          snapToOffsets={snapOffsets}
          scrollEventThrottle={16}
          contentContainerStyle={{
            paddingVertical: 24,
            paddingHorizontal: SIDE_PADDING,
          }}
          decelerationRate="fast"
          snapToAlignment="center"
          initialNumToRender={5}
          maxToRenderPerBatch={3}
          windowSize={5}
          scrollEnabled={true}
        />
      </ContainerCustom>
    </GestureHandlerRootView>
  );
};

export default Flashcard;
