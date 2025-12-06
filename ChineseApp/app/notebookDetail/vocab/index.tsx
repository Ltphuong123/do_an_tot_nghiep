import { ContainerCustom } from "@/components/shared/containerCustom";
import {
  DesignSystem,
  getBackgroundColor,
  getTextColor,
} from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { useLoadingContext } from "@/contexts/loadingContext";
import { useSnackbar } from "@/contexts/snackbarContext";
import { useThemeContext } from "@/contexts/themeContext";
import {
  useRefreshNotebookStatus,
  useUpdateVocabStatus,
} from "@/hooks/useNoteBook";
import { INoteBookVocabItem } from "@/types/notebook.type";
import * as Clipboard from "expo-clipboard";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { Icon, Text } from "react-native-paper";
import { ActionButtons } from "./components/ActionButtons";
import ModalDeleteVocab from "./components/modalDeleteVocab";
import { VocabDetailsCard } from "./components/VocabDetailsCard";
import { VocabHeader } from "./components/VocabHeader";
import { VocabImage } from "./components/VocabImage";
import { VocabMainCard } from "./components/VocabMainCard";
export default function VocabDetailScreen() {
  const { item, id, isFromAdmin, newNoteId } = useLocalSearchParams();
  const { theme } = useThemeContext();
  const { t } = useLanguageContext();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const { startLoading, stopLoading } = useLoadingContext();
  const { showSnackbar } = useSnackbar();

  console.log("Vocab params:", id);

  const updateVocabStatusMutation = useUpdateVocabStatus();
  const refreshNotebookStatusMutation = useRefreshNotebookStatus();

  const textColor = getTextColor(theme, "primary");

  const [vocab, setVocab] = useState<INoteBookVocabItem | null>(() => {
    if (typeof item === "string") {
      try {
        return JSON.parse(decodeURIComponent(item));
      } catch {
        return null;
      }
    }
    return null;
  });

  console.log("Vocab detail:", vocab);
  if (!vocab) {
    return (
      <ContainerCustom variant="background" scrollable={false}>
        <View
          style={{
            paddingTop: 50,
            paddingHorizontal: DesignSystem.spacing.md,
            paddingBottom: DesignSystem.spacing.sm,
            backgroundColor: getBackgroundColor(theme, "primary"),
          }}
        >
          <Pressable onPress={() => router.back()}>
            <Icon
              source="arrow-left"
              size={24}
              color={theme === "light" ? "#000" : "#FFF"}
            />
          </Pressable>
        </View>
        <View style={{ padding: 24 }}>
          <Text style={{ color: textColor }}>{t("vocabNotFound")}</Text>
        </View>
      </ContainerCustom>
    );
  }

  const handleCopy = async (text: string) => {
    await Clipboard.setStringAsync(text);
    showSnackbar(t("copiedMsg"), "success");
  };

  const handleBookmark = () => {
    if (!vocab) return;

    const oldStatus = vocab.status;
    const newStatus = vocab.status === "yêu thích" ? "chưa thuộc" : "yêu thích";

    // Update local state immediately for better UX
    setVocab({ ...vocab, status: newStatus });

    updateVocabStatusMutation.mutate(
      {
        vocabId: vocab.id,
        notebookId:
          isFromAdmin === "true" && newNoteId
            ? (newNoteId as string)
            : (id as string),
        status: newStatus,
        isFromAdminBool: isFromAdmin === "true",
        originalNotebookId: id as string,
      },
      {
        onSuccess: (data) => {
          // Refresh status counts để cập nhật số lượng ngay lập tức
          refreshNotebookStatusMutation
            .mutateAsync(newStatus)
            .catch((error) => {
              console.error(`Error refreshing ${newStatus} status:`, error);
            });
        },
        onError: (error: any) => {
          // Revert local state if there was an error
          setVocab({ ...vocab, status: oldStatus });
          showSnackbar(error.message || t("statusUpdateError"), "error");
        },
      }
    );
  };

  const handleConfirmDelete = () => {
    setShowDeleteConfirm(true);
  };

  return (
    <ContainerCustom variant="background" scrollable={false}>
      {/* Header */}
      <VocabHeader
        onDelete={handleConfirmDelete}
        deleteDisable={id === undefined || isFromAdmin === "true"}
      />

      <ScrollView
        style={{
          padding: DesignSystem.spacing.md,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Vocabulary Image */}
        <VocabImage imageUrl={vocab!.image_url} />

        {/* Main Word Display */}
        <VocabMainCard
          hanzi={vocab!.hanzi}
          pinyin={vocab!.pinyin}
          meaning={vocab!.meaning}
        />

        {/* Action Buttons */}
        <ActionButtons
          onCopy={() => handleCopy(vocab!.hanzi)}
          onBookmark={handleBookmark}
          isBookmarked={vocab!.status === "yêu thích"}
          bookmarkDisabled={id === undefined}
        />

        {/* Details Section */}
        <VocabDetailsCard
          wordTypes={vocab!.word_types}
          levels={vocab!.level}
          status={vocab!.status}
          notes={vocab!.notes}
        />
      </ScrollView>
      <ModalDeleteVocab
        visible={showDeleteConfirm}
        showSnackbar={showSnackbar}
        startLoading={startLoading}
        stopLoading={stopLoading}
        vocabId={vocab!.id}
        notebookId={id as string}
        onDismiss={() => setShowDeleteConfirm(false)}
      />
    </ContainerCustom>
  );
}
