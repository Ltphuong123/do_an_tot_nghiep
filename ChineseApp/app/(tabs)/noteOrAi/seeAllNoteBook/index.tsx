import { DesignSystem } from "@/constants/designSystem";

import { ContainerCustom } from "@/components/shared/containerCustom";
import { useLanguageContext } from "@/contexts/languageContext";
import { useLoadingContext } from "@/contexts/loadingContext";
import { useSnackbar } from "@/contexts/snackbarContext";
import { getMyNoteBook } from "@/services/notebook";
import { useNotebookStore } from "@/store/useNotebookStore";
import { INoteBook } from "@/types/notebook.type";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, RefreshControl, View } from "react-native";
import ModalDeleteNotebook from "../components/modalDeleteNotebook";
import EmptyState from "./components/EmptyState";
import FilterChips from "./components/FilterChips";
import Header from "./components/Header";
import NotebookListItem from "./components/NotebookListItem";

export default function SeeAllNotebook() {
  const { startLoading, stopLoading, isLoading } = useLoadingContext();
  const { showSnackbar } = useSnackbar();
  const { t } = useLanguageContext();

  const params = useLocalSearchParams();
  const [filteredNotebooks, setFilteredNotebooks] = useState<INoteBook[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const categoryTitle = (params.title as string) || t("personalSection");
  const [activeFilter, setActiveFilter] = useState<string>(categoryTitle);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [idNotebookToDelete, setIdNotebookToDelete] = useState<string>("");

  const {
    personalNotebook,
    freeNotebook,
    premiumNotebook,
    setPersonalNotebook,
  } = useNotebookStore();

  useEffect(() => {
    applyFilter(categoryTitle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryTitle]);

  // Ensure filtered list updates when store data or active filter changes
  useEffect(() => {
    applyFilter(activeFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [personalNotebook, freeNotebook, premiumNotebook, activeFilter]);

  const applyFilter = (filter: string) => {
    switch (filter) {
      case t("personalSection"):
        setFilteredNotebooks(personalNotebook);
        break;
      case t("freeSection"):
        setFilteredNotebooks(freeNotebook);
        break;
      case t("premiumSection"):
        setFilteredNotebooks(premiumNotebook);
        break;
      default:
        break;
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    applyFilter(activeFilter);
    setRefreshing(false);
  };

  const handleNotebookPress = (notebook: INoteBook) => {
    router.push({
      pathname: `/notebookDetail/[id]` as any,
      params: {
        id: notebook.id,
        returnTo: "/noteOrAi/seeAllNoteBook",
        title: activeFilter,
        name: notebook.name,
      },
    });
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    applyFilter(filter);
  };

  const refreshNotebooks = async () => {
    try {
      const res = await getMyNoteBook();
      if (res.success) {
        console.log("Refresh notebooks:", res.data);
        setPersonalNotebook(res.data);
      }
    } catch (err) {
      // silent fail here, parent will show snackbar if needed
      console.warn("Failed to refresh notebooks", err);
    }
  };

  const confirmDeleteNotebook = async (notebookId: string) => {
    setShowDeleteConfirm(true);
    setIdNotebookToDelete(notebookId);
  };

  return (
    <ContainerCustom variant="background" scrollable={false}>
      <Header title={t("allNotebooksTitle")} />
      <FilterChips activeFilter={activeFilter} onChange={handleFilterChange} />
      <FlatList
        data={filteredNotebooks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NotebookListItem
            notebook={item}
            onPress={handleNotebookPress}
            isDeleteIcon={activeFilter === t("personalSection")}
            onDeletePress={confirmDeleteNotebook}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={["#4A90E2"]}
            tintColor="#4A90E2"
          />
        }
        ItemSeparatorComponent={() => (
          <View style={{ height: DesignSystem.spacing.md }} />
        )}
        ListEmptyComponent={<EmptyState />}
        contentContainerStyle={
          filteredNotebooks.length === 0
            ? { flex: 1 }
            : { paddingHorizontal: DesignSystem.spacing.md }
        }
        showsVerticalScrollIndicator={false}
      />
      <ModalDeleteNotebook
        visible={showDeleteConfirm}
        onDismiss={() => setShowDeleteConfirm(false)}
        idNotebookDelete={idNotebookToDelete}
        startLoading={startLoading}
        stopLoading={stopLoading}
        isLoading={isLoading}
        showSnackbar={showSnackbar}
        refreshNotebooks={refreshNotebooks}
      />
    </ContainerCustom>
  );
}
