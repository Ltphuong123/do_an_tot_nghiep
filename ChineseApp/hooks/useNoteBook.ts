import {
  addVocabToNotebook,
  createNoteBook,
  deleteNoteBook,
  getMyNoteBook,
  getNotebookStatus,
  getSystemNoteBook,
  getVocabReview,
  removeVocabFromNotebook,
  renameNotebook,
  searchVocab,
  syncNotebook,
} from "@/services/notebook";
import { getNotebookDetailCommon } from "@/utils/notebookDetail";
import { updateVocabStatusCommon } from "@/utils/updateStatus";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Query keys
export const notebookKeys = {
  all: ["notebooks"] as const,
  lists: () => [...notebookKeys.all, "list"] as const,
  list: (filters: { premium?: boolean; search?: string }) =>
    [...notebookKeys.lists(), filters] as const,
  myNotebooks: (filters: { premium?: boolean; search?: string }) =>
    [...notebookKeys.all, "my", filters] as const,
  systemNotebooks: (filters: { premium?: boolean; search?: string }) =>
    [...notebookKeys.all, "system", filters] as const,
  details: () => [...notebookKeys.all, "detail"] as const,
  detail: (id: string, page: number, limit: number, status?: string) =>
    [...notebookKeys.details(), id, page, limit, status] as const,
  vocabularies: (id: string) =>
    [...notebookKeys.all, "vocabularies", id] as const,
  searchVocab: (query: string) =>
    [...notebookKeys.all, "searchVocab", query] as const,
  notebookStatus: (status: string) =>
    [...notebookKeys.all, "status", status] as const,
  vocabReview: (notebookId: string) =>
    [...notebookKeys.all, "vocabReview", notebookId] as const,
};

// ========== FETCH MY NOTEBOOKS ==========
export function useMyNotebooks(premium?: boolean, search?: string) {
  return useQuery({
    queryKey: notebookKeys.myNotebooks({ premium, search }),
    queryFn: async () => {
      const response = await getMyNoteBook(premium, search);
      return response.data;
    },
  });
}

// ========== FETCH SYSTEM NOTEBOOKS ==========
export function useSystemNotebooks(premium?: boolean, search?: string) {
  return useQuery({
    queryKey: notebookKeys.systemNotebooks({ premium, search }),
    queryFn: async () => {
      const response = await getSystemNoteBook(premium, search);
      return response.data;
    },
  });
}

// ========== FETCH NOTEBOOK STATUS ==========
export function useNotebookStatus(status: string) {
  return useQuery({
    queryKey: notebookKeys.notebookStatus(status),
    queryFn: async () => {
      const response = await getNotebookStatus(status);
      return response.data;
    },
  });
}

// ========== FETCH NOTEBOOK DETAIL COMMON ==========
export function useNotebookDetailCommon(
  notebookId: string,
  page: number,
  limit: number,
  isFromAdminBool: boolean,
  status?: string
) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: notebookKeys.detail(
      notebookId,
      page,
      limit,
      status || (isFromAdminBool ? "admin" : "user")
    ),
    queryFn: async () => {
      const result = await getNotebookDetailCommon(
        notebookId,
        page,
        limit,
        isFromAdminBool,
        status
      );
      console.log("Fetched notebook detail:", result);

      // Check if this is an admin template that created a new copy
      if (isFromAdminBool) {
        // Check if there's a message indicating a new copy was created
        const response = result as any;
        console.log("Notebook detail response:", response.message);
        console.log(
          response.message.includes("Đã tạo bản sao mới của sổ tay.")
        );
        if (
          response.message &&
          response.message.includes("Đã tạo bản sao mới của sổ tay.")
        ) {
          // Invalidate notebook status queries to refresh counts
          console.log(
            "Invalidating notebook status queries due to new copy creation."
          );

          queryClient.invalidateQueries({
            queryKey: notebookKeys.notebookStatus("chưa thuộc"),
          });
          queryClient.invalidateQueries({
            queryKey: ["notebooks", "status"],
          });
        }
      }

      return result.data;
    },
    enabled: !!notebookId,
  });
}

// ========== SEARCH VOCAB ==========
export function useSearchVocab(vocab: string) {
  return useQuery({
    queryKey: notebookKeys.searchVocab(vocab),
    queryFn: async () => {
      const response = await searchVocab(vocab);
      return response.data;
    },
    enabled: !!vocab.trim(),
  });
}

// ========== CREATE NOTEBOOK MUTATION ==========
export function useCreateNotebook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (name: string) => {
      const response = await createNoteBook(name);
      return response;
    },
    onSuccess: () => {
      // Invalidate my notebooks to refetch
      queryClient.invalidateQueries({ queryKey: notebookKeys.myNotebooks({}) });
    },
  });
}

// ========== DELETE NOTEBOOK MUTATION ==========
export function useDeleteNotebook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notebookId: string) => {
      const response = await deleteNoteBook(notebookId);
      return { notebookId, ...response };
    },
    onSuccess: (data, notebookId) => {
      // Remove from cache
      queryClient.invalidateQueries({ queryKey: notebookKeys.details() });
      // Invalidate my notebooks
      queryClient.invalidateQueries({ queryKey: notebookKeys.myNotebooks({}) });
    },
  });
}

// ========== RENAME NOTEBOOK MUTATION ==========
export function useRenameNotebook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { notebookId: string; newName: string }) => {
      const response = await renameNotebook(params.notebookId, params.newName);
      return { ...params, ...response };
    },
    onSuccess: (data, variables) => {
      // Invalidate my notebooks
      queryClient.invalidateQueries({ queryKey: notebookKeys.myNotebooks({}) });
    },
  });
}

// ========== ADD VOCAB TO NOTEBOOK MUTATION ==========
export function useAddVocabToNotebook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      notebooksId: string;
      vocabId: string;
      status?: string;
    }) => {
      const response = await addVocabToNotebook(
        params.notebooksId,
        params.vocabId,
        params.status
      );
      return { ...params, ...response };
    },
    onSuccess: (data, variables) => {
      // Invalidate detail to refetch vocabularies
      queryClient.invalidateQueries({ queryKey: notebookKeys.details() });
      // Invalidate vocabularies
      queryClient.invalidateQueries({
        queryKey: notebookKeys.vocabularies(variables.notebooksId),
      });
    },
  });
}

// ========== REMOVE VOCAB FROM NOTEBOOK MUTATION ==========
export function useRemoveVocabFromNotebook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { notebooksId: string; vocabId: string }) => {
      const response = await removeVocabFromNotebook(
        params.notebooksId,
        params.vocabId
      );
      return { ...params, ...response };
    },
    onSuccess: (data, variables) => {
      // Invalidate detail to refetch vocabularies
      queryClient.invalidateQueries({ queryKey: notebookKeys.details() });
      // Invalidate vocabularies
      queryClient.invalidateQueries({
        queryKey: notebookKeys.vocabularies(variables.notebooksId),
      });
    },
  });
}

// ========== UPDATE VOCAB STATUS MUTATION ==========
export function useUpdateVocabStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      vocabId: string;
      notebookId: string;
      status: string;
      isFromAdminBool: boolean;
      originalNotebookId?: string;
    }) => {
      console.log("Updating vocab status with params:", params);
      const response = await updateVocabStatusCommon(
        params.vocabId,
        params.notebookId,
        params.status,
        params.isFromAdminBool
      );
      console.log("Update response:", response);
      return { ...params, ...response };
    },
    onSuccess: (data, variables) => {
      // Invalidate all detail queries for this notebookId to ensure status updates are reflected
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === "notebooks" &&
          query.queryKey[1] === "detail" &&
          (query.queryKey[2] === variables.notebookId ||
            (variables.originalNotebookId !== undefined &&
              query.queryKey[2] === variables.originalNotebookId)),
      });
      // Invalidate vocabularies to refetch
      queryClient.invalidateQueries({
        queryKey: notebookKeys.vocabularies(variables.notebookId),
      });
      if (variables.originalNotebookId) {
        queryClient.invalidateQueries({
          queryKey: notebookKeys.vocabularies(variables.originalNotebookId),
        });
      }
      // Invalidate notebook status queries to update counts
      queryClient.invalidateQueries({ queryKey: ["notebooks", "status"] });
    },
  });
}

// ========== SYNC NOTEBOOK MUTATION ==========
export function useSyncNotebook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notebookId: string) => {
      const response = await syncNotebook(notebookId);
      return { notebookId, ...response };
    },
    onSuccess: (data, notebookId) => {
      // Invalidate detail queries for this notebook to refetch updated vocabularies
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === "notebooks" &&
          query.queryKey[1] === "detail" &&
          query.queryKey[2] === notebookId,
      });
      // Invalidate vocabularies
      queryClient.invalidateQueries({
        queryKey: notebookKeys.vocabularies(notebookId),
      });
      // Invalidate system notebooks to update counts
      queryClient.invalidateQueries({
        queryKey: notebookKeys.systemNotebooks({}),
      });

      // Invalidate all notebook status queries to refresh vocab counts for all statuses
      queryClient.invalidateQueries({
        queryKey: notebookKeys.notebookStatus("yêu thích"),
      });
      queryClient.invalidateQueries({
        queryKey: notebookKeys.notebookStatus("đã thuộc"),
      });
      queryClient.invalidateQueries({
        queryKey: notebookKeys.notebookStatus("chưa thuộc"),
      });
      queryClient.invalidateQueries({
        queryKey: notebookKeys.notebookStatus("không chắc"),
      });
      // Also invalidate all status queries pattern
      queryClient.invalidateQueries({
        queryKey: ["notebooks", "status"],
      });
    },
  });
}

// ========== REFRESH NOTEBOOK STATUS MUTATION ==========
export function useRefreshNotebookStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (status: string = "chua_thuoc") => {
      const response = await getNotebookStatus(status);
      return { status, ...response };
    },
    onSuccess: (data, status) => {
      // Invalidate notebook status queries to refetch updated counts
      queryClient.invalidateQueries({
        queryKey: notebookKeys.notebookStatus(status),
      });
      // Also invalidate all status queries to ensure consistency
      queryClient.invalidateQueries({
        queryKey: ["notebooks", "status"],
      });
    },
  });
}

// ========== FETCH VOCAB REVIEW ==========
export function useVocabReview(notebookId: string) {
  return useQuery({
    queryKey: notebookKeys.vocabReview(notebookId),
    queryFn: async () => {
      const response = await getVocabReview(notebookId);
      return response.data.vocabularies;
    },
    enabled: !!notebookId,
    refetchOnMount: "always",
    staleTime: 0,
  });
}
