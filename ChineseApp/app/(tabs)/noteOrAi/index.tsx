import { ContainerCustom } from "@/components/shared/containerCustom";
import { useLanguageContext } from "@/contexts/languageContext";
import { useLoadingContext } from "@/contexts/loadingContext";
import { useSnackbar } from "@/contexts/snackbarContext";
import {
  useMyNotebooks,
  useRefreshNotebookStatus,
  useSyncNotebook,
  useSystemNotebooks,
} from "@/hooks/useNoteBook";
import { useNotebookStore } from "@/store/useNotebookStore";
import { useTitleTranslateOrAi } from "@/store/useTitleNoteOrAi";
import { useUserStore } from "@/store/useUserStore";
import { INoteBook } from "@/types/notebook.type";
import { router } from "expo-router";

import React, { useCallback, useEffect, useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";
import AILessonCreator from "./components/aILessonCreator";
import ModalCreateNotebook from "./components/modalCreateNotebook";
import ModalDeleteNotebook from "./components/modalDeleteNotebook";
import NotebookHeader from "./components/notebookHeader";
import NotebookSection from "./components/notebookSection";
import VocabStatsCard from "./components/vocabStatsCard";

export default function NotebookScreen() {
  const { title, setTitle } = useTitleTranslateOrAi();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [idNotebookToDelete, setIdNotebookToDelete] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{
    personal: INoteBook[];
    free: INoteBook[];
    premium: INoteBook[];
  }>({ personal: [], free: [], premium: [] });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [hasAutoSynced, setHasAutoSynced] = useState(false);
  const [hasRefreshedStatus, setHasRefreshedStatus] = useState(false);
  const { startLoading, stopLoading, isLoading } = useLoadingContext();
  const { showSnackbar } = useSnackbar();
  const { t } = useLanguageContext();
  const { user } = useUserStore();
  const {
    personalNotebook,
    freeNotebook,
    premiumNotebook,
    notebookLoaded,
    setPersonalNotebook,
    setFreeNotebook,
    setPremiumNotebook,
    clearNotebookCache,
  } = useNotebookStore();

  // React Query hooks
  const {
    data: myNotebooks,
    refetch: refetchMy,
    isLoading: myNotebooksLoading,
  } = useMyNotebooks();
  const {
    data: systemNotebooks,
    refetch: refetchSystem,
    isLoading: systemNotebooksLoading,
  } = useSystemNotebooks();
  const syncNotebookMutation = useSyncNotebook();
  const refreshNotebookStatusMutation = useRefreshNotebookStatus();

  console.log("System Notebooks:", systemNotebooks);

  // Search hooks
  const { data: searchMyNotebooks, isLoading: searchMyNotebooksLoading } =
    useMyNotebooks(undefined, searchQuery);
  const {
    data: searchSystemNotebooks,
    isLoading: searchSystemNotebooksLoading,
  } = useSystemNotebooks(undefined, searchQuery);

  // Update search results when search data changes
  useEffect(() => {
    if (searchQuery.trim()) {
      const newSearchResults = {
        personal: searchMyNotebooks || [],
        free: (searchSystemNotebooks?.data || []).filter(
          (nb) => nb.is_premium === false
        ),
        premium: (searchSystemNotebooks?.data || []).filter(
          (nb) => nb.is_premium === true
        ),
      };
      setSearchResults(newSearchResults);
    } else {
      setSearchResults({ personal: [], free: [], premium: [] });
    }
  }, [searchMyNotebooks, searchSystemNotebooks, searchQuery]);

  // Update store when data changes
  useEffect(() => {
    if (myNotebooks) {
      setPersonalNotebook(myNotebooks);
    }
  }, [myNotebooks, setPersonalNotebook]);

  // Update store with system notebooks
  useEffect(() => {
    if (systemNotebooks?.data) {
      const freeNotebooks = systemNotebooks.data.filter(
        (notebook) => !notebook.is_premium
      );
      const premiumNotebooks = systemNotebooks.data.filter(
        (notebook) => notebook.is_premium
      );

      setFreeNotebook(freeNotebooks);
      setPremiumNotebook(premiumNotebooks);
    }
  }, [systemNotebooks, setFreeNotebook, setPremiumNotebook]);

  const handleFetchNotebooks = useCallback(async () => {
    setIsRefreshing(true);
    try {
      // Refetch both queries
      await Promise.all([refetchMy(), refetchSystem()]);
    } catch (error: any) {
      console.error("Error refetching notebooks:", error);
      showSnackbar(error.message || t("errorLoadingNotebooks"), "error");
    } finally {
      setIsRefreshing(false);
    }
  }, [refetchMy, refetchSystem, showSnackbar, t]);

  const handleSyncNotebooks = useCallback(
    async (silent: boolean = false) => {
      setIsSyncing(true);
      try {
        // Lấy tất cả sổ tay miễn phí và cao cấp (do admin tạo)
        let notebooksToSync = [
          ...(freeNotebook || []),
          ...(premiumNotebook || []),
        ];

        const hasActiveSubscription =
          user.subscription?.name !== "Gói Mặc Định";
        if (!hasActiveSubscription) {
          notebooksToSync = notebooksToSync.filter(
            (notebook) => !notebook.is_premium
          );
        }

        if (notebooksToSync.length === 0) {
          if (!silent) {
            showSnackbar(
              t("noNotebooksToSync") || "Không có sổ tay nào để đồng bộ",
              "info"
            );
          }
          return;
        }

        // Import service để lấy notebook ID từ template
        const { getNotBookDetailFromTemplate } = await import(
          "@/services/notebook"
        );

        // Với mỗi sổ tay admin, cần lấy notebook.id từ template trước
        const syncPromises = notebooksToSync.map(async (notebook) => {
          try {
            // Gọi API để lấy hoặc tạo bản copy từ template
            const detailResponse = await getNotBookDetailFromTemplate(
              notebook.id,
              1,
              1
            );
            const actualNotebookId = detailResponse.data.notebook.id;

            // Sync với notebook.id thật
            return await syncNotebookMutation.mutateAsync(actualNotebookId);
          } catch (error) {
            console.error(`Error syncing notebook ${notebook.name}:`, error);
            throw error;
          }
        });

        await Promise.all(syncPromises);

        if (!silent) {
          showSnackbar(
            t("syncNotebookSuccess") || "Đồng bộ sổ tay thành công",
            "success"
          );
        } else {
          console.log("Auto-sync completed successfully");
        }
      } catch (error: any) {
        console.error("Error syncing notebooks:", error);
        if (!silent) {
          showSnackbar(
            error.message ||
              t("syncNotebookError") ||
              "Đã xảy ra lỗi khi đồng bộ",
            "error"
          );
        }
      } finally {
        setIsSyncing(false);
      }
    },
    [
      freeNotebook,
      premiumNotebook,
      syncNotebookMutation,
      showSnackbar,
      t,
      user.subscription,
    ]
  );

  // Fetch notebooks when the logged-in user changes. Also clear notebooks on logout.
  useEffect(() => {
    if (!user || user?.id === "") {
      // Clear notebook lists when there's no user (logged out)
      clearNotebookCache();
      setHasAutoSynced(false);
      setHasRefreshedStatus(false);
      return;
    }

    // Chỉ fetch khi chưa load và đang ở tab notebook
    if (!notebookLoaded && title === "notebook") {
      handleFetchNotebooks();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, title, notebookLoaded]);

  // Tự động sync lần đầu khi vào tab notebook
  useEffect(() => {
    if (
      !hasAutoSynced &&
      title === "notebook" &&
      notebookLoaded &&
      (freeNotebook.length > 0 || premiumNotebook.length > 0)
    ) {
      console.log("Auto-syncing notebooks on first load...");
      setHasAutoSynced(true);
      handleSyncNotebooks(true); // silent = true (không hiển thị thông báo)
    }
  }, [
    hasAutoSynced,
    title,
    notebookLoaded,
    freeNotebook.length,
    premiumNotebook.length,
    handleSyncNotebooks,
  ]);

  // Tự động refresh notebook status lần đầu khi vào tab notebook
  useEffect(() => {
    if (
      !hasRefreshedStatus &&
      title === "notebook" &&
      user?.id &&
      user.id !== ""
    ) {
      console.log("Auto-refreshing notebook status on first load...");
      setHasRefreshedStatus(true);

      // Refresh all status types
      const statusesToRefresh = [
        "yêu thích",
        "đã thuộc",
        "chưa thuộc",
        "không chắc",
      ];
      statusesToRefresh.forEach(async (status) => {
        try {
          await refreshNotebookStatusMutation.mutateAsync(status);
        } catch (error) {
          console.error(`Error refreshing status ${status}:`, error);
        }
      });
    }
  }, [hasRefreshedStatus, title, user?.id, refreshNotebookStatusMutation]);

  const handleViewChange = (view: "notebook" | "ai-lesson") => {
    setTitle(view);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleNotebookPress = (notebook: INoteBook) => {
    router.push({
      pathname: `/notebookDetail/[id]` as any,
      params: {
        id: notebook.id,
        returnTo: "noteOrAi",
        name: notebook.name,
        isFromAdmin: notebook.user_id ? "false" : "true",
      },
    });
  };

  const handleCreateNewNotebook = async () => {
    console.log("Create new notebook");
    setShowCreateModal(true);
  };

  const confirmDeleteNotebook = async (notebookId: string) => {
    setShowDeleteConfirm(true);
    setIdNotebookToDelete(notebookId);
  };

  return (
    <ContainerCustom variant="background" scrollable={false}>
      <NotebookHeader
        currentView={title}
        onViewChange={handleViewChange}
        onSearch={handleSearch}
        searchQuery={searchQuery}
        onRefresh={handleFetchNotebooks}
        isRefreshing={isRefreshing}
        onSync={() => handleSyncNotebooks(false)}
        isSyncing={isSyncing}
      />

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {title === "notebook" ? (
          user?.id === "" ? (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                paddingTop: 100,
              }}
            >
              <Text style={{ fontSize: 16, marginBottom: 12 }}>
                {t("loginToContinue")}
              </Text>
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/auth/login",
                    params: { returnUrl: "/noteOrAi", activeView: "notebook" },
                  })
                }
                style={{
                  backgroundColor: "#007AFF",
                  paddingVertical: 10,
                  paddingHorizontal: 18,
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "600" }}>
                  {t("login")}
                </Text>
              </TouchableOpacity>
              <View style={{ height: 20 }} />
            </View>
          ) : (
            <>
              {/* Vocab Stats Card */}
              <VocabStatsCard />

              {/* Personal Notebooks Section */}
              <NotebookSection
                title={t("personalSection")}
                notebooks={
                  searchQuery.trim() ? searchResults.personal : personalNotebook
                }
                onSeeAll={!searchQuery.trim() && personalNotebook.length > 0}
                onNotebookPress={handleNotebookPress}
                showCreateButton={!searchQuery.trim()}
                onCreateNew={handleCreateNewNotebook}
                onConfirmDelete={confirmDeleteNotebook}
                iconDelete={true}
                isLoading={
                  searchQuery.trim()
                    ? searchMyNotebooksLoading
                    : myNotebooksLoading
                }
              />

              {/* Free Notebooks Section */}
              <NotebookSection
                title={t("freeSection")}
                notebooks={
                  searchQuery.trim() ? searchResults.free : freeNotebook
                }
                onSeeAll={!searchQuery.trim()}
                onNotebookPress={handleNotebookPress}
                isLoading={
                  searchQuery.trim()
                    ? searchSystemNotebooksLoading
                    : systemNotebooksLoading
                }
              />

              {/* Premium Notebooks Section */}
              <NotebookSection
                title={t("premiumSection")}
                notebooks={
                  searchQuery.trim() ? searchResults.premium : premiumNotebook
                }
                onSeeAll={!searchQuery.trim()}
                onNotebookPress={handleNotebookPress}
                user={user}
                isLoading={
                  searchQuery.trim()
                    ? searchSystemNotebooksLoading
                    : systemNotebooksLoading
                }
              />

              <View style={{ height: 20 }} />
            </>
          )
        ) : user?.id === "" ? (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              paddingTop: 100,
            }}
          >
            <Text style={{ fontSize: 16, marginBottom: 12 }}>
              Đăng nhập để tiếp tục{" "}
            </Text>
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/auth/login",
                  params: { returnUrl: "/noteOrAi", activeView: "ai-lesson" },
                })
              }
              style={{
                backgroundColor: "#007AFF",
                paddingVertical: 10,
                paddingHorizontal: 18,
                borderRadius: 8,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "600" }}>
                Đăng nhập
              </Text>
            </TouchableOpacity>
            <View style={{ height: 20 }} />
          </View>
        ) : (
          <>
            {/* AI Lesson Creator */}
            <AILessonCreator
              isLoading={isLoading}
              startLoading={startLoading}
              stopLoading={stopLoading}
              showSnackbar={showSnackbar}
            />
            <View style={{ height: 20 }} />
          </>
        )}
      </ScrollView>

      {/* Create Notebook Modal */}
      <ModalCreateNotebook
        visible={showCreateModal}
        onDismiss={() => setShowCreateModal(false)}
        startLoading={startLoading}
        stopLoading={stopLoading}
        showSnackbar={showSnackbar}
        refreshNotebooks={handleFetchNotebooks}
      />

      <ModalDeleteNotebook
        visible={showDeleteConfirm}
        onDismiss={() => setShowDeleteConfirm(false)}
        idNotebookDelete={idNotebookToDelete}
        startLoading={startLoading}
        stopLoading={stopLoading}
        isLoading={isLoading}
        showSnackbar={showSnackbar}
        refreshNotebooks={handleFetchNotebooks}
      />
    </ContainerCustom>
  );
}
