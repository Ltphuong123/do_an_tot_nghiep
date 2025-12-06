import { ContainerCustom } from "@/components/shared/containerCustom";
import {
  DesignSystem,
  getBackgroundColor,
  getTextColor,
} from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { useSnackbar } from "@/contexts/snackbarContext";
import { useThemeContext } from "@/contexts/themeContext";
import {
  useAddVocabToNotebook,
  useRefreshNotebookStatus,
  useSearchVocab,
} from "@/hooks/useNoteBook";
import { useNotebookStore } from "@/store/useNotebookStore";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { Icon, Text } from "react-native-paper";
import { SearchInput } from "./components/SearchInput";
import { SearchResults } from "./components/SearchResults";

function CreateVocab() {
  const { notebookId } = useLocalSearchParams();
  const { theme } = useThemeContext();
  const { showSnackbar } = useSnackbar();
  const { t } = useLanguageContext();

  const [searchVocab, setSearchVocab] = useState("");
  const [isAddingVocab, setIsAddingVocab] = useState<string | null>(null);
  const { updateNotebookVocabCount } = useNotebookStore();

  const addVocabMutation = useAddVocabToNotebook();
  const refreshNotebookStatusMutation = useRefreshNotebookStatus();
  const { data: searchData, isLoading: searchLoading } = useSearchVocab(
    searchVocab.trim()
  );

  const handleGoBack = () => {
    router.back();
  };

  const handleAddToNotebook = (vocabId: string) => {
    Keyboard.dismiss();
    setIsAddingVocab(vocabId);
    addVocabMutation.mutate(
      { notebooksId: notebookId as string, vocabId, status: "chưa thuộc" },
      {
        onSuccess: (data) => {
          showSnackbar(t("addVocabSuccess"), "success");
          const newCount = data.data.newTotalVocabCount;
          if (typeof newCount === "number") {
            updateNotebookVocabCount(notebookId as string, newCount);
          }

          // Refresh status "chưa thuộc" để cập nhật số lượng ngay lập tức
          refreshNotebookStatusMutation
            .mutateAsync("chưa thuộc")
            .catch((error) => {
              console.error("Error refreshing chưa thuộc status:", error);
            });

          setIsAddingVocab(null);
        },
        onError: (error: any) => {
          showSnackbar(error.message || t("addToNotebookErrorMsg"), "error");
          setIsAddingVocab(null);
        },
      }
    );
  };

  const textColor = getTextColor(theme, "primary");

  // Search results from hook
  const searchResults = searchData?.data || [];

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ContainerCustom variant="background" scrollable={false}>
        {/* Custom Header */}
        <View
          style={{
            padding: DesignSystem.spacing.md,
            flexDirection: "row",
            alignItems: "center",
            gap: DesignSystem.spacing.sm,
            backgroundColor: getBackgroundColor(theme, "primary"),
            ...DesignSystem.shadows[theme].md,
          }}
        >
          <Pressable onPress={handleGoBack}>
            <Icon
              source="arrow-left"
              size={24}
              color={theme === "light" ? "#000" : "#FFF"}
            />
          </Pressable>

          <Text
            style={{
              flex: 1,
              fontSize: DesignSystem.typography.fontSize.xl,
              fontWeight: DesignSystem.typography.fontWeight.bold,
              color: textColor,
            }}
          >
            {t("addVocabToNotebookTitle")}
          </Text>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            padding: DesignSystem.spacing.md,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Search Input */}
          <SearchInput
            value={searchVocab}
            onChangeText={setSearchVocab}
            style={{ marginBottom: DesignSystem.spacing.lg }}
          />

          {/* Search Results */}
          <SearchResults
            searchQuery={searchVocab}
            isSearching={searchLoading}
            searchResults={searchResults}
            onAddToNotebook={handleAddToNotebook}
            isAddingVocab={isAddingVocab}
          />
        </ScrollView>
      </ContainerCustom>
    </KeyboardAvoidingView>
  );
}

export default CreateVocab;
