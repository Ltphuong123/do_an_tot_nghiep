import {
  updateStatusVocab,
  updateStatusVocabInNotebookSystem,
} from "@/services/notebook";

export const updateVocabStatusCommon = async (
  vocabId: string,
  notebookId: string,
  status: string,
  isFromAdminBool: boolean
) => {
  if (isFromAdminBool) {
    const response = await updateStatusVocabInNotebookSystem(
      vocabId,
      notebookId,
      status
    );
    return response;
  } else {
    // Sử dụng API thông thường
    const response = await updateStatusVocab(vocabId, notebookId, status);
    return response;
  }
};
