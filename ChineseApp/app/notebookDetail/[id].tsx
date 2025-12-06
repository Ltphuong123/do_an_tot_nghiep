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
import { useNotebookDetailCommon } from "@/hooks/useNoteBook";
import {
  INotebookDetailFromTempResponse,
  INoteBookVocabItem,
  INotebookVocabResponse,
} from "@/types/notebook.type";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, View } from "react-native";
import { Icon, Text } from "react-native-paper";
import EmptyState from "../(tabs)/noteOrAi/seeAllNoteBook/components/EmptyState";
import Action from "./components/action";
import ModalEditName from "./components/modalEditName";
import VocabCard from "./components/vocabCard";

function NoteBookDetail() {
  const { id, returnTo, title, name, commentId, isFromAdmin } =
    useLocalSearchParams();
  const { theme } = useThemeContext();
  const textColor = getTextColor(theme, "primary");
  const { t } = useLanguageContext();
  const { startLoading, stopLoading } = useLoadingContext();
  console.log("commentId in NoteBookDetail:", commentId);

  const [confirmEditName, setConfirmEditName] = useState<boolean>(false);
  const [notebookName, setNotebookName] = useState<string>(
    (name as string) || ""
  );

  const { showSnackbar } = useSnackbar();
  const LIMIT = 20;

  const [page, setPage] = useState<number>(1);
  const [allVocabularies, setAllVocabularies] = useState<any[]>([]);

  useEffect(() => {
    setPage(1);
    setAllVocabularies([]);
  }, [id]);

  const isFromAdminBool = isFromAdmin === "true";

  const commonDetailQuery = useNotebookDetailCommon(
    id as string,
    page,
    LIMIT,
    isFromAdminBool
  );

  const {
    data: vocabData,
    isLoading,
    isRefetching,
    refetch,
  } = commonDetailQuery;

  console.log("NotebookDetail vocabData:", vocabData);

  useEffect(() => {
    if (vocabData) {
      if ("notebook" in vocabData && vocabData.notebook?.vocabularies?.data) {
        // Handle template response
        const templateData = vocabData as INotebookDetailFromTempResponse;
        console.log(
          "Template vocabularies data received for page",
          page,
          "count:",
          templateData.notebook.vocabularies.data.length
        );
        setAllVocabularies((prev) => {
          if (page === 1) {
            return templateData.notebook.vocabularies.data;
          }
          // Prevent duplicates
          const existingIds = new Set(prev.map((v) => v.id));
          const newVocabs = templateData.notebook.vocabularies.data.filter(
            (v: any) => !existingIds.has(v.id)
          );
          return [...prev, ...newVocabs];
        });
      } else if ("vocabularies" in vocabData && vocabData.vocabularies) {
        // Handle normal notebook response
        const normalData = vocabData as INotebookVocabResponse;
        console.log(
          "Vocabularies data received for page",
          page,
          "count:",
          normalData.vocabularies.length
        );
        setAllVocabularies((prev) => {
          if (page === 1) {
            return normalData.vocabularies;
          }
          // Prevent duplicates
          const existingIds = new Set(prev.map((v) => v.id));
          const newVocabs = normalData.vocabularies.filter(
            (v: any) => !existingIds.has(v.id)
          );
          return [...prev, ...newVocabs];
        });
      }
    }
  }, [vocabData, page]);

  // Memoize hasMore
  const hasMore = React.useMemo(() => {
    if (!vocabData) return false;
    if ("notebook" in vocabData && vocabData.notebook?.vocabularies?.data) {
      // For template, check if current page has full LIMIT items
      const currentData = vocabData.notebook.vocabularies.data;
      return currentData ? currentData.length === LIMIT : false;
    } else if (
      "vocabularies" in vocabData &&
      vocabData.vocabularies &&
      "pagination" in vocabData
    ) {
      const pagination = vocabData.pagination;
      if (!pagination) return allVocabularies.length === 20;
      return page < pagination.totalPages;
    }
    return false;
  }, [vocabData, page, allVocabularies.length, LIMIT]);

  const handleLoadMore = useCallback(() => {
    console.log("Handle load more triggered: ", isRefetching, hasMore);
    if (isRefetching || !hasMore || isLoading) return;
    console.log("Loading more vocabularies...", page + 1);
    setPage((prev) => prev + 1);
  }, [isRefetching, hasMore, isLoading, page]);

  const handleRefresh = useCallback(() => {
    console.log("Refreshing vocabularies...");
    setPage(1);
    refetch();
  }, [refetch]);

  const vocabularies = allVocabularies;

  const handleVocabPress = (item: INoteBookVocabItem) => {
    try {
      const serialized = encodeURIComponent(JSON.stringify(item));
      router.push({
        pathname: "/notebookDetail/vocab",
        params: {
          item: serialized,
          id,
          isFromAdmin: isFromAdminBool ? "true" : "false",
          newNoteId:
            isFromAdminBool && vocabData && "notebook" in vocabData
              ? (vocabData as INotebookDetailFromTempResponse).notebook?.id
              : undefined,
        },
      });
    } catch {
      // ignore serialization errors
    }
  };

  const handleGoBack = () => {
    if (typeof returnTo === "string") {
      router.replace({
        pathname: returnTo as any,
        params: title ? { title } : undefined,
      });
    } else if (Array.isArray(returnTo) && returnTo.length > 0) {
      router.push({
        pathname: returnTo[0] as any,
        params: title ? { title } : undefined,
      });
    } else {
      router.back();
    }
  };

  const renderContent = () => {
    return (
      <FlatList
        data={vocabularies}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <VocabCard item={item} onPress={handleVocabPress} />
        )}
        contentContainerStyle={{ paddingVertical: DesignSystem.spacing.md }}
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshing={isRefetching}
        onRefresh={handleRefresh}
        ListFooterComponent={
          isLoading && page > 1 ? (
            <View style={{ padding: 12 }}>
              <ActivityIndicator />
            </View>
          ) : null
        }
      />
    );
  };

  return (
    <ContainerCustom variant="background" scrollable={false}>
      {/* Loading Overlay */}
      {isLoading && page === 1 && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 10,
          }}
        >
          <ActivityIndicator size="large" color="#4A90E2" />
        </View>
      )}

      {/* Custom Header */}
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
        <Pressable onPress={handleGoBack}>
          <Icon
            source="arrow-left"
            size={24}
            color={theme === "light" ? "#000" : "#FFF"}
          />
        </Pressable>

        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Text
            style={{
              fontSize: DesignSystem.typography.fontSize.xl,
              fontWeight: DesignSystem.typography.fontWeight.bold,
              color: textColor,
            }}
          >
            {notebookName || t("notebookDetails")}
          </Text>
          <Pressable onPress={() => setConfirmEditName(true)}>
            <Icon
              source="pencil"
              size={20}
              color={theme === "light" ? "#000" : "#FFF"}
            />
          </Pressable>
        </View>

        {!isFromAdminBool && (
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/notebookDetail/createVocab",
                params: { notebookId: id },
              })
            }
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#4A90E2",
            }}
          >
            <Icon source="plus" size={24} color="#FFF" />
          </Pressable>
        )}
      </View>

      {vocabularies && vocabularies.length > 0 && (
        <Action
          noteId={id as string}
          isFromAdminBool={isFromAdminBool}
          newNoteId={
            isFromAdminBool &&
            vocabData &&
            "notebook" in vocabData &&
            vocabData.notebook?.id
              ? (vocabData as INotebookDetailFromTempResponse).notebook?.id
              : undefined
          }
        />
      )}

      {vocabularies && vocabularies.length > 0 ? (
        renderContent()
      ) : (
        <EmptyState />
      )}

      <ModalEditName
        visible={confirmEditName}
        notebookId={id as string}
        onDismiss={() => setConfirmEditName(false)}
        startLoading={startLoading}
        stopLoading={stopLoading}
        showSnackbar={showSnackbar}
        onRenameSuccess={(newName) => setNotebookName(newName)}
      />
    </ContainerCustom>
  );
}

export default NoteBookDetail;
