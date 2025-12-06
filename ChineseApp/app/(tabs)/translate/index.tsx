import {
  DesignSystem,
  getBackgroundColor,
  getTextColor,
} from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { useThemeContext } from "@/contexts/themeContext";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { ActivityIndicator, Icon, Text } from "react-native-paper";
import LanguageSelector from "./components/languageSelector";
import TranslationInput from "./components/translationInput";

import { ContainerCustom } from "@/components/shared/containerCustom";
import FullScreenTranslate from "./components/fullScreenTranslate";
import TranslationResult from "./components/translationResult";

interface Language {
  code: string;
  name: string;
  flag: string;
}

export default function TranslateScreen() {
  const { theme } = useThemeContext();
  const { t } = useLanguageContext();
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFullScreenMode, setIsFullScreenMode] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setIsFullScreenMode(false);
    }, [])
  );

  const languages: Language[] = [
    { code: "vi", name: "Tiếng Việt", flag: "🇻🇳" },
    { code: "zh", name: "中文", flag: "🇨🇳" },
  ];

  const [sourceLanguage, setSourceLanguage] = useState<Language>(languages[0]);
  const [targetLanguage, setTargetLanguage] = useState<Language>(languages[1]);

  // Map UI language codes to speech-recognition locales
  const getSpeechLocale = (code: string) => {
    switch (code) {
      case "zh":
        return "zh-CN";
      case "vi":
        return "vi-VN";
      default:
        return `${code}-${code.toUpperCase()}`;
    }
  };

  const speechLanguage = getSpeechLocale(sourceLanguage.code);

  const handleSwapLanguages = useCallback(() => {
    const temp = sourceLanguage;
    setSourceLanguage(targetLanguage);
    setTargetLanguage(temp);

    if (inputText && translatedText) {
      setInputText(translatedText);
      setTranslatedText(inputText);
    }
  }, [sourceLanguage, targetLanguage, inputText, translatedText]);

  const handleSaveTranslation = useCallback(() => {
    Alert.alert(t("saveToNotebook"), t("selectNotebook"), [
      { text: t("cancel"), style: "cancel" },
      {
        text: t("favorite"),
        onPress: () => console.log("Saved to Favorites"),
      },
      {
        text: t("mastered"),
        onPress: () => console.log("Saved to Mastered"),
      },
    ]);
  }, [t]);

  const handleClear = useCallback(() => {
    setInputText("");
    setTranslatedText("");
  }, []);

  const handleTranslateHistory = useCallback(() => {
    router.push("/translate/translateHistory");
  }, []);

  return (
    <ContainerCustom variant="background" scrollable={false}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: DesignSystem.spacing.md,
          gap: DesignSystem.spacing.md,
          ...DesignSystem.shadows[theme].md,
          backgroundColor: getBackgroundColor(theme, "primary"),
        }}
      >
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: DesignSystem.typography.fontSize.xl,
              fontWeight: DesignSystem.typography.fontWeight.bold,
              color: getTextColor(theme, "primary"),
            }}
          >
            {t("translate")}
          </Text>
        </View>
        <Pressable onPress={handleTranslateHistory}>
          <Icon
            source="history"
            size={24}
            color={getTextColor(theme, "primary")}
          />
        </Pressable>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Language Selector */}
          <LanguageSelector
            sourceLanguage={sourceLanguage}
            targetLanguage={targetLanguage}
            onSwapPress={handleSwapLanguages}
            isKeyboardOpen={isKeyboardOpen}
          />

          {/* Input Area */}
          <TranslationInput
            value={inputText}
            onChangeText={(text) => {
              setInputText(text);
              setTranslatedText("");
            }}
            onFocus={() => setIsKeyboardOpen(true)}
            onBlur={() => setIsKeyboardOpen(false)}
            onClear={handleClear}
            language={speechLanguage}
            onFullScreenMode={() => setIsFullScreenMode(true)}
          />

          {/* Loading Indicator */}
          {isLoading && (
            <View
              style={{
                padding: 40,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ActivityIndicator size="large" color="#4A90E2" />
            </View>
          )}

          {/* Translation Result */}
          {!isLoading && translatedText && (
            <TranslationResult
              sourceText={inputText}
              translatedText={translatedText}
              sourceLang={sourceLanguage.code}
              targetLang={targetLanguage.code}
              onSave={handleSaveTranslation}
            />
          )}
          {/* Test components - có thể xóa sau khi hoàn thành */}
          {/* <RealDeviceSpeechTest /> */}
          {/* <SimpleSpeechTest /> */}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Full Screen Translate Mode */}
      <FullScreenTranslate
        visible={isFullScreenMode}
        onClose={() => setIsFullScreenMode(false)}
        initialText={inputText}
        sourceLanguage={sourceLanguage}
        targetLanguage={targetLanguage}
        speechLanguage={speechLanguage}
      />
    </ContainerCustom>
  );
}
