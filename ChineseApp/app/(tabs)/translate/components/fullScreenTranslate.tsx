import MicButton from "@/components/shared/micButton";
import SubscriptionUpgradeModal from "@/components/shared/subscriptionUpgradeModal";
import {
  DesignSystem,
  getBackgroundColor,
  getTextColor,
} from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { useSnackbar } from "@/contexts/snackbarContext";
import { useThemeContext } from "@/contexts/themeContext";
import { translate, translateWithAI } from "@/services/translate";
import { TranslationData } from "@/types/translate.type";
import * as Clipboard from "expo-clipboard";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import * as Speech from "expo-speech";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from "react-native";
import { ActivityIndicator, Icon, Text } from "react-native-paper";
import AiTranslationResult from "./aiTranslationResult";

interface FullScreenTranslateProps {
  visible: boolean;
  onClose: () => void;
  initialText?: string;
  sourceLanguage: { code: string; name: string; flag: string };
  targetLanguage: { code: string; name: string; flag: string };
  speechLanguage: string;
}

const FullScreenTranslate = ({
  visible,
  onClose,
  initialText = "",
  sourceLanguage,
  targetLanguage,
  speechLanguage,
}: FullScreenTranslateProps) => {
  const { theme } = useThemeContext();
  const { showSnackbar } = useSnackbar();
  const { t } = useLanguageContext();
  const [inputText, setInputText] = useState(initialText);
  const [translatedText, setTranslatedText] = useState("");
  const [aiTranslationData, setAiTranslationData] =
    useState<TranslationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [translateMode, setTranslateMode] = useState<"normal" | "ai">("normal");
  const [sourceSpeaking, setSourceSpeaking] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const textInputRef = useRef<TextInput>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );
  const slideAnim = useRef(new Animated.Value(visible ? 0 : 1000)).current;

  const textColor = getTextColor(theme, "primary");
  const secondaryTextColor = getTextColor(theme, "secondary");
  const backgroundColor = getBackgroundColor(theme, "primary");

  // Animation for showing/hiding the modal
  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
      // Focus input after animation
      setTimeout(() => {
        textInputRef.current?.focus();
      }, 300);
    } else {
      Animated.spring(slideAnim, {
        toValue: 1000,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
    }
  }, [visible, slideAnim]);

  // Auto translate with debounce
  const handleAutoTranslate = useCallback(
    async (text: string, mode: "normal" | "ai") => {
      if (!text.trim()) {
        setTranslatedText("");
        setAiTranslationData(null);
        return;
      }

      setIsLoading(true);
      try {
        const direction = `${sourceLanguage.code}-${targetLanguage.code}`;

        if (mode === "ai") {
          // Use AI translation with word breakdown
          const res = await translateWithAI(text, direction);
          console.log("AI Translation Response:", res);
          if (res.success) {
            setAiTranslationData(res.data);
            setTranslatedText(""); // Clear normal translation
          } else {
            showSnackbar("Translation123 failed", "error");
            setAiTranslationData(null);
          }
        } else {
          // Use normal translation
          const res = await translate(text, direction, false);
          if (res && res.success && res.data) {
            setTranslatedText(res.data.translated_text);
            setAiTranslationData(null);
          } else {
            showSnackbar("Translation failed", "error");
            setTranslatedText("");
          }
        }
      } catch (error: any) {
        if (
          error?.message?.includes(
            "Bạn đã hết lượt dịch AI theo gói subscription"
          )
        ) {
          setShowUpgradeModal(true);
        } else {
          showSnackbar(
            error?.message || "Translation failed. Please try again.",
            "error"
          );
        }
        setTranslatedText("");
        setAiTranslationData(null);
      } finally {
        setIsLoading(false);
      }
    },
    [sourceLanguage.code, targetLanguage.code, showSnackbar]
  );

  // Handle text change with debounce
  const handleTextChange = (text: string) => {
    setInputText(text);

    // Clear previous timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Set new timeout for auto translate
    debounceRef.current = setTimeout(() => {
      handleAutoTranslate(text, translateMode);
    }, 1000);
  };

  // Handle translate mode change
  const handleModeChange = (mode: "normal" | "ai") => {
    setTranslateMode(mode);
    if (inputText.trim()) {
      handleAutoTranslate(inputText, mode);
    }
  };

  const handleClear = () => {
    setInputText("");
    setTranslatedText("");
    setAiTranslationData(null);
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
  };

  const handleClose = () => {
    Keyboard.dismiss();
    setInputText("");
    setTranslatedText("");
    setAiTranslationData(null);
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    onClose();
  };

  const handleSaveTranslation = () => {
    // Implementation for saving translation
    showSnackbar(t("savedToNotebook"), "success");
  };

  const handleMicResult = (text: string) => {
    setInputText(text);
    handleAutoTranslate(text, translateMode);
  };

  const handleCopySource = async () => {
    if (inputText.trim()) {
      await Clipboard.setStringAsync(inputText);
      showSnackbar(t("copiedText"), "success");
    }
  };

  const handleSpeakSource = async () => {
    if (!inputText.trim()) return;

    try {
      const isSpeaking = await Speech.isSpeakingAsync();

      if (isSpeaking) {
        await Speech.stop();
        setSourceSpeaking(false);
        return;
      }

      setSourceSpeaking(true);

      await Speech.speak(inputText, {
        language: speechLanguage,
        onDone: () => {
          setSourceSpeaking(false);
        },
        onError: () => {
          setSourceSpeaking(false);
        },
      });
    } catch {
      showSnackbar(t("cannotSpeak"), "error");
      setSourceSpeaking(false);
    }
  };

  const handleUpgrade = () => {
    setShowUpgradeModal(false);
    router.push("/(tabs)/home/subscriptions");
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: backgroundColor,
        zIndex: 1000,
        transform: [{ translateY: slideAnim }],
      }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: DesignSystem.spacing.md,
            paddingBottom: DesignSystem.spacing.md,
            ...DesignSystem.shadows[theme].sm,
            backgroundColor: backgroundColor,
            paddingTop: DesignSystem.spacing.xs,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: DesignSystem.spacing.sm,
            }}
          >
            <Pressable onPress={handleClose}>
              <Icon source="arrow-left" size={24} color={textColor} />
            </Pressable>
          </View>

          {inputText.length > 0 && (
            <Pressable onPress={handleClear}>
              <Icon source="close" size={20} color={secondaryTextColor} />
            </Pressable>
          )}
        </View>

        {/* Input Area */}
        <View
          style={{
            flex: translatedText || aiTranslationData ? 0 : 1,
            margin: DesignSystem.spacing.md,
            borderRadius: DesignSystem.borderRadius.lg,
            backgroundColor: getBackgroundColor(theme, "elevated"),
            paddingTop: inputText.trim() !== "" ? DesignSystem.spacing.md : 0,
            ...DesignSystem.shadows[theme].sm,
            flexDirection: "column",
            minHeight: translatedText || aiTranslationData ? 120 : undefined,
          }}
        >
          {inputText.trim() !== "" && (
            <View
              style={{
                top: DesignSystem.spacing.md,
                right: DesignSystem.spacing.md,
                flexDirection: "row",
                gap: DesignSystem.spacing.xs,
                zIndex: 10,
                position: "absolute",
              }}
            >
              <Pressable onPress={handleSpeakSource}>
                <Icon
                  source={sourceSpeaking ? "stop-circle" : "volume-high"}
                  size={18}
                  color={sourceSpeaking ? "#4CAF50" : secondaryTextColor}
                />
              </Pressable>

              <Pressable
                onPress={handleCopySource}
                style={{
                  marginLeft: DesignSystem.spacing.sm,
                }}
              >
                <Icon
                  source="content-copy"
                  size={18}
                  color={secondaryTextColor}
                />
              </Pressable>
            </View>
          )}

          <TextInput
            ref={textInputRef}
            style={{
              fontSize: DesignSystem.typography.fontSize.base,
              fontWeight: DesignSystem.typography.fontWeight.medium,
              padding: DesignSystem.spacing.lg,
              flex: translatedText || aiTranslationData ? 0 : 1,
              height:
                translatedText || aiTranslationData
                  ? Math.max(120, Math.min(200, inputText.length * 0.8 + 60))
                  : "100%",
              width: "100%",
              color: textColor,
            }}
            value={inputText}
            onChangeText={handleTextChange}
            placeholder={t("enterText")}
            placeholderTextColor={secondaryTextColor}
            multiline
            textAlignVertical="top"
          />
        </View>

        {/* Translation Result */}
        {(isLoading || translatedText || aiTranslationData) && (
          <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
            {isLoading ? (
              <View
                style={{
                  padding: 40,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ActivityIndicator size="large" color="#4A90E2" />
                <Text
                  style={{
                    marginTop: DesignSystem.spacing.md,
                    fontSize: DesignSystem.typography.fontSize.sm,
                    color: secondaryTextColor,
                  }}
                >
                  {t("translating")}
                </Text>
              </View>
            ) : aiTranslationData ? (
              <AiTranslationResult
                data={aiTranslationData}
                targetLang={targetLanguage.code}
                onSave={handleSaveTranslation}
              />
            ) : translatedText ? (
              <View
                style={{
                  margin: DesignSystem.spacing.md,
                  borderRadius: DesignSystem.borderRadius.lg,
                  backgroundColor: getBackgroundColor(theme, "elevated"),
                  ...DesignSystem.shadows[theme].sm,
                }}
              >
                {/* Action buttons row - completely separate */}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    padding: DesignSystem.spacing.md,
                    paddingBottom: DesignSystem.spacing.sm,
                    gap: DesignSystem.spacing.sm,
                  }}
                >
                  <Pressable
                    onPress={async () => {
                      try {
                        const isSpeaking = await Speech.isSpeakingAsync();
                        if (isSpeaking) {
                          await Speech.stop();
                          return;
                        }
                        await Speech.speak(translatedText, {
                          language: targetLanguage.code,
                        });
                      } catch {
                        showSnackbar(t("cannotPronounce"), "error");
                      }
                    }}
                  >
                    <Icon
                      source="volume-high"
                      size={18}
                      color={getTextColor(theme, "primary")}
                    />
                  </Pressable>

                  <Pressable
                    onPress={async () => {
                      await Clipboard.setStringAsync(translatedText);
                      showSnackbar(t("copiedTranslation"), "success");
                    }}
                  >
                    <Icon
                      source="content-copy"
                      size={18}
                      color={getTextColor(theme, "primary")}
                    />
                  </Pressable>

                  <Pressable onPress={handleSaveTranslation}>
                    <Icon
                      source="bookmark"
                      size={18}
                      color={getTextColor(theme, "primary")}
                    />
                  </Pressable>
                </View>

                {/* Language badge row */}
                <View
                  style={{
                    paddingHorizontal: DesignSystem.spacing.md,
                    paddingBottom: DesignSystem.spacing.sm,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: DesignSystem.spacing.sm,
                      paddingHorizontal: DesignSystem.spacing.sm,
                      paddingVertical: DesignSystem.spacing.xs,
                      borderRadius: DesignSystem.borderRadius.md,
                      backgroundColor:
                        theme === "light"
                          ? "rgba(74, 144, 226, 0.1)"
                          : "rgba(74, 144, 226, 0.2)",
                      alignSelf: "flex-start",
                    }}
                  >
                    <Icon source="translate" size={14} color="#4A90E2" />
                    <Text
                      style={{
                        fontSize: DesignSystem.typography.fontSize.sm,
                        fontWeight: DesignSystem.typography.fontWeight.semibold,
                        color: "#4A90E2",
                      }}
                    >
                      {t("translateTo") +
                        " " +
                        targetLanguage.code.toUpperCase()}
                    </Text>
                  </View>
                </View>

                {/* Translation content - full width */}
                <View
                  style={{
                    padding: DesignSystem.spacing.md,
                    paddingTop: 0,
                  }}
                >
                  <Text
                    style={{
                      fontSize: DesignSystem.typography.fontSize.lg,
                      lineHeight: 28,
                      color: textColor,
                      fontWeight: DesignSystem.typography.fontWeight.medium,
                    }}
                    selectable
                  >
                    {translatedText}
                  </Text>
                </View>
              </View>
            ) : null}
          </ScrollView>
        )}

        {/* Bottom Controls */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: DesignSystem.spacing.md,
            paddingVertical: DesignSystem.spacing.md,
            paddingBottom: Platform.OS === "ios" ? 44 : DesignSystem.spacing.lg,
            backgroundColor: backgroundColor,
            ...DesignSystem.shadows[theme].sm,
            minHeight: Platform.OS === "ios" ? 90 : 80,
          }}
        >
          {/* Mic Button */}
          <MicButton
            theme={theme}
            onChangeText={handleMicResult}
            showSnackbar={showSnackbar}
            language={speechLanguage}
            size={48}
          />

          {/* Translation Mode Selector */}
          <View
            style={{
              flexDirection: "row",
              backgroundColor:
                theme === "dark"
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(0,0,0,0.06)",
              borderRadius: 25,
              padding: 3,
              gap: 2,
            }}
          >
            <Pressable
              style={{
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 20,
                alignItems: "center",
                justifyContent: "center",
                minWidth: 80,
              }}
              onPress={() => handleModeChange("normal")}
            >
              {translateMode === "normal" ? (
                <LinearGradient
                  colors={["#4A90E2", "#357ABD"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    borderRadius: 20,
                  }}
                />
              ) : null}
              <Text
                style={{
                  fontSize: DesignSystem.typography.fontSize.sm,
                  color: translateMode === "normal" ? "#FFFFFF" : textColor,
                  fontWeight:
                    translateMode === "normal"
                      ? DesignSystem.typography.fontWeight.semibold
                      : DesignSystem.typography.fontWeight.medium,
                }}
              >
                {t("normal")}
              </Text>
            </Pressable>

            <Pressable
              style={{
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 20,
                alignItems: "center",
                justifyContent: "center",
                minWidth: 80,
              }}
              onPress={() => handleModeChange("ai")}
            >
              {translateMode === "ai" ? (
                <LinearGradient
                  colors={["#9C27B0", "#7B1FA2"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    borderRadius: 20,
                  }}
                />
              ) : null}
              <Text
                style={{
                  fontSize: DesignSystem.typography.fontSize.sm,
                  color: translateMode === "ai" ? "#FFFFFF" : textColor,
                  fontWeight:
                    translateMode === "ai"
                      ? DesignSystem.typography.fontWeight.semibold
                      : DesignSystem.typography.fontWeight.medium,
                }}
              >
                {t("ai")}
              </Text>
            </Pressable>
          </View>

          {/* Spacer to balance layout */}
          <View style={{ width: 48 }} />
        </View>
      </KeyboardAvoidingView>
      <SubscriptionUpgradeModal
        visible={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onUpgrade={handleUpgrade}
      />
    </Animated.View>
  );
};

export default React.memo(FullScreenTranslate);
