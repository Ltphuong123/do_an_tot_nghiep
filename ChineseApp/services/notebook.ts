import { IMeta, IResponseSuccess } from "@/types/common.type";
import {
  INoteBook,
  INotebookDetailFromTempResponse,
  INotebookResponse,
  INotebookSyncResponse,
  INoteBookVocabItem,
  INotebookVocabResponse,
  IVocabulary,
  IVocabularyReview,
} from "@/types/notebook.type";
import axios from "./index";

//gọi API thật ở đây

export const getMyNoteBook = async (
  premium?: boolean,
  search?: string
): Promise<IResponseSuccess<INoteBook[]>> => {
  const response = await axios.get("/notebooks/my", {
    requireAuth: true,
    params: {
      premium,
      search,
    },
  });
  return response.data;
};

export const getSystemNoteBook = async (
  premium?: boolean,
  search?: string
): Promise<
  IResponseSuccess<{ data: INoteBook[]; meta: IMeta; success: boolean }>
> => {
  const response = await axios.get("/notebooks/system", {
    requireAuth: true,
    params: {
      premium,
      search,
    },
  });
  return response.data;
};

export const createNoteBook = async (
  name: string
): Promise<IResponseSuccess<INotebookResponse>> => {
  const response = await axios.post(
    "/notebooks",
    { name },
    {
      requireAuth: true,
    }
  );
  return response.data;
};

export const deleteNoteBook = async (
  notebookId: string
): Promise<IResponseSuccess<{ id: string }>> => {
  const response = await axios.delete(`/notebooks/${notebookId}`, {
    requireAuth: true,
  });
  return response.data;
};

export const getNoteBookDeatail = async (
  notebookId: string,
  page: number = 1,
  limit: number = 20,
  status?: string
): Promise<IResponseSuccess<INotebookVocabResponse>> => {
  const response = await axios.get(`/notebooks/${notebookId}/vocab`, {
    requireAuth: true,
    params: {
      page,
      limit,
      status,
    },
  });
  return response.data;
};

export const searchVocab = async (
  vocab: string
): Promise<{
  success: boolean;
  message: string;
  data: { data: IVocabulary[]; meta: IMeta };
}> => {
  const response = await axios.get(`/vocabularies`, {
    requireAuth: true,
    params: {
      search: vocab,
    },
  });
  return response.data;
};

export const addVocabToNotebook = async (
  notebooksId: string,
  vocabId: string,
  status?: string
): Promise<IResponseSuccess<{ newTotalVocabCount: number }>> => {
  const res = await axios.post(
    `/notebooks/${notebooksId}/vocabularies`,
    { vocabIds: [vocabId], status },
    {
      requireAuth: true,
    }
  );
  return res.data;
};

export const removeVocabFromNotebook = async (
  notebooksId: string,
  vocabId: string
): Promise<IResponseSuccess<{ newTotalVocabCount: number }>> => {
  const res = await axios.delete(`/notebooks/${notebooksId}/vocabularies`, {
    data: { vocabIds: [vocabId] },
    requireAuth: true,
  });
  return res.data;
};

export const updateStatusVocab = async (
  vocabId: string,
  nootebookId: string,
  status: string
): Promise<IResponseSuccess<null>> => {
  const response = await axios.put(
    `/notebooks/${nootebookId}/vocabularies/${vocabId}/status`,
    {
      status,
    },
    {
      requireAuth: true,
    }
  );
  return response.data;
};

export const renameNotebook = async (notebookId: string, newName: string) => {
  console.log("Renaming notebook:", notebookId, "to", newName);
  const response = await axios.put(
    `/notebooks/${notebookId}`,
    { name: newName },
    {
      requireAuth: true,
    }
  );
  console.log("Rename response:", response.data);
  return response.data;
};

export const getNotBookDetailFromTemplate = async (
  templateId: string,
  page?: number,
  limit?: number
): Promise<IResponseSuccess<INotebookDetailFromTempResponse>> => {
  const response = await axios.get(`/notebooks/template/${templateId}/copy`, {
    requireAuth: true,
    params: {
      page,
      limit,
    },
  });
  console.log("Template detail response:", response.data);
  return response.data;
};

export const updateStatusVocabInNotebookSystem = async (
  vocabId: string,
  notebookIds: string,
  status: string
): Promise<IResponseSuccess<null>> => {
  const response = await axios.put(
    `/user/vocabularies/${vocabId}/status`,
    {
      status,
      notebookIds: [notebookIds],
    },
    {
      requireAuth: true,
    }
  );
  return response.data;
};

export const getNotebookStatus = async (
  status: string
): Promise<
  IResponseSuccess<{ vocabularies: INoteBookVocabItem[]; total: number }>
> => {
  console.log("Fetching notebook status for:", status);
  const response = await axios.get(`/user/vocabularies`, {
    requireAuth: true,
    params: {
      status: status.toLowerCase(),
    },
  });
  return response.data;
};

export const checkChangesToSync = async (
  notebookId: string
): Promise<IResponseSuccess<INotebookSyncResponse>> => {
  const response = await axios.get(`/notebooks/${notebookId}/sync`, {
    requireAuth: true,
  });
  return response.data;
};

export const syncNotebook = async (
  notebookId: string
): Promise<IResponseSuccess<{ message: string }>> => {
  const response = await axios.post(
    `/notebooks/${notebookId}/sync`,
    {},
    {
      requireAuth: true,
    }
  );
  return response.data;
};

export const getVocabReview = async (
  notebookId: string
): Promise<IResponseSuccess<{ vocabularies: IVocabularyReview[] }>> => {
  const response = await axios.get(
    `notebooks/${notebookId}/vocabularies/random-unlearned`,
    {
      requireAuth: true,
    }
  );
  console.log("Fetched vocab review data:", response.data);
  return response.data;
};
